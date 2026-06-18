import { useEffect, useState } from 'react';

export type DeviceTier = 'mobile' | 'tablet' | 'desktop';

/**
 * Coarse device classification used to scale particle counts and DPR so we can
 * hold a 60fps target on lower-powered hardware.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(() => classify());

  useEffect(() => {
    const onResize = () => setTier(classify());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return tier;
}

function classify(): DeviceTier {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1280) return 'tablet';
  return 'desktop';
}

/** Scales a desktop particle count down for weaker devices. */
export function scaleCount(base: number, tier: DeviceTier): number {
  switch (tier) {
    case 'mobile':
      return Math.round(base * 0.3);
    case 'tablet':
      return Math.round(base * 0.6);
    default:
      return base;
  }
}
