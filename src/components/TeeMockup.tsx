import { Colorway, Print, asset } from '../data/products';

interface TeeMockupProps {
  print: Print;
  colorway: Colorway;
  className?: string;
}

const TEE_PATH =
  'M148 34 C164 60 236 60 252 34 L322 58 L390 128 L344 172 L314 146 L314 424 L86 424 L86 146 L56 172 L10 128 L78 58 Z';

/**
 * Flat-lay tee rendered in SVG with the real logo artwork composited on the
 * chest. Logos ship on black, so noir tees screen-blend them and crème tees
 * invert + multiply, dropping the background either way.
 */
export function TeeMockup({ print, colorway, className = '' }: TeeMockupProps) {
  const noir = colorway === 'noir';
  const fill = noir ? '#161615' : '#EDE8DD';
  const shade = noir ? '#000' : '#8a8273';
  const id = `${print}-${colorway}`;
  const art =
    print === 'script'
      ? { href: asset('brand/script.webp'), x: 118, y: 112, w: 164, h: 58 }
      : { href: asset('brand/crest-print.webp'), x: 140, y: 102, w: 120, h: 120 };

  return (
    <svg viewBox="0 0 400 440" className={className} role="img" aria-label={`Saint. Clermont ${print} tee in ${colorway}`}>
      <defs>
        <linearGradient id={`fold-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={shade} stopOpacity="0.28" />
          <stop offset="0.22" stopColor={shade} stopOpacity="0" />
          <stop offset="0.78" stopColor={shade} stopOpacity="0" />
          <stop offset="1" stopColor={shade} stopOpacity="0.28" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <path d={TEE_PATH} />
        </clipPath>
      </defs>
      <path d={TEE_PATH} fill={fill} stroke={noir ? 'rgba(240,237,230,0.12)' : 'rgba(0,0,0,0.12)'} strokeWidth="1.5" />
      <image
        href={art.href}
        x={art.x}
        y={art.y}
        width={art.w}
        height={art.h}
        preserveAspectRatio="xMidYMid meet"
        style={noir ? { mixBlendMode: 'screen' } : { mixBlendMode: 'multiply', filter: 'invert(1)' }}
      />
      <g clipPath={`url(#clip-${id})`}>
        <rect width="400" height="440" fill={`url(#fold-${id})`} />
        {/* collar rib + sleeve seams */}
        <path d="M148 34 C164 60 236 60 252 34" fill="none" stroke={shade} strokeOpacity="0.35" strokeWidth="6" />
        <path d="M86 146 L78 58 M314 146 L322 58" stroke={shade} strokeOpacity="0.18" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
