import { Briefcase, Database, Cpu, Layers, CheckCircle2, TrendingUp } from 'lucide-react';

export function About() {
  const pillars = [
    {
      icon: Briefcase,
      title: 'BUSINESS',
      subtitle: 'Commercial Acumen',
      description: '5+ years driving multi-million revenue pipelines, leading 20+ sales leaders, and navigating high-stakes enterprise negotiations.',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/[0.03]',
    },
    {
      icon: Database,
      title: 'DATA',
      subtitle: 'Analytical Conviction',
      description: 'Translating petabyte-scale telemetry into predictive insights using SQL, BigQuery, Python, Power BI, and statistical cohort models.',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      bgColor: 'bg-cyan-500/[0.03]',
    },
    {
      icon: Cpu,
      title: 'AI & GENAI',
      subtitle: 'Cognitive Automation',
      description: 'Architecting autonomous LLM agents, RAG vector pipelines, and Gemini integrations that solve complex operational problems.',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      bgColor: 'bg-purple-500/[0.03]',
    },
    {
      icon: Layers,
      title: 'PRODUCT',
      subtitle: 'Strategic Execution',
      description: 'Formulating end-to-end product discovery, user journeys, feature roadmaps, and metric loops that convert ideas into sticky software.',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      bgColor: 'bg-amber-500/[0.03]',
    }
  ];

  const industries = [
    'PropTech',
    'Travel-tech',
    'BFSI',
    'Insurance',
    'Telecom',
    'E-commerce',
    'Enterprise Business'
  ];

  return (
    <section id="about" className="py-24 relative tech-grid-bg border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              01 // CORE POSITIONING
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              BUSINESS <span className="text-emerald-400">&times;</span> DATA <span className="text-cyan-400">&times;</span> AI <span className="text-purple-400">&times;</span> PRODUCT
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-xs text-slate-400 max-w-sm">
            Fusing 5+ years of frontline commercial acumen with bleeding-edge generative AI & enterprise analytics.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          
          {/* Left Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-slate-300 text-base sm:text-lg leading-relaxed">
            <p>
              In modern markets, analytics without business context produces meaningless dashboards, while AI without product strategy produces fragile prototypes.
            </p>
            <p className="text-slate-200">
              <strong className="text-white font-semibold">Badal Kumar Sahu</strong> bridges this chasm. Having managed tier-1 real estate revenue at <span className="text-emerald-400">Magicbricks</span>, mobility accounts at <span className="text-cyan-400">redBus</span>, nationwide distribution teams at <span className="text-slate-100">Reliance</span>, and bancassurance at <span className="text-purple-400">ICICI Prudential</span>, he approaches every dataset with strategic intuition and revenue accountability.
            </p>
            <p className="text-slate-400 text-base">
              Now advancing into deep cloud data engineering with Google Cloud and autonomous Generative AI solutions, Badal engineers systems that do not merely report what happened—they anticipate customer actions and autonomously execute intelligent workflows.
            </p>

            {/* Core Values Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Revenue-Obsessed Data Modeling',
                'Autonomous Multi-Agent AI Architectures',
                'Petabyte-Scale BigQuery Analytics',
                'User-Centric Product Discovery'
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Highlight Box: Cross-Industry Footprint */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-xl border border-white/10 bg-[#090d16]/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-wider mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>PROVEN DOMAIN MASTERY</span>
            </div>

            <h3 className="text-xl font-display font-semibold text-white mb-3">
              5+ Years Across 7 Core Sectors
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-mono">
              Deep operational intuition across competitive digital marketplaces, financial risk models, high-volume logistics, and enterprise services:
            </p>

            {/* Industry Badges */}
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <span
                  key={ind}
                  className="px-3 py-1.5 rounded text-xs font-mono tracking-wider border border-white/10 bg-white/[0.03] text-slate-200 hover:border-emerald-400/60 hover:text-emerald-300 transition-colors cursor-default"
                >
                  {ind}
                </span>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>LOCATION // INDIA</span>
              <span className="text-emerald-400">STATUS // ACTIVE LEAD</span>
            </div>
          </div>

        </div>

        {/* 4 Strategic Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`p-6 rounded-lg border ${pillar.borderColor} ${pillar.bgColor} hover:border-white/20 transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`p-2.5 rounded border border-white/10 bg-white/[0.03] ${pillar.color}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">PILLAR</span>
                  </div>
                  <h4 className="text-lg font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {pillar.title}
                  </h4>
                  <div className="text-xs font-mono text-slate-400 mb-3">
                    {pillar.subtitle}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
