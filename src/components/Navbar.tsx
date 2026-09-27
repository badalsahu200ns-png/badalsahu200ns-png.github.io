import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, FileText } from 'lucide-react';

interface NavbarProps {
  onResumeClick: () => void;
}

export function Navbar({ onResumeClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { label: 'ABOUT', href: '#about' },
    { label: 'EXPERIENCE', href: '#experience' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'STACK', href: '#stack' },
    { label: 'PROCESS', href: '#process' },
    { label: 'CERTIFICATIONS', href: '#certifications' },
    { label: 'CONTACT', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Section spy
      const sections = ['hero', 'about', 'experience', 'projects', 'stack', 'process', 'certifications', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05070a]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl shadow-black/50'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#hero"
          className="group flex items-center gap-3 text-slate-100 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 rounded border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center font-mono text-emerald-400 font-bold text-sm tracking-wider transition-all duration-300 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(0,255,135,0.4)]">
            B
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm tracking-[0.2em] font-semibold text-white flex items-center gap-1.5">
              BADAL
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">PORTFOLIO // 2026</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-all duration-200 relative rounded ${
                  isActive
                    ? 'text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-emerald-400 to-cyan-400" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action: Resume */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onResumeClick}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded border border-emerald-500/40 bg-emerald-500/[0.06] hover:bg-emerald-500/15 text-emerald-400 hover:text-emerald-300 font-mono text-xs tracking-wider transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(0,255,135,0.25)]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>RESUME</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onResumeClick}
            className="sm:hidden px-2.5 py-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs"
          >
            RESUME
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded border border-white/10 hover:border-white/20 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#070b13]/98 border-b border-white/10 backdrop-blur-xl px-6 py-6 transition-all duration-300 shadow-2xl flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded font-mono text-sm tracking-wider text-slate-300 hover:text-emerald-400 hover:bg-white/[0.04] transition-colors flex items-center justify-between border-b border-white/[0.04]"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
              </a>
            ))}
          </div>

          <div className="pt-3 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onResumeClick();
              }}
              className="w-full py-3 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs tracking-wider flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              VIEW EXECUTIVE RESUME
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
