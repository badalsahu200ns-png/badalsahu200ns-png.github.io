import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TunnelEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function MaglevTunnelEnvironment3D({ travelProgress, reducedMotion = false }: TunnelEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const streakRef = useRef<THREE.Points>(null);

  // 4 Verified Career Milestone Stations passing by as the train accelerates
  const stations = useMemo(() => [
    { name: 'STATION 01 // MAGICBRICKS', title: 'SENIOR SALES MANAGER (2023 - 2024)', color: '#3b82f6', z: -20 },
    { name: 'STATION 02 // REDBUS', title: 'ASST. MANAGER SALES (2022 - 2023)', color: '#10b981', z: -48 },
    { name: 'STATION 03 // RELIANCE RETAIL', title: 'STORE MANAGER / OPERATIONS (2020 - 2022)', color: '#06b6d4', z: -76 },
    { name: 'STATION 04 // ICICI PRUDENTIAL', title: 'FINANCIAL SERVICES ADVISOR', color: '#f59e0b', z: -104 },
  ], []);

  // Elevated track support pylons
  const pylons = useMemo(() => {
    const list: number[] = [];
    for (let z = -5; z > -150; z -= 14) {
      list.push(z);
    }
    return list;
  }, []);

  // Distant city towers on both sides
  const cityBuildings = useMemo(() => {
    const list: Array<{ x: number; z: number; h: number; w: number }> = [];
    for (let i = 0; i < 28; i++) {
      const z = -i * 5 - 10;
      const h1 = 15 + ((i * 7) % 25);
      const h2 = 18 + ((i * 9) % 22);
      list.push({ x: -14 - ((i * 3) % 6), z, h: h1, w: 4 });
      list.push({ x: 14 + ((i * 3) % 6), z, h: h2, w: 4 });
    }
    return list;
  }, []);

  // Speed streak particles
  const streaks = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.8 + Math.random() * 2.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius + 0.6;
      positions[i * 3 + 2] = -Math.random() * 150;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion && streakRef.current) {
      const positions = streakRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 42;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -150;
        }
      }
      streakRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const railMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    metalness: 0.95,
    roughness: 0.15,
  });

  const pylonMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.8,
    roughness: 0.35,
  });

  const cityMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    metalness: 0.85,
    roughness: 0.25,
  });

  const zShift = travelProgress * 115;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Distant Glowing City Horizon */}
      <mesh position={[0, 15, -170]}>
        <planeGeometry args={[240, 100]} />
        <meshBasicMaterial color="#0b1b36" transparent opacity={0.75} />
      </mesh>

      {/* 2. Elevated Maglev Concrete Guide Deck */}
      <mesh material={pylonMat} position={[0, -0.8, -75]}>
        <boxGeometry args={[4.2, 0.4, 180]} />
      </mesh>

      {/* 3. Dual Elevated Maglev Steel Rails */}
      <mesh material={railMat} position={[-1.1, -0.55, -75]}>
        <boxGeometry args={[0.25, 0.2, 180]} />
      </mesh>
      <mesh material={railMat} position={[1.1, -0.55, -75]}>
        <boxGeometry args={[0.25, 0.2, 180]} />
      </mesh>

      {/* 4. Glowing Blue Magnetic Induction Power Core Strip */}
      <mesh position={[0, -0.58, -75]}>
        <boxGeometry args={[0.5, 0.06, 180]} />
        <meshBasicMaterial color="#3b82f6" opacity={0.9} transparent />
      </mesh>

      {/* 5. Structural Concrete Pylons extending down beneath track */}
      {pylons.map((z, idx) => (
        <group key={idx} position={[0, -0.8, z]}>
          <mesh material={pylonMat} position={[0, -4.5, 0]}>
            <cylinderGeometry args={[0.8, 1.2, 9, 16]} />
          </mesh>
          <mesh material={pylonMat} position={[0, 0, 0]}>
            <boxGeometry args={[5.2, 0.6, 1.2]} />
          </mesh>
        </group>
      ))}

      {/* 6. Distant City Skyscrapers on both sides for track parallax */}
      {cityBuildings.map((b, idx) => (
        <group key={idx} position={[b.x, b.h / 2 - 8, b.z]}>
          <mesh material={cityMat}>
            <boxGeometry args={[b.w, b.h, b.w]} />
          </mesh>
          <mesh position={[0, 0, b.w / 2 + 0.02]}>
            <planeGeometry args={[b.w * 0.7, b.h * 0.8]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.35} />
          </mesh>
        </group>
      ))}

      {/* 7. Career Milestone Station Gantries */}
      {stations.map((st, idx) => (
        <group key={idx} position={[0, 0, st.z]}>
          {/* Luminous Station Gantry Arch */}
          <mesh position={[0, 1.8, 0]}>
            <torusGeometry args={[4.4, 0.22, 16, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <torusGeometry args={[4.2, 0.09, 16, 32]} />
            <meshBasicMaterial color={st.color} opacity={0.9} transparent />
          </mesh>

          {/* Station Title Signboard */}
          <group position={[0, 4.2, 0]}>
            <Text
              fontSize={0.42}
              color={st.color}
              anchorX="center"
              anchorY="middle"
            >
              {st.name}
            </Text>
            <Text
              position={[0, -0.42, 0]}
              fontSize={0.24}
              color="#f1f5f9"
              anchorX="center"
              anchorY="middle"
            >
              {st.title}
            </Text>
          </group>

          <pointLight position={[0, 1.8, 0]} color={st.color} intensity={5.5} distance={18} />
        </group>
      ))}

      {/* 8. High-speed streak particles */}
      <points ref={streakRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[streaks, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          color="#60a5fa"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 9. Destination Hyperloop Terminal Terminus */}
      <group position={[0, 1.5, -135]}>
        <mesh>
          <torusGeometry args={[6.5, 0.5, 16, 32]} />
          <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.9} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#3b82f6" intensity={10} distance={45} />
      </group>
    </group>
  );
}

export default MaglevTunnelEnvironment3D;
