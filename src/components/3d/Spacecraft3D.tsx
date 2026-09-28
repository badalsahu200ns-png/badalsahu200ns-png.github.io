import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Spacecraft3DProps {
  throttle?: number; // 0 to 1
  banking?: { x: number; y: number }; // mouse offset -1 to 1
  reducedMotion?: boolean;
}

export function Spacecraft3D({
  throttle = 0.8,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: Spacecraft3DProps) {
  const shipGroupRef = useRef<THREE.Group>(null);
  const leftExhaustRef = useRef<THREE.Mesh>(null);
  const rightExhaustRef = useRef<THREE.Mesh>(null);
  const topExhaustRef = useRef<THREE.Mesh>(null);
  const bottomExhaustRef = useRef<THREE.Mesh>(null);
  const engineLightRef = useRef<THREE.PointLight>(null);

  // Smooth banking & engine pulse
  useFrame((state, _) => {
    if (!shipGroupRef.current) return;

    if (!reducedMotion) {
      // Smooth banking response to mouse
      const targetRoll = -banking.x * 0.35;
      const targetPitch = banking.y * 0.25;
      const targetYaw = -banking.x * 0.2;

      shipGroupRef.current.rotation.z += (targetRoll - shipGroupRef.current.rotation.z) * 0.08;
      shipGroupRef.current.rotation.x += (targetPitch - shipGroupRef.current.rotation.x) * 0.08;
      shipGroupRef.current.rotation.y += (targetYaw - shipGroupRef.current.rotation.y) * 0.08;

      // Subtle engine vibration
      const vib = (Math.sin(state.clock.elapsedTime * 45) * 0.003) * throttle;
      shipGroupRef.current.position.y += vib;
    }

    // Engine plume pulsing and realistic fire turbulence based on throttle
    const time = state.clock.elapsedTime;
    const pulse = 0.88 + Math.sin(time * 35) * 0.12 + Math.cos(time * 50) * 0.06;
    const plumeLength = Math.max(0.45, throttle * pulse * 2.4);
    const turbulence = 1.0 + (Math.sin(time * 60) * 0.08);

    if (leftExhaustRef.current) leftExhaustRef.current.scale.set(turbulence, plumeLength, turbulence);
    if (rightExhaustRef.current) rightExhaustRef.current.scale.set(turbulence, plumeLength, turbulence);
    if (topExhaustRef.current) topExhaustRef.current.scale.set(turbulence, plumeLength, turbulence);
    if (bottomExhaustRef.current) bottomExhaustRef.current.scale.set(turbulence, plumeLength, turbulence);

    if (engineLightRef.current) {
      engineLightRef.current.intensity = throttle * (5.0 + Math.sin(time * 40) * 1.5);
    }
  });

  // AEROSPACE PBR MATERIALS:
  // 1. Primary White Aerospace Metallic Body
  const whiteArmorMaterial = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    metalness: 0.65,
    roughness: 0.22,
  });

  // 2. Light Gray Aerospace Alloy Accents
  const lightGrayAlloy = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    metalness: 0.72,
    roughness: 0.26,
  });

  // 3. Jet-Black Structural Carbon Detailing & Stripes
  const blackDetailMaterial = new THREE.MeshStandardMaterial({
    color: '#0a0d14',
    metalness: 0.85,
    roughness: 0.3,
  });

  // 4. Crimson Red Aerospace Racing Stripes
  const redStripeMaterial = new THREE.MeshStandardMaterial({
    color: '#dc2626',
    emissive: '#7f1d1d',
    emissiveIntensity: 0.35,
    metalness: 0.7,
    roughness: 0.2,
  });

  const tungstenEngineMaterial = new THREE.MeshStandardMaterial({
    color: '#1e2430', // Heat-treated engine bell alloy
    metalness: 0.94,
    roughness: 0.22,
  });

  const cockpitVisor = new THREE.MeshStandardMaterial({
    color: '#050b17',
    emissive: '#0284c7',
    emissiveIntensity: 1.2,
    metalness: 0.95,
    roughness: 0.08,
  });

  // REALISTIC FIRE EXHAUST PROPULSION MATERIALS:
  // 1. Blinding white-hot core
  const innerCoreMaterial = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.98,
    blending: THREE.AdditiveBlending,
  });

  // 2. Bright incandescent yellow flame
  const midFlameMaterial = new THREE.MeshBasicMaterial({
    color: '#facc15',
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
  });

  // 3. Fiery intense orange flame
  const orangeFlameMaterial = new THREE.MeshBasicMaterial({
    color: '#f97316',
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });

  // 4. Red/orange turbulent outer flame envelope
  const outerFlameMaterial = new THREE.MeshBasicMaterial({
    color: '#ef4444',
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return (
    <group ref={shipGroupRef}>
      
      {/* 1. Main Fuselage — Faceted Command White Rocket Hull */}
      <mesh material={whiteArmorMaterial} position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.98, 4.0, 8]} />
      </mesh>

      {/* 2. Reinforced White Rocket Nose Cone with Black Tip */}
      <mesh material={whiteArmorMaterial} position={[0, 0, -2.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.32, 1.4, 8]} />
      </mesh>
      <mesh material={blackDetailMaterial} position={[0, 0, -3.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.4, 8]} />
      </mesh>

      {/* 3. Command Bridge / Aerodynamic Visor */}
      <mesh material={cockpitVisor} position={[0, 0.44, -1.2]}>
        <boxGeometry args={[0.55, 0.24, 1.1]} />
      </mesh>

      {/* 4. Dorsal Spine Armor Ridge */}
      <mesh material={lightGrayAlloy} position={[0, 0.5, 0.1]}>
        <boxGeometry args={[0.28, 0.22, 3.0]} />
      </mesh>

      {/* 5. STRIPE 1: Central Crimson Red Racing Stripe along Spine */}
      <mesh material={redStripeMaterial} position={[0, 0.62, 0.1]}>
        <boxGeometry args={[0.07, 0.04, 2.9]} />
      </mesh>
      {/* Flanking Twin Black Stripes along Spine */}
      <mesh material={blackDetailMaterial} position={[-0.07, 0.61, 0.1]}>
        <boxGeometry args={[0.035, 0.03, 2.9]} />
      </mesh>
      <mesh material={blackDetailMaterial} position={[0.07, 0.61, 0.1]}>
        <boxGeometry args={[0.035, 0.03, 2.9]} />
      </mesh>

      {/* 6. Lateral White Flanks with Heat Shields */}
      <mesh material={whiteArmorMaterial} position={[-0.78, 0.05, 0.2]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.52, 0.46, 2.8]} />
      </mesh>
      <mesh material={whiteArmorMaterial} position={[0.78, 0.05, 0.2]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.52, 0.46, 2.8]} />
      </mesh>

      {/* STRIPE 2: Lateral Red & Black Aerospace Accent Bands */}
      <mesh material={redStripeMaterial} position={[-0.82, 0.26, 0.2]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.035, 0.035, 2.6]} />
      </mesh>
      <mesh material={blackDetailMaterial} position={[-0.82, 0.22, 0.2]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.035, 0.035, 2.6]} />
      </mesh>

      <mesh material={redStripeMaterial} position={[0.82, 0.26, 0.2]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.035, 0.035, 2.6]} />
      </mesh>
      <mesh material={blackDetailMaterial} position={[0.82, 0.22, 0.2]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.035, 0.035, 2.6]} />
      </mesh>

      {/* 7. Swept-Back White Rocket Wings with Red & Black Stripes */}
      {/* Left Wing */}
      <group position={[-1.25, 0, 0.4]} rotation={[0, -0.22, -0.08]}>
        <mesh material={whiteArmorMaterial}>
          <boxGeometry args={[1.9, 0.08, 1.5]} />
        </mesh>
        {/* Wing Leading Edge Red Stripe */}
        <mesh material={redStripeMaterial} position={[0, 0.05, -0.65]}>
          <boxGeometry args={[1.85, 0.03, 0.12]} />
        </mesh>
        {/* Wing Leading Edge Black Stripe */}
        <mesh material={blackDetailMaterial} position={[0, 0.05, -0.5]}>
          <boxGeometry args={[1.85, 0.03, 0.08]} />
        </mesh>
        {/* Outer Winglet Stabilizer */}
        <mesh material={blackDetailMaterial} position={[-0.95, 0.22, 0]}>
          <boxGeometry args={[0.08, 0.55, 0.9]} />
        </mesh>
        <pointLight position={[-0.95, 0.35, 0]} color="#ef4444" intensity={0.8} distance={3} />
      </group>

      {/* Right Wing */}
      <group position={[1.25, 0, 0.4]} rotation={[0, 0.22, 0.08]}>
        <mesh material={whiteArmorMaterial}>
          <boxGeometry args={[1.9, 0.08, 1.5]} />
        </mesh>
        {/* Wing Leading Edge Red Stripe */}
        <mesh material={redStripeMaterial} position={[0, 0.05, -0.65]}>
          <boxGeometry args={[1.85, 0.03, 0.12]} />
        </mesh>
        {/* Wing Leading Edge Black Stripe */}
        <mesh material={blackDetailMaterial} position={[0, 0.05, -0.5]}>
          <boxGeometry args={[1.85, 0.03, 0.08]} />
        </mesh>
        {/* Outer Winglet Stabilizer */}
        <mesh material={blackDetailMaterial} position={[0.95, 0.22, 0]}>
          <boxGeometry args={[0.08, 0.55, 0.9]} />
        </mesh>
        <pointLight position={[0.95, 0.35, 0]} color="#0ea5e9" intensity={0.8} distance={3} />
      </group>

      {/* STRIPE 3: Dorsal Vertical Fin Stabilizer with Red & Black Markings */}
      <mesh material={whiteArmorMaterial} position={[0, 0.9, 0.6]}>
        <boxGeometry args={[0.08, 0.8, 1.4]} />
      </mesh>
      {/* Red Fin Tip */}
      <mesh material={redStripeMaterial} position={[0, 1.32, 0.6]}>
        <boxGeometry args={[0.09, 0.08, 1.3]} />
      </mesh>
      {/* Black Fin Accent */}
      <mesh material={blackDetailMaterial} position={[0, 1.22, 0.6]}>
        <boxGeometry args={[0.09, 0.06, 1.3]} />
      </mesh>

      {/* 8. Hull Branding: BADAL // 001 CAREER WORLD */}
      <group position={[-0.82, 0.24, 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <Text
          fontSize={0.16}
          color="#0a0d14"
          anchorX="center"
          anchorY="middle"
        >
          BADAL // 001
        </Text>
        <Text
          position={[0, -0.16, 0]}
          fontSize={0.1}
          color="#dc2626"
          anchorX="center"
          anchorY="middle"
        >
          CAREER WORLD
        </Text>
      </group>

      <group position={[0.82, 0.24, 0.2]} rotation={[0, -Math.PI / 2, 0]}>
        <Text
          fontSize={0.16}
          color="#0a0d14"
          anchorX="center"
          anchorY="middle"
        >
          BADAL // 001
        </Text>
        <Text
          position={[0, -0.16, 0]}
          fontSize={0.1}
          color="#dc2626"
          anchorX="center"
          anchorY="middle"
        >
          CAREER WORLD
        </Text>
      </group>

      {/* 9. Quad Tungsten Engine Bells & Thrust Chambers */}
      {/* Top Left Engine Nozzle */}
      <group position={[-0.4, 0.22, 1.4]}>
        <mesh material={tungstenEngineMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.32, 0.75, 16]} />
        </mesh>
        {/* Fiery Combustion Throat Ring */}
        <mesh material={innerCoreMaterial} position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.2, 16]} />
        </mesh>
      </group>

      {/* Top Right Engine Nozzle */}
      <group position={[0.4, 0.22, 1.4]}>
        <mesh material={tungstenEngineMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.32, 0.75, 16]} />
        </mesh>
        <mesh material={innerCoreMaterial} position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.2, 16]} />
        </mesh>
      </group>

      {/* Bottom Left Engine Nozzle */}
      <group position={[-0.4, -0.18, 1.4]}>
        <mesh material={tungstenEngineMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.32, 0.75, 16]} />
        </mesh>
        <mesh material={innerCoreMaterial} position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.2, 16]} />
        </mesh>
      </group>

      {/* Bottom Right Engine Nozzle */}
      <group position={[0.4, -0.18, 1.4]}>
        <mesh material={tungstenEngineMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.32, 0.75, 16]} />
        </mesh>
        <mesh material={innerCoreMaterial} position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.2, 16]} />
        </mesh>
      </group>

      {/* 10. REALISTIC FIRE EXHAUST PROPULSION (White/Yellow/Orange/Red-Orange) */}
      {/* Plume 1: Top Left */}
      <group position={[-0.4, 0.22, 1.7]}>
        <mesh ref={topExhaustRef} material={outerFlameMaterial} position={[0, 0, 1.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.34, 2.6, 16]} />
        </mesh>
        <mesh material={orangeFlameMaterial} position={[0, 0, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.26, 2.1, 16]} />
        </mesh>
        <mesh material={midFlameMaterial} position={[0, 0, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 1.5, 16]} />
        </mesh>
        <mesh material={innerCoreMaterial} position={[0, 0, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.9, 16]} />
        </mesh>
      </group>

      {/* Plume 2: Top Right */}
      <group position={[0.4, 0.22, 1.7]}>
        <mesh ref={bottomExhaustRef} material={outerFlameMaterial} position={[0, 0, 1.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.34, 2.6, 16]} />
        </mesh>
        <mesh material={orangeFlameMaterial} position={[0, 0, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.26, 2.1, 16]} />
        </mesh>
        <mesh material={midFlameMaterial} position={[0, 0, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 1.5, 16]} />
        </mesh>
        <mesh material={innerCoreMaterial} position={[0, 0, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.9, 16]} />
        </mesh>
      </group>

      {/* Plume 3: Bottom Left */}
      <group position={[-0.4, -0.18, 1.7]}>
        <mesh ref={leftExhaustRef} material={outerFlameMaterial} position={[0, 0, 1.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.34, 2.6, 16]} />
        </mesh>
        <mesh material={orangeFlameMaterial} position={[0, 0, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.26, 2.1, 16]} />
        </mesh>
        <mesh material={midFlameMaterial} position={[0, 0, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 1.5, 16]} />
        </mesh>
        <mesh material={innerCoreMaterial} position={[0, 0, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.9, 16]} />
        </mesh>
      </group>

      {/* Plume 4: Bottom Right */}
      <group position={[0.4, -0.18, 1.7]}>
        <mesh ref={rightExhaustRef} material={outerFlameMaterial} position={[0, 0, 1.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.34, 2.6, 16]} />
        </mesh>
        <mesh material={orangeFlameMaterial} position={[0, 0, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.26, 2.1, 16]} />
        </mesh>
        <mesh material={midFlameMaterial} position={[0, 0, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 1.5, 16]} />
        </mesh>
        <mesh material={innerCoreMaterial} position={[0, 0, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.9, 16]} />
        </mesh>
      </group>

      {/* 11. Rear Fire Engine Glow PointLight (Warm Flame Glow) */}
      <pointLight
        ref={engineLightRef}
        position={[0, 0, 2.0]}
        color="#ff6600"
        intensity={5.5}
        distance={10}
      />

    </group>
  );
}

export default Spacecraft3D;
