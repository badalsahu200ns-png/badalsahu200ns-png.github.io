import { useState } from 'react';
import { problemSolvingFlow } from '../data/skills';
import { GitCommit, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';

export function Process() {
  const [activeStep, setActiveStep] = useState<string>('01');

  return (
    <section id="process" className="py-24 relative tech-grid-bg border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              06 // EXECUTION METHODOLOGY
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              PROBLEM SOLVING <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">FLOW</span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-xs text-slate-400 max-w-sm">
            End-to-end disciplined pipeline transforming vague business ambiguity into verified commercial ROI.
          </p>
        </div>

        {/* Pipeline Diagram Bar (Desktop Overview) */}
        <div className="hidden lg:flex items-center justify-between gap-1 p-3 rounded-2xl border border-white/10 bg-[#080c16]/90 mb-12 overflow-x-auto">
          {problemSolvingFlow.map((step, idx) => {
            const isSelected = activeStep === step.step;
            return (
              <div key={step.step} className="flex items-center">
                <button
                  onClick={() => setActiveStep(step.step)}
                  className={`px-3 py-2.5 rounded-xl border font-mono text-xs tracking-wider transition-all duration-200 flex items-center gap-2 ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 font-bold shadow-[0_0_15px_rgba(0,255,135,0.2)]'
                      : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:border-white/15'
                  }`}
                >
                  <span className="text-[10px] text-emerald-400/80">{step.step}</span>
                  <span className="truncate max-w-[110px]">{step.name}</span>
                </button>
                {idx < problemSolvingFlow.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 mx-1 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* 7 Interactive Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {problemSolvingFlow.map((step) => {
            const isSelected = activeStep === step.step;

            return (
              <div
                key={step.step}
                onClick={() => setActiveStep(step.step)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500/50 bg-[#0a0f1d] shadow-[0_0_25px_rgba(0,255,135,0.1)]'
                    : 'border-white/10 bg-[#080c16]/80 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Top HUD */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                      {step.step}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border border-white/10 bg-white/[0.04] text-cyan-300">
                      PHASE // {step.phase}
                    </span>
                  </div>

                  {/* Step Name */}
                  <h3 className="text-lg font-display font-bold text-white mb-2">
                    {step.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Deliverable Box */}
                <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 mb-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>TANGIBLE DELIVERABLE:</span>
                  </div>
                  <div className="font-mono text-xs font-semibold text-slate-200">
                    {step.deliverable}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Indicator */}
        <div className="mt-8 flex lg:hidden items-center justify-center gap-2 font-mono text-xs text-slate-500">
          <GitCommit className="w-4 h-4 text-emerald-400" />
          <span>7-STAGE DISCIPLINED ARCHITECTURAL PROCESS</span>
          <ChevronDown className="w-3 h-3" />
        </div>

      </div>
    </section>
  );
}
