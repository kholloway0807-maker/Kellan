import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'Product', href: '#orb' },
  { label: 'Solutions', href: '#performance' },
  { label: 'Pricing', href: '#terrain' },
  { label: 'Docs', href: '#cta' },
];

/** Floating glass "pill" navbar, centered at top, with a scale/blur-in on load. */
export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className={[
          'glass pointer-events-auto flex w-full max-w-3xl items-center justify-between rounded-full px-3 py-2 transition-all duration-700 ease-out md:px-4',
          mounted ? 'translate-y-0 scale-100 opacity-100 blur-0' : '-translate-y-3 scale-95 opacity-0 blur-md',
          scrolled ? 'bg-white/[0.06]' : '',
        ].join(' ')}
      >
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-2 pl-2">
          <span className="relative inline-block h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-nova-cyan to-nova-red" />
            <span className="absolute inset-0 animate-pulse-glow rounded-full bg-nova-cyan blur-[6px]" />
          </span>
          <span className="text-sm font-semibold tracking-[0.2em] text-white">NOVA</span>
        </a>

        {/* Center links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <a href="#cta" className="hidden px-3 py-1.5 text-sm text-white/75 transition-colors hover:text-white sm:inline-block">
            Sign in
          </a>
          <a href="#cta" className="pill-primary text-[13px]">
            Get started
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/70 md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="glass pointer-events-auto absolute top-16 w-[calc(100%-2rem)] max-w-3xl rounded-2xl p-2 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/[0.06]"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
