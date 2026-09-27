import { useState } from 'react';
import { educationData } from '../../data/portfolioData';
import { GraduationCap, Calendar, MapPin, BookOpen, CheckCircle2, Award } from 'lucide-react';

export function EducationView() {
  const [selectedId, setSelectedId] = useState<string>(educationData[0]?.id || '');

  const activeEdu = educationData.find((e) => e.id === selectedId) || educationData[0];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
      
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            05 // ACADEMIC PEDAGOGY &amp; FOUNDATIONS
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            EDUCATION &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">CREDENTIALS</span>
          </h2>
        </div>
        <div className="mt-4 sm:mt-0 font-mono text-xs text-slate-400">
          MULTIPLE ACCREDITED DEGREES // NO INVENTED DATES
        </div>
      </div>

      {/* Main Grid: Interactive Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List of Degrees (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider block mb-2">
            ACADEMIC MILESTONES ({educationData.length})
          </span>

          {educationData.map((item, idx) => {
            const isSelected = item.id === activeEdu?.id;
            const isPursuing = item.currentStatus.toLowerCase() === 'pursuing';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`group p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-400 bg-[#0a0f1d] shadow-[0_0_25px_rgba(118,255,3,0.1)]'
                    : 'border-white/10 bg-[#080c16]/80 hover:border-white/20 hover:bg-[#0a0e1c]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-emerald-400 font-semibold">
                    0{idx + 1} // DEGREE
                  </span>
                  {isPursuing ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      PURSUING
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-white/10 bg-white/[0.04] text-slate-400">
                      GRADUATED
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {item.degree}
                </h3>

                <div className="text-xs font-mono text-slate-300 mt-1">
                  {item.institution}
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-4 pt-3 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.dates}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Inspection Panel (7 Columns) */}
        {activeEdu && (
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#080c16]/95 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="pb-6 border-b border-white/[0.08] mb-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="font-mono text-[11px] text-emerald-400 tracking-wider uppercase">
                  ACADEMIC RECORD // {activeEdu.currentStatus.toUpperCase()}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-slate-300 px-3 py-1 rounded bg-white/[0.03] border border-white/[0.08]">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {activeEdu.dates}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                {activeEdu.degree}
              </h3>

              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-semibold">{activeEdu.institution}</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-slate-400">{activeEdu.location}</span>
              </div>
            </div>

            {/* Verified Academic Info */}
            <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04]">
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-semibold mb-1">
                <Award className="w-4 h-4" />
                <span>VERIFIED ACADEMIC INFORMATION</span>
              </div>
              <p className="font-mono text-xs sm:text-sm text-emerald-200">
                {activeEdu.verifiedAcademicInfo}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-2">
                CURRICULUM HIGHLIGHTS
              </span>
              <p className="font-mono text-sm text-slate-200 leading-relaxed p-4 rounded-xl border border-white/[0.06] bg-black/40">
                {activeEdu.description}
              </p>
            </div>

            {/* Relevant Subjects */}
            <div className="pt-4 border-t border-white/[0.08]">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                RELEVANT COURSEWORK &amp; SUBJECTS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeEdu.relevantSubjects.map((subj) => (
                  <div
                    key={subj}
                    className="p-3 rounded-lg border border-white/10 bg-white/[0.02] flex items-center gap-2 font-mono text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{subj}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
