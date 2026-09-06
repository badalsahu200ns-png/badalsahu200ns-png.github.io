import { ArrowUp, Heart } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-white/[0.08] bg-[#040609] text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          
          {/* Brand & Positioning */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 text-white font-bold tracking-widest text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              BADAL KUMAR SAHU
            </div>
            <p className="text-slate-500 text-[11px]">
              Data into insights. Insights into products. Products powered by AI.
            </p>
          </div>

          {/* Quick Nav */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-slate-400">
            <a href="#about" className="hover:text-emerald-300 transition-colors">ABOUT</a>
            <a href="#experience" className="hover:text-emerald-300 transition-colors">EXPERIENCE</a>
            <a href="#projects" className="hover:text-emerald-300 transition-colors">PROJECTS</a>
            <a href="#stack" className="hover:text-emerald-300 transition-colors">STACK</a>
            <a href="#process" className="hover:text-emerald-300 transition-colors">PROCESS</a>
            <a href="#certifications" className="hover:text-emerald-300 transition-colors">CERTIFICATIONS</a>
            <a href="#contact" className="hover:text-emerald-300 transition-colors">CONTACT</a>
          </div>

          {/* Socials & Back to top */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/badalsahu200ns-png"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-white/10 hover:border-white/30 text-slate-400 hover:text-white bg-white/[0.02] transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-lg border border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(0,255,135,0.3)] transition-all flex items-center gap-1.5"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-[10px] hidden sm:inline">TOP</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Badal Kumar Sahu. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Built with React 19, TypeScript, Three.js &amp; Tailwind</span>
            <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400/30 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
}
