import { FormEvent, useState } from 'react';
import { Reveal } from '../components/Reveal';
import { ArrowIcon } from '../components/icons';

const FOOTER = {
  Shop: ['Hoodies', 'Crewnecks', 'Tees', 'New Arrivals'],
  Company: ['About', 'Lookbook', 'Stockists', 'Contact'],
  Help: ['Shipping', 'Returns', 'Size Guide', 'Track Order'],
};

export function Cta() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <>
      {/* Email capture – dark band */}
      <section className="bg-nova-ink section-pad">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow mb-4 !text-white/50">Join NOVA</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Subscribe To Our Emails
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/60">
              Be the first to know about new collections and exclusive offers.
              Take the risk — create your legacy.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            {sent ? (
              <div className="mx-auto mt-8 inline-block rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm text-white/90">
                You're on the list — welcome to NOVA. ✦
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1.5 pl-5 backdrop-blur-sm"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <button type="submit" className="btn-primary-dark shrink-0 py-2 px-5 text-[13px]">
                  Subscribe <ArrowIcon />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-nova-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.6fr_repeat(3,1fr)]">
            <div>
              <span className="text-sm font-bold tracking-[0.25em] text-nova-ink">NOVA</span>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-nova-muted">
                Premium garment-dyed apparel for those who take the risk.
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-wider text-nova-muted/60">
                37.7335° N, 119.6376° W
              </p>
            </div>
            {Object.entries(FOOTER).map(([group, items]) => (
              <div key={group}>
                <p className="eyebrow mb-4">{group}</p>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm text-nova-muted transition-colors hover:text-nova-ink">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-nova-border pt-8 text-xs text-nova-muted sm:flex-row">
            <span>© {new Date().getFullYear()} NOVA Apparel. All rights reserved. Powered by Shopify.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-nova-ink">Privacy Policy</a>
              <a href="#" className="hover:text-nova-ink">Terms of Service</a>
              <a href="#" className="hover:text-nova-ink">Refund Policy</a>
              <a href="#" className="hover:text-nova-ink">Contact Information</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
