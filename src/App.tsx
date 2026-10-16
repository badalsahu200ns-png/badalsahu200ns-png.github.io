import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { CinematicBackground } from './components/CinematicBackground';
import { SolarSystemEntry } from './components/SolarSystemEntry';
import { HudHeader } from './components/HudHeader';
import { HudFooter } from './components/HudFooter';
import { GameTitleScreen } from './components/GameTitleScreen';
import { ResumeModal } from './components/ResumeModal';
import { TransportationManager } from './components/transportation/TransportationManager';
import { trackVisitorArrival } from './services/visitorNotification';

const ProfileView = lazy(() => import('./components/views/ProfileView').then(m => ({ default: m.ProfileView })));
const InternshipsView = lazy(() => import('./components/views/InternshipsView').then(m => ({ default: m.InternshipsView })));
const ExperienceView = lazy(() => import('./components/views/ExperienceView').then(m => ({ default: m.ExperienceView })));
const ProjectsView = lazy(() => import('./components/views/ProjectsView').then(m => ({ default: m.ProjectsView })));
const EducationView = lazy(() => import('./components/views/EducationView').then(m => ({ default: m.EducationView })));
const CertificationsView = lazy(() => import('./components/views/CertificationsView').then(m => ({ default: m.CertificationsView })));
const CoreSkillsView = lazy(() => import('./components/views/CoreSkillsView').then(m => ({ default: m.CoreSkillsView })));
const TechnicalSkillsView = lazy(() => import('./components/views/TechnicalSkillsView').then(m => ({ default: m.TechnicalSkillsView })));
const ContactView = lazy(() => import('./components/views/ContactView').then(m => ({ default: m.ContactView })));

const VALID_SECTIONS = [
  'profile',
  'internships',
  'experience',
  'projects',
  'education',
  'certifications',
  'core-skills',
  'technical-skills',
  'contact',
];

function getInitialSection(): string | null {
  if (typeof window === 'undefined') return null;
  const rawHash = window.location.hash.replace('#', '').trim().toLowerCase();
  return VALID_SECTIONS.includes(rawHash) ? rawHash : null;
}

export function App() {
  const initialSection = getInitialSection();
  const [openingFinished, setOpeningFinished] = useState<boolean>(() => {
    // Fresh visits (no hash deep-link) MUST always present the restored Pilot Welcome entry screen first.
    return Boolean(initialSection);
  });
  const [visitorName, setVisitorName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('badal_visitor_name') || '';
    }
    return '';
  });
  const [currentSection, setCurrentSection] = useState<string | null>(initialSection);
  const [transitDestination, setTransitDestination] = useState<string | null>(null);
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);

  // Sync section with URL hash and browser back/forward navigation
  const updateSectionFromHash = useCallback(() => {
    const rawHash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (VALID_SECTIONS.includes(rawHash)) {
      setCurrentSection(rawHash);
      setTransitDestination(null);
      setOpeningFinished(true); // Direct deep-link skips opening
    } else {
      setCurrentSection(null);
      setTransitDestination(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', updateSectionFromHash);
    window.addEventListener('popstate', updateSectionFromHash);
    // Safe anonymous session arrival notification (at most once per session)
    trackVisitorArrival(visitorName || undefined);
    return () => {
      window.removeEventListener('hashchange', updateSectionFromHash);
      window.removeEventListener('popstate', updateSectionFromHash);
    };
  }, [updateSectionFromHash, visitorName]);

  const handleSelectSection = (sectionId: string) => {
    if (VALID_SECTIONS.includes(sectionId)) {
      setTransitDestination(sectionId);
    }
  };

  const handleTransitArrival = useCallback(() => {
    if (transitDestination) {
      setCurrentSection(transitDestination);
      window.location.hash = `#${transitDestination}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTransitDestination(null);
    }
  }, [transitDestination]);

  const handleBackToMenu = useCallback(() => {
    setTransitDestination(null);
    setCurrentSection(null);
    if (window.location.hash) {
      history.pushState(null, '', window.location.pathname);
    }
  }, []);

  // Re-launch the cinematic pilot welcome and entry sequence
  const handleReplayLaunch = useCallback(() => {
    setTransitDestination(null);
    setCurrentSection(null);
    setOpeningFinished(false);
    if (window.location.hash) {
      history.pushState(null, '', window.location.pathname);
    }
  }, []);

  // Global ESC key handling: close modal first, or return to title menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (resumeOpen) {
          setResumeOpen(false);
        } else if (transitDestination) {
          handleTransitArrival();
        } else if (currentSection) {
          handleBackToMenu();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resumeOpen, transitDestination, currentSection, handleTransitArrival, handleBackToMenu]);

  return (
    <div className="relative min-h-screen bg-[#05070a] text-white selection:bg-emerald-400/30 selection:text-emerald-300 overflow-x-hidden font-sans">
      
      {/* 1. Cinematic Background Video & Overlay */}
      <CinematicBackground opacity={currentSection ? 0.28 : 0.65} />

      {/* 2. Opening Solar System Transition & Visitor Personalization */}
      {!openingFinished && (
        <SolarSystemEntry
          onComplete={(name) => {
            setVisitorName(name);
            setOpeningFinished(true);
            try {
              localStorage.setItem('badal_visitor_name', name);
            } catch {
              // ignore
            }
          }}
        />
      )}

      {/* 3. Top HUD Chrome */}
      <HudHeader
        currentSection={currentSection}
        onBackToMenu={handleBackToMenu}
        onResumeClick={() => setResumeOpen(true)}
        onReplayLaunch={handleReplayLaunch}
      />

      {/* 4. Main Interactive Area */}
      <main className="relative z-10 transition-opacity duration-300">
        {!currentSection && (
          <GameTitleScreen
            onSelectSection={handleSelectSection}
            onResumeClick={() => setResumeOpen(true)}
            visitorName={visitorName}
          />
        )}

        {/* 3D Transportation Experience (plays upon selecting a career chapter) */}
        {transitDestination && (
          <TransportationManager
            key={transitDestination}
            destinationId={transitDestination}
            onArrival={handleTransitArrival}
          />
        )}

        {currentSection && (
          <Suspense
            fallback={
              <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono text-xs text-slate-400 gap-3 pt-20">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <span className="tracking-widest uppercase text-slate-300">INITIALIZING // MODULE_VIEW</span>
              </div>
            }
          >
            {currentSection === 'profile' && (
              <ProfileView
                onNavigateToSection={handleSelectSection}
                onResumeClick={() => setResumeOpen(true)}
              />
            )}

            {currentSection === 'internships' && <InternshipsView />}

            {currentSection === 'experience' && <ExperienceView />}

            {currentSection === 'projects' && <ProjectsView />}

            {currentSection === 'education' && <EducationView />}

            {currentSection === 'certifications' && <CertificationsView />}

            {currentSection === 'core-skills' && <CoreSkillsView />}

            {currentSection === 'technical-skills' && <TechnicalSkillsView />}

            {currentSection === 'contact' && <ContactView />}
          </Suspense>
        )}
      </main>

      {/* 5. Bottom HUD Chrome */}
      <HudFooter currentSection={currentSection} />

      {/* 6. Digital Resume Download Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </div>
  );
}

export default App;