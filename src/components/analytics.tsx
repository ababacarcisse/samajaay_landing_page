"use client";

import { useEffect } from "react";
import { AnalyticsConsent } from "./analytics-consent";

declare global {
  interface Window {
    samajaayAnalytics?: {
      hasConsent: () => boolean;
      track: (
        name: "cta_click",
        data: { placement: string; destination: string },
      ) => void;
    };
  }
}

/** A host adapter, or optional GA4 integration, that only receives consented clicks. */
export function AnalyticsBridge() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[data-cta-location]")
          : null;
      const adapter = window.samajaayAnalytics;
      if (!target || !adapter) return;
      try {
        if (adapter.hasConsent())
          adapter.track("cta_click", {
            placement: target.dataset.ctaLocation || "unknown",
            destination: target.href,
          });
      } catch {
        /* A failed analytics adapter must never interrupt navigation. */
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  return <AnalyticsConsent />;
}
