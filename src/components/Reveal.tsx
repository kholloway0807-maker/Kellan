import { ReactNode, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  /** Stagger order delay in seconds. */
  delay?: number;
  y?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Scroll-driven entrance: fades + lifts content into place when its section
 * enters the viewport. No-op (instantly visible) under reduced motion.
 */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const Tag = as as 'div';

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y, reduced]);

  return (
    // @ts-expect-error dynamic tag with forwarded ref
    <Tag ref={ref} className={className} style={reduced ? undefined : { visibility: 'hidden' }}>
      {children}
    </Tag>
  );
}
