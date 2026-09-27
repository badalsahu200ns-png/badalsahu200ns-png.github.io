import { X, ExternalLink, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Project } from '../data/projects';
import { GithubIcon } from './icons/GithubIcon';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0a0e1a] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/10 hover:border-white/30 text-slate-400 hover:text-white bg-white/[0.03] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex items-center gap-2 mb-3 font-mono text-xs text-emerald-400">
          <span className="px-2.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10">
            PROJECT {project.number}
          </span>
          <span className="text-slate-500">//</span>
          <span className="text-cyan-400">{project.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
          {project.title}
        </h3>
        <p className="text-sm font-mono text-slate-400 mb-6">
          {project.subtitle}
        </p>

        {/* Description */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] mb-6">
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Key Impact Metric */}
        <div className="mb-6 flex items-center gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04]">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs sm:text-sm text-slate-200 font-mono">
            <span className="text-emerald-400 font-semibold">Key Advantage: </span>
            {project.metrics}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-3">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>TECHNOLOGY ARCHITECTURE:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded text-xs font-mono text-slate-200 border border-white/10 bg-white/[0.04] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(0,255,135,0.3)]"
          >
            <span>LAUNCH APPLICATION</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 hover:border-white/40 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white font-mono text-xs tracking-wider transition-all duration-300"
            >
              <GithubIcon className="w-4 h-4" />
              <span>SOURCE CODE</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
