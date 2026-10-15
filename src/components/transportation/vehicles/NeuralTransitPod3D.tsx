import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function NeuralTransitPod3D({
  throttle: _throttle = 0.85,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

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

    // Rotating synaptic magnetic guide rings
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 3;
    if (ringRef2.current) ringRef2.current.rotation.z -= delta * 3;

    // Pulsing neural core
    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const podHullMat = new THREE.MeshStandardMaterial({
    color: '#2e2968',
    metalness: 0.9,
    roughness: 0.15,
  });

  const neuralGlowMat = new THREE.MeshBasicMaterial({
    color: '#6366f1',
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

  const crystalGlassMat = new THREE.MeshStandardMaterial({
    color: '#312e81',
    emissive: '#4338ca',
    emissiveIntensity: 0.8,
    metalness: 0.95,
    roughness: 0.05,
    transparent: true,
    opacity: 0.8,
  });

  return (
    <group ref={groupRef}>
      {/* 1. Main Crystalline Pod Capsule */}
      <mesh material={podHullMat} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 2.8, 16]} />
      </mesh>

      {/* 2. Front and Rear Tapered Domes */}
      <mesh material={crystalGlassMat} position={[0, 0, -1.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.55, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh material={podHullMat} position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.55, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* 3. Internal Pulsing Synaptic Energy Core */}
      <mesh ref={coreRef} material={cyanConduitMat} position={[0, 0, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
      </mesh>

      {/* 4. Synaptic Guide Rings */}
      <mesh ref={ringRef1} material={neuralGlowMat} position={[0, 0, -0.6]}>
        <torusGeometry args={[0.75, 0.05, 12, 24]} />
      </mesh>
      <mesh ref={ringRef2} material={cyanConduitMat} position={[0, 0, 0.6]}>
        <torusGeometry args={[0.75, 0.05, 12, 24]} />
      </mesh>

      {/* 5. Lateral Fiber-Optic Data Conduits */}
      <mesh material={neuralGlowMat} position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.04, 0.15, 2.6]} />
      </mesh>
      <mesh material={neuralGlowMat} position={[0.6, 0, 0]}>
        <boxGeometry args={[0.04, 0.15, 2.6]} />
      </mesh>

      {/* Illumination */}
      <pointLight position={[0, 0, 0]} color="#00e5ff" intensity={4} distance={6} />
      <pointLight position={[0, 0, -1.8]} color="#6366f1" intensity={3} distance={8} />
    </group>
  );
}
