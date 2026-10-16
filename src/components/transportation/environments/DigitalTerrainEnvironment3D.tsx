import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TerrainEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function DigitalTerrainEnvironment3D({ travelProgress, reducedMotion = false }: TerrainEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sparksRef = useRef<THREE.Points>(null);

  // 4 Capability Zones crossed along the terrain
  const capabilityZones = useMemo(() => [
    { name: 'ZONE 01 // BUSINESS ANALYTICS', desc: 'Frontline Leadership & Commercial Acumen', z: -25, color: '#10b981' },
    { name: 'ZONE 02 // GENERATIVE AI', desc: 'Autonomous Multi-Agent Orchestration & LLMs', z: -55, color: '#00e5ff' },
    { name: 'ZONE 03 // SOFTWARE ENGINEERING', desc: 'Full-Stack Distributed Systems & APIs', z: -85, color: '#3b82f6' },
    { name: 'ZONE 04 // DATA ARCHITECTURE', desc: 'GCP BigQuery & Enterprise Pipelines', z: -115, color: '#8b5cf6' },
  ], []);

  // Digital canyon mountain ridge silhouettes
  const canyonHills = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; size: [number, number, number] }> = [];
    for (let i = 0; i < 30; i++) {
      const z = -i * 5 - 10;
      const h1 = 8 + ((i * 5) % 15);
      const h2 = 8 + ((i * 7) % 15);
      list.push({ pos: [-12 - ((i * 2) % 4), h1 / 2 - 2, z], size: [8, h1, 6] });
      list.push({ pos: [12 + ((i * 2) % 4), h2 / 2 - 2, z], size: [8, h2, 6] });
    }
    return list;
  }, []);

  // Digital sparks flying off tires
  const sparks = useMemo(() => {
    const count = 450;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 16;
      positions[i * 3 + 1] = Math.abs(f2) * 3.5;
      positions[i * 3 + 2] = -Math.abs(f3) * 140;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion && sparksRef.current) {
      const positions = sparksRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 36;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -140;
        }
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const terrainMat = new THREE.MeshStandardMaterial({
    color: '#06281e',
    roughness: 0.8,
    metalness: 0.3,
  });

  const mountainMat = new THREE.MeshStandardMaterial({
    color: '#041d14',
    roughness: 0.9,
    metalness: 0.4,
  });

  const zShift = travelProgress * 120;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Distant Canyon Emerald Horizon */}
      <mesh position={[0, 15, -170]}>
        <planeGeometry args={[240, 90]} />
        <meshBasicMaterial color="#05241b" transparent opacity={0.8} />
      </mesh>

      {/* 2. Cyber Terrain Ground Surface */}
      <mesh position={[0, -0.2, -75]} material={terrainMat} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 180, 32, 32]} />
      </mesh>
      <gridHelper args={[50, 40, '#10b981', '#064e3b']} position={[0, -0.18, -75]} />

      {/* 3. Canyon Flanking Ridges */}
      {canyonHills.map((h, idx) => (
        <group key={idx} position={h.pos}>
          <mesh material={mountainMat}>
            <boxGeometry args={h.size} />
          </mesh>
          <mesh position={[0, h.size[1] / 2 + 0.05, 0]}>
            <boxGeometry args={[h.size[0] * 0.9, 0.1, h.size[2] * 0.9]} />
            <meshBasicMaterial color="#10b981" opacity={0.4} transparent />
          </mesh>
        </group>
      ))}

      {/* 4. Capability Zone Neon Monolith Arches */}
      {capabilityZones.map((zone, idx) => (
        <group key={idx} position={[0, 0, zone.z]}>
          {/* Left and Right Cyber Pillars */}
          <mesh position={[-5.5, 3.0, 0]}>
            <boxGeometry args={[0.7, 6.5, 0.7]} />
            <meshStandardMaterial color="#064e3b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[5.5, 3.0, 0]}>
            <boxGeometry args={[0.7, 6.5, 0.7]} />
            <meshStandardMaterial color="#064e3b" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Overhead Luminous Zone Beam */}
          <mesh position={[0, 6.1, 0]}>
            <boxGeometry args={[11.7, 0.35, 0.5]} />
            <meshBasicMaterial color={zone.color} />
          </mesh>

          {/* Floating Zone Title */}
          <group position={[0, 4.8, 0]}>
            <Text
              fontSize={0.44}
              color={zone.color}
              anchorX="center"
              anchorY="middle"
            >
              {zone.name}
            </Text>
            <Text
              position={[0, -0.45, 0]}
              fontSize={0.25}
              color="#e2e8f0"
              anchorX="center"
              anchorY="middle"
            >
              {zone.desc}
            </Text>
          </group>

          <pointLight position={[0, 3.5, 0]} color={zone.color} intensity={5.5} distance={18} />
        </group>
      ))}

      {/* 5. Cyber Sparks & Terrain Dust */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparks, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color="#34d399"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 6. Destination Cyber Terminus Platform */}
      <group position={[0, 1.2, -140]}>
        <mesh>
          <torusGeometry args={[7.0, 0.5, 16, 32]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.85} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#10b981" intensity={9} distance={45} />
      </group>
    </group>
  );
}

export default DigitalTerrainEnvironment3D;
