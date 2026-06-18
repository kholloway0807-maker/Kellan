import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gradientAt } from '../lib/palette';
import { useDeviceTier, scaleCount } from '../hooks/useDeviceTier';

/**
 * A glowing electric orb: a torus shell of points wrapped around a denser inner
 * sphere core, with a few plasma filament rings arcing through it. Slowly
 * rotates; bloom (applied by SceneSection) provides the glow.
 */
export function OrbScene() {
  const tier = useDeviceTier();
  const group = useRef<THREE.Group>(null);
  const filaments = useRef<THREE.Group>(null);

  const torus = usePointShell(scaleCount(9000, tier), 'torus');
  const core = usePointShell(scaleCount(4000, tier), 'sphere');

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
    if (filaments.current) {
      filaments.current.rotation.y -= delta * 0.4;
      filaments.current.rotation.z += delta * 0.12;
    }
  });

  return (
    <group ref={group} scale={tier === 'mobile' ? 0.8 : 1}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[torus.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[torus.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[core.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[core.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Plasma filament rings */}
      <group ref={filaments}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.7, i * 1.1, i * 0.4]}>
            <torusGeometry args={[2.1 + i * 0.08, 0.006, 8, 220]} />
            <meshBasicMaterial
              color={i === 2 ? '#FF5E3A' : i === 1 ? '#3B82F6' : '#22D3EE'}
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Builds a point cloud sampled on a torus or sphere shell, colored by gradient. */
function usePointShell(count: number, kind: 'torus' | 'sphere') {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();
    const R = 2;
    const r = 0.62;
    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, t: number;
      if (kind === 'torus') {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const jitter = 0.92 + Math.random() * 0.16;
        x = (R + r * Math.cos(v) * jitter) * Math.cos(u);
        y = (R + r * Math.cos(v) * jitter) * Math.sin(u);
        z = r * Math.sin(v) * jitter;
        t = (Math.cos(u) + 1) / 2;
      } else {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const rad = 1.35 * (0.7 + Math.random() * 0.3);
        x = rad * Math.sin(phi) * Math.cos(theta);
        y = rad * Math.sin(phi) * Math.sin(theta);
        z = rad * Math.cos(phi);
        t = (y / 1.35 + 1) / 2;
      }
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      gradientAt(t, c);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count, kind]);
}
