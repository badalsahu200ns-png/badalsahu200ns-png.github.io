import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function MaglevTrain3D({
  throttle = 0.9,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftSkateRef = useRef<THREE.Mesh>(null);
  const rightSkateRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      const targetRoll = -banking.x * 0.2;
      const targetPitch = banking.y * 0.15;
      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.08;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.08;

      // Maglev high-speed sway & track levitation micro-drift
      const trackSway = Math.sin(state.clock.elapsedTime * 12) * 0.02 * throttle;
      groupRef.current.position.x = trackSway;
    }

    // Undercarriage magnetic coil pulsing
    const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 20) * 0.2;
    if (leftSkateRef.current) leftSkateRef.current.scale.set(1, pulse, 1);
    if (rightSkateRef.current) rightSkateRef.current.scale.set(1, pulse, 1);
  });

  const bodyMat = new THREE.MeshStandardMaterial({
    color: '#223249',
    metalness: 0.92,
    roughness: 0.16,
  });

  const chromeAccentMat = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    metalness: 0.96,
    roughness: 0.1,
  });

  const windowStripMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    emissive: '#38bdf8',
    emissiveIntensity: 0.8,
    metalness: 0.9,
    roughness: 0.1,
  });

  const magGlowMat = new THREE.MeshBasicMaterial({
    color: '#3b82f6',
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  return (
    <group ref={groupRef}>
      {/* 1. Bullet Train Main Carriage Body */}
      <mesh material={bodyMat} position={[0, 0.4, 0]}>
        <boxGeometry args={[1.3, 0.8, 4.4]} />
      </mesh>

      {/* 2. Aerodynamic Tapered Nose */}
      <mesh material={bodyMat} position={[0, 0.35, -2.6]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[1.15, 0.65, 1.2]} />
      </mesh>
      <mesh material={chromeAccentMat} position={[0, 0.25, -3.3]} rotation={[-0.2, 0, 0]}>
        <coneGeometry args={[0.55, 0.8, 16]} />
      </mesh>

      {/* 3. High-Speed Panoramic Window Strips */}
      <mesh material={windowStripMat} position={[-0.66, 0.5, -0.2]}>
        <planeGeometry args={[3.2, 0.22]} />
      </mesh>
      <mesh material={windowStripMat} position={[0.66, 0.5, -0.2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.2, 0.22]} />
      </mesh>

      {/* 4. Roof Aerodynamic Ridge & Racing Strip */}
      <mesh material={chromeAccentMat} position={[0, 0.82, -0.2]}>
        <boxGeometry args={[0.25, 0.08, 4.2]} />
      </mesh>

      {/* 5. Undercarriage Magnetic Levitation Rails / Skates */}
      <group position={[-0.55, -0.15, 0]}>
        <mesh material={bodyMat}>
          <boxGeometry args={[0.22, 0.25, 4.4]} />
        </mesh>
        <mesh ref={leftSkateRef} material={magGlowMat} position={[0, -0.14, 0]}>
          <boxGeometry args={[0.18, 0.08, 4.2]} />
        </mesh>
        <pointLight position={[0, -0.25, 0]} color="#3b82f6" intensity={2} distance={3} />
      </group>

      <group position={[0.55, -0.15, 0]}>
        <mesh material={bodyMat}>
          <boxGeometry args={[0.22, 0.25, 4.4]} />
        </mesh>
        <mesh ref={rightSkateRef} material={magGlowMat} position={[0, -0.14, 0]}>
          <boxGeometry args={[0.18, 0.08, 4.2]} />
        </mesh>
        <pointLight position={[0, -0.25, 0]} color="#3b82f6" intensity={2} distance={3} />
      </group>

      {/* 6. Front Headlight Beams */}
      <pointLight position={[0, 0.3, -3.6]} color="#ffffff" intensity={4} distance={15} />
      <pointLight position={[-0.4, 0.2, -3.2]} color="#38bdf8" intensity={2} distance={8} />
      <pointLight position={[0.4, 0.2, -3.2]} color="#38bdf8" intensity={2} distance={8} />
    </group>
  );
}
