import { useState, useMemo } from 'react';
import {
  certificationsDataList,
  CERTIFICATION_CATEGORIES,
} from '../data/certifications';
import type {
  CertificationCategory,
  CertificationRecord,
} from '../data/certifications';
import {
  Award,
  ExternalLink,
  Filter,
  Search,
  ShieldCheck,
  X,
  FileText,
} from 'lucide-react';

export function Certifications() {
  const [activeCategory, setActiveCategory] = useState<CertificationCategory>('All Credentials');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Credentials': certificationsDataList.length,
    };
    CERTIFICATION_CATEGORIES.forEach((cat) => {
      if (cat === 'All Credentials') return;
      counts[cat] = certificationsDataList.filter((c) => c.categories.includes(cat)).length;
    });
    return counts;
  }, []);

  // Filtered credentials list
  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return certificationsDataList.filter((cert: CertificationRecord) => {
      // 1. Category Filter
      const matchesCategory =
        activeCategory === 'All Credentials' || cert.categories.includes(activeCategory);

      if (!matchesCategory) return false;

      // 2. Search Query Filter (Title, Issuer, Credential ID)
      if (!query) return true;

      const inTitle = cert.title.toLowerCase().includes(query);
      const inIssuer = cert.issuer.toLowerCase().includes(query);
      const inId = cert.credentialId ? cert.credentialId.toLowerCase().includes(query) : false;

      return inTitle || inIssuer || inId;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="certifications" className="py-24 relative tech-grid-bg border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-slate-100">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              07 // CREDENTIALS &amp; SIMULATIONS REGISTRY
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              CERTIFICATIONS{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
                &amp; SIMULATIONS
              </span>
            </h2>
            <p className="mt-2 font-sans text-sm sm:text-base text-slate-300 max-w-2xl">
              Registry of 33 verified industry credentials, consulting simulations, cloud computing badges, and generative AI accreditations.
            </p>
          </div>

          {/* Records Counter */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#080d1a]/80 backdrop-blur-md shadow-inner flex items-center gap-3 font-mono text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">RECORDS: </span>
              <span className="text-emerald-300 font-bold">{filtered.length}</span>
              <span className="text-slate-500"> / {certificationsDataList.length}</span>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by credential title, issuer, or credential ID..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/10 bg-[#080d1a]/90 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 rounded-xl text-xs font-mono text-cyan-300 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
            >
              Reset Search
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 mr-1 select-none">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            FILTER:
          </span>
          {CERTIFICATION_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] ?? 0;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 border flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-emerald-400/20 text-emerald-200 font-bold' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => {
            const isPdf = cert.url.endsWith('.pdf');

            return (
              <div
                key={cert.id}
                className="p-6 rounded-2xl border border-white/10 bg-[#080d1a]/90 backdrop-blur-md hover:border-cyan-400/50 hover:bg-[#0c1324] transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-[0_10px_30px_rgba(0,229,255,0.08)] relative"
              >
                <div>
                  {/* Top Badge HUD: Category & Status */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[65%]">
                      {cert.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border border-white/10 bg-white/[0.04] text-slate-300"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 flex items-center gap-1">
                      {isPdf ? (
                        <FileText className="w-3 h-3 text-cyan-400" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      )}
                      {cert.statusLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-display font-semibold text-white group-hover:text-cyan-300 transition-colors mb-2 leading-snug">
                    {cert.title}
                  </h3>

                  {/* Issuer */}
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-300 mb-4">
                    <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-semibold text-slate-200">{cert.issuer}</span>
                  </div>
                </div>

                {/* Bottom Verification & Link */}
                <div className="pt-4 border-t border-white/[0.08] mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 text-[11px]">CREDENTIAL ID:</span>
                    {cert.credentialId ? (
                      <span className="text-cyan-300 font-bold text-[11px] select-all bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/5">
                        {cert.credentialId}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px] italic">Credential ID not provided</span>
                    )}
                  </div>

                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 group/btn shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    aria-label={`Visit verified credential for ${cert.title}`}
                  >
                    <span>VISIT CREDENTIAL</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default Certifications;
