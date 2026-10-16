import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface UniverseEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function ProjectUniverseEnvironment3D({ travelProgress, reducedMotion = false }: UniverseEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Group>(null);

  // 4 explorable project planetary destinations
  const projectPlanets = useMemo(() => [
    { name: 'AUTONOMOUS AI AGENTS', desc: 'Gemini Multi-Agent System & Workflows', pos: [-7, 2.5, -28] as [number, number, number], color: '#8b5cf6', radius: 2.2 },
    { name: 'ENTERPRISE GEMINI RAG', desc: 'Vector Search & Knowledge Graph Engine', pos: [8, -1.5, -58] as [number, number, number], color: '#00e5ff', radius: 2.5 },
    { name: 'PETABYTE BIGQUERY ENGINE', desc: 'GCP Analytics, Dataform & Pipelines', pos: [-8, 3.5, -88] as [number, number, number], color: '#38bdf8', radius: 2.3 },
    { name: 'VISION INTELLIGENCE', desc: 'Real-time Multimodal Video & Image AI', pos: [6, 1.5, -118] as [number, number, number], color: '#10b981', radius: 2.6 },
  ], []);

  // Multi-tier starfield
  const stars = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 80;
      positions[i * 3 + 1] = (Math.abs(f2) - 0.5) * 50;
      positions[i * 3 + 2] = -Math.abs(f3) * 180;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      if (starsRef.current) {
        const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3 + 2] += delta * 28;
          if (positions[i * 3 + 2] > 10) {
            positions[i * 3 + 2] = -180;
          }
        }
        starsRef.current.geometry.attributes.position.needsUpdate = true;
      }
      if (nebulaRef.current) {
        nebulaRef.current.rotation.z += delta * 0.02;
      }
    }
  });

  const zShift = travelProgress * 125;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Multi-Layered Luminous Nebula Backdrop Planes */}
      <group ref={nebulaRef} position={[0, 0, -140]}>
        <mesh position={[0, 0, -10]}>
          <planeGeometry args={[160, 100]} />
          <meshBasicMaterial color="#311042" opacity={0.65} transparent />
        </mesh>
        <mesh position={[-20, 10, 0]}>
          <planeGeometry args={[100, 70]} />
          <meshBasicMaterial color="#1e1b4b" opacity={0.5} transparent />
        </mesh>
        <mesh position={[25, -10, 5]}>
          <planeGeometry args={[90, 60]} />
          <meshBasicMaterial color="#0c4a6e" opacity={0.45} transparent />
        </mesh>
      </group>

      {/* 2. High-Density Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[stars, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          color="#ffffff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3. Project Planetary Orbs & Orbit Rings */}
      {projectPlanets.map((p, idx) => (
        <group key={idx} position={p.pos}>
          {/* Planet Sphere */}
          <mesh>
            <sphereGeometry args={[p.radius, 28, 28]} />
            <meshStandardMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={0.5}
              roughness={0.35}
              metalness={0.7}
            />
          </mesh>

          {/* Planetary Luminous Ring */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[p.radius * 1.35, p.radius * 1.9, 36]} />
            <meshBasicMaterial color={p.color} opacity={0.6} transparent side={THREE.DoubleSide} />
          </mesh>

          {/* Holographic Project Name Tag */}
          <group position={[0, p.radius + 1.4, 0]}>
            <Text
              fontSize={0.46}
              color={p.color}
              anchorX="center"
              anchorY="middle"
            >
              {p.name}
            </Text>
            <Text
              position={[0, -0.45, 0]}
              fontSize={0.26}
              color="#e2e8f0"
              anchorX="center"
              anchorY="middle"
            >
              {p.desc}
            </Text>
          </group>

          <pointLight position={[0, 0, 0]} color={p.color} intensity={6} distance={25} />
        </group>
      ))}

      {/* 4. Interconnecting Luminous Cosmic Data Streams between planets */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -7, 2.5, -28, 8, -1.5, -58,
                8, -1.5, -58, -8, 3.5, -88,
                -8, 3.5, -88, 6, 1.5, -118,
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00e5ff" opacity={0.75} transparent />
      </lineSegments>

      {/* 5. Destination Deep-Space Docking Gateway */}
      <group position={[0, 0, -145]}>
        <mesh>
          <torusGeometry args={[7.5, 0.45, 16, 48]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#6d28d9" emissiveIntensity={0.9} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#8b5cf6" intensity={10} distance={50} />
      </group>
    </group>
  );
}

export default ProjectUniverseEnvironment3D;
