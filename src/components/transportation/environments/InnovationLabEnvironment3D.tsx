import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface LabEnvProps {
  travelProgress: number;
  reducedMotion?: boolean;
}

export function InnovationLabEnvironment3D({ travelProgress, reducedMotion = false }: LabEnvProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scannerRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate lab testing stations along the flight path
  const stations = useMemo(() => [
    { title: 'EDUNET // VOIS FOR TECH LAB', role: 'AI & Cloud Infrastructure Capstone', z: -25, color: '#06b6d4' },
    { title: 'NEO SKILLZ // INNOVATION FACILITY', role: 'Enterprise Systems & Machine Learning', z: -55, color: '#38bdf8' },
    { title: 'ADVANCED PROTOTYPING BAY', role: 'Autonomous Multi-Agent Architecture', z: -85, color: '#10b981' },
  ], []);

  // Floating data packet sparks
  const labParticles = useMemo(() => {
    const count = 350;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = -1.5 + Math.random() * 7;
      positions[i * 3 + 2] = -Math.random() * 140;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      if (scannerRef.current) {
        scannerRef.current.rotation.y += delta * 1.8;
      }
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3 + 2] += delta * 24;
          if (positions[i * 3 + 2] > 10) {
            positions[i * 3 + 2] = -140;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.8,
    roughness: 0.25,
  });

  const ceilingLightMat = new THREE.MeshBasicMaterial({
    color: '#f8fafc',
  });

  const cyanLightMat = new THREE.MeshBasicMaterial({
    color: '#06b6d4',
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    metalness: 0.9,
    roughness: 0.15,
  });

  const holoMat = new THREE.MeshBasicMaterial({
    color: '#06b6d4',
    transparent: true,
    opacity: 0.6,
    wireframe: true,
  });

  const zShift = travelProgress * 95;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Bright High-Tech Laboratory Ceiling Lighting Strip Array */}
      <mesh position={[0, 5.2, -70]}>
        <boxGeometry args={[18, 0.2, 170]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Recessed bright LED panels along ceiling */}
      {[-4, 0, 4].map((x, idx) => (
        <mesh key={idx} material={ceilingLightMat} position={[x, 5.08, -70]}>
          <boxGeometry args={[0.8, 0.05, 170]} />
        </mesh>
      ))}

      {/* 2. Sleek Reflective High-Tech Laboratory Floor with Safety Lines */}
      <mesh position={[0, -2.4, -70]} material={floorMat} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 170]} />
      </mesh>
      {/* Floor Guidance Laser Strips */}
      <mesh position={[-3, -2.38, -70]}>
        <boxGeometry args={[0.1, 0.02, 170]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh position={[3, -2.38, -70]}>
        <boxGeometry args={[0.1, 0.02, 170]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <gridHelper args={[20, 20, '#06b6d4', '#334155']} position={[0, -2.37, -70]} />

      {/* 3. Flanking Lab Walls & Observation Galleries */}
      <mesh material={wallMat} position={[-8, 1.4, -70]}>
        <boxGeometry args={[1.2, 8, 170]} />
      </mesh>
      <mesh material={wallMat} position={[8, 1.4, -70]}>
        <boxGeometry args={[1.2, 8, 170]} />
      </mesh>

      {/* 4. Rotating Diagnostic Scanner Pod in mid-flight */}
      <group ref={scannerRef} position={[0, 2.5, -45]}>
        <mesh material={cyanLightMat}>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
        </mesh>
        <mesh position={[0, 0, 0]} material={holoMat}>
          <octahedronGeometry args={[1.5, 0]} />
        </mesh>
      </group>

      {/* 5. Lab Testing Station Portals */}
      {stations.map((st, idx) => (
        <group key={idx} position={[0, 0, st.z]}>
          {/* Flanking Server Racks */}
          <mesh material={wallMat} position={[-5.8, 1, 0]}>
            <boxGeometry args={[1.6, 6.5, 2.2]} />
          </mesh>
          <mesh material={wallMat} position={[5.8, 1, 0]}>
            <boxGeometry args={[1.6, 6.5, 2.2]} />
          </mesh>

          {/* Server Rack Glowing Status LEDs */}
          <mesh position={[-4.9, 1, 0]}>
            <boxGeometry args={[0.05, 5.5, 1.8]} />
            <meshBasicMaterial color={st.color} />
          </mesh>
          <mesh position={[4.9, 1, 0]}>
            <boxGeometry args={[0.05, 5.5, 1.8]} />
            <meshBasicMaterial color={st.color} />
          </mesh>

          {/* Overhead Gantry Beam */}
          <mesh material={wallMat} position={[0, 4.4, 0]}>
            <boxGeometry args={[12, 0.5, 0.8]} />
          </mesh>

          {/* Floating Station Hologram Text */}
          <group position={[0, 3.4, 0]}>
            <Text
              fontSize={0.38}
              color={st.color}
              anchorX="center"
              anchorY="middle"
            >
              {st.title}
            </Text>
            <Text
              position={[0, -0.4, 0]}
              fontSize={0.22}
              color="#cbd5e1"
              anchorX="center"
              anchorY="middle"
            >
              {st.role}
            </Text>
          </group>

          <pointLight position={[0, 2.5, 0]} color={st.color} intensity={5} distance={16} />
        </group>
      ))}

      {/* 6. High-Tech Floating Micro-Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[labParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          color="#38bdf8"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 7. Destination Innovation Hub Core */}
      <group position={[0, 1.0, -115]}>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[5, 0]} />
          <meshStandardMaterial color="#0284c7" emissive="#06b6d4" emissiveIntensity={0.8} wireframe />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#06b6d4" intensity={10} distance={45} />
      </group>
    </group>
  );
}

export default InnovationLabEnvironment3D;
