import { useState, useMemo } from 'react';
import { getMergedProjects } from '../../data/portfolioData';
import type { MergedProject } from '../../data/portfolioData';
import { ExternalLink, Star, GitFork, Terminal, Cpu, Layers, Maximize2, Sparkles, Filter } from 'lucide-react';
import { GithubIcon } from '../icons/GithubIcon';
import { ProjectModal } from '../ProjectModal';
import type { Project as ModalProject } from '../../data/projects';

export function ProjectsView() {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<MergedProject | null>(null);

  const mergedProjects = useMemo(() => getMergedProjects(), []);

  const filters = ['ALL', 'GENAI & AGENTS', 'CLOUD & BI', 'PRODUCT ANALYTICS', 'OPEN SOURCE GITHUB'];

  const filtered = useMemo(() => {
    return mergedProjects.filter((p) => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'GENAI & AGENTS') {
        return p.category.toLowerCase().includes('genai') || p.category.toLowerCase().includes('agent') || p.category.toLowerCase().includes('rag');
      }
      if (activeFilter === 'CLOUD & BI') {
        return p.category.toLowerCase().includes('cloud') || p.category.toLowerCase().includes('bi');
      }
      if (activeFilter === 'PRODUCT ANALYTICS') {
        return p.category.toLowerCase().includes('product') || p.category.toLowerCase().includes('analytics');
      }
      if (activeFilter === 'OPEN SOURCE GITHUB') {
        return p.githubUrl !== null && p.githubUrl !== undefined;
      }
      return true;
    });
  }, [mergedProjects, activeFilter]);

  // Adapter for existing ProjectModal
  const modalProjectAdapter: ModalProject | null = selectedProject ? {
    id: selectedProject.id,
    number: String(selectedProject.priority).padStart(2, '0'),
    title: selectedProject.title,
    subtitle: selectedProject.category,
    description: selectedProject.description,
    technologies: selectedProject.technologies,
    liveUrl: selectedProject.demoUrl || '',
    githubUrl: selectedProject.githubUrl || undefined,
    category: selectedProject.category,
    metrics: selectedProject.metrics,
  } : null;

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
      
      {/* Header HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            04 // MERGED PORTFOLIO &amp; GITHUB REPOSITORY SYNC
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            FEATURED <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">PROJECTS</span>
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 font-mono text-xs text-slate-500 mr-1">
            <Filter className="w-3 h-3" />
            FILTER:
          </span>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all border ${
                activeFilter === filter
                  ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 font-bold shadow-[0_0_12px_rgba(118,255,3,0.2)]'
                  : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="p-3.5 rounded-xl border border-white/[0.08] bg-black/40 mb-8 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">DUAL DATA PIPELINE:</span>
          <span>Curated Metadata (projects.json) + Automated GitHub Sync (github-projects.json)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>{filtered.length} SYSTEMS DISPLAYED</span>
          <span className="text-emerald-400 font-semibold">SECURITY: NO CLIENT TOKENS</span>
        </div>
      </div>

      {/* Projects 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="group relative rounded-2xl border border-white/10 bg-[#080c16]/90 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-[0_0_35px_rgba(118,255,3,0.08)]"
          >
            <div className="p-6 sm:p-8">
              
              {/* Header HUD */}
              <div className="flex items-center justify-between gap-3 mb-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Stars & Forks if present */}
                <div className="flex items-center gap-3 text-slate-400">
                  {proj.stars > 0 && (
                    <span className="flex items-center gap-1 text-amber-300 text-[11px]">
                      <Star className="w-3 h-3 fill-amber-300" />
                      {proj.stars}
                    </span>
                  )}
                  {proj.forks > 0 && (
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <GitFork className="w-3 h-3" />
                      {proj.forks}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-display font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                {proj.title}
              </h3>

              {/* Architecture Node Visualizer */}
              <div className="my-4 p-3.5 rounded-xl border border-white/[0.06] bg-black/40">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 border-b border-white/[0.04] pb-1.5">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Terminal className="w-3 h-3" />
                    ARCHITECTURE SPECIFICATION
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    {proj.source === 'merged' ? 'SYNCED + CURATED' : proj.source.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-mono text-slate-200">
                      {proj.technologies[0] || 'Engine'}
                    </span>
                  </div>

                  <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/40 via-cyan-500/40 to-purple-500/40 mx-2" />

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-mono text-slate-200">
                      {proj.technologies[1] || 'Cloud API'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] font-mono text-slate-400 italic">
                  &bull; {proj.metrics}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
                {proj.description}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {proj.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded text-xs font-mono text-slate-300 bg-white/[0.03] border border-white/[0.08]"
                  >
                    {t}
                  </span>
                ))}
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between gap-3 border-t border-white/[0.06] mt-2 pt-4">
              <div className="flex items-center gap-2">
                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(118,255,3,0.2)]"
                  >
                    <span>LIVE DEMO</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-white/10 hover:border-white/30 bg-white/[0.02] text-slate-300 hover:text-white transition-colors"
                    title="View Source on GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedProject(proj)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-emerald-300 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>INSPECT SYSTEM</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Project Deep-Dive Modal */}
      {modalProjectAdapter && (
        <ProjectModal
          project={modalProjectAdapter}
          onClose={() => setSelectedProject(null)}
        />
      )}

    </div>
  );
}
