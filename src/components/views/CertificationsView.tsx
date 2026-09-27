import { useState, useMemo } from 'react';
import { certificationsData } from '../../data/portfolioData';
import { Award, CheckCircle2, Clock, ExternalLink, Filter, ShieldCheck } from 'lucide-react';

export function CertificationsView() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const cats = new Set(certificationsData.map((c) => c.category));
    return ['ALL', ...Array.from(cats)];
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'ALL') return certificationsData;
    return certificationsData.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
      
      {/* Header HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            06 // CREDENTIALS &amp; SIMULATIONS GALLERY
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            INDUSTRY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">CERTIFICATIONS</span>
          </h2>
        </div>

        {/* Filter categories */}
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 font-mono text-xs text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            FILTER:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all border ${
                activeCategory === cat
                  ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 font-bold shadow-[0_0_12px_rgba(118,255,3,0.2)]'
                  : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cert) => {
          const isInProgress = cert.status === 'In Progress';

          return (
            <div
              key={cert.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#080c16]/90 hover:border-emerald-500/40 hover:bg-[#0a0f1d] transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Top Badge HUD */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider border border-white/10 bg-white/[0.04] text-slate-300">
                    {cert.category}
                  </span>

                  {isInProgress ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" />
                      IN PROGRESS
                    </span>
                  ) : cert.verificationUrl ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ISSUER VERIFIED
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      CREDENTIAL RECORD
                    </span>
                  )}
                </div>

                {/* Certification Name */}
                <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {cert.name}
                </h3>

                {/* Issuer */}
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-4">
                  <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">{cert.issuer}</span>
                </div>
              </div>

              {/* Bottom Card Footer with IDs and Verification Endpoints */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 text-[11px]">
                  {cert.credentialId ? (
                    <>ID: <span className="text-slate-300">{cert.credentialId}</span></>
                  ) : (
                    <span className="text-slate-400">Certificate Provided</span>
                  )}
                </span>

                {cert.verificationUrl ? (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>VERIFY ISSUER</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    Record Available
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
