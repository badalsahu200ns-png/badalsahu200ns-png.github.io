import { useState, useEffect, useRef } from 'react';
import { Rocket, ArrowRight, UserCheck, FastForward } from 'lucide-react';

interface SolarSystemEntryProps {
  onComplete: (visitorName: string) => void;
}

const STORAGE_KEY = 'badal_visitor_name';

export function SolarSystemEntry({ onComplete }: SolarSystemEntryProps) {
  const [stage, setStage] = useState<'name_input' | 'flight' | 'arrival'>('name_input');
  const [visitorName, setVisitorName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || '';
    }
    return '';
  });
  const [inputVal, setInputVal] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || '';
    }
    return '';
  });
  const [hasSavedName] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    }
    return false;
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && hasSavedName) {
      onComplete(visitorName || 'EXPLORER');
    }
  }, [hasSavedName, onComplete, visitorName]);

  const handleStartFlight = (nameToUse: string) => {
    const finalName = nameToUse.trim() || 'EXPLORER';
    setVisitorName(finalName);
    try {
      localStorage.setItem(STORAGE_KEY, finalName);
    } catch {
      // ignore storage failure
    }
    setStage('flight');
  };

  const handleSkip = () => {
    const finalName = visitorName || inputVal.trim() || 'EXPLORER';
    onComplete(finalName);
  };

  // Keyboard controls: ESC to skip, Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Canvas animation for the solar system & rocket flight
  useEffect(() => {
    if (stage !== 'flight' && stage !== 'arrival') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars
    const stars: Array<{ x: number; y: number; r: number; alpha: number; speed: number }> = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.01,
      });
    }

    // Planetary Orbits
    const orbits = [
      { radius: 100, speed: 0.008, angle: 0, color: '#10b981', size: 5, label: 'DATA' },
      { radius: 160, speed: 0.006, angle: 1.5, color: '#00e5ff', size: 6, label: 'GEN AI' },
      { radius: 230, speed: 0.004, angle: 3.2, color: '#76ff03', size: 7, label: 'SOFTWARE' },
      { radius: 310, speed: 0.003, angle: 4.8, color: '#f59e0b', size: 8, label: 'CLOUD' },
      { radius: 400, speed: 0.002, angle: 2.1, color: '#a855f7', size: 6, label: 'AI PRODUCTS' },
    ];

    const startTime = performance.now();
    const flightDuration = 3800; // 3.8s total animation
    let arrivedTriggered = false;

    // Rocket trajectory: enters from top-left, curves through orbits, lands on center
    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / flightDuration, 1);

      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw subtle starry background
      stars.forEach((star) => {
        star.alpha += Math.sin(now * star.speed) * 0.01;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(0.9, star.alpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Solar System Orbits
      orbits.forEach((orbit, idx) => {
        // Orbit ring
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + idx * 0.02})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, orbit.radius, orbit.radius * 0.65, 0.25, 0, Math.PI * 2);
        ctx.stroke();

        // Planet
        orbit.angle += orbit.speed;
        const px = cx + Math.cos(orbit.angle) * orbit.radius;
        const py = cy + Math.sin(orbit.angle) * (orbit.radius * 0.65);

        // Glow
        const radGlow = ctx.createRadialGradient(px, py, 1, px, py, orbit.size * 2.5);
        radGlow.addColorStop(0, orbit.color);
        radGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(px, py, orbit.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = orbit.color;
        ctx.beginPath();
        ctx.arc(px, py, orbit.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Center Globe: BADAL // 001 CAREER WORLD
      const globeRadius = 38 + Math.sin(now * 0.003) * 2;
      const sunGradient = ctx.createRadialGradient(cx, cy, 5, cx, cy, globeRadius * 2.2);
      sunGradient.addColorStop(0, 'rgba(118, 255, 3, 0.95)');
      sunGradient.addColorStop(0.35, 'rgba(0, 229, 255, 0.6)');
      sunGradient.addColorStop(0.8, 'rgba(16, 185, 129, 0.15)');
      sunGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Inner globe core
      ctx.fillStyle = '#050a12';
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#76ff03';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Globe text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BADAL // 001', cx, cy - 6);
      ctx.fillStyle = '#76ff03';
      ctx.font = '7px monospace';
      ctx.fillText('CAREER WORLD', cx, cy + 8);

      // Rocket Flight Path Calculation
      // Start: top-left outside screen -> curve through orbits -> arrive at center globe
      // Ease out cubic
      const t = progress;
      const ease = 1 - Math.pow(1 - t, 3);

      const startX = cx - Math.min(width * 0.45, 420);
      const startY = cy - Math.min(height * 0.4, 320);
      const controlX = cx + 180 * (1 - t);
      const controlY = cy - 140 * (1 - t);

      // Quadratic bezier curve from start to center
      const currentX = (1 - ease) * (1 - ease) * startX + 2 * (1 - ease) * ease * controlX + ease * ease * cx;
      const currentY = (1 - ease) * (1 - ease) * startY + 2 * (1 - ease) * ease * controlY + ease * ease * cy;

      // Rocket angle pointing towards trajectory
      const nextT = Math.min(ease + 0.02, 1);
      const aheadX = (1 - nextT) * (1 - nextT) * startX + 2 * (1 - nextT) * nextT * controlX + nextT * nextT * cx;
      const aheadY = (1 - nextT) * (1 - nextT) * startY + 2 * (1 - nextT) * nextT * controlY + nextT * nextT * cy;
      const angle = Math.atan2(aheadY - currentY, aheadX - currentX);

      // Rocket engine particles trail
      if (progress < 0.94) {
        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.rotate(angle);

        // Rocket exhaust plume
        const flameGradient = ctx.createLinearGradient(0, 0, -28, 0);
        flameGradient.addColorStop(0, '#00e5ff');
        flameGradient.addColorStop(0.5, '#76ff03');
        flameGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.moveTo(-6, -3);
        ctx.lineTo(-24 - Math.random() * 8, 0);
        ctx.lineTo(-6, 3);
        ctx.closePath();
        ctx.fill();

        // Sleek Rocket Body (Futuristic Needle Shuttle)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(14, 0); // nose
        ctx.lineTo(-6, -5); // left wing
        ctx.lineTo(-4, -2);
        ctx.lineTo(-6, 0); // body
        ctx.lineTo(-4, 2);
        ctx.lineTo(-6, 5); // right wing
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      } else {
        // Landing touchdown ripple
        const pulseProgress = (progress - 0.94) / 0.06;
        const pulseR = globeRadius + pulseProgress * 45;
        ctx.strokeStyle = `rgba(118, 255, 3, ${1 - pulseProgress})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (progress >= 0.85 && !arrivedTriggered) {
        arrivedTriggered = true;
        setStage('arrival');
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        // Wait slightly on arrival welcome screen then transition
        setTimeout(() => {
          onComplete(visitorName || 'EXPLORER');
        }, 1600);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage, visitorName, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#05070a] flex items-center justify-center select-none overflow-hidden font-sans">
      
      {/* Flight & Space Canvas */}
      {(stage === 'flight' || stage === 'arrival') && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Top Controls: Skip Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:border-emerald-400/40 text-xs font-mono transition-all backdrop-blur-md"
        >
          <span>SKIP INTRO</span>
          <FastForward className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>

      {/* STAGE 1: IDENTIFY YOURSELF / VISITOR CREDENTIAL MODAL */}
      {stage === 'name_input' && (
        <div className="relative z-10 max-w-md w-full mx-4 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#080c16]/95 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          
          <div className="w-12 h-12 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_25px_rgba(118,255,3,0.25)]">
            <UserCheck className="w-6 h-6 animate-pulse" />
          </div>

          <div className="font-mono text-[11px] text-emerald-400 tracking-[0.25em] uppercase mb-1">
            IDENTIFY YOURSELF // VISITOR ACCESS
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight mb-2">
            What&apos;s your name?
          </h2>

          <p className="font-mono text-xs text-slate-400 mb-6 leading-relaxed">
            Personalize your mission telemetry as you enter the BADAL // 001 digital career world.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStartFlight(inputVal);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="visitor-name-input" className="sr-only">Your Name</label>
              <input
                id="visitor-name-input"
                type="text"
                autoFocus
                maxLength={30}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter your name (e.g. Rahul / Guest)"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 px-5 rounded-xl border border-emerald-400 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 hover:shadow-[0_0_20px_rgba(118,255,3,0.3)] transition-all font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 group"
              >
                <span>ENTER CAREER WORLD</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="py-3 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:border-white/20 transition-all font-mono text-xs tracking-wider"
              >
                SKIP
              </button>
            </div>
          </form>

          {hasSavedName && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] text-center">
              <span className="font-mono text-[11px] text-slate-400">
                Returning user detected: <span className="text-emerald-400 font-bold">{visitorName}</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* STAGE 2: FLIGHT TELEMETRY HUD */}
      {stage === 'flight' && (
        <div className="absolute bottom-8 inset-x-0 flex flex-col items-center justify-center text-center pointer-events-none z-10 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/30 bg-black/60 backdrop-blur-md font-mono text-xs text-emerald-300 tracking-widest uppercase mb-2 animate-pulse">
            <Rocket className="w-3.5 h-3.5 text-emerald-400" />
            <span>TRAVERSING ORBITAL TELEMETRY</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            APPROACHING BADAL // 001 CAREER WORLD // LANDING INITIATED
          </div>
        </div>
      )}

      {/* STAGE 3: ARRIVAL CELESTIAL TITLE */}
      {stage === 'arrival' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-6 pointer-events-none animate-in fade-in zoom-in-95 duration-500">
          <div className="max-w-xl mx-auto p-8 rounded-3xl border border-emerald-400/40 bg-black/85 backdrop-blur-2xl shadow-[0_0_50px_rgba(118,255,3,0.2)]">
            <div className="font-mono text-xs sm:text-sm text-emerald-400 tracking-[0.3em] uppercase mb-3">
              TELEMETRY SYNCHRONIZED
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-3">
              WELCOME, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{visitorName.toUpperCase()}</span>
            </h1>

            <div className="text-sm sm:text-base font-mono text-slate-300 tracking-widest uppercase">
              TO
            </div>

            <div className="text-xl sm:text-2xl font-display font-extrabold text-emerald-300 tracking-wider mt-1 mb-4">
              BADAL // 001 // CAREER WORLD
            </div>

            <div className="font-mono text-[11px] text-slate-400 pt-3 border-t border-white/10">
              [ ENTERING DIGITAL PROFESSIONAL OPERATING SYSTEM ]
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
