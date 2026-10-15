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
  const cloudParticlesRef = useRef<THREE.Points>(null);

  // 4 Verified Credential Milestones passing in the stratosphere
  const credentials = useMemo(() => [
    { title: 'GOOGLE CLOUD CERTIFIED', desc: 'BigQuery Data & GenAI Pipelines', z: -25, color: '#f59e0b' },
    { title: 'ORACLE CERTIFIED', desc: 'Autonomous Database & Cloud Architectures', z: -55, color: '#ef4444' },
    { title: 'CISCO CERTIFIED', desc: 'Enterprise Networking & Cybersecurity', z: -85, color: '#06b6d4' },
    { title: 'FORAGE SIMULATIONS', desc: 'BCG, PwC & Tata Strategic Engagements', z: -115, color: '#10b981' },
  ], []);

  // Multi-altitude cloud puffs
  const cloudPuffs = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; scale: [number, number, number] }> = [];
    for (let i = 0; i < 24; i++) {
      const z = -i * 6 - 10;
      const x = (i % 2 === 0 ? -1 : 1) * (12 + (i % 5) * 3);
      const y = -4 + (i % 3) * 1.5;
      list.push({
        pos: [x, y, z],
        scale: [6 + (i % 3) * 2, 2.5, 8],
      });
    }
    return list;
  }, []);

  // Stratospheric cloud mist flakes
  const cloudParticles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 55;
      positions[i * 3 + 1] = -5 + Math.random() * 8; // Cloud floor below
      positions[i * 3 + 2] = -Math.random() * 150;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion && cloudParticlesRef.current) {
      const positions = cloudParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += delta * 20;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -150;
        }
      }
      cloudParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const cloudMat = new THREE.MeshStandardMaterial({
    color: '#4338ca',
    roughness: 0.95,
    metalness: 0.1,
    transparent: true,
    opacity: 0.75,
  });

  const zShift = travelProgress * 120;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Golden Sunrise Atmospheric Horizon Backdrop */}
      <mesh position={[0, 15, -180]}>
        <planeGeometry args={[260, 100]} />
        <meshBasicMaterial color="#312255" />
      </mesh>

      {/* 2. Warm Sunrise Sun Orb */}
      <mesh position={[30, 16, -110]}>
        <sphereGeometry args={[14, 28, 28]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <pointLight position={[30, 16, -110]} color="#fde047" intensity={7} distance={200} />

      {/* 3. Lower Cloud Deck Carpet */}
      <mesh position={[0, -6.5, -75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 180]} />
        <meshStandardMaterial color="#3730a3" roughness={0.9} />
      </mesh>

      {/* 4. Layered 3D Puffy Cloud Masses */}
      {cloudPuffs.map((c, idx) => (
        <mesh key={idx} position={c.pos} scale={c.scale} material={cloudMat}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      ))}

      {/* 5. Floating Translucent Credential Badges */}
      {credentials.map((c, idx) => (
        <group key={idx} position={[0, 0.5, c.z]}>
          {/* Hexagonal Credential Frame */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2.8, 2.8, 0.25, 6]} />
            <meshStandardMaterial
              color="#1e1b4b"
              metalness={0.9}
              roughness={0.2}
              transparent
              opacity={0.88}
            />
          </mesh>

          {/* Glowing Border Ring */}
          <mesh position={[0, 0, 0.15]}>
            <ringGeometry args={[2.5, 2.8, 6]} />
            <meshBasicMaterial color={c.color} opacity={0.9} transparent side={THREE.DoubleSide} />
          </mesh>

          {/* Credential Inscription */}
          <group position={[0, 0.6, 0.22]}>
            <Text
              fontSize={0.4}
              color={c.color}
              anchorX="center"
              anchorY="middle"
            >
              {c.title}
            </Text>
            <Text
              position={[0, -0.45, 0]}
              fontSize={0.24}
              color="#f8fafc"
              anchorX="center"
              anchorY="middle"
            >
              {c.desc}
            </Text>
          </group>

          <pointLight position={[0, 0, 1.4]} color={c.color} intensity={5.5} distance={18} />
        </group>
      ))}

      {/* 6. Stratospheric Cloud Mist Flakes */}
      <points ref={cloudParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[cloudParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.65}
          color="#fde68a"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 7. Destination Stratospheric Observatory */}
      <group position={[0, 1.0, -140]}>
        <mesh>
          <torusGeometry args={[7, 0.5, 16, 32]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#fde047" intensity={9} distance={45} />
      </group>
    </group>
  );
}

export default StratosphereEnvironment3D;
