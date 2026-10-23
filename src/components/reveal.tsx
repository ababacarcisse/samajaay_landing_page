"use client";

import { useAnimate } from "motion/react-mini";
import { useEffect, type ReactNode } from "react";

/** Content is visible in the server HTML, including when JavaScript is disabled. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    const element = scope.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      !element ||
      preference.matches ||
      !("IntersectionObserver" in window) ||
      typeof element.animate !== "function"
    ) return;

    let controls: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (preference.matches) return;
        controls = animate(
          element,
          {
            transform: ["translateY(16px)", "translateY(0px)"],
            opacity: [0.72, 1],
          },
          { duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] },
        );
      },
      { threshold: 0.12 },
    );
    const respectPreference = () => {
      if (!preference.matches) return;
      observer.disconnect();
      controls?.complete();
    };
    observer.observe(element);
    preference.addEventListener("change", respectPreference);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", respectPreference);
      controls?.stop();
    };
  }, [animate, scope, delay]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
