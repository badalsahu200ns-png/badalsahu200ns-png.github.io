import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { getAsphaltRoadTexture } from '../textures/pbrTextures';

interface TerrainEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function DigitalTerrainEnvironment3D({ travelProgress, reducedMotion = false }: TerrainEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);

  const asphaltMap = useMemo(() => getAsphaltRoadTexture(), []);

  // 4 Capability Zones crossed along the canyon highway pass
  const capabilityZones = useMemo(() => [
    { name: 'ZONE 01 // BUSINESS ANALYTICS', desc: 'Frontline Leadership & Commercial Acumen', z: -25, color: '#10b981' },
    { name: 'ZONE 02 // GENERATIVE AI', desc: 'Autonomous Multi-Agent Orchestration & LLMs', z: -55, color: '#00e5ff' },
    { name: 'ZONE 03 // SOFTWARE ENGINEERING', desc: 'Full-Stack Distributed Systems & APIs', z: -85, color: '#3b82f6' },
    { name: 'ZONE 04 // DATA ARCHITECTURE', desc: 'GCP BigQuery & Enterprise Pipelines', z: -115, color: '#8b5cf6' },
  ], []);

  // Canyon rocky cliff faces flanking the mountain pass
  const cliffFaces = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; size: [number, number, number]; rotY: number }> = [];
    for (let i = 0; i < 36; i++) {
      const z = -i * 5 - 8;
      const hL = 12 + ((i * 7) % 18);
      const hR = 14 + ((i * 9) % 18);
      const xOffsetL = -11 - ((i * 3) % 4);
      const xOffsetR = 11 + ((i * 4) % 4);
      list.push({ pos: [xOffsetL, hL / 2 - 1, z], size: [9, hL, 7], rotY: (i * 0.15) % 0.4 });
      list.push({ pos: [xOffsetR, hR / 2 - 1, z], size: [9, hR, 7], rotY: -(i * 0.15) % 0.4 });
    }
    return list;
  }, []);

  // Guardrail posts along mountain highway edge
  const guardrails = useMemo(() => {
    const posts: number[] = [];
    for (let z = 0; z > -180; z -= 4.5) {
      posts.push(z);
    }
    return posts;
  }, []);

  // Roadway chevron curve warning signs
  const chevronSigns = useMemo(() => [-20, -42, -65, -88, -110, -135], []);

  // Road dust and thermal heat particles kicking up
  const dustParticles = useMemo(() => {
    const count = 350;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 14;
      positions[i * 3 + 1] = Math.abs(f2) * 2.2 + 0.1;
      positions[i * 3 + 2] = -Math.abs(f3) * 150;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion && dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 42;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -150;
        }
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const rockMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a2421',
    roughness: 0.95,
    metalness: 0.05,
    bumpScale: 0.08,
  }), []);

  const guardrailMetal = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    metalness: 0.85,
    roughness: 0.25,
  }), []);

  const zShift = travelProgress * 120;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Dusk Mountain Sky Horizon Backdrop */}
      <mesh position={[0, 25, -170]}>
        <planeGeometry args={[260, 100]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.85} />
      </mesh>

      {/* Distant Mountain Peak Silhouette */}
      {[-45, -15, 20, 50].map((x, idx) => (
        <mesh key={idx} position={[x, 18, -165]}>
          <coneGeometry args={[22 + idx * 3, 26, 4]} />
          <meshBasicMaterial color="#080e1a" />
        </mesh>
      ))}

      {/* 2. Mountain Highway Asphalt Road Surface */}
      <mesh position={[0, -0.05, -75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 190]} />
        <meshStandardMaterial
          map={asphaltMap}
          roughness={0.88}
          metalness={0.12}
        />
      </mesh>

      {/* Road Shoulder / Gravel Runoff */}
      {[-8.5, 8.5].map((x, idx) => (
        <mesh key={idx} position={[x, -0.06, -75]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 190]} />
          <meshStandardMaterial color="#332d29" roughness={0.95} metalness={0.05} />
        </mesh>
      ))}

      {/* Center Double Yellow Line */}
      {[-0.15, 0.15].map((x, idx) => (
        <mesh key={idx} position={[x, 0.01, -75]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 190]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>
      ))}

      {/* Outer White Edge Fog Lines */}
      {[-6.2, 6.2].map((x, idx) => (
        <mesh key={idx} position={[x, 0.01, -75]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.22, 190]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      ))}

      {/* Continuous Armco Steel Crash Guardrail Beams */}
      {[-6.8, 6.8].map((x, idx) => (
        <group key={idx}>
          {/* Horizontal Corrugated W-Beam Guardrail */}
          <mesh position={[x, 0.65, -75]} material={guardrailMetal}>
            <boxGeometry args={[0.12, 0.45, 190]} />
          </mesh>
          <mesh position={[x, 0.25, -75]} material={guardrailMetal}>
            <boxGeometry args={[0.08, 0.15, 190]} />
          </mesh>
        </group>
      ))}

      {/* Guardrail Support Posts */}
      {guardrails.map((z, idx) => (
        <group key={idx}>
          <mesh position={[-6.8, 0.35, z]} material={guardrailMetal}>
            <boxGeometry args={[0.15, 0.85, 0.15]} />
          </mesh>
          <mesh position={[6.8, 0.35, z]} material={guardrailMetal}>
            <boxGeometry args={[0.15, 0.85, 0.15]} />
          </mesh>
        </group>
      ))}

      {/* Roadside Amber & Red Cat's Eye Reflectors */}
      {guardrails.filter((_, i) => i % 2 === 0).map((z, idx) => (
        <group key={idx}>
          <mesh position={[-6.72, 0.65, z]}>
            <boxGeometry args={[0.04, 0.1, 0.08]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[6.72, 0.65, z]}>
            <boxGeometry args={[0.04, 0.1, 0.08]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      ))}

      {/* Yellow/Black Chevron Sharp Curve Warning Signs */}
      {chevronSigns.map((z, idx) => (
        <group key={idx} position={[7.3, 1.2, z]}>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.4]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.05, 0.9, 0.9]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.3} />
          </mesh>
          <pointLight color="#f59e0b" intensity={1.5} distance={6} />
        </group>
      ))}

      {/* 3. Canyon Flanking Rocky Cliff Formations */}
      {cliffFaces.map((cliff, idx) => (
        <group key={idx} position={cliff.pos} rotation={[0, cliff.rotY, 0]}>
          <mesh material={rockMaterial}>
            <boxGeometry args={cliff.size} />
          </mesh>
          {/* Stratified rock layer accents */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[cliff.size[0] * 1.02, 0.4, cliff.size[2] * 1.02]} />
            <meshStandardMaterial color="#1a1512" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 4. Capability Zone Overhead Highway Gantries */}
      {capabilityZones.map((zone, idx) => (
        <group key={idx} position={[0, 0, zone.z]}>
          {/* Heavy Steel Truss Portal Frame */}
          <mesh position={[-7.5, 3.5, 0]}>
            <boxGeometry args={[0.6, 7.2, 0.6]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[7.5, 3.5, 0]}>
            <boxGeometry args={[0.6, 7.2, 0.6]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 6.9, 0]}>
            <boxGeometry args={[15.6, 0.5, 0.6]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Overhead Variable Highway Signboard */}
          <mesh position={[0, 5.5, 0]}>
            <boxGeometry args={[11.5, 1.8, 0.3]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 5.5, 0.17]}>
            <boxGeometry args={[11.1, 1.4, 0.05]} />
            <meshBasicMaterial color="#020617" />
          </mesh>

          {/* Gantry Display Telemetry */}
          <group position={[0, 5.8, 0.22]}>
            <Text
              fontSize={0.42}
              color={zone.color}
              anchorX="center"
              anchorY="middle"
            >
              {zone.name}
            </Text>
            <Text
              position={[0, -0.45, 0]}
              fontSize={0.24}
              color="#e2e8f0"
              anchorX="center"
              anchorY="middle"
            >
              {zone.desc}
            </Text>
          </group>

          <pointLight position={[0, 4.0, 0]} color={zone.color} intensity={4.5} distance={16} />
        </group>
      ))}

      {/* 5. Dust & Heat Shimmer Particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#d97706"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 6. Canyon Terminus Highway Tunnel Portal */}
      <group position={[0, 3.5, -145]}>
        {/* Massive Concrete Tunnel Entrance Arch */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[20, 10, 4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.5, 2.1]}>
          <planeGeometry args={[14, 7]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
        <pointLight position={[0, 2, 3]} color="#10b981" intensity={7} distance={30} />
      </group>
    </group>
  );
}

export default DigitalTerrainEnvironment3D;
