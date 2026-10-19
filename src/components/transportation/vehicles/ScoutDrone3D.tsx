import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getCarbonFiberTexture, getBrushedMetalTexture } from '../textures/pbrTextures';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

export function ScoutDrone3D({
  throttle = 0.85,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rotorFLRef = useRef<THREE.Group>(null);
  const rotorFRRef = useRef<THREE.Group>(null);
  const rotorRLRef = useRef<THREE.Group>(null);
  const rotorRRRef = useRef<THREE.Group>(null);
  const gimbalRef = useRef<THREE.Group>(null);
  const scanConeRef = useRef<THREE.Mesh>(null);
  const redStrobeRef = useRef<THREE.PointLight>(null);
  const greenStrobeRef = useRef<THREE.PointLight>(null);
  const whiteBeaconRef = useRef<THREE.PointLight>(null);

  const carbonMap = useMemo(() => getCarbonFiberTexture(), []);
  const brushedMetalMap = useMemo(() => getBrushedMetalTexture(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;

    if (!reducedMotion) {
      // Dynamic drone flight attitude: pitch forward with throttle, roll and yaw with banking
      const targetRoll = -banking.x * 0.45;
      const targetPitch = banking.y * 0.3 - 0.12 * throttle;
      const targetYaw = -banking.x * 0.25;

      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.1;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.1;
      groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.1;

      // Realistic quadcopter aerodynamic turbulence & micro-bob
      const hoverY = Math.sin(t * 7) * 0.05 + Math.cos(t * 3.5) * 0.03;
      groupRef.current.position.y = hoverY;
    }

    // High-speed counter-rotating rotors
    const rotorSpeed = delta * (35 + throttle * 45);
    if (rotorFLRef.current) rotorFLRef.current.rotation.y += rotorSpeed;
    if (rotorFRRef.current) rotorFRRef.current.rotation.y -= rotorSpeed;
    if (rotorRLRef.current) rotorRLRef.current.rotation.y -= rotorSpeed;
    if (rotorRRRef.current) rotorRRRef.current.rotation.y += rotorSpeed;

    // Autonomous camera gimbal tracking
    if (gimbalRef.current) {
      gimbalRef.current.rotation.y = Math.sin(t * 1.5) * 0.25 - banking.x * 0.3;
      gimbalRef.current.rotation.x = -0.3 + Math.cos(t * 2) * 0.15;
    }

    // Forward holographic volumetric scan beam
    if (scanConeRef.current) {
      const pulse = 0.85 + Math.sin(t * 9) * 0.2;
      scanConeRef.current.scale.set(pulse, 1, pulse);
    }

    // FAA Navigation strobe flashing frequencies (1.2 Hz)
    const flash = Math.sin(t * 8) > 0.4;
    if (redStrobeRef.current) redStrobeRef.current.intensity = flash ? 3.5 : 0.4;
    if (greenStrobeRef.current) greenStrobeRef.current.intensity = flash ? 3.5 : 0.4;
    if (whiteBeaconRef.current) whiteBeaconRef.current.intensity = flash ? 4.0 : 0.2;
  });

  // Materials: High contrast, radiant, physically based
  const whiteArmorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    metalness: 0.85,
    roughness: 0.18,
  }), []);

  const carbonChassisMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e293b',
    map: carbonMap,
    metalness: 0.9,
    roughness: 0.25,
  }), [carbonMap]);

  const cyanAlloyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00e5ff',
    emissive: '#0891b2',
    emissiveIntensity: 0.8,
    metalness: 0.85,
    roughness: 0.15,
  }), []);

  const neonGreenMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#10b981',
    emissive: '#10b981',
    emissiveIntensity: 1.2,
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  const motorBellMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#334155',
    map: brushedMetalMap,
    metalness: 0.95,
    roughness: 0.15,
  }), [brushedMetalMap]);

  const landingGearMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#64748b',
    map: brushedMetalMap,
    metalness: 0.95,
    roughness: 0.12,
  }), [brushedMetalMap]);

  const propellerBladeMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    metalness: 0.7,
    roughness: 0.2,
  });

  const rotorTipTrailMat = new THREE.MeshBasicMaterial({
    color: '#38bdf8',
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  const cameraLensMat = new THREE.MeshStandardMaterial({
    color: '#00e5ff',
    emissive: '#00e5ff',
    emissiveIntensity: 2.0,
    metalness: 0.98,
    roughness: 0.05,
  });

  const scanConeMat = new THREE.MeshBasicMaterial({
    color: '#06b6d4',
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  // Arm positions: Quad X layout
  const armCoords = [
    { pos: [-1.2, 0.05, -0.95] as [number, number, number], rotY: -0.68, ref: rotorFLRef, isLeft: true, isFront: true },
    { pos: [1.2, 0.05, -0.95] as [number, number, number], rotY: 0.68, ref: rotorFRRef, isLeft: false, isFront: true },
    { pos: [-1.2, 0.05, 0.95] as [number, number, number], rotY: 0.68, ref: rotorRLRef, isLeft: true, isFront: false },
    { pos: [1.2, 0.05, 0.95] as [number, number, number], rotY: -0.68, ref: rotorRRRef, isLeft: false, isFront: false },
  ];

  return (
    <group ref={groupRef} scale={[1.35, 1.35, 1.35]}>
      
      {/* 1. CENTRAL AERODYNAMIC COMPOSITE FUSELAGE */}
      {/* Upper Titanium-White Armor Canopy */}
      <mesh material={whiteArmorMat} position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.26, 1.4]} />
      </mesh>
      {/* Aerodynamic Forward Nose Hood */}
      <mesh material={whiteArmorMat} position={[0, 0.1, -0.85]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.18, 0.55]} />
      </mesh>
      {/* Lower Dark Carbon Fiber Hull */}
      <mesh material={carbonChassisMat} position={[0, -0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 0.2, 1.5]} />
      </mesh>
      {/* Center Racing Stripe & Core Vents */}
      <mesh material={cyanAlloyMat} position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.22, 0.06, 1.3]} />
      </mesh>

      {/* 2. FOUR EXTENDED DIAGONAL CARBON-TITANIUM OUTRIGGER ARMS */}
      {armCoords.map((arm, index) => (
        <group key={index} position={[arm.pos[0] * 0.5, 0.02, arm.pos[2] * 0.5]}>
          {/* Main Diagonal Spar Tube */}
          <mesh material={carbonChassisMat} rotation={[0, arm.rotY, 0]}>
            <boxGeometry args={[0.14, 0.09, 1.45]} />
          </mesh>
          {/* Electric Cyan Edge Pinstripe */}
          <mesh material={cyanAlloyMat} position={[0, 0.05, 0]} rotation={[0, arm.rotY, 0]}>
            <boxGeometry args={[0.04, 0.02, 1.4]} />
          </mesh>
        </group>
      ))}

      {/* 3. FOUR POWERFUL BRUSHLESS ROTOR HUBS & PROPELLERS */}
      {armCoords.map((arm, index) => (
        <group key={`motor-${index}`} position={arm.pos}>
          {/* Motor Bell Housing */}
          <mesh material={motorBellMat} position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.18, 16]} />
          </mesh>
          {/* Glowing Copper Core Ring */}
          <mesh material={neonGreenMat} position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.05, 16]} />
          </mesh>

          {/* Rotor Assembly (Controlled rotation in useFrame) */}
          <group ref={arm.ref} position={[0, 0.2, 0]}>
            {/* Center Prop Hub */}
            <mesh material={motorBellMat}>
              <cylinderGeometry args={[0.08, 0.08, 0.08, 12]} />
            </mesh>
            {/* Carbon Fiber Aerodynamic Propeller Blades (Cross shape) */}
            <mesh material={propellerBladeMat}>
              <boxGeometry args={[1.3, 0.015, 0.12]} />
            </mesh>
            <mesh material={propellerBladeMat} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[1.3, 0.015, 0.12]} />
            </mesh>
            {/* Luminous High-Speed Spinning Rotor Tip Ring */}
            <mesh material={rotorTipTrailMat} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.62, 0.025, 8, 32]} />
            </mesh>
          </group>

          {/* Strobe Navigation Light under Arm Motor Pod */}
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial
              color={
                arm.isFront
                  ? arm.isLeft
                    ? '#ef4444' // Port: Red
                    : '#10b981' // Starboard: Green
                  : '#ffffff'   // Rear: White
              }
            />
          </mesh>
        </group>
      ))}

      {/* Navigation Strobe Lights */}
      <pointLight
        ref={redStrobeRef}
        position={[-1.2, 0, -0.95]}
        color="#ef4444"
        distance={6}
        intensity={2.5}
      />
      <pointLight
        ref={greenStrobeRef}
        position={[1.2, 0, -0.95]}
        color="#10b981"
        distance={6}
        intensity={2.5}
      />
      <pointLight
        ref={whiteBeaconRef}
        position={[0, 0.35, 0.6]}
        color="#ffffff"
        distance={8}
        intensity={3.0}
      />

      {/* 4. TUBULAR LANDING GEAR SKIDS (Prominent & Recognizable Structure) */}
      <group position={[0, -0.32, 0]}>
        {/* Left Skid Rail */}
        <mesh material={landingGearMat} position={[-0.55, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 1.8]} />
        </mesh>
        {/* Left Skid Curved Tips */}
        <mesh material={landingGearMat} position={[-0.55, 0.1, -0.9]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.35]} />
        </mesh>
        <mesh material={landingGearMat} position={[-0.55, 0.1, 0.9]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.35]} />
        </mesh>
        {/* Left Struts connecting to Fuselage */}
        <mesh material={landingGearMat} position={[-0.55, 0.18, -0.4]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.38, 12]} />
        </mesh>
        <mesh material={landingGearMat} position={[-0.55, 0.18, 0.4]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.38, 12]} />
        </mesh>

        {/* Right Skid Rail */}
        <mesh material={landingGearMat} position={[0.55, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 1.8]} />
        </mesh>
        {/* Right Skid Curved Tips */}
        <mesh material={landingGearMat} position={[0.55, 0.1, -0.9]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.35]} />
        </mesh>
        <mesh material={landingGearMat} position={[0.55, 0.1, 0.9]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.35]} />
        </mesh>
        {/* Right Struts connecting to Fuselage */}
        <mesh material={landingGearMat} position={[0.55, 0.18, -0.4]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.38, 12]} />
        </mesh>
        <mesh material={landingGearMat} position={[0.55, 0.18, 0.4]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.38, 12]} />
        </mesh>
      </group>

      {/* 5. FORWARD 3-AXIS RECONNAISSANCE CAMERA GIMBAL & OPTICS */}
      <group ref={gimbalRef} position={[0, -0.12, -0.9]}>
        {/* Gimbal Yoke */}
        <mesh material={carbonChassisMat}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
        </mesh>
        {/* Spherical Camera Sensor Ball */}
        <mesh material={carbonChassisMat} position={[0, -0.14, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
        </mesh>
        {/* Cyan Optical Lens Eye */}
        <mesh material={cameraLensMat} position={[0, -0.14, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        </mesh>
        {/* Glowing Forward Spotlight Beacon */}
        <pointLight position={[0, -0.14, -0.3]} color="#00e5ff" intensity={3.5} distance={12} />
      </group>

      {/* 6. HOLOGRAPHIC SCAN BEAM (Volumetric Scanning Cone Projection) */}
      <mesh
        ref={scanConeRef}
        material={scanConeMat}
        position={[0, -1.2, -1.8]}
        rotation={[-0.45, 0, 0]}
      >
        <coneGeometry args={[1.5, 3.2, 24, 1, true]} />
      </mesh>

      {/* 7. DORSAL GPS PUCK & DUAL TELEMETRY ANTENNAS */}
      <mesh material={whiteArmorMat} position={[0, 0.32, 0.3]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
      </mesh>
      <mesh material={landingGearMat} position={[-0.1, 0.46, 0.5]} rotation={[0.2, 0, -0.1]}>
        <cylinderGeometry args={[0.015, 0.015, 0.32, 8]} />
      </mesh>
      <mesh material={landingGearMat} position={[0.1, 0.46, 0.5]} rotation={[0.2, 0, 0.1]}>
        <cylinderGeometry args={[0.015, 0.015, 0.32, 8]} />
      </mesh>

      {/* Radiance lights on drone */}
      <pointLight position={[0, 0.5, 0]} color="#00e5ff" intensity={2.0} distance={5} />
      <pointLight position={[0, -0.4, 0]} color="#10b981" intensity={2.0} distance={4} />

    </group>
  );
}

export default ScoutDrone3D;
