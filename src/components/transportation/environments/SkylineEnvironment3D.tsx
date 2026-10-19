import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAsphaltRoadTexture } from '../textures/pbrTextures';

interface SkylineEnvProps {
  travelProgress: number; // 0 to 1
  reducedMotion?: boolean;
}

export function SkylineEnvironment3D({ travelProgress, reducedMotion = false }: SkylineEnvProps) {
  const cityGroupRef = useRef<THREE.Group>(null);
  const trafficRef = useRef<THREE.Points>(null);

  const roadTexture = useMemo(() => getAsphaltRoadTexture(), []);

  // Detailed skyscrapers with realistic varied heights and architectural crowns
  const buildings = useMemo(() => {
    const list: Array<{
      pos: [number, number, number];
      size: [number, number, number];
      color: string;
      spireHeight: number;
    }> = [];

    for (let i = 0; i < 40; i++) {
      const z = -i * 5.5 - 6;
      const height1 = 14 + ((i * 7) % 24);
      const height2 = 16 + ((i * 11) % 22);
      const width1 = 4.0 + ((i * 3) % 2);
      const width2 = 4.0 + ((i * 5) % 2);

      const sideX1 = -(14 + ((i * 2) % 4));
      const sideX2 = 14 + ((i * 2) % 4);

      list.push({
        pos: [sideX1, height1 / 2 - 2, z],
        size: [width1, height1, 5.0],
        color: i % 2 === 0 ? '#111827' : '#0f172a',
        spireHeight: (i * 3) % 5 === 0 ? 3.5 : 1.2,
      });

      list.push({
        pos: [sideX2, height2 / 2 - 2, z],
        size: [width2, height2, 5.0],
        color: i % 2 === 0 ? '#131e34' : '#0e1626',
        spireHeight: (i * 5) % 4 === 0 ? 4.0 : 1.5,
      });
    }

    return list;
  }, []);

  // Highway street lamp posts along the road margins
  const streetLamps = useMemo(() => {
    const list: number[] = [];
    for (let z = -5; z > -180; z -= 18) {
      list.push(z);
    }
    return list;
  }, []);

  // Distant aerial vehicle light streaks
  const trafficParticles = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 45;
      positions[i * 3 + 1] = 4 + Math.abs(f2) * 12;
      positions[i * 3 + 2] = -Math.abs(f3) * 180;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion && trafficRef.current) {
      const positions = trafficRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 25;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -180;
        }
      }
      trafficRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const buildingMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    metalness: 0.85,
    roughness: 0.25,
  });

  const windowGlowMat = new THREE.MeshBasicMaterial({
    color: '#38bdf8',
    transparent: true,
    opacity: 0.45,
  });

  const guardrailMat = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    metalness: 0.95,
    roughness: 0.15,
  });

  const curbMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.8,
  });

  const zShift = travelProgress * 110;

  return (
    <group ref={cityGroupRef} position={[0, 0, zShift]}>
      {/* 1. Distant Dusk Metropolis Sky Backdrop */}
      <mesh position={[0, 20, -170]}>
        <planeGeometry args={[260, 110]} />
        <meshBasicMaterial color="#081426" />
      </mesh>

      {/* 2. REALISTIC ASPHALT EXPRESSWAY ROAD WITH MARKINGS */}
      <mesh position={[0, -2.0, -85]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 190]} />
        <meshStandardMaterial
          map={roadTexture}
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>

      {/* 3. CONCRETE CURBS & CRASH BARRIER GUARDRAILS */}
      {/* Left Curb & Guardrail */}
      <group position={[-10.2, -1.9, -85]}>
        <mesh material={curbMat} position={[0, 0.08, 0]}>
          <boxGeometry args={[0.5, 0.16, 190]} />
        </mesh>
        <mesh material={guardrailMat} position={[0, 0.45, 0]}>
          <boxGeometry args={[0.08, 0.25, 190]} />
        </mesh>
      </group>
      {/* Right Curb & Guardrail */}
      <group position={[10.2, -1.9, -85]}>
        <mesh material={curbMat} position={[0, 0.08, 0]}>
          <boxGeometry args={[0.5, 0.16, 190]} />
        </mesh>
        <mesh material={guardrailMat} position={[0, 0.45, 0]}>
          <boxGeometry args={[0.08, 0.25, 190]} />
        </mesh>
      </group>

      {/* 4. OVERHEAD HIGHWAY DIRECTIONAL GANTRY ARMS & STREET LAMPS */}
      {streetLamps.map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          {/* Left Street Lamp Post */}
          <group position={[-11, -1.9, 0]}>
            <mesh material={guardrailMat} position={[0, 3.2, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 6.4, 12]} />
            </mesh>
            <mesh material={guardrailMat} position={[1.2, 6.3, 0]} rotation={[0, 0, -Math.PI / 3]}>
              <cylinderGeometry args={[0.06, 0.06, 2.5, 12]} />
            </mesh>
            {/* Lamp Luminaire Head */}
            <mesh position={[2.2, 6.9, 0]}>
              <boxGeometry args={[0.8, 0.15, 0.4]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <pointLight position={[2.2, 6.7, 0]} color="#fef08a" intensity={2.5} distance={16} />
          </group>

          {/* Right Street Lamp Post */}
          <group position={[11, -1.9, 0]}>
            <mesh material={guardrailMat} position={[0, 3.2, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 6.4, 12]} />
            </mesh>
            <mesh material={guardrailMat} position={[-1.2, 6.3, 0]} rotation={[0, 0, Math.PI / 3]}>
              <cylinderGeometry args={[0.06, 0.06, 2.5, 12]} />
            </mesh>
            <mesh position={[-2.2, 6.9, 0]}>
              <boxGeometry args={[0.8, 0.15, 0.4]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <pointLight position={[-2.2, 6.7, 0]} color="#fef08a" intensity={2.5} distance={16} />
          </group>
        </group>
      ))}

      {/* 5. ARCHITECTURAL METROPOLITAN TOWERS WITH WINDOW MATRICES */}
      {buildings.map((b, idx) => (
        <group key={idx} position={b.pos}>
          {/* Main Tower Body */}
          <mesh material={buildingMat} castShadow receiveShadow>
            <boxGeometry args={b.size} />
          </mesh>
          {/* Architectural Window Facade Bands */}
          <mesh position={[0, 0, b.size[2] / 2 + 0.02]} material={windowGlowMat}>
            <planeGeometry args={[b.size[0] * 0.85, b.size[1] * 0.85]} />
          </mesh>
          {/* Rooftop Antenna Spire */}
          <mesh position={[0, b.size[1] / 2 + b.spireHeight / 2, 0]}>
            <cylinderGeometry args={[0.04, 0.1, b.spireHeight, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      ))}

      {/* 6. AERIAL SKYWAY TRAFFIC PARTICLES */}
      <points ref={trafficRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trafficParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color="#38bdf8"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 7. DESTINATION: COMMAND SKYPORT PLATFORM AT HIGHWAY TERMINUS */}
      <group position={[0, 1.8, -135]}>
        <mesh position={[0, -0.4, 0]} receiveShadow>
          <cylinderGeometry args={[10, 11, 1.2, 32]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        <pointLight position={[0, 3, 0]} color="#00e5ff" intensity={8} distance={60} />
      </group>
    </group>
  );
}

export default SkylineEnvironment3D;
