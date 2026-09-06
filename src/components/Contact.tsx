import React, { useState } from 'react';
import { Mail, ExternalLink, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Full-Time AI / Analytics Opportunity',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Compose mailto link
    const subject = encodeURIComponent(`[Portfolio Inquiry] ${formData.topic} - ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Badal,\n\nName: ${formData.name}\nEmail: ${formData.email}\nTopic: ${formData.topic}\n\nMessage:\n${formData.message}`
    );

    window.location.href = `mailto:badalsahu200ns@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 relative tech-grid-bg border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/[0.05]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            09 // DIRECT COLLABORATION CHANNEL
          </div>
          
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05] max-w-4xl select-none">
            LET&apos;S BUILD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">
              SOMETHING INTELLIGENT.
            </span>
          </h2>

          <p className="mt-6 text-lg sm:text-xl font-mono text-slate-300 flex items-center justify-center gap-3 flex-wrap">
            <span className="text-emerald-400 font-bold">Data.</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-cyan-400 font-bold">AI.</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-purple-400 font-bold">Products.</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-white font-bold">Impact.</span>
          </p>
        </div>

        {/* Contact Grid: Direct Info Left + Interactive Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Direct Links & Status */}
          <div className="lg:col-span-5 p-8 rounded-2xl border border-white/10 bg-[#080c16]/90 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-emerald-400 tracking-wider mb-2 block">
                COMMUNICATION ENDPOINTS //
              </span>
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                Reach Out Directly
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-mono mb-8">
                Available for high-impact Data Analyst, Generative AI Specialist, and Product Intelligence roles. Open to consulting and strategic architecture discussions.
              </p>

              {/* Direct Links */}
              <div className="space-y-4">
                {/* Email */}
                <a
                  href="mailto:badalsahu200ns@gmail.com"
                  className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-mono text-slate-500">PRIMARY EMAIL</span>
                      <span className="text-sm font-mono font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                        badalsahu200ns@gmail.com
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/badalsahu200ns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/[0.04] transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <ExternalLink className="w-5 h-5" />
                    </span>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-mono text-slate-500">PROFESSIONAL NETWORK</span>
                      <span className="text-sm font-mono font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                        linkedin.com/in/badalsahu200ns
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/badalsahu200ns-png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-purple-500/40 hover:bg-purple-500/[0.04] transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <GithubIcon className="w-5 h-5" />
                    </span>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-mono text-slate-500">CODE REPOSITORIES</span>
                      <span className="text-sm font-mono font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                        github.com/badalsahu200ns-png
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                STATUS: AVAILABLE NOW
              </span>
              <span className="text-slate-400">TIMEZONE: IST (UTC+5:30)</span>
            </div>
          </div>

          {/* Right Column: Transmission Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-2xl border border-white/10 bg-[#080c16]/90 relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>INITIATE DIRECT TRANSMISSION</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ENCRYPTED // SECURE
              </span>
            </div>

            {submitted ? (
              <div className="p-8 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] text-center my-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-bounce" />
                <h4 className="text-xl font-display font-bold text-white mb-2">
                  Transmission Dispatched!
                </h4>
                <p className="text-sm font-mono text-slate-300 max-w-md mx-auto mb-6">
                  Your mail client has been opened with your structured message. Badal will review and respond promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-lg border border-emerald-500/40 text-emerald-300 font-mono text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-2">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.03] text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@enterprise.com"
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.03] text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-2">
                    ENGAGEMENT TOPIC
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0c101c] text-slate-200 font-mono text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    <option value="Full-Time AI / Analytics Opportunity">Full-Time AI / Analytics Opportunity</option>
                    <option value="GenAI Architecture & Agentic Systems">GenAI Architecture &amp; Agentic Systems</option>
                    <option value="BigQuery & Cloud Data Consulting">BigQuery &amp; Cloud Data Consulting</option>
                    <option value="Product Analytics & Growth Advisory">Product Analytics &amp; Growth Advisory</option>
                    <option value="General Technical Inquiry">General Technical Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-2">
                    MESSAGE CONTENT *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your initiative, dataset challenge, role requirements, or collaboration idea..."
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.03] text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(0,255,135,0.3)] hover:shadow-[0_0_35px_rgba(0,255,135,0.5)] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT DISPATCH VIA MAIL</span>
                  <Sparkles className="w-4 h-4 ml-1" />
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
