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
  const telemetryPulsesRef = useRef<THREE.Points>(null);

  // Verified Technology Domains displayed along the hyperloop tube raceway
  const techNodes = useMemo(() => [
    { name: 'PYTHON // PYTORCH', cat: 'AI & Data Engineering Pipelines', pos: [-3.8, 1.8, -24] as [number, number, number], color: '#6366f1' },
    { name: 'GEMINI API // AGY SDK', cat: 'Autonomous Multi-Agent Systems', pos: [3.8, 1.8, -46] as [number, number, number], color: '#00e5ff' },
    { name: 'TYPESCRIPT // REACT', cat: 'Modern Reactive Web Architecture', pos: [-3.8, 1.8, -68] as [number, number, number], color: '#38bdf8' },
    { name: 'THREE.JS // WEBGL', cat: '3D Spatial Compute & Shaders', pos: [3.8, 1.8, -90] as [number, number, number], color: '#10b981' },
    { name: 'BIGQUERY // SQL', cat: 'Petabyte Cloud Analytics & Dataform', pos: [-3.8, 1.8, -112] as [number, number, number], color: '#f59e0b' },
    { name: 'DOCKER // CLOUD RUN', cat: 'Containerized Microservices', pos: [3.8, 1.8, -134] as [number, number, number], color: '#ec4899' },
  ], []);

  // Structural stiffener rings of the vacuum tube
  const tubeRings = useMemo(() => {
    const list: number[] = [];
    for (let z = 0; z > -180; z -= 6) {
      list.push(z);
    }
    return list;
  }, []);

  // Linear induction motor stator coils on track
  const statorCoils = useMemo(() => {
    const list: number[] = [];
    for (let z = 0; z > -180; z -= 3) {
      list.push(z);
    }
    return list;
  }, []);

  // Electromagnetic plasma ionization particles inside evacuated vacuum
  const telemetryParticles = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 * 6;
      const radius = 2.0 + (Math.sin(i * 1.5) * 0.5 + 0.5) * 2.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.8 + 1.2;
      positions[i * 3 + 2] = -((i * 0.38) % 155);
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion && telemetryPulsesRef.current) {
      const positions = telemetryPulsesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 46;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -155;
        }
      }
      telemetryPulsesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const tubeShellMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#080d1a',
    metalness: 0.9,
    roughness: 0.2,
    side: THREE.BackSide,
  }), []);

  const steelRingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.95,
    roughness: 0.15,
  }), []);

  const maglevRailMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#0284c7',
    emissiveIntensity: 0.45,
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  const zShift = travelProgress * 125;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Cylindrical Vacuum Transit Tube Outer Shell */}
      <mesh position={[0, 1.5, -85]} rotation={[Math.PI / 2, 0, 0]} material={tubeShellMaterial}>
        <cylinderGeometry args={[5.8, 5.8, 190, 32, 1, true]} />
      </mesh>

      {/* Longitudinal Vacuum Tube Luminescent Guide Strips */}
      {[-4.2, 4.2].map((x, idx) => (
        <mesh key={idx} position={[x, 3.8, -85]} rotation={[0, 0, idx === 0 ? 0.6 : -0.6]}>
          <boxGeometry args={[0.08, 0.25, 190]} />
          <meshBasicMaterial color="#6366f1" />
        </mesh>
      ))}

      {/* Ceiling Service Lighting Raceway */}
      <mesh position={[0, 6.8, -85]}>
        <boxGeometry args={[0.4, 0.15, 190]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* 2. Tube Heavy Structural Bulkhead Stiffener Rings */}
      {tubeRings.map((z, idx) => (
        <group key={idx} position={[0, 1.5, z]}>
          <mesh material={steelRingMaterial}>
            <torusGeometry args={[5.7, 0.22, 12, 36]} />
          </mesh>
          {/* Cyan Electroluminescent Compression Ring */}
          <mesh>
            <torusGeometry args={[5.55, 0.04, 8, 36]} />
            <meshBasicMaterial color="#00e5ff" opacity={0.65} transparent />
          </mesh>
        </group>
      ))}

      {/* 3. Linear Induction Maglev Stator Track Bed along the bottom */}
      <mesh position={[0, -0.15, -85]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.8, 190]} />
        <meshStandardMaterial color="#0b1120" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Left and Right Magnetic Levitation Guide Flanges */}
      {[-1.8, 1.8].map((x, idx) => (
        <mesh key={idx} position={[x, 0.2, -85]} material={maglevRailMaterial}>
          <boxGeometry args={[0.22, 0.35, 190]} />
        </mesh>
      ))}

      {/* Central Linear Induction Motor (LIM) Stator Core */}
      <mesh position={[0, 0.05, -85]}>
        <boxGeometry args={[1.2, 0.12, 190]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Stator Electromagnetic Induction Coil Blocks */}
      {statorCoils.map((z, idx) => (
        <mesh key={idx} position={[0, 0.12, z]}>
          <boxGeometry args={[0.95, 0.06, 1.6]} />
          <meshStandardMaterial color="#4338ca" emissive="#3730a3" emissiveIntensity={0.35} metalness={0.8} />
        </mesh>
      ))}

      {/* 4. Integrated Tube-Wall Synaptic Technology Displays */}
      {techNodes.map((t, idx) => (
        <group key={idx} position={t.pos}>
          {/* Wall-Mounted Curvature HUD Bracket */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.25, 2.2, 3.8]} />
            <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Glowing Display Screen Glass */}
          <mesh position={[t.pos[0] > 0 ? -0.14 : 0.14, 0, 0]}>
            <boxGeometry args={[0.04, 1.9, 3.4]} />
            <meshStandardMaterial color="#030712" emissive={t.color} emissiveIntensity={0.25} roughness={0.1} />
          </mesh>

          {/* Node Text Telemetry */}
          <group position={[t.pos[0] > 0 ? -0.2 : 0.2, 0.3, 0]} rotation={[0, t.pos[0] > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <Text
              fontSize={0.34}
              color={t.color}
              anchorX="center"
              anchorY="middle"
            >
              {t.name}
            </Text>
            <Text
              position={[0, -0.4, 0]}
              fontSize={0.2}
              color="#e0e7ff"
              anchorX="center"
              anchorY="middle"
            >
              {t.cat}
            </Text>
          </group>

          <pointLight position={[0, 0, 0]} color={t.color} intensity={4.5} distance={14} />
        </group>
      ))}

      {/* 5. Evacuated Ionized Plasma Telemetry Particles */}
      <points ref={telemetryPulsesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[telemetryParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color="#818cf8"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 6. Destination Hyperloop Station Pressurized Airlock Bulkhead */}
      <group position={[0, 1.5, -145]}>
        {/* Massive Reinforced Station Entry Collar */}
        <mesh material={steelRingMaterial}>
          <torusGeometry args={[6.2, 0.6, 16, 36]} />
        </mesh>
        <mesh>
          <torusGeometry args={[5.5, 0.15, 16, 36]} />
          <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={0.9} />
        </mesh>
        <pointLight position={[0, 0, 2]} color="#6366f1" intensity={9} distance={45} />
      </group>
    </group>
  );
}

export default NeuralNetworkEnvironment3D;
