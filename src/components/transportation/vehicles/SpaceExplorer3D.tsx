import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function SpaceExplorer3D({
  throttle = 0.9,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const leftExhaustRef = useRef<THREE.Mesh>(null);
  const rightExhaustRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      // Spacecraft agile 3D pitch/roll
      const targetRoll = -banking.x * 0.42;
      const targetPitch = banking.y * 0.28;
      const targetYaw = -banking.x * 0.22;

      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.08;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.08;
      groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.08;

      // Flight micro-drift
      const vib = Math.sin(state.clock.elapsedTime * 28) * 0.003 * throttle;
      groupRef.current.position.y += vib;
    }

    // Rotating deep-space sensor array dish
    if (dishRef.current) {
      dishRef.current.rotation.y += delta * 1.5;
    }

    // Engine glow plume pulse
    const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 30) * 0.15;
    const plumeLength = Math.max(0.4, throttle * pulse * 2.2);

    if (leftExhaustRef.current) leftExhaustRef.current.scale.set(1, plumeLength, 1);
    if (rightExhaustRef.current) rightExhaustRef.current.scale.set(1, plumeLength, 1);
  });

  const hullMat = new THREE.MeshStandardMaterial({
    color: '#2a3b5c',
    metalness: 0.9,
    roughness: 0.18,
  });

  const armorMat = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    metalness: 0.95,
    roughness: 0.12,
  });

  const wingMat = new THREE.MeshStandardMaterial({
    color: '#3b3379',
    metalness: 0.85,
    roughness: 0.22,
  });

  const bridgeVisorMat = new THREE.MeshStandardMaterial({
    color: '#312e81',
    emissive: '#818cf8',
    emissiveIntensity: 1.2,
    metalness: 0.95,
    roughness: 0.05,
  });

  const ionGlowMat = new THREE.MeshBasicMaterial({
    color: '#8b5cf6',
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  const ionCoreMat = new THREE.MeshBasicMaterial({
    color: '#00e5ff',
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
  });

  return (
    <group ref={groupRef}>
      {/* 1. Main Science Fiction Wide Explorer Hull (Wedge/Arrowhead Architecture) */}
      <mesh material={hullMat} position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.35, 2.6]} />
      </mesh>
      {/* Titanium Center Spine Armor */}
      <mesh material={armorMat} position={[0, 0.18, 0]}>
        <boxGeometry args={[0.85, 0.05, 2.2]} />
      </mesh>

      {/* 2. Elevated Command Bridge Superstructure */}
      <mesh material={bridgeVisorMat} position={[0, 0.32, -0.4]}>
        <boxGeometry args={[0.7, 0.22, 1.1]} />
      </mesh>

      {/* 3. Twin Forward Science Sensor Mandibles / Scanner Prongs */}
      <mesh material={hullMat} position={[-0.45, 0, -1.9]}>
        <boxGeometry args={[0.22, 0.18, 1.4]} />
      </mesh>
      <mesh material={ionCoreMat} position={[-0.45, 0, -2.6]}>
        <sphereGeometry args={[0.1, 12, 12]} />
      </mesh>

      <mesh material={hullMat} position={[0.45, 0, -1.9]}>
        <boxGeometry args={[0.22, 0.18, 1.4]} />
      </mesh>
      <mesh material={ionCoreMat} position={[0.45, 0, -2.6]}>
        <sphereGeometry args={[0.1, 12, 12]} />
      </mesh>

      {/* 4. Wide Angular Outrigger Warp Wings */}
      <group position={[-1.3, 0.05, 0.3]} rotation={[0, -0.15, -0.08]}>
        <mesh material={wingMat}>
          <boxGeometry args={[1.4, 0.08, 1.8]} />
        </mesh>
        <mesh material={ionGlowMat} position={[-0.7, 0.18, 0]}>
          <boxGeometry args={[0.06, 0.45, 1.0]} />
        </mesh>
      </group>

      <group position={[1.3, 0.05, 0.3]} rotation={[0, 0.15, 0.08]}>
        <mesh material={wingMat}>
          <boxGeometry args={[1.4, 0.08, 1.8]} />
        </mesh>
        <mesh material={ionGlowMat} position={[0.7, 0.18, 0]}>
          <boxGeometry args={[0.06, 0.45, 1.0]} />
        </mesh>
      </group>

      {/* 5. Rotating Long-Range Planetary Sensor Dish */}
      <group ref={dishRef} position={[0, 0.45, 0.4]}>
        <mesh material={hullMat} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.05, 0.1, 16]} />
        </mesh>
        <mesh material={ionCoreMat} position={[0, 0.1, -0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
        </mesh>
      </group>

      {/* 6. Dual Heavy Ion Drive Thrusters */}
      <group position={[-0.42, 0, 1.4]}>
        <mesh material={hullMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.6, 16]} />
        </mesh>
        <mesh ref={leftExhaustRef} material={ionGlowMat} position={[0, 0, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.24, 1.8, 16]} />
        </mesh>
        <mesh material={ionCoreMat} position={[0, 0, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.9, 16]} />
        </mesh>
      </group>

      <group position={[0.42, 0, 1.4]}>
        <mesh material={hullMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.6, 16]} />
        </mesh>
        <mesh ref={rightExhaustRef} material={ionGlowMat} position={[0, 0, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.24, 1.8, 16]} />
        </mesh>
        <mesh material={ionCoreMat} position={[0, 0, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.9, 16]} />
        </mesh>
      </group>

      {/* Warp Lighting */}
      <pointLight position={[0, 0, 1.8]} color="#8b5cf6" intensity={4} distance={8} />
      <pointLight position={[0, 0, -2.4]} color="#00e5ff" intensity={3} distance={8} />
    </group>
  );
}
