"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/*
  Motion justification (MOTION_INTENSITY 5):
  entry order communicates hierarchy. Content arrives in reading order so the
  headline lands before the supporting detail. Nothing loops, nothing pins,
  nothing hijacks the scrollbar. Collapses to static under reduced motion.
*/
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      // paired with the noscript rule in layout.tsx: without JS the server
      // markup would stay at opacity 0 and the page would read as empty
      data-reveal=""
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.55,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
