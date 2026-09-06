import { X, FileText, Download, Mail, ExternalLink, Award } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#090d18] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                BADAL KUMAR SAHU
              </h3>
              <p className="font-mono text-xs text-emerald-400">
                EXECUTIVE RESUME SUMMARY // 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 bg-white/[0.03] transition-colors"
              title="Print / Save as PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-white/10 hover:border-white/30 text-slate-400 hover:text-white bg-white/[0.03] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Snapshot */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] mb-6 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
          <span className="text-emerald-400 font-semibold font-sans">Professional Summary: </span>
          Results-driven Data Analyst and AI Solutions Architect with 5+ years of frontline business experience spanning PropTech, Travel-tech, BFSI, and Telecom. Proven track record of scaling commercial portfolios by 30%, coaching 20+ professionals, and sustaining 130% KPI achievement. Specializes in converting petabyte-scale data into automated Gemini LLM agents, RAG vector pipelines, and executive BI dashboards.
        </div>

        {/* Quick Contact Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 font-mono text-xs">
          <a
            href="mailto:badalsahu200ns@gmail.com"
            className="p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 flex items-center gap-2 transition-colors"
          >
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">badalsahu200ns@gmail.com</span>
          </a>
          <a
            href="https://linkedin.com/in/badalsahu200ns"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">linkedin.com/in/badalsahu200ns</span>
          </a>
          <a
            href="https://github.com/badalsahu200ns-png"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:border-purple-500/30 text-slate-300 hover:text-purple-300 flex items-center gap-2 transition-colors"
          >
            <GithubIcon className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">github.com/badalsahu200ns-png</span>
          </a>
        </div>

        {/* Education & Credentials in Modal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold mb-3">
              <Award className="w-4 h-4" />
              <span>CORE EDUCATION</span>
            </div>
            <ul className="space-y-2 text-xs font-mono text-slate-300">
              <li>&bull; <strong className="text-white">MCA</strong> — Amity University (Jul 2025 – Present)</li>
              <li>&bull; <strong className="text-white">PGDM</strong> (Marketing & Finance) — IMIS Bhubaneswar</li>
              <li>&bull; <strong className="text-white">B.Com</strong> (Marketing & Finance) — JRN RVU</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-3">
              <Award className="w-4 h-4" />
              <span>KEY CERTIFICATIONS</span>
            </div>
            <ul className="space-y-1.5 text-xs font-mono text-slate-300">
              <li>&bull; Google Cloud Data Analytics (In Progress)</li>
              <li>&bull; Oracle Python Certified Associate</li>
              <li>&bull; Oracle Agentic AI Certified Associate</li>
              <li>&bull; Forage Simulations: Tata, Deloitte, BCG, PwC</li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-slate-500">
            BASED IN INDIA // OPEN TO REMOTE & HYBRID ROLES
          </span>
          <a
            href="mailto:badalsahu200ns@gmail.com?subject=Opportunity%20Discussion%20for%20Badal%20Kumar%20Sahu"
            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-colors"
          >
            GET IN TOUCH DIRECTLY
          </a>
        </div>
      </div>
    </div>
  );
}
