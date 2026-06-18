import { useEffect, useState } from 'react';

/** Thin top-of-page scroll progress indicator with the brand gradient. */
export function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(1, Math.max(0, p)));
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
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent">
      <div
        className="h-full origin-left"
        style={{
          transform: `scaleX(${progress})`,
          background: 'linear-gradient(90deg, #22D3EE, #3B82F6 40%, #FF5E3A 80%, #FF3B00)',
          boxShadow: '0 0 12px rgba(34,211,238,0.6)',
        }}
      />
    </div>
  );
}
