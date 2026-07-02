import { Reveal } from '../components/Reveal';

const ROWS = [
  { feature: 'Garment-Dyed Finish',    nova: true,  fast: false, basics: false },
  { feature: '400gsm Heavy Fleece',    nova: true,  fast: false, basics: false },
  { feature: 'Relaxed Oversized Fit',  nova: true,  fast: false, basics: true  },
  { feature: 'Keeps Shape After Wash', nova: true,  fast: false, basics: true  },
  { feature: 'No Filler Blends',       nova: true,  fast: true,  basics: false },
  { feature: 'Under $50',              nova: true,  fast: true,  basics: false },
];

const Check = ({ ok }: { ok: boolean }) =>
  ok ? (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-nova-ink text-white text-sm">✓</span>
  ) : (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-nova-border text-nova-muted text-sm">✕</span>
  );

export function Comparison() {
  return (
    <section className="bg-white section-pad">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow mb-4">Us vs. Others</p>
            <h2 className="text-4xl font-bold tracking-tight text-nova-ink sm:text-5xl">
              How We Stack Up
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-nova-muted">
              We built NOVA to be the hoodie that actually holds up — in quality and price.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-nova-border">
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-nova-border bg-nova-cream px-6 py-4 text-xs font-bold uppercase tracking-widest text-nova-muted">
              <span>Feature</span>
              <span className="text-center text-nova-ink">NOVA</span>
              <span className="text-center">Fast Fashion</span>
              <span className="text-center">Basics Brand</span>
            </div>

            {ROWS.map((r, i) => (
              <div
                key={r.feature}
                className={`grid grid-cols-4 items-center px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-nova-cream/40'}`}
              >
                <span className="font-medium text-nova-ink">{r.feature}</span>
                <span className="flex justify-center"><Check ok={r.nova} /></span>
                <span className="flex justify-center"><Check ok={r.fast} /></span>
                <span className="flex justify-center"><Check ok={r.basics} /></span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
