import { useState } from 'react';
import { skillsData } from '../../data/portfolioData';
import { CheckCircle2, Sparkles, Database, Cpu, Cloud, Compass, Code, TrendingUp, Layers, Box } from 'lucide-react';

export function CoreSkillsView() {
  const [selectedId, setSelectedId] = useState<string>(skillsData.coreExpertise[0]?.id || '');

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'business-analytics':
        return TrendingUp;
      case 'ai-strategy':
        return Compass;
      case 'generative-ai':
        return Cpu;
      case 'data-analytics':
        return Database;
      case 'product-intelligence':
        return Layers;
      case 'ai-products':
        return Box;
      case 'cloud-data-platforms':
        return Cloud;
      case 'software-development':
        return Code;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
      
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            07 // CORE CAPABILITY CLUSTERS &amp; SPECIALIZATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            CORE SKILLS &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">EXPERTISE</span>
          </h2>
        </div>
        <div className="mt-4 sm:mt-0 font-mono text-xs text-slate-400">
          CAPABILITY CLUSTERS // NO FAKE PERCENTAGES
        </div>
      </div>

      {/* 8 Categories Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {skillsData.coreExpertise.map((cat, idx) => {
          const Icon = getCategoryIcon(cat.id);
          const isSelected = cat.id === selectedId;

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedId(cat.id)}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'border-emerald-400 bg-[#0a0f1d] shadow-[0_0_25px_rgba(118,255,3,0.12)]'
                  : 'border-white/10 bg-[#080c16]/85 hover:border-white/20 hover:bg-[#0a0e1c]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    0{idx + 1} // DOMAIN
                  </span>
                </div>

                <h3 className="text-lg font-display font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {cat.category}
                </h3>

                <p className="text-xs font-mono text-slate-400 leading-relaxed mb-4">
                  {cat.tagline}
                </p>
              </div>

              {/* Capability Clusters */}
              <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
                {cat.clusters.map((cluster, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] font-mono text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cluster}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
