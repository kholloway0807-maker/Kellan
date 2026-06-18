import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gradientAt } from '../lib/palette';
import { useDeviceTier, scaleCount } from '../hooks/useDeviceTier';

/**
 * A flowing "river" of particles arranged as a wide ribbon (length × width grid)
 * that morphs continuously with travelling sine waves, colored across the
 * blue→orange gradient. The whole field gently parallaxes toward the cursor.
 */
export function HeroScene() {
  const tier = useDeviceTier();
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const cols = scaleCount(280, tier); // along the ribbon length
  const rows = tier === 'mobile' ? 14 : 26; // across the ribbon width

  const { positions, base, colors } = useMemo(() => {
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 2); // u, v
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        const u = x / (cols - 1); // 0..1 length
        const v = z / (rows - 1); // 0..1 width
        base[i * 2] = u;
        base[i * 2 + 1] = v;
        positions[i * 3] = (u - 0.5) * 26;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (v - 0.5) * 6;
        gradientAt(u, c);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
        i++;
      }
    }
    return { positions, base, colors };
  }, [cols, rows]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (points.current) {
      const arr = points.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < base.length / 2; i++) {
        const u = base[i * 2];
        const v = base[i * 2 + 1];
        const x = (u - 0.5) * 26;
        const z = (v - 0.5) * 6;
        // travelling waves create the morphing ribbon
        const y =
          Math.sin(u * 6.0 + t * 0.9) * 1.5 +
          Math.sin(u * 13.0 - t * 1.3 + v * 3.0) * 0.6 +
          Math.cos(v * 4.0 + t * 0.6) * 0.8;
        arr[i * 3] = x;
        arr[i * 3 + 1] = y + (v - 0.5) * 1.5;
        arr[i * 3 + 2] = z + Math.sin(u * 5.0 + t * 0.7) * 1.2;
      }
      points.current.geometry.attributes.position.needsUpdate = true;
    }
    // cursor parallax
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.25, 0.04);
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -0.25 + pointer.y * -0.15,
        0.04
      );
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]} rotation={[-0.25, 0, 0]}>
      <points ref={points} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={tier === 'mobile' ? 0.07 : 0.06}
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
