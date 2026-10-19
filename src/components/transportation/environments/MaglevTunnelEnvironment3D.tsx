import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { getRailwayTrackTexture } from '../textures/pbrTextures';

interface TunnelEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function MaglevTunnelEnvironment3D({ travelProgress, reducedMotion = false }: TunnelEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const streakRef = useRef<THREE.Points>(null);

  const trackTexture = useMemo(() => getRailwayTrackTexture(), []);

  // 4 Verified Career Milestone Stations
  const stations = useMemo(() => [
    { name: 'STATION 01 // MAGICBRICKS', title: 'SENIOR SALES MANAGER (2023 - 2024)', color: '#3b82f6', z: -25 },
    { name: 'STATION 02 // REDBUS', title: 'ASST. MANAGER SALES (2022 - 2023)', color: '#10b981', z: -55 },
    { name: 'STATION 03 // RELIANCE RETAIL', title: 'STORE MANAGER / OPERATIONS (2020 - 2022)', color: '#06b6d4', z: -85 },
    { name: 'STATION 04 // ICICI PRUDENTIAL', title: 'FINANCIAL SERVICES ADVISOR', color: '#f59e0b', z: -115 },
  ], []);

  // Overhead catenary electrification support gantries
  const catenaryGantries = useMemo(() => {
    const list: number[] = [];
    for (let z = 0; z > -180; z -= 16) {
      list.push(z);
    }
    return list;
  }, []);

  // Concrete track support pillars
  const pylons = useMemo(() => {
    const list: number[] = [];
    for (let z = -6; z > -180; z -= 14) {
      list.push(z);
    }
    return list;
  }, []);

  // Velocity sparks from rail contact
  const streaks = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);
      const f2 = Math.abs((Math.sin(i * 78.233) * 43758.5453) % 1);
      const f3 = Math.abs((Math.sin(i * 45.164) * 43758.5453) % 1);
      positions[i * 3] = (f1 - 0.5) * 8;
      positions[i * 3 + 1] = -0.4 + f2 * 1.5;
      positions[i * 3 + 2] = -f3 * 160;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion && streakRef.current) {
      const positions = streakRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 45;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -160;
        }
      }
      streakRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const steelRailMat = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    metalness: 0.98,
    roughness: 0.12,
  });

  const catenarySteelMat = new THREE.MeshStandardMaterial({
    color: '#64748b',
    metalness: 0.9,
    roughness: 0.25,
  });

  const sleeperMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.9,
  });

  const ballastMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.95,
  });

  const zShift = travelProgress * 115;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Distant Railway Corridor Sky Backdrop */}
      <mesh position={[0, 20, -170]}>
        <planeGeometry args={[260, 100]} />
        <meshBasicMaterial color="#081426" />
      </mesh>

      {/* 2. ELEVATED RAILWAY VIADUCT CONCRETE BED & BALLAST GRAVEL */}
      <mesh material={ballastMat} position={[0, -0.9, -85]} receiveShadow>
        <boxGeometry args={[6.5, 0.45, 190]} />
      </mesh>

      {/* Textured Track Bed */}
      <mesh position={[0, -0.66, -85]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.8, 190]} />
        <meshStandardMaterial map={trackTexture} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* 3. DUAL CONTINUOUS STEEL RAILS */}
      {/* Left Rail */}
      <mesh material={steelRailMat} position={[-1.2, -0.55, -85]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.18, 190]} />
      </mesh>
      {/* Right Rail */}
      <mesh material={steelRailMat} position={[1.2, -0.55, -85]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.18, 190]} />
      </mesh>

      {/* Center Linear Induction Reaction Rail Strip */}
      <mesh position={[0, -0.62, -85]}>
        <boxGeometry args={[0.6, 0.04, 190]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>

      {/* 4. OVERHEAD CATENARY ELECTRIFICATION SYSTEM */}
      {catenaryGantries.map((z, idx) => (
        <group key={`catenary-${idx}`} position={[0, 0, z]}>
          {/* Left Vertical Steel Mast */}
          <mesh material={catenarySteelMat} position={[-3.8, 2.8, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 7.5, 8]} />
          </mesh>
          {/* Right Vertical Steel Mast */}
          <mesh material={catenarySteelMat} position={[3.8, 2.8, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 7.5, 8]} />
          </mesh>
          {/* Horizontal Cross Truss Beam */}
          <mesh material={catenarySteelMat} position={[0, 6.2, 0]}>
            <boxGeometry args={[7.8, 0.25, 0.25]} />
          </mesh>
          {/* Overhead Contact Wire Drop Arms */}
          <mesh material={steelRailMat} position={[0, 5.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
          </mesh>
          {/* Insulators */}
          <mesh position={[0, 6.0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.35, 8]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>

          {/* Railway Signal Head (Green proceed aspect) */}
          <group position={[3.4, 4.5, 0.2]}>
            <mesh material={sleeperMat}>
              <boxGeometry args={[0.35, 0.9, 0.2]} />
            </mesh>
            <mesh position={[0, 0.25, 0.11]}>
              <circleGeometry args={[0.1, 16]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
            <pointLight position={[0, 0.25, 0.2]} color="#10b981" intensity={2} distance={8} />
          </group>
        </group>
      ))}

      {/* Continuous Overhead 25kV Catenary Contact Wire */}
      <mesh material={steelRailMat} position={[0, 4.3, -85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 190, 8]} />
      </mesh>

      {/* 5. HEAVY STRUCTURAL VIADUCT PILLARS DESCENDING TO GROUND */}
      {pylons.map((z, idx) => (
        <group key={`pylon-${idx}`} position={[0, -0.9, z]}>
          <mesh material={sleeperMat} position={[0, -5.0, 0]}>
            <cylinderGeometry args={[1.0, 1.4, 10, 16]} />
          </mesh>
          <mesh material={sleeperMat} position={[0, 0, 0]}>
            <boxGeometry args={[7.5, 0.7, 1.4]} />
          </mesh>
        </group>
      ))}

      {/* 6. CAREER MILESTONE PASSENGER STATION PLATFORMS */}
      {stations.map((st, idx) => (
        <group key={`station-${idx}`} position={[0, 0, st.z]}>
          {/* Left Passenger Platform */}
          <mesh material={sleeperMat} position={[-4.5, -0.4, 0]}>
            <boxGeometry args={[2.5, 0.6, 16]} />
          </mesh>
          {/* Platform Yellow Safety Edge Strip */}
          <mesh position={[-3.3, -0.09, 0]}>
            <boxGeometry args={[0.15, 0.04, 16]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>

          {/* Right Passenger Platform */}
          <mesh material={sleeperMat} position={[4.5, -0.4, 0]}>
            <boxGeometry args={[2.5, 0.6, 16]} />
          </mesh>
          <mesh position={[3.3, -0.09, 0]}>
            <boxGeometry args={[0.15, 0.04, 16]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>

          {/* Station Overhead Canopy */}
          <mesh position={[0, 7.2, 0]} material={catenarySteelMat}>
            <boxGeometry args={[12, 0.3, 16]} />
          </mesh>

          {/* Station Signboard */}
          <group position={[0, 5.8, 0]}>
            <Text fontSize={0.46} color={st.color} anchorX="center" anchorY="middle">
              {st.name}
            </Text>
            <Text position={[0, -0.45, 0]} fontSize={0.26} color="#f8fafc" anchorX="center" anchorY="middle">
              {st.title}
            </Text>
          </group>

          <pointLight position={[0, 5.0, 0]} color={st.color} intensity={6} distance={20} />
        </group>
      ))}

      {/* 7. HIGH-SPEED RAIL STREAK PARTICLES */}
      <points ref={streakRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[streaks, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.18} color="#60a5fa" transparent opacity={0.75} blending={THREE.AdditiveBlending} />
      </points>

      {/* 8. TERMINUS CENTRAL HIGH-SPEED HYPERLOOP STATION TERMINAL */}
      <group position={[0, 2.0, -140]}>
        <mesh>
          <torusGeometry args={[8.0, 0.6, 16, 32]} />
          <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#3b82f6" intensity={12} distance={50} />
      </group>
    </group>
  );
}

export default MaglevTunnelEnvironment3D;
