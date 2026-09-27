import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataOrbProps {
  reducedMotion?: boolean;
}

export function DataOrb({ reducedMotion = false }: DataOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const wireframeSphereRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);

  // Floating nodes representing data flow coordinates
  const nodes = useMemo(() => [
    { pos: [2.2, 0.4, 0.2] as [number, number, number], color: '#76ff03' },
    { pos: [-1.5, 1.7, 0.8] as [number, number, number], color: '#00e5ff' },
    { pos: [0.6, -2.1, 1.1] as [number, number, number], color: '#8b5cf6' },
    { pos: [-1.9, -1.2, -1.0] as [number, number, number], color: '#76ff03' },
  ], []);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    // Smooth responsive mouse parallax tilt
    if (groupRef.current) {
      const targetX = (state.pointer.x * 0.4);
      const targetY = (state.pointer.y * 0.4);
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }

    // Controlled rotation of wireframe sphere
    if (wireframeSphereRef.current) {
      wireframeSphereRef.current.rotation.x += delta * 0.15;
      wireframeSphereRef.current.rotation.y += delta * 0.2;
    }

    // Inner emissive core counter-rotation and subtle breathing pulse
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.3;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.06;
      innerCoreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Three distinct orbital rings rotating independently
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.25;
      ring1Ref.current.rotation.y += delta * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.22;
      ring2Ref.current.rotation.z += delta * 0.18;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.16;
      ring3Ref.current.rotation.x -= delta * 0.2;
    }

    // Floating nodes group slow orbit
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y += delta * 0.12;
      nodesGroupRef.current.rotation.z += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Wireframe Outer Sphere */}
      <mesh ref={wireframeSphereRef}>
        <sphereGeometry args={[1.45, 24, 24]} />
        <meshStandardMaterial
          wireframe
          color="#76ff03"
          emissive="#76ff03"
          emissiveIntensity={0.25}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Central Icosahedron Wireframe Accent */}
      <mesh rotation={[0.5, 0.5, 0]}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial
          wireframe
          color="#00e5ff"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* 2. Central Inner Emissive Core */}
      <mesh ref={innerCoreRef}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial
          color="#76ff03"
          emissive="#76ff03"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 3. Three Orbital Rings */}
      {/* Ring 1 - Accent Electric Green */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3.8, 0, 0]}>
        <torusGeometry args={[2.05, 0.015, 12, 64]} />
        <meshBasicMaterial color="#76ff03" transparent opacity={0.65} />
      </mesh>

      {/* Ring 2 - Cyan */}
      <mesh ref={ring2Ref} rotation={[0, Math.PI / 2.8, Math.PI / 5]}>
        <torusGeometry args={[2.4, 0.018, 12, 64]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.55} />
      </mesh>

      {/* Ring 3 - Violet */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 5, Math.PI / 3.5, Math.PI / 1.8]}>
        <torusGeometry args={[2.75, 0.016, 12, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.45} />
      </mesh>

      {/* 4. Floating Data Nodes */}
      <group ref={nodesGroupRef}>
        {nodes.map((node, i) => (
          <group key={i} position={node.pos}>
            <mesh>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={1.4}
              />
            </mesh>
            <line>
              <bufferGeometry
                attach="geometry"
                onUpdate={(self) => {
                  const points = [
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(-node.pos[0] * 0.35, -node.pos[1] * 0.35, -node.pos[2] * 0.35),
                  ];
                  self.setFromPoints(points);
                }}
              />
              <lineBasicMaterial attach="material" color={node.color} transparent opacity={0.3} />
            </line>
          </group>
        ))}
      </group>
    </group>
  );
}
