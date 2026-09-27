import { useState, useEffect } from 'react';
import { profileData } from '../data/portfolioData';

interface CinematicBackgroundProps {
  opacity?: number;
  showScanlines?: boolean;
}

export function CinematicBackground({
  opacity = 0.55,
  showScanlines = true,
}: CinematicBackgroundProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const videoSrc = profileData.cinematic?.video || '/media/cinematic/badal-walking.mp4';
  const posterSrc = profileData.cinematic?.poster || '/media/cinematic/badal-walking-poster.webp';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05070a] select-none">
      {/* Video or Poster Fallback */}
      {!videoFailed && !prefersReducedMotion ? (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterSrc}
            onError={() => setVideoFailed(true)}
            className="w-full h-full object-cover object-[center_14%] sm:object-[center_16%] md:object-[center_18%] lg:object-[center_15%] filter brightness-[0.75] contrast-[1.1] transition-opacity duration-1000"
            style={{ opacity }}
          >
            <source src={videoSrc} type="video/mp4" />
            <source src="/video/WALKING VIDEO.mp4" type="video/mp4" />
          </video>
        </div>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center filter brightness-[0.55] transition-opacity duration-1000"
          style={{
            backgroundImage: `url('/images/badal.png'), url('${posterSrc}')`,
            opacity,
          }}
        />
      )}

      {/* Dark Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-[#05070a]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-transparent to-[#05070a]" />
      <div className="absolute inset-0 cinematic-vignette" />

      {/* Subtle Scanlines & Grid */}
      {showScanlines && <div className="absolute inset-0 cinematic-scanlines opacity-45" />}
      <div className="absolute inset-0 grid-background opacity-40" />

      {/* Ambient Radial Accent Aura */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl" />
    </div>
  );
}
