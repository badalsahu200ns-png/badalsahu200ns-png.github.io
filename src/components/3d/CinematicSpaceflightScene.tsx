import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Spacecraft3D } from './Spacecraft3D';
import { WarpCorridor3D } from './WarpCorridor3D';
import { CareerWorldMegastructure } from './CareerWorldMegastructure';

interface SpaceflightSceneProps {
  progress: number; // 0 (start) to 1 (arrival)
  mouseOffset: { x: number; y: number };
  reducedMotion?: boolean;
}

function CameraFlightRig({
  progress,
  mouseOffset,
  reducedMotion,
}: SpaceflightSceneProps) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 1.2, 5.2));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -5));

  useFrame((_, delta) => {
    // 1. Calculate Spacecraft position along Z based on progress
    // z goes from 0 at start to -115 at arrival
    const shipZ = -progress * 115;

    // 2. Camera target calculation
    let targetCamX = 0;
    let targetCamY = 1.3;
    let targetCamZ = shipZ + 5.5;
    let targetLookX = 0;
    let targetLookY = 0.2;
    let targetLookZ = shipZ - 10;

    // Subtle mouse parallax influence
    if (!reducedMotion) {
      targetCamX += mouseOffset.x * 1.4;
      targetCamY += -mouseOffset.y * 0.9;
      targetLookX += mouseOffset.x * 0.6;
    }

    // Phase transitions
    if (progress < 0.2) {
      // Launch phase: Close dramatic chase view
      targetCamZ = shipZ + 4.8;
      targetCamY = 1.1;
    } else if (progress >= 0.2 && progress < 0.75) {
      // Warp flight phase: Dynamic acceleration chase
      targetCamZ = shipZ + 6.2;
      targetCamY = 1.4;
    } else {
      // Approach & Arrival phase: Camera pulls back gently framing both ship and Megastructure
      const arrivalBlend = (progress - 0.75) / 0.25; // 0 to 1
      targetCamX = THREE.MathUtils.lerp(targetCamX, 0.5, arrivalBlend);
      targetCamY = THREE.MathUtils.lerp(targetCamY, 1.2, arrivalBlend);
      targetCamZ = THREE.MathUtils.lerp(targetCamZ, shipZ + 11.5, arrivalBlend);
      targetLookX = THREE.MathUtils.lerp(targetLookX, 0, arrivalBlend);
      targetLookY = THREE.MathUtils.lerp(targetLookY, 0.4, arrivalBlend);
      targetLookZ = THREE.MathUtils.lerp(targetLookZ, shipZ - 30, arrivalBlend);
    }

    // Smooth camera position interpolation
    currentPos.current.x += (targetCamX - currentPos.current.x) * Math.min(1, delta * 3.5);
    currentPos.current.y += (targetCamY - currentPos.current.y) * Math.min(1, delta * 3.5);
    currentPos.current.z += (targetCamZ - currentPos.current.z) * Math.min(1, delta * 3.5);

    currentLookAt.current.x += (targetLookX - currentLookAt.current.x) * Math.min(1, delta * 4);
    currentLookAt.current.y += (targetLookY - currentLookAt.current.y) * Math.min(1, delta * 4);
    currentLookAt.current.z += (targetLookZ - currentLookAt.current.z) * Math.min(1, delta * 4);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);

    // Dynamic FOV: stretches during warp speed for visceral speed sensation
    const perspCamera = camera as THREE.PerspectiveCamera;
    const targetFOV = progress > 0.25 && progress < 0.75 ? 64 : 50;
    perspCamera.fov += (targetFOV - perspCamera.fov) * delta * 2.5;
    perspCamera.updateProjectionMatrix();
  });

  // Calculate current ship position
  const shipZ = -progress * 115;
  const throttle = progress < 0.15 ? 0.35 : progress < 0.75 ? 1.0 : 0.45;

  // During arrival (progress > 0.75), offset ship smoothly to the right flank so it frames the hero text cleanly
  const arrivalBlend = progress > 0.75 ? Math.min(1, (progress - 0.75) / 0.25) : 0;
  const shipX = arrivalBlend * 3.2;
  const shipY = (Math.sin(progress * Math.PI) * 0.5) + (arrivalBlend * 1.3);
  const shipRotY = -arrivalBlend * 0.35;
  const shipRotZ = arrivalBlend * 0.12;

  return (
    <>
      {/* Spacecraft following the flight timeline with arrival flank framing */}
      <group
        position={[shipX, shipY, shipZ]}
        rotation={[0, shipRotY, shipRotZ]}
      >
        <Spacecraft3D
          throttle={throttle}
          banking={mouseOffset}
          reducedMotion={reducedMotion}
        />
      </group>
    </>
  );
}

export function CinematicSpaceflightScene({
  progress,
  mouseOffset,
  reducedMotion = false,
}: SpaceflightSceneProps) {
  // Throttle value for warp speed
  const speed = progress > 0.2 && progress < 0.8 ? 0.95 : 0.25;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#020408]">
      <Canvas
        camera={{ position: [0, 1.2, 5.2], fov: 52 }}
        gl={{ powerPreference: 'high-performance', antialias: true, alpha: false }}
        dpr={[1, 1.75]} // capped for high performance
      >
        {/* Sovereign Space Environment Lighting with strong rim lights for green metallic hull */}
        <ambientLight intensity={0.5} color="#059669" />
        <directionalLight
          position={[15, 25, 20]}
          intensity={2.4}
          color="#f8fafc"
        />
        <directionalLight
          position={[-15, -10, -30]}
          intensity={1.2}
          color="#22c55e"
        />
        <pointLight
          position={[5, 10, -progress * 115 + 10]}
          color="#4ade80"
          intensity={2.0}
          distance={40}
        />

        {/* 1. Camera Flight Controller & Spacecraft */}
        <CameraFlightRig
          progress={progress}
          mouseOffset={mouseOffset}
          reducedMotion={reducedMotion}
        />

        {/* 2. Warp Corridor, Hyperspace Stars & Hex Gates */}
        <WarpCorridor3D
          speed={speed}
          travelProgress={progress}
          reducedMotion={reducedMotion}
        />

        {/* 3. Destination Megastructure: BADAL // 001 CAREER WORLD */}
        <CareerWorldMegastructure reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

export default CinematicSpaceflightScene;
