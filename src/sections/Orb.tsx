import { SceneSection } from '../components/SceneSection';
import { OrbScene } from '../scenes/OrbScene';
import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';

export function Orb() {
  return (
    <SceneSection
      id="orb"
      camera={[0, 0, 7]}
      bloomIntensity={1.35}
      scene={<OrbScene />}
      fallback="radial-gradient(80% 80% at 50% 50%, rgba(59,130,246,0.22), rgba(255,59,0,0.08) 55%, rgba(5,5,5,0) 72%)"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="md:col-start-1">
          <Reveal>
            <Eyebrow num="02" label="The idea" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Every piece is a <span className="gradient-text">coordinate.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
              NOVA marks the places where someone took the leap — a summit, a city, a starting
              line. Wear the coordinates of the moment you bet on yourself, printed clean on
              garment-dyed cotton built to last.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-7 space-y-3 text-sm text-white/70">
              {[
                'Designed around a single, meaningful place',
                'Garment-dyed for depth and a worn-in feel',
                'Minimal back print, premium hand',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-nova-cyan to-nova-red" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        {/* right column intentionally empty — the orb sits behind it */}
        <div className="hidden md:block" aria-hidden />
      </div>
    </SceneSection>
  );
}
