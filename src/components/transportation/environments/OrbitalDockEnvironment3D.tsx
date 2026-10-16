import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface DockEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function OrbitalDockEnvironment3D({ travelProgress, reducedMotion = false }: DockEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dockRingRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Points>(null);

  // Approach runway beacons
  const beacons = useMemo(() => {
    const list: number[] = [];
    for (let z = -15; z > -110; z -= 14) {
      list.push(z);
    }
    return list;
  }, []);

  // Starfield
  const stars = useMemo(() => {
    const count = 750;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 80;
      positions[i * 3 + 1] = (Math.abs(f2) - 0.5) * 50;
      positions[i * 3 + 2] = -Math.abs(f3) * 160;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      if (dockRingRef.current) {
        dockRingRef.current.rotation.z += delta * 0.35;
      }
      if (starsRef.current) {
        const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3 + 2] += delta * 25;
          if (positions[i * 3 + 2] > 10) {
            positions[i * 3 + 2] = -160;
          }
        }
        starsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const stationMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.95,
    roughness: 0.15,
  });

  const solarPanelMat = new THREE.MeshStandardMaterial({
    color: '#0369a1',
    emissive: '#0284c7',
    emissiveIntensity: 0.3,
    metalness: 0.9,
    roughness: 0.1,
  });

  const cyanRingMat = new THREE.MeshBasicMaterial({
    color: '#00e5ff',
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  const zShift = travelProgress * 110;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Luminous Deep Space Horizon Backdrop with Distant Gas Giant */}
      <mesh position={[0, 0, -160]}>
        <planeGeometry args={[220, 100]} />
        <meshBasicMaterial color="#0c203b" transparent opacity={0.75} />
      </mesh>
      {/* Distant Planet */}
      <mesh position={[28, 14, -130]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.3} roughness={0.6} />
      </mesh>

      {/* 2. Starfield Particles */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[stars, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          color="#ffffff"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3. Docking Runway Approach Beacons */}
      {beacons.map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          <mesh position={[-4.5, -1.2, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
          <mesh position={[4.5, -1.2, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
          <pointLight position={[0, -1.2, 0]} color="#00e5ff" intensity={2.5} distance={12} />
        </group>
      ))}

      {/* 4. Massive Orbital Space Station Docking Ring at destination */}
      <group position={[0, 0.8, -125]}>
        {/* Rotating Outer Station Habit Ring */}
        <group ref={dockRingRef}>
          <mesh material={stationMat}>
            <torusGeometry args={[9.5, 0.7, 16, 48]} />
          </mesh>
          {/* Neon Ring Stripe */}
          <mesh material={cyanRingMat}>
            <torusGeometry args={[9.3, 0.12, 16, 48]} />
          </mesh>
          {/* Solar Panel Wings on Station Ring */}
          {[-1, 1].map((dir, sIdx) => (
            <mesh key={sIdx} position={[dir * 12, 0, 0]} material={solarPanelMat}>
              <boxGeometry args={[4.5, 0.1, 2.5]} />
            </mesh>
          ))}
        </group>

        {/* Inner Docking Portal Collar */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[4.8, 0.45, 16, 32]} />
          <meshStandardMaterial color="#0369a1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0]} material={cyanRingMat}>
          <torusGeometry args={[4.5, 0.1, 16, 32]} />
        </mesh>

        {/* Station Command Tower */}
        <mesh position={[0, 11.2, 0]} material={stationMat}>
          <boxGeometry args={[1.8, 4.0, 1.8]} />
        </mesh>

        {/* Destination Signage */}
        <group position={[0, 6.2, 0]}>
          <Text
            fontSize={0.52}
            color="#00e5ff"
            anchorX="center"
            anchorY="middle"
          >
            ORBITAL COLLABORATION PORTAL
          </Text>
          <Text
            position={[0, -0.55, 0]}
            fontSize={0.28}
            color="#f1f5f9"
            anchorX="center"
            anchorY="middle"
          >
            Direct Inquiry Transmission &amp; Partnership Docking
          </Text>
        </group>

        <pointLight position={[0, 0, 2.5]} color="#00e5ff" intensity={10} distance={55} />
      </group>
    </group>
  );
}

export default OrbitalDockEnvironment3D;
