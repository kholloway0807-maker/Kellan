import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product, Variant, createCheckout, fetchProducts, shopifyEnabled } from '../lib/shopify';

export interface CartLine {
  variantId: string;
  title: string;
  /** Variant label, e.g. "M" or "Black / M". Empty for single-variant products. */
  variantTitle: string;
  price: number;
  currency: string;
  image?: string;
  qty: number;
}

type CatalogStatus = 'disabled' | 'loading' | 'ready' | 'error';

interface CartState {
  products: Product[];
  status: CatalogStatus;
  lines: CartLine[];
  count: number;
  subtotal: number;
  currency: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, variant: Variant) => void;
  remove: (variantId: string) => void;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = 'sc-bag-v2';

function loadBag(): CartLine[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CartLine[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<CatalogStatus>(shopifyEnabled ? 'loading' : 'disabled');
  const [lines, setLines] = useState<CartLine[]>(loadBag);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shopifyEnabled) return;
    fetchProducts()
      .then((p) => {
        setProducts(p);
        setStatus('ready');
      })
      .catch((err) => {
        console.error('Shopify products failed to load', err);
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — bag just won't persist */
    }
  }, [lines]);

  const value = useMemo<CartState>(
    () => ({
      products,
      status,
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.price, 0),
      currency: lines[0]?.currency ?? 'USD',
      open,
      setOpen,
      add: (product, variant) => {
        setLines((prev) => {
          const hit = prev.find((l) => l.variantId === variant.id);
          if (hit) return prev.map((l) => (l === hit ? { ...l, qty: l.qty + 1 } : l));
          return [
            ...prev,
            {
              variantId: variant.id,
              title: product.title,
              variantTitle: product.options.length ? variant.title : '',
              price: variant.price,
              currency: product.currency,
              image: variant.image ?? product.image?.url,
              qty: 1,
            },
          ];
        });
        setOpen(true);
      },
      remove: (variantId) => setLines((prev) => prev.filter((l) => l.variantId !== variantId)),
      checkout: async () => {
        const url = await createCheckout(lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.qty })));
        window.location.href = url;
      },
    }),
    [products, status, lines, open]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
