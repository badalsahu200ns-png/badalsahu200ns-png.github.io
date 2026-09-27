import { useEffect, useRef } from 'react';
import { HeroScene } from './3d/HeroScene';
import { ArrowDown, Sparkles, Terminal, Mail, Compass } from 'lucide-react';
import { gsap } from '../hooks/useGsap';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLHeadingElement>(null);
  const middleNameRef = useRef<HTMLHeadingElement>(null);
  const lastNameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sceneWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial state: hidden
      gsap.set([
        badgeRef.current,
        firstNameRef.current,
        middleNameRef.current,
        lastNameRef.current,
        subtitleRef.current,
        descriptionRef.current,
        statementRef.current,
        ctaRef.current,
        sceneWrapRef.current
      ], { opacity: 0, y: 30 });

      // Sequenced entrance animation
      tl.to('#main-nav', { opacity: 1, y: 0, duration: 0.6 })
        .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
        .to(firstNameRef.current, { opacity: 1, y: 0, duration: 0.55 }, '-=0.2')
        .to(middleNameRef.current, { opacity: 1, y: 0, duration: 0.55 }, '-=0.35')
        .to(lastNameRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .to(descriptionRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .to(statementRef.current, { opacity: 1, y: 0, duration: 0.55 }, '-=0.3')
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .to(sceneWrapRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden tech-grid-bg"
    >
      {/* Subtle radial depth gradient */}
      <div className="absolute inset-0 tech-radial-glow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column: Editorial Headline & Identity */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Terminal Status Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400 font-mono text-[11px] tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>DATA ANALYST &bull; GENAI ARCHITECT</span>
              </div>
              <span className="hidden sm:inline text-slate-500 font-mono text-xs">
                // SYSTEM_READY
              </span>
            </div>

            {/* Massive Editorial Name */}
            <div className="flex flex-col tracking-tight font-display font-extrabold uppercase leading-[0.88] select-none">
              <h1
                ref={firstNameRef}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] text-white"
              >
                BADAL
              </h1>
              <h1
                ref={middleNameRef}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] text-slate-300"
              >
                KUMAR
              </h1>
              <h1
                ref={lastNameRef}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300"
              >
                SAHU<span className="text-cyan-400">.</span>
              </h1>
            </div>

            {/* Subtitle & Role Positioning */}
            <p
              ref={subtitleRef}
              className="mt-6 text-lg sm:text-xl md:text-2xl font-medium text-slate-200 tracking-wide flex flex-wrap items-center gap-x-2.5 gap-y-1"
            >
              <span className="text-emerald-400">Data Analyst</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-cyan-400">Generative AI</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-purple-400">Google Cloud</span>
            </p>

            {/* Secondary positioning statement */}
            <p
              ref={descriptionRef}
              className="mt-2 text-sm sm:text-base text-slate-400 font-mono tracking-wide"
            >
              Business Intelligence &bull; Product Analytics &bull; AI-Powered Solutions
            </p>

            {/* Professional Statement Quote Box */}
            <div
              ref={statementRef}
              className="mt-6 p-4 rounded border-l-2 border-emerald-400 bg-white/[0.02] border-y border-r border-white/[0.04] max-w-xl"
            >
              <p className="text-sm sm:text-base italic text-slate-300 font-sans leading-relaxed">
                &ldquo;Data into insights. Insights into products. Products powered by AI.&rdquo;
              </p>
            </div>

            {/* Call to Actions */}
            <div
              ref={ctaRef}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(0,255,135,0.3)] hover:shadow-[0_0_35px_rgba(0,255,135,0.5)]"
              >
                <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
                <span>EXPLORE MY WORK</span>
              </a>

              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded border border-white/20 hover:border-cyan-400/80 bg-white/[0.03] hover:bg-cyan-500/10 text-slate-200 hover:text-cyan-300 font-mono text-xs tracking-wider transition-all duration-300"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>LET&apos;S CONNECT</span>
              </a>

              <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-500 pl-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>5+ YRS CROSS-INDUSTRY IMPACT</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Visual Core (DATA -> AI -> CLOUD -> INSIGHT) */}
          <div ref={sceneWrapRef} className="lg:col-span-5 relative">
            <HeroScene />
          </div>

        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <a
        href="#about"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-500 hover:text-emerald-400 transition-colors pointer-events-auto select-none"
        aria-label="Scroll to About Section"
      >
        <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">SCROLL</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-emerald-400" />
      </a>
    </section>
  );
}
