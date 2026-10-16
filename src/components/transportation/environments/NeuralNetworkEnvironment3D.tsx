import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface NeuralEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function NeuralNetworkEnvironment3D({ travelProgress, reducedMotion = false }: NeuralEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulsesRef = useRef<THREE.Points>(null);

  // Verified Technology Synaptic Nodes distributed in 3D
  const techNodes = useMemo(() => [
    { name: 'PYTHON // PYTORCH', cat: 'AI & Data Engineering Pipelines', pos: [-5, 2.5, -24] as [number, number, number], color: '#6366f1' },
    { name: 'GEMINI API // AGY SDK', cat: 'Autonomous Multi-Agent Systems', pos: [5, -1.5, -46] as [number, number, number], color: '#00e5ff' },
    { name: 'TYPESCRIPT // REACT', cat: 'Modern Reactive Web Architecture', pos: [-6, -2.5, -68] as [number, number, number], color: '#38bdf8' },
    { name: 'THREE.JS // WEBGL', cat: '3D Spatial Compute & Shaders', pos: [6, 2.5, -90] as [number, number, number], color: '#10b981' },
    { name: 'BIGQUERY // SQL', cat: 'Petabyte Cloud Analytics & Dataform', pos: [-4, 1.5, -112] as [number, number, number], color: '#f59e0b' },
    { name: 'DOCKER // CLOUD RUN', cat: 'Containerized Microservices', pos: [5, -1.5, -134] as [number, number, number], color: '#ec4899' },
  ], []);

  // Geometric transit guide rings
  const rings = useMemo(() => {
    const list: number[] = [];
    for (let z = -5; z > -160; z -= 8) {
      list.push(z);
    }
    return list;
  }, []);

  // Neural pulse packets
  const pulses = useMemo(() => {
    const count = 450;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 22;
      positions[i * 3 + 1] = (Math.abs(f2) - 0.5) * 16;
      positions[i * 3 + 2] = -Math.abs(f3) * 150;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion && pulsesRef.current) {
      const positions = pulsesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 32;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -150;
        }
      }
      pulsesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const ringMat = new THREE.MeshBasicMaterial({
    color: '#4338ca',
    transparent: true,
    opacity: 0.5,
  });

  const zShift = travelProgress * 125;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Luminous Deep Violet Nebula Backdrop */}
      <mesh position={[0, 0, -170]}>
        <planeGeometry args={[220, 100]} />
        <meshBasicMaterial color="#1a123d" transparent opacity={0.8} />
      </mesh>

      {/* 2. Geometric Tunnel Guide Rings */}
      {rings.map((z, idx) => (
        <mesh key={idx} material={ringMat} position={[0, 0, z]} rotation={[0, 0, idx * 0.1]}>
          <torusGeometry args={[4.5, 0.05, 8, 32]} />
        </mesh>
      ))}

      {/* 3. Synaptic Technology Nodes */}
      {techNodes.map((t, idx) => (
        <group key={idx} position={t.pos}>
          {/* Node Orb Core */}
          <mesh>
            <sphereGeometry args={[1.3, 20, 20]} />
            <meshStandardMaterial
              color={t.color}
              emissive={t.color}
              emissiveIntensity={0.65}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>

          {/* Synaptic Aura Ring */}
          <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[1.9, 0.05, 12, 28]} />
            <meshBasicMaterial color={t.color} opacity={0.7} transparent />
          </mesh>

          {/* Node Label */}
          <group position={[0, 2.1, 0]}>
            <Text
              fontSize={0.4}
              color={t.color}
              anchorX="center"
              anchorY="middle"
            >
              {t.name}
            </Text>
            <Text
              position={[0, -0.4, 0]}
              fontSize={0.24}
              color="#e0e7ff"
              anchorX="center"
              anchorY="middle"
            >
              {t.cat}
            </Text>
          </group>

          <pointLight position={[0, 0, 0]} color={t.color} intensity={5.5} distance={18} />
        </group>
      ))}

      {/* 4. Synaptic Fiber-Optic Cables connecting nodes */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -5, 2.5, -24, 5, -1.5, -46,
                5, -1.5, -46, -6, -2.5, -68,
                -6, -2.5, -68, 6, 2.5, -90,
                6, 2.5, -90, -4, 1.5, -112,
                -4, 1.5, -112, 5, -1.5, -134,
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#818cf8" opacity={0.65} transparent />
      </lineSegments>

      {/* 5. Floating Neural Pulses */}
      <points ref={pulsesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulses, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          color="#a5b4fc"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 6. Destination Neural Core Terminus Gateway */}
      <group position={[0, 0, -145]}>
        <mesh>
          <torusGeometry args={[7.2, 0.5, 16, 32]} />
          <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={0.85} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#6366f1" intensity={10} distance={50} />
      </group>
    </group>
  );
}

export default NeuralNetworkEnvironment3D;
