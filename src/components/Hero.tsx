import { useState, useRef } from 'react';
import { profileData } from '../data/portfolioData';
import { DeploymentStatusBadge } from './common/DeploymentStatusBadge';
import { Compass, Mail, ShieldCheck } from 'lucide-react';

const CAPABILITIES = [
  'Business Analytics',
  'Generative AI',
  'Software Development',
  'Data Analytics',
  'AI Products',
  'Google Cloud',
];

export function Hero() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8 z-10"
    >
      <div className="relative z-10 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        
        {/* Left Column: Typography & Identity */}
        <div className="lg:col-span-7 flex flex-col justify-center select-none text-left">
          
          {/* Identity & Status Tag */}
          <div className="inline-flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(118,255,3,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {profileData.identityCode}
            </span>
            <span className="text-slate-400 font-mono text-xs">
              // CAREER WORLD
            </span>
            <DeploymentStatusBadge align="left" />
          </div>

          {/* Subtitle */}
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">
            BADAL // PROFESSIONAL OPERATING SYSTEM
          </p>

          {/* Main Name: BADAL KUMAR SAHU */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold uppercase tracking-tight text-white leading-none mb-4">
            BADAL KUMAR{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300">
              SAHU
            </span>
          </h1>

          {/* Supporting Line */}
          <p className="text-lg sm:text-xl font-medium text-slate-200 tracking-normal leading-snug mb-5">
            Building at the intersection of Business, Data, AI &amp; Software.
          </p>

          {/* Capabilities Matrix */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CAPABILITIES.map((cap) => (
              <span
                key={cap}
                className="px-3 py-1 rounded-md border border-white/[0.08] bg-white/[0.03] text-slate-300 font-mono text-xs tracking-wider hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
              >
                {cap}
              </span>
            ))}
          </div>

          {/* Statement box */}
          <div className="p-4 rounded-xl border-l-2 border-emerald-400 bg-[#080c16]/85 border border-white/10 shadow-lg mb-8 backdrop-blur-md max-w-2xl">
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              Fusing 5+ years of commercial frontline leadership with autonomous multi-agent systems and petabyte-scale analytics.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(118,255,3,0.3)] hover:shadow-[0_0_30px_rgba(118,255,3,0.5)]"
            >
              <Compass className="w-4 h-4" />
              <span>EXPLORE WORK</span>
            </a>

            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/50 bg-white/[0.03] hover:bg-white/10 text-white font-mono text-xs tracking-wider transition-all"
            >
              <span>GITHUB</span>
            </a>

            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-cyan-400/80 bg-white/[0.03] hover:bg-cyan-500/10 text-slate-200 hover:text-cyan-300 font-mono text-xs tracking-wider transition-all"
            >
              <span>LINKEDIN</span>
            </a>
          </div>

        </div>

        {/* Right Column: Visual Focal Point — Original Photograph with Parallax */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center select-none py-6">
          <div className="relative w-full max-w-[420px] lg:max-w-[480px] flex items-center justify-center">
            
            {/* Atmospheric Backlight */}
            <div
              className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-emerald-500/15 via-cyan-500/15 to-transparent blur-[90px] pointer-events-none transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(${-mouseOffset.x * 12}px, ${-mouseOffset.y * 12}px, 0)`,
              }}
            />

            {/* Corner Tech Accents */}
            <div className="absolute top-2 left-2 z-20 font-mono text-[9px] text-slate-500 tracking-widest hidden sm:block">
              ┌ SYS.ID // 001
            </div>
            <div className="absolute top-2 right-2 z-20 font-mono text-[9px] text-emerald-400/70 tracking-widest hidden sm:block">
              [VERIFIED_PORTRAIT] ┐
            </div>
            <div className="absolute bottom-6 left-2 z-20 font-mono text-[9px] text-slate-500 tracking-widest hidden sm:block">
              └ LOC // INDIA
            </div>
            <div className="absolute bottom-6 right-2 z-20 font-mono text-[9px] text-cyan-400/70 tracking-widest hidden sm:block">
              [STATUS: ACTIVE] ┘
            </div>

            {/* Parallax Container */}
            <div
              className="relative z-10 w-full flex items-center justify-center transition-transform duration-200 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${mouseOffset.x * 4}deg) rotateX(${-mouseOffset.y * 4}deg) translateZ(8px)`,
              }}
            >
              <img
                src={profileData.heroImage || '/images/nameste-hi.png'}
                alt="Badal Kumar Sahu"
                className="h-[420px] sm:h-[480px] lg:h-[560px] w-auto max-w-full object-contain filter contrast-[1.02] brightness-[1.01] select-none [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)] drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/media/profile/nameste-hi.png';
                }}
              />
            </div>

            {/* Bottom soft gradient blend */}
            <div className="absolute -bottom-4 left-0 right-0 h-16 bg-gradient-to-t from-[#05070a] via-[#05070a]/70 to-transparent pointer-events-none z-20" />
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
