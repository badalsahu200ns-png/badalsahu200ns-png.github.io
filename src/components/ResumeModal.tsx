import { useEffect } from 'react';
import {
  profileData,
  experienceData,
  internshipsData,
  curatedProjectsData,
  educationData,
  certificationsData
} from '../data/portfolioData';
import { X, Download, Printer, Mail, MapPin, Globe, Shield, Sparkles, Cpu, Layers, Award, GraduationCap, Briefcase, ExternalLink } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';

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

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'Badal_Kumar_Sahu_ATS_Resume';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleDirectDownload = () => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.BASE_URL}resume/Badal_Kumar_Sahu_ATS_Resume.pdf`;
    link.download = 'Badal_Kumar_Sahu_ATS_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4 Featured Projects
  const targetProjectKeys = [
    'bigquery-data-agent',
    'reflectai-gemini-reflection-journal',
    'coffee-shop-monitor',
    'Seasonal-Agriculture-Performance-Analysis'
  ];
  const selectedProjects = targetProjectKeys
    .map(key => curatedProjectsData.find(p => p.repo === key))
    .filter(Boolean);

  // Top Key Certifications
  const keyCertIds = [
    'oracle-agentic-ai-certified-foundations',
    'google-configure-service-accounts-iam',
    'google-basics-cloud-compute-skill-badge',
    'anthropic-ai-fluency-framework',
    'anthropic-claude-101',
    'oneroadmap-data-analyst-certification',
    'oneroadmap-excel-certification',
    'ksu-six-sigma-principles',
    'coursera-marketing-analytics',
    'coursera-customer-analytics',
    'forage-deloitte-data-analytics',
    'forage-bcg-strategy-consulting',
    'cisco-introduction-to-cybersecurity'
  ];
  const selectedCerts = keyCertIds
    .map(id => certificationsData.find(c => c.id === id))
    .filter(Boolean);

  return (
    <div
      id="resume-modal-portal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Container: Futuristic Dark Charcoal / Purple Shell (Inspired by Screenshot 2) */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#070913] border border-purple-500/30 rounded-2xl shadow-[0_0_80px_rgba(139,92,246,0.18)] overflow-hidden flex flex-col text-slate-100 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-40 bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* 1. TOP CONTROL BAR */}
        <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-5 sm:px-8 py-4 bg-[#090b16]/95 border-b border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
            <div>
              <div className="font-mono text-[10px] sm:text-xs text-purple-400 font-semibold tracking-widest uppercase">
                DIGITAL RESUME SPECIFICATION // BADAL // 001
              </div>
              <h2 className="text-base sm:text-lg font-display font-black text-white tracking-wide">
                {profileData.name} &bull; ATS CURRICULUM VITAE
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Primary Action: Download 3-Page ATS Resume */}
            <button
              onClick={handleDirectDownload}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] cursor-pointer group"
              title="Download 3-Page ATS Resume PDF"
            >
              <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              <span>DOWNLOAD ATS RESUME (PDF)</span>
            </button>

            {/* Secondary Action: Print / Browser Save */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/15 hover:border-purple-400/60 bg-white/[0.04] text-slate-300 hover:text-white font-mono text-xs transition-all cursor-pointer"
              title="Print or Save via browser dialog"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">PRINT</span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/15 hover:border-red-400/60 text-slate-400 hover:text-white bg-white/[0.04] hover:bg-red-500/10 transition-colors cursor-pointer"
              aria-label="Close Digital Resume Preview"
              title="Close (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. SCROLLABLE DIGITAL RESUME BODY (Screenshot 2 Theme) */}
        <div className="p-4 sm:p-8 md:p-10 overflow-y-auto space-y-8 font-sans">
          
          {/* Header Card */}
          <div className="relative p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-950/30 via-[#0c0d1e] to-purple-950/20 backdrop-blur-md shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 font-mono text-[11px] text-emerald-400 font-semibold tracking-widest uppercase mb-2">
                  <Shield className="w-3.5 h-3.5" />
                  VERIFIED CANDIDATE RECORD
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase tracking-tight text-white">
                  {profileData.name}
                </h1>
                <p className="text-sm sm:text-base font-mono text-cyan-300 font-medium mt-1">
                  Senior Business &amp; Data Analyst &bull; Generative AI &amp; Autonomous Agents &bull; Cloud Architectures
                </p>
              </div>

              {/* Verified Contact Badges */}
              <div className="flex flex-col gap-2 font-mono text-xs text-slate-300 shrink-0">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Bhubaneswar, Odisha, India</span>
                </span>
                <a href={`mailto:${profileData.email}`} className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{profileData.email}</span>
                </a>
                <div className="flex items-center gap-3 pt-1">
                  <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/10 hover:border-cyan-400 bg-white/[0.04] text-slate-300 hover:text-white transition-colors">
                    <LinkedinIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>LinkedIn</span>
                  </a>
                  <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/10 hover:border-emerald-400 bg-white/[0.04] text-slate-300 hover:text-white transition-colors">
                    <GithubIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GitHub</span>
                  </a>
                  <a href="https://badalsahu200ns-png.github.io/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/10 hover:border-purple-400 bg-white/[0.04] text-slate-300 hover:text-white transition-colors">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    <span>Portfolio</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 01: Executive Summary */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold border-b border-purple-500/20 pb-2">
              <Sparkles className="w-4 h-4" />
              <span>01 // EXECUTIVE SUMMARY &amp; VALUE PROPOSITION</span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans bg-white/[0.02] p-4 sm:p-5 rounded-xl border border-white/[0.06]">
              {profileData.summary}
            </p>
          </section>

          {/* Section 02: Core Competencies (8 Pillars) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold border-b border-purple-500/20 pb-2">
              <Layers className="w-4 h-4" />
              <span>02 // CORE DOMAIN COMPETENCIES (8 STRATEGIC PILLARS)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { title: 'Business Analytics & Forecasting', desc: 'Predictive modeling, revenue forecasting, KPI reporting' },
                { title: 'Autonomous AI Multi-Agents', desc: 'Tool calling, RAG pipelines, reasoning agents' },
                { title: 'Petabyte Cloud Warehousing', desc: 'Google BigQuery, Dataform, partitioning, complex SQL' },
                { title: 'Product & Commercial Strategy', desc: 'ROI tracking, conversion funnel analytics, stakeholder advisory' },
                { title: 'Process Optimization & Six Sigma', desc: 'Operational lean engineering, root cause analysis' },
                { title: 'Cloud Infrastructure & Deployments', desc: 'Google Cloud Platform, AWS, Docker containers' },
                { title: 'Stakeholder Executive Advisory', desc: 'C-suite presentation, data storytelling, executive briefs' },
                { title: 'Enterprise CRM & Systems', desc: 'Salesforce CRM, real-time pipeline monitoring, ERP' },
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-purple-400/40 transition-colors">
                  <div className="font-mono text-xs font-bold text-white mb-1">{item.title}</div>
                  <div className="font-mono text-[11px] text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 03: Technical Skills Matrix */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold border-b border-purple-500/20 pb-2">
              <Cpu className="w-4 h-4" />
              <span>03 // TECHNICAL COMPETENCIES MATRIX</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <h4 className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                  DATA ANALYTICS &amp; BUSINESS INTELLIGENCE
                </h4>
                <p className="font-mono text-xs text-slate-300 leading-relaxed">
                  SQL (Window Functions, CTEs, Aggregations), Google BigQuery, Microsoft Power BI, Tableau, Advanced Microsoft Excel (XLOOKUP, Power Pivot, Macros), Exploratory Data Analysis (EDA), KPI Dashboards, MIS Automation, Statistical Modeling.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <h4 className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  ARTIFICIAL INTELLIGENCE &amp; GENERATIVE AI
                </h4>
                <p className="font-mono text-xs text-slate-300 leading-relaxed">
                  Google Gemini 1.5 Pro / Flash, Anthropic Claude, Prompt Engineering &amp; Metaprompting, Retrieval-Augmented Generation (RAG), Autonomous Multi-Agent Systems, Vector Embeddings &amp; Semantic Search, Google AI Studio, Agentic Tool Calling.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <h4 className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                  PROGRAMMING &amp; SOFTWARE ARCHITECTURE
                </h4>
                <p className="font-mono text-xs text-slate-300 leading-relaxed">
                  Python (Pandas, NumPy, Matplotlib, Scikit-learn, Seaborn), Core Java, TypeScript, React 19, Streamlit, FastAPI, Git, GitHub Actions CI/CD, Salesforce CRM.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <h4 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  CLOUD PLATFORMS &amp; DATA INFRASTRUCTURE
                </h4>
                <p className="font-mono text-xs text-slate-300 leading-relaxed">
                  Google Cloud Platform (BigQuery, Cloud Run, Cloud Storage, IAM), Amazon Web Services (EC2, S3, RDS, IAM, VPC), Docker Containers, Distributed Systems, WebSockets.
                </p>
              </div>
            </div>
          </section>

          {/* Section 04: Professional Experience */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold border-b border-purple-500/20 pb-2">
              <Briefcase className="w-4 h-4" />
              <span>04 // PROFESSIONAL EXPERIENCE (5+ YEARS VERIFIED ENTERPRISE TRACK RECORD)</span>
            </div>
            <div className="space-y-4">
              {experienceData.experiences.map((exp) => (
                <div key={exp.id} className="p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-purple-400/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-display font-bold text-white">
                        {exp.role} <span className="text-purple-400">@</span> <span className="text-cyan-300">{exp.company}</span>
                      </h3>
                      <div className="font-mono text-xs text-slate-400">{exp.period} &bull; {exp.location}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-400 font-semibold self-start sm:self-center">
                      Impact: {exp.businessImpact}
                    </span>
                  </div>

                  <ul className="list-disc pl-5 font-mono text-xs text-slate-300 space-y-1.5 mt-3">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i} className="leading-relaxed">{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section 05: Featured Projects */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold border-b border-purple-500/20 pb-2">
              <Cpu className="w-4 h-4" />
              <span>05 // FEATURED PROJECTS &amp; SYSTEM ARCHITECTURES</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProjects.map((p) => (
                <div key={p!.repo} className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-display font-bold text-white text-sm sm:text-base">{p!.displayTitle}</h4>
                      <div className="flex items-center gap-2">
                        {p!.demoUrl && (
                          <a href={p!.demoUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300" title="Live Demo">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {p!.repositoryUrl && (
                          <a href={p!.repositoryUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300" title="GitHub Repo">
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="font-mono text-[10px] text-purple-400 mb-2">{p!.technologyTags.join(' • ')}</div>
                    <p className="font-mono text-xs text-slate-300 leading-relaxed mb-3">{p!.customDescription}</p>
                  </div>
                  <div className="pt-2 border-t border-white/[0.08] font-mono text-[11px] text-emerald-400 font-semibold">
                    Verified Outcome: {p!.verifiedMetrics}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 06: Current Internships */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold border-b border-purple-500/20 pb-2">
              <Briefcase className="w-4 h-4" />
              <span>06 // CURRENT INTERNSHIPS &amp; APPLIED ANALYTICS PROGRAMS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {internshipsData.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="font-display font-bold text-white text-sm sm:text-base">{item.role}</div>
                  <div className="font-mono text-xs text-purple-400 mb-1">{item.organization}</div>
                  <div className="font-mono text-[11px] text-slate-400 mb-2.5">{item.period} &bull; {item.mode || 'Virtual'} ({item.status || 'Active'})</div>
                  <ul className="list-disc pl-4 font-mono text-xs text-slate-300 space-y-1">
                    {item.responsibilities.slice(0, 3).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section 07: Education */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold border-b border-purple-500/20 pb-2">
              <GraduationCap className="w-4 h-4" />
              <span>07 // EDUCATION &amp; ACADEMIC QUALIFICATIONS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {educationData.map((edu) => (
                <div key={edu.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="font-display font-bold text-white text-sm">{edu.degree}</div>
                  <div className="font-mono text-xs text-purple-400 mb-1">{edu.institution}</div>
                  <div className="font-mono text-[11px] text-slate-400 mb-2">{edu.dates} &bull; {edu.currentStatus}</div>
                  <div className="font-mono text-[11px] text-slate-400 leading-relaxed">
                    {edu.relevantSubjects ? edu.relevantSubjects.slice(0, 4).join(', ') : edu.description}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 08: Key Certifications */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold border-b border-purple-500/20 pb-2">
              <Award className="w-4 h-4" />
              <span>08 // KEY CERTIFICATIONS &amp; VERIFIED CREDENTIALS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedCerts.map((cert) => (
                <div key={cert!.id} className="p-3 rounded-lg border border-white/10 bg-white/[0.02] font-mono text-xs">
                  <div className="font-bold text-cyan-300 text-[11px]">{cert!.issuer}</div>
                  <div className="text-white font-medium my-0.5">{cert!.name}</div>
                  {cert!.credentialId && (
                    <div className="text-slate-500 text-[10px]">ID: {cert!.credentialId}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-950/20 font-mono text-xs text-purple-200 flex items-center justify-between">
              <span>Verified registry with 40+ professional industry certifications available in portfolio gallery.</span>
              <a href="https://badalsahu200ns-png.github.io/#certifications" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-bold">
                View Credentials &rarr;
              </a>
            </div>
          </section>

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono text-xs text-slate-400">
              CONFIDENTIAL &bull; CANDIDATE ID: BADAL_SAHU_001 &bull; 2026 EDITION
            </div>
            <button
              onClick={handleDirectDownload}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD ATS RESUME (PDF)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ResumeModal;
