import { Navbar } from './components/Navbar';
import { ProgressBar } from './components/ProgressBar';
import { Hero } from './sections/Hero';
import { Orb } from './sections/Orb';
import { Performance } from './sections/Performance';
import { Terrain } from './sections/Terrain';
import { Cta } from './sections/Cta';
import { useLenis } from './hooks/useLenis';
import { useReducedMotion } from './hooks/useReducedMotion';

export default function App() {
  const reduced = useReducedMotion();
  // Smooth scroll only when motion is allowed; native scroll otherwise.
  useLenis(!reduced);

  return (
    <div className="grain relative bg-nova-black">
      <ProgressBar />
      <Navbar />

      <main>
        <Hero />
        <Orb />
        <Performance />
        <Terrain />
        <Cta />
      </main>

      {/* soft vignette to seat the scenes in the near-black ground */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, rgba(5,5,5,0) 55%, rgba(5,5,5,0.55) 100%)',
        }}
      />
    </div>
  );
}
