const TAGS = [
  'Daily Wear', 'Increased Comfort', 'Enhanced Fit', 'Premium Feel',
  'Daily Wear', 'Long Lasting', 'Enhanced Fit', 'Premium Feel',
  'Daily Wear', 'Increased Comfort', 'Enhanced Fit', 'Premium Feel',
  'Daily Wear', 'Long Lasting', 'Enhanced Fit', 'Premium Feel',
];

export function BenefitsStrip() {
  return (
    <div className="overflow-hidden bg-nova-ink py-4">
      <div className="marquee-track">
        {TAGS.map((tag, i) => (
          <span
            key={i}
            className="mx-2 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80"
          >
            ✦ {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
