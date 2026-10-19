import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getCarbonFiberTexture, getBrushedMetalTexture } from '../textures/pbrTextures';

interface VehicleProps {
  throttle?: number;
  banking?: { x: number; y: number };
  reducedMotion?: boolean;
}

/**
 * 01 EXECUTIVE HOVERCRAFT
 * Luxury Autonomous Hypercar / Aerodynamic Speed-Yacht Hybrid
 * High-poly sculpted fuselage, carbon fiber composite splitters,
 * panoramic glass canopy with cockpit interior, quad projector headlights,
 * active vectoring thrusters, and rotating magnetic repulsor rings.
 */
export function ExecutiveHovercraft3D({
  throttle = 0.85,
  banking = { x: 0, y: 0 },
  reducedMotion = false,
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftTurbineRef = useRef<THREE.Mesh>(null);
  const rightTurbineRef = useRef<THREE.Mesh>(null);
  const leftRingRef = useRef<THREE.Group>(null);
  const rightRingRef = useRef<THREE.Group>(null);
  const leftPlumeRef = useRef<THREE.Mesh>(null);
  const rightPlumeRef = useRef<THREE.Mesh>(null);
  const sprayParticlesRef = useRef<THREE.Points>(null);

  const carbonMap = useMemo(() => getCarbonFiberTexture(), []);
  const brushedMetalMap = useMemo(() => getBrushedMetalTexture(), []);

  // Air-cushion ground spray dust particles
  const sprayParticles = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.8 + Math.random() * 0.9;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -0.38 + (Math.random() - 0.5) * 0.08;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.0;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      // Natural flight banking & pitch with smooth inertia damping
      const targetRoll = -banking.x * 0.38;
      const targetPitch = banking.y * 0.24;
      const targetYaw = -banking.x * 0.2;

      groupRef.current.rotation.z += (targetRoll - groupRef.current.rotation.z) * 0.1;
      groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.1;
      groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.1;

      // Realistic anti-gravity cushion micro-sway and engine idle vibration
      const hover = Math.sin(state.clock.elapsedTime * 3.8) * 0.05 + Math.sin(state.clock.elapsedTime * 18) * 0.005 * throttle;
      groupRef.current.position.y = hover;
    }

    // Engine plume dynamic pulsation
    const time = state.clock.elapsedTime;
    const pulse = 0.88 + Math.sin(time * 30) * 0.12;
    const plumeLength = Math.max(0.6, throttle * pulse * 2.8);

    if (leftPlumeRef.current) leftPlumeRef.current.scale.set(1, plumeLength, 1);
    if (rightPlumeRef.current) rightPlumeRef.current.scale.set(1, plumeLength, 1);

    // Rotating magnetic repulsor stator rings
    if (leftRingRef.current) leftRingRef.current.rotation.z += delta * (4 + throttle * 6);
    if (rightRingRef.current) rightRingRef.current.rotation.z -= delta * (4 + throttle * 6);

    // Spinning turbine blades inside rear vectoring nozzles
    if (leftTurbineRef.current) leftTurbineRef.current.rotation.z += delta * 25;
    if (rightTurbineRef.current) rightTurbineRef.current.rotation.z -= delta * 25;

    // Ground spray particles animation
    if (!reducedMotion && sprayParticlesRef.current) {
      const positions = sprayParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 18 * throttle;
        if (positions[i * 3 + 2] > 2.0) {
          positions[i * 3 + 2] = -1.8;
        }
      }
      sprayParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} scale={[1.25, 1.25, 1.25]}>
      {/* ================= 1. SCULPTED CHASSIS & AERODYNAMIC HULL ================= */}
      {/* Main Luxury Carbon-Composite Fuselage Center */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.38, 3.2]} />
        <meshStandardMaterial
          color="#f8fafc"
          metalness={0.92}
          roughness={0.15}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Aerodynamic Tapered Front Nose & Air Dam with Brushed Finish */}
      <mesh position={[0, -0.04, -1.8]} rotation={[-0.14, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.76, 1.4, 4]} />
        <meshStandardMaterial
          color="#0f172a"
          map={brushedMetalMap}
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      {/* Front Carbon-Fiber Splitter & Downforce Wing */}
      <mesh position={[0, -0.18, -2.1]} castShadow receiveShadow>
        <boxGeometry args={[1.45, 0.05, 0.5]} />
        <meshStandardMaterial
          color="#0f172a"
          map={carbonMap}
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Flanking Side Air Intake Pontoons */}
      {[-0.82, 0.82].map((x, i) => (
        <group key={i} position={[x, 0.02, 0.1]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.34, 2.6]} />
            <meshStandardMaterial
              color="#e2e8f0"
              map={brushedMetalMap}
              metalness={0.94}
              roughness={0.12}
            />
          </mesh>
          {/* Air Scoop Inlets with Wire Mesh */}
          <mesh position={[0, 0.04, -1.2]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.24, 0.22, 0.3]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
          {/* Cyan Aero Edge Accents */}
          <mesh position={[x > 0 ? 0.14 : -0.14, 0, 0]}>
            <boxGeometry args={[0.03, 0.08, 2.4]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.8} />
          </mesh>
        </group>
      ))}

      {/* ================= 2. PANORAMIC COCKPIT & INTERIOR ================= */}
      {/* High-Refraction Panoramic Glass Canopy */}
      <mesh position={[0, 0.32, -0.3]}>
        <boxGeometry args={[1.1, 0.34, 1.8]} />
        <meshPhysicalMaterial
          color="#00e5ff"
          transmission={0.88}
          opacity={1}
          transparent
          roughness={0.06}
          ior={1.52}
          reflectivity={0.95}
          thickness={0.8}
        />
      </mesh>

      {/* Cockpit Interior: Dual Executive Leather Bucket Seats */}
      {[-0.26, 0.26].map((x, i) => (
        <group key={i} position={[x, 0.14, -0.2]}>
          <mesh>
            <boxGeometry args={[0.32, 0.3, 0.35]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.24, 0.12]}>
            <boxGeometry args={[0.28, 0.32, 0.1]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Cockpit Digital Holographic Dashboard Console */}
      <mesh position={[0, 0.22, -0.9]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.75, 0.12, 0.15]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2.2} />
      </mesh>

      {/* ================= 3. QUAD LED MATRIX HEADLIGHTS & LIGHTING ================= */}
      {/* Forward LED Matrix Projectors with Real Illumination Cones */}
      {[-0.55, -0.28, 0.28, 0.55].map((x, i) => (
        <mesh key={i} position={[x, -0.06, -2.15]}>
          <boxGeometry args={[0.16, 0.05, 0.06]} />
          <meshStandardMaterial color="#ffffff" emissive="#00e5ff" emissiveIntensity={3.5} />
        </mesh>
      ))}
      <pointLight position={[0, -0.1, -2.5]} color="#00e5ff" intensity={3.5} distance={15} />

      {/* Rear Full-Width Neon Taillight Bar */}
      <mesh position={[0, 0.12, 1.62]}>
        <boxGeometry args={[1.4, 0.06, 0.04]} />
        <meshStandardMaterial color="#ff1744" emissive="#ff1744" emissiveIntensity={3.0} />
      </mesh>

      {/* ================= 4. VECTORING THRUSTERS & ION EXHAUST PLUMES ================= */}
      {[-0.48, 0.48].map((x, i) => (
        <group key={i} position={[x, 0.05, 1.7]}>
          {/* Ceramic Engine Cowling */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.26, 0.5, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.96} roughness={0.2} />
          </mesh>

          {/* Internal Turbine Blades */}
          <mesh
            ref={x < 0 ? leftTurbineRef : rightTurbineRef}
            position={[0, 0, -0.05]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.18, 0.18, 0.04, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.98} roughness={0.1} />
          </mesh>

          {/* Multistage Core Flame Plume */}
          <mesh
            ref={x < 0 ? leftPlumeRef : rightPlumeRef}
            position={[0, 0, 0.8]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <coneGeometry args={[0.2, 1.6, 16]} />
            <meshBasicMaterial
              color="#00e5ff"
              transparent
              opacity={0.88}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* White-Hot Flame Core */}
          <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.1, 0.8, 16]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.95}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* ================= 5. UNDERCARRIAGE REPULSOR DISCS & GROUND GLOW ================= */}
      {/* 4 Magnetic Repulsor Emitters */}
      {[
        [-0.5, -0.22, -1.0],
        [0.5, -0.22, -1.0],
        [-0.5, -0.22, 0.9],
        [0.5, -0.22, 0.9],
      ].map((pos, idx) => (
        <group
          key={idx}
          position={pos as [number, number, number]}
          ref={idx % 2 === 0 ? leftRingRef : rightRingRef}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.24, 0.04, 12, 24]} />
            <meshStandardMaterial
              color="#00e5ff"
              emissive="#00e5ff"
              emissiveIntensity={2.5}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.03, 16]} />
            <meshStandardMaterial color="#020617" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Ground Water / Surface Spray Particles */}
      <points ref={sprayParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sprayParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#00e5ff" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* Ground Contact Ion Glow Disc */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 3.8]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default ExecutiveHovercraft3D;
