import { SceneSection } from '../components/SceneSection';
import { TerrainScene } from '../scenes/TerrainScene';
import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';

export function Terrain() {
  return (
    <SceneSection
      id="terrain"
      camera={[0, 6, 12]}
      bloomIntensity={0.85}
      starfield={false}
      scene={<TerrainScene />}
      fallback="linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(34,211,238,0.12) 60%, rgba(255,91,58,0.14) 100%)"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow num="04" label="The landscape" className="justify-center" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            A terrain that <span className="gradient-text">shapes itself</span> to your data.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65">
            Every signal reshapes the field in real time. NOVA reads the whole surface at once,
            finding the path through complexity that no static model could.
          </p>
        </Reveal>
      </div>
    </SceneSection>
  );
}
