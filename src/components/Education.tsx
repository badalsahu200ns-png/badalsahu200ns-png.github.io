import { education } from '../data/education';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';

export function Education() {
  return (
    <section id="education" className="py-24 relative tech-grid-bg border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              08 // ACADEMIC FOUNDATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              EDUCATION &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">PEDAGOGY</span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-xs text-slate-400 max-w-sm">
            Rigorous dual foundation bridging computer applications & distributed systems with executive business management.
          </p>
        </div>

        {/* Education 3-Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {education.map((item) => {
            const isPursuing = item.status === 'Pursuing';

            return (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#080c16]/90 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    {isPursuing ? (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        PURSUING
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider border border-white/10 bg-white/[0.04] text-slate-400">
                        GRADUATED
                      </span>
                    )}
                  </div>

                  {/* Degree Name */}
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {item.degree}
                  </h3>

                  {/* Field */}
                  <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 mb-3">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.field}</span>
                  </div>

                  {/* Institution */}
                  <div className="text-sm font-semibold text-slate-200 mb-4">
                    {item.institution}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Timeline */}
                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.period}
                  </span>
                  <span className="text-[10px] text-slate-500">DEGREE RECOGNIZED</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
