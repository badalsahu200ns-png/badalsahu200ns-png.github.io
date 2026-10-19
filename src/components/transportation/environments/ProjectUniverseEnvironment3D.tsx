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
  const asteroidsRef = useRef<THREE.Group>(null);

  // 4 explorable project planetary destinations
  const projectPlanets = useMemo(() => [
    { name: 'AUTONOMOUS AI AGENTS', desc: 'Gemini Multi-Agent System & Workflows', pos: [-9, 3.5, -28] as [number, number, number], color: '#8b5cf6', radius: 2.4 },
    { name: 'ENTERPRISE GEMINI RAG', desc: 'Vector Search & Knowledge Graph Engine', pos: [10, -2.5, -60] as [number, number, number], color: '#00e5ff', radius: 2.8 },
    { name: 'PETABYTE BIGQUERY ENGINE', desc: 'GCP Analytics, Dataform & Pipelines', pos: [-10, 4.5, -92] as [number, number, number], color: '#38bdf8', radius: 2.5 },
    { name: 'VISION INTELLIGENCE', desc: 'Real-time Multimodal Video & Image AI', pos: [8, 2.5, -124] as [number, number, number], color: '#10b981', radius: 2.9 },
  ], []);

  // 3D Asteroid field tumbling in space
  const asteroids = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; scale: number; rotSpeed: [number, number, number] }> = [];
    for (let i = 0; i < 28; i++) {
      const x = (i % 2 === 0 ? -1 : 1) * (14 + ((i * 5) % 18));
      const y = -12 + ((i * 7) % 24);
      const z = -i * 6 - 8;
      list.push({
        pos: [x, y, z],
        scale: 0.8 + ((i * 3) % 4) * 0.4,
        rotSpeed: [(i % 3) * 0.01 + 0.005, (i % 4) * 0.01 + 0.005, (i % 2) * 0.01],
      });
    }
    return list;
  }, []);

  // Multi-tier starfield
  const stars = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 110;
      positions[i * 3 + 1] = (Math.abs(f2) - 0.5) * 80;
      positions[i * 3 + 2] = -Math.abs(f3) * 200;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      if (starsRef.current) {
        const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3 + 2] += delta * 24;
          if (positions[i * 3 + 2] > 10) {
            positions[i * 3 + 2] = -200;
          }
        }
        starsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (asteroidsRef.current) {
        asteroidsRef.current.children.forEach((child, idx) => {
          const a = asteroids[idx];
          if (a) {
            child.rotation.x += a.rotSpeed[0];
            child.rotation.y += a.rotSpeed[1];
          }
        });
      }
    }
  });

  const asteroidMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.95,
    metalness: 0.3,
  });

  const zShift = travelProgress * 125;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Deep Celestial Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.32} color="#ffffff" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </points>

      {/* 2. Distant Deep Space Gas Giant with Planetary Rings */}
      <group position={[35, 18, -160]}>
        <mesh>
          <sphereGeometry args={[14, 32, 32]} />
          <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.25} roughness={0.7} />
        </mesh>
        {/* Giant Ring */}
        <mesh rotation={[Math.PI / 3, 0.2, 0]}>
          <ringGeometry args={[17, 26, 48]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3. Real 3D Tumbling Asteroids */}
      <group ref={asteroidsRef}>
        {asteroids.map((a, idx) => (
          <mesh
            key={`ast-${idx}`}
            position={a.pos}
            scale={[a.scale, a.scale * 0.8, a.scale * 1.2]}
            material={asteroidMat}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[1.5, 1]} />
          </mesh>
        ))}
      </group>

      {/* 4. Project Planetary Orbs & Orbit Systems */}
      {projectPlanets.map((p, idx) => (
        <group key={idx} position={p.pos}>
          {/* Main Planet Sphere */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[p.radius, 32, 32]} />
            <meshStandardMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={0.4}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>

          {/* Planetary Orbital Ring */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[p.radius * 1.3, p.radius * 1.85, 36]} />
            <meshBasicMaterial color={p.color} opacity={0.6} transparent side={THREE.DoubleSide} />
          </mesh>

          {/* Holographic Project Nameplate */}
          <group position={[0, p.radius + 1.5, 0]}>
            <Text fontSize={0.52} color={p.color} anchorX="center" anchorY="middle">
              {p.name}
            </Text>
            <Text position={[0, -0.48, 0]} fontSize={0.28} color="#f8fafc" anchorX="center" anchorY="middle">
              {p.desc}
            </Text>
          </group>

          <pointLight position={[0, 0, 0]} color={p.color} intensity={6} distance={28} />
        </group>
      ))}

      {/* 5. Interstellar Gateway Nexus at Terminus */}
      <group position={[0, 0, -150]}>
        <mesh>
          <torusGeometry args={[8.5, 0.5, 16, 48]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#6d28d9" emissiveIntensity={0.85} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#8b5cf6" intensity={12} distance={55} />
      </group>
    </group>
  );
}

export default ProjectUniverseEnvironment3D;
