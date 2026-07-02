import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'Shop', href: '#shop' },
  { label: 'The Craft', href: '#craft' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_#E0DED7]' : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-[0.25em] text-nova-ink">NOVA</span>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-nova-muted transition-colors hover:text-nova-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://novaly.us"
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm font-medium text-nova-muted transition-colors hover:text-nova-ink sm:block"
          >
            Store
          </a>
          <a href="#shop" className="btn-primary py-2 px-4 text-[13px]">
            Shop Now
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-nova-border md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-nova-border bg-white px-4 py-2 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-nova-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
