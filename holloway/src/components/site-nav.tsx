"use client";

import { useState } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header
      className="sticky top-0 border-b border-line bg-surface/85 backdrop-blur-md"
      style={{ zIndex: "var(--z-nav)" }}
    >
      {/* desktop bar is 68px tall and stays on one line at lg */}
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-8 px-5 md:px-8">
        <a
          href="#top"
          className="shrink-0 text-[15px] font-semibold tracking-tight text-ink"
        >
          Holloway <span className="font-normal text-muted">Marketing</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-[14px] text-muted transition-colors duration-200 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] md:inline-block"
          >
            Get a free audit
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-line p-2.5 text-ink md:hidden"
          >
            {open ? <X size={18} weight="regular" /> : <List size={18} weight="regular" />}
          </button>
        </div>
      </div>

      {/* mobile: single column drawer, matches the <768px fallback for the bar */}
      {open && (
        <motion.div
          initial={reduce ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden border-t border-line bg-surface md:hidden"
        >
          <div className="flex flex-col gap-1 px-5 py-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-[15px] text-muted"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-accent px-5 py-3 text-center text-[15px] font-medium text-accent-ink"
            >
              Get a free audit
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
