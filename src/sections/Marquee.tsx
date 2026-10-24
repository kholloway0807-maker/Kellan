const WORDS = ['Dinner Club', 'St. Tropez', 'St. Clermont', 'Members Only', 'Est. 2026', 'Late Seating'];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="double-rule overflow-hidden py-5" aria-hidden>
      <div className="flex w-max animate-marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {row.map((w, i) => (
              <span key={i} className="flex items-center gap-10 pr-10 font-serif text-2xl italic text-sc-cream/80 sm:text-3xl">
                {w}
                <span className="h-1.5 w-1.5 rotate-45 bg-sc-cream/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
