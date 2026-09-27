import { profileData } from '../../data/portfolioData';
import { Profile3DCard } from '../3d/Profile3DCard';
import { Mail, MapPin, Briefcase, Globe, Sparkles, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { GithubIcon } from '../icons/GithubIcon';

interface ProfileViewProps {
  onNavigateToSection: (sectionId: string) => void;
  onResumeClick: () => void;
}

export function ProfileView({ onNavigateToSection, onResumeClick }: ProfileViewProps) {
  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10">
      
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            01 // EXECUTIVE PROFILE PANEL
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            BADAL KUMAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">SAHU</span>
          </h2>
        </div>
        <div className="mt-4 sm:mt-0 font-mono text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>VERIFIED PROFESSIONAL IDENTITY</span>
        </div>
      </div>

      {/* 1. Executive Profile Persona Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#080c16]/90 backdrop-blur-md mb-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Persona Card with 3D Interaction */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="w-full max-w-[260px]">
              <Profile3DCard
                cutoutSrc={profileData.profileCutout || '/media/profile/badal-cutout.png'}
                imageSrc={profileData.profileImage || '/images/nameste hi.png'}
                name={profileData.name}
                identityCode={profileData.identityCode}
              />
            </div>
          </div>

          {/* Executive Overview & Telemetry Details */}
          <div className="md:col-span-8 flex flex-col justify-center text-left">
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{profileData.identityCode}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 tracking-tight">
              {profileData.name}
            </h3>
            <p className="font-mono text-xs sm:text-sm text-cyan-300 font-semibold mb-4">
              {profileData.supportingTitle}
            </p>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs mb-6 pt-3 border-t border-white/[0.08]">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Location: {profileData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{profileData.workMode}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Briefcase className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Status: {profileData.availability}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Status: {profileData.workplaceStatus}</span>
              </div>
            </div>

            {/* Actions: Resume & Direct Channels */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onResumeClick}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(118,255,3,0.25)] flex items-center gap-2"
              >
                <span>DOWNLOAD DIGITAL RESUME</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${profileData.email}`}
                  className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02] hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 flex items-center justify-center transition-colors"
                  title="Send Direct Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-colors"
                  title="LinkedIn Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02] hover:border-purple-500/40 text-slate-300 hover:text-purple-300 flex items-center justify-center transition-colors"
                  title="GitHub Repositories"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Centered Primary Specialization */}
      <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#080c16]/90 backdrop-blur-md mb-8 shadow-xl text-left">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>PRIMARY SPECIALIZATION //</span>
        </div>
        <h4 className="text-xl sm:text-2xl font-display font-bold text-white mb-3 tracking-tight">
          {profileData.headline}
        </h4>
        <p className="text-sm sm:text-base font-mono text-slate-300 leading-relaxed mb-4">
          {profileData.summary}
        </p>
        <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] text-xs font-mono text-emerald-300">
          <strong>Professional Status:</strong> {profileData.workplaceStatus}
        </div>
      </div>

      {/* 3. Centered 4 Professional Capability Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 text-left">
        {profileData.corePillars.map((pillar, idx) => (
          <div
            key={pillar.title}
            className="p-6 rounded-2xl border border-white/10 bg-[#080c16]/85 hover:border-emerald-500/30 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* PILLAR NUMBER */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
                <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest">
                  PILLAR 0{idx + 1}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" />
              </div>

              {/* SPECIALIZATION */}
              <h5 className="font-display text-lg font-bold text-white mb-1 tracking-tight">
                {pillar.title}
              </h5>

              {/* CAPABILITY STATEMENT */}
              <div className="text-xs font-mono text-cyan-300 font-semibold mb-3">
                {pillar.subtitle}
              </div>

              {/* DESCRIPTION */}
              <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Centered Career & Project Navigation CTAs */}
      <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3.5">
        <button
          onClick={() => onNavigateToSection('internships')}
          className="px-5 py-2.5 rounded-lg border border-white/15 bg-white/[0.03] hover:border-emerald-400/50 hover:bg-emerald-500/10 text-xs font-mono font-semibold text-slate-200 hover:text-emerald-300 flex items-center gap-2 transition-all duration-200"
        >
          <span>VIEW INTERNSHIPS</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
        </button>

        <button
          onClick={() => onNavigateToSection('experience')}
          className="px-5 py-2.5 rounded-lg border border-white/15 bg-white/[0.03] hover:border-cyan-400/50 hover:bg-cyan-500/10 text-xs font-mono font-semibold text-slate-200 hover:text-cyan-300 flex items-center gap-2 transition-all duration-200"
        >
          <span>VIEW CAREER TIMELINE</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>

        <button
          onClick={() => onNavigateToSection('projects')}
          className="px-5 py-2.5 rounded-lg border border-white/15 bg-white/[0.03] hover:border-purple-400/50 hover:bg-purple-500/10 text-xs font-mono font-semibold text-slate-200 hover:text-purple-300 flex items-center gap-2 transition-all duration-200"
        >
          <span>VIEW FEATURED PROJECTS</span>
          <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
        </button>
      </div>

    </div>
  );
}
