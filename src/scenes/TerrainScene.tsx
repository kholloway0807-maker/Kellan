import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gradientAt } from '../lib/palette';
import { useDeviceTier, scaleCount } from '../hooks/useDeviceTier';

/**
 * An animated dot-wave landscape — a dense grid of points rippling like dunes,
 * colored across the gradient by elevation, with the camera slowly drifting
 * over the surface.
 */
export function TerrainScene() {
  const tier = useDeviceTier();
  const points = useRef<THREE.Points>(null);

  const side = Math.round(Math.sqrt(scaleCount(22000, tier))); // grid resolution
  const spacing = 0.6;

  const { positions, colors, base } = useMemo(() => {
    const count = side * side;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 2);
    let i = 0;
    for (let x = 0; x < side; x++) {
      for (let z = 0; z < side; z++) {
        const px = (x - side / 2) * spacing;
        const pz = (z - side / 2) * spacing;
        base[i * 2] = px;
        base[i * 2 + 1] = pz;
        positions[i * 3] = px;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = pz;
        i++;
      }
    }
    return { positions, colors, base };
  }, [side]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    const pos = points.current.geometry.attributes.position.array as Float32Array;
    const col = points.current.geometry.attributes.color.array as Float32Array;
    const c = new THREE.Color();
    const n = base.length / 2;
    for (let i = 0; i < n; i++) {
      const px = base[i * 2];
      const pz = base[i * 2 + 1];
      const h =
        Math.sin(px * 0.35 + t * 0.5) * 1.1 +
        Math.cos(pz * 0.3 - t * 0.4) * 1.1 +
        Math.sin((px + pz) * 0.18 + t * 0.3) * 0.7;
      pos[i * 3 + 1] = h;
      const tt = THREE.MathUtils.clamp((h + 2.4) / 4.8, 0, 1);
      gradientAt(tt, c);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;

    // camera slowly drifts over the dunes
    state.camera.position.x = Math.sin(t * 0.08) * 4;
    state.camera.position.z = 12 + Math.cos(t * 0.06) * 2;
    state.camera.position.y = 6;
    state.camera.lookAt(0, -0.5, 0);
  });

  return (
    <points ref={points} frustumCulled={false} rotation={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={tier === 'mobile' ? 0.07 : 0.055}
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
