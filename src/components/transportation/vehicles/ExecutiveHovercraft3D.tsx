import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function ExecutiveHovercraft3D({
  throttle = 0.85,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftThrusterRef = useRef<THREE.Mesh>(null);
  const rightThrusterRef = useRef<THREE.Mesh>(null);
  const leftRingRef = useRef<THREE.Mesh>(null);
  const rightRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      const targetRoll = -banking.x * 0.35;
      const targetPitch = banking.y * 0.22;
      const targetYaw = -banking.x * 0.18;

      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.08;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.08;
      groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.08;

      // Antigravity levitation bob
      const hover = Math.sin(state.clock.elapsedTime * 3.5) * 0.06;
      groupRef.current.position.y = hover;
    }

    // Engine glow pulse & repulsor ring rotation
    const time = state.clock.elapsedTime;
    const pulse = 0.85 + Math.sin(time * 25) * 0.15;
    const plumeLength = Math.max(0.4, throttle * pulse * 2.2);

    if (leftThrusterRef.current) leftThrusterRef.current.scale.set(1, plumeLength, 1);
    if (rightThrusterRef.current) rightThrusterRef.current.scale.set(1, plumeLength, 1);

    if (leftRingRef.current) leftRingRef.current.rotation.z += delta * 4;
    if (rightRingRef.current) rightRingRef.current.rotation.z -= delta * 4;
  });

  const hullMaterial = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.88,
    roughness: 0.2,
  });

  const silverTrimMaterial = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    metalness: 0.95,
    roughness: 0.15,
  });

  const canopyMaterial = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    emissive: '#00e5ff',
    emissiveIntensity: 0.9,
    metalness: 0.9,
    roughness: 0.08,
  });

  const cyanGlowMaterial = new THREE.MeshBasicMaterial({
    color: '#00e5ff',
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  const flameCoreMaterial = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
  });

  return (
    <group ref={groupRef}>
      {/* 1. Main Luxury Aerodynamic Fuselage */}
      <mesh material={hullMaterial} position={[0, 0, -0.2]}>
        <boxGeometry args={[1.6, 0.45, 3.2]} />
      </mesh>

      {/* 2. Sleek Front Hood Taper */}
      <mesh material={silverTrimMaterial} position={[0, -0.05, -1.8]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[1.3, 0.32, 1.2]} />
      </mesh>

      {/* 3. Executive Panoramic Cockpit Canopy */}
      <mesh material={canopyMaterial} position={[0, 0.35, -0.5]}>
        <boxGeometry args={[1.05, 0.38, 1.6]} />
      </mesh>

      {/* 4. Left Antigravity Repulsor Ring & Housing */}
      <group position={[-1.1, -0.15, 0.3]}>
        <mesh material={hullMaterial}>
          <cylinderGeometry args={[0.65, 0.65, 0.22, 24]} />
        </mesh>
        <mesh ref={leftRingRef} material={cyanGlowMaterial} position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.06, 12, 24]} />
        </mesh>
        <pointLight position={[0, -0.3, 0]} color="#00e5ff" intensity={2.5} distance={3.5} />
      </group>

      {/* 5. Right Antigravity Repulsor Ring & Housing */}
      <group position={[1.1, -0.15, 0.3]}>
        <mesh material={hullMaterial}>
          <cylinderGeometry args={[0.65, 0.65, 0.22, 24]} />
        </mesh>
        <mesh ref={rightRingRef} material={cyanGlowMaterial} position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.06, 12, 24]} />
        </mesh>
        <pointLight position={[0, -0.3, 0]} color="#00e5ff" intensity={2.5} distance={3.5} />
      </group>

      {/* 6. Aerodynamic Stabilizer Fins */}
      <mesh material={silverTrimMaterial} position={[-0.95, 0.45, 1.2]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.08, 0.65, 0.9]} />
      </mesh>
      <mesh material={silverTrimMaterial} position={[0.95, 0.45, 1.2]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.08, 0.65, 0.9]} />
      </mesh>

      {/* 7. Twin Rear Jet/Ion Propulsion Thrusters */}
      <group position={[-0.45, 0.05, 1.5]}>
        <mesh material={hullMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.5, 16]} />
        </mesh>
        {/* Exhaust Plume */}
        <mesh ref={leftThrusterRef} material={cyanGlowMaterial} position={[0, 0, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.22, 1.6, 16]} />
        </mesh>
        <mesh material={flameCoreMaterial} position={[0, 0, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.7, 16]} />
        </mesh>
      </group>

      <group position={[0.45, 0.05, 1.5]}>
        <mesh material={hullMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.5, 16]} />
        </mesh>
        {/* Exhaust Plume */}
        <mesh ref={rightThrusterRef} material={cyanGlowMaterial} position={[0, 0, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.22, 1.6, 16]} />
        </mesh>
        <mesh material={flameCoreMaterial} position={[0, 0, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.7, 16]} />
        </mesh>
      </group>

      {/* Front Accent Headlights */}
      <pointLight position={[0, 0.1, -2.4]} color="#00e5ff" intensity={3.5} distance={8} />
      <pointLight position={[0, 0.2, 1.8]} color="#00e5ff" intensity={4.0} distance={6} />
    </group>
  );
}
