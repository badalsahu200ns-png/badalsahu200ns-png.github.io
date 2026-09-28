import { useState, useEffect, useRef } from 'react';
import { profileData } from '../data/portfolioData';
import { ChevronRight, ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';
import { DeploymentStatusBadge } from './common/DeploymentStatusBadge';

interface MenuItem {
  id: string;
  number: string;
  label: string;
  tagline: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'profile',
    number: '01',
    label: 'PROFILE',
    tagline: 'Executive summary, commercial acumen & core pillars',
  },
  {
    id: 'internships',
    number: '02',
    label: 'CURRENT INTERNSHIPS',
    tagline: 'Active engagements at Edunet/Vodafone & Neo Skillz',
  },
  {
    id: 'experience',
    number: '03',
    label: 'PROFESSIONAL EXPERIENCE',
    tagline: 'Magicbricks, redBus, Reliance & ICICI Prudential milestones',
  },
  {
    id: 'projects',
    number: '04',
    label: 'FEATURED PROJECTS',
    tagline: 'Autonomous AI agents, Gemini RAG & BigQuery architectures',
  },
  {
    id: 'education',
    number: '05',
    label: 'EDUCATION',
    tagline: 'MCA at Amity, PGDM at IMIS & B.Com foundations',
  },
  {
    id: 'certifications',
    number: '06',
    label: 'CERTIFICATIONS',
    tagline: 'Google Cloud, Oracle, Cisco & Forage consulting simulations',
  },
  {
    id: 'core-skills',
    number: '07',
    label: 'CORE SKILLS & EXPERTISE',
    tagline: '8 capability clusters across analytics, GenAI & product',
  },
  {
    id: 'technical-skills',
    number: '08',
    label: 'TECHNICAL SKILLS',
    tagline: '3D constellation orbital environment & technology matrix',
  },
  {
    id: 'contact',
    number: '09',
    label: 'DIRECT COLLABORATION CHANNEL',
    tagline: 'Direct communication endpoints & inquiry transmission',
  },
];

const CAPABILITIES = [
  'Business Analytics',
  'Generative AI',
  'Software Development',
  'Data Analytics',
  'AI Products',
  'Google Cloud',
];

interface GameTitleScreenProps {
  onSelectSection: (sectionId: string) => void;
  onResumeClick: () => void;
  visitorName?: string;
}

export function GameTitleScreen({ onSelectSection, onResumeClick, visitorName }: GameTitleScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax tracking on container mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Keyboard navigation: Arrow Up, Arrow Down, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % MENU_ITEMS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelectSection(MENU_ITEMS[selectedIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelectSection]);

  const activeItem = MENU_ITEMS[selectedIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 z-10"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center">
        
        {/* Left Column: Confident Editorial Branding & Identity */}
        <div className="lg:col-span-4 flex flex-col justify-center select-none order-1">
          
          {/* Top System Status Tag */}
          <div className="inline-flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(118,255,3,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {profileData.identityCode}
            </span>
            <span className="text-slate-400 font-mono text-xs">
              // CAREER WORLD
            </span>
            <span className="px-2.5 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs tracking-wider">
              PILOT: {(visitorName || 'PILOT').toUpperCase()}
            </span>
            <DeploymentStatusBadge align="left" />
          </div>

          {/* Subtitle: Professional Operating System */}
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">
            BADAL // PROFESSIONAL OPERATING SYSTEM
          </p>

          {/* Main Confident Name: BADAL KUMAR SAHU */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-display font-extrabold uppercase tracking-tight text-white leading-none mb-3">
            BADAL KUMAR{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300">
              SAHU
            </span>
          </h1>

          {/* Supporting Line */}
          <p className="text-base sm:text-lg font-medium text-slate-200 tracking-normal leading-snug mb-5">
            Building at the intersection of Business, Data, AI &amp; Software.
          </p>

          {/* Modern Professional Capability Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-1.5">
              {CAPABILITIES.map((cap) => (
                <span
                  key={cap}
                  className="px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.03] text-slate-300 font-mono text-[11px] sm:text-xs tracking-wider hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Commercial Frontline Summary Box */}
          <div className="p-3.5 rounded-xl border-l-2 border-emerald-400 bg-[#080c16]/85 border border-white/10 shadow-lg mb-6 backdrop-blur-md">
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Fusing 5+ years of commercial frontline leadership with autonomous multi-agent systems and petabyte-scale analytics.
            </p>
          </div>

          {/* Contextual Preview of Currently Selected Menu Item */}
          <div className="hidden sm:flex items-center gap-2.5 p-3 rounded-lg border border-white/[0.08] bg-black/40 font-mono text-xs text-slate-300 mb-6">
            <span className="text-emerald-400 font-bold tracking-wider">
              [ {activeItem.number} ]
            </span>
            <span className="text-white font-semibold">
              {activeItem.label}:
            </span>
            <span className="text-slate-400 truncate">
              {activeItem.tagline}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectSection('projects')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(118,255,3,0.3)] hover:shadow-[0_0_30px_rgba(118,255,3,0.5)]"
            >
              <Compass className="w-4 h-4" />
              <span>EXPLORE PROJECTS</span>
            </button>

            <button
              onClick={onResumeClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 hover:border-cyan-400/80 bg-white/[0.03] hover:bg-cyan-500/10 text-slate-200 hover:text-cyan-300 font-mono text-xs tracking-wider transition-all duration-300"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>VIEW RESUME</span>
            </button>
          </div>

        </div>

        {/* Center Column: The Visual Focal Point — Original Photograph with Cinematic Depth */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center order-2 py-4 select-none">
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] flex items-center justify-center">
            
            {/* Subtle atmospheric ambient glow behind the portrait (no artificial face light) */}
            <div
              className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-emerald-500/15 via-cyan-500/15 to-transparent blur-[85px] pointer-events-none transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(${-mouseOffset.x * 12}px, ${-mouseOffset.y * 12}px, 0)`,
              }}
            />

            {/* Subtle Tech Coordinates HUD Frame */}
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

            {/* 3D Parallax Portrait Container */}
            <div
              className="relative z-10 w-full flex items-center justify-center transition-transform duration-200 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${mouseOffset.x * 4.5}deg) rotateX(${-mouseOffset.y * 4.5}deg) translateZ(6px)`,
              }}
            >
              {/* Original Photograph: Kept 100% natural, seamlessly integrated into black background */}
              <img
                src={profileData.heroImage || '/images/nameste-hi.png'}
                alt="Badal Kumar Sahu"
                className="h-[360px] sm:h-[440px] lg:h-[500px] xl:h-[540px] w-auto max-w-full object-contain filter contrast-[1.02] brightness-[1.01] select-none [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)] drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/media/profile/nameste-hi.png';
                }}
              />
            </div>

            {/* Bottom soft gradient blend into background */}
            <div className="absolute -bottom-4 left-0 right-0 h-16 bg-gradient-to-t from-[#05070a] via-[#05070a]/70 to-transparent pointer-events-none z-20" />
          </div>
        </div>

        {/* Right Column: Game-Inspired Full-Screen Interactive Menu */}
        <div className="lg:col-span-4 flex flex-col justify-center order-3">
          
          <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#080c16]/92 backdrop-blur-xl shadow-2xl relative">
            
            {/* Menu Header HUD */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08] font-mono text-xs">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                NAVIGATION PROTOCOL // ACTIVE
              </span>
              <span className="text-slate-500 text-[10px] hidden sm:inline">
                ARROWS &bull; ENTER
              </span>
            </div>

            {/* Menu Items List */}
            <nav className="flex flex-col space-y-1" aria-label="Game Menu">
              {MENU_ITEMS.map((item, index) => {
                const isSelected = selectedIndex === index;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedIndex(index);
                      onSelectSection(item.id);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group relative w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all duration-200 flex items-center justify-between outline-none ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/15 text-white shadow-[0_0_20px_rgba(118,255,3,0.15)] translate-x-1'
                        : 'border-transparent bg-white/[0.02] text-slate-300 hover:border-white/15 hover:bg-white/[0.05]'
                    }`}
                  >
                    {/* Left: Indicator & Label */}
                    <div className="flex items-center gap-2.5">
                      {/* Animated Distinctive Cursor Indicator */}
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center font-mono text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-400 text-black shadow-[0_0_10px_rgba(118,255,3,0.8)] scale-110'
                            : 'bg-white/[0.05] text-slate-500 group-hover:text-slate-300'
                        }`}
                      >
                        {isSelected ? '►' : item.number}
                      </span>

                      <div className="flex flex-col">
                        <span
                          className={`font-display text-xs sm:text-sm font-bold tracking-wider ${
                            isSelected ? 'text-white hud-glow' : 'text-slate-300'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 hidden xl:block truncate max-w-[200px]">
                          {item.tagline}
                        </span>
                      </div>
                    </div>

                    {/* Right: Enter action glyph */}
                    <div className="flex items-center gap-1 font-mono text-xs">
                      {isSelected ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[9px] font-bold border border-emerald-400/40 flex items-center gap-0.5 animate-pulse">
                          ENTER
                          <ChevronRight className="w-3 h-3 inline" />
                        </span>
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>

          </div>

        </div>

      </div>
    </div>
  );
}

export default GameTitleScreen;
