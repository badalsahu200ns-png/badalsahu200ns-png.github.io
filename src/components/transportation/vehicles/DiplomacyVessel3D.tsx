import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function DiplomacyVessel3D({
  throttle = 0.8,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const engineRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      const targetRoll = -banking.x * 0.35;
      const targetPitch = banking.y * 0.22;
      const targetYaw = -banking.x * 0.18;

      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.08;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.08;
      groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.08;

      // Slow majestic cruise drift
      const drift = Math.sin(state.clock.elapsedTime * 2.5) * 0.04;
      groupRef.current.position.y = drift;
    }

    // Engine thrust plume
    const pulse = 0.9 + Math.sin(state.clock.elapsedTime * 24) * 0.1;
    if (engineRef.current) {
      engineRef.current.scale.set(1, throttle * pulse * 2.0, 1);
    }
  });

  const hullMat = new THREE.MeshStandardMaterial({
    color: '#24334c',
    metalness: 0.92,
    roughness: 0.16,
  });

  const goldAlloyMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    metalness: 0.95,
    roughness: 0.15,
  });

  const bridgeVisorMat = new THREE.MeshStandardMaterial({
    color: '#0891b2',
    emissive: '#00e5ff',
    emissiveIntensity: 1.2,
    metalness: 0.9,
    roughness: 0.05,
  });

  const cyanDriveMat = new THREE.MeshBasicMaterial({
    color: '#00e5ff',
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  return (
    <group ref={groupRef}>
      {/* 1. Main Diplomatic Cruiser Hull */}
      <mesh material={hullMat} position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.75, 4.0, 16]} />
      </mesh>

      {/* 2. Command Bridge Observation Lounge */}
      <mesh material={bridgeVisorMat} position={[0, 0.42, -1.2]}>
        <boxGeometry args={[0.55, 0.26, 1.4]} />
      </mesh>

      {/* 3. Forward Docking Clamp Probe */}
      <mesh material={goldAlloyMat} position={[0, 0, -2.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.25, 0.8, 12]} />
      </mesh>

      {/* 4. Left Swept Diplomatic Solar Wing */}
      <group ref={leftWingRef} position={[-1.1, 0, 0.3]} rotation={[0, -0.15, -0.06]}>
        <mesh material={hullMat}>
          <boxGeometry args={[1.6, 0.05, 2.0]} />
        </mesh>
        <mesh material={goldAlloyMat} position={[0, 0.04, -0.9]}>
          <boxGeometry args={[1.5, 0.03, 0.1]} />
        </mesh>
      </group>

      {/* 5. Right Swept Diplomatic Solar Wing */}
      <group ref={rightWingRef} position={[1.1, 0, 0.3]} rotation={[0, 0.15, 0.06]}>
        <mesh material={hullMat}>
          <boxGeometry args={[1.6, 0.05, 2.0]} />
        </mesh>
        <mesh material={goldAlloyMat} position={[0, 0.04, -0.9]}>
          <boxGeometry args={[1.5, 0.03, 0.1]} />
        </mesh>
      </group>

      {/* 6. Center Rear Heavy Ion Engine */}
      <group position={[0, 0, 1.6]}>
        <mesh material={hullMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
        </mesh>
        <mesh ref={engineRef} material={cyanDriveMat} position={[0, 0, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.32, 1.8, 16]} />
        </mesh>
      </group>

      <pointLight position={[0, 0, 2.0]} color="#00e5ff" intensity={4} distance={8} />
      <pointLight position={[0, 0.3, -2.6]} color="#ffffff" intensity={3} distance={10} />
    </group>
  );
}
