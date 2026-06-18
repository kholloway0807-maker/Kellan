import { FormEvent, useState } from 'react';
import { SceneSection } from '../components/SceneSection';
import { CtaScene } from '../scenes/CtaScene';
import { Eyebrow } from '../components/Eyebrow';
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
    <SceneSection
      id="cta"
      camera={[0, 0, 9]}
      bloomIntensity={1.25}
      scene={<CtaScene />}
      className="!min-h-[100svh] !items-stretch"
      fallback="radial-gradient(70% 90% at 50% 40%, rgba(59,130,246,0.2), rgba(255,59,0,0.1) 55%, rgba(5,5,5,0) 75%)"
    >
      <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-between py-28">
        {/* Headline + capture */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Reveal>
            <Eyebrow num="06" label="Join NOVA" className="justify-center" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-5xl font-semibold leading-[1.0] tracking-tight text-white sm:text-6xl md:text-7xl">
              Take the <span className="gradient-text">leap.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65">
              Get early access to drops, restocks, and new coordinates. Take the risk — create
              your legacy.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            {sent ? (
              <div className="glass mt-9 rounded-full px-6 py-3 text-sm text-white/90">
                You're on the list — welcome to NOVA. ✦
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="glass mt-9 flex w-full max-w-md items-center gap-2 rounded-full p-1.5 pl-5"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <button type="submit" className="pill-primary shrink-0 text-[13px]">
                  Notify me <ArrowIcon />
                </button>
              </form>
            )}
          </Reveal>
        </div>

        {/* Footer */}
        <footer className="mt-20">
          <div className="glass rounded-3xl p-8 md:p-10">
            <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-nova-cyan to-nova-red" />
                  <span className="text-sm font-semibold tracking-[0.2em] text-white">NOVA</span>
                </div>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
                  Premium garment-dyed apparel for those who take the risk.
                </p>
                <p className="mt-4 font-mono text-[11px] tracking-wider text-white/30">
                  37.7335° N, 119.6376° W
                </p>
              </div>
              {Object.entries(FOOTER).map(([group, items]) => (
                <div key={group}>
                  <div className="eyebrow mb-4">{group}</div>
                  <ul className="space-y-2.5">
                    {items.map((item) => (
                      <li key={item}>
                        <a href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
              <span>© {new Date().getFullYear()} NOVA Apparel. All rights reserved.</span>
              <div className="flex gap-6">
                <a href="#" className="transition-colors hover:text-white/80">Privacy</a>
                <a href="#" className="transition-colors hover:text-white/80">Terms</a>
                <a href="#" className="transition-colors hover:text-white/80">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SceneSection>
  );
}
