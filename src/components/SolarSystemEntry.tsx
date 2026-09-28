import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, FastForward, Shield, Radio, Terminal, AlertCircle } from 'lucide-react';
import { CinematicSpaceflightScene } from './3d/CinematicSpaceflightScene';
import { WebGLErrorBoundary } from './common/WebGLErrorBoundary';
import { GithubIcon } from './icons/GithubIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';

interface SolarSystemEntryProps {
  onComplete: (visitorName: string) => void;
}

const STORAGE_KEY = 'badal_visitor_name';

const CAPABILITIES = [
  'Business Analytics',
  'Generative AI',
  'Software Development',
  'Data Analytics',
  'AI Products',
  'Google Cloud',
];

// Sanitize pilot name input to prevent HTML/script injection
function sanitizePilotName(input: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>?/gm, '')
    .replace(/[<>'";`\\${}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
}

export function SolarSystemEntry({ onComplete }: SolarSystemEntryProps) {
  // Stages: auth -> identified -> travel -> arrival
  const [stage, setStage] = useState<'auth' | 'identified' | 'travel' | 'arrival'>('auth');
  const [visitorName, setVisitorName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY) || '';
    }
    return '';
  });
  const [inputVal, setInputVal] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY) || '';
    }
    return '';
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const [flightProgress, setFlightProgress] = useState<number>(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isWarpBoosting, setIsWarpBoosting] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const handleAuthorize = () => {
    const sanitized = sanitizePilotName(inputVal);
    if (!sanitized) {
      setValidationError('PILOT IDENTIFICATION REQUIRED');
      return;
    }
    setValidationError(null);
    setVisitorName(sanitized);
    try {
      localStorage.setItem(STORAGE_KEY, sanitized);
      sessionStorage.setItem(STORAGE_KEY, sanitized);
    } catch {
      // ignore
    }
    setStage('identified');
  };

  // Skip or immediately advance
  const handleSkip = useCallback(() => {
    const finalName = sanitizePilotName(visitorName || inputVal) || 'PILOT';
    try {
      localStorage.setItem(STORAGE_KEY, finalName);
      sessionStorage.setItem(STORAGE_KEY, finalName);
    } catch {
      // ignore
    }
    onComplete(finalName);
  }, [visitorName, inputVal, onComplete]);

  // Transition from 'identified' to 'travel' after brief confirmation
  useEffect(() => {
    if (stage === 'identified') {
      const timer = setTimeout(() => {
        setStage('travel');
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Global key listener for Enter and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'Enter') {
        if (stage === 'auth') {
          handleAuthorize();
        } else if (stage === 'identified') {
          setStage('travel');
        } else if (stage === 'arrival') {
          onComplete(visitorName || 'PILOT');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, inputVal, visitorName, handleSkip, onComplete]);

  // Track mouse coordinates for 3D camera & ship banking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  // Scroll wheel to accelerate travel
  const handleWheel = (e: React.WheelEvent) => {
    if (stage !== 'travel') return;
    setFlightProgress((prev) => Math.min(1, Math.max(0, prev + (e.deltaY > 0 ? 0.05 : -0.02))));
  };

  // Automated cinematic timeline flight progression
  useEffect(() => {
    if (stage !== 'travel') return;

    const baseDuration = 6800; // 6.8 seconds cinematic flight
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const delta = now - lastTime;
      lastTime = now;

      // Rate of progress (accelerated if warp boost active)
      const speedMultiplier = isWarpBoosting ? 2.6 : 1.0;
      const increment = (delta / baseDuration) * speedMultiplier;

      setFlightProgress((prev) => {
        const next = prev + increment;
        if (next >= 0.95) {
          setStage('arrival');
        }
        if (next >= 1.0) {
          return 1.0;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stage, isWarpBoosting]);

  // Flight phase label calculation
  const getPhaseTelemetry = () => {
    if (flightProgress < 0.22) return { code: 'PHASE 01 // ORBITAL TRAVEL', status: 'FIRE PROPULSION ENGAGED · ORBIT ESCAPE' };
    if (flightProgress < 0.72) return { code: 'PHASE 02 // WARP CORRIDOR', status: 'HYPERSPACE DRIFT LOCKED · TRANSIT ACTIVE' };
    if (flightProgress < 0.92) return { code: 'PHASE 03 // DESTINATION DETECTED', status: 'APPROACHING BADAL // 001 CAREER WORLD' };
    return { code: 'PHASE 04 // ORBITAL INSERTION COMPLETE', status: 'STATION DOCKING SYNCHRONIZED · READY' };
  };

  const telemetry = getPhaseTelemetry();

  // Progress for the 3D scene: idle at 0.04 during auth/identified, then tracks flightProgress
  const sceneProgress = stage === 'auth' || stage === 'identified' ? 0.04 : flightProgress;

  return (
    <div
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      className="fixed inset-0 z-50 overflow-hidden bg-[#020408] text-white select-none font-sans"
    >
      {/* 1. 3D Background Spacecraft Flight & Universe */}
      <WebGLErrorBoundary
        fallback={
          <div className="absolute inset-0 bg-gradient-to-b from-[#020408] via-[#050c18] to-[#020408] flex items-center justify-center font-mono text-emerald-400">
            [3D ENGINE FALLBACK // TRANSIT ACTIVE]
          </div>
        }
      >
        <CinematicSpaceflightScene
          progress={sceneProgress}
          mouseOffset={mouseOffset}
          reducedMotion={prefersReducedMotion}
        />
      </WebGLErrorBoundary>

      {/* 2. Top Sovereign Command HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#020408]/90 via-[#020408]/40 to-transparent pointer-events-none">
        
        {/* Left: Vessel Telemetry */}
        <div className="flex flex-col gap-1 pointer-events-auto">
          <div className="inline-flex items-center gap-2">
            <span className="px-2.5 py-1 rounded border border-emerald-500/50 bg-emerald-500/15 text-emerald-400 font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              BADAL // 001
            </span>
            <span className="text-slate-400 font-mono text-xs hidden sm:inline">
              // CAREER WORLD EXPEDITION
            </span>
          </div>
          {stage === 'travel' && (
            <div className="font-mono text-[10px] text-slate-400 flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">{telemetry.code}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 hidden sm:inline">{telemetry.status}</span>
            </div>
          )}
        </div>

        {/* Right: Controls & Skip Action */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {stage === 'travel' && (
            <button
              onMouseDown={() => setIsWarpBoosting(true)}
              onMouseUp={() => setIsWarpBoosting(false)}
              onMouseLeave={() => setIsWarpBoosting(false)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs tracking-wider transition-all flex items-center gap-1.5 ${
                isWarpBoosting
                  ? 'border-cyan-400 bg-cyan-500/25 text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                  : 'border-white/15 bg-white/[0.04] text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300'
              }`}
              title="Hold to accelerate travel"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>{isWarpBoosting ? 'WARP BOOST ON' : 'HOLD TO BOOST'}</span>
            </button>
          )}

          <button
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-lg border border-white/20 bg-white/[0.04] hover:border-emerald-400/60 hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs tracking-wider transition-all flex items-center gap-1.5"
            title="Skip directly to portfolio"
          >
            <span>SKIP (ESC)</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. STEP 01: PILOT AUTHORIZATION PROTOCOL (Spacecraft Console) */}
      {stage === 'auth' && (
        <div className="relative z-40 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-[#070b14]/90 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] relative overflow-hidden">
            
            {/* Ambient Tech Glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

            {/* Console HUD Corner Brackets */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400/50">┌─ [SYS_AUTH]</div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400/50">[CONSOLE_V1] ─┐</div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-600">└─ [ORBITAL]</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-600">[SEC_OK] ─┘</div>

            <div className="relative z-10 flex flex-col text-left">
              
              {/* Header Status */}
              <div className="inline-flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs text-emerald-400 tracking-widest font-semibold uppercase">
                  PILOT AUTHORIZATION PROTOCOL
                </span>
              </div>

              {/* Title & Brand */}
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase tracking-tight text-white mb-1">
                IDENTIFY YOURSELF
              </h1>
              
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400/80 mb-4">
                <Terminal className="w-3.5 h-3.5" />
                <span>DESTINATION: BADAL // 001 CAREER WORLD</span>
              </div>

              <p className="text-xs text-slate-300 font-mono leading-relaxed mb-6 border-l-2 border-emerald-400/80 pl-3 bg-white/[0.02] py-1.5">
                Identify yourself to initialize orbital transit and personalize your arrival at Badal&apos;s Career World.
              </p>

              {/* Pilot Name Input Console Form */}
              <div className="mb-4">
                <label
                  htmlFor="pilot-name"
                  className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-2"
                >
                  Enter Pilot Call Sign / Name:
                </label>
                <div className="relative">
                  <input
                    id="pilot-name"
                    type="text"
                    value={inputVal}
                    onChange={(e) => {
                      setInputVal(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="Enter your name"
                    maxLength={24}
                    className="w-full px-4 py-3.5 rounded-lg border border-emerald-500/40 bg-black/75 text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all uppercase tracking-wider"
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-slate-500 pointer-events-none">
                    [ENTER]
                  </div>
                </div>

                {/* HUD Validation Alert */}
                {validationError && (
                  <div className="mt-2.5 flex items-center gap-2 text-amber-400 bg-amber-950/40 border border-amber-500/40 px-3 py-1.5 rounded-md font-mono text-xs tracking-wider animate-pulse">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={handleAuthorize}
                  className="w-full py-3.5 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 group hover:shadow-[0_0_35px_rgba(16,185,129,0.6)]"
                >
                  <span>AUTHORIZE PILOT</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={handleSkip}
                  className="w-full py-2.5 px-4 rounded-lg border border-white/10 hover:border-white/30 text-slate-400 hover:text-white font-mono text-xs tracking-wider transition-colors"
                >
                  DIRECT ORBITAL INSERTION (SKIP)
                </button>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.08] text-center font-mono text-[10px] text-slate-500">
                SOVEREIGN COMMAND WORLD // BUSINESS · DATA · AI · SOFTWARE
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. STEP 02: PILOT IDENTIFIED (Cinematic HUD Confirmation) */}
      {stage === 'identified' && (
        <div className="relative z-40 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl border border-emerald-400/50 bg-[#070b14]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.25)] relative overflow-hidden animate-fade-in">
            
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              PILOT IDENTIFIED
            </div>

            <div className="font-mono text-xs text-slate-300 space-y-2 mb-6 bg-black/60 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between">
                <span className="text-slate-400">PILOT</span>
                <span className="text-white font-bold tracking-wider">{visitorName.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DESTINATION</span>
                <span className="text-emerald-400 font-bold">BADAL // 001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">STATUS</span>
                <span className="text-cyan-400 font-semibold">VERIFIED</span>
              </div>
            </div>

            <div className="text-center font-mono text-xs text-emerald-300 animate-pulse">
              INITIATING ORBITAL TRAVEL SEQUENCE...
            </div>
          </div>
        </div>
      )}

      {/* 5. Flight Progress Scrubber (Bottom HUD during flight) */}
      {stage === 'travel' && (
        <div className="absolute bottom-6 left-6 right-6 z-30 flex flex-col gap-2 max-w-xl mx-auto pointer-events-auto">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              DESTINATION: BADAL // 001 CAREER WORLD
            </span>
            <span>{Math.round(flightProgress * 100)}% COMPLETE</span>
          </div>

          {/* Progress Track */}
          <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-300 transition-all duration-150 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${flightProgress * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[9px] text-slate-500">
            <span>PILOT: {visitorName.toUpperCase()}</span>
            <span className="hidden sm:inline">USE MOUSE TO PILOT · SCROLL TO ACCELERATE</span>
          </div>
        </div>
      )}

      {/* 6. STEP 04 - 07: CLEAN CINEMATIC HERO COMPOSITION */}
      {stage === 'arrival' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-gradient-to-b from-[#020408]/80 via-transparent to-[#020408]/90 pointer-events-none">
          
          {/* Top Left Expedition HUD Status */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-50 pointer-events-auto flex items-center gap-2">
            <span className="px-2.5 py-1 rounded border border-emerald-500/50 bg-emerald-500/15 text-emerald-400 font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              BADAL // 001
            </span>
            <span className="text-slate-400 font-mono text-xs">
              // CAREER WORLD EXPEDITION
            </span>
          </div>

          {/* Central Hero Stage (Text Legibility Frame) */}
          <div className="max-w-2xl w-full text-center flex flex-col items-center pointer-events-auto select-none p-6 sm:p-10 rounded-3xl bg-[#040812]/85 backdrop-blur-md border border-white/[0.08] shadow-[0_25px_80px_rgba(0,0,0,0.9)] animate-fade-in my-auto">
            
            {/* 1. Large Prominent Personalized Welcome */}
            <div className="mb-1">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold uppercase tracking-tight text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]">
                WELCOME {visitorName.toUpperCase()}
              </h2>
            </div>

            {/* 2. Centered "TO" */}
            <div className="my-2">
              <span className="font-mono text-base sm:text-lg text-cyan-400 font-bold uppercase tracking-[0.35em] opacity-90 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                TO
              </span>
            </div>

            {/* 3. Main Large Central Branding */}
            <div className="mb-5">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black uppercase tracking-tight text-white leading-none">
                BADAL // 001
              </h1>
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 uppercase tracking-widest mt-1 drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                CAREER WORLD
              </h3>
            </div>

            {/* 4. Supporting Tagline */}
            <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-200 max-w-xl mx-auto leading-relaxed mb-6 font-mono">
              Building at the intersection of Business, Data, AI &amp; Software.
            </p>

            {/* 5. Core Capability Pills (2 Clean Rows of 3) */}
            <div className="flex flex-col gap-2 max-w-xl w-full mb-8">
              {/* Row 1 */}
              <div className="flex flex-wrap justify-center gap-2">
                {CAPABILITIES.slice(0, 3).map((cap) => (
                  <span
                    key={cap}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 font-mono text-xs tracking-wider"
                  >
                    {cap}
                  </span>
                ))}
              </div>
              {/* Row 2 */}
              <div className="flex flex-wrap justify-center gap-2">
                {CAPABILITIES.slice(3, 6).map((cap) => (
                  <span
                    key={cap}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 font-mono text-xs tracking-wider"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Primary Action Button: Enter Career World */}
            <button
              onClick={() => onComplete(visitorName || 'PILOT')}
              className="px-8 sm:px-10 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-sm sm:text-base font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_35px_rgba(16,185,129,0.55)] hover:shadow-[0_0_55px_rgba(16,185,129,0.85)] flex items-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
            >
              <span>ENTER CAREER WORLD &gt;</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* 7. Journey Message */}
            <p className="text-xs sm:text-sm text-slate-300/90 font-mono text-center max-w-xl mx-auto mt-4 mb-4 leading-relaxed tracking-wide">
              How was your journey to reach BADAL // 001 Career World? Have a nice day ahead.
            </p>

            {/* 8. Social Profile Links: LinkedIn (left) & GitHub (right) */}
            <div className="flex items-center justify-center gap-5 sm:gap-8 mb-4">
              <a
                href="https://www.linkedin.com/in/badalsahu200ns"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 bg-white/[0.04] hover:border-cyan-400/70 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 font-mono text-xs tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer group"
                title="Open Badal's LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <span className="font-semibold">LinkedIn</span>
              </a>

              <a
                href="https://github.com/badalsahu200ns-png"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 bg-white/[0.04] hover:border-emerald-400/70 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-300 font-mono text-xs tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer group"
                title="Open Badal's GitHub Profile"
              >
                <GithubIcon className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                <span className="font-semibold">GitHub</span>
              </a>
            </div>

            {/* 9. Skip & Accessibility Advance Prompt */}
            <p className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest">
              PRESS ESCAPE OR ENTER TO ADVANCE IMMEDIATELY
            </p>

          </div>
        </div>
      )}
    </div>
  );
}

export default SolarSystemEntry;
