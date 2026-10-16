import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function NeuralTransitPod3D({
  throttle = 0.85,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const consoleRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      const targetRoll = -banking.x * 0.35;
      const targetPitch = banking.y * 0.25;
      const targetYaw = -banking.x * 0.2;

      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.08;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.08;
      groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.08;

      // Neural conduit levitation frequency
      const hover = Math.sin(state.clock.elapsedTime * 4.5) * 0.05;
      groupRef.current.position.y = hover;
    }

    // Rotating synaptic magnetic guide rings modulated by throttle
    const ringSpeed = delta * (2.0 + throttle * 2.5);
    if (ringRef1.current) ringRef1.current.rotation.z += ringSpeed;
    if (ringRef2.current) ringRef2.current.rotation.z -= ringSpeed;

    // Pulsing neural energy core
    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    if (consoleRef.current) {
      const flicker = 0.8 + Math.sin(state.clock.elapsedTime * 15) * 0.2;
      consoleRef.current.scale.set(1, flicker, 1);
    }
  });

  const podChassisMat = new THREE.MeshStandardMaterial({
    color: '#1e1b4b',
    metalness: 0.9,
    roughness: 0.18,
  });

  const chromeTrimMat = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    metalness: 0.95,
    roughness: 0.1,
  });

  // Ultra-clear transparent glass canopy
  const crystalGlassMat = new THREE.MeshPhysicalMaterial({
    color: '#818cf8',
    emissive: '#4338ca',
    emissiveIntensity: 0.2,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9,
    transparent: true,
    opacity: 0.45,
    ior: 1.5,
  });

  const neuralGlowMat = new THREE.MeshBasicMaterial({
    color: '#818cf8',
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  const cyanConduitMat = new THREE.MeshBasicMaterial({
    color: '#00e5ff',
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  const seatMat = new THREE.MeshStandardMaterial({
    color: '#312e81',
    metalness: 0.6,
    roughness: 0.4,
  });

  return (
    <group ref={groupRef} scale={[1.25, 1.25, 1.25]}>
      {/* 1. Lower Aerodynamic Keel Chassis */}
      <mesh material={podChassisMat} position={[0, -0.3, 0]}>
        <boxGeometry args={[1.1, 0.25, 3.0]} />
      </mesh>
      <mesh material={chromeTrimMat} position={[0, -0.35, 0]}>
        <boxGeometry args={[0.3, 0.08, 3.2]} />
      </mesh>

      {/* 2. Transparent Futuristic Canopy Bubble (Revealing interior) */}
      <mesh material={crystalGlassMat} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 2.6, 24]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      {/* Front Spherical Glass Nose */}
      <mesh material={crystalGlassMat} position={[0, 0.15, -1.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.62, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Rear Tapered Cap */}
      <mesh material={podChassisMat} position={[0, 0.15, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.62, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* 3. VISIBLE INTERIOR: Passenger Seats & Holographic Console */}
      <group position={[0, -0.1, 0]}>
        {/* Forward Pilot/Passenger Seat */}
        <mesh material={seatMat} position={[0, 0.08, -0.4]}>
          <boxGeometry args={[0.45, 0.35, 0.4]} />
        </mesh>
        {/* Rear Passenger Seat */}
        <mesh material={seatMat} position={[0, 0.08, 0.4]}>
          <boxGeometry args={[0.45, 0.35, 0.4]} />
        </mesh>
        {/* Glowing Holographic Terminal HUD Console */}
        <mesh ref={consoleRef} material={cyanConduitMat} position={[0, 0.28, -0.85]} rotation={[-0.3, 0, 0]}>
          <planeGeometry args={[0.38, 0.22]} />
        </mesh>
      </group>

      {/* 4. Internal Pulsing Synaptic Energy Core */}
      <mesh ref={coreRef} material={cyanConduitMat} position={[0, 0.25, 0.8]}>
        <octahedronGeometry args={[0.25, 0]} />
      </mesh>

      {/* 5. Synaptic Magnetic Guide Rings */}
      <mesh ref={ringRef1} material={neuralGlowMat} position={[0, 0.15, -0.6]}>
        <torusGeometry args={[0.82, 0.045, 12, 24]} />
      </mesh>
      <mesh ref={ringRef2} material={cyanConduitMat} position={[0, 0.15, 0.6]}>
        <torusGeometry args={[0.82, 0.045, 12, 24]} />
      </mesh>

      {/* 6. Lateral Fiber-Optic Data Conduits */}
      <mesh material={neuralGlowMat} position={[-0.68, 0.15, 0]}>
        <boxGeometry args={[0.04, 0.12, 2.8]} />
      </mesh>
      <mesh material={neuralGlowMat} position={[0.68, 0.15, 0]}>
        <boxGeometry args={[0.04, 0.12, 2.8]} />
      </mesh>

      {/* Illumination */}
      <pointLight position={[0, 0.3, -0.8]} color="#00e5ff" intensity={4} distance={8} />
      <pointLight position={[0, 0.3, 0.8]} color="#818cf8" intensity={3.5} distance={8} />
    </group>
  );
}

export default NeuralTransitPod3D;
