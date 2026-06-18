import { SceneSection } from '../components/SceneSection';
import { HeroScene } from '../scenes/HeroScene';
import { Eyebrow } from '../components/Eyebrow';
import { ArrowIcon } from '../components/icons';

export function Hero() {
  return (
    <SceneSection
      id="hero"
      camera={[0, 1.2, 11]}
      bloomIntensity={1.1}
      scene={<HeroScene />}
      fallback="radial-gradient(120% 80% at 50% 20%, rgba(34,211,238,0.18), rgba(255,91,58,0.06) 55%, rgba(5,5,5,0) 75%)"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 animate-[fadeIn_1s_ease-out]">
          <Eyebrow num="01" label="Welcome to a new era" className="justify-center" />
        </div>
        <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          Technology that <span className="gradient-text">redefines</span> the future.
        </h1>
        <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
          We build systems at the intersection of data, energy, and intelligence — where
          something fundamentally new comes to life.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a href="#cta" className="pill-primary text-[15px]">
            Get started <ArrowIcon />
          </a>
          <a href="#orb" className="pill-ghost text-[15px]">
            See how it works
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] uppercase tracking-eyebrow">Scroll</span>
          <span className="h-8 w-px animate-pulse-glow bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </SceneSection>
  );
}
