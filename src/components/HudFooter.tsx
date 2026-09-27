import { Terminal, CornerDownLeft, ArrowUpDown } from 'lucide-react';

interface HudFooterProps {
  currentSection: string | null;
}

export function HudFooter({ currentSection }: HudFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#05070a]/90 backdrop-blur-md border-t border-white/[0.08] px-4 sm:px-8 py-2.5 select-none no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between font-mono text-[11px] text-slate-400">
        
        {/* Left: Keyboard shortcuts */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300">
            <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/[0.04] text-[10px] text-emerald-400 font-bold">
              <ArrowUpDown className="w-3 h-3 inline" />
            </kbd>
            <span className="text-[10px] sm:text-xs">NAVIGATE</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/[0.04] text-[10px] text-emerald-400 font-bold">
              <CornerDownLeft className="w-3 h-3 inline" />
            </kbd>
            <span className="text-[10px] sm:text-xs">ENTER / SELECT</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/[0.04] text-[10px] text-cyan-400 font-bold">
              ESC
            </kbd>
            <span className="text-[10px] sm:text-xs">{currentSection ? 'ESC / BACK' : 'ESC / CLOSE'}</span>
          </div>
        </div>

        {/* Right: Telemetry / System ID */}
        <div className="hidden sm:flex items-center gap-3 text-slate-500">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>BADAL // OS_v2.0</span>
          <span className="text-slate-700">|</span>
          <span className="text-emerald-400/80">LATENCY 12ms</span>
        </div>

      </div>
    </footer>
  );
}
