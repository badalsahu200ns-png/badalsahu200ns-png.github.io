import { useEffect } from 'react';
import {
  profileData,
  experienceData,
  internshipsData,
  curatedProjectsData,
  educationData,
  certificationsData
} from '../data/portfolioData';
import { X, Download, Printer, Mail, MapPin, Globe } from 'lucide-react';
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

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'Badal_Kumar_Sahu_Resume';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleDirectDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume/Badal_Kumar_Sahu_Resume.pdf';
    link.download = 'Badal_Kumar_Sahu_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Curate 4 target-relevant projects matching Business Analytics / AI / GCP
  const targetProjectKeys = [
    'bigquery-data-agent',
    'reflectai-gemini-reflection-journal',
    'coffee-shop-monitor',
    'Seasonal-Agriculture-Performance-Analysis'
  ];
  const selectedProjects = targetProjectKeys
    .map(key => curatedProjectsData.find(p => p.repo === key))
    .filter(Boolean);

  // Top key credentials covering AI, Cloud, Analytics, Six Sigma, and Strategy
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[95vh] bg-[#0b1120] border border-white/20 rounded-2xl shadow-2xl overflow-y-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Action Bar (Screen Only - Hidden when printing) */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#090d18]/95 border-b border-white/10 backdrop-blur-md no-print">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-wide">
              {profileData.name} &mdash; Executive Resume
            </h3>
            <p className="font-mono text-xs text-emerald-400">
              ATS-Optimized 2-Page A4 Specification
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDirectDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              title="Download pre-compiled PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 hover:border-emerald-400/60 bg-white/[0.04] text-slate-200 hover:text-white font-mono text-xs transition-colors"
              title="Print or Save as PDF via browser print dialog"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">PRINT / SAVE AS PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-slate-400 hover:text-white bg-white/[0.03] transition-colors"
              aria-label="Close Resume Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            ATS RECRUITER-READY RESUME DOCUMENT
            Pristine White Paper Canvas (Screen + Print)
           ========================================================================= */}
        <div className="p-4 sm:p-8 md:p-10 bg-slate-900/40">
          <div className="printable-resume bg-white text-slate-900 shadow-2xl rounded-sm p-6 sm:p-10 md:p-12 mx-auto max-w-[210mm] text-[9.2pt] leading-[1.34] font-sans antialiased">
            
            {/* -------------------- PAGE 1 -------------------- */}
            <div className="resume-page resume-page-1">
              
              {/* Header */}
              <header className="border-b-2 border-slate-900 pb-2 mb-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-950 leading-none">
                  {profileData.name}
                </h1>
                <p className="text-[9.5pt] font-semibold text-sky-700 mt-1">
                  Business Analytics &bull; Generative AI &bull; Data Analytics &bull; AI Products &bull; Google Cloud
                </p>

                {/* Contact Endpoints */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[8.5pt] text-slate-700">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>Bhubaneswar, India</span>
                  </span>
                  <span className="text-slate-400">&bull;</span>
                  <a href={`mailto:${profileData.email}`} className="inline-flex items-center gap-1 text-sky-700 hover:underline">
                    <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{profileData.email}</span>
                  </a>
                  <span className="text-slate-400">&bull;</span>
                  <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">
                    linkedin.com/in/badalsahu200ns
                  </a>
                  <span className="text-slate-400">&bull;</span>
                  <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-700 hover:underline">
                    <GithubIcon className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>github.com/badalsahu200ns-png</span>
                  </a>
                  <span className="text-slate-400">&bull;</span>
                  <a href="https://badalsahu200ns-png.github.io/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-700 hover:underline">
                    <Globe className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>badalsahu200ns-png.github.io</span>
                  </a>
                </div>
              </header>

              {/* 1. Professional Summary */}
              <section className="mb-2.5">
                <h2 className="text-[9.8pt] font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5 resume-section-header">
                  Professional Summary
                </h2>
                <p className="text-[8.8pt] text-slate-800 leading-[1.35] text-justify">
                  {profileData.summary}
                </p>
              </section>

              {/* 2. Professional Experience */}
              <section className="mb-2">
                <h2 className="text-[9.8pt] font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-2 resume-section-header">
                  Professional Experience (5+ Years)
                </h2>
                <div className="space-y-2">
                  {experienceData.experiences.map((exp) => (
                    <div key={exp.id} className="resume-section-item">
                      <div className="flex flex-row items-baseline justify-between gap-2">
                        <div className="text-[9.2pt]">
                          <strong className="text-slate-950">{exp.role}</strong>
                          <span className="text-slate-500"> &mdash; </span>
                          <span className="font-semibold text-sky-700">{exp.company}</span>
                        </div>
                        <div className="text-[8.2pt] font-medium text-slate-600 whitespace-nowrap text-right">
                          {exp.period} | {exp.location}
                        </div>
                      </div>

                      <div className="text-[8.7pt] font-semibold text-slate-900 mt-0.5 mb-1">
                        Impact: {exp.businessImpact}
                      </div>

                      <ul className="list-disc pl-4 text-[8.6pt] text-slate-800 space-y-0.5">
                        {exp.responsibilities.map((r, i) => (
                          <li key={i} className="leading-[1.32]">
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* A4 Page Break Divider for Screen & Print Engine */}
            <div className="resume-page-break my-4 border-b border-dashed border-slate-300 print:hidden" />

            {/* -------------------- PAGE 2 -------------------- */}
            <div className="resume-page resume-page-2">
              
              {/* 3. Current Internships */}
              <section className="mb-2.5">
                <h2 className="text-[9.8pt] font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5 resume-section-header">
                  Current Internships &amp; Applied Analytics Programs
                </h2>
                <div className="space-y-2">
                  {internshipsData.map((item) => (
                    <div key={item.id} className="resume-section-item">
                      <div className="flex flex-row items-baseline justify-between gap-2">
                        <div className="text-[9.2pt]">
                          <strong className="text-slate-950">{item.role}</strong>
                          <span className="text-slate-500"> &mdash; </span>
                          <span className="font-semibold text-sky-700">{item.organization}</span>
                        </div>
                        <div className="text-[8.2pt] font-medium text-slate-600 whitespace-nowrap text-right">
                          {item.period} | {item.mode || 'Virtual'} &bull; {item.status || 'Ongoing'}
                        </div>
                      </div>
                      <ul className="list-disc pl-4 text-[8.6pt] text-slate-800 space-y-0.5 mt-0.5">
                        {item.responsibilities.slice(0, 2).map((r, i) => (
                          <li key={i} className="leading-[1.32]">
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. Selected Projects */}
              <section className="mb-2.5">
                <h2 className="text-[9.8pt] font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5 resume-section-header">
                  Selected Projects (AI, Cloud &amp; Analytics)
                </h2>
                <div className="space-y-2">
                  {selectedProjects.map((p) => (
                    <div key={p!.repo} className="resume-section-item">
                      <div className="flex flex-row items-baseline justify-between gap-2">
                        <div className="text-[9.2pt]">
                          <strong className="text-slate-950">{p!.displayTitle}</strong>
                          <span className="text-[8pt] text-slate-600"> | {p!.technologyTags.join(', ')}</span>
                        </div>
                        <div className="text-[8.2pt] text-sky-700 whitespace-nowrap text-right space-x-2">
                          {p!.demoUrl && (
                            <a href={p!.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                              Live System
                            </a>
                          )}
                          {p!.demoUrl && p!.repositoryUrl && <span className="text-slate-400">&bull;</span>}
                          {p!.repositoryUrl && (
                            <a href={p!.repositoryUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                      <ul className="list-disc pl-4 text-[8.6pt] text-slate-800 space-y-0.5 mt-0.5">
                        <li className="leading-[1.32]">{p!.customDescription}</li>
                        <li className="leading-[1.32] font-medium text-slate-900">Verified Impact: {p!.verifiedMetrics}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Technical Skills & Core Competencies */}
              <section className="mb-2.5">
                <h2 className="text-[9.8pt] font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5 resume-section-header">
                  Technical Skills &amp; Core Competencies
                </h2>
                <div className="space-y-1 text-[8.6pt] leading-[1.32]">
                  <div>
                    <strong className="text-slate-950">Data Analytics &amp; BI: </strong>
                    <span className="text-slate-800">SQL, Google BigQuery, Power BI, Tableau, Advanced Excel (Pivot Tables, Lookups), Exploratory Data Analysis (EDA), KPI Dashboards, MIS Reporting, Statistical Modeling</span>
                  </div>
                  <div>
                    <strong className="text-slate-950">AI &amp; Generative AI: </strong>
                    <span className="text-slate-800">Gemini LLMs, Retrieval-Augmented Generation (RAG), Prompt Engineering, Autonomous AI Agents, Google AI Studio, LLM Integration Strategy</span>
                  </div>
                  <div>
                    <strong className="text-slate-950">Programming &amp; Tools: </strong>
                    <span className="text-slate-800">Python (Pandas, NumPy, Matplotlib), Core Java, TypeScript, React, Streamlit, FastAPI, Git, GitHub CI/CD, Salesforce CRM</span>
                  </div>
                  <div>
                    <strong className="text-slate-950">Cloud &amp; Databases: </strong>
                    <span className="text-slate-800">Google Cloud Platform (Cloud Run, BigQuery, Firestore), Amazon Web Services (EC2, S3, RDS, IAM, VPC), Distributed Systems</span>
                  </div>
                </div>
              </section>

              {/* 6. Education */}
              <section className="mb-2.5">
                <h2 className="text-[9.8pt] font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5 resume-section-header">
                  Education
                </h2>
                <div className="space-y-1.5">
                  {educationData.map((edu) => (
                    <div key={edu.id} className="resume-section-item">
                      <div className="flex flex-row items-baseline justify-between gap-2">
                        <div className="text-[9.1pt]">
                          <strong className="text-slate-950">{edu.degree}</strong>
                          <span className="text-slate-500"> &mdash; </span>
                          <span className="font-semibold text-sky-700">{edu.institution}</span>
                        </div>
                        <div className="text-[8.2pt] font-medium text-slate-600 whitespace-nowrap text-right">
                          {edu.dates} | {edu.currentStatus}
                        </div>
                      </div>
                      <div className="text-[8pt] text-slate-600">
                        {edu.relevantSubjects && edu.relevantSubjects.length > 0
                          ? `Curriculum: ${edu.relevantSubjects.join(', ')}`
                          : edu.description}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. Key Certifications & Credentials */}
              <section className="mb-0">
                <h2 className="text-[9.8pt] font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5 resume-section-header">
                  Key Certifications &amp; Credentials
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[8.2pt] leading-[1.25]">
                  {selectedCerts.map((cert) => (
                    <div key={cert!.id} className="resume-section-item">
                      <span className="font-bold text-slate-950">{cert!.issuer}: </span>
                      <span className="text-slate-800">{cert!.name} </span>
                      {cert!.credentialId && (
                        <span className="text-slate-500 text-[7.8pt]">(ID: {cert!.credentialId})</span>
                      )}
                    </div>
                  ))}
                  <div className="sm:col-span-2 pt-0.5 text-[8.2pt] text-sky-700 font-medium">
                    <a href="https://badalsahu200ns-png.github.io/#certifications" target="_blank" rel="noopener noreferrer" className="hover:underline">
                      &bull; Complete verified registry of 40+ industry certifications available in portfolio gallery &rarr;
                    </a>
                  </div>
                </div>
              </section>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
