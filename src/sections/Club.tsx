import { FormEvent, useState } from 'react';
import { Reveal } from '../components/Reveal';
import { asset } from '../data/products';

export function Club() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // TODO: connect to the email list provider (Klaviyo / Shopify Email).
    setError('');
    setDone(true);
  };

  return (
    <section id="club" className="scroll-mt-20 border-t border-sc-line bg-sc-ink px-4 py-24 sm:px-8 md:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">The Club</p>
        <h2 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl">
          Reserve <em className="italic">your seat.</em>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-sc-stone">
          Members hear about drops first, get the private-dinner invitations, and never pay for shipping. Seating is
          limited.
        </p>

        {done ? (
          <p className="mt-12 font-serif text-2xl italic" role="status">
            Your seat is reserved. Watch your inbox.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mx-auto mt-12 max-w-lg text-left">
            <label htmlFor="club-email" className="eyebrow">
              Email address
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="club-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'club-email-error' : undefined}
                placeholder="you@example.com"
                className="min-h-[48px] flex-1 border border-sc-line bg-transparent px-4 text-base text-sc-cream placeholder:text-sc-stone/60 focus:border-sc-cream focus:outline-none"
              />
              <button type="submit" className="btn-cream">
                Join the Club
              </button>
            </div>
            {error && (
              <p id="club-email-error" className="mt-3 text-sm text-[#e8a39a]">
                {error}
              </p>
            )}
          </form>
        )}
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-sc-line px-4 py-16 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center">
        <img src={asset('brand/crest-256.png')} alt="" className="h-16 w-16" loading="lazy" />
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.3em] text-sc-stone">
          <a href="#collection" className="hover:text-sc-cream">Collection</a>
          <a href="#maison" className="hover:text-sc-cream">La Maison</a>
          <a href="#menu" className="hover:text-sc-cream">Le Menu</a>
          <a href="#club" className="hover:text-sc-cream">The Club</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-sc-cream">Instagram</a>
        </nav>
        <p className="text-xs text-sc-stone/70">
          © {new Date().getFullYear()} Saint. Clermont Clothing · St. Tropez — St. Clermont
        </p>
      </div>
    </footer>
  );
}
