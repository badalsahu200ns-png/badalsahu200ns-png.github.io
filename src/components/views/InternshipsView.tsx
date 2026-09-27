import { useState } from 'react';
import { internshipsData, profileData } from '../../data/portfolioData';
import { Building2, Calendar, MapPin, CheckCircle2, Award, Sparkles, ChevronRight, Cpu, Layers } from 'lucide-react';

export function InternshipsView() {
  const [selectedId, setSelectedId] = useState<string>(internshipsData[0]?.id || '');

  const activeInternship = internshipsData.find((i) => i.id === selectedId) || internshipsData[0];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
      
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            02 // ACTIVE MISSIONS &amp; PRACTICAL EXPOSURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            CURRENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">INTERNSHIPS</span>
          </h2>
        </div>
        <div className="mt-4 sm:mt-0 font-mono text-xs text-slate-400">
          SELECT MISSION TO INSPECT CLOUD FOUNDATIONS &amp; OUTCOMES
        </div>
      </div>

      {/* Main Grid: Interactive Timeline Left, Detailed Active Inspection Panel Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Timeline Nodes (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
            <span>ENGAGEMENTS ({internshipsData.length})</span>
            <span className="text-emerald-400">ACTIVE MISSIONS</span>
          </div>

          {internshipsData.map((item, idx) => {
            const isSelected = item.id === activeInternship?.id;
            const isOngoing = item.status?.includes('ONGOING') || item.status?.includes('IN PROGRESS') || item.period.toLowerCase().includes('present');

            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`group p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-400 bg-[#0a0f1d] shadow-[0_0_25px_rgba(118,255,3,0.12)]'
                    : 'border-white/10 bg-[#080c16]/80 hover:border-white/20 hover:bg-[#0a0e1c]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected
                          ? 'bg-emerald-400 text-black shadow-[0_0_10px_rgba(118,255,3,0.8)]'
                          : 'bg-white/[0.05] text-slate-400'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span className="font-mono text-xs text-emerald-400 font-semibold">
                      {item.domain}
                    </span>
                  </div>

                  {isOngoing && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-400 text-black font-bold uppercase tracking-wider">
                      ONGOING
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {item.role}
                </h3>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.organization}</span>
                </div>

                {item.platform && (
                  <div className="font-mono text-[10px] text-cyan-400 mt-1.5 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-cyan-400" />
                    <span>{item.platform}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-4 pt-3 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    {item.period}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Strategic Real Photo Card: Career Workstation Visual (CONSISTENT EXECUTION) */}
          <div className="p-4 rounded-xl border border-white/10 bg-[#080c16]/80 overflow-hidden relative group">
            <div className="relative h-44 rounded-lg overflow-hidden border border-white/10 mb-3 bg-black/40">
              <img
                src={profileData.careerImage || '/images/hi five.png'}
                alt="Badal Kumar Sahu Consistent Execution"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/media/career/hi-five.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-emerald-300">
                <span>CONSISTENT EXECUTION</span>
                <span>BADAL // 001</span>
              </div>
            </div>
            <p className="font-mono text-[11px] text-slate-400 leading-relaxed">
              Expanding beyond commercial data analysis into cloud architecture and autonomous agent engineering.
            </p>
          </div>
        </div>

        {/* Right Detail Inspection Panel (7 Columns) */}
        {activeInternship && (
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#080c16]/95 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header of Active Inspection */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-6 border-b border-white/[0.08] mb-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[11px] text-emerald-400 tracking-wider uppercase">
                    {activeInternship.id === 'aws-cloud-computing' ? '[ ONGOING ]' : 'MISSION SPECIFICATION //'}
                  </span>
                  {activeInternship.status && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase font-bold">
                      {activeInternship.status}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {activeInternship.role}
                </h3>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-300 mt-1">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-semibold">{activeInternship.organization}</span>
                  {activeInternship.platform && (
                    <>
                      <span className="text-slate-600">&bull;</span>
                      <span className="text-cyan-300">{activeInternship.platform}</span>
                    </>
                  )}
                </div>

                {activeInternship.program && (
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    Program: <span className="text-slate-200">{activeInternship.program}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-1.5 self-start font-mono text-xs">
                <span className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeInternship.period}</span>
                </span>
                {activeInternship.duration && (
                  <span className="text-[10px] text-slate-400">
                    Duration: {activeInternship.duration} ({activeInternship.mode || 'Virtual'})
                  </span>
                )}
              </div>
            </div>

            {/* Description Overview */}
            <div className="mb-6">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-2">
                MISSION OVERVIEW
              </span>
              <p className="font-mono text-sm text-slate-200 leading-relaxed p-4 rounded-xl border border-white/[0.06] bg-black/40">
                {activeInternship.description}
              </p>
            </div>

            {/* If CURRENTLY LEARNING exists, render dedicated section */}
            {activeInternship.currentlyLearning && (
              <div className="mb-6 p-5 rounded-xl border border-amber-500/30 bg-amber-500/[0.04]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                  <span className="font-mono text-xs text-amber-300 uppercase tracking-wider font-bold flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    CURRENTLY LEARNING // PRACTICAL EXPOSURE
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    BUILDING CLOUD FOUNDATIONS
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeInternship.currentlyLearning.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono border border-amber-500/20 bg-amber-500/10 text-amber-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-amber-500/20 font-mono text-[11px] text-slate-400">
                  Focus: Hands-on exploration of AWS compute, storage, networking, IAM security, database provisioning, and observability.
                </div>
              </div>
            )}

            {/* Responsibilities */}
            <div className="mb-6">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                PRACTICAL ACTIVITIES &amp; RESPONSIBILITIES
              </span>
              <ul className="space-y-2.5">
                {activeInternship.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed font-sans">
                    <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verified Outcomes */}
            {activeInternship.outcomes && (
              <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04]">
                <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-semibold mb-1">
                  <Award className="w-4 h-4" />
                  <span>VERIFIED OUTCOME //</span>
                </div>
                <p className="font-mono text-xs sm:text-sm text-emerald-200">
                  {activeInternship.outcomes}
                </p>
              </div>
            )}

            {/* Skills */}
            <div className="pt-4 border-t border-white/[0.08]">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                APPLIED TECHNOLOGIES
              </span>
              <div className="flex flex-wrap gap-2">
                {activeInternship.skills.map((skill) => (
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
