import { useState, useRef } from 'react';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import { ExternalLink, Terminal, ArrowUpRight, Cpu, Layers, Maximize2 } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import { ProjectModal } from './ProjectModal';

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const sectionRef = useRef<HTMLElement>(null);

  const filters = ['ALL', 'GENAI & AGENTS', 'CLOUD & BI', 'PRODUCT ANALYTICS'];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'GENAI & AGENTS') return p.category.includes('GenAI') || p.category.includes('Agent');
    if (activeFilter === 'CLOUD & BI') return p.category.includes('Cloud') || p.category.includes('BI');
    if (activeFilter === 'PRODUCT ANALYTICS') return p.category.includes('Product');
    return true;
  });

  return (
    <section id="projects" ref={sectionRef} className="py-24 relative tech-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              04 // PRODUCTION AI & ANALYTICS SYSTEMS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              FEATURED <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">PROJECTS</span>
            </h2>
          </div>
          
          {/* Category Filter Pills */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 border ${
                  activeFilter === filter
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(0,255,135,0.2)]'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl border border-white/10 bg-[#080c16]/90 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-[0_0_35px_rgba(0,255,135,0.06)]"
            >
              {/* Subtle top bar ambient glow */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="p-6 sm:p-8">
                {/* Header HUD */}
                <div className="flex items-center justify-between gap-4 mb-4 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold tracking-wider">
                      PROJECT {project.number}
                    </span>
                    <span className="text-slate-600">//</span>
                    <span className="text-slate-400">{project.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400/80 bg-emerald-500/[0.06] border border-emerald-500/20 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    DEPLOYED
                  </div>
                </div>

                {/* Project Title & Subtitle */}
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-sm font-mono text-slate-400 mb-4">
                  {project.subtitle}
                </p>

                {/* Project Visual / Technical HUD Banner */}
                <div className="my-5 p-4 rounded-xl border border-white/[0.06] bg-black/40 relative overflow-hidden group-hover:border-emerald-500/20 transition-colors">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-3 border-b border-white/[0.04] pb-2">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Terminal className="w-3 h-3 text-emerald-400" />
                      RUNTIME ARCHITECTURE
                    </span>
                    <span className="text-emerald-400 font-mono">STATUS: 200 OK</span>
                  </div>
                  
                  {/* Dynamic architecture nodes visualization */}
                  <div className="flex items-center justify-between gap-2 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-mono font-semibold text-slate-200">INFERENCE ENGINE</span>
                        <span className="text-[10px] font-mono text-slate-400">{project.technologies[0]}</span>
                      </div>
                    </div>
                    
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/40 via-cyan-500/40 to-purple-500/40 mx-2" />

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-xs font-mono font-semibold text-slate-200">DATA LAYER</span>
                        <span className="text-[10px] font-mono text-slate-400">{project.technologies[1] || 'Cloud API'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-slate-400 italic">
                    &bull; {project.metrics}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded text-xs font-mono text-slate-300 bg-white/[0.03] border border-white/[0.08]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="p-6 sm:p-8 pt-0 flex items-center justify-between gap-3 border-t border-white/[0.06] mt-4 pt-4">
                <div className="flex items-center gap-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(0,255,135,0.2)]"
                  >
                    <span>LIVE DEMO</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded border border-white/10 hover:border-white/30 bg-white/[0.02] text-slate-300 hover:text-white transition-colors"
                      aria-label="View Source on GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-emerald-300 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>DETAILS</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Deep-Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
