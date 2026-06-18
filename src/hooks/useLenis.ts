import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires Lenis smooth scrolling into the GSAP ticker and keeps ScrollTrigger in
 * sync. Disabled entirely when reduced motion is requested so the page uses
 * native scrolling and static layout.
 */
export function useLenis(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
    };
  }, [enabled]);
}
