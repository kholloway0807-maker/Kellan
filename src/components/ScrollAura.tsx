import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * A fixed, full-page ambient glow layer that reacts to scroll. Two large
 * blurred gradient blobs drift continuously; their position and hue are driven
 * by scroll progress so the page transitions from cool (cyan/blue) at the top
 * to warm (orange/red) at the bottom — one continuous background "journey".
 *
 * Pure CSS/transform work (no extra WebGL context). It is layered ABOVE the
 * per-section 3D canvases but BELOW all foreground content (z between the
 * canvas at -10 and content at 10), so it glows over the particle backdrops
 * without ever tinting product images or text. Frozen to a static state under
 * prefers-reduced-motion.
 */
export function ScrollAura() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty('--p', p.toFixed(4));
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="scroll-aura pointer-events-none fixed inset-0 z-[5]"
      style={{ ['--p' as string]: 0 }}
    >
      <span className="aura-blob aura-blob--cool" />
      <span className="aura-blob aura-blob--warm" />
    </div>
  );
}
