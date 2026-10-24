import { useEffect, useState } from 'react';
import { asset } from '../data/products';
import { useCart } from './Cart';

const LINKS = [
  { label: 'Collection', href: '#collection' },
  { label: 'La Maison', href: '#maison' },
  { label: 'Le Menu', href: '#menu' },
  { label: 'The Club', href: '#club' },
];

export function Navbar() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || menu ? 'border-b border-sc-line bg-sc-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 md:h-20">
        <a href="#top" className="flex items-center gap-3" aria-label="Saint. Clermont home">
          <img src={asset('brand/crest-256.png')} alt="" className="h-9 w-9 md:h-11 md:w-11" />
          <span className="hidden font-serif text-lg tracking-[0.2em] sm:inline">SAINT. CLERMONT</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] font-medium uppercase tracking-[0.3em] text-sc-stone transition-colors hover:text-sc-cream"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpen(true)}
            className="flex min-h-[44px] cursor-pointer items-center gap-2 px-3 text-[11px] font-medium uppercase tracking-[0.3em] hover:text-sc-stone"
            aria-label={`Open bag, ${count} items`}
          >
            Bag <span className="font-serif text-base tracking-normal">({count})</span>
          </button>
          <button
            onClick={() => setMenu((m) => !m)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menu}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d={menu ? 'M4 4l12 12M16 4L4 16' : 'M2 6h16M2 14h16'} stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </nav>

      {menu && (
        <div className="border-t border-sc-line px-4 pb-6 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenu(false)}
              className="block border-b border-sc-line py-4 font-serif text-2xl"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
