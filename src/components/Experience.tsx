import { useState } from 'react';
import { experiences } from '../data/experience';
import { Briefcase, Calendar, MapPin, Sparkles, Building2, ChevronRight } from 'lucide-react';

export function Experience() {
  const [selectedId, setSelectedId] = useState<string>(experiences[0].id);

  return (
    <section id="experience" className="py-24 relative tech-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              03 // CAREER TRAJECTORY
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              PROFESSIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">EXPERIENCE</span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-xs text-slate-400 max-w-sm">
            Progressive evolution from enterprise revenue leadership to advanced cloud data analytics & AI systems.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          
          {/* Vertical central/left timeline rail */}
          <div className="absolute left-4 sm:left-8 top-6 bottom-6 w-[2px] bg-gradient-to-b from-emerald-400 via-cyan-500/50 to-purple-500/20" />

          <div className="space-y-10 sm:space-y-12 pl-12 sm:pl-20">
            {experiences.map((exp, idx) => {
              const isSelected = selectedId === exp.id;
              const isPresent = exp.period.includes('Present');

              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedId(exp.id)}
                  className={`group relative rounded-xl border transition-all duration-300 cursor-pointer p-6 sm:p-8 ${
                    isSelected
                      ? 'border-emerald-500/50 bg-[#0a0f1d] shadow-[0_0_30px_rgba(0,255,135,0.08)]'
                      : 'border-white/10 bg-[#080c16]/70 hover:border-white/20 hover:bg-[#0a0e1c]'
                  }`}
                >
                  {/* Timeline node icon */}
                  <div
                    className={`absolute -left-12 sm:-left-20 top-7 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isPresent
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(0,255,135,0.6)]'
                        : isSelected
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                        : 'border-white/20 bg-[#070b13] text-slate-400 group-hover:border-slate-300'
                    }`}
                  >
                    {isPresent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    ) : (
                      <span className="font-mono text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Card Content Top Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          {exp.domain}
                        </span>
                        {exp.highlightMetric && (
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {exp.highlightMetric}
                          </span>
                        )}
                        {isPresent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-400 text-black font-bold">
                            CURRENT
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {exp.role}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-300 font-mono mt-1">
                        <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                          {exp.company}
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Period Date Tag */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.06] shrink-0 self-start lg:self-center">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Achievements bullet list */}
                  <ul className="space-y-2.5 my-4 text-sm text-slate-300 leading-relaxed">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skills tags row */}
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      CORE SKILLS:
                    </span>
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded text-xs font-mono text-slate-300 bg-white/[0.03] border border-white/[0.08] group-hover:border-white/20 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
