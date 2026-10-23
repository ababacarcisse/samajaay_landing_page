"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { APP_URL, navigation } from "@/lib/config";
import { BrandLogo } from "./ui";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <BrandLogo />
        <nav className="desktop-navigation" aria-label="Navigation principale">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={APP_URL}
          className="header-cta"
          data-cta-location="header"
          aria-label="Accéder à l’application SamaJaay"
        >
          <span className="cta-long" aria-hidden="true">
            Accéder à l’application
          </span>
          <span className="cta-short" aria-hidden="true">
            Accéder
          </span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <button
          ref={toggle}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav
          className="mobile-navigation container"
          id="mobile-menu"
          aria-label="Navigation mobile"
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
