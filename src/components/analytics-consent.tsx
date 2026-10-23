"use client";

import Script from "next/script";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";

type Consent = "pending" | "accepted" | "refused";
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const CONSENT_KEY = "samajaay.analytics-consent.v1";
const CONSENT_CHANGED = "samajaay:analytics-consent-changed";
const OPEN_PREFERENCES = "samajaay:open-analytics-preferences";
const DENIED_CONSENT = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

/** An explicit empty or malformed public ID keeps Google's scripts disabled. */
export function validMeasurementId(value: string | undefined): string {
  const id = value?.trim() ?? "";
  return /^G-[A-Z0-9]{4,20}$/.test(id) ? id : "";
}

const MEASUREMENT_ID = validMeasurementId(
  // Public web stream supplied by the owner. An explicit empty override disables it.
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-2E8X0XGQX2",
);

let memoryConsent: Consent | undefined;
let runtimeMeasurementId = "";
let runtimeConsent: Consent = "pending";
const runtimeListeners = new Set<() => void>();

function readConsent(): Consent {
  if (memoryConsent) return memoryConsent;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "refused" ? value : "pending";
  } catch {
    return "pending";
  }
}

function writeConsent(value: Exclude<Consent, "pending">) {
  // The in-memory choice also works when the browser blocks localStorage.
  memoryConsent = value;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Persistence is optional; consent is still respected for this visit.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED));
}

function subscribeToConsent(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) {
      memoryConsent = undefined;
      onChange();
    }
  };
  window.addEventListener(CONSENT_CHANGED, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_CHANGED, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const getServerConsent = (): Consent => "pending";
const getServerRuntime = () => false;
const getClientHydrated = () => true;
const subscribeToHydration = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    getClientHydrated,
    getServerRuntime,
  );
}

function subscribeToRuntime(onChange: () => void) {
  runtimeListeners.add(onChange);
  return () => {
    runtimeListeners.delete(onChange);
  };
}

function disableMeasurement(id: string, disabled: boolean) {
  window[`ga-disable-${id}`] = disabled;
}

function measurementUrl(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value, window.location.origin);
    return url.protocol === "https:" || url.protocol === "http:"
      ? `${url.origin}${url.pathname}`
      : "";
  } catch {
    return "";
  }
}

function prepareMeasurement(id: string) {
  disableMeasurement(id, false);
  window.dataLayer ??= [];
  window.gtag ??= function () {
    // Google expects the standard array-like command used by its own snippet.
    // eslint-disable-next-line prefer-rest-params -- Match Google's documented gtag command queue format.
    window.dataLayer?.push(arguments);
  };

  if (runtimeMeasurementId !== id) {
    window.gtag("consent", "default", DENIED_CONSENT);
    window.gtag("consent", "update", {
      ...DENIED_CONSENT,
      analytics_storage: "granted",
    });
    window.gtag("js", new Date());
    window.gtag("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: measurementUrl(window.location.href),
      page_referrer: measurementUrl(document.referrer),
    });
    runtimeMeasurementId = id;
    runtimeConsent = "accepted";
    runtimeListeners.forEach((listener) => listener());
  } else if (runtimeConsent !== "accepted") {
    window.gtag("consent", "update", {
      ...DENIED_CONSENT,
      analytics_storage: "granted",
    });
    runtimeConsent = "accepted";
  }
}

/** Only first-party, JavaScript-accessible analytics cookies can be removed here. */
function clearMeasurementCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => /^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name));
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const domains = new Set(["", hostname]);
  for (let index = 0; index < parts.length - 1; index++) {
    domains.add(`.${parts.slice(index).join(".")}`);
    domains.add(parts.slice(index).join("."));
  }
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const paths = new Set(["/"]);
  for (let index = 1; index <= pathParts.length; index++) {
    paths.add(`/${pathParts.slice(0, index).join("/")}`);
  }
  for (const name of cookieNames) {
    for (const domain of domains) {
      for (const path of paths) {
        document.cookie = `${name}=; Max-Age=0; path=${path};${domain ? ` domain=${domain};` : ""} SameSite=Lax`;
      }
    }
  }
}

function stopMeasurement(id: string) {
  // Set Google's documented opt-out before notifying an already-loaded tag.
  disableMeasurement(id, true);
  if (runtimeMeasurementId === id && runtimeConsent !== "refused") {
    window.gtag?.("consent", "update", DENIED_CONSENT);
    runtimeConsent = "refused";
    // A withdrawal also discards approved events still waiting for the script.
    const queue = window.dataLayer;
    if (queue) {
      for (let index = queue.length - 1; index >= 0; index--) {
        const entry = queue[index];
        if (
          typeof entry === "object" &&
          entry !== null &&
          "0" in entry &&
          entry[0] === "event"
        ) {
          queue.splice(index, 1);
        }
      }
    }
  }
  clearMeasurementCookies();
}

export function AnalyticsPreferencesButton() {
  const hydrated = useHydrated();
  if (!MEASUREMENT_ID || !hydrated) return null;
  return (
    <button
      className="sj-analytics-preferences"
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES))}
    >
      Préférences de mesure
    </button>
  );
}

/** Basic consent mode: no Google tag or analytics request before an explicit yes. */
export function AnalyticsConsent() {
  const id = MEASUREMENT_ID;
  const hydrated = useHydrated();
  const consent = useSyncExternalStore(
    subscribeToConsent,
    readConsent,
    getServerConsent,
  );
  const prepared = useSyncExternalStore(
    subscribeToRuntime,
    () => Boolean(id && runtimeMeasurementId === id),
    getServerRuntime,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const pageViewSentRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    const previousAdapter = window.samajaayAnalytics;
    const adapter: NonNullable<Window["samajaayAnalytics"]> = {
      hasConsent: () => readConsent() === "accepted",
      track: (name, data) => {
        if (readConsent() !== "accepted") return;
        window.gtag?.("event", name, {
          placement: data.placement,
          destination: measurementUrl(data.destination),
          send_to: id,
        });
      },
    };
    window.samajaayAnalytics = adapter;
    return () => {
      disableMeasurement(id, true);
      if (window.samajaayAnalytics === adapter) {
        window.samajaayAnalytics = previousAdapter;
      }
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (consent === "accepted") prepareMeasurement(id);
    else stopMeasurement(id);
  }, [id, consent]);

  useEffect(() => {
    if (!id) return;
    const openPreferences = () => {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setPreferencesOpen(true);
      window.requestAnimationFrame(() => headingRef.current?.focus());
    };
    window.addEventListener(OPEN_PREFERENCES, openPreferences);
    return () => window.removeEventListener(OPEN_PREFERENCES, openPreferences);
  }, [id]);

  // With JavaScript unavailable there is no tag, so no inert consent UI is shown.
  if (!id || !hydrated) return null;

  const closePreferences = () => {
    setPreferencesOpen(false);
    returnFocusRef.current?.focus();
  };
  const chooseConsent = (value: Exclude<Consent, "pending">) => {
    // Enforce the decision synchronously, including clicks before React rerenders.
    if (value === "accepted") prepareMeasurement(id);
    else stopMeasurement(id);
    writeConsent(value);
    closePreferences();
  };

  return (
    <>
      {consent === "accepted" && prepared && (
        <Script
          id="samajaay-google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
          strategy="afterInteractive"
          onReady={() => {
            if (readConsent() !== "accepted" || pageViewSentRef.current) return;
            pageViewSentRef.current = true;
            window.gtag?.("event", "page_view", {
              send_to: id,
              page_title: document.title,
              page_location: measurementUrl(window.location.href),
              page_referrer: measurementUrl(document.referrer),
            });
          }}
        />
      )}
      {(consent === "pending" || preferencesOpen) && (
        <aside
          className="sj-analytics-panel"
          aria-labelledby="analytics-consent-title"
          onKeyDown={(event) => {
            if (event.key === "Escape" && consent !== "pending") {
              closePreferences();
            }
          }}
        >
          <div className="sj-analytics-copy">
            <h2 id="analytics-consent-title" ref={headingRef} tabIndex={-1}>
              Un mot sur la mesure d’audience
            </h2>
            <p>
              Avec ton accord, Google Analytics mesure les visites et les clics
              vers SamaJaay. Tu peux accepter, refuser ou changer d’avis à tout
              moment.
            </p>
            {consent !== "pending" && (
              <p className="sj-analytics-current">
                Choix actuel : mesure {consent === "accepted" ? "acceptée" : "refusée"}.
              </p>
            )}
          </div>
          <div className="sj-analytics-actions">
            <button type="button" className="sj-analytics-choice" onClick={() => chooseConsent("accepted")}>
              Accepter
            </button>
            <button type="button" className="sj-analytics-choice" onClick={() => chooseConsent("refused")}>
              Refuser
            </button>
          </div>
          {consent !== "pending" && (
            <button type="button" className="sj-analytics-close" onClick={closePreferences} aria-label="Fermer les préférences de mesure">
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </aside>
      )}
    </>
  );
}
