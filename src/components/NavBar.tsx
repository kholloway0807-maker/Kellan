"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-green shadow-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="Kellan Holloway Lawncare home">
            <img src="/assets/logo.svg" alt="Kellan Holloway Lawncare logo" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-gold border-b-2 border-gold pb-0.5"
                    : "text-cream hover:text-gold"
                )}
              >
                {label}
              </Link>
            ))}
            <a
              href="tel:+13095550100"
              className="ml-2 rounded-md bg-gold px-4 py-2 text-sm font-bold text-green hover:bg-gold-light transition-colors"
              aria-label="Call us at 309-555-0100"
            >
              (309) 555-0100
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-cream p-2"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden bg-green-dark border-t border-green-light px-4 pb-4"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "block py-3 text-base font-medium border-b border-green-light last:border-0",
                pathname === href ? "text-gold" : "text-cream hover:text-gold"
              )}
            >
              {label}
            </Link>
          ))}
          <a
            href="tel:+13095550100"
            className="mt-3 block w-full rounded-md bg-gold px-4 py-3 text-center text-base font-bold text-green hover:bg-gold-light transition-colors"
          >
            Call (309) 555-0100
          </a>
        </nav>
      )}
    </header>
  );
}
