import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface DockEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function OrbitalDockEnvironment3D({ travelProgress, reducedMotion = false }: DockEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dockRingRef = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Points>(null);

  // Approach runway beacons and approach glide-slope alignment lights
  const beacons = useMemo(() => {
    const list: number[] = [];
    for (let z = -12; z > -130; z -= 12) {
      list.push(z);
    }
    return list;
  }, []);

  // Approach structural truss frame positions
  const trussFrames = useMemo(() => [-25, -55, -85, -115], []);

  // Starfield
  const stars = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 110;
      positions[i * 3 + 1] = (Math.abs(f2) - 0.5) * 70;
      positions[i * 3 + 2] = -Math.abs(f3) * 170;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      if (dockRingRef.current) {
        dockRingRef.current.rotation.z += delta * 0.28;
      }
      if (radarRef.current) {
        radarRef.current.rotation.y += delta * 1.5;
      }
      if (starsRef.current) {
        const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3 + 2] += delta * 24;
          if (positions[i * 3 + 2] > 10) {
            positions[i * 3 + 2] = -170;
          }
        }
        starsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const stationHull = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.95,
    roughness: 0.2,
  }), []);

  const stationTruss = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#334155',
    metalness: 0.9,
    roughness: 0.3,
  }), []);

  const solarPanelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0369a1',
    emissive: '#0284c7',
    emissiveIntensity: 0.35,
    metalness: 0.92,
    roughness: 0.1,
  }), []);

  const beaconGlow = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00e5ff',
  }), []);

  const amberBeacon = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#f59e0b',
  }), []);

  const zShift = travelProgress * 110;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Deep Space Cosmic Backdrop */}
      <mesh position={[0, 0, -170]}>
        <planeGeometry args={[260, 120]} />
        <meshBasicMaterial color="#030712" />
      </mesh>

      {/* Earth Horizon / Atmospheric Blue Limb Curve in Distance */}
      <mesh position={[45, -25, -145]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[42, 48, 48]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={0.4}
          roughness={0.7}
        />
      </mesh>

      {/* 2. Realistic Starfield Points */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[stars, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color="#ffffff"
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3. Orbital Approach Glide-Slope Runway Light Corridor */}
      {beacons.map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          {/* Left / Right Approach Light Pylons */}
          <mesh position={[-5.8, -1.8, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          <mesh position={[-5.8, -1.4, 0]} material={idx % 2 === 0 ? beaconGlow : amberBeacon}>
            <sphereGeometry args={[0.18, 12, 12]} />
          </mesh>

          <mesh position={[5.8, -1.8, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          <mesh position={[5.8, -1.4, 0]} material={idx % 2 === 0 ? beaconGlow : amberBeacon}>
            <sphereGeometry args={[0.18, 12, 12]} />
          </mesh>

          <pointLight position={[0, -1.4, 0]} color="#00e5ff" intensity={1.8} distance={14} />
        </group>
      ))}

      {/* Center Guidance Laser Line running along the approach path */}
      <mesh position={[0, -1.9, -70]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 140]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* 4. Flanking Space Station Structural Truss Gantries */}
      {trussFrames.map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          {/* Flanking Modular Service Scaffolds */}
          {[-8.5, 8.5].map((x, sideIdx) => (
            <group key={sideIdx} position={[x, 1.5, 0]}>
              <mesh material={stationTruss}>
                <boxGeometry args={[1.5, 6.5, 1.5]} />
              </mesh>
              {/* Horizontal Cross Struts */}
              <mesh position={[sideIdx === 0 ? 1.0 : -1.0, 2.5, 0]} material={stationTruss}>
                <boxGeometry args={[1.8, 0.25, 0.25]} />
              </mesh>
              {/* Navigation Warning Light on top of truss */}
              <mesh position={[0, 3.4, 0]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Telemetry Radar Dish Array on approach frame */}
      <group ref={radarRef} position={[-8.5, 5.5, -45]}>
        <mesh rotation={[0.4, 0, 0]}>
          <coneGeometry args={[1.2, 0.5, 16, 1, true]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8]} />
          <meshStandardMaterial color="#00e5ff" />
        </mesh>
      </group>

      {/* 5. Massive Orbital Space Station Docking Ring Complex */}
      <group position={[0, 1.2, -135]}>
        {/* Rotating Mega Habitat Ring */}
        <group ref={dockRingRef}>
          <mesh material={stationHull}>
            <torusGeometry args={[11.5, 0.9, 16, 48]} />
          </mesh>
          {/* Luminous Hab Window Strip */}
          <mesh>
            <torusGeometry args={[11.5, 0.15, 16, 48]} />
            <meshBasicMaterial color="#38bdf8" opacity={0.8} transparent />
          </mesh>
          {/* 4 Massive Spoke Bridges */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, sIdx) => (
            <group key={sIdx} rotation={[0, 0, angle]}>
              <mesh position={[5.8, 0, 0]} material={stationTruss}>
                <boxGeometry args={[10.5, 0.8, 0.8]} />
              </mesh>
            </group>
          ))}
          {/* Solar Array Wings Extending Outwards */}
          {[-1, 1].map((dir, sIdx) => (
            <mesh key={sIdx} position={[dir * 14.8, 0, 0]} material={solarPanelMat}>
              <boxGeometry args={[5.5, 0.12, 3.2]} />
            </mesh>
          ))}
        </group>

        {/* Inner Pressurized Docking Collar */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[5.2, 0.55, 16, 36]} />
          <meshStandardMaterial color="#0369a1" metalness={0.92} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[4.85, 0.12, 16, 36]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>

        {/* 4 Hydraulic Docking Clamp Arms */}
        {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((angle, cIdx) => (
          <group key={cIdx} rotation={[0, 0, angle]}>
            <mesh position={[3.6, 0, 1.2]} material={stationHull}>
              <boxGeometry args={[1.4, 0.45, 2.2]} />
            </mesh>
          </group>
        ))}

        {/* Station Command Tower */}
        <mesh position={[0, 13.5, 0]} material={stationHull}>
          <boxGeometry args={[2.2, 4.5, 2.2]} />
        </mesh>

        {/* Collaboration Portal Illuminated Telemetry */}
        <group position={[0, 7.2, 0]}>
          <Text
            fontSize={0.55}
            color="#00e5ff"
            anchorX="center"
            anchorY="middle"
          >
            ORBITAL COLLABORATION PORTAL
          </Text>
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.28}
            color="#f1f5f9"
            anchorX="center"
            anchorY="middle"
          >
            Direct Inquiry Transmission &amp; Partnership Docking
          </Text>
        </group>

        <pointLight position={[0, 0, 3]} color="#00e5ff" intensity={12} distance={60} />
      </group>
    </group>
  );
}

export default OrbitalDockEnvironment3D;
