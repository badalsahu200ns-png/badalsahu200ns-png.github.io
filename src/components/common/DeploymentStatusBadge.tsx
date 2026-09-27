import { useState } from 'react';

interface DeploymentStatusBadgeProps {
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function DeploymentStatusBadge({ className = '', align = 'center' }: DeploymentStatusBadgeProps) {
  const [isLive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname.toLowerCase();
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.endsWith('.local') ||
      window.location.protocol === 'file:';

    return !isLocal;
  });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const label = isLive ? 'LIVE ONLINE' : 'LOCAL PREVIEW';
  const tooltipText = isLive
    ? "You're viewing the publicly deployed portfolio."
    : "You're viewing the development version on this computer.";

  const alignmentClasses =
    align === 'right'
      ? 'right-0 left-auto translate-x-0'
      : align === 'left'
      ? 'left-0 right-auto translate-x-0'
      : 'left-1/2 -translate-x-1/2';

  const arrowAlignmentClasses =
    align === 'right'
      ? 'right-4 left-auto translate-x-0'
      : align === 'left'
      ? 'left-4 right-auto translate-x-0'
      : 'left-1/2 -translate-x-1/2';

  return (
    <div
      className={`relative inline-flex items-center group cursor-pointer ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((prev) => !prev)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      role="status"
      aria-label={`${label}: ${tooltipText}`}
    >
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[10px] sm:text-xs tracking-wider border transition-colors ${
          isLive
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(118,255,3,0.2)]'
            : 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'
          }`}
        />
        <span className="font-bold">● {label}</span>
      </div>

      {/* Tooltip Popup on Hover/Focus */}
      <div
        className={`absolute top-full mt-2 px-3 py-2 rounded-lg border border-white/10 bg-[#080c16]/95 backdrop-blur-xl shadow-2xl z-50 whitespace-nowrap pointer-events-none transition-all duration-200 text-left ${alignmentClasses} ${
          showTooltip ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
        }`}
      >
        <div
          className={`font-mono text-[11px] font-bold ${
            isLive ? 'text-emerald-400' : 'text-amber-300'
          }`}
        >
          {label}
        </div>
        <div className="font-mono text-[10px] text-slate-300 mt-0.5">
          {tooltipText}
        </div>
        <div className={`absolute -top-1 w-2 h-2 rotate-45 border-t border-l border-white/10 bg-[#080c16] ${arrowAlignmentClasses}`} />
      </div>
    </div>
  );
}
