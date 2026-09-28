import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WarpCorridor3DProps {
  speed?: number; // 0 to 1
  travelProgress?: number; // 0 (start) to 1 (arrived)
  reducedMotion?: boolean;
}

const GATE_POSITIONS = [-25, -55, -85, -115];

export function WarpCorridor3D({
  speed = 0.5,
  travelProgress = 0,
  reducedMotion = false,
}: WarpCorridor3DProps) {
  const starsRef = useRef<THREE.Points>(null);
  const gatesRef = useRef<THREE.Group>(null);

  // Generate 2,200 stars along the corridor
  const [positions, originalZ] = useMemo(() => {
    const count = 2200;
    const pos = new Float32Array(count * 3);
    const origZ = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Spread in a cylindrical corridor around flight path
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 32;
      pos[idx] = Math.cos(angle) * radius;
      pos[idx + 1] = Math.sin(angle) * radius;
      const z = -Math.random() * 180 + 10;
      pos[idx + 2] = z;
      origZ[i] = z;
    }

    return [pos, origZ];
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion || !starsRef.current) return;

    const posAttr = starsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    const velocity = (15 + speed * 120) * delta;

    for (let i = 0; i < originalZ.length; i++) {
      const idx = i * 3 + 2;
      array[idx] += velocity;
      // Loop stars back ahead of the ship
      if (array[idx] > 20) {
        array[idx] = -160;
      }
    }

    posAttr.needsUpdate = true;

    // Subtle rotation of conduit gates
    if (gatesRef.current) {
      gatesRef.current.children.forEach((gate, idx) => {
        gate.rotation.z += delta * (idx % 2 === 0 ? 0.2 : -0.2);
      });
    }
  });

  const gateMaterial = new THREE.MeshStandardMaterial({
    color: '#151922',
    metalness: 0.92,
    roughness: 0.25,
  });

  const gateEnergyMaterial = new THREE.MeshBasicMaterial({
    color: '#10b981',
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });

  return (
    <group>
      {/* 1. Streaming Starfield Particles */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={speed > 0.4 ? 0.35 : 0.2}
          color="#ffffff"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* 2. Forged Hexagonal Transit Conduit Gates */}
      <group ref={gatesRef}>
        {GATE_POSITIONS.map((zPos, idx) => (
          <group key={zPos} position={[0, 0, zPos]}>
            {/* Hexagonal Outer Chassis */}
            <mesh material={gateMaterial}>
              <ringGeometry args={[7.5, 8.8, 6]} />
            </mesh>

            {/* Inner Emerald Power Ring */}
            <mesh material={gateEnergyMaterial}>
              <ringGeometry args={[7.2, 7.5, 6]} />
            </mesh>

            {/* Gate Strobe Light */}
            <pointLight
              color={idx % 2 === 0 ? '#10b981' : '#00e5ff'}
              intensity={1.2}
              distance={15}
            />
          </group>
        ))}
      </group>

      {/* 3. Deep Void Volumetric Fog Ambience */}
      <fog attach="fog" args={['#020408', 20, 190]} />
    </group>
  );
}

export default WarpCorridor3D;
