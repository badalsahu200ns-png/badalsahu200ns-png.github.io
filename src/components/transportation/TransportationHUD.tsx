import { useState } from 'react';
import { FastForward, Radio, Navigation, Volume2, VolumeX, Shield, Gauge } from 'lucide-react';
import type { DestinationConfig } from './TransportationConfig';
import { soundEngine } from '../../utils/soundEngine';

interface TransportationHUDProps {
  config: DestinationConfig;
  progress: number; // 0 to 1
  isBoosting: boolean;
  onSetBoosting: (boosting: boolean) => void;
  onSkip: () => void;
}

export function TransportationHUD({
  config,
  progress,
  isBoosting,
  onSetBoosting,
  onSkip,
}: TransportationHUDProps) {
  const percent = Math.min(100, Math.round(progress * 100));
  const elapsedSec = (progress * 5.0).toFixed(1);
  const [isMuted, setIsMuted] = useState(() => soundEngine.getMuted());

  const handleToggleSound = () => {
    const next = soundEngine.toggleMute();
    setIsMuted(next);
  };

  // 4-Phase Cinematic Timeline Description matching user prompt specifications
  let phaseName = 'PHASE 01 // 3D VEHICLE & ENVIRONMENT REVEAL';
  let phaseDesc = 'Establishing 3D spatial coordinate mesh and dynamic illumination';
  if (progress >= 0.20 && progress < 0.50) {
    phaseName = 'PHASE 02 // VECTOR ACCELERATION & CRUISE';
    phaseDesc = 'Engaging full vector thrust and environmental parallax stream';
  } else if (progress >= 0.50 && progress < 0.80) {
    phaseName = 'PHASE 03 // CINEMATIC MOMENT & DYNAMIC PATH';
    phaseDesc = 'Executing high-speed camera sweep and landmark synchronization';
  } else if (progress >= 0.80) {
    phaseName = 'PHASE 04 // APPROACH & DESTINATION INSERTION';
    phaseDesc = 'Decelerating into arrival gate — preparing section reveal';
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* 1. TOP HEADER HUD */}
      <div className="flex items-center justify-between gap-4 pointer-events-auto">
        
        {/* Left: Vessel & Destination Telemetry */}
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded border font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-md"
              style={{
                borderColor: `${config.primaryColor}80`,
                backgroundColor: `${config.primaryColor}20`,
                color: config.primaryColor,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: config.primaryColor }}
              />
              [ {config.tabNumber} ] {config.vehicleName}
            </span>
            <span className="text-slate-400 font-mono text-xs hidden sm:inline">
              // {config.vehicleRole.toUpperCase()}
            </span>
          </div>

          <div className="font-mono text-[11px] text-slate-300 flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold" style={{ color: config.primaryColor }}>
              {config.destinationNode}
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">{config.speedLabel}</span>
          </div>
        </div>

        {/* Right: Controls (Sound, Boost & Skip) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleToggleSound}
            className={`px-3 py-2 rounded-xl border font-mono text-xs tracking-wider transition-all flex items-center gap-1.5 backdrop-blur-md shadow-lg cursor-pointer ${
              !isMuted
                ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                : 'border-white/15 bg-black/60 text-slate-400 hover:text-white'
            }`}
            title={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
            aria-label={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
            )}
            <span className="hidden md:inline">{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
          </button>

          <button
            onMouseDown={() => onSetBoosting(true)}
            onMouseUp={() => onSetBoosting(false)}
            onMouseLeave={() => onSetBoosting(false)}
            onTouchStart={() => onSetBoosting(true)}
            onTouchEnd={() => onSetBoosting(false)}
            className={`px-3.5 py-2 rounded-xl border font-mono text-xs tracking-wider transition-all flex items-center gap-2 backdrop-blur-md shadow-lg ${
              isBoosting
                ? 'border-cyan-400 bg-cyan-500/30 text-cyan-300 shadow-[0_0_25px_rgba(0,229,255,0.4)] scale-105'
                : 'border-white/15 bg-black/60 text-slate-300 hover:border-white/30 hover:bg-black/80'
            }`}
            title="Press and hold to accelerate transportation"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span className="font-semibold">{isBoosting ? 'THRUST BOOST ON' : 'HOLD TO BOOST'}</span>
          </button>

          <button
            onClick={onSkip}
            className="px-4 py-2 rounded-xl border border-white/20 bg-black/60 hover:border-white/40 hover:bg-black/80 text-white font-mono text-xs tracking-wider transition-all flex items-center gap-2 backdrop-blur-md shadow-lg group cursor-pointer"
            title="Skip transition sequence"
          >
            <span>SKIP TRANSIT</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-400 border border-white/15">
              ESC
            </kbd>
            <FastForward className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

      {/* 2. CENTER STORY BANNER (Subtle Narrative Cue) */}
      <div className="max-w-xl mx-auto text-center pointer-events-auto">
        <div className="p-3 sm:p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest uppercase mb-1" style={{ color: config.primaryColor }}>
            <Shield className="w-3.5 h-3.5" />
            <span>TRANSIT NARRATIVE // CHAPTER {config.tabNumber}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
            {config.story}
          </p>
        </div>
      </div>

      {/* 3. BOTTOM SCRUBBER & STATUS TELEMETRY */}
      <div className="max-w-2xl w-full mx-auto flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center justify-between font-mono text-[11px] text-slate-300">
          <span className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5" style={{ color: config.primaryColor }} />
            <span className="font-semibold" style={{ color: config.primaryColor }}>{phaseName}</span>
          </span>
          <span className="font-bold tracking-wider" style={{ color: config.primaryColor }}>
            {elapsedSec}s / 5.0s &bull; {percent}%
          </span>
        </div>

        {/* Progress bar track */}
        <div className="w-full h-2 rounded-full bg-black/80 overflow-hidden border border-white/15 backdrop-blur-md shadow-inner">
          <div
            className="h-full transition-all duration-100 rounded-full"
            style={{
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${config.primaryColor}, ${config.accentColor || config.primaryColor})`,
              boxShadow: `0 0 15px ${config.primaryColor}`,
            }}
          />
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span className="truncate max-w-[70%] text-slate-400">{phaseDesc}</span>
          <span className="text-slate-500 hidden sm:inline">USE MOUSE TO BANK CAMERA</span>
        </div>
      </div>

    </div>
  );
}

export default TransportationHUD;
