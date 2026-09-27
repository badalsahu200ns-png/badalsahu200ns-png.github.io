import React, { useState } from 'react';
import { profileData } from '../../data/portfolioData';
import { Mail, ExternalLink, Send, CheckCircle2, MessageSquare, Sparkles, Globe, Clock, ShieldCheck } from 'lucide-react';
import { GithubIcon } from '../icons/GithubIcon';

export function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'High-Impact AI / Analytics Opportunity',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const subject = encodeURIComponent(`[Direct Channel] ${formData.topic} - ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Badal,\n\nName: ${formData.name}\nEmail: ${formData.email}\nTopic: ${formData.topic}\n\nMessage:\n${formData.message}`
    );

    window.location.href = `mailto:${profileData.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
      
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            09 // DIRECT COLLABORATION CHANNEL //
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            COMMUNICATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">ENDPOINTS</span>
          </h2>
        </div>
        <div className="mt-4 sm:mt-0 font-mono text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>DIRECT ENCRYPTED TRANSMISSION</span>
        </div>
      </div>

      {/* Main Grid: Prominent Communication Endpoints Left + Interactive Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Communication Endpoints */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#080c16]/95 backdrop-blur-md flex flex-col justify-between shadow-2xl">
          <div>
            <span className="font-mono text-xs text-emerald-400 tracking-wider mb-2 block uppercase">
              COMMUNICATION ENDPOINTS //
            </span>
            <h3 className="text-2xl font-display font-bold text-white mb-3">
              Reach Out Directly
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono mb-6">
              Available for high-impact Data Analyst, Generative AI Specialist, and Product Intelligence roles. Open to consulting and strategic architecture discussions.
            </p>

            {/* Direct Channel Cards */}
            <div className="space-y-3.5">
              
              {/* Primary Email */}
              <a
                href={`mailto:${profileData.email}`}
                className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      PRIMARY EMAIL
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                      {profileData.email}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </a>

              {/* LinkedIn */}
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/[0.04] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <ExternalLink className="w-5 h-5" />
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      PROFESSIONAL NETWORK
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      linkedin.com/in/badalsahu200ns
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>

              {/* GitHub */}
              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-purple-500/40 hover:bg-purple-500/[0.04] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <GithubIcon className="w-5 h-5" />
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      CODE REPOSITORIES
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                      github.com/badalsahu200ns-png
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </a>

            </div>

            {/* Strategic Real Photo: Contact Identity */}
            {profileData.contactImage && (
              <div className="mt-4 p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-emerald-500/30 shrink-0">
                  <img
                    src={profileData.contactImage}
                    alt="Badal Kumar Sahu"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">
                    DIRECT ACCESS // VERIFIED
                  </span>
                  <span className="font-display text-sm font-bold text-white">
                    Badal Kumar Sahu
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Ready for impactful technical missions
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Status & Location Footer */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] space-y-2 font-mono text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                STATUS: {profileData.availability}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {profileData.timezone}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 pt-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{profileData.workMode}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Transmission Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#080c16]/95 backdrop-blur-md relative flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>INITIATE DIRECT TRANSMISSION</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CLIENT-SIDE DISPATCH
              </span>
            </div>

            {submitted ? (
              <div className="p-8 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] text-center my-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-bounce" />
                <h4 className="text-xl font-display font-bold text-white mb-2">
                  Transmission Dispatched!
                </h4>
                <p className="text-sm font-mono text-slate-300 max-w-md mx-auto mb-6">
                  Your mail client has been opened with your structured message. Badal will review and respond promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-lg border border-emerald-500/40 text-emerald-300 font-mono text-xs hover:bg-emerald-500/10 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-2">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Morgan"
                      className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-white font-mono text-sm focus:outline-none focus:border-emerald-400 transition-colors"
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
                      className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-white font-mono text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-2">
                    COLLABORATION TOPIC
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-[#0c101c] text-slate-200 font-mono text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    <option value="High-Impact AI / Analytics Opportunity">High-Impact AI / Analytics Opportunity</option>
                    <option value="Generative AI & Agentic Systems Consultation">Generative AI &amp; Agentic Systems Consultation</option>
                    <option value="BigQuery & Cloud Data Architecture">BigQuery &amp; Cloud Data Architecture</option>
                    <option value="Product Analytics & Strategic Architecture">Product Analytics &amp; Strategic Architecture</option>
                    <option value="General Professional Inquiry">General Professional Inquiry</option>
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
                    className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-white font-mono text-sm focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(118,255,3,0.3)] hover:shadow-[0_0_30px_rgba(118,255,3,0.5)] flex items-center justify-center gap-2"
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

    </div>
  );
}
