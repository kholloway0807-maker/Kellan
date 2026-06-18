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
            <Eyebrow num="02" label="The core engine" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              A single intelligent core, <span className="gradient-text">always in motion.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
              NOVA Core fuses real-time data streams, adaptive compute, and an energy-aware
              runtime into one living system — reasoning continuously so your products respond
              before the moment arrives.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-7 space-y-3 text-sm text-white/70">
              {[
                'Sub-millisecond inference at the edge',
                'Self-balancing energy and compute',
                'Streaming context that never goes cold',
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
