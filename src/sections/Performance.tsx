import { SceneSection } from '../components/SceneSection';
import { PerformanceScene } from '../scenes/PerformanceScene';
import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';

const STATS = [
  { value: '3×', label: 'faster deployment', sub: 'From commit to global edge in minutes, not days.' },
  { value: '57%', label: 'lower cost', sub: 'Energy-aware scheduling cuts spend without throttling.' },
];

export function Performance() {
  return (
    <SceneSection
      id="performance"
      camera={[0, 0.5, 9]}
      bloomIntensity={1.0}
      scene={<PerformanceScene />}
      fallback="radial-gradient(70% 110% at 50% 100%, rgba(34,211,238,0.2), rgba(255,91,58,0.08) 50%, rgba(5,5,5,0) 75%)"
    >
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <Eyebrow num="03" label="Performance" className="justify-center" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Engineered to move at the <span className="gradient-text">speed of intent.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={0.1 + i * 0.08}>
              <div className="glass group relative overflow-hidden rounded-3xl p-8 text-left">
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-70"
                  style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.5), rgba(255,59,0,0.3))' }}
                />
                <div className="text-6xl font-semibold tracking-tight text-white sm:text-7xl">
                  <span className="gradient-text">{s.value}</span>
                </div>
                <div className="mt-2 text-lg font-medium text-white/90">{s.label}</div>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{s.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SceneSection>
  );
}
