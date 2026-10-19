/**
 * BADAL // 001 — TRANSPORTATION AUDIO MANIFEST
 * Explicit audio asset registry mapping all nine transportation modes
 * to their verified, distinct audio files.
 */

export interface ModeAudioDefinition {
  modeId: string;
  tabNumber: string;
  vehicleName: string;
  category: 'road' | 'aviation' | 'rail' | 'space' | 'marine' | 'stratosphere' | 'offroad' | 'vacuum-transit' | 'orbital';
  audioFilePath: string;
  audioLayers: string[];
  acousticProfile: string;
  baseVolume: number;
  loop: boolean;
  throttlePitchRange: [number, number]; // [idle playbackRate, max throttle playbackRate]
}

export const TRANSPORTATION_AUDIO_MANIFEST: Record<string, ModeAudioDefinition> = {
  profile: {
    modeId: 'profile',
    tabNumber: '01',
    vehicleName: 'Anti-Gravity Executive Hovercraft',
    category: 'road',
    audioFilePath: '/audio/transportation/mode-01-hovercraft.wav',
    audioLayers: [
      'Twin spool aviation turbine whine (440Hz – 720Hz)',
      'High-pressure air cushion ground skirt exhaust',
      'Magnetic repulsor field harmonic hum (110Hz / 330Hz)',
    ],
    acousticProfile: 'Executive aerospace turbine with high-pressure air rush and low magnetic levitation resonance.',
    baseVolume: 0.85,
    loop: true,
    throttlePitchRange: [0.85, 1.25],
  },

  internships: {
    modeId: 'internships',
    tabNumber: '02',
    vehicleName: 'Reconnaissance Quadcopter Drone',
    category: 'aviation',
    audioFilePath: '/audio/transportation/mode-02-drone.wav',
    audioLayers: [
      '4 outrunner brushless electric motors with detuned harmonics (280Hz, 295Hz, 315Hz, 330Hz)',
      'High-frequency blade passing frequency propeller chop (~220Hz pulse train)',
      'Turbulent rotor-wash air turbulence and 3800Hz stator PWM switching whine',
    ],
    acousticProfile: 'High-RPM multirotor quadcopter with distinct aerodynamic blade slap and electric motor buzz.',
    baseVolume: 0.8,
    loop: true,
    throttlePitchRange: [0.8, 1.3],
  },

  experience: {
    modeId: 'experience',
    tabNumber: '03',
    vehicleName: 'Futuristic Maglev Bullet Train',
    category: 'rail',
    audioFilePath: '/audio/transportation/mode-03-train.wav',
    audioLayers: [
      'Heavy steel wheel on rail rolling friction and low-frequency track rumble',
      'Rhythmic rail joint click-clack impacts (dual axle impulse pairs)',
      'Siemens/Alstom-style variable frequency traction inverter whine (500Hz – 1350Hz)',
      'Resonant two-tone pneumatic train horn (Eb4 / F#4 dual chord at key travel intervals)',
    ],
    acousticProfile: 'High-speed passenger rail with rhythmic rail joint impacts, steel track friction, and pneumatic horn.',
    baseVolume: 0.88,
    loop: true,
    throttlePitchRange: [0.85, 1.2],
  },

  projects: {
    modeId: 'projects',
    tabNumber: '04',
    vehicleName: 'Deep-Space Explorer Spacecraft',
    category: 'space',
    audioFilePath: '/audio/transportation/mode-04-spacecraft.wav',
    audioLayers: [
      '38Hz fusion drive sub-bass pulse with stereo panning',
      'Broadband ion plasma thruster exhaust rushing wind',
      'Deep cosmic cockpit interior resonance and binaural space harmonics',
    ],
    acousticProfile: 'Heavy deep-space fusion engine with sub-bass rumble, ion exhaust roar, and cosmic ambiance.',
    baseVolume: 0.9,
    loop: true,
    throttlePitchRange: [0.85, 1.25],
  },

  education: {
    modeId: 'education',
    tabNumber: '05',
    vehicleName: 'Ocean Research Submarine',
    category: 'marine',
    audioFilePath: '/audio/transportation/mode-05-submarine.wav',
    audioLayers: [
      '7-blade skewed brass propeller screw cavitation wake with 2.2Hz LFO water displacement',
      'Submerged deep ocean hydrodynamic pressure displacement',
      '52Hz submarine pressure hull resonance',
      'Active marine navigation sonar echo ping (1420Hz pure tone with acoustic reverberation tail)',
    ],
    acousticProfile: 'Deep ocean submersible with water cavitation whoosh, hull pressure hum, and echoing active sonar ping.',
    baseVolume: 0.86,
    loop: true,
    throttlePitchRange: [0.9, 1.15],
  },

  certifications: {
    modeId: 'certifications',
    tabNumber: '06',
    vehicleName: 'High-Altitude Research Balloon',
    category: 'stratosphere',
    audioFilePath: '/audio/transportation/mode-06-balloon.wav',
    audioLayers: [
      'Stratospheric gusty laminar wind whistling across rigging cables',
      'Rigging suspension cable aerodynamic tension flutter',
      'High-power dual propane gas burner blast roar with flame ignition dissipation',
    ],
    acousticProfile: 'Serene high-altitude atmospheric wind interrupted by roaring bursts of pressurized propane burners.',
    baseVolume: 0.84,
    loop: true,
    throttlePitchRange: [0.9, 1.1],
  },

  'core-skills': {
    modeId: 'core-skills',
    tabNumber: '07',
    vehicleName: 'All-Terrain Cyber Exploration Motorcycle',
    category: 'offroad',
    audioFilePath: '/audio/transportation/mode-07-motorcycle.wav',
    audioLayers: [
      '4-stroke internal combustion engine cylinder combustion firing impulses (45Hz – 120Hz)',
      'Tuned exhaust header pipe resonance with aggressive throaty bark',
      'Chunky knobby off-road tire tread traction roar on gravel and asphalt',
    ],
    acousticProfile: 'High-torque internal combustion motorcycle engine revving aggressively with knobby tire road noise.',
    baseVolume: 0.88,
    loop: true,
    throttlePitchRange: [0.8, 1.35],
  },

  'technical-skills': {
    modeId: 'technical-skills',
    tabNumber: '08',
    vehicleName: 'Transparent Neural Transit Pod',
    category: 'vacuum-transit',
    audioFilePath: '/audio/transportation/mode-08-transit-pod.wav',
    audioLayers: [
      'Hyperloop evacuated tube pneumatic air displacement rush',
      'Linear induction motor (LIM) high-frequency magnetic guide field (480Hz – 720Hz)',
      'Sub-guideway track hum and periodic pneumatic pressure equalizing vents',
    ],
    acousticProfile: 'Pressurized hyperloop pod rushing through a vacuum guideway with magnetic induction whine.',
    baseVolume: 0.86,
    loop: true,
    throttlePitchRange: [0.85, 1.25],
  },

  contact: {
    modeId: 'contact',
    tabNumber: '09',
    vehicleName: 'Interstellar Diplomatic Shuttle',
    category: 'orbital',
    audioFilePath: '/audio/transportation/mode-09-diplomatic-shuttle.wav',
    audioLayers: [
      'Twin heavy ion drive low-frequency propulsion roar (124Hz / 128Hz dual chamber resonance)',
      'Atmospheric orbital entry drag friction buffeting',
      'RCS attitude control nitrogen thruster bursts',
      'Orbital station docking beacon carrier tone (880Hz / 440Hz pulse)',
    ],
    acousticProfile: 'Diplomatic space cruiser with dual heavy ion engines, docking RCS nitrogen bursts, and approach beacons.',
    baseVolume: 0.88,
    loop: true,
    throttlePitchRange: [0.85, 1.2],
  },
};
