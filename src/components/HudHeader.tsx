import { useState, useEffect } from 'react';
import { profileData } from '../data/portfolioData';
import { ArrowLeft, FileText, Activity } from 'lucide-react';
import { DeploymentStatusBadge } from './common/DeploymentStatusBadge';

interface HudHeaderProps {
  currentSection: string | null;
  onBackToMenu: () => void;
  onResumeClick: () => void;
}

export function HudHeader({ currentSection, onBackToMenu, onResumeClick }: HudHeaderProps) {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#05070a]/85 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5 select-none no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity or Back Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          {currentSection ? (
            <button
              onClick={onBackToMenu}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs tracking-wider transition-all duration-200"
              aria-label="Return to Main Menu"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>MAIN MENU</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.2 bg-black/50 border border-white/20 rounded text-[10px] text-slate-400">
                ESC
              </kbd>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center font-mono text-emerald-400 font-bold text-sm tracking-wider">
                B
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-sm tracking-[0.2em] font-semibold text-white flex items-center gap-1.5">
                  BADAL // 001
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider hidden sm:inline">
                  PROFESSIONAL OPERATING SYSTEM
                </span>
              </div>
            </div>
          )}

          {/* Section Breadcrumb if in a section */}
          {currentSection && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-600">//</span>
              <span className="text-emerald-400 font-bold tracking-wider uppercase">
                {currentSection.replace('-', ' ')}
              </span>
            </div>
          )}
        </div>

        {/* Center: Live Timezone & Telemetry */}
        <div className="hidden lg:flex items-center gap-4 font-mono text-xs text-slate-400 border border-white/[0.06] bg-black/40 px-3.5 py-1.5 rounded-full">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold">STATUS: ONLINE</span>
          </div>
          <span className="text-slate-600">&bull;</span>
          <span>IST: {timeString || 'UTC+5:30'}</span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">{profileData.workMode}</span>
        </div>

        {/* Right: Deployment Status & Resume Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <DeploymentStatusBadge align="right" />
          <button
            onClick={onResumeClick}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/[0.08] hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs tracking-wider transition-all duration-200 hover:shadow-[0_0_15px_rgba(118,255,3,0.25)]"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>RESUME</span>
          </button>
        </div>

      </div>
    </header>
  );
}
