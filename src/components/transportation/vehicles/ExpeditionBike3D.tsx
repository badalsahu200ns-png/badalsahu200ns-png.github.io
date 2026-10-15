import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function ExpeditionBike3D({
  throttle = 0.9,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Group>(null);
  const rearWheelRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      // Dynamic motorcycle lean on steering
      const targetRoll = -banking.x * 0.55;
      const targetPitch = banking.y * 0.2;
      const targetYaw = -banking.x * 0.25;

      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.12;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.12;
      groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.12;

      // Terrain vibration
      const vib = Math.sin(state.clock.elapsedTime * 50) * 0.015 * throttle;
      groupRef.current.position.y = vib;
    }

    // High speed wheel spinning
    const wheelRot = delta * (30 + throttle * 40);
    if (frontWheelRef.current) frontWheelRef.current.rotation.x += wheelRot;
    if (rearWheelRef.current) rearWheelRef.current.rotation.x += wheelRot;
  });

  const frameMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.9,
    roughness: 0.2,
  });

  const neonGreenMat = new THREE.MeshBasicMaterial({
    color: '#10b981',
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: '#020617',
    roughness: 0.8,
    metalness: 0.2,
  });

  const visorMat = new THREE.MeshStandardMaterial({
    color: '#059669',
    emissive: '#10b981',
    emissiveIntensity: 1.2,
    metalness: 0.9,
    roughness: 0.1,
  });

  return (
    <group ref={groupRef}>
      {/* 1. Low-slung Cyber Chassis Body */}
      <mesh material={frameMat} position={[0, 0.45, 0]}>
        <boxGeometry args={[0.55, 0.45, 2.4]} />
      </mesh>

      {/* 2. Aerodynamic Cockpit Fairing & Windshield */}
      <mesh material={visorMat} position={[0, 0.72, -0.6]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.42, 0.28, 0.7]} />
      </mesh>

      {/* 3. Lateral Cyber Panels & Radiator Accents */}
      <mesh material={neonGreenMat} position={[-0.3, 0.45, 0]}>
        <boxGeometry args={[0.04, 0.15, 1.8]} />
      </mesh>
      <mesh material={neonGreenMat} position={[0.3, 0.45, 0]}>
        <boxGeometry args={[0.04, 0.15, 1.8]} />
      </mesh>

      {/* 4. Front Hubless Heavy Wheel */}
      <group position={[0, 0.4, -1.3]}>
        <group ref={frontWheelRef}>
          {/* Tire Ring */}
          <mesh material={tireMat} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.42, 0.14, 16, 24]} />
          </mesh>
          {/* Neon Rim Strip */}
          <mesh material={neonGreenMat} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.34, 0.04, 12, 24]} />
          </mesh>
        </group>
      </group>

      {/* 5. Rear Hubless Drive Wheel */}
      <group position={[0, 0.45, 1.3]}>
        <group ref={rearWheelRef}>
          {/* Wide Rear Tire */}
          <mesh material={tireMat} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.46, 0.18, 16, 24]} />
          </mesh>
          <mesh material={neonGreenMat} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.38, 0.05, 12, 24]} />
          </mesh>
        </group>
      </group>

      {/* 6. Powerful Cyber Headlight Beam */}
      <pointLight position={[0, 0.5, -2.0]} color="#10b981" intensity={5} distance={15} />
      <pointLight position={[0, 0.3, 1.8]} color="#10b981" intensity={3} distance={5} />
    </group>
  );
}
