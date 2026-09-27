
import { DeploymentStatusBadge } from './common/DeploymentStatusBadge';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-4">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-400">
            Data Analyst · Generative AI · Google Cloud
          </p>
          <DeploymentStatusBadge align="center" />
        </div>

        <h1 className="my-6 flex items-center justify-center">
          <span className="sr-only">Badal Kumar Sahu</span>
          <img
            src="/images/badal.png"
            alt="Badal Kumar Sahu"
            className="h-44 sm:h-56 md:h-64 lg:h-72 w-auto max-w-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] contrast-[1.04] brightness-[1.02] select-none"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/media/profile/badal.png';
            }}
          />
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400 md:text-xl">
          Data Analyst &amp; Generative AI Specialist building
          AI-powered products, analytics solutions and intelligent
          cloud applications.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/badalsahu200ns-png"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/badalsahu200ns/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
