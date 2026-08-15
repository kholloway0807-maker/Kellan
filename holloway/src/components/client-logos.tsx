/*
  Invented client brands, so each one gets an invented monogram mark rendered
  inline rather than a bare text wordmark. Logo lockup only: mark plus brand
  name. No industry or category label underneath.

  Marks inherit currentColor, so they read correctly in both themes.
*/

type Client = { name: string; initials: string };

const CLIENTS: Client[] = [
  { name: "Reyes & Daughters", initials: "RD" },
  { name: "Halvorsen Dental", initials: "HD" },
  { name: "Ironbark Roofing", initials: "IB" },
  { name: "Bright Fork", initials: "BF" },
  { name: "Cedar & Coil", initials: "CC" },
  { name: "Marisol Legal", initials: "ML" },
];

function Monogram({ initials }: { initials: string }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      role="presentation"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="0.75"
        y="0.75"
        width="28.5"
        height="28.5"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text
        x="15"
        y="15"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.02em"
        fill="currentColor"
        fontFamily="var(--font-geist-sans), system-ui, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

export function ClientLogos() {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
      {CLIENTS.map((c) => (
        <li
          key={c.name}
          className="flex items-center gap-2.5 text-muted transition-colors duration-200 hover:text-ink"
        >
          <Monogram initials={c.initials} />
          <span className="text-[14px] font-medium leading-tight tracking-tight">
            {c.name}
          </span>
        </li>
      ))}
    </ul>
  );
}
