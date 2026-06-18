import { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Starfield } from '../scenes/Starfield';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useDeviceTier, scaleCount } from '../hooks/useDeviceTier';

interface SceneSectionProps {
  id: string;
  /** R3F scene contents (particles / 3D objects). */
  scene: ReactNode;
  /** HTML overlay copy positioned above the canvas. */
  children?: ReactNode;
  /** Camera position for this scene. */
  camera?: [number, number, number];
  bloomIntensity?: number;
  /** CSS gradient shown behind/instead of the canvas (reduced-motion fallback). */
  fallback?: string;
  /** Hide the shared starfield (e.g. terrain scene uses its own framing). */
  starfield?: boolean;
  className?: string;
}

/**
 * Full-viewport scene wrapper. Lazily mounts an isolated R3F canvas (with bloom
 * post-processing + shared starfield) when scrolled near, and renders a static
 * gradient when the user prefers reduced motion.
 */
export function SceneSection({
  id,
  scene,
  children,
  camera = [0, 0, 9],
  bloomIntensity = 0.9,
  fallback = 'radial-gradient(120% 90% at 50% 30%, rgba(34,211,238,0.10), rgba(5,5,5,0) 60%)',
  starfield = true,
  className = '',
}: SceneSectionProps) {
  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const { ref, inView } = useInView<HTMLElement>();

  const dpr: [number, number] = tier === 'mobile' ? [1, 1.5] : [1, 2];

  return (
    <section
      id={id}
      ref={ref}
      className={`relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden ${className}`}
    >
      {/* WebGL layer */}
      <div className="absolute inset-0 -z-10">
        {reduced ? (
          <div className="h-full w-full" style={{ background: fallback }} />
        ) : (
          inView && (
            <Canvas
              dpr={dpr}
              gl={{ antialias: true, powerPreference: 'high-performance' }}
              camera={{ position: camera, fov: 55, near: 0.1, far: 200 }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.setClearColor('#050505', 1);
              }}
            >
              {starfield && (
                <Starfield count={scaleCount(1400, tier)} animate={!reduced} />
              )}
              {scene}
              <EffectComposer multisampling={tier === 'mobile' ? 0 : 4}>
                <Bloom
                  intensity={bloomIntensity}
                  luminanceThreshold={0.15}
                  luminanceSmoothing={0.9}
                  mipmapBlur
                  radius={0.8}
                />
              </EffectComposer>
            </Canvas>
          )
        )}
      </div>

      {/* HTML overlay */}
      <div className="relative z-10 w-full px-6">{children}</div>
    </section>
  );
}
