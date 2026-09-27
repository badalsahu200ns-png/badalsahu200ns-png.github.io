import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface CinematicOpeningProps {
  onComplete: () => void;
}

export function CinematicOpening({ onComplete }: CinematicOpeningProps) {
  const [step, setStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Precise sequence according to target timing:
    // 0.0s - Black screen
    // 0.3s - BADAL // 001
    // 0.8s - Background reveal
    // 1.4s - BADAL KUMAR SAHU
    // 2.0s - Professional positioning
    // 2.5s - Main menu available
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 10;
      });
    }, 180);

    const t1 = setTimeout(() => setStep(2), 300);  // 0.3s: BADAL // 001
    const t2 = setTimeout(() => setStep(3), 800);  // 0.8s: Cinematic background reveal
    const t3 = setTimeout(() => setStep(4), 1400); // 1.4s: BADAL KUMAR SAHU
    const t4 = setTimeout(() => setStep(5), 2000); // 2.0s: Professional positioning
    const t5 = setTimeout(() => {
      onComplete();                                // 2.5s: Main menu available
    }, 2500);

    // Instant skip interaction via Esc, Enter, Space, or any key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearInterval(progressTimer);
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearInterval(progressTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-50 bg-[#05070a] flex flex-col items-center justify-center p-6 transition-opacity duration-700 select-none cursor-pointer ${
        step >= 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="max-w-md w-full flex flex-col items-center text-center">
        
        {/* Step 2 & 3: Identity & Loader */}
        <div className="w-12 h-12 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_30px_rgba(118,255,3,0.3)]">
          <Terminal className="w-6 h-6 animate-pulse" />
        </div>

        <div className="font-mono text-xs text-emerald-400 tracking-[0.3em] uppercase mb-2">
          INITIALIZING // SYSTEM_CORE
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-6">
          BADAL // 001
        </h1>

        {/* Progress Bar */}
        <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden mb-3 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full font-mono text-[10px] text-slate-500">
          <span>BOOT_PROTOCOL // READY</span>
          <span className="text-emerald-400">{progress}%</span>
        </div>

        <div className="mt-8 text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors">
          [ CLICK ANYWHERE OR PRESS ESC / ENTER TO SKIP ]
        </div>

      </div>
    </div>
  );
}
