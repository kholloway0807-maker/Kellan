export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-start justify-end overflow-hidden bg-[#0D1B2A] pt-14"
    >
      {/* Background product image */}
      <div className="absolute inset-0">
        <img
          src={`${import.meta.env.BASE_URL}products/hoodie.jpg`}
          alt="NOVA Take The Risk Hoodie"
          className="h-full w-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/60 to-[#0D1B2A]/20" />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="max-w-xl animate-[fadeIn_0.9s_ease-out_both]">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
            NOVA Apparel
          </p>
          <h1 className="text-balance text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Made For Those<br />Who Take The Risk.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
            Premium garment-dyed apparel. Heavyweight, worn-in from day one, and built to outlast
            the moment that made it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#shop" className="btn-primary-dark text-[15px] px-7 py-3.5">
              Shop the Collection
            </a>
            <a href="#craft" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[15px] font-semibold text-white/80 backdrop-blur-sm transition hover:bg-white/10">
              Our Craft
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 right-8 hidden flex-col items-center gap-2 lg:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
