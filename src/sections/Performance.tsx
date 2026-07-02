import { Reveal } from '../components/Reveal';

const MATERIALS = [
  {
    label: 'Ring-Spun Cotton',
    sub: '100% natural',
    desc: 'Tightly wound fibers for a softer hand-feel and stronger fabric that resists pilling.',
  },
  {
    label: 'Garment Dye',
    sub: 'Batch-dyed',
    desc: 'Each piece is dyed after construction, giving it a unique, faded character from day one.',
  },
  {
    label: 'Heavy Fleece',
    sub: '400gsm weight',
    desc: 'Substantial without being stiff — the kind of weight that drapes well and holds structure.',
  },
  {
    label: 'Relaxed Fit',
    sub: 'Oversized cut',
    desc: 'Designed to be worn loose. Proportioned so it looks intentional, not just big.',
  },
];

export function Performance() {
  return (
    <section id="craft" className="bg-nova-cream section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow mb-4">The Craft</p>
            <h2 className="mx-auto max-w-2xl text-4xl font-bold leading-tight tracking-tight text-nova-ink sm:text-5xl">
              Inside Our Formula
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-nova-muted">
              Four material decisions that make NOVA feel different the moment you put it on.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MATERIALS.map((m, i) => (
            <Reveal key={m.label} delay={0.08 * i}>
              <div className="card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-nova-bone text-xl">
                  {['🧵', '🎨', '🧱', '📐'][i]}
                </div>
                <p className="eyebrow mb-1">{m.sub}</p>
                <h3 className="text-base font-bold text-nova-ink">{m.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-nova-muted">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
