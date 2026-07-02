const ITEMS = [
  'Free shipping on orders $75+',
  'Garment-dyed. Built to last.',
  'Ships next business day',
  'Heavyweight ring-spun cotton',
];

export function AnnouncementBar() {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden bg-nova-ink py-2.5">
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-5 whitespace-nowrap px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
            {item}
            <span className="h-1 w-1 rounded-full bg-white/30" />
          </span>
        ))}
      </div>
    </div>
  );
}
