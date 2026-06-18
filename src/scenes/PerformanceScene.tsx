import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gradientAt } from '../lib/palette';
import { useDeviceTier, scaleCount } from '../hooks/useDeviceTier';

/**
 * A vertical particle fountain / vortex: particles spiral upward from the base,
 * fade as they rise, then recycle. Color ramps blue→orange with height.
 */
export function PerformanceScene() {
  const tier = useDeviceTier();
  const points = useRef<THREE.Points>(null);
  const count = scaleCount(7000, tier);

  const { positions, colors, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    // seeds: [radius, angularSpeed, life0, lifeSpeed]
    const seeds = new Float32Array(count * 4);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      seeds[i * 4] = 0.2 + Math.random() * 2.6; // radius
      seeds[i * 4 + 1] = (0.6 + Math.random() * 1.2) * (Math.random() < 0.5 ? -1 : 1);
      seeds[i * 4 + 2] = Math.random(); // initial life 0..1
      seeds[i * 4 + 3] = 0.06 + Math.random() * 0.12; // rise speed
      gradientAt(Math.random(), c);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, seeds };
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    const arr = points.current.geometry.attributes.position.array as Float32Array;
    const col = points.current.geometry.attributes.color.array as Float32Array;
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      let life = (seeds[i * 4 + 2] + t * seeds[i * 4 + 3]) % 1;
      const radius = seeds[i * 4] * (1 - life * 0.7); // funnel inward as it rises
      const angle = seeds[i * 4 + 1] * (t + i) + life * 6.0;
      const y = life * 7 - 3.2;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
      gradientAt(life, c);
      const fade = Math.sin(life * Math.PI); // fade in/out across lifespan
      col[i * 3] = c.r * fade;
      col[i * 3 + 1] = c.g * fade;
      col[i * 3 + 2] = c.b * fade;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
    points.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={tier === 'mobile' ? 0.06 : 0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
