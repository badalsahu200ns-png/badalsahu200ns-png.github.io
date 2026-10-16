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

      // Terrain engine vibration
      const vib = Math.sin(state.clock.elapsedTime * 45) * 0.015 * throttle;
      groupRef.current.position.y = vib;
    }

    // High speed wheel spinning
    const wheelRot = delta * (30 + throttle * 40);
    if (frontWheelRef.current) frontWheelRef.current.rotation.x += wheelRot;
    if (rearWheelRef.current) rearWheelRef.current.rotation.x += wheelRot;
  });

  // Materials: High contrast, off-road cyber styling
  const frameMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    metalness: 0.9,
    roughness: 0.2,
  });

  const chromeForkMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    metalness: 0.96,
    roughness: 0.1,
  });

  const neonGreenMat = new THREE.MeshBasicMaterial({
    color: '#10b981',
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  const cyanAccentMat = new THREE.MeshStandardMaterial({
    color: '#00e5ff',
    emissive: '#00e5ff',
    emissiveIntensity: 1.2,
    metalness: 0.9,
    roughness: 0.1,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: '#020617',
    roughness: 0.85,
    metalness: 0.15,
  });

  const seatMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.9,
  });

  return (
    <group ref={groupRef} scale={[1.35, 1.35, 1.35]}>
      {/* 1. Main Cyber Chassis & Engine Block */}
      <mesh material={frameMat} position={[0, 0.48, 0]}>
        <boxGeometry args={[0.55, 0.45, 2.0]} />
      </mesh>

      {/* Cyber Fuel Tank / Power Core */}
      <mesh material={chromeForkMat} position={[0, 0.8, -0.3]}>
        <boxGeometry args={[0.48, 0.32, 1.0]} />
      </mesh>
      {/* Neon Green Tank Graphic Stripes */}
      <mesh material={neonGreenMat} position={[-0.25, 0.8, -0.3]}>
        <boxGeometry args={[0.02, 0.12, 0.85]} />
      </mesh>
      <mesh material={neonGreenMat} position={[0.25, 0.8, -0.3]}>
        <boxGeometry args={[0.02, 0.12, 0.85]} />
      </mesh>

      {/* Ergonomic Pilot Saddle */}
      <mesh material={seatMat} position={[0, 0.72, 0.5]}>
        <boxGeometry args={[0.42, 0.14, 0.75]} />
      </mesh>

      {/* 2. Front Fork Suspension & Handlebars */}
      {/* Left & Right Fork Stanchions */}
      <mesh material={chromeForkMat} position={[-0.22, 0.55, -0.95]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.2, 12]} />
      </mesh>
      <mesh material={chromeForkMat} position={[0.22, 0.55, -0.95]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.2, 12]} />
      </mesh>

      {/* Wide Off-road Handlebars with Grips */}
      <group position={[0, 1.05, -0.8]}>
        <mesh material={chromeForkMat}>
          <boxGeometry args={[1.05, 0.04, 0.04]} />
        </mesh>
        {/* Left & Right Grips */}
        <mesh material={seatMat} position={[-0.48, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} rotation={[0, 0, Math.PI / 2]} />
        </mesh>
        <mesh material={seatMat} position={[0.48, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} rotation={[0, 0, Math.PI / 2]} />
        </mesh>
      </group>

      {/* 3. Aerodynamic Front Windscreen / Mask */}
      <mesh material={cyanAccentMat} position={[0, 0.88, -0.92]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.36, 0.32, 0.3]} />
      </mesh>

      {/* 4. Rear Swingarm Suspension Structure */}
      <mesh material={chromeForkMat} position={[-0.2, 0.42, 0.8]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.05, 0.08, 1.1]} />
      </mesh>
      <mesh material={chromeForkMat} position={[0.2, 0.42, 0.8]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.05, 0.08, 1.1]} />
      </mesh>

      {/* 5. Front Heavy Spoked Wheel with Neon Rim */}
      <group position={[0, 0.45, -1.35]}>
        <group ref={frontWheelRef}>
          {/* Chunky Off-road Tire */}
          <mesh material={tireMat} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.46, 0.16, 16, 24]} />
          </mesh>
          {/* Radiant Neon Green Rim Strip */}
          <mesh material={neonGreenMat} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.36, 0.045, 12, 24]} />
          </mesh>
          {/* Wheel Hub & Spokes */}
          <mesh material={chromeForkMat} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.28, 12]} />
          </mesh>
        </group>
      </group>

      {/* 6. Rear High-Torque Wide Drive Wheel */}
      <group position={[0, 0.48, 1.35]}>
        <group ref={rearWheelRef}>
          {/* Wide Rear Tire */}
          <mesh material={tireMat} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.5, 0.2, 16, 24]} />
          </mesh>
          {/* Radiant Neon Green Rim Strip */}
          <mesh material={neonGreenMat} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.4, 0.055, 12, 24]} />
          </mesh>
          {/* Wheel Hub */}
          <mesh material={chromeForkMat} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 0.36, 12]} />
          </mesh>
        </group>
      </group>

      {/* 7. Dual Cyber Headlight Beams */}
      <pointLight position={[0, 0.75, -1.6]} color="#ffffff" intensity={5} distance={18} />
      <pointLight position={[0, 0.6, -1.4]} color="#10b981" intensity={3} distance={10} />
      {/* Rear Tail Light */}
      <pointLight position={[0, 0.65, 1.4]} color="#ef4444" intensity={2} distance={5} />
    </group>
  );
}

export default ExpeditionBike3D;
