import { Reveal } from '../components/Reveal';
import { useCart } from '../components/Cart';
import { formatPrice } from '../lib/shopify';

const COURSES = ['Apéritif', 'Entrée', 'Plat Principal', 'Fromage', 'Dessert', 'Digestif'];

/** The live collection presented as a printed dinner menu card. */
export function Menu() {
  const { products } = useCart();
  if (products.length === 0) return null;

  return (
    <section id="menu" className="scroll-mt-20 px-4 py-24 sm:px-8 md:py-32">
      <Reveal className="mx-auto max-w-2xl border border-sc-cream/30 p-2">
        <div className="border border-sc-cream/20 px-6 py-14 text-center sm:px-14">
          <p className="eyebrow">Ce soir</p>
          <h2 className="mt-4 font-gothic text-5xl sm:text-6xl">Le Menu</h2>
          <div className="mx-auto my-10 h-px w-24 bg-sc-cream/40" />

          <ol className="space-y-10">
            {products.slice(0, COURSES.length).map((p, i) => (
              <li key={p.id}>
                <p className="text-[10px] uppercase tracking-[0.4em] text-sc-stone">{COURSES[i]}</p>
                <a href="#collection" className="mt-2 block font-serif text-2xl transition-colors hover:text-sc-stone sm:text-3xl">
                  {p.title}
                </a>
                {p.variants[0] && (
                  <p className="mt-1 font-serif italic text-sc-stone">{formatPrice(p.variants[0].price, p.currency)}</p>
                )}
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
