import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface OceanEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function OceanDepthEnvironment3D({ travelProgress, reducedMotion = false }: OceanEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planktonRef = useRef<THREE.Points>(null);
  const bubblesRef = useRef<THREE.Points>(null);

  // 3 Verified Academic Foundations submerged at increasing depths
  const milestones = useMemo(() => [
    { title: 'DEPTH 100M // B.COM QUANTITATIVE COMMERCE', desc: 'Financial Modelling & Commercial Economics', z: -25, color: '#38bdf8' },
    { title: 'DEPTH 300M // PGDM AT IMIS', desc: 'Marketing Strategy & Frontline Leadership', z: -55, color: '#0284c7' },
    { title: 'DEPTH 600M // MCA AT AMITY UNIVERSITY', desc: 'Computer Science, Cloud Architecture & AI Systems', z: -85, color: '#00e5ff' },
  ], []);

  // Marine bioluminescent plankton
  const plankton = useMemo(() => {
    const count = 450;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 28;
      positions[i * 3 + 1] = -4 + Math.abs(f2) * 12;
      positions[i * 3 + 2] = -Math.abs(f3) * 140;
    }
    return positions;
  }, []);

  // Rising bubble streams from ocean floor
  const bubbles = useMemo(() => {
    const count = 250;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 93.123) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 27.842) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 61.918) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 18;
      positions[i * 3 + 1] = -3.8 + Math.abs(f2) * 8;
      positions[i * 3 + 2] = -Math.abs(f3) * 130;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!reducedMotion) {
      if (planktonRef.current) {
        const positions = planktonRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.005;
          positions[i * 3 + 2] += delta * 18;
          if (positions[i * 3 + 2] > 10) {
            positions[i * 3 + 2] = -140;
          }
        }
        planktonRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (bubblesRef.current) {
        const bPos = bubblesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < bPos.length / 3; i++) {
          bPos[i * 3 + 1] += delta * 3.5; // rising
          bPos[i * 3 + 2] += delta * 15;
          if (bPos[i * 3 + 1] > 6) {
            bPos[i * 3 + 1] = -3.8;
          }
          if (bPos[i * 3 + 2] > 10) {
            bPos[i * 3 + 2] = -130;
          }
        }
        bubblesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const seabedMat = new THREE.MeshStandardMaterial({
    color: '#032544',
    roughness: 0.85,
    metalness: 0.2,
  });

  const zShift = travelProgress * 105;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Visible Ocean Floor Seabed Terrain */}
      <mesh position={[0, -3.8, -70]} material={seabedMat} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 160, 24, 24]} />
      </mesh>
      {/* Sandy Ocean Ridge Lines */}
      <gridHelper args={[50, 25, '#0284c7', '#064e3b']} position={[0, -3.75, -70]} />

      {/* 2. Surface Volumetric Sunlight God Rays */}
      <mesh position={[0, 6, -45]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[2, 22, 55, 16, 1, true]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-6, 7, -70]} rotation={[0.4, 0.2, 0]}>
        <cylinderGeometry args={[1.5, 18, 50, 16, 1, true]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Submerged Academic Milestone Obelisks */}
      {milestones.map((m, idx) => (
        <group key={idx} position={[0, -0.8, m.z]}>
          {/* Submerged Monument Stele */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.6, 5.8, 0.6]} />
            <meshStandardMaterial color="#0b2c52" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Bioluminescent Rune Border */}
          <mesh position={[0, 0, 0.32]}>
            <boxGeometry args={[3.4, 5.6, 0.05]} />
            <meshBasicMaterial color={m.color} wireframe />
          </mesh>

          {/* Milestone Inscription */}
          <group position={[0, 1.4, 0.4]}>
            <Text
              fontSize={0.34}
              color={m.color}
              anchorX="center"
              anchorY="middle"
            >
              {m.title}
            </Text>
            <Text
              position={[0, -0.5, 0]}
              fontSize={0.22}
              color="#e0f2fe"
              anchorX="center"
              anchorY="middle"
            >
              {m.desc}
            </Text>
          </group>

          <pointLight position={[0, 0, 1.4]} color={m.color} intensity={5} distance={16} />
        </group>
      ))}

      {/* 4. Marine Bioluminescent Plankton */}
      <points ref={planktonRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[plankton, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color="#7dd3fc"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 5. Rising Ocean Bubble Streams */}
      <points ref={bubblesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bubbles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.26}
          color="#bae6fd"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 6. Abyssal Research Base Destination Dome */}
      <group position={[0, -0.5, -115]}>
        <mesh>
          <torusGeometry args={[6.5, 0.5, 16, 32]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#38bdf8" intensity={10} distance={40} />
      </group>
    </group>
  );
}

export default OceanDepthEnvironment3D;
