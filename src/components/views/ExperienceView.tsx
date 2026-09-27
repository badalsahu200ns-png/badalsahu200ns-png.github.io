import { useState } from 'react';
import { experienceData, profileData } from '../../data/portfolioData';
import { Building2, Calendar, MapPin, Sparkles, TrendingUp, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';

export function ExperienceView() {
  const [selectedId, setSelectedId] = useState<string>(experienceData.experiences[0]?.id || '');

  const activeExp = experienceData.experiences.find((e) => e.id === selectedId) || experienceData.experiences[0];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
      
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            03 // COMMERCIAL & TECHNICAL TRAJECTORY
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            PROFESSIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">EXPERIENCE</span>
          </h2>
        </div>
        <div className="mt-4 sm:mt-0 font-mono text-xs text-slate-400">
          SELECT COMPANY NODE TO EXPAND COMMERCIAL IMPACT
        </div>
      </div>

      {/* Verified Impact Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {experienceData.impactMetrics.map((stat) => (
          <div
            key={stat.id}
            className="p-4 rounded-xl border border-white/10 bg-[#080c16]/85 backdrop-blur-md flex flex-col justify-between"
          >
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-1">
              {stat.value}
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-white tracking-wider">
                {stat.label}
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                {stat.sublabel}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Vertical Timeline Left, Inspection Detail Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Vertical Timeline Rail (5 Columns) */}
        <div className="lg:col-span-5 relative space-y-4">
          
          {/* Strategic Real Photo Card: Career Time Machine / Trajectory Visual */}
          <div className="p-4 rounded-xl border border-white/10 bg-[#080c16]/80 overflow-hidden relative group">
            <div className="relative h-44 rounded-lg overflow-hidden border border-white/10 mb-3 bg-black/40">
              <img
                src={profileData.journeyImage || '/images/exp.png'}
                alt="Badal Kumar Sahu Career Evolution"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/media/journey/exp.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                <span>CAREER TIME-MACHINE</span>
                <span>COMMERCIAL REVENUE GROWTH</span>
              </div>
            </div>
            <p className="font-mono text-[11px] text-slate-400 leading-relaxed">
              From frontline commercial revenue expansion across PropTech &amp; BFSI to scalable cloud and AI products.
            </p>
          </div>

          <div className="relative">
            {/* Vertical timeline spine */}
            <div className="absolute left-4 sm:left-6 top-6 bottom-6 w-[2px] bg-gradient-to-b from-emerald-400 via-cyan-400 to-purple-500/30" />

            <div className="space-y-4 pl-10 sm:pl-14">
            {experienceData.experiences.map((exp, idx) => {
              const isSelected = exp.id === activeExp?.id;

              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedId(exp.id)}
                  className={`group relative p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-400 bg-[#0a0f1d] shadow-[0_0_25px_rgba(118,255,3,0.12)]'
                      : 'border-white/10 bg-[#080c16]/80 hover:border-white/20 hover:bg-[#0a0e1c]'
                  }`}
                >
                  {/* Timeline indicator node */}
                  <div
                    className={`absolute -left-10 sm:-left-14 top-5 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-all ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-400 text-black shadow-[0_0_12px_rgba(118,255,3,0.8)] scale-110'
                        : 'border-white/20 bg-[#070b13] text-slate-400 group-hover:border-slate-300'
                    }`}
                  >
                    0{idx + 1}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs text-emerald-400 font-semibold">
                      {exp.domain}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.period}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {exp.role}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-white">{exp.company}</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-slate-400">{exp.location}</span>
                  </div>

                  {exp.highlightMetric && (
                    <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{exp.highlightMetric}</span>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep-Dive Company Inspection Panel (7 Columns) */}
        {activeExp && (
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#080c16]/95 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header info */}
            <div className="pb-6 border-b border-white/[0.08] mb-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="font-mono text-[11px] text-emerald-400 tracking-wider uppercase">
                  ENTERPRISE RECORD // {activeExp.domain}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-slate-400 px-3 py-1 rounded bg-white/[0.03] border border-white/[0.08]">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {activeExp.period}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                {activeExp.role}
              </h3>

              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  {activeExp.company}
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeExp.location}
                </span>
              </div>
            </div>

            {/* Business Impact Box */}
            <div className="mb-6 p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] relative">
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>BUSINESS IMPACT &amp; COMMERCIAL METRICS</span>
              </div>
              <p className="font-mono text-sm text-emerald-100 leading-relaxed">
                {activeExp.businessImpact}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="mb-6">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                KEY RESPONSIBILITIES &amp; EXECUTION
              </span>
              <ul className="space-y-2.5">
                {activeExp.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed font-sans">
                    <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills & Domain */}
            <div className="pt-4 border-t border-white/[0.08]">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                SKILLS &amp; DOMAIN SPECIALIZATION
              </span>
              <div className="flex flex-wrap gap-2">
                {activeExp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg text-xs font-mono border border-white/10 bg-white/[0.03] text-slate-200 hover:border-emerald-400/40 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
