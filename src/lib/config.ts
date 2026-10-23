/** Verified on 2026-10-23: this origin currently serves the official Flutter app. */
const VERIFIED_APP_URL = "https://app.samajaay.com/";

function publicUrl(value: string | undefined, fallback: string): string {
  const url = new URL(value || fallback);
  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error("Public URLs must use HTTP or HTTPS.");
  }
  return url.href;
}

export const SITE_URL = publicUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://samajaay.com/",
);
const configuredAppUrl = publicUrl(
  process.env.NEXT_PUBLIC_APP_URL,
  VERIFIED_APP_URL,
);
// Preserve the verified app destination if an older hosting variable still
// points at the landing root: every CTA must open the app, including the header.
export const APP_URL =
  configuredAppUrl === SITE_URL || configuredAppUrl === "https://samajaay.com/"
    ? VERIFIED_APP_URL
    : configuredAppUrl;
export const PRIVACY_URL = "https://app.samajaay.com/#/privacy";

export const navigation = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#decouvrir", label: "L’application" },
  { href: "#groupage", label: "Groupage" },
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#faq", label: "FAQ" },
] as const;
