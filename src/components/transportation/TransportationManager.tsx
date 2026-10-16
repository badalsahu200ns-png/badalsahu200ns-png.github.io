import { useState, useEffect, useRef, useCallback } from 'react';
import { TRANSPORTATION_DESTINATIONS } from './TransportationConfig';
import { TransportationScene } from './TransportationScene';
import { TransportationHUD } from './TransportationHUD';
import { WebGLErrorBoundary } from '../common/WebGLErrorBoundary';
import { soundEngine } from '../../utils/soundEngine';

interface TransportationManagerProps {
  destinationId: string;
  onArrival: () => void;
}

export const EXACT_JOURNEY_DURATION_MS = 6000; // Strictly 6,000 milliseconds (6.0s)

export function TransportationManager({ destinationId, onArrival }: TransportationManagerProps) {
  const config = TRANSPORTATION_DESTINATIONS[destinationId] || TRANSPORTATION_DESTINATIONS['profile'];
  
  const [progress, setProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isBoosting, setIsBoosting] = useState(false);
  const isBoostingRef = useRef(false);
  const [isArriving, setIsArriving] = useState(false);

  useEffect(() => {
    isBoostingRef.current = isBoosting;
  }, [isBoosting]);

  const animFrameRef = useRef<number | null>(null);
  const isArrivingRef = useRef(false);

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const handleSkip = useCallback(() => {
    if (isArrivingRef.current) return;
    isArrivingRef.current = true;
    setIsArriving(true);
    soundEngine.playArrivalChime(destinationId);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setTimeout(() => {
      onArrival();
    }, 200);
  }, [destinationId, onArrival]);

  // Global ESC key to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Track mouse coordinates for 3D camera & vehicle banking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  // Safe animation loop for transportation journey
  useEffect(() => {
    soundEngine.startVehicleAudio(destinationId);

    if (prefersReducedMotion) {
      const reducedTimer = setTimeout(() => {
        soundEngine.playArrivalChime(destinationId);
        onArrival();
      }, 1000);
      return () => {
        clearTimeout(reducedTimer);
        soundEngine.stopVehicleAudio();
      };
    }

    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      // Accelerated rate if boost is held
      const boostMultiplier = isBoostingRef.current ? 2.4 : 1.0;
      const progressDelta = (delta / EXACT_JOURNEY_DURATION_MS) * boostMultiplier;

      setProgress((prev) => {
        const next = Math.min(1.0, prev + progressDelta);

        // Dynamic audio throttle modulation (0-1.5s ramp, 1.5-4.5s full speed/boost, 4.5-6.0s deceleration)
        const throttle = next < 0.25 ? 0.4 + (next / 0.25) * 0.6 : next < 0.75 ? (isBoostingRef.current ? 1.2 : 1.0) : 0.5;
        soundEngine.updateVehicleThrottle(throttle, next);

        if (next >= 1.0 && !isArrivingRef.current) {
          isArrivingRef.current = true;
          setIsArriving(true);
          soundEngine.playArrivalChime(destinationId);
          setTimeout(() => {
            onArrival();
          }, 350);
        }
        return next;
      });

      if (!isArrivingRef.current) {
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      soundEngine.stopVehicleAudio();
    };
  }, [destinationId, onArrival, prefersReducedMotion]);

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-50 overflow-hidden bg-[#030712] text-white transition-opacity duration-500 select-none ${
        isArriving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D Canvas Scene */}
      <WebGLErrorBoundary
        fallback={
          <div className="absolute inset-0 bg-[#040914] flex flex-col items-center justify-center font-mono text-cyan-400 gap-4">
            <span className="text-sm tracking-widest">[TRANSIT // 3D ACCELERATION FALLBACK]</span>
            <button
              onClick={handleSkip}
              className="px-4 py-2 rounded border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs"
            >
              PROCEED TO CHAPTER DIRECTLY
            </button>
          </div>
        }
      >
        <TransportationScene
          config={config}
          progress={progress}
          mouseOffset={mouseOffset}
          reducedMotion={prefersReducedMotion}
        />
      </WebGLErrorBoundary>

      {/* Cinematic HUD Chrome Overlay */}
      <TransportationHUD
        config={config}
        progress={progress}
        isBoosting={isBoosting}
        onSetBoosting={setIsBoosting}
        onSkip={handleSkip}
      />
    </div>
  );
}

export default TransportationManager;
