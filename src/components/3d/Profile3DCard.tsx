import { useState, useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { Sparkles, Cpu } from 'lucide-react';

interface Profile3DCardProps {
  imageSrc?: string;
  cutoutSrc?: string;
  name?: string;
  identityCode?: string;
}

export function Profile3DCard({
  imageSrc = '/images/nameste hi.png',
  cutoutSrc = '/images/nameste hi.png',
  name = 'BADAL KUMAR SAHU',
  identityCode = 'BADAL // 001',
}: Profile3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subdued, elegant tilt angles (-7 to +7 degrees)
    const rx = ((y - centerY) / centerY) * -7;
    const ry = ((x - centerX) / centerX) * 7;

    setRotateX(rx);
    setRotateY(ry);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  return (
    <div
      className="relative w-full max-w-[420px] mx-auto select-none"
      style={{ perspective: '1100px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[4/5] rounded-3xl p-3 sm:p-4 transition-transform duration-200 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: reducedMotion
            ? 'none'
            : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Layer 0: Ambient Depth Back-Glow */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/15 to-transparent blur-2xl transition-opacity duration-500 pointer-events-none"
          style={{
            transform: 'translateZ(-20px)',
            opacity: isHovered ? 0.85 : 0.45,
          }}
        />

        {/* Layer 1: Base Shell with HUD Grid & Border */}
        <div
          className="absolute inset-0 rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1220]/95 via-[#080d17]/95 to-[#04070e]/95 shadow-[0_25px_50px_rgba(0,0,0,0.85)] overflow-hidden"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Subtle Grid Telemetry Backdrop */}
          <div className="absolute inset-0 grid-background opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04070e] via-transparent to-transparent opacity-90" />

          {/* Corner Crosshair Markers */}
          <div className="absolute top-3 left-3 text-[10px] font-mono text-emerald-400/60">+ [001]</div>
          <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-500">SYS_SEC_V3</div>
          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-500">AUTONOMOUS</div>
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-cyan-400/60">+</div>

          {/* Holographic Radial Orbit Rings in Background */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white/5 border-dashed animate-spin"
            style={{ animationDuration: '45s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-emerald-500/10"
          />
        </div>

        {/* Layer 2: Real Photograph Cutout with Layered Depth */}
        <div
          className="absolute inset-x-4 bottom-2 top-8 flex items-end justify-center pointer-events-none transition-transform duration-300"
          style={{
            transform: reducedMotion ? 'none' : 'translateZ(40px)',
          }}
        >
          {/* High-res transparent cutout */}
          <img
            src={cutoutSrc}
            alt={name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = imageSrc || '/media/profile/nameste-hi.png';
            }}
            className="max-h-[92%] w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)] contrast-[1.06] brightness-[1.02]"
          />
        </div>

        {/* Layer 3: Foreground Floating Holographic HUD Chrome */}
        <div
          className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none"
          style={{
            transform: reducedMotion ? 'none' : 'translateZ(65px)',
          }}
        >
          {/* Top Telemetry Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 backdrop-blur-md shadow-[0_0_15px_rgba(118,255,3,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest text-emerald-300 font-semibold uppercase">
                {identityCode}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px]">3D_PERSONA</span>
            </div>
          </div>

          {/* Bottom Identity Anchor */}
          <div className="space-y-1 bg-[#05070a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 shadow-2xl">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3 h-3" />
                DIGITAL IDENTITY
              </span>
              <span className="text-slate-400 font-semibold">VERIFIED</span>
            </div>
            <h2 className="text-lg sm:text-xl font-display font-black text-white tracking-tight">
              {name}
            </h2>
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] font-mono text-[10px] text-slate-400">
              <span>BUSINESS &amp; AI ARCHITECT</span>
              <span className="text-emerald-400">STATUS // ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Layer 4: Interactive Light Sheen Glare */}
        {!reducedMotion && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.28 : 0,
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 65%)`,
              transform: 'translateZ(75px)',
            }}
          />
        )}
      </div>

      {/* Subtle Bottom Instruction */}
      <div className="mt-3 text-center font-mono text-[10px] text-slate-500 tracking-wider">
        [ INTERACTIVE 3D IDENTITY // MOVE CURSOR TO EXPLORE DEPTH ]
      </div>
    </div>
  );
}
