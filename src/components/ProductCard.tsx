import { useState } from 'react';
import { Product, checkoutUrl } from '../data/products';
import { ArrowIcon } from './icons';

interface ProductCardProps {
  product: Product;
  /** Stagger index, used only for a tiny entrance delay hook upstream. */
  index?: number;
}

/**
 * Interactive storefront card. Visitors pick a colourway and size, flip to the
 * back print, and check out in one tap — the button is a real Shopify cart
 * permalink, so the exact variant lands in the NOVA cart at checkout.
 */
export function ProductCard({ product }: ProductCardProps) {
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | null>('M');
  const [showBack, setShowBack] = useState(false);

  const color = product.colors[colorIdx];
  const selected = color.sizes.find((s) => s.size === size) ?? color.sizes[1] ?? color.sizes[0];
  const hasSize = Boolean(size);

  return (
    <div className="glass group flex flex-col overflow-hidden rounded-3xl">
      {/* Imagery */}
      <div
        className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-white/[0.06] to-black"
        onMouseEnter={() => setShowBack(true)}
        onMouseLeave={() => setShowBack(false)}
      >
        {/* Front + back stacked so the flip cross-fades with no layout shift */}
        <img
          src={color.front}
          alt={`NOVA ${product.name} in ${color.name}, front`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
            showBack ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />
        <img
          src={color.back}
          alt={`NOVA ${product.name} in ${color.name}, ${product.motif} back print`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
            showBack ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

        {/* Price chip */}
        <span className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          ${color.price}
        </span>

        {/* Front / Back toggle */}
        <div className="absolute left-4 top-4 flex rounded-full bg-black/40 p-0.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-md">
          <button
            onClick={() => setShowBack(false)}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              !showBack ? 'bg-white/85 text-black' : 'text-white/70'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setShowBack(true)}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              showBack ? 'bg-white/85 text-black' : 'text-white/70'
            }`}
          >
            Back
          </button>
        </div>

        {/* Motif tag */}
        <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
          {product.motif}
        </span>
      </div>

      {/* Detail */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-medium leading-tight text-white">{product.name}</h3>
        </div>
        <p className="mt-1 font-mono text-[11px] tracking-wider text-white/35">{product.coords}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/55">{product.blurb}</p>

        {/* Colour swatches */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="eyebrow">Colour</span>
            <span className="text-[11px] text-white/45">{color.name}</span>
          </div>
          <div className="flex gap-2">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setColorIdx(i)}
                aria-label={c.name}
                title={c.name}
                className={`relative h-7 w-7 rounded-full ring-1 ring-inset ring-white/20 transition-transform hover:scale-110 ${
                  i === colorIdx ? 'ring-2 ring-white/90' : ''
                }`}
                style={{ backgroundColor: c.swatch }}
              >
                {i === colorIdx && (
                  <span className="absolute -inset-1 rounded-full ring-1 ring-nova-cyan/60" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Size pills */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="eyebrow">Size</span>
            <a
              href={product.href}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-white/45 underline-offset-2 hover:text-white/70 hover:underline"
            >
              Size guide
            </a>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {color.sizes.map((s) => (
              <button
                key={s.size}
                onClick={() => setSize(s.size)}
                className={`min-w-[2.5rem] rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  size === s.size
                    ? 'border-white/80 bg-white/90 text-black'
                    : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>

        {/* Checkout */}
        <a
          href={hasSize ? checkoutUrl(selected.variantId) : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!hasSize}
          onClick={(e) => {
            if (!hasSize) e.preventDefault();
          }}
          className={`pill-primary mt-6 w-full justify-center !py-3 text-[15px] ${
            hasSize ? '' : 'pointer-events-none opacity-50'
          }`}
        >
          {hasSize ? (
            <>
              Add to bag — ${color.price} <ArrowIcon />
            </>
          ) : (
            'Select a size'
          )}
        </a>
        <p className="mt-3 text-center text-[11px] text-white/35">
          Secure checkout on Shopify · ships in 2–4 days
        </p>
      </div>
    </div>
  );
}
