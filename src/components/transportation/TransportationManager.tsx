import { useState, useEffect, useRef, useCallback } from 'react';
import { TRANSPORTATION_DESTINATIONS, TRANSPORTATION_MODE_LIST } from './TransportationConfig';
import { TransportationScene } from './TransportationScene';
import { TransportationHUD } from './TransportationHUD';
import { WebGLErrorBoundary } from '../common/WebGLErrorBoundary';
import { soundEngine } from '../../utils/soundEngine';

interface TransportationManagerProps {
  destinationId: string;
  onArrival: () => void;
  onChangeDestination?: (id: string) => void;
}

export const EXACT_JOURNEY_DURATION_MS = 6000; // Strictly 6,000 milliseconds (6.0s)

export function TransportationManager({ destinationId, onArrival, onChangeDestination }: TransportationManagerProps) {
  const [activeDestId, setActiveDestId] = useState(destinationId);

  useEffect(() => {
    setActiveDestId(destinationId);
  }, [destinationId]);

  const config = TRANSPORTATION_DESTINATIONS[activeDestId] || TRANSPORTATION_DESTINATIONS['profile'];
  
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
    soundEngine.playArrivalChime(activeDestId);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setTimeout(() => {
      onArrival();
    }, 200);
  }, [activeDestId, onArrival]);

  const handleSelectMode = useCallback((newId: string) => {
    if (newId === activeDestId) return;
    soundEngine.playClick();
    soundEngine.stopVehicleAudio();
    setActiveDestId(newId);
    setProgress(0);
    isArrivingRef.current = false;
    setIsArriving(false);
    if (onChangeDestination) {
      onChangeDestination(newId);
    }
  }, [activeDestId, onChangeDestination]);

  // Global ESC key to skip and Number keys 1-9 to jump directly between modes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      } else if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key, 10) - 1;
        const target = TRANSPORTATION_MODE_LIST[idx];
        if (target && target.id !== activeDestId) {
          e.preventDefault();
          handleSelectMode(target.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip, handleSelectMode, activeDestId]);

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
    soundEngine.startVehicleAudio(activeDestId);

    if (prefersReducedMotion) {
      const reducedTimer = setTimeout(() => {
        soundEngine.playArrivalChime(activeDestId);
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
          soundEngine.playArrivalChime(activeDestId);
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
  }, [activeDestId, onArrival, prefersReducedMotion]);

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
        onSelectMode={handleSelectMode}
      />
    </div>
  );
}

export default TransportationManager;
