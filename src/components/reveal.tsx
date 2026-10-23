"use client";

import { LazyMotion, useReducedMotion } from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import type { ReactNode } from "react";

const loadFeatures = () =>
  import("./motion-features").then((module) => module.default);

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
  const reduced = useReducedMotion();
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionDiv
        className={className}
        initial={false}
        whileInView={
          reduced
            ? undefined
            : {
                transform: ["translateY(16px)", "translateY(0px)"],
                opacity: [0.72, 1],
              }
        }
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </MotionDiv>
    </LazyMotion>
  );
}
