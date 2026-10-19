import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { getWaterCausticTexture } from '../textures/pbrTextures';

interface OceanEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function OceanDepthEnvironment3D({ travelProgress, reducedMotion = false }: OceanEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planktonRef = useRef<THREE.Points>(null);
  const bubblesRef = useRef<THREE.Points>(null);

  const causticTexture = useMemo(() => getWaterCausticTexture(), []);

  // 3 Verified Academic Foundations
  const milestones = useMemo(() => [
    { title: 'DEPTH 100M // B.COM COMMERCE & QUANTITATIVE', desc: 'Financial Modelling & Commercial Economics', z: -25, color: '#38bdf8' },
    { title: 'DEPTH 300M // PGDM AT IMIS', desc: 'Marketing Strategy & Frontline Leadership', z: -60, color: '#0284c7' },
    { title: 'DEPTH 600M // MCA AT AMITY UNIVERSITY', desc: 'Computer Science, Cloud Architecture & AI Systems', z: -95, color: '#00e5ff' },
  ], []);

  // Seafloor rock outcrops
  const seafloorRocks = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; scale: [number, number, number] }> = [];
    for (let i = 0; i < 24; i++) {
      const x = (i % 2 === 0 ? -1 : 1) * (11 + ((i * 3) % 8));
      const z = -i * 7 - 10;
      list.push({
        pos: [x, -3.4, z],
        scale: [2.5 + (i % 3), 2.0 + (i % 2), 3.0 + (i % 3)],
      });
    }
    return list;
  }, []);

  // Rising bubbles from ocean floor
  const bubbles = useMemo(() => {
    const count = 350;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 93.123) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 27.842) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 61.918) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 22;
      positions[i * 3 + 1] = -3.5 + Math.abs(f2) * 9;
      positions[i * 3 + 2] = -Math.abs(f3) * 160;
    }
    return positions;
  }, []);

  // Bioluminescent deep-sea plankton
  const plankton = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 35;
      positions[i * 3 + 1] = -3 + Math.abs(f2) * 12;
      positions[i * 3 + 2] = -Math.abs(f3) * 160;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!reducedMotion) {
      if (bubblesRef.current) {
        const bPos = bubblesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < bPos.length / 3; i++) {
          bPos[i * 3 + 1] += delta * 3.8; // Rising up towards surface
          bPos[i * 3] += Math.sin(state.clock.elapsedTime * 3 + i) * 0.01; // buoyant wobble
          if (bPos[i * 3 + 1] > 8) {
            bPos[i * 3 + 1] = -3.5;
          }
        }
        bubblesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (planktonRef.current) {
        const pPos = planktonRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pPos.length / 3; i++) {
          pPos[i * 3 + 2] += delta * 15;
          if (pPos[i * 3 + 2] > 10) {
            pPos[i * 3 + 2] = -160;
          }
        }
        planktonRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const seabedMat = new THREE.MeshStandardMaterial({
    map: causticTexture,
    color: '#0284c7',
    roughness: 0.85,
    metalness: 0.1,
  });

  const rockMat = new THREE.MeshStandardMaterial({
    color: '#0f2942',
    roughness: 0.95,
  });

  const zShift = travelProgress * 105;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Deep Ocean Pelagic Water Column Fog & Horizon */}
      <mesh position={[0, 15, -170]}>
        <planeGeometry args={[260, 110]} />
        <meshBasicMaterial color="#021c38" />
      </mesh>

      {/* 2. REALISTIC OCEAN FLOOR SEABED WITH CAUSTIC RIPPLE PROJECTIONS */}
      <mesh position={[0, -3.8, -85]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 190, 32, 32]} />
        <primitive object={seabedMat} attach="material" />
      </mesh>

      {/* 3. SUBMERGED SEAFLOOR ROCK FORMATIONS */}
      {seafloorRocks.map((r, idx) => (
        <mesh
          key={`rock-${idx}`}
          position={r.pos}
          scale={r.scale}
          material={rockMat}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1.2, 1]} />
        </mesh>
      ))}

      {/* 4. SURFACE VOLUMETRIC SUNLIGHT GOD RAYS */}
      <mesh position={[0, 8, -50]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[2, 28, 65, 16, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. SUBMERGED ACADEMIC MONUMENT STELES */}
      {milestones.map((m, idx) => (
        <group key={idx} position={[0, -1.0, m.z]}>
          {/* Main Granite Submarine Monument */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.2, 6.2, 0.8]} />
            <meshStandardMaterial color="#0f2942" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Bioluminescent Border */}
          <mesh position={[0, 0, 0.42]}>
            <boxGeometry args={[4.0, 6.0, 0.05]} />
            <meshBasicMaterial color={m.color} wireframe />
          </mesh>

          {/* Monument Inscription */}
          <group position={[0, 1.5, 0.5]}>
            <Text fontSize={0.38} color={m.color} anchorX="center" anchorY="middle">
              {m.title}
            </Text>
            <Text position={[0, -0.55, 0]} fontSize={0.24} color="#e0f2fe" anchorX="center" anchorY="middle">
              {m.desc}
            </Text>
          </group>

          <pointLight position={[0, 0, 1.8]} color={m.color} intensity={5.5} distance={18} />
        </group>
      ))}

      {/* 6. RISING WATER BUBBLE STREAMS */}
      <points ref={bubblesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bubbles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.28} color="#bae6fd" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
      </points>

      {/* 7. BIOLUMINESCENT MARINE PLANKTON */}
      <points ref={planktonRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[plankton, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.2} color="#7dd3fc" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </points>

      {/* 8. ABYSSAL RESEARCH BASE TERMINUS OBSERVATION DOME */}
      <group position={[0, -0.6, -135]}>
        <mesh>
          <torusGeometry args={[7.5, 0.55, 16, 32]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#38bdf8" intensity={10} distance={45} />
      </group>
    </group>
  );
}

export default OceanDepthEnvironment3D;
