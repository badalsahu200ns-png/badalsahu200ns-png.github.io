import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface StratosphereEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function StratosphereEnvironment3D({ travelProgress, reducedMotion = false }: StratosphereEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudMistRef = useRef<THREE.Points>(null);

  // 4 Verified Credential Milestones passing in the stratosphere
  const credentials = useMemo(() => [
    { title: 'GOOGLE CLOUD CERTIFIED', desc: 'BigQuery Data & GenAI Pipelines', z: -25, color: '#f59e0b' },
    { title: 'ORACLE CERTIFIED', desc: 'Autonomous Database & Cloud Architectures', z: -60, color: '#ef4444' },
    { title: 'CISCO CERTIFIED', desc: 'Enterprise Networking & Cybersecurity', z: -95, color: '#06b6d4' },
    { title: 'FORAGE SIMULATIONS', desc: 'BCG, PwC & Tata Strategic Engagements', z: -130, color: '#10b981' },
  ], []);

  // Dense puffy cumulus cloud clusters below the balloon
  const cloudClusters = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; scale: [number, number, number] }> = [];
    for (let i = 0; i < 35; i++) {
      const z = -i * 5.2 - 6;
      const x = (i % 2 === 0 ? -1 : 1) * (14 + ((i * 3) % 12));
      const y = -5.5 + ((i * 3) % 3) * 0.8;
      list.push({
        pos: [x, y, z],
        scale: [8 + (i % 4) * 2.5, 3.5 + (i % 2), 10 + (i % 3) * 2],
      });
    }
    return list;
  }, []);

  // Floating stratospheric ice crystal flakes
  const iceFlakes = useMemo(() => {
    const count = 450;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 60;
      positions[i * 3 + 1] = -4 + Math.abs(f2) * 10;
      positions[i * 3 + 2] = -Math.abs(f3) * 170;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion && cloudMistRef.current) {
      const positions = cloudMistRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 18;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -170;
        }
      }
      cloudMistRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const cloudPuffMat = new THREE.MeshStandardMaterial({
    color: '#6366f1',
    roughness: 0.95,
    metalness: 0.05,
    transparent: true,
    opacity: 0.8,
  });

  const zShift = travelProgress * 120;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Golden Sunrise Rayleigh Atmospheric Horizon Backdrop */}
      <mesh position={[0, 20, -180]}>
        <planeGeometry args={[260, 110]} />
        <meshBasicMaterial color="#1e1038" />
      </mesh>

      {/* 2. Rising Golden Dawn Sun Sphere */}
      <mesh position={[35, 18, -120]}>
        <sphereGeometry args={[16, 32, 32]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <pointLight position={[35, 18, -120]} color="#fde047" intensity={8} distance={220} />

      {/* 3. LOWER STRATOSPHERIC CLOUD BLANKET CARPET */}
      <mesh position={[0, -7.5, -85]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 190]} />
        <meshStandardMaterial color="#4338ca" roughness={0.95} />
      </mesh>

      {/* 4. BILLOWING 3D CUMULUS CLOUD CLUSTERS */}
      {cloudClusters.map((c, idx) => (
        <mesh key={`cloud-${idx}`} position={c.pos} scale={c.scale} material={cloudPuffMat}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      ))}

      {/* 5. FLOATING CREDENTIAL SHIELDS IN HIGH-ALTITUDE AIR */}
      {credentials.map((c, idx) => (
        <group key={idx} position={[0, 0.5, c.z]}>
          {/* Hexagonal Credential Frame */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[3.2, 3.2, 0.3, 6]} />
            <meshStandardMaterial color="#1e1b4b" metalness={0.9} roughness={0.2} transparent opacity={0.9} />
          </mesh>

          {/* Glowing Border Ring */}
          <mesh position={[0, 0, 0.18]}>
            <ringGeometry args={[2.8, 3.2, 6]} />
            <meshBasicMaterial color={c.color} opacity={0.95} transparent side={THREE.DoubleSide} />
          </mesh>

          {/* Inscription */}
          <group position={[0, 0.7, 0.25]}>
            <Text fontSize={0.44} color={c.color} anchorX="center" anchorY="middle">
              {c.title}
            </Text>
            <Text position={[0, -0.5, 0]} fontSize={0.26} color="#f8fafc" anchorX="center" anchorY="middle">
              {c.desc}
            </Text>
          </group>

          <pointLight position={[0, 0, 1.8]} color={c.color} intensity={6} distance={20} />
        </group>
      ))}

      {/* 6. FLOATING STRATOSPHERIC ICE CRYSTAL MIST */}
      <points ref={cloudMistRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[iceFlakes, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.5} color="#fef08a" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </points>

      {/* 7. HIGH-ALTITUDE OBSERVATORY PLATFORM TERMINUS */}
      <group position={[0, 1.0, -150]}>
        <mesh>
          <torusGeometry args={[8.0, 0.55, 16, 32]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#fde047" intensity={10} distance={50} />
      </group>
    </group>
  );
}

export default StratosphereEnvironment3D;
