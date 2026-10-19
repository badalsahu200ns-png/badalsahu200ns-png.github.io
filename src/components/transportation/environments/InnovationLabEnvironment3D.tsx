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
  const radarRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Runway edge navigation lights
  const runwayLights = useMemo(() => {
    const list: number[] = [];
    for (let z = 0; z > -180; z -= 12) {
      list.push(z);
    }
    return list;
  }, []);

  // Aviation hangars flanking the runway
  const hangars = useMemo(() => [
    { x: -16, z: -35, name: 'HANGAR 01 // EDUNET AI FLIGHT LAB', color: '#06b6d4' },
    { x: 16, z: -70, name: 'HANGAR 02 // NEO SKILLZ INNOVATION BAY', color: '#38bdf8' },
    { x: -16, z: -105, name: 'HANGAR 03 // AUTONOMOUS AGENT RESEARCH', color: '#10b981' },
  ], []);

  // Airflow dust particles
  const particles = useMemo(() => {
    const count = 250;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const f2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
      const f3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
      positions[i * 3] = (Math.abs(f1) - 0.5) * 25;
      positions[i * 3 + 1] = 0.5 + Math.abs(f2) * 8;
      positions[i * 3 + 2] = -Math.abs(f3) * 160;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      if (radarRef.current) {
        radarRef.current.rotation.y += delta * 2.2;
      }
      if (dustRef.current) {
        const positions = dustRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3 + 2] += delta * 22;
          if (positions[i * 3 + 2] > 10) {
            positions[i * 3 + 2] = -160;
          }
        }
        dustRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const runwayConcreteMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.85,
    metalness: 0.1,
  });

  const runwayGrassMat = new THREE.MeshStandardMaterial({
    color: '#064e3b',
    roughness: 0.95,
  });

  const stripeWhiteMat = new THREE.MeshBasicMaterial({ color: '#f8fafc' });
  const stripeYellowMat = new THREE.MeshBasicMaterial({ color: '#f59e0b' });
  const hangarMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.8,
    roughness: 0.3,
  });

  const zShift = travelProgress * 110;

  return (
    <group ref={groupRef} position={[0, 0, zShift]}>
      {/* 1. Open Aviation Horizon Sky Backdrop */}
      <mesh position={[0, 25, -170]}>
        <planeGeometry args={[260, 110]} />
        <meshBasicMaterial color="#0c2340" />
      </mesh>

      {/* 2. Airfield Surrounding Grass Field Ground */}
      <mesh position={[0, -2.1, -85]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 190]} />
        <primitive object={runwayGrassMat} attach="material" />
      </mesh>

      {/* 3. CONCRETE AVIATION RUNWAY WITH THRESHOLD MARKINGS */}
      <mesh position={[0, -2.0, -85]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 190]} />
        <primitive object={runwayConcreteMat} attach="material" />
      </mesh>

      {/* Runway White Centerline Dashes */}
      {runwayLights.map((z, idx) => (
        <mesh key={`dash-${idx}`} position={[0, -1.98, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 6]} />
          <primitive object={stripeWhiteMat} attach="material" />
        </mesh>
      ))}

      {/* Runway White Edge Boundary Lines */}
      <mesh position={[-7.5, -1.98, -85]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 190]} />
        <primitive object={stripeWhiteMat} attach="material" />
      </mesh>
      <mesh position={[7.5, -1.98, -85]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 190]} />
        <primitive object={stripeWhiteMat} attach="material" />
      </mesh>

      {/* Runway Threshold Piano Keys (Starting Edge) */}
      {[-5, -3, -1, 1, 3, 5].map((x, idx) => (
        <mesh key={`piano-${idx}`} position={[x, -1.98, -5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.0, 10]} />
          <primitive object={stripeWhiteMat} attach="material" />
        </mesh>
      ))}

      {/* 4. RUNWAY EDGE LIGHTING FIXTURES (Green threshold, White edge, Amber warning) */}
      {runwayLights.map((z, idx) => {
        const isNearStart = z > -25;
        const lightColor = isNearStart ? '#10b981' : z < -130 ? '#ef4444' : '#f8fafc';
        return (
          <group key={`light-${idx}`} position={[0, 0, z]}>
            {/* Left Edge Light */}
            <group position={[-8.3, -2.0, 0]}>
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
                <meshStandardMaterial color="#64748b" />
              </mesh>
              <mesh position={[0, 0.55, 0]}>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshBasicMaterial color={lightColor} />
              </mesh>
              <pointLight position={[0, 0.6, 0]} color={lightColor} intensity={1.5} distance={8} />
            </group>

            {/* Right Edge Light */}
            <group position={[8.3, -2.0, 0]}>
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
                <meshStandardMaterial color="#64748b" />
              </mesh>
              <mesh position={[0, 0.55, 0]}>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshBasicMaterial color={lightColor} />
              </mesh>
              <pointLight position={[0, 0.6, 0]} color={lightColor} intensity={1.5} distance={8} />
            </group>
          </group>
        );
      })}

      {/* 5. AVIATION HANGARS & AIRPORT RESEARCH FACILITIES */}
      {hangars.map((h, idx) => (
        <group key={`hangar-${idx}`} position={[h.x, -2.0, h.z]}>
          {/* Main Hangar Curved Shell */}
          <mesh material={hangarMat} position={[0, 3.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[7, 7, 18, 16, 1, false, 0, Math.PI]} />
          </mesh>
          {/* Front Opening Gate */}
          <mesh position={[0, 1.8, 8.8]}>
            <planeGeometry args={[11, 4.5]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
          </mesh>

          {/* Hangar Title Signage */}
          <group position={[0, 6.2, 9.1]}>
            <Text fontSize={0.55} color={h.color} anchorX="center" anchorY="middle">
              {h.name}
            </Text>
          </group>

          <pointLight position={[0, 5, 10]} color={h.color} intensity={4} distance={18} />
        </group>
      ))}

      {/* 6. AIR TRAFFIC CONTROL TOWER WITH ROTATING RADAR DISH */}
      <group position={[18, -2.0, -45]}>
        {/* Tower Stem */}
        <mesh material={hangarMat} position={[0, 6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 2.5, 12, 16]} />
        </mesh>
        {/* Observation Cab */}
        <mesh position={[0, 12.5, 0]}>
          <cylinderGeometry args={[3.2, 2.4, 2.2, 16]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
        </mesh>
        {/* Rotating Radar Dish */}
        <group ref={radarRef} position={[0, 14.5, 0]}>
          <mesh material={hangarMat}>
            <cylinderGeometry args={[0.2, 0.2, 1.2, 8]} />
          </mesh>
          <mesh material={hangarMat} position={[0, 0.8, 0]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[1.4, 0.1, 0.4, 16]} />
          </mesh>
        </group>
        <pointLight position={[0, 13, 0]} color="#00e5ff" intensity={4} distance={25} />
      </group>

      {/* 7. DRONE RUNWAY DUST PARTICLES */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.2} color="#94a3b8" transparent opacity={0.65} />
      </points>

      {/* 8. DESTINATION AUTONOMOUS DRONE LANDING HELIPAD */}
      <group position={[0, -1.95, -135]}>
        {/* Concrete Helipad Pad */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[7, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Yellow Boundary Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.2, 6.7, 32]} />
          <primitive object={stripeYellowMat} attach="material" />
        </mesh>
        {/* Helipad 'H' Target Letter */}
        <mesh position={[-1.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.0, 5.0]} />
          <primitive object={stripeWhiteMat} attach="material" />
        </mesh>
        <mesh position={[1.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.0, 5.0]} />
          <primitive object={stripeWhiteMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.0, 1.0]} />
          <primitive object={stripeWhiteMat} attach="material" />
        </mesh>

        <pointLight position={[0, 2.5, 0]} color="#06b6d4" intensity={8} distance={40} />
      </group>
    </group>
  );
}

export default InnovationLabEnvironment3D;
