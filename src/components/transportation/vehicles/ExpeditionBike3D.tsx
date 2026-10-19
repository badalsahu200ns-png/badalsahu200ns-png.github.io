import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTireTreadTexture, getCarbonFiberTexture, getBrushedMetalTexture } from '../textures/pbrTextures';

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
  const dustRef = useRef<THREE.Points>(null);

  const tireTreadMap = useMemo(() => getTireTreadTexture(), []);
  const carbonMap = useMemo(() => getCarbonFiberTexture(), []);
  const brushedMetalMap = useMemo(() => getBrushedMetalTexture(), []);

  // Rear tire kicked-up dust/gravel particles
  const dustParticles = useMemo(() => {
    const count = 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = 0.15 + Math.random() * 0.5;
      positions[i * 3 + 2] = 1.35 + Math.random() * 1.6;
    }
    return positions;
  }, []);

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

      if (dustRef.current) {
        const positions = dustRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3 + 2] += delta * 15 * throttle;
          positions[i * 3 + 1] += delta * 0.8;
          if (positions[i * 3 + 2] > 3.2) {
            positions[i * 3 + 2] = 1.35;
            positions[i * 3 + 1] = 0.15 + Math.random() * 0.2;
          }
        }
        dustRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }

    // High speed wheel spinning
    const wheelRot = delta * (30 + throttle * 40);
    if (frontWheelRef.current) frontWheelRef.current.rotation.x += wheelRot;
    if (rearWheelRef.current) rearWheelRef.current.rotation.x += wheelRot;
  });

  // Materials: High contrast, off-road cyber styling
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0f172a',
    map: carbonMap,
    metalness: 0.9,
    roughness: 0.2,
  }), [carbonMap]);

  const chromeForkMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    map: brushedMetalMap,
    metalness: 0.96,
    roughness: 0.1,
  }), [brushedMetalMap]);

  const neonGreenMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#10b981',
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  }), []);

  const cyanAccentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00e5ff',
    emissive: '#00e5ff',
    emissiveIntensity: 1.2,
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  const tireMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#020617',
    map: tireTreadMap,
    roughness: 0.85,
    metalness: 0.15,
  }), [tireTreadMap]);

  const seatMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.9,
  }), []);

  return (
    <group ref={groupRef} scale={[1.35, 1.35, 1.35]}>
      {/* 1. Main Cyber Chassis & Engine Block */}
      <mesh material={frameMat} position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.45, 2.0]} />
      </mesh>

      {/* Cyber Fuel Tank / Power Core */}
      <mesh material={chromeForkMat} position={[0, 0.8, -0.3]} castShadow receiveShadow>
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
      <mesh material={seatMat} position={[0, 0.72, 0.5]} castShadow receiveShadow>
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
        <mesh material={seatMat} position={[-0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
        </mesh>
        <mesh material={seatMat} position={[0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
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

      {/* 8. Kicked-Up Terrain Dust Particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#10b981"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default ExpeditionBike3D;
