import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CareerWorldMegastructureProps {
  reducedMotion?: boolean;
}

const CAREER_PILLARS = [
  { id: 'data', label: 'DATA ANALYTICS', sub: 'BigQuery · SQL · Cohorts', radius: 14.5, speed: 0.12, angle: 0, color: '#10b981' },
  { id: 'genai', label: 'AI & GENERATIVE AI', sub: 'Gemini · Agents · RAG', radius: 16.5, speed: 0.09, angle: 1.05, color: '#00e5ff' },
  { id: 'software', label: 'SOFTWARE ARCHITECTURE', sub: 'React · Cloud Run · APIs', radius: 18.5, speed: 0.08, angle: 2.1, color: '#76ff03' },
  { id: 'business', label: 'BUSINESS ANALYTICS', sub: 'Frontline Leadership · Revenue', radius: 20.5, speed: 0.07, angle: 3.15, color: '#38bdf8' },
  { id: 'experience', label: '5+ YRS EXPERIENCE', sub: 'Magicbricks · redBus · Reliance', radius: 22.5, speed: 0.06, angle: 4.2, color: '#a855f7' },
  { id: 'certifications', label: 'EDUCATION & CLOUD', sub: 'Amity MCA · Google Cloud · Oracle', radius: 24.5, speed: 0.05, angle: 5.25, color: '#10b981' },
];

export function CareerWorldMegastructure({ reducedMotion = false }: CareerWorldMegastructureProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const satellitesGroupRef = useRef<THREE.Group>(null);

  // Pillar positions calculation
  const pillarNodes = useMemo(() => {
    return CAREER_PILLARS.map((p) => ({ ...p }));
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    // Slow rotation of citadel core
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.06;
      coreRef.current.rotation.x += delta * 0.02;
    }

    // Heavy mechanical interlocking rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.08;
      ring1Ref.current.rotation.y += delta * 0.05;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.11;
      ring2Ref.current.rotation.z += delta * 0.06;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= delta * 0.05;
      ring3Ref.current.rotation.z -= delta * 0.09;
    }

    // Satellites orbiting the megastructure
    if (satellitesGroupRef.current) {
      satellitesGroupRef.current.rotation.y += delta * 0.08;
    }
  });

  // Materials: Forged dark gunmetal & emerald technological illumination
  const citadelArmorMaterial = new THREE.MeshStandardMaterial({
    color: '#0d1117',
    metalness: 0.94,
    roughness: 0.28,
  });

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: '#10b981',
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });

  const ringArmorMaterial = new THREE.MeshStandardMaterial({
    color: '#161b26',
    metalness: 0.92,
    roughness: 0.2,
  });

  const energyRingMaterial = new THREE.MeshBasicMaterial({
    color: '#10b981',
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });

  return (
    <group position={[0, 0, -140]}>

      {/* 1. Distant Atmosphere & Emerald Technological Energy Aura */}
      <pointLight color="#10b981" intensity={5.5} distance={70} />
      <pointLight color="#00e5ff" intensity={3.0} distance={55} position={[0, 10, 10]} />

      {/* 2. Core Technological Citadel — Segmented Armored Megastructure */}
      <mesh ref={coreRef} material={citadelArmorMaterial}>
        <icosahedronGeometry args={[7.2, 2]} />
      </mesh>

      {/* Outer technological grid overlay */}
      <mesh material={wireframeMaterial} scale={[1.02, 1.02, 1.02]}>
        <icosahedronGeometry args={[7.2, 2]} />
      </mesh>

      {/* Core Energy Pulse Sphere */}
      <mesh>
        <sphereGeometry args={[4.5, 24, 24]} />
        <meshBasicMaterial color="#064e3b" transparent opacity={0.3} />
      </mesh>

      {/* 4. Heavy Mechanical Interlocking Command Rings */}
      {/* Ring 1: Primary Gunmetal Command Ring */}
      <mesh ref={ring1Ref} material={ringArmorMaterial} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[10.5, 0.45, 16, 64]} />
      </mesh>

      {/* Ring 2: Emerald Energy Conduit Halo */}
      <mesh ref={ring2Ref} material={energyRingMaterial} rotation={[-0.3, 0.6, 0]}>
        <torusGeometry args={[13.2, 0.18, 16, 64]} />
      </mesh>

      {/* Ring 3: Outer Segmented Defense Array */}
      <mesh ref={ring3Ref} material={ringArmorMaterial} rotation={[0.8, -0.4, 0]}>
        <torusGeometry args={[15.8, 0.28, 12, 48]} />
      </mesh>

      {/* 5. Six Orbiting Career Pillar Satellites */}
      <group ref={satellitesGroupRef}>
        {pillarNodes.map((node, i) => {
          const x = Math.cos(node.angle) * node.radius;
          const z = Math.sin(node.angle) * node.radius;
          const y = (i % 2 === 0 ? 1 : -1) * (1.2 + (i % 3) * 1.5);

          return (
            <group key={node.id} position={[x, y, z]}>
              {/* Satellite Chiseled Beacon Body */}
              <mesh material={citadelArmorMaterial}>
                <octahedronGeometry args={[0.7, 0]} />
              </mesh>

              {/* Glowing Emerald/Cyan Energy Core */}
              <mesh>
                <sphereGeometry args={[0.3, 12, 12]} />
                <meshBasicMaterial color={node.color} />
              </mesh>

              <pointLight color={node.color} intensity={1.5} distance={8} />

              {/* Floating Monospace Telemetry Label */}
              <group position={[0, 1.2, 0]}>
                <Text
                  fontSize={0.38}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="bottom"
                >
                  {`[${node.label}]`}
                </Text>
                <Text
                  position={[0, -0.32, 0]}
                  fontSize={0.24}
                  color="#10b981"
                  anchorX="center"
                  anchorY="top"
                >
                  {node.sub}
                </Text>
              </group>

              {/* Thin Energy Conduit Beacon Beam */}
              <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
                <meshBasicMaterial color={node.color} transparent opacity={0.4} />
              </mesh>
            </group>
          );
        })}
      </group>

    </group>
  );
}

export default CareerWorldMegastructure;
