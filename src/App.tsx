import { useState } from 'react';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { Projects } from './components/Projects';
import { TechStack } from './components/TechStack';
import { Process } from './components/Process';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';

function App() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void text-white selection:bg-emerald-400/30 selection:text-emerald-300">
      <Navbar onResumeClick={() => setResumeOpen(true)} />

      <main>
        <Hero />
        <Stats />
        <About />
        <Experience />
        <Education />
        <Projects />
        <TechStack />
        <Process />
        <Certifications />
        <Contact />
      </main>

      <Footer />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </div>
  );
}

export default App;