import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS, Product, Size } from '../data/products';
import { VariantMap, createCheckout, fetchVariants, shopifyEnabled } from '../lib/shopify';

export interface CartLine {
  product: Product;
  size: Size;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, size: Size) => void;
  remove: (id: string, size: Size) => void;
  /** Live Shopify price when connected, catalogue fallback otherwise. */
  priceOf: (product: Product) => number;
  /** False only when Shopify reports the size sold out (or missing). */
  inStock: (product: Product, size: Size) => boolean;
  /** Sends the bag to Shopify checkout. Undefined in preview mode. */
  checkout?: () => Promise<void>;
}

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = 'sc-bag';

function loadBag(): CartLine[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as { id: string; size: Size; qty: number }[];
    return raw.flatMap((l) => {
      const product = PRODUCTS.find((p) => p.id === l.id);
      return product ? [{ product, size: l.size, qty: l.qty }] : [];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadBag);
  const [open, setOpen] = useState(false);
  const [variants, setVariants] = useState<VariantMap | null>(null);

  useEffect(() => {
    if (!shopifyEnabled) return;
    fetchVariants(PRODUCTS.map((p) => p.handle))
      .then(setVariants)
      .catch((err) => console.error('Shopify variants failed to load', err));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(lines.map((l) => ({ id: l.product.id, size: l.size, qty: l.qty })))
      );
    } catch {
      /* storage unavailable — bag just won't persist */
    }
  }, [lines]);

  const value = useMemo<CartState>(() => {
    const variant = (product: Product, size: Size) => variants?.[product.handle]?.[size];
    const priceOf = (product: Product) =>
      Object.values(variants?.[product.handle] ?? {})[0]?.price ?? product.price;

    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * priceOf(l.product), 0),
      open,
      setOpen,
      add: (product, size) => {
        setLines((prev) => {
          const hit = prev.find((l) => l.product.id === product.id && l.size === size);
          return hit
            ? prev.map((l) => (l === hit ? { ...l, qty: l.qty + 1 } : l))
            : [...prev, { product, size, qty: 1 }];
        });
        setOpen(true);
      },
      remove: (id, size) => setLines((prev) => prev.filter((l) => !(l.product.id === id && l.size === size))),
      priceOf,
      inStock: (product, size) => !variants || variant(product, size)?.available === true,
      checkout:
        shopifyEnabled && variants
          ? async () => {
              const cartLines = lines.map((l) => {
                const v = variant(l.product, l.size);
                if (!v) throw new Error(`${l.product.name} in ${l.size} is unavailable`);
                return { merchandiseId: v.id, quantity: l.qty };
              });
              window.location.href = await createCheckout(cartLines);
            }
          : undefined,
    };
  }, [lines, open, variants]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
