import { useEffect, useRef } from 'react';
import { HeroScene } from './components/3d/HeroScene';
import { gsap } from './hooks/useGsap';

const impactStats = [
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 30, suffix: '%', label: 'Business Growth' },
  { value: 20, suffix: '+', label: 'Team Members Led' },
  { value: 130, suffix: '%', label: 'KPI Achievement' },
  { value: 91, suffix: '%', label: 'Renewal Collection' },
];

function App() {
  const mainRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const heroTagRef = useRef<HTMLParagraphElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroRoleRef = useRef<HTMLDivElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const hero3dRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLElement>(null);
  const statValueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Respect user prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Set initial visible states immediately
      impactStats.forEach((stat, i) => {
        const el = statValueRefs.current[i];
        if (el) el.textContent = `${stat.value}${stat.suffix}`;
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
        .fromTo(
          heroTagRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.2'
        )
        .fromTo(
          heroTitleRef.current?.children || [],
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
          '-=0.3'
        )
        .fromTo(
          heroRoleRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          heroCtaRef.current?.children || [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          '-=0.3'
        )
        .fromTo(
          hero3dRef.current,
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: 'power2.out' },
          '-=0.6'
        );

      // 2. Animated Counters via ScrollTrigger
      impactStats.forEach((stat, index) => {
        const el = statValueRefs.current[index];
        if (!el) return;

        const counter = { val: 0 };
        gsap.to(counter, {
          val: stat.value,
          duration: 1.8 + index * 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsSectionRef.current,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            if (el) {
              el.textContent = `${Math.round(counter.val)}${stat.suffix}`;
            }
          },
        });
      });

      // 3. Section Reveal Animations
      const sections = gsap.utils.toArray<HTMLElement>('.gsap-section-reveal');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      // 4. Subtle Parallax for Background Elements
      gsap.to('.gsap-parallax-bg', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="min-h-screen bg-void text-white selection:bg-accent/30 selection:text-accent">
      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <a
            href="#"
            className="font-display text-lg font-bold tracking-tight transition hover:text-accent"
          >
            BADAL<span className="text-accent">.</span>
          </a>

          <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a href="#experience" className="transition hover:text-white">
              Experience
            </a>
            <a href="#projects" className="transition hover:text-white">
              Projects
            </a>
            <a href="#stack" className="transition hover:text-white">
              Stack
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </div>

          <a
            href="#contact"
            className="border border-accent/50 px-5 py-2.5 text-sm font-medium text-accent transition duration-300 hover:bg-accent hover:text-black hover:shadow-[0_0_20px_rgba(118,255,3,0.3)] active:scale-95"
          >
            Let's Talk
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="grid-background gsap-parallax-bg relative flex min-h-screen items-center overflow-hidden pt-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">
          <div className="relative z-10 flex flex-col justify-center">
            <p
              ref={heroTagRef}
              className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-accent"
            >
              Data × AI × Product
            </p>

            <h1
              ref={heroTitleRef}
              className="font-display text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.06em]"
            >
              <span className="block">BADAL</span>
              <span className="block">KUMAR</span>
              <span className="block text-white/30">SAHU.</span>
            </h1>

            <div ref={heroRoleRef} className="mt-10 max-w-xl">
              <h2 className="font-display text-2xl font-medium md:text-3xl">
                Data Analyst
                <span className="mx-2 text-white/20">·</span>
                Generative AI
                <span className="mx-2 text-white/20">·</span>
                Google Cloud
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/50 md:text-lg">
                Turning business data into actionable insights, intelligent
                products, and AI-powered solutions.
              </p>
            </div>

            <div ref={heroCtaRef} className="mt-10 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="bg-accent px-7 py-4 text-sm font-semibold text-black transition duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(118,255,3,0.4)] active:scale-95"
              >
                Explore My Work
              </a>

              <a
                href="#contact"
                className="border border-white/20 px-7 py-4 text-sm font-semibold transition duration-300 hover:border-white/50 hover:bg-white/[0.04] active:scale-95"
              >
                Let's Connect
              </a>
            </div>
          </div>

          {/* 3D Visual Core */}
          <div
            ref={hero3dRef}
            className="relative flex min-h-[450px] lg:min-h-[580px] items-center justify-center"
          >
            <HeroScene />
          </div>
        </div>

        <div className="absolute bottom-8 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 lg:left-10">
          Scroll to explore
        </div>
      </section>

      {/* Impact Section / Animated Counters */}
      <section
        ref={statsSectionRef}
        className="border-t border-white/10 bg-black/40 px-6 py-16 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-5">
            {impactStats.map((stat, idx) => (
              <div
                key={stat.label}
                className="flex flex-col p-4 rounded border border-white/5 bg-white/[0.015] hover:border-accent/20 transition-all duration-300"
              >
                <span
                  ref={(el) => {
                    statValueRefs.current[idx] = el;
                  }}
                  className="font-display text-4xl sm:text-5xl font-extrabold text-accent tracking-tight"
                >
                  0{stat.suffix}
                </span>
                <span className="mt-2 text-xs sm:text-sm font-mono text-white/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="gsap-section-reveal border-t border-white/10 px-6 py-32 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            01 — About
          </p>

          <h2 className="mt-8 max-w-4xl font-display text-4xl font-medium leading-tight md:text-6xl">
            Business thinking meets
            <span className="text-white/30"> data, AI and technology.</span>
          </h2>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="gsap-section-reveal border-t border-white/10 px-6 py-32 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            02 — Career Trajectory
          </p>

          <h2 className="mt-8 font-display text-5xl font-medium md:text-7xl">
            Experience<span className="text-white/20">.</span>
          </h2>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="gsap-section-reveal border-t border-white/10 px-6 py-32 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            03 — Selected Work
          </p>

          <h2 className="mt-8 font-display text-5xl font-medium md:text-7xl">
            Projects<span className="text-white/20">.</span>
          </h2>
        </div>
      </section>

      {/* Stack Section */}
      <section
        id="stack"
        className="gsap-section-reveal border-t border-white/10 px-6 py-32 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            04 — Technology
          </p>

          <h2 className="mt-8 font-display text-5xl font-medium md:text-7xl">
            My Stack<span className="text-white/20">.</span>
          </h2>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="gsap-section-reveal border-t border-white/10 px-6 py-32 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            05 — Contact
          </p>

          <h2 className="mt-8 max-w-5xl font-display text-5xl font-medium leading-none md:text-8xl">
            Let's build
            <br />
            something <span className="text-white/30">intelligent.</span>
          </h2>

          <a
            href="mailto:badalsahu200ns@gmail.com"
            className="mt-12 inline-block border-b border-accent pb-2 text-lg text-accent transition hover:opacity-80"
          >
            badalsahu200ns@gmail.com
          </a>
        </div>
      </section>
    </main>
  );
}

export default App;