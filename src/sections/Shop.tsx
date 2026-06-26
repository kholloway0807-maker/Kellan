import { SceneSection } from '../components/SceneSection';
import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';
import { ArrowIcon } from '../components/icons';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

const TRUST = [
  { k: 'Garment-dyed', v: 'Lived-in colour from the first wear' },
  { k: 'Heavyweight', v: '6–9.5 oz ring-spun cotton' },
  { k: 'Ships from US', v: 'Tracked delivery in 2–4 days' },
  { k: 'Secure checkout', v: 'Apple Pay · Shop Pay · cards' },
];

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
              Pick your colour. Flip the print. <span className="gradient-text">Check out in one tap.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
              Three pieces, three places worth the leap. Choose a colourway and size below — your
              pick lands straight in the NOVA cart, ready to check out.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={0.1 + i * 0.08}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
        </div>

        {/* Trust / conversion rail */}
        <Reveal delay={0.15}>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.k} className="bg-black/20 p-5">
                <p className="text-sm font-medium text-white">{t.k}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/45">{t.v}</p>
              </div>
            ))}
          </div>
        </Reveal>

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
