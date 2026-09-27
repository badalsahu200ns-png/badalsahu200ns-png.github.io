import { useEffect } from 'react';
import {
  profileData,
  internshipsData,
  experienceData,
  educationData,
  certificationsData,
  curatedProjectsData
} from '../data/portfolioData';
import { X, Download, Mail, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const originalTitle = document.title;
    document.title = 'Badal_Kumar_Sahu_Resume';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#090d18] border border-white/20 rounded-2xl p-6 sm:p-10 shadow-2xl overflow-y-auto printable-resume text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                {profileData.name}
              </h3>
              <p className="font-mono text-xs text-emerald-400">
                DIGITAL RESUME SPECIFICATION // {profileData.identityCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(118,255,3,0.3)]"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD DIGITAL RESUME</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-white/10 hover:border-white/30 text-slate-400 hover:text-white bg-white/[0.03] transition-colors"
              aria-label="Close Resume Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document Container */}
        <div className="space-y-6 font-sans">
          
          {/* Header Block */}
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight uppercase">
              {profileData.name}
            </h1>
            <p className="text-sm sm:text-base font-mono font-semibold text-emerald-400 mt-1">
              {profileData.headline}
            </p>

            {/* Contact Endpoints & Work Mode */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 font-mono text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                {profileData.email}
              </span>
              <span className="text-slate-600">&bull;</span>
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                LinkedIn
              </a>
              <span className="text-slate-600">&bull;</span>
              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-purple-400 hover:underline"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                GitHub
              </a>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-200 font-semibold">{profileData.workMode}</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-2">
              EXECUTIVE PROFILE SUMMARY
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
              {profileData.summary}
            </p>
          </div>

          {/* Core Technical & Strategic Skills */}
          <div>
            <h2 className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-2">
              SKILLS &amp; DOMAIN SPECIALIZATION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                <span className="text-white font-bold block mb-1">Data &amp; Business Intelligence:</span>
                <span className="text-slate-300">SQL, Google BigQuery, Power BI, Tableau, Advanced Excel, Python (Pandas, Matplotlib), EDA, KPI Dashboards</span>
              </div>
              <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                <span className="text-white font-bold block mb-1">AI, GenAI &amp; Cloud Platforms:</span>
                <span className="text-slate-300">Gemini LLMs, Prompt Engineering, RAG Vector Search, AI Agents, Google Cloud, Cloud Run, Firestore, Streamlit</span>
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div>
            <h2 className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-3">
              PROFESSIONAL EXPERIENCE (5+ YEARS)
            </h2>
            <div className="space-y-4">
              {experienceData.experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <strong className="text-white text-sm">{exp.role}</strong>
                      <span className="text-slate-500">//</span>
                      <span className="text-emerald-400 font-semibold">{exp.company}</span>
                    </div>
                    <span className="text-slate-400">{exp.period} | {exp.location}</span>
                  </div>

                  <p className="text-xs font-mono text-emerald-300 mb-2">
                    &bull; <strong>Impact:</strong> {exp.businessImpact}
                  </p>

                  <ul className="space-y-1 text-xs text-slate-300">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400">&bull;</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Current Internships */}
          <div>
            <h2 className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-3">
              INTERNSHIPS &amp; ACTIVE ANALYTICS PROGRAMS
            </h2>
            <div className="space-y-3">
              {internshipsData.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1 font-mono text-xs">
                    <div>
                      <strong className="text-white">{item.role}</strong>
                      <span className="text-slate-500"> — </span>
                      <span className="text-emerald-400">{item.organization}</span>
                    </div>
                    <span className="text-slate-400">{item.period}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 mb-2">
                    {item.description}
                  </p>
                  {item.outcomes && (
                    <p className="text-xs font-mono text-emerald-300">
                      &bull; <strong>Outcome:</strong> {item.outcomes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Featured Deployed Projects */}
          <div>
            <h2 className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-3">
              FEATURED DEPLOYED AI &amp; ANALYTICS SYSTEMS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {curatedProjectsData.slice(0, 4).map((p) => (
                <div key={p.repo} className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between font-mono text-xs mb-1">
                    <strong className="text-white">{p.displayTitle.split('—')[0].trim()}</strong>
                    <span className="text-emerald-400 text-[10px]">{p.category}</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 leading-relaxed mb-2">
                    {p.customDescription}
                  </p>
                  <div className="text-[10px] font-mono text-cyan-300">
                    &bull; {p.verifiedMetrics}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Education */}
            <div>
              <h2 className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-3">
                EDUCATION
              </h2>
              <div className="space-y-2.5">
                {educationData.map((edu) => (
                  <div key={edu.id} className="p-3 rounded-lg border border-white/10 bg-white/[0.02] font-mono text-xs">
                    <div className="text-white font-bold">{edu.degree}</div>
                    <div className="text-slate-400 text-[11px]">{edu.institution} ({edu.dates})</div>
                    <div className="text-emerald-300 text-[10px] mt-1">{edu.currentStatus}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-3">
                KEY CERTIFICATIONS &amp; CREDENTIALS
              </h2>
              <div className="space-y-2 font-mono text-xs text-slate-300">
                {certificationsData.slice(0, 6).map((cert) => (
                  <div key={cert.id} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">{cert.name}</strong> ({cert.issuer})
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Validation Notice & Signature */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-slate-500">
            <span>BASED IN INDIA // OPEN TO REMOTE &amp; HYBRID ROLES</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Signature:</span>
              <span className="font-display font-semibold text-slate-200 tracking-wider">Badal Kumar Sahu</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
