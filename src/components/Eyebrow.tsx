interface EyebrowProps {
  /** Leading section number, e.g. "01". */
  num: string;
  label: string;
  className?: string;
}

/** Small uppercase eyebrow label with a leading number: "01 — WELCOME". */
export function Eyebrow({ num, label, className = '' }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="eyebrow gradient-text font-semibold">{num}</span>
      <span className="h-px w-6 bg-gradient-to-r from-nova-cyan/70 to-transparent" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}
