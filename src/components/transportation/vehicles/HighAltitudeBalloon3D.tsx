import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function HighAltitudeBalloon3D({
  throttle = 0.75,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const gondolaRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      const targetRoll = -banking.x * 0.15;
      const targetPitch = banking.y * 0.12;

      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.05;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.05;

      // Gentle buoyant stratospheric bobbing
      const bob = Math.sin(state.clock.elapsedTime * 1.8) * 0.08 * throttle;
      groupRef.current.position.y = bob;

      // Gondola subtle pendulum sway
      if (gondolaRef.current) {
        gondolaRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2.2) * 0.04;
      }
    }
  });

  const envelopeMat = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    emissive: '#d97706',
    emissiveIntensity: 0.35,
    metalness: 0.65,
    roughness: 0.25,
    transparent: true,
    opacity: 0.92,
  });

  const riggingMat = new THREE.MeshBasicMaterial({
    color: '#f8fafc',
    transparent: true,
    opacity: 0.6,
  });

  const gondolaMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.85,
    roughness: 0.2,
  });

  const solarMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    emissive: '#0369a1',
    emissiveIntensity: 0.4,
    metalness: 0.9,
    roughness: 0.1,
  });

  return (
    <group ref={groupRef}>
      {/* 1. Main Aerostat Envelope (Tear-drop / pear buoyant shape) */}
      <group position={[0, 1.6, 0]}>
        <mesh material={envelopeMat} scale={[1.4, 1.8, 1.4]}>
          <sphereGeometry args={[1.2, 32, 32]} />
        </mesh>
        {/* Equatorial Reinforcement Belt */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.68, 0.04, 12, 32]} />
          <meshBasicMaterial color="#ffffff" opacity={0.7} transparent />
        </mesh>
      </group>

      {/* 2. Structural Suspension Cables / Rigging */}
      <group>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  -1.2, 1.2, 0, 0, -0.6, 0,
                  1.2, 1.2, 0, 0, -0.6, 0,
                  0, 1.2, -1.2, 0, -0.6, 0,
                  0, 1.2, 1.2, 0, -0.6, 0,
                ]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#e2e8f0" transparent opacity={0.65} />
        </lineSegments>
      </group>

      {/* 3. Research Instrumentation Gondola */}
      <group ref={gondolaRef} position={[0, -0.9, 0]}>
        <mesh material={gondolaMat}>
          <boxGeometry args={[0.9, 0.6, 0.9]} />
        </mesh>

        {/* Observation Window Ports */}
        <mesh position={[0, 0, 0.46]}>
          <circleGeometry args={[0.18, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Solar Collection Wings */}
        <mesh material={solarMat} position={[-0.85, 0.1, 0]}>
          <boxGeometry args={[0.7, 0.03, 0.6]} />
        </mesh>
        <mesh material={solarMat} position={[0.85, 0.1, 0]}>
          <boxGeometry args={[0.7, 0.03, 0.6]} />
        </mesh>

        {/* Scientific Sensor Array Boom */}
        <mesh material={riggingMat} position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
        </mesh>

        {/* Telemetry Strobe Light */}
        <pointLight position={[0, -0.6, 0]} color="#f59e0b" intensity={3} distance={6} />
      </group>
    </group>
  );
}
