import * as THREE from 'three';

/** NOVA brand palette as THREE colors (sRGB authored, linearized by three). */
export const PALETTE = {
  blue: new THREE.Color('#3B82F6'),
  cyan: new THREE.Color('#22D3EE'),
  orange: new THREE.Color('#FF5E3A'),
  red: new THREE.Color('#FF3B00'),
};

/**
 * Samples the brand gradient (cyan/blue -> orange/red) at t in [0,1] and writes
 * into `target`. Mid-range blends through blue for a richer ramp.
 */
export function gradientAt(t: number, target: THREE.Color): THREE.Color {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  if (x < 0.5) {
    target.copy(PALETTE.cyan).lerp(PALETTE.blue, x / 0.5);
  } else {
    target.copy(PALETTE.orange).lerp(PALETTE.red, (x - 0.5) / 0.5);
    // smooth the seam by pulling slightly toward blue near the middle
    if (x < 0.62) target.lerp(PALETTE.blue, (0.62 - x) / 0.12 * 0.4);
  }
  return target;
}
