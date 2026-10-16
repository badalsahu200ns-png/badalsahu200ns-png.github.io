import { useState, useEffect, useRef } from 'react';
import { profileData } from '../data/portfolioData';
import { ChevronRight, ArrowUpRight, Compass, ShieldCheck, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { DeploymentStatusBadge } from './common/DeploymentStatusBadge';
import { soundEngine } from '../utils/soundEngine';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Audio state with session storage memory
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('badal_welcome_volume');
      return stored ? parseFloat(stored) : 0.85;
    }
    return 0.85;
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('badal_welcome_muted') === 'true';
    }
    return false; // Default sound enabled
  });
  const [isAudioBlocked, setIsAudioBlocked] = useState<boolean>(false);
  const [isVideoError, setIsVideoError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Autoplay personal welcome video on mount: Attempt unmuted playback first
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    const shouldMute = isMuted;

    if (!shouldMute) {
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsMuted(false);
            setIsAudioBlocked(false);
          })
          .catch((err) => {
            console.info('Browser autoplay policy blocked unmuted video, falling back to muted autoplay:', err);
            // Autoplay blocked with sound: play muted and prompt visitor
            video.muted = true;
            setIsMuted(true);
            setIsAudioBlocked(true);
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          });
      }
    } else {
      video.muted = true;
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [volume, isMuted]);

  // Handle first user interaction anywhere on page to automatically unmute if blocked
  useEffect(() => {
    if (!isAudioBlocked) return;

    const handleFirstTap = () => {
      const video = videoRef.current;
      if (video && isAudioBlocked) {
        video.muted = false;
        video.volume = volume;
        video.play().then(() => {
          setIsMuted(false);
          setIsAudioBlocked(false);
          try {
            sessionStorage.setItem('badal_welcome_muted', 'false');
          } catch {
            // ignore
          }
        }).catch(() => {});
      }
      window.removeEventListener('pointerdown', handleFirstTap);
      window.removeEventListener('keydown', handleFirstTap);
    };

    window.addEventListener('pointerdown', handleFirstTap, { once: true });
    window.addEventListener('keydown', handleFirstTap, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstTap);
      window.removeEventListener('keydown', handleFirstTap);
    };
  }, [isAudioBlocked, volume]);

  const handleEnableAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = volume;
    video.play().then(() => {
      setIsMuted(false);
      setIsAudioBlocked(false);
      try {
        sessionStorage.setItem('badal_welcome_muted', 'false');
      } catch {
        // ignore
      }
    }).catch((err) => {
      console.warn('Audio unmute error:', err);
    });
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    setIsAudioBlocked(false);
    try {
      sessionStorage.setItem('badal_welcome_muted', nextMuted ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    const video = videoRef.current;
    if (video) {
      video.volume = newVol;
      if (newVol > 0 && video.muted) {
        video.muted = false;
        setIsMuted(false);
      } else if (newVol === 0) {
        video.muted = true;
        setIsMuted(true);
      }
    }
    try {
      sessionStorage.setItem('badal_welcome_volume', newVol.toString());
    } catch {
      // ignore
    }
  };

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
        soundEngine.playHover();
        setSelectedIndex((prev) => (prev + 1) % MENU_ITEMS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        soundEngine.playHover();
        setSelectedIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        soundEngine.playClick();
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
            <div className="absolute top-2 right-2 z-20 font-mono text-[9px] text-emerald-400/80 tracking-widest hidden sm:block">
              [WELCOME_FEED: ACTIVE] ┐
            </div>
            <div className="absolute bottom-6 left-2 z-20 font-mono text-[9px] text-slate-500 tracking-widest hidden sm:block">
              └ LOC // INDIA
            </div>
            <div className="absolute bottom-6 right-2 z-20 font-mono text-[9px] text-cyan-400/70 tracking-widest hidden sm:block">
              [STATUS: TRANSMITTING] ┘
            </div>

            {/* 3D Parallax Video Container */}
            <div
              className="relative z-10 w-full flex items-center justify-center transition-transform duration-200 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${mouseOffset.x * 4.5}deg) rotateX(${-mouseOffset.y * 4.5}deg) translateZ(6px)`,
              }}
            >
              {/* Personal Welcome Video with seamless backdrop integration & graceful image fallback */}
              {isVideoError ? (
                <img
                  src={profileData.heroImage || '/images/nameste-hi.png'}
                  alt="Badal Kumar Sahu"
                  className="h-[360px] sm:h-[440px] lg:h-[500px] xl:h-[540px] w-auto max-w-full object-contain filter contrast-[1.02] brightness-[1.01] select-none [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)] drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/media/profile/nameste-hi.png';
                  }}
                />
              ) : (
                /* 1. Video Frame with Compliant Fallback */
                <video
                  ref={videoRef}
                  src={`${import.meta.env.BASE_URL}video/welcome.mp4`}
                  poster={profileData.heroImage || '/images/nameste-hi.png'}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  loop
                  preload="auto"
                  onPlay={() => setIsPlaying(true)}
                  onEnded={() => {
                    // Continuous loop guarantee
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  onError={() => setIsVideoError(true)}
                  className="h-[360px] sm:h-[440px] lg:h-[500px] xl:h-[540px] w-auto max-w-full object-contain rounded-2xl filter contrast-[1.03] brightness-[1.01] select-none [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                />
              )}

              {/* 2. PROMINENT "ENABLE SOUND & START EXPERIENCE" OVERLAY IF BROWSER BLOCKED SOUND */}
              {isAudioBlocked && !isVideoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[3px] rounded-2xl z-30 transition-all p-4">
                  <button
                    type="button"
                    onClick={handleEnableAudio}
                    className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-mono text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-300 shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:shadow-[0_0_55px_rgba(16,185,129,0.95)] flex items-center gap-2.5 animate-bounce hover:animate-none cursor-pointer transform hover:scale-105"
                  >
                    <Volume2 className="w-5 h-5 text-slate-950 animate-pulse" />
                    <span>ENABLE SOUND &amp; START EXPERIENCE</span>
                  </button>
                </div>
              )}

              {/* 3. ACCESSIBLE AUDIO CONTROLS & VOLUME SLIDER HUD */}
              {!isVideoError && (
                <div className="absolute bottom-6 left-2 right-2 sm:left-4 sm:right-4 z-30 flex items-center justify-between gap-2 p-1.5 sm:p-2 rounded-xl bg-[#070b14]/90 backdrop-blur-md border border-white/10 shadow-xl">
                  {/* Left: Replay transmission */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play().catch(() => {});
                        setIsPlaying(true);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 font-mono text-[10px] tracking-wider transition-all cursor-pointer"
                    title="Replay Welcome Transmission"
                    aria-label="Replay Welcome Transmission"
                  >
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span className="hidden sm:inline">REPLAY</span>
                  </button>

                  {/* Center: Volume Slider */}
                  <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] text-slate-300 px-2">
                    <span className="text-slate-400 hidden md:inline">VOL:</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-14 sm:w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                      title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                      aria-label="Welcome video volume"
                    />
                    <span className="text-emerald-400 font-bold min-w-[30px] text-right">
                      {Math.round((isMuted ? 0 : volume) * 100)}%
                    </span>
                  </div>

                  {/* Right: Sound On / Off Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg border font-mono text-[10px] sm:text-xs tracking-wider transition-all cursor-pointer ${
                      !isMuted
                        ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'border-white/15 bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                    title={isMuted ? 'Unmute Video Audio' : 'Mute Video Audio'}
                    aria-label={isMuted ? 'Unmute Video Audio' : 'Mute Video Audio'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    )}
                    <span>{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
                  </button>
                </div>
              )}
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
                      soundEngine.playClick();
                      onSelectSection(item.id);
                    }}
                    onMouseEnter={() => {
                      setSelectedIndex(index);
                      soundEngine.playHover();
                    }}
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
