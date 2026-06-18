import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
  /** Disable per-frame twinkle/drift for reduced-motion. */
  animate?: boolean;
  radius?: number;
}

/**
 * A deep, subtle starfield rendered as a single instanced Points cloud. Used as
 * the shared backdrop inside every scene.
 */
export function Starfield({ count = 1400, animate = true, radius = 60 }: StarfieldProps) {
  const ref = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // distribute on a spherical shell, biased to the far field
      const r = radius * (0.45 + Math.random() * 0.55);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() < 0.92 ? 0.06 + Math.random() * 0.08 : 0.18 + Math.random() * 0.12;
    }
    return { positions, sizes };
  }, [count, radius]);

  useFrame((_, delta) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.y += delta * 0.008;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        depthWrite={false}
        size={0.12}
        sizeAttenuation
        color="#cfe8ff"
        opacity={0.55}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
