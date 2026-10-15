import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function ResearchSubmarine3D({
  throttle = 0.8,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftPropRef = useRef<THREE.Mesh>(null);
  const rightPropRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      const targetRoll = -banking.x * 0.25;
      const targetPitch = banking.y * 0.22;
      const targetYaw = -banking.x * 0.15;

      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.06;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.06;
      groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.06;

      // Gentle underwater buoyant pitch & roll
      const buoyancy = Math.sin(state.clock.elapsedTime * 2.2) * 0.06;
      groupRef.current.position.y = buoyancy;
    }

    // Spinning shrouded propulsion screws
    const propSpeed = delta * (15 + throttle * 25);
    if (leftPropRef.current) leftPropRef.current.rotation.z += propSpeed;
    if (rightPropRef.current) rightPropRef.current.rotation.z -= propSpeed;
  });

  const pressureHullMat = new THREE.MeshStandardMaterial({
    color: '#0369a1',
    metalness: 0.8,
    roughness: 0.28,
  });

  const alloyTrimMat = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    metalness: 0.9,
    roughness: 0.2,
  });

  const acrylicDomeMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    emissive: '#38bdf8',
    emissiveIntensity: 0.6,
    metalness: 0.95,
    roughness: 0.05,
    transparent: true,
    opacity: 0.85,
  });

  const propBladeMat = new THREE.MeshStandardMaterial({
    color: '#bae6fd',
    metalness: 0.95,
    roughness: 0.1,
  });

  return (
    <group ref={groupRef}>
      {/* 1. Main Pressure Hull */}
      <mesh material={pressureHullMat} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 3.2, 24]} />
      </mesh>

      {/* 2. Panoramic Acrylic Observation Dome */}
      <mesh material={acrylicDomeMat} position={[0, 0, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.7, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* 3. Conning Tower / Sail */}
      <mesh material={alloyTrimMat} position={[0, 0.95, -0.2]}>
        <boxGeometry args={[0.3, 0.6, 1.2]} />
      </mesh>
      {/* Periscope / Sensor Mast */}
      <mesh material={pressureHullMat} position={[0, 1.35, -0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
      </mesh>

      {/* 4. Port and Starboard Diving Hydroplanes */}
      <mesh material={alloyTrimMat} position={[-0.95, 0.1, -0.6]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.65, 0.05, 0.45]} />
      </mesh>
      <mesh material={alloyTrimMat} position={[0.95, 0.1, -0.6]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.65, 0.05, 0.45]} />
      </mesh>

      {/* 5. Twin Shrouded Propulsion Screws */}
      {/* Left Propulsor */}
      <group position={[-0.55, -0.1, 1.7]}>
        <mesh material={pressureHullMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.3, 16, 1, true]} />
        </mesh>
        <mesh ref={leftPropRef} material={propBladeMat}>
          <boxGeometry args={[0.5, 0.08, 0.04]} />
        </mesh>
      </group>

      {/* Right Propulsor */}
      <group position={[0.55, -0.1, 1.7]}>
        <mesh material={pressureHullMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.3, 16, 1, true]} />
        </mesh>
        <mesh ref={rightPropRef} material={propBladeMat}>
          <boxGeometry args={[0.5, 0.08, 0.04]} />
        </mesh>
      </group>

      {/* 6. High-Powered Deep Ocean Searchlights */}
      <pointLight position={[0, -0.1, -2.4]} color="#bae6fd" intensity={5} distance={18} />
      <pointLight position={[-0.6, 0.2, -1.8]} color="#38bdf8" intensity={3} distance={12} />
      <pointLight position={[0.6, 0.2, -1.8]} color="#38bdf8" intensity={3} distance={12} />
    </group>
  );
}
