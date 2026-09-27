import { useState } from 'react';
import { certifications } from '../data/certifications';
import { Award, CheckCircle2, Clock, Filter } from 'lucide-react';

export function Certifications() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Cloud & AI', 'Data & Analytics', 'Consulting & Strategy', 'Foundations'];

  const filtered = certifications.filter((cert) => {
    if (activeCategory === 'ALL') return true;
    return cert.category === activeCategory;
  });

  return (
    <section id="certifications" className="py-24 relative tech-grid-bg border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              07 // CREDENTIALS & INDUSTRY VALIDATION
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              CERTIFICATIONS <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">&amp; SIMULATIONS</span>
            </h2>
          </div>

          {/* Category Filter */}
          <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-2">
            <span className="hidden sm:flex items-center gap-1 font-mono text-xs text-slate-500 mr-1">
              <Filter className="w-3.5 h-3.5" />
              FILTER:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 border ${
                  activeCategory === cat
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(0,255,135,0.2)]'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => {
            const isInProgress = cert.status === 'In Progress';

            return (
              <div
                key={cert.id}
                className="p-6 rounded-2xl border border-white/10 bg-[#080c16]/80 hover:border-emerald-500/30 hover:bg-[#0a0f1d] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card HUD Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider border border-white/10 bg-white/[0.04] text-slate-300">
                      {cert.category}
                    </span>

                    {isInProgress ? (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        IN PROGRESS
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        VERIFIED
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-display font-semibold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {cert.title}
                  </h3>

                  {/* Issuer */}
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-4">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{cert.issuer}</span>
                  </div>
                </div>

                {/* Bottom Verification Code */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>ID // {cert.badgeCode || 'CONFIRMED'}</span>
                  <span className="text-emerald-400 group-hover:underline cursor-default">AUTHENTICATED</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
