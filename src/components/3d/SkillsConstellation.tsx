import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { skillsData } from '../../data/portfolioData';

export { WebGLErrorBoundary } from '../common/WebGLErrorBoundary';

interface ConstellationSceneProps {
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  reducedMotion: boolean;
}

// 7-8 Target Concentric Domains as defined in prompt
const ORBIT_DOMAINS = [
  { id: 'data-analytics', name: 'DATA ANALYTICS', radius: 1.6, speed: 0.22, color: '#10b981', step: 1 },
  { id: 'generative-ai', name: 'GENERATIVE AI', radius: 2.2, speed: 0.18, color: '#00e5ff', step: 2 },
  { id: 'software-development', name: 'SOFTWARE DEVELOPMENT', radius: 2.8, speed: 0.15, color: '#76ff03', step: 3 },
  { id: 'cloud-computing', name: 'CLOUD COMPUTING', radius: 3.4, speed: 0.12, color: '#f59e0b', step: 4 },
  { id: 'ai-products', name: 'AI PRODUCTS', radius: 4.0, speed: 0.10, color: '#a855f7', step: 5 },
  { id: 'google-cloud', name: 'GOOGLE CLOUD', radius: 4.6, speed: 0.08, color: '#38bdf8', step: 6 },
  { id: 'business-analytics', name: 'BUSINESS ANALYTICS', radius: 5.2, speed: 0.06, color: '#ec4899', step: 7 },
];

function SolarKnowledgeSystem({
  activeCategoryId,
  onSelectCategory,
  reducedMotion,
}: ConstellationSceneProps) {
  const systemRef = useRef<THREE.Group>(null);
  const centralGlobeRef = useRef<THREE.Mesh>(null);

  // Match existing skillsData categories with orbit domains
  const orbitNodes = useMemo(() => {
    return ORBIT_DOMAINS.map((domain, idx) => {
      // Find matching category in data or use domain
      const matchedCategory = skillsData.technicalCategories.find(
        (c) =>
          c.id === domain.id ||
          c.name.toLowerCase().includes(domain.name.toLowerCase().split(' ')[0])
      ) || skillsData.technicalCategories[idx % skillsData.technicalCategories.length];

      const initialAngle = (idx * (Math.PI * 2)) / ORBIT_DOMAINS.length + idx * 0.4;
      return {
        ...domain,
        matchedCategoryId: matchedCategory?.id || domain.id,
        initialAngle,
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      if (systemRef.current) {
        systemRef.current.rotation.y += delta * 0.06;
      }
      if (centralGlobeRef.current) {
        centralGlobeRef.current.rotation.y += delta * 0.15;
      }
    }
  });

  return (
    <group ref={systemRef}>
      {/* ============================================================ */}
      {/* 1. CENTRAL GLOBE: BADAL // 001 */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Glowing Atmosphere Mesh */}
        <mesh ref={centralGlobeRef}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color="#050a14"
            emissive="#76ff03"
            emissiveIntensity={0.65}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        </mesh>

        {/* Inner high-intensity Core */}
        <mesh>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Central Core Light */}
        <pointLight position={[0, 0, 0]} intensity={3.5} color="#76ff03" distance={10} />

        {/* Inner Equator Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.82, 0.86, 64]} />
          <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>

        {/* ============================================================ */}
        {/* 2. NAME BELOW THE GLOBE (BADAL KUMAR SAHU / BADAL // 001) */}
        {/* Always visible, crisp, integrated 3D Html billboard */}
        {/* ============================================================ */}
        <Html
          position={[0, -1.25, 0]}
          center
          distanceFactor={9}
          className="pointer-events-none select-none"
        >
          <div className="flex flex-col items-center justify-center text-center whitespace-nowrap bg-black/80 px-3.5 py-1.5 rounded-lg border border-emerald-400/40 backdrop-blur-md shadow-[0_0_20px_rgba(118,255,3,0.3)]">
            <span className="font-display text-xs sm:text-sm font-black text-white tracking-wider">
              BADAL KUMAR SAHU
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-emerald-400 tracking-[0.2em] font-bold">
              BADAL // 001
            </span>
          </div>
        </Html>
      </group>

      {/* ============================================================ */}
      {/* 3. CONCENTRIC ORBITAL RINGS & PLANETARY NODES */}
      {/* ============================================================ */}
      {orbitNodes.map((orbit) => {
        const isSelected = orbit.matchedCategoryId === activeCategoryId;
        const currentAngle = orbit.initialAngle;
        const x = Math.cos(currentAngle) * orbit.radius;
        const z = Math.sin(currentAngle) * orbit.radius;

        return (
          <group key={orbit.id}>
            {/* Orbital Ring Geometry */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[orbit.radius - 0.015, orbit.radius + 0.015, 96]} />
              <meshBasicMaterial
                color={isSelected ? '#76ff03' : orbit.color}
                side={THREE.DoubleSide}
                transparent
                opacity={isSelected ? 0.75 : 0.22}
              />
            </mesh>

            {/* Planetary Knowledge Node */}
            <group
              position={[x, 0, z]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory(orbit.matchedCategoryId);
              }}
            >
              {/* Outer Atmosphere Sphere */}
              <mesh>
                <sphereGeometry args={[isSelected ? 0.32 : 0.22, 24, 24]} />
                <meshStandardMaterial
                  color={orbit.color}
                  emissive={orbit.color}
                  emissiveIntensity={isSelected ? 1.4 : 0.4}
                  wireframe={!isSelected}
                />
              </mesh>

              {/* Inner Solid Core */}
              <mesh>
                <sphereGeometry args={[isSelected ? 0.16 : 0.11, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>

              {/* Node Label Integrated via Html */}
              <Html
                position={[0, 0.45, 0]}
                center
                distanceFactor={11}
                className="pointer-events-none select-none"
              >
                <div
                  className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono tracking-wider uppercase whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold shadow-[0_0_12px_rgba(118,255,3,0.4)]'
                      : 'bg-black/60 border-white/10 text-slate-300'
                  }`}
                >
                  {orbit.name}
                </div>
              </Html>
            </group>
          </group>
        );
      })}
    </group>
  );
}

interface SkillsConstellationCanvasProps {
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  reducedMotion: boolean;
}

export function SkillsConstellationCanvas({
  activeCategoryId,
  onSelectCategory,
  reducedMotion,
}: SkillsConstellationCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 4.2, 8.5], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={0.9} />
      <Suspense fallback={null}>
        <SolarKnowledgeSystem
          activeCategoryId={activeCategoryId}
          onSelectCategory={onSelectCategory}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
