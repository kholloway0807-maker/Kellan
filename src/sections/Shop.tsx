import { Reveal } from '../components/Reveal';
import { ArrowIcon } from '../components/icons';
import { PRODUCTS } from '../data/products';

export function Shop() {
  return (
    <section id="shop" className="bg-white section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-3">The Collection</p>
              <h2 className="text-4xl font-bold tracking-tight text-nova-ink sm:text-5xl">
                Wear Your Coordinates.
              </h2>
            </div>
            <a
              href="https://novaly.us"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost shrink-0"
            >
              Full Store <ArrowIcon />
            </a>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={0.07 * i}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-2xl border border-nova-border bg-nova-cream transition-shadow hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-nova-bone">
                  <img
                    src={p.image}
                    alt={`NOVA ${p.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-nova-ink backdrop-blur-sm">
                    {p.price}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="font-mono text-[10px] tracking-widest text-nova-muted">{p.coords}</p>
                  <h3 className="mt-1 text-base font-bold text-nova-ink">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-nova-muted">{p.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-nova-ink transition-gap group-hover:gap-2.5">
                    Shop Now <ArrowIcon />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
