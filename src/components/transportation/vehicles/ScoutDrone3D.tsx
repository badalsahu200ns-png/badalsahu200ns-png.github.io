import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function ScoutDrone3D({
  throttle = 0.8,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rotorRefs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];
  const scanBeamRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      const targetRoll = -banking.x * 0.45;
      const targetPitch = banking.y * 0.3;
      const targetYaw = -banking.x * 0.25;

      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.1;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.1;
      groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.1;

      // Drone agile hovering bob
      const hover = Math.sin(state.clock.elapsedTime * 6) * 0.05;
      groupRef.current.position.y = hover;
    }

    // High speed spinning rotors
    const rotorSpeed = delta * (28 + throttle * 30);
    rotorRefs.forEach((r, idx) => {
      if (r.current) {
        r.current.rotation.y += idx % 2 === 0 ? rotorSpeed : -rotorSpeed;
      }
    });

    // Scanner beam pulse
    if (scanBeamRef.current) {
      const pulse = 0.7 + Math.sin(state.clock.elapsedTime * 8) * 0.3;
      scanBeamRef.current.scale.set(pulse, 1, pulse);
    }
  });

  const carbonFrameMat = new THREE.MeshStandardMaterial({
    color: '#090d16',
    metalness: 0.9,
    roughness: 0.25,
  });

  const cyanAlloyMat = new THREE.MeshStandardMaterial({
    color: '#06b6d4',
    metalness: 0.8,
    roughness: 0.2,
  });

  const rotorBladeMat = new THREE.MeshBasicMaterial({
    color: '#38bdf8',
    transparent: true,
    opacity: 0.5,
  });

  const sensorEyeMat = new THREE.MeshStandardMaterial({
    color: '#0891b2',
    emissive: '#06b6d4',
    emissiveIntensity: 1.5,
  });

  const scanConeMat = new THREE.MeshBasicMaterial({
    color: '#06b6d4',
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return (
    <group ref={groupRef}>
      {/* Central Aerodynamic Core */}
      <mesh material={carbonFrameMat} position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.24, 0.9]} />
      </mesh>

      {/* Sensor Turret Dome */}
      <mesh material={sensorEyeMat} position={[0, -0.15, -0.2]}>
        <sphereGeometry args={[0.18, 16, 16]} />
      </mesh>

      {/* Holographic Scan Beam Cone */}
      <mesh ref={scanBeamRef} material={scanConeMat} position={[0, -0.9, -0.6]} rotation={[-0.4, 0, 0]}>
        <coneGeometry args={[0.9, 1.8, 16, 1, true]} />
      </mesh>

      {/* Top Telemetry Pod & Antenna */}
      <mesh material={cyanAlloyMat} position={[0, 0.2, 0.1]}>
        <boxGeometry args={[0.3, 0.12, 0.4]} />
      </mesh>
      <mesh material={carbonFrameMat} position={[0, 0.38, 0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
      </mesh>

      {/* Quad Rotor Outriggers */}
      {/* Front Left */}
      <group position={[-0.75, 0.05, -0.6]}>
        <mesh material={carbonFrameMat} rotation={[0, -0.4, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.6]} />
        </mesh>
        <group ref={rotorRefs[0]} position={[0, 0.08, 0]}>
          <mesh material={carbonFrameMat}>
            <cylinderGeometry args={[0.08, 0.08, 0.08, 12]} />
          </mesh>
          <mesh material={rotorBladeMat} position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.01, 16]} />
          </mesh>
        </group>
      </group>

      {/* Front Right */}
      <group position={[0.75, 0.05, -0.6]}>
        <mesh material={carbonFrameMat} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.6]} />
        </mesh>
        <group ref={rotorRefs[1]} position={[0, 0.08, 0]}>
          <mesh material={carbonFrameMat}>
            <cylinderGeometry args={[0.08, 0.08, 0.08, 12]} />
          </mesh>
          <mesh material={rotorBladeMat} position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.01, 16]} />
          </mesh>
        </group>
      </group>

      {/* Rear Left */}
      <group position={[-0.75, 0.05, 0.6]}>
        <mesh material={carbonFrameMat} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.6]} />
        </mesh>
        <group ref={rotorRefs[2]} position={[0, 0.08, 0]}>
          <mesh material={carbonFrameMat}>
            <cylinderGeometry args={[0.08, 0.08, 0.08, 12]} />
          </mesh>
          <mesh material={rotorBladeMat} position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.01, 16]} />
          </mesh>
        </group>
      </group>

      {/* Rear Right */}
      <group position={[0.75, 0.05, 0.6]}>
        <mesh material={carbonFrameMat} rotation={[0, -0.4, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.6]} />
        </mesh>
        <group ref={rotorRefs[3]} position={[0, 0.08, 0]}>
          <mesh material={carbonFrameMat}>
            <cylinderGeometry args={[0.08, 0.08, 0.08, 12]} />
          </mesh>
          <mesh material={rotorBladeMat} position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.01, 16]} />
          </mesh>
        </group>
      </group>

      {/* Nav Lights */}
      <pointLight position={[-0.75, 0.15, -0.6]} color="#06b6d4" intensity={1.5} distance={2} />
      <pointLight position={[0.75, 0.15, -0.6]} color="#06b6d4" intensity={1.5} distance={2} />
      <pointLight position={[0, -0.3, -0.2]} color="#00e5ff" intensity={2.5} distance={4} />
    </group>
  );
}
