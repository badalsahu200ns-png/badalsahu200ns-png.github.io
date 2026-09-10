```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const middleNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const sceneWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reducedMotion) {
        gsap.set(
          [
            badgeRef.current,
            firstNameRef.current,
            middleNameRef.current,
            lastNameRef.current,
            subtitleRef.current,
            descriptionRef.current,
            statementRef.current,
            ctaRef.current,
            portraitRef.current,
          ],
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }
        );

        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          badgeRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 }
        )
        .fromTo(
          firstNameRef.current,
          { opacity: 0, x: -60 },
          { opacity: 1, x: 0, duration: 0.8 },
          "-=0.35"
        )
        .fromTo(
          middleNameRef.current,
          { opacity: 0, x: -60 },
          { opacity: 1, x: 0, duration: 0.8 },
          "-=0.55"
        )
        .fromTo(
          lastNameRef.current,
          { opacity: 0, x: -60 },
          { opacity: 1, x: 0, duration: 0.8 },
          "-=0.55"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.35"
        )
        .fromTo(
          descriptionRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.45"
        )
        .fromTo(
          statementRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.45"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.45"
        )
        .fromTo(
          portraitRef.current,
          {
            opacity: 0,
            scale: 0.92,
            x: 50,
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1.2,
          },
          "-=0.9"
        );

      if (portraitRef.current) {
        gsap.to(portraitRef.current, {
          y: -8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5,
        });
      }

      if (sceneWrapRef.current) {
        const glow = sceneWrapRef.current.querySelector(
          ".portrait-glow"
        ) as HTMLElement | null;

        if (glow) {
          gsap.to(glow, {
            scale: 1.08,
            opacity: 0.7,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen overflow-hidden bg-black text-white"
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(rgba(118,255,3,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(118,255,3,0.18)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#76ff03]/[0.035] blur-[140px]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-20 pt-28 sm:px-10 lg:grid-cols-12 lg:gap-4 lg:px-12 lg:pt-20">
        {/* LEFT SIDE */}
        <div className="relative z-20 lg:col-span-7">
          {/* Status */}
          <div
            ref={badgeRef}
            className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#76ff03]/30 bg-[#76ff03]/[0.06] px-4 py-2 backdrop-blur-md"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#76ff03] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#76ff03]" />
            </span>

            <span className="font-mono text-[10px] tracking-[0.18em] text-[#76ff03] sm:text-xs">
              DATA ANALYST • GENAI ARCHITECT
            </span>

            <span className="hidden font-mono text-[9px] text-white/40 sm:inline">
              // SYSTEM_READY
            </span>
          </div>

          {/* Name */}
          <div className="select-none">
            <div className="overflow-hidden">
              <span
                ref={firstNameRef}
                className="block text-[clamp(4rem,11vw,8.5rem)] font-black leading-[0.78] tracking-[-0.07em] text-white"
              >
                BADAL
              </span>
            </div>

            <div className="overflow-hidden">
              <span
                ref={middleNameRef}
                className="block bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-[clamp(4rem,11vw,8.5rem)] font-black leading-[0.78] tracking-[-0.07em] text-transparent"
              >
                KUMAR
              </span>
            </div>

            <div className="overflow-hidden">
              <span
                ref={lastNameRef}
                className="block bg-gradient-to-r from-[#76ff03] via-[#b6ff70] to-[#76ff03] bg-clip-text text-[clamp(4rem,11vw,8.5rem)] font-black leading-[0.78] tracking-[-0.07em] text-transparent"
              >
                SAHU<span className="text-white">.</span>
              </span>
            </div>
          </div>

          {/* Roles */}
          <div
            ref={subtitleRef}
            className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm uppercase tracking-[0.12em] sm:text-base"
          >
            <span className="text-[#76ff03]">Data Analyst</span>

            <span className="text-white/20">/</span>

            <span className="text-white/75">Generative AI</span>

            <span className="text-white/20">/</span>

            <span className="text-white/75">Google Cloud</span>
          </div>

          {/* Description */}
          <p
            ref={descriptionRef}
            className="mt-6 max-w-2xl text-base leading-7 text-white/55 sm:text-lg"
          >
            Building intelligent, data-driven products that transform complex
            information into clear business decisions, actionable insights,
            and AI-powered experiences.
          </p>

          {/* Statement */}
          <p
            ref={statementRef}
            className="mt-7 max-w-2xl border-l-2 border-[#76ff03] pl-5 text-sm leading-6 text-white/75 sm:text-base"
          >
            <span className="text-[#76ff03]">“</span>
            Data into insights. Insights into products. Products powered by AI.
            <span className="text-[#76ff03]">”</span>
          </p>

          {/* Buttons */}
          <div
            ref={ctaRef}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-3 rounded-full bg-[#76ff03] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(118,255,3,0.35)]"
            >
              Explore My Work

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#76ff03]/50 hover:bg-[#76ff03]/[0.06]"
            >
              Let&apos;s Connect

              <span className="text-[#76ff03] transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </a>
          </div>

          {/* Experience */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-10 bg-[#76ff03]/50" />

            <span className="font-mono text-[9px] tracking-[0.2em] text-white/35">
              5+ YRS CROSS-INDUSTRY IMPACT
            </span>
          </div>
        </div>

        {/* RIGHT SIDE — PORTRAIT ONLY */}
        <div
          ref={sceneWrapRef}
          className="relative z-10 flex min-h-[520px] items-center justify-center sm:min-h-[620px] lg:col-span-5 lg:min-h-[720px]"
        >
          {/* Green aura */}
          <div className="portrait-glow pointer-events-none absolute left-1/2 top-1/2 h-[430px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#76ff03]/10 blur-[90px] sm:h-[540px] sm:w-[380px]" />

          {/* Secondary aura */}
          <div className="pointer-events-none absolute left-1/2 top-[55%] h-[350px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#76ff03]/10" />

          {/* Portrait */}
          <div className="relative z-20 flex items-center justify-center">
            <img
              ref={portraitRef}
              src="/images/HERO — FRONT STANDING VERSION.png"
              alt="Badal Kumar Sahu"
              className="h-[500px] w-auto max-w-none object-contain drop-shadow-[0_0_45px_rgba(0,255,135,0.18)] sm:h-[600px] lg:h-[700px]"
            />

            {/* Bottom glow */}
            <div className="pointer-events-none absolute bottom-[3%] left-1/2 h-16 w-56 -translate-x-1/2 rounded-full bg-[#76ff03]/20 blur-3xl" />
          </div>

          {/* HUD top right */}
          <div className="absolute right-0 top-[10%] z-30 hidden text-right sm:block">
            <div className="font-mono text-[9px] tracking-[0.18em] text-[#76ff03]">
              IDENTITY // 001
            </div>

            <div className="mt-1 font-mono text-[8px] tracking-[0.15em] text-white/30">
              HUMAN × DATA × AI
            </div>
          </div>

          {/* HUD left */}
          <div className="absolute left-0 top-[30%] z-30 hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#76ff03] shadow-[0_0_10px_#76ff03]" />

              <span className="font-mono text-[8px] tracking-[0.2em] text-white/45">
                SYSTEM: OPTIMAL
              </span>
            </div>

            <div className="mt-2 font-mono text-[8px] tracking-[0.15em] text-white/25">
              CORE: AI_ANALYTICS
            </div>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-[5%] left-1/2 z-30 w-full -translate-x-1/2 text-center">
            <div className="font-mono text-[9px] tracking-[0.28em] text-[#76ff03]/70">
              DATA → AI → CLOUD → INSIGHT
            </div>

            <div className="mx-auto mt-3 h-px w-28 bg-[#76ff03]/40" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="font-mono text-[8px] tracking-[0.25em] text-white/25">
          SCROLL TO EXPLORE
        </span>

        <div className="h-8 w-px bg-[#76ff03]/40" />
      </div>

      {/* Corner HUD */}
      <div className="pointer-events-none absolute bottom-6 left-6 hidden font-mono text-[8px] tracking-[0.15em] text-white/20 lg:block">
        BS // 2026
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 hidden font-mono text-[8px] tracking-[0.15em] text-white/20 lg:block">
        BHUBANESWAR // INDIA
      </div>
    </section>
  );
};

export default Hero;
```