import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SkylineEnvProps {
  travelProgress: number; // 0 to 1
  reducedMotion?: boolean;
}

export function SkylineEnvironment3D({ travelProgress, reducedMotion = false }: SkylineEnvProps) {
  const cityGroupRef = useRef<THREE.Group>(null);
  const trafficRef = useRef<THREE.Points>(null);

  // Procedural skyline buildings
  const buildings = useMemo(() => {
    const list: Array<{
      pos: [number, number, number];
      size: [number, number, number];
      color: string;
      neonColor: string;
    }> = [];

    // Left and right avenue columns of skyscrapers
    for (let i = 0; i < 44; i++) {
      const z = -i * 5.5 - 6;
      const height1 = 12 + ((i * 7) % 20);
      const height2 = 14 + ((i * 11) % 22);
      const width1 = 3.0 + ((i * 3) % 2);
      const width2 = 3.0 + ((i * 5) % 2);

      const sideX1 = -(6.5 + ((i * 2) % 3));
      const sideX2 = 6.5 + ((i * 2) % 3);

      const neon = i % 3 === 0 ? '#00e5ff' : i % 3 === 1 ? '#10b981' : '#38bdf8';

      list.push({
        pos: [sideX1, height1 / 2 - 3, z],
        size: [width1, height1, 4.5],
        color: '#131e34',
        neonColor: neon,
      });

      list.push({
        pos: [sideX2, height2 / 2 - 3, z],
        size: [width2, height2, 4.5],
        color: '#16223b',
        neonColor: neon,
      });
    }

    return list;
  }, []);

  // Traffic / aerial light ribbons
  const trafficParticles = useMemo(() => {
    const count = 350;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 22;
      positions[i * 3 + 1] = -0.5 + Math.abs(f2) * 8;
      positions[i * 3 + 2] = -Math.abs(f3) * 200;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion && trafficRef.current) {
      const positions = trafficRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 30;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -200;
        }
      }
      trafficRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const buildingMat = new THREE.MeshStandardMaterial({
    color: '#172544',
    metalness: 0.85,
    roughness: 0.25,
  });

  const windowGlowMat = new THREE.MeshBasicMaterial({
    color: '#00e5ff',
    transparent: true,
    opacity: 0.55,
  });

  const destinationRingMat = new THREE.MeshBasicMaterial({
    color: '#00e5ff',
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  // Calculate building movement as flight progresses
  const zShift = travelProgress * 95;

  return (
    <group ref={cityGroupRef} position={[0, 0, zShift]}>
      {/* 1. Distant Glowing Horizon Sky Plane */}
      <mesh position={[0, 15, -160]}>
        <planeGeometry args={[220, 90]} />
        <meshBasicMaterial color="#0a254c" transparent opacity={0.8} />
      </mesh>

      {/* 2. Illuminated Ground Highway Grid with moving light ribbons */}
      <mesh position={[0, -2.8, -80]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 200]} />
        <meshStandardMaterial color="#0c172a" roughness={0.7} metalness={0.6} />
      </mesh>
      <gridHelper args={[40, 40, '#00e5ff', '#1e293b']} position={[0, -2.75, -80]} />

      {/* 3. Luminous Central Highway Divider Lights */}
      <mesh position={[0, -2.7, -80]}>
        <boxGeometry args={[0.3, 0.05, 200]} />
        <meshBasicMaterial color="#00e5ff" opacity={0.75} transparent />
      </mesh>

      {/* 4. Skyscrapers */}
      {buildings.map((b, idx) => (
        <group key={idx} position={b.pos}>
          {/* Main Tower Box */}
          <mesh material={buildingMat}>
            <boxGeometry args={b.size} />
          </mesh>
          {/* Top Neon Spire / Rooftop Beacon */}
          <mesh position={[0, b.size[1] / 2 + 0.8, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.6, 8]} />
            <meshBasicMaterial color={b.neonColor} />
          </mesh>
          {/* Window Matrix Ribbon */}
          <mesh position={[0, 0, b.size[2] / 2 + 0.02]} material={windowGlowMat}>
            <planeGeometry args={[b.size[0] * 0.75, b.size[1] * 0.8]} />
          </mesh>
        </group>
      ))}

      {/* 5. Airborne Traffic Light Ribbons */}
      <points ref={trafficRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trafficParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          color="#38bdf8"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 6. Destination: Executive Command Center Skyport at end of avenue */}
      <group position={[0, 2.5, -110]}>
        {/* Skyport Platform */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[8, 9, 1.0, 32]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Luminous Approach Rings */}
        <mesh position={[0, 1.5, 6]} material={destinationRingMat}>
          <torusGeometry args={[3.4, 0.09, 16, 32]} />
        </mesh>
        <mesh position={[0, 1.5, 0]} material={destinationRingMat}>
          <torusGeometry args={[4.0, 0.09, 16, 32]} />
        </mesh>

        {/* Command Center Beacon Light */}
        <pointLight position={[0, 4, 0]} color="#00e5ff" intensity={8} distance={60} />
      </group>
    </group>
  );
}

export default SkylineEnvironment3D;
