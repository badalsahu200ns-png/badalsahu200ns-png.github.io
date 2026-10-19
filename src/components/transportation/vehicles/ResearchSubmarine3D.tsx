import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getBrushedMetalTexture } from '../textures/pbrTextures';

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
  const roboticArmRef = useRef<THREE.Group>(null);

  const brushedMetalMap = useMemo(() => getBrushedMetalTexture(), []);

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

      if (roboticArmRef.current) {
        roboticArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.12;
      }
    }

    // Spinning shrouded propulsion screws
    const propSpeed = delta * (18 + throttle * 28);
    if (leftPropRef.current) leftPropRef.current.rotation.z += propSpeed;
    if (rightPropRef.current) rightPropRef.current.rotation.z -= propSpeed;
  });

  // High contrast exploration yellow & white livery so it radiates against dark ocean depths
  const yellowHullMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    metalness: 0.85,
    roughness: 0.22,
  }), []);

  const orangeKeelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ea580c',
    metalness: 0.8,
    roughness: 0.25,
  }), []);

  const whiteSailMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    map: brushedMetalMap,
    metalness: 0.9,
    roughness: 0.18,
  }), [brushedMetalMap]);

  const portholeGlowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00e5ff',
    emissive: '#00e5ff',
    emissiveIntensity: 1.5,
    metalness: 0.9,
    roughness: 0.05,
  }), []);

  const acrylicDomeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0284c7',
    emissive: '#38bdf8',
    emissiveIntensity: 0.8,
    metalness: 0.95,
    roughness: 0.05,
    transparent: true,
    opacity: 0.85,
  }), []);

  const bronzePropBladeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d97706',
    metalness: 0.95,
    roughness: 0.2,
  }), []);

  return (
    <group ref={groupRef} scale={[1.25, 1.25, 1.25]}>
      {/* 1. Main Pressure Hull (Vibrant Exploration Yellow) */}
      <mesh material={yellowHullMat} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.75, 3.4, 24]} />
      </mesh>

      {/* Keel Guard (Safety Orange) */}
      <mesh material={orangeKeelMat} position={[0, -0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.15, 3.2]} />
      </mesh>

      {/* 2. Panoramic Acrylic Front Observation Dome */}
      <mesh material={acrylicDomeMat} position={[0, 0, -1.7]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <sphereGeometry args={[0.75, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* 3. Conning Tower / Scientific Sail (Titanium White) */}
      <mesh material={whiteSailMat} position={[0, 1.0, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 0.65, 1.3]} />
      </mesh>
      {/* Sensor Mast / Periscope Array */}
      <mesh material={whiteSailMat} position={[0, 1.45, -0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.38, 12]} />
      </mesh>
      <mesh material={portholeGlowMat} position={[0, 1.65, -0.4]}>
        <sphereGeometry args={[0.06, 12, 12]} />
      </mesh>

      {/* 4. Glowing Circular Observation Portholes (3 on each side) */}
      {[-0.6, 0, 0.6].map((zPos, i) => (
        <group key={`portholes-${i}`}>
          {/* Left Porthole */}
          <mesh material={portholeGlowMat} position={[-0.76, 0.15, zPos]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.14, 16]} />
          </mesh>
          {/* Right Porthole */}
          <mesh material={portholeGlowMat} position={[0.76, 0.15, zPos]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.14, 16]} />
          </mesh>
        </group>
      ))}

      {/* 5. Port and Starboard Diving Hydroplane Fins */}
      <mesh material={orangeKeelMat} position={[-1.05, 0.1, -0.6]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.7, 0.06, 0.5]} />
      </mesh>
      <mesh material={orangeKeelMat} position={[1.05, 0.1, -0.6]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.7, 0.06, 0.5]} />
      </mesh>

      {/* 6. Twin Shrouded Propulsion Screws with Polished Marine Bronze */}
      {/* Left Propulsor */}
      <group position={[-0.6, -0.1, 1.8]}>
        <mesh material={yellowHullMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.35, 16, 1, true]} />
        </mesh>
        <mesh ref={leftPropRef} material={bronzePropBladeMat}>
          <boxGeometry args={[0.55, 0.09, 0.04]} />
        </mesh>
      </group>

      {/* Right Propulsor */}
      <group position={[0.6, -0.1, 1.8]}>
        <mesh material={yellowHullMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.35, 16, 1, true]} />
        </mesh>
        <mesh ref={rightPropRef} material={bronzePropBladeMat}>
          <boxGeometry args={[0.55, 0.09, 0.04]} />
        </mesh>
      </group>

      {/* 7. Forward Articulated Robotic Sampling Arm */}
      <group ref={roboticArmRef} position={[0.35, -0.45, -1.5]}>
        <mesh material={whiteSailMat} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
        </mesh>
        <mesh material={whiteSailMat} position={[0, -0.15, -0.3]} rotation={[-0.5, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        </mesh>
        {/* Sample Collector Claw */}
        <mesh material={bronzePropBladeMat} position={[0, -0.28, -0.45]}>
          <boxGeometry args={[0.08, 0.06, 0.08]} />
        </mesh>
      </group>

      {/* 8. High-Powered Deep Ocean Searchlights & Forward Conical Beams */}
      <pointLight position={[0, -0.1, -2.6]} color="#ffffff" intensity={6} distance={20} />
      <pointLight position={[-0.7, 0.3, -1.9]} color="#00e5ff" intensity={3.5} distance={14} />
      <pointLight position={[0.7, 0.3, -1.9]} color="#00e5ff" intensity={3.5} distance={14} />
      <pointLight position={[0, 1.2, 0]} color="#fbbf24" intensity={2.5} distance={8} />
    </group>
  );
}

export default ResearchSubmarine3D;
