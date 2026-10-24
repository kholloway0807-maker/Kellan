import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { useCart } from '../components/Cart';
import { Product, formatPrice } from '../lib/shopify';
import { asset } from '../lib/asset';

function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  // Preselect the first in-stock variant's options.
  const initial = (product.variants.find((v) => v.available) ?? product.variants[0])?.options ?? {};
  const [selected, setSelected] = useState<Record<string, string>>(initial);

  const variant = product.variants.find((v) => product.options.every((o) => v.options[o.name] === selected[o.name]));
  const isAvailable = (name: string, value: string) =>
    product.variants.some(
      (v) => v.available && v.options[name] === value && product.options.every((o) => o.name === name || v.options[o.name] === selected[o.name])
    );
  const image = variant?.image ?? product.image?.url;

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden border border-sc-line bg-sc-ink">
        {image ? (
          <img
            src={image}
            alt={product.image?.alt ?? product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <img src={asset('brand/crest-256.png')} alt="" className="absolute inset-0 m-auto w-24 opacity-40" />
        )}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-2xl leading-tight">{product.title}</h3>
        {variant && <span className="font-serif text-xl">{formatPrice(variant.price, product.currency)}</span>}
      </div>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-sc-stone">{product.description}</p>

      {product.options.map((opt) => (
        <fieldset key={opt.name} className="mt-5">
          <legend className="eyebrow mb-2">{opt.name}</legend>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((val) => {
              const on = selected[opt.name] === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSelected((s) => ({ ...s, [opt.name]: val }))}
                  aria-pressed={on}
                  className={`h-11 min-w-[44px] cursor-pointer border px-3 text-xs tracking-widest transition-colors duration-200 ${
                    on ? 'border-sc-cream bg-sc-cream text-sc-black' : 'border-sc-line text-sc-stone hover:border-sc-cream/60 hover:text-sc-cream'
                  }`}
                >
                  <span className={isAvailable(opt.name, val) ? '' : 'line-through opacity-50'}>{val}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <button
        onClick={() => variant && add(product, variant)}
        disabled={!variant?.available}
        className="btn-ghost mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {variant?.available ? 'Add to bag' : 'Sold out'}
      </button>
    </article>
  );
}

function ComingSoon() {
  return (
    <div className="mt-16 flex flex-col items-center border border-sc-line px-6 py-20 text-center">
      <img src={asset('brand/crest-256.png')} alt="" className="h-20 w-20" />
      <p className="mt-8 font-gothic text-4xl">Coming Soon</p>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-sc-stone">
        The first collection is being set. Members get the first seat when it drops.
      </p>
      <a href="#club" className="btn-cream mt-8">Join the Club</a>
    </div>
  );
}

export function Collection() {
  const { products, status } = useCart();

  return (
    <section id="collection" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-8 md:py-32">
      <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">The Collection</p>
          <h2 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl">
            Dressed for <em className="italic">the long table.</em>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-sc-stone">
          Made to be worn from the first course to the last call.
        </p>
      </Reveal>

      {status === 'loading' ? (
        <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Loading collection">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/5] animate-pulse border border-sc-line bg-sc-ink" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <ComingSoon />
      ) : (
        <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.08} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
