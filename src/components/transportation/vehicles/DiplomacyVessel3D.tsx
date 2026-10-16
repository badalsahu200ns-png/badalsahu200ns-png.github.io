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
  const engineLeftRef = useRef<THREE.Mesh>(null);
  const engineRightRef = useRef<THREE.Mesh>(null);
  const dockingRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
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

    // Engine thrust plumes
    const pulse = 0.9 + Math.sin(state.clock.elapsedTime * 24) * 0.1;
    const plumeScale = throttle * pulse * 2.0;
    if (engineLeftRef.current) engineLeftRef.current.scale.set(1, plumeScale, 1);
    if (engineRightRef.current) engineRightRef.current.scale.set(1, plumeScale, 1);

    // Rotating docking alignment collar
    if (dockingRingRef.current) {
      dockingRingRef.current.rotation.z += delta * 0.8;
    }
  });

  // Radiant diplomatic white & gold interstellar livery
  const whiteHullMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    metalness: 0.88,
    roughness: 0.18,
  });

  const goldAlloyMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    emissive: '#d97706',
    emissiveIntensity: 0.3,
    metalness: 0.95,
    roughness: 0.12,
  });

  const bridgeVisorMat = new THREE.MeshStandardMaterial({
    color: '#00e5ff',
    emissive: '#00e5ff',
    emissiveIntensity: 1.5,
    metalness: 0.95,
    roughness: 0.05,
  });

  const cyanDriveMat = new THREE.MeshBasicMaterial({
    color: '#00e5ff',
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
  });

  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    metalness: 0.9,
    roughness: 0.2,
  });

  return (
    <group ref={groupRef} scale={[1.25, 1.25, 1.25]}>
      {/* 1. Main Diplomatic Cruiser Fuselage (Titanium White & Gold) */}
      <mesh material={whiteHullMat} position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.82, 4.2, 16]} />
      </mesh>

      {/* Gold Trim Belly Keel */}
      <mesh material={goldAlloyMat} position={[0, -0.42, 0]}>
        <boxGeometry args={[0.3, 0.1, 3.8]} />
      </mesh>

      {/* 2. Command Bridge Panoramic Observation Lounge */}
      <mesh material={bridgeVisorMat} position={[0, 0.46, -1.3]}>
        <boxGeometry args={[0.62, 0.28, 1.5]} />
      </mesh>

      {/* 3. Forward Orbital Docking Collar Clamp Ring */}
      <group position={[0, 0.42, 0.2]}>
        <mesh ref={dockingRingRef} material={goldAlloyMat} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.06, 12, 24]} />
        </mesh>
        <mesh material={darkTrimMat} position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.1, 16]} />
        </mesh>
      </group>

      {/* 4. Swept Diplomatic Solar Wings */}
      {/* Left Wing */}
      <group ref={leftWingRef} position={[-1.25, 0, 0.4]} rotation={[0, -0.18, -0.06]}>
        <mesh material={whiteHullMat}>
          <boxGeometry args={[1.8, 0.06, 2.2]} />
        </mesh>
        <mesh material={goldAlloyMat} position={[0, 0.04, -1.0]}>
          <boxGeometry args={[1.75, 0.03, 0.14]} />
        </mesh>
        {/* Wingtip Beacon */}
        <mesh position={[-0.9, 0, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Right Wing */}
      <group ref={rightWingRef} position={[1.25, 0, 0.4]} rotation={[0, 0.18, 0.06]}>
        <mesh material={whiteHullMat}>
          <boxGeometry args={[1.8, 0.06, 2.2]} />
        </mesh>
        <mesh material={goldAlloyMat} position={[0, 0.04, -1.0]}>
          <boxGeometry args={[1.75, 0.03, 0.14]} />
        </mesh>
        {/* Wingtip Beacon */}
        <mesh position={[0.9, 0, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* 5. Twin Rear Heavy Ion Thrusters */}
      <group position={[-0.45, 0, 1.8]}>
        <mesh material={darkTrimMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.32, 0.65, 16]} />
        </mesh>
        <mesh ref={engineLeftRef} material={cyanDriveMat} position={[0, 0, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.28, 1.8, 16]} />
        </mesh>
      </group>

      <group position={[0.45, 0, 1.8]}>
        <mesh material={darkTrimMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.32, 0.65, 16]} />
        </mesh>
        <mesh ref={engineRightRef} material={cyanDriveMat} position={[0, 0, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.28, 1.8, 16]} />
        </mesh>
      </group>

      {/* Illuminations */}
      <pointLight position={[0, 0, 2.2]} color="#00e5ff" intensity={5} distance={10} />
      <pointLight position={[0, 0.6, -1.5]} color="#ffffff" intensity={4} distance={12} />
      <pointLight position={[0, 0.6, 0.2]} color="#f59e0b" intensity={3} distance={6} />
    </group>
  );
}

export default DiplomacyVessel3D;
