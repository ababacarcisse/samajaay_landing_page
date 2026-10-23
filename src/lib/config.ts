/** Verified on 2026-10-23: this origin currently serves the official Flutter app. */
const VERIFIED_APP_URL = "https://samajaay.com/";

function publicUrl(value: string | undefined, fallback: string): string {
  const url = new URL(value || fallback);
  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error("Public URLs must use HTTP or HTTPS.");
  }
  return url.href;
}

export const APP_URL = publicUrl(
  process.env.NEXT_PUBLIC_APP_URL,
  VERIFIED_APP_URL,
);
export const SITE_URL = publicUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://samajaay.com/",
);

export const navigation = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#decouvrir", label: "L’application" },
  { href: "#groupage", label: "Groupage" },
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#faq", label: "FAQ" },
] as const;
