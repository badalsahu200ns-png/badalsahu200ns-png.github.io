import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getBrushedMetalTexture } from '../textures/pbrTextures';

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
  const carriage2Ref = useRef<THREE.Group>(null);

  const brushedMetalMap = useMemo(() => getBrushedMetalTexture(), []);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      const targetRoll = -banking.x * 0.22;
      const targetPitch = banking.y * 0.15;
      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.08;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.08;

      // Maglev high-speed sway & track levitation micro-drift
      const trackSway = Math.sin(state.clock.elapsedTime * 14) * 0.025 * throttle;
      groupRef.current.position.x = trackSway;

      // Articulated second carriage gentle lagged sway
      if (carriage2Ref.current) {
        carriage2Ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 8) * 0.025;
      }
    }

    // Undercarriage magnetic coil pulsing
    const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 22) * 0.15;
    if (leftSkateRef.current) leftSkateRef.current.scale.set(1, pulse, 1);
    if (rightSkateRef.current) rightSkateRef.current.scale.set(1, pulse, 1);
  });

  // High-contrast, radiant white & electric blue maglev materials
  const whiteChassisMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    metalness: 0.88,
    roughness: 0.16,
  }), []);

  const blueStripeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1d4ed8',
    emissive: '#2563eb',
    emissiveIntensity: 0.4,
    metalness: 0.9,
    roughness: 0.15,
  }), []);

  const chromeAccentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    map: brushedMetalMap,
    metalness: 0.96,
    roughness: 0.08,
  }), [brushedMetalMap]);

  const windowStripMat = new THREE.MeshStandardMaterial({
    color: '#00e5ff',
    emissive: '#38bdf8',
    emissiveIntensity: 1.2,
    metalness: 0.95,
    roughness: 0.05,
  });

  const bellowsMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.8,
  });

  const magGlowMat = new THREE.MeshBasicMaterial({
    color: '#3b82f6',
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* ================= CARRIAGE 01: LEAD LOCOMOTIVE ================= */}
      <group position={[0, 0, -1.2]}>
        {/* Main Carriage Body (Titanium White) */}
        <mesh material={whiteChassisMat} position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 0.82, 3.6]} />
        </mesh>

        {/* Lower Blue Racing Band */}
        <mesh material={blueStripeMat} position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.38, 0.14, 3.6]} />
        </mesh>

        {/* Aerodynamic Tapered Bullet Nose */}
        <mesh material={whiteChassisMat} position={[0, 0.38, -2.2]} rotation={[-0.12, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.7, 1.3]} />
        </mesh>
        <mesh material={chromeAccentMat} position={[0, 0.26, -3.0]} rotation={[-0.22, 0, 0]} castShadow>
          <coneGeometry args={[0.58, 1.1, 16]} />
        </mesh>

        {/* Cockpit Windshield Visor */}
        <mesh material={windowStripMat} position={[0, 0.58, -2.1]} rotation={[-0.35, 0, 0]}>
          <boxGeometry args={[1.05, 0.22, 0.6]} />
        </mesh>

        {/* High-Speed Panoramic Window Ribbons (Both Sides) */}
        <mesh material={windowStripMat} position={[-0.69, 0.52, -0.1]}>
          <planeGeometry args={[2.8, 0.24]} />
        </mesh>
        <mesh material={windowStripMat} position={[0.69, 0.52, -0.1]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.8, 0.24]} />
        </mesh>

        {/* Roof Aerodynamic Spine */}
        <mesh material={chromeAccentMat} position={[0, 0.85, -0.2]}>
          <boxGeometry args={[0.26, 0.08, 3.6]} />
        </mesh>

        {/* Undercarriage Magnetic Levitation Skates */}
        <group position={[-0.58, -0.12, 0]}>
          <mesh material={chromeAccentMat}>
            <boxGeometry args={[0.22, 0.22, 3.6]} />
          </mesh>
          <mesh ref={leftSkateRef} material={magGlowMat} position={[0, -0.14, 0]}>
            <boxGeometry args={[0.18, 0.08, 3.5]} />
          </mesh>
          <pointLight position={[0, -0.25, 0]} color="#3b82f6" intensity={3} distance={4} />
        </group>

        <group position={[0.58, -0.12, 0]}>
          <mesh material={chromeAccentMat}>
            <boxGeometry args={[0.22, 0.22, 3.6]} />
          </mesh>
          <mesh ref={rightSkateRef} material={magGlowMat} position={[0, -0.14, 0]}>
            <boxGeometry args={[0.18, 0.08, 3.5]} />
          </mesh>
          <pointLight position={[0, -0.25, 0]} color="#3b82f6" intensity={3} distance={4} />
        </group>

        {/* Front Headlight Beams */}
        <pointLight position={[0, 0.32, -3.4]} color="#ffffff" intensity={5} distance={20} />
        <pointLight position={[-0.45, 0.22, -2.9]} color="#00e5ff" intensity={3} distance={10} />
        <pointLight position={[0.45, 0.22, -2.9]} color="#00e5ff" intensity={3} distance={10} />
      </group>

      {/* ================= ARTICULATED INTER-CAR COUPLING BELLOWS ================= */}
      <mesh material={bellowsMat} position={[0, 0.42, 1.0]}>
        <boxGeometry args={[1.2, 0.72, 0.6]} />
      </mesh>

      {/* ================= CARRIAGE 02: SECOND PASSENGER CAR ================= */}
      <group ref={carriage2Ref} position={[0, 0, 2.8]}>
        {/* Main Carriage 2 Body */}
        <mesh material={whiteChassisMat} position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 0.82, 3.0]} />
        </mesh>
        <mesh material={blueStripeMat} position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.38, 0.14, 3.0]} />
        </mesh>

        {/* Windows on Carriage 2 */}
        <mesh material={windowStripMat} position={[-0.69, 0.52, 0]}>
          <planeGeometry args={[2.4, 0.24]} />
        </mesh>
        <mesh material={windowStripMat} position={[0.69, 0.52, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.4, 0.24]} />
        </mesh>

        {/* Roof Spine */}
        <mesh material={chromeAccentMat} position={[0, 0.85, 0]}>
          <boxGeometry args={[0.26, 0.08, 3.0]} />
        </mesh>

        {/* Undercarriage Skates */}
        <group position={[-0.58, -0.12, 0]}>
          <mesh material={chromeAccentMat}>
            <boxGeometry args={[0.22, 0.22, 3.0]} />
          </mesh>
          <mesh material={magGlowMat} position={[0, -0.14, 0]}>
            <boxGeometry args={[0.18, 0.08, 2.9]} />
          </mesh>
        </group>
        <group position={[0.58, -0.12, 0]}>
          <mesh material={chromeAccentMat}>
            <boxGeometry args={[0.22, 0.22, 3.0]} />
          </mesh>
          <mesh material={magGlowMat} position={[0, -0.14, 0]}>
            <boxGeometry args={[0.18, 0.08, 2.9]} />
          </mesh>
        </group>
      </group>

      {/* Radiant illumination */}
      <pointLight position={[0, 2.0, 0]} color="#ffffff" intensity={2.5} distance={10} />
      <pointLight position={[0, -0.5, 0]} color="#3b82f6" intensity={3.0} distance={8} />
    </group>
  );
}

export default MaglevTrain3D;
