import { useState, useEffect, lazy, Suspense } from 'react';
import { skillsData } from '../../data/portfolioData';
import type { TechnicalSkillCategory } from '../../data/portfolioData';
import { WebGLErrorBoundary } from '../common/WebGLErrorBoundary';
import { CheckCircle2, Box, Eye, Sparkles, Loader2 } from 'lucide-react';

const SkillsConstellationCanvas = lazy(() =>
  import('../3d/SkillsConstellation').then((m) => ({ default: m.SkillsConstellationCanvas }))
);

export function TechnicalSkillsView() {
  const isMobileClient = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const isReducedMotionClient = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    skillsData.technicalCategories[0]?.id || ''
  );
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(() => (isMobileClient ? '2d' : '3d'));
  const [reducedMotion, setReducedMotion] = useState(() => isReducedMotionClient);
  const [isMobile, setIsMobile] = useState(() => isMobileClient);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', motionHandler);

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setViewMode('2d'); // default to lightweight 2D on mobile for battery & performance
      }
    };

    window.addEventListener('resize', checkMobile, { passive: true });
    return () => {
      mq.removeEventListener('change', motionHandler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const activeCategory: TechnicalSkillCategory =
    skillsData.technicalCategories.find((c) => c.id === activeCategoryId) ||
    skillsData.technicalCategories[0];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
      
      {/* Header HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            08 // 3D CONSTELLATION &amp; TECHNICAL MATRIX
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            TECHNICAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">SKILLS</span>
          </h2>
        </div>

        {/* View Switcher: 3D Constellation vs 2D Fallback */}
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all border flex items-center gap-1.5 ${
              viewMode === '3d'
                ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 font-bold shadow-[0_0_12px_rgba(118,255,3,0.2)]'
                : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D CONSTELLATION</span>
          </button>

          <button
            onClick={() => setViewMode('2d')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all border flex items-center gap-1.5 ${
              viewMode === '2d'
                ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2D MATRIX</span>
          </button>
        </div>
      </div>

      {/* Career Technology Orbit Progression Banner */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl border border-emerald-500/25 bg-[#080c16]/90 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.06]">
          <span className="font-mono text-xs text-emerald-400 tracking-wider uppercase font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CAREER AS A TECHNOLOGY ORBIT // EXPANDING ARCHITECTURE
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            INTELLIGENCE LAYER &amp; INFRASTRUCTURE LAYER
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 text-center">
          {[
            { step: '01', domain: 'DATA ANALYTICS', focus: 'Telemetry & Insights', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
            { step: '02', domain: 'GENERATIVE AI', focus: 'Reasoning & LLM Agents', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
            { step: '03', domain: 'SOFTWARE DEVELOPMENT', focus: 'Production Code & APIs', color: 'border-lime-500/40 text-lime-400 bg-lime-500/10' },
            { step: '04', domain: 'CLOUD COMPUTING', focus: 'AWS & Compute Foundations', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
            { step: '05', domain: 'AI + CLOUD PRODUCTS', focus: 'Scalable Intelligence', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
          ].map((orbit, i) => (
            <div
              key={orbit.domain}
              className={`p-3 rounded-xl border ${orbit.color} flex flex-col justify-between transition-all hover:scale-[1.02]`}
            >
              <div className="font-mono text-[10px] opacity-75 mb-1 font-bold">
                ORBIT {orbit.step} {i < 4 ? '→' : '★'}
              </div>
              <div className="font-display text-xs sm:text-sm font-extrabold text-white leading-tight mb-1">
                {orbit.domain}
              </div>
              <div className="font-mono text-[9px] text-slate-400">
                {orbit.focus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual 3D Orbit / 2D Matrix */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/10 bg-[#080c16]/90 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[440px] sm:min-h-[500px]">
          
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4 pb-2 border-b border-white/[0.06]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {viewMode === '3d' ? '3D ORBITAL KNOWLEDGE GRAPH' : '2D INTERACTIVE CATEGORY MATRIX'}
            </span>
            <span>{skillsData.technicalCategories.length} CATEGORIES</span>
          </div>

          {/* 3D Canvas with Fallback */}
          {viewMode === '3d' && !isMobile ? (
            <div className="relative w-full h-[360px] sm:h-[420px]">
              <WebGLErrorBoundary
                fallback={
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 font-mono text-xs text-slate-400">
                    <p className="text-amber-400 mb-2">WebGL not available on this device.</p>
                    <p>Switching to high-performance 2D matrix view.</p>
                  </div>
                }
              >
                <Suspense
                  fallback={
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                      <span>INITIALIZING 3D ORBITAL MATRIX...</span>
                    </div>
                  }
                >
                  <SkillsConstellationCanvas
                    activeCategoryId={activeCategoryId}
                    onSelectCategory={setActiveCategoryId}
                    reducedMotion={reducedMotion}
                  />
                </Suspense>
              </WebGLErrorBoundary>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500 pointer-events-none">
                CLICK NODES OR DRAG TO ROTATE 3D ORBITS
              </div>
            </div>
          ) : (
            /* 2D Fallback / Mobile View */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              {skillsData.technicalCategories.map((cat, idx) => {
                const isSelected = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all font-mono text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/15 text-white shadow-[0_0_15px_rgba(118,255,3,0.15)]'
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[10px] text-emerald-400 mb-2">
                      0{idx + 1} //
                    </span>
                    <span className="font-bold uppercase tracking-wider line-clamp-2">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-2">
                      {cat.skills.length} Skills
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Selector Pills Below 3D Canvas */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-1.5">
            {skillsData.technicalCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all border ${
                  cat.id === activeCategoryId
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Active Category Inspection */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#080c16]/95 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {activeCategory && (
            <div>
              <div className="pb-4 mb-6 border-b border-white/[0.08]">
                <span className="font-mono text-xs text-emerald-400 tracking-wider uppercase block mb-1">
                  ACTIVE TECHNICAL DOMAIN //
                </span>
                <h3 className="text-2xl font-display font-bold text-white">
                  {activeCategory.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Verified tools, libraries &amp; frameworks configured for production.
                </p>
              </div>

              {/* Skills List in Domain */}
              <div className="space-y-3">
                {activeCategory.skills.map((skill, index) => (
                  <div
                    key={skill}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-emerald-500/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] bg-white/[0.05] text-slate-400">
                        0{index + 1}
                      </span>
                      <span className="font-mono text-sm text-slate-200 group-hover:text-white font-medium">
                        {skill}
                      </span>
                    </div>

                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
