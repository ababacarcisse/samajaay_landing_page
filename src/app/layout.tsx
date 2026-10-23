import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { SITE_URL } from "@/lib/config";
import { productDescription } from "@/lib/content";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  // Preserve prompt text rendering on slow mobile networks; no late font swap.
  display: "optional",
  variable: "--font-manrope",
});

const title = "SamaJaay — Application de gestion commerciale au Sénégal";
const description = productDescription;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "SamaJaay",
  alternates: { canonical: SITE_URL },
  keywords: [
    "application de gestion commerciale Sénégal",
    "logiciel de gestion de stock Sénégal",
    "gestion des ventes",
    "gestion de boutique",
    "suivi des dépenses commerciales",
    "application pour commerçants sénégalais",
    "gestion commerciale pour revendeurs",
    "suivi des bénéfices",
    "organisation de groupage Alibaba Sénégal",
  ],
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: SITE_URL,
    siteName: "SamaJaay",
    title,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SamaJaay — Ton business. Tes chiffres. En toute simplicité.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#052E20",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-SN" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
