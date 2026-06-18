import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gradientAt } from '../lib/palette';
import { useDeviceTier, scaleCount } from '../hooks/useDeviceTier';

/**
 * Particles converging into an hourglass form — they orbit a vertical axis
 * whose radius pinches to a waist in the middle, with a breathing convergence
 * that pulls them toward the surface and releases.
 */
export function CtaScene() {
  const tier = useDeviceTier();
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);
  const count = scaleCount(11000, tier);

  // target hourglass positions + scattered start + per-point colors
  const { positions, targets, scatter } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const yNorm = Math.random() * 2 - 1; // -1..1
      const y = yNorm * 3.4;
      // hourglass radius: wide at top/bottom, pinched at waist
      const radius = 0.25 + Math.abs(yNorm) * 2.0;
      const angle = Math.random() * Math.PI * 2;
      const jitter = 0.92 + Math.random() * 0.16;
      targets[i * 3] = Math.cos(angle) * radius * jitter;
      targets[i * 3 + 1] = y;
      targets[i * 3 + 2] = Math.sin(angle) * radius * jitter;

      // scattered cloud start
      scatter[i * 3] = (Math.random() - 0.5) * 16;
      scatter[i * 3 + 1] = (Math.random() - 0.5) * 12;
      scatter[i * 3 + 2] = (Math.random() - 0.5) * 16;

      positions[i * 3] = scatter[i * 3];
      positions[i * 3 + 1] = scatter[i * 3 + 1];
      positions[i * 3 + 2] = scatter[i * 3 + 2];
    }
    return { positions, targets, scatter };
  }, [count]);

  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      gradientAt((targets[i * 3 + 1] / 3.4 + 1) / 2, c);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return colors;
  }, [count, targets]);

  useFrame((state, delta) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    // breathing convergence: 0 = formed, 1 = scattered
    const release = (Math.sin(t * 0.35) * 0.5 + 0.5) * 0.35;
    const pos = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const tx = THREE.MathUtils.lerp(targets[i * 3], scatter[i * 3], release);
      const ty = THREE.MathUtils.lerp(targets[i * 3 + 1], scatter[i * 3 + 1], release);
      const tz = THREE.MathUtils.lerp(targets[i * 3 + 2], scatter[i * 3 + 2], release);
      pos[i * 3] = THREE.MathUtils.lerp(pos[i * 3], tx, 0.06);
      pos[i * 3 + 1] = THREE.MathUtils.lerp(pos[i * 3 + 1], ty, 0.06);
      pos[i * 3 + 2] = THREE.MathUtils.lerp(pos[i * 3 + 2], tz, 0.06);
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    if (group.current) group.current.rotation.y += delta * 0.22;
  });

  return (
    <group ref={group} scale={tier === 'mobile' ? 0.85 : 1}>
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
    </group>
  );
}
