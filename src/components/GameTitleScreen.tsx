import { useState, useEffect } from 'react';
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

interface GameTitleScreenProps {
  onSelectSection: (sectionId: string) => void;
  onResumeClick: () => void;
  visitorName?: string;
}

export function GameTitleScreen({ onSelectSection, onResumeClick, visitorName }: GameTitleScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

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
    <div className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-4 sm:px-8 z-10">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Massive Cinematic Editorial Branding */}
        <div className="lg:col-span-6 flex flex-col justify-center select-none">
          
          {/* Top System Status Tag */}
          <div className="inline-flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(118,255,3,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {profileData.identityCode}
            </span>
            <span className="text-slate-400 font-mono text-xs">
              // CAREER WORLD
            </span>
            <span className="px-2.5 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs tracking-wider">
              PILOT: {(visitorName || 'SOUMYA').toUpperCase()}
            </span>
            <DeploymentStatusBadge align="left" />
          </div>

          {/* Visual Representation of BADAL KUMAR SAHU via badal.png */}
          <div className="mb-6 flex items-center justify-start">
            <h1 className="m-0 p-0 block leading-none">
              <span className="sr-only">Badal Kumar Sahu</span>
              <img
                src="/images/badal.png"
                alt="Badal Kumar Sahu"
                className="h-44 sm:h-56 md:h-64 lg:h-72 w-auto max-w-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] contrast-[1.04] brightness-[1.02] select-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/media/profile/badal.png';
                }}
              />
            </h1>
          </div>

          {/* Prominent Brand Positioning Headline (Mandatory Requirement) */}
          <div className="p-4 rounded-xl border-l-4 border-emerald-400 bg-[#080c16]/90 border border-white/10 shadow-2xl mb-6 backdrop-blur-md">
            <p className="font-mono text-xs sm:text-sm font-bold text-emerald-300 tracking-wide uppercase leading-relaxed">
              Business Analytics <span className="text-slate-500">|</span> AI Strategy <span className="text-slate-500">|</span> AI Software Developer <span className="text-slate-500">|</span> Generative AI <span className="text-slate-500">|</span> Data Analytics
            </p>
            <p className="mt-2 text-xs text-slate-400 font-mono">
              Fusing 5+ years of commercial frontline leadership with autonomous multi-agent systems and petabyte-scale analytics.
            </p>
          </div>

          {/* Contextual Preview of Currently Selected Menu Item */}
          <div className="hidden sm:flex items-center gap-3 p-3.5 rounded-lg border border-white/[0.08] bg-black/40 font-mono text-xs text-slate-300">
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

          {/* Quick Actions for Mobile or Immediate Explorers */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
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

        {/* Right Column: Game-Inspired Full-Screen Interactive Menu */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          
          <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-[#080c16]/92 backdrop-blur-xl shadow-2xl relative">
            
            {/* Menu Header HUD */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08] font-mono text-xs">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                NAVIGATION PROTOCOL // ACTIVE
              </span>
              <span className="text-slate-500 text-[11px] hidden sm:inline">
                USE ARROW KEYS &bull; ENTER TO ENGAGE
              </span>
            </div>

            {/* Menu Items List */}
            <nav className="flex flex-col space-y-1.5" aria-label="Game Menu">
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
                    className={`group relative w-full text-left p-3 sm:p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between outline-none ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/15 text-white shadow-[0_0_20px_rgba(118,255,3,0.15)] translate-x-1.5'
                        : 'border-transparent bg-white/[0.02] text-slate-300 hover:border-white/15 hover:bg-white/[0.05]'
                    }`}
                  >
                    {/* Left: Indicator & Label */}
                    <div className="flex items-center gap-3">
                      {/* Animated Distinctive Cursor Indicator */}
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-400 text-black shadow-[0_0_10px_rgba(118,255,3,0.8)] scale-110'
                            : 'bg-white/[0.05] text-slate-500 group-hover:text-slate-300'
                        }`}
                      >
                        {isSelected ? '►' : item.number}
                      </span>

                      <div className="flex flex-col">
                        <span
                          className={`font-display text-sm sm:text-base font-bold tracking-wider ${
                            isSelected ? 'text-white hud-glow' : 'text-slate-300'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 hidden sm:block">
                          {item.tagline}
                        </span>
                      </div>
                    </div>

                    {/* Right: Enter action glyph */}
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/40 flex items-center gap-1 animate-pulse">
                          ENTER
                          <ChevronRight className="w-3 h-3 inline" />
                        </span>
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
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
