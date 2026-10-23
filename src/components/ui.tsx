import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

const APP_CTA_URL = "https://app.samajaay.com/";

export function BrandLogo() {
  return (
    <a href="#accueil" className="brand" aria-label="SamaJaay — accueil">
      <Image
        src="/brand/logo.png"
        alt="SamaJaay"
        width={720}
        height={174}
        sizes="(max-width: 767px) 140px, 176px"
        className="brand-image"
      />
    </a>
  );
}

export function AppLink({
  children = "Accéder à l’application",
  location,
  className = "",
}: {
  children?: ReactNode;
  location: string;
  className?: string;
}) {
  return (
    <a
      href={APP_CTA_URL}
      className={`button button-primary ${className}`}
      data-cta-location={location}
    >
      <span>{children}</span>
      <ArrowUpRight size={19} aria-hidden="true" />
    </a>
  );
}

export function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`section-label${light ? " label-light" : ""}`}>
      <span aria-hidden="true" />
      {children}
    </p>
  );
}

export function PhoneMockup({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-hardware" aria-hidden="true">
        <span />
        <i />
      </div>
      <div className="phone-display">
        <Image
          src={src}
          alt={alt}
          width={572}
          height={1280}
          sizes="(max-width: 600px) 280px, 300px"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className="app-screenshot"
        />
      </div>
      <div className="phone-home" aria-hidden="true" />
    </div>
  );
}
