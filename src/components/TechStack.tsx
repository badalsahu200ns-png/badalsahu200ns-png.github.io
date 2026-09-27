import { useState } from 'react';
import { skillCategories } from '../data/skills';
import { Database, Cpu, Cloud, Compass, Code, Check } from 'lucide-react';

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState<string>(skillCategories[0].id);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'data-analytics':
        return Database;
      case 'genai':
        return Cpu;
      case 'google-cloud':
        return Cloud;
      case 'product':
        return Compass;
      case 'development':
        return Code;
      default:
        return Database;
    }
  };

  const getCategoryTheme = (id: string) => {
    switch (id) {
      case 'data-analytics':
        return { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
      case 'genai':
        return { text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' };
      case 'google-cloud':
        return { text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' };
      case 'product':
        return { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
      case 'development':
        return { text: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/10' };
      default:
        return { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    }
  };

  return (
    <section id="stack" className="py-24 relative tech-grid-bg border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              05 // CAPABILITY MATRIX
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              TECHNICAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">STACK</span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-xs text-slate-400 max-w-sm">
            5 specialized capability domains configured for production enterprise data pipelines and autonomous GenAI systems.
          </p>
        </div>

        {/* 5 Domain Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {skillCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = activeCategory === cat.id;
            const theme = getCategoryTheme(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? `${theme.border} ${theme.bg} shadow-[0_0_20px_rgba(0,255,135,0.1)]`
                    : 'border-white/10 bg-[#080c16]/80 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${isSelected ? theme.text : 'text-slate-400'}`} />
                  <span className="font-mono text-[10px] text-slate-500">
                    {cat.skills.length} SKILLS
                  </span>
                </div>
                <div className={`font-mono text-xs font-bold tracking-wider ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Domain Detail Container */}
        {skillCategories.map((cat) => {
          if (cat.id !== activeCategory) return null;
          const theme = getCategoryTheme(cat.id);

          return (
            <div
              key={cat.id}
              className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-[#080c16]/90 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.08]">
                <div>
                  <span className="font-mono text-xs text-slate-500 tracking-wider">ACTIVE DOMAIN //</span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                    {cat.name}
                  </h3>
                </div>
                <p className="font-mono text-xs sm:text-sm text-slate-300 max-w-md">
                  {cat.tagline}
                </p>
              </div>

              {/* Skills Interactive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {cat.skills.map((skill) => (
                  <div
                    key={skill}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/30 transition-all duration-200 flex items-center justify-between group"
                  >
                    <span className="font-mono text-sm sm:text-base font-medium text-slate-200 group-hover:text-white">
                      {skill}
                    </span>
                    <span className={`w-6 h-6 rounded-full border ${theme.border} ${theme.bg} flex items-center justify-center ${theme.text}`}>
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
