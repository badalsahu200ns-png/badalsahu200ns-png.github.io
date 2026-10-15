import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { DestinationConfig } from './TransportationConfig';

// 9 Distinct Vehicles (NO shared rocket)
import { ExecutiveHovercraft3D } from './vehicles/ExecutiveHovercraft3D';
import { ScoutDrone3D } from './vehicles/ScoutDrone3D';
import { MaglevTrain3D } from './vehicles/MaglevTrain3D';
import { SpaceExplorer3D } from './vehicles/SpaceExplorer3D';
import { ResearchSubmarine3D } from './vehicles/ResearchSubmarine3D';
import { HighAltitudeBalloon3D } from './vehicles/HighAltitudeBalloon3D';
import { ExpeditionBike3D } from './vehicles/ExpeditionBike3D';
import { NeuralTransitPod3D } from './vehicles/NeuralTransitPod3D';
import { DiplomacyVessel3D } from './vehicles/DiplomacyVessel3D';

// 9 Themed Environments
import { SkylineEnvironment3D } from './environments/SkylineEnvironment3D';
import { InnovationLabEnvironment3D } from './environments/InnovationLabEnvironment3D';
import { MaglevTunnelEnvironment3D } from './environments/MaglevTunnelEnvironment3D';
import { ProjectUniverseEnvironment3D } from './environments/ProjectUniverseEnvironment3D';
import { OceanDepthEnvironment3D } from './environments/OceanDepthEnvironment3D';
import { StratosphereEnvironment3D } from './environments/StratosphereEnvironment3D';
import { DigitalTerrainEnvironment3D } from './environments/DigitalTerrainEnvironment3D';
import { NeuralNetworkEnvironment3D } from './environments/NeuralNetworkEnvironment3D';
import { OrbitalDockEnvironment3D } from './environments/OrbitalDockEnvironment3D';

interface TransportationSceneProps {
  config: DestinationConfig;
  progress: number;
  mouseOffset: { x: number; y: number };
  reducedMotion?: boolean;
}

/**
 * Vehicle Factory: strictly guarantees that each tab ID gets its own unique 3D vehicle
 */
function VehicleRenderer({
  tabId,
  throttle,
  banking,
  reducedMotion,
}: {
  tabId: string;
  throttle: number;
  banking: { x: number; y: number };
  reducedMotion: boolean;
}) {
  switch (tabId) {
    case 'profile':
      return <ExecutiveHovercraft3D throttle={throttle} banking={banking} reducedMotion={reducedMotion} />;
    case 'internships':
      return <ScoutDrone3D throttle={throttle} banking={banking} reducedMotion={reducedMotion} />;
    case 'experience':
      return <MaglevTrain3D throttle={throttle} banking={banking} reducedMotion={reducedMotion} />;
    case 'projects':
      return <SpaceExplorer3D throttle={throttle} banking={banking} reducedMotion={reducedMotion} />;
    case 'education':
      return <ResearchSubmarine3D throttle={throttle} banking={banking} reducedMotion={reducedMotion} />;
    case 'certifications':
      return <HighAltitudeBalloon3D throttle={throttle} banking={banking} reducedMotion={reducedMotion} />;
    case 'core-skills':
      return <ExpeditionBike3D throttle={throttle} banking={banking} reducedMotion={reducedMotion} />;
    case 'technical-skills':
      return <NeuralTransitPod3D throttle={throttle} banking={banking} reducedMotion={reducedMotion} />;
    case 'contact':
      return <DiplomacyVessel3D throttle={throttle} banking={banking} reducedMotion={reducedMotion} />;
    default:
      return <ExecutiveHovercraft3D throttle={throttle} banking={banking} reducedMotion={reducedMotion} />;
  }
}

/**
 * Environment Factory: strictly guarantees that each tab ID gets its own themed 3D environment
 */
function EnvironmentRenderer({
  tabId,
  progress,
  reducedMotion,
}: {
  tabId: string;
  progress: number;
  reducedMotion: boolean;
}) {
  switch (tabId) {
    case 'profile':
      return <SkylineEnvironment3D travelProgress={progress} reducedMotion={reducedMotion} />;
    case 'internships':
      return <InnovationLabEnvironment3D travelProgress={progress} reducedMotion={reducedMotion} />;
    case 'experience':
      return <MaglevTunnelEnvironment3D travelProgress={progress} reducedMotion={reducedMotion} />;
    case 'projects':
      return <ProjectUniverseEnvironment3D travelProgress={progress} reducedMotion={reducedMotion} />;
    case 'education':
      return <OceanDepthEnvironment3D travelProgress={progress} reducedMotion={reducedMotion} />;
    case 'certifications':
      return <StratosphereEnvironment3D travelProgress={progress} reducedMotion={reducedMotion} />;
    case 'core-skills':
      return <DigitalTerrainEnvironment3D travelProgress={progress} reducedMotion={reducedMotion} />;
    case 'technical-skills':
      return <NeuralNetworkEnvironment3D travelProgress={progress} reducedMotion={reducedMotion} />;
    case 'contact':
      return <OrbitalDockEnvironment3D travelProgress={progress} reducedMotion={reducedMotion} />;
    default:
      return <SkylineEnvironment3D travelProgress={progress} reducedMotion={reducedMotion} />;
  }
}

/**
 * Cinematic Camera Rig: 4-phase camera path matching user prompt specifications
 * Phase 1 (0–1s, progress 0-0.2): Establishing 3/4 angle reveal swooping behind vehicle
 * Phase 2 (1–2.5s, progress 0.2-0.5): Acceleration run with FOV expansion
 * Phase 3 (2.5–4s, progress 0.5-0.8): Dynamic sweeping arc showing vehicle 3D profile & scenery parallax
 * Phase 4 (4–5s, progress 0.8-1.0): Deceleration & framing arrival at destination platform/gate
 */
function CinematicCameraRig({
  config,
  progress,
  mouseOffset,
  reducedMotion = false,
}: TransportationSceneProps) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(...config.cameraStart));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -10));

  useFrame((_, delta) => {
    // Total forward travel displacement
    const travelDistance = 35;
    const vehicleZ = -progress * travelDistance;

    // 4-Phase Camera Trajectory Offset
    let arcOffsetX = 0;
    let arcOffsetY = 0;
    let arcOffsetZ = 0;
    let targetFov = 48;

    if (progress < 0.20) {
      // Phase 1 (0–1.0s): Reveal from slight side 3/4 angle, easing into tail chase
      const p1 = progress / 0.20; // 0 to 1
      arcOffsetX = (1 - p1) * 1.6;
      arcOffsetY = (1 - p1) * 0.6;
      arcOffsetZ = 1.0;
      targetFov = 48;
    } else if (progress < 0.50) {
      // Phase 2 (1.0–2.5s): Acceleration run, camera pulls back and expands FOV
      const p2 = (progress - 0.20) / 0.30;
      arcOffsetX = 0;
      arcOffsetY = p2 * 0.3;
      arcOffsetZ = 0.5 + p2 * 0.8;
      targetFov = 48 + p2 * 8; // expands up to 56
    } else if (progress < 0.80) {
      // Phase 3 (2.5–4.0s): Main cinematic dynamic arc! Gentle side sweep demonstrating 3D depth
      const p3 = (progress - 0.50) / 0.30;
      // Arc sweeps out to side then returns
      arcOffsetX = Math.sin(p3 * Math.PI) * 2.2;
      arcOffsetY = 0.3 + Math.sin(p3 * Math.PI) * 0.4;
      arcOffsetZ = 1.3 - p3 * 0.4;
      targetFov = 56 - p3 * 4;
    } else {
      // Phase 4 (4.0–5.0s): Approach destination, decelerate & center
      const p4 = (progress - 0.80) / 0.20;
      arcOffsetX = 0;
      arcOffsetY = (1 - p4) * 0.3;
      arcOffsetZ = (1 - p4) * 0.9;
      targetFov = 52 - p4 * 4;
    }

    const startPos = new THREE.Vector3(...config.cameraStart);
    const endPos = new THREE.Vector3(...config.cameraEnd);
    const baseCam = new THREE.Vector3().lerpVectors(startPos, endPos, progress);
    
    // Apply travel Z and arc offsets
    baseCam.x += arcOffsetX;
    baseCam.y += arcOffsetY;
    baseCam.z = vehicleZ + baseCam.z + arcOffsetZ;

    // Look-at point follows ahead of the vehicle
    const targetLook = new THREE.Vector3(
      arcOffsetX * 0.3,
      baseCam.y * 0.4,
      vehicleZ - 12
    );

    // Interactive mouse parallax
    if (!reducedMotion) {
      baseCam.x += mouseOffset.x * 1.4;
      baseCam.y += -mouseOffset.y * 0.9;
      targetLook.x += mouseOffset.x * 0.8;
    }

    // Smooth camera damping
    currentPos.current.lerp(baseCam, Math.min(1, delta * 4.5));
    currentLookAt.current.lerp(targetLook, Math.min(1, delta * 5.0));

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);

    // Dynamic FOV easing
    const perspCamera = camera as THREE.PerspectiveCamera;
    perspCamera.fov += (targetFov - perspCamera.fov) * Math.min(1, delta * 3.0);
    perspCamera.updateProjectionMatrix();
  });

  const vehicleZ = -progress * 35;
  // Dynamic throttle: 0-1s ramping up, 1-4s full speed, 4-5s smooth landing deceleration
  const throttle = progress < 0.2 ? 0.4 + (progress / 0.2) * 0.6 : progress < 0.8 ? 1.0 : 0.5 - (progress - 0.8) * 2 * 0.3;

  return (
    <group position={[0, 0, vehicleZ]}>
      {/* 3-Point Light Rig attached directly to Vehicle so it is always radiantly illuminated */}
      <pointLight position={[0, 3.5, -3.5]} intensity={3.5} distance={18} color="#ffffff" />
      <pointLight position={[-3.5, 1.5, 0]} intensity={2.2} distance={14} color={config.primaryColor} />
      <pointLight position={[3.5, 2.0, 3.0]} intensity={2.6} distance={14} color={config.accentColor || '#ffffff'} />
      <pointLight position={[0, -1.5, 0]} intensity={1.8} distance={10} color={config.glowColor || config.primaryColor} />

      <VehicleRenderer
        tabId={config.id}
        throttle={throttle}
        banking={mouseOffset}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

export function TransportationScene({
  config,
  progress,
  mouseOffset,
  reducedMotion = false,
}: TransportationSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: config.backgroundColor }}>
      <Canvas
        camera={{ position: config.cameraStart, fov: 48 }}
        gl={{ powerPreference: 'high-performance', antialias: true, alpha: false }}
        dpr={[1, 1.75]}
      >
        {/* Set explicit canvas clear color to prevent pitch-black clear */}
        <color attach="background" args={[config.backgroundColor]} />
        
        {/* Atmospheric Fog for cinematic scale & visible horizon */}
        <fog attach="fog" args={[config.fogColor, config.fogNear, config.fogFar]} />

        {/* Global Multi-Source Environmental Lighting Rig */}
        <ambientLight intensity={1.2} color={config.primaryColor} />
        <hemisphereLight groundColor={config.backgroundColor} color="#ffffff" intensity={0.9} />
        <directionalLight position={[20, 35, 25]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[-20, -10, -20]} intensity={1.5} color={config.accentColor || config.primaryColor} />

        {/* 1. Camera Flight, 3-Point Light Rig & 3D Vehicle */}
        <CinematicCameraRig
          config={config}
          progress={progress}
          mouseOffset={mouseOffset}
          reducedMotion={reducedMotion}
        />

        {/* 2. Themed 3D Environment with Depth Layers */}
        <EnvironmentRenderer
          tabId={config.id}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}

export default TransportationScene;
