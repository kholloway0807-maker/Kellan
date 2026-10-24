import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { TeeMockup } from '../components/TeeMockup';
import { useCart } from '../components/Cart';
import { PRODUCTS, Product, SIZES, Size } from '../data/products';

function ProductCard({ product }: { product: Product }) {
  const { add, priceOf, inStock } = useCart();
  const [size, setSize] = useState<Size>('M');
  const available = inStock(product, size);

  return (
    <article className="group flex h-full flex-col">
      <div
        className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-sc-line ${
          product.colorway === 'noir' ? 'bg-sc-ink' : 'bg-[#1b1a18]'
        }`}
      >
        <TeeMockup
          print={product.print}
          colorway={product.colorway}
          className="w-[78%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.3em] text-sc-stone">{product.course}</span>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-2xl leading-tight">{product.name}</h3>
        <span className="font-serif text-xl">${priceOf(product)}</span>
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-sc-stone">{product.blurb}</p>

      <fieldset className="mt-5">
        <legend className="sr-only">Size for {product.name}</legend>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              aria-pressed={size === s}
              className={`h-11 min-w-[44px] cursor-pointer border px-3 text-xs tracking-widest transition-colors duration-200 ${
                size === s ? 'border-sc-cream bg-sc-cream text-sc-black' : 'border-sc-line text-sc-stone hover:border-sc-cream/60 hover:text-sc-cream'
              }`}
            >
              <span className={inStock(product, s) ? '' : 'line-through opacity-50'}>{s}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <button
        onClick={() => add(product, size)}
        disabled={!available}
        className="btn-ghost mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {available ? `Add to bag — ${size}` : `Sold out — ${size}`}
      </button>
    </article>
  );
}

export function Collection() {
  return (
    <section id="collection" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-8 md:py-32">
      <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Drop 01</p>
          <h2 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl">
            Dressed for <em className="italic">the long table.</em>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-sc-stone">
          Four heavyweight tees in noir and crème. Cut boxy, printed with the script and the seal — made to be worn
          from the first course to the last call.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} className="h-full">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
