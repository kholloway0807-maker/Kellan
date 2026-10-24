import { useEffect, useState } from 'react';
import { useCart } from './Cart';
import { TeeMockup } from './TeeMockup';

export function CartDrawer() {
  const { lines, subtotal, open, setOpen, remove, priceOf, checkout } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onCheckout = async () => {
    if (!checkout) return;
    setBusy(true);
    setError('');
    try {
      await checkout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-[70] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-label="Your bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-sc-line bg-sc-ink transition-transform duration-500 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-sc-line px-6 py-5">
          <p className="font-serif text-2xl">Your Table</p>
          <button
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center text-sc-stone hover:text-sc-cream"
            aria-label="Close bag"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <p className="py-16 text-center font-serif text-xl italic text-sc-stone">Your table is still being set.</p>
          ) : (
            lines.map((l) => (
              <div key={`${l.product.id}-${l.size}`} className="flex gap-4 border-b border-sc-line py-5">
                <div className="w-20 shrink-0 bg-sc-black p-2">
                  <TeeMockup print={l.product.print} colorway={l.product.colorway} className="w-full" />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="font-serif text-lg leading-tight">{l.product.name}</p>
                  <p className="mt-1 text-xs tracking-widest text-sc-stone">
                    SIZE {l.size} · QTY {l.qty}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-sm">${priceOf(l.product) * l.qty}</span>
                    <button
                      onClick={() => remove(l.product.id, l.size)}
                      className="cursor-pointer text-[11px] uppercase tracking-[0.2em] text-sc-stone underline-offset-4 hover:text-sc-cream hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-sc-line px-6 py-6">
          <div className="flex items-baseline justify-between">
            <span className="eyebrow">Subtotal</span>
            <span className="font-serif text-2xl">${subtotal}</span>
          </div>
          {checkout ? (
            <button
              onClick={onCheckout}
              disabled={busy || lines.length === 0}
              className="btn-cream mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? 'Setting your table…' : 'Checkout'}
            </button>
          ) : (
            <>
              <button disabled className="btn-cream mt-5 w-full cursor-not-allowed opacity-60">
                Checkout opens with Drop 01
              </button>
              <p className="mt-3 text-center text-xs text-sc-stone">Join the Club below for first access.</p>
            </>
          )}
          {error && (
            <p role="alert" className="mt-3 text-center text-sm text-[#e8a39a]">
              {error}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
