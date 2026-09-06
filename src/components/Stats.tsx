import { useEffect, useRef, useState } from 'react';
import { impactStats } from '../data/experience';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import { Award, Zap } from 'lucide-react';

export function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<number[]>(impactStats.map(() => 0));

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCounts(impactStats.map(s => s.value));
      return;
    }

    const ctx = gsap.context(() => {
      // Create scrollTrigger for counting up
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          impactStats.forEach((stat, index) => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: stat.value,
              duration: 1.8 + index * 0.15,
              ease: 'power2.out',
              onUpdate: () => {
                setCounts(prev => {
                  const updated = [...prev];
                  updated[index] = Math.round(obj.val);
                  return updated;
                });
              }
            });
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="impact"
      ref={containerRef}
      className="py-16 relative border-y border-white/[0.08] bg-[#070b12]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header label */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>02 // QUANTIFIABLE COMMERCIAL & OPERATIONAL IMPACT</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
            <Award className="w-3 h-3 text-slate-400" />
            <span>METRICS // VERIFIED TRACK RECORD</span>
          </div>
        </div>

        {/* 5 Stats Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {impactStats.map((stat, idx) => (
            <div
              key={stat.id}
              className="flex flex-col p-5 rounded-lg border border-white/[0.06] bg-white/[0.015] hover:border-emerald-500/30 transition-all duration-300 relative group"
            >
              <div className="flex items-baseline gap-0.5">
                <span className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  {counts[idx]}
                </span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-emerald-400">
                  {stat.suffix}
                </span>
              </div>

              <div className="mt-3 font-display font-semibold text-sm sm:text-base text-slate-200">
                {stat.label}
              </div>

              <div className="mt-1 text-xs text-slate-400 font-mono">
                {stat.sublabel}
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>METRIC #{idx + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 group-hover:bg-emerald-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
