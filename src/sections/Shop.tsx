import { SceneSection } from '../components/SceneSection';
import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';
import { ArrowIcon } from '../components/icons';
import { PRODUCTS } from '../data/products';

export function Shop() {
  return (
    <SceneSection
      id="shop"
      camera={[0, 0, 12]}
      bloomIntensity={0.5}
      scene={null}
      className="!min-h-[100svh] !items-start py-28"
      fallback="radial-gradient(90% 90% at 50% 0%, rgba(34,211,238,0.10), rgba(255,91,58,0.05) 55%, rgba(5,5,5,0) 75%)"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Reveal>
            <Eyebrow num="05" label="The collection" className="justify-center" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Wear your <span className="gradient-text">coordinates.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
              Three pieces. Three places worth the leap. Garment-dyed, heavyweight, and built to
              outlast the moment that made them.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={0.1 + i * 0.08}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="glass group block overflow-hidden rounded-3xl transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <img
                    src={p.image}
                    alt={`NOVA ${p.name} — ${p.motif} back print`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {p.price}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-medium text-white">{p.name}</h3>
                  </div>
                  <p className="mt-1 font-mono text-[11px] tracking-wider text-white/35">{p.coords}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{p.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-colors group-hover:text-nova-cyan">
                    Shop now <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <a href="https://novaly.us" target="_blank" rel="noreferrer" className="pill-ghost text-[15px]">
              View the full store <ArrowIcon />
            </a>
          </div>
        </Reveal>
      </div>
    </SceneSection>
  );
}
