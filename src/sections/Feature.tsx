import { Reveal } from '../components/Reveal';
import { ArrowIcon } from '../components/icons';

export function Feature() {
  return (
    <section className="bg-white section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-nova-cream aspect-[4/5]">
              <img
                src={`${import.meta.env.BASE_URL}products/crewneck.jpg`}
                alt="NOVA Create Your Legacy Crewneck"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          {/* Text */}
          <div>
            <Reveal>
              <p className="eyebrow mb-4">The Collection</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-nova-ink sm:text-5xl">
                Premium Streetwear<br />
                <span className="text-nova-muted">Built For The Bold.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-base leading-relaxed text-nova-muted">
                Custom garment-dyed formula designed to give you that perfectly broken-in feel
                from the very first wear — without the wait.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <ul className="mt-6 space-y-3">
                {[
                  'Heavyweight 400gsm fleece — warm without bulk',
                  'Garment-dyed for rich, lived-in color',
                  'Relaxed oversized fit, holds shape wash after wash',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-nova-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-nova-ink text-[10px] text-white">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <a href="#shop" className="btn-primary mt-8 w-fit">
                Shop Now <ArrowIcon />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
