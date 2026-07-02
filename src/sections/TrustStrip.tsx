const BADGES = [
  { icon: '✦', label: 'Optimally Weighted' },
  { icon: '◈', label: 'Garment-Dyed' },
  { icon: '⊙', label: 'Ships Next Day' },
  { icon: '◇', label: '100% Ring-Spun Cotton' },
  { icon: '✦', label: 'Easy Returns' },
  { icon: '◈', label: 'Made to Last' },
  { icon: '⊙', label: 'Free Shipping $75+' },
  { icon: '◇', label: 'Premium Fleece' },
];

export function TrustStrip() {
  const repeated = [...BADGES, ...BADGES, ...BADGES];
  return (
    <div className="overflow-hidden border-y border-nova-border bg-nova-cream py-3">
      <div className="marquee-track">
        {repeated.map((b, i) => (
          <span
            key={i}
            className="flex items-center gap-2.5 whitespace-nowrap px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-nova-ink"
          >
            <span className="text-nova-muted">{b.icon}</span>
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}
