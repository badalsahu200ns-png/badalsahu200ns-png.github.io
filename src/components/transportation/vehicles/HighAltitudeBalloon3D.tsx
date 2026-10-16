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
  const radarRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
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

    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 2.2;
    }
  });

  // Radiant translucent golden-amber envelope with white contrast
  const envelopeMat = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    emissive: '#d97706',
    emissiveIntensity: 0.45,
    metalness: 0.55,
    roughness: 0.2,
    transparent: true,
    opacity: 0.94,
  });

  const goreLineMat = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.8,
  });

  const gondolaMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    metalness: 0.9,
    roughness: 0.18,
  });

  const solarMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    emissive: '#0369a1',
    emissiveIntensity: 0.5,
    metalness: 0.95,
    roughness: 0.08,
  });

  const sensorMat = new THREE.MeshStandardMaterial({
    color: '#00e5ff',
    emissive: '#00e5ff',
    emissiveIntensity: 1.5,
  });

  return (
    <group ref={groupRef} scale={[1.3, 1.3, 1.3]}>
      {/* 1. Main Aerostat Envelope (Large Teardrop Buoyant Geometry) */}
      <group position={[0, 1.8, 0]}>
        <mesh material={envelopeMat} scale={[1.5, 1.9, 1.5]}>
          <sphereGeometry args={[1.2, 32, 32]} />
        </mesh>
        
        {/* Equatorial Reinforcement Belt */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.82, 0.045, 12, 32]} />
          <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
        {/* Longitudinal Meridian Ribs */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.85, 0.02, 12, 32]} />
          <primitive object={goreLineMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1.85, 0.02, 12, 32]} />
          <primitive object={goreLineMat} attach="material" />
        </mesh>
      </group>

      {/* 2. Structural Suspension Cables / Rigging Lines */}
      <group>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  -1.4, 1.3, 0, 0, -0.6, 0,
                  1.4, 1.3, 0, 0, -0.6, 0,
                  0, 1.3, -1.4, 0, -0.6, 0,
                  0, 1.3, 1.4, 0, -0.6, 0,
                  -1.0, 1.3, -1.0, 0, -0.6, 0,
                  1.0, 1.3, 1.0, 0, -0.6, 0,
                ]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </lineSegments>
      </group>

      {/* 3. Scientific Research Instrument Gondola */}
      <group ref={gondolaRef} position={[0, -0.9, 0]}>
        {/* White Aerospace Instrument Enclosure */}
        <mesh material={gondolaMat}>
          <boxGeometry args={[1.0, 0.65, 1.0]} />
        </mesh>

        {/* Observation Porthole Windows */}
        <mesh position={[0, 0, 0.51]}>
          <circleGeometry args={[0.2, 16]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
        <mesh position={[0, 0, -0.51]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.2, 16]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>

        {/* Dual Solar Energy Array Wings */}
        <mesh material={solarMat} position={[-0.95, 0.1, 0]}>
          <boxGeometry args={[0.8, 0.03, 0.7]} />
        </mesh>
        <mesh material={solarMat} position={[0.95, 0.1, 0]}>
          <boxGeometry args={[0.8, 0.03, 0.7]} />
        </mesh>

        {/* Scientific Sensor Array Boom with Rotating Radar Dish */}
        <group ref={radarRef} position={[0, -0.5, 0]}>
          <mesh material={gondolaMat}>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          </mesh>
          <mesh material={sensorMat} position={[0, -0.2, 0]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.25, 0.1, 16]} />
          </mesh>
        </group>

        {/* Telemetry Strobe Light */}
        <pointLight position={[0, -0.7, 0]} color="#f59e0b" intensity={4} distance={8} />
        <pointLight position={[0, 0.2, 0.6]} color="#00e5ff" intensity={3} distance={6} />
      </group>
    </group>
  );
}

export default HighAltitudeBalloon3D;
