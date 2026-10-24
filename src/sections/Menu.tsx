import { Reveal } from '../components/Reveal';
import { PRODUCTS } from '../data/products';
import { useCart } from '../components/Cart';

/** The collection presented as a printed dinner menu card. */
export function Menu() {
  const { priceOf } = useCart();
  return (
    <section id="menu" className="scroll-mt-20 px-4 py-24 sm:px-8 md:py-32">
      <Reveal className="mx-auto max-w-2xl border border-sc-cream/30 p-2">
        <div className="border border-sc-cream/20 px-6 py-14 text-center sm:px-14">
          <p className="eyebrow">Ce soir</p>
          <h2 className="mt-4 font-gothic text-5xl sm:text-6xl">Le Menu</h2>
          <p className="mt-3 font-serif text-lg italic text-sc-stone">Collection No. 01 — Été</p>
          <div className="mx-auto my-10 h-px w-24 bg-sc-cream/40" />

          <ol className="space-y-10">
            {PRODUCTS.map((p) => (
              <li key={p.id}>
                <p className="text-[10px] uppercase tracking-[0.4em] text-sc-stone">{p.course}</p>
                <a href="#collection" className="mt-2 block font-serif text-2xl transition-colors hover:text-sc-stone sm:text-3xl">
                  {p.name}
                </a>
                <p className="mx-auto mt-1 max-w-sm font-serif italic text-sc-stone">${priceOf(p)}</p>
              </li>
            ))}
          </ol>

          <div className="mx-auto my-10 h-px w-24 bg-sc-cream/40" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-sc-stone">St. Tropez · St. Clermont</p>
        </div>
      </Reveal>
    </section>
  );
}
