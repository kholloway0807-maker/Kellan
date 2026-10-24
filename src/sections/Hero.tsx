import { asset } from '../lib/asset';

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pt-20">
      {/* oversized crest rings, turning slowly behind the wordmark */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[150vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 sm:w-[90vw]">
        <div className="spin-slow absolute inset-0 rounded-full border border-sc-line" />
        <div className="absolute inset-[3%] rounded-full border border-sc-line/50" />
        <div className="absolute inset-[18%] rounded-full border border-sc-line/40" />
      </div>

      <p className="eyebrow relative animate-[fadeUp_1s_ease-out_both]">Drop 01 · Collection d'Été</p>

      <h1 className="relative mt-8 w-full max-w-4xl animate-[fadeUp_1.2s_0.15s_ease-out_both]">
        <span className="sr-only">Saint. Clermont</span>
        <img
          src={asset('brand/wordmark.webp')}
          alt=""
          width={1600}
          height={340}
          className="w-full mix-blend-screen"
        />
      </h1>

      <p className="relative mt-4 font-gothic text-3xl sm:text-4xl animate-[fadeUp_1.2s_0.3s_ease-out_both]">Dinner Club</p>
      <div className="relative mt-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.4em] text-sc-stone animate-[fadeUp_1.2s_0.45s_ease-out_both]">
        <span>St. Tropez</span>
        <span className="h-1.5 w-1.5 rotate-45 bg-sc-cream" aria-hidden />
        <span>St. Clermont</span>
      </div>

      <div className="relative mt-12 flex flex-col gap-3 sm:flex-row animate-[fadeUp_1.2s_0.6s_ease-out_both]">
        <a href="#collection" className="btn-cream">Shop the collection</a>
        <a href="#club" className="btn-ghost">Reserve a seat</a>
      </div>

      <a href="#collection" className="absolute bottom-8 flex flex-col items-center gap-3 text-sc-stone" aria-label="Scroll to collection">
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-sc-cream/60 to-transparent" />
      </a>
    </section>
  );
}
