import React, { Component, Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { DataOrb } from './DataOrb';
import { FloatingParticles } from './FloatingParticles';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('WebGL render issue caught gracefully:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function StaticDataGraphicFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        {/* Outer orbital rings */}
        <div className="absolute inset-0 rounded-full border border-accent/30 animate-[spin_12s_linear_infinite]" />
        <div className="absolute inset-4 rounded-full border border-cyan/20 animate-[spin_18s_linear_infinite_reverse]" />
        <div className="absolute inset-10 rounded-full border border-violet/25 border-dashed animate-[spin_24s_linear_infinite]" />
        
        {/* Center glowing core */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent/20 via-cyan/30 to-violet/20 blur-sm flex items-center justify-center border border-accent/40">
          <span className="text-[10px] font-mono tracking-widest text-accent font-semibold">CORE</span>
        </div>

        {/* Nodes */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-accent/40 text-[10px] font-mono text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          DATA
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-cyan/40 text-[10px] font-mono text-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
          AI
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-violet/40 text-[10px] font-mono text-violet">
          <span className="w-1.5 h-1.5 rounded-full bg-violet" />
          CLOUD
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-cyan/40 text-[10px] font-mono text-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
          INSIGHT
        </div>
      </div>
    </div>
  );
}

export function HeroScene() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionHandler);
    window.addEventListener('resize', checkMobile, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', motionHandler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!mounted) {
    return <StaticDataGraphicFallback />;
  }

  return (
    <div className="w-full h-[420px] sm:h-[500px] lg:h-[580px] relative flex items-center justify-center">
      {/* Background ambient radial aura */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-60" />
      
      {/* Technical HUD Overlay Tags */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex flex-col items-end gap-1 font-mono text-[11px] text-white/40 pointer-events-none">
        <span className="text-accent flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          SYSTEM: OPTIMAL
        </span>
        <span>LAT: 12ms // BUFFER: 100%</span>
        <span>CORE: 3D_TENSOR_ACTIVE</span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 font-mono text-[10px] text-white/40 pointer-events-none">
        <span className="px-1.5 py-0.5 border border-white/10 rounded bg-white/[0.02]">THREE.JS</span>
        <span className="text-white/30">DATA → AI → CLOUD → INSIGHT</span>
      </div>

      <WebGLErrorBoundary fallback={<StaticDataGraphicFallback />}>
        <Canvas
          camera={{ position: [0, 0, isMobile ? 7.2 : 6.2], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <Suspense fallback={null}>
            {/* Multi-chromatic lighting */}
            <ambientLight intensity={0.45} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[-10, -5, -5]} intensity={1.2} color="#76ff03" />
            <pointLight position={[10, 5, -5]} intensity={1.2} color="#00e5ff" />
            <pointLight position={[0, -8, 4]} intensity={0.6} color="#8b5cf6" />

            {/* Core Data Orb */}
            <DataOrb reducedMotion={reducedMotion} />

            {/* Ambient Particle Field */}
            <FloatingParticles count={isMobile ? 80 : 140} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
