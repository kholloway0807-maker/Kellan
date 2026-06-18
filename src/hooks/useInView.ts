import { useEffect, useRef, useState } from 'react';

/**
 * Returns whether the element is within (an expanded) viewport. Used to mount
 * each scene's WebGL canvas only when it is near the screen, keeping at most a
 * couple of live contexts at once.
 */
export function useInView<T extends HTMLElement>(rootMargin = '40% 0px 40% 0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
