/**
 * BADAL // 001 — PROCEDURAL AUDIO SYNTHESIZER ENGINE
 * Web Audio API based sound design for 3D vehicles, rocket launch, and cinematic navigation.
 * Zero external asset dependencies, zero 404 network risks, 100% browser compliant.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.65;
  private currentVehicleNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    filters: BiquadFilterNode[];
    noiseSource?: AudioBufferSourceNode;
  } | null = null;
  private activeVehicleId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('badal_sound_muted');
      this.isMuted = storedMute === 'true';
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('badal_sound_muted', muted ? 'true' : 'false');
    } catch {
      // ignore
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getActiveVehicleId(): string | null {
    return this.activeVehicleId;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // Generate pink/white noise buffer for thrusters, wind, water
  private createNoiseBuffer(duration = 2.0): AudioBuffer | null {
    const ctx = this.initContext();
    if (!ctx) return null;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // --- UI INTERACTION SOUNDS ---

  public playHover() {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.04);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playClick() {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playConfirm() {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    // Ascending electronic major chord
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.08, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.25);
    });
  }

  // --- ROCKET LAUNCH & COUNTDOWN AUDIO ---

  public playCountdownBeep(isFinal = false) {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isFinal ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(isFinal ? 1200 : 700, now);
    if (isFinal) {
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.2);
    }
    gain.gain.setValueAtTime(isFinal ? 0.25 : 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.35 : 0.15));
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + (isFinal ? 0.35 : 0.15));
  }

  public playLaunchIgnition() {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    // Sub-bass rumble
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(45, now);
    subOsc.frequency.linearRampToValueAtTime(110, now + 2.5);
    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.linearRampToValueAtTime(0.35, now + 1.2);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 4.5);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain!);
    subOsc.start(now);
    subOsc.stop(now + 4.5);

    // Roaring exhaust noise
    const noiseBuf = this.createNoiseBuffer(4.5);
    if (noiseBuf) {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 2.0);
      filter.frequency.linearRampToValueAtTime(800, now + 4.5);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.05, now);
      noiseGain.gain.linearRampToValueAtTime(0.4, now + 1.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 4.5);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain!);
      noise.start(now);
      noise.stop(now + 4.5);
    }
  }

  public playWarpTransition() {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.8);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 4.0;
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.8);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + 1.2);
  }

  // --- VEHICLE AUDIO PROFILES (Nine Distinct Modes) ---

  public startVehicleAudio(tabId: string) {
    this.stopVehicleAudio();
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;

    this.activeVehicleId = tabId;
    const now = ctx.currentTime;
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];
    const filters: BiquadFilterNode[] = [];

    switch (tabId) {
      case 'profile': {
        // 01 EXECUTIVE HOVERCRAFT: Smooth dual anti-gravity hum + wind glide
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const g1 = ctx.createGain();
        const g2 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(110, now);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(220, now);
        g1.gain.setValueAtTime(0.12, now);
        g2.gain.setValueAtTime(0.08, now);
        osc1.connect(g1);
        osc2.connect(g2);
        g1.connect(this.masterGain!);
        g2.connect(this.masterGain!);
        osc1.start(now);
        osc2.start(now);
        oscillators.push(osc1, osc2);
        gains.push(g1, g2);
        break;
      }

      case 'internships': {
        // 02 SCOUT DRONE: High-RPM 4-rotor whir + scanning pulses
        [220, 290, 360, 440].forEach((freq) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);
          g.gain.setValueAtTime(0.035, now);
          osc.connect(filter);
          filter.connect(g);
          g.connect(this.masterGain!);
          osc.start(now);
          oscillators.push(osc);
          gains.push(g);
          filters.push(filter);
        });
        break;
      }

      case 'experience': {
        // 03 MAGLEV TRAIN: Rail electromagnetic rumble + high speed acceleration hum
        const oscRail = ctx.createOscillator();
        const oscWhine = ctx.createOscillator();
        const gRail = ctx.createGain();
        const gWhine = ctx.createGain();
        oscRail.type = 'triangle';
        oscRail.frequency.setValueAtTime(75, now);
        oscRail.frequency.linearRampToValueAtTime(140, now + 4.5);
        oscWhine.type = 'sine';
        oscWhine.frequency.setValueAtTime(320, now);
        oscWhine.frequency.linearRampToValueAtTime(680, now + 4.5);
        gRail.gain.setValueAtTime(0.15, now);
        gWhine.gain.setValueAtTime(0.07, now);
        oscRail.connect(gRail);
        oscWhine.connect(gWhine);
        gRail.connect(this.masterGain!);
        gWhine.connect(this.masterGain!);
        oscRail.start(now);
        oscWhine.start(now);
        oscillators.push(oscRail, oscWhine);
        gains.push(gRail, gWhine);
        break;
      }

      case 'projects': {
        // 04 SPACE EXPLORER: Sub-bass rocket combustion + cosmic drone
        const oscBass = ctx.createOscillator();
        const gBass = ctx.createGain();
        oscBass.type = 'triangle';
        oscBass.frequency.setValueAtTime(55, now);
        gBass.gain.setValueAtTime(0.22, now);
        oscBass.connect(gBass);
        gBass.connect(this.masterGain!);
        oscBass.start(now);
        oscillators.push(oscBass);
        gains.push(gBass);
        break;
      }

      case 'education': {
        // 05 RESEARCH SUBMARINE: Deep oceanic motor churn + underwater ambience
        const oscSub = ctx.createOscillator();
        const gSub = ctx.createGain();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(80, now);
        gSub.gain.setValueAtTime(0.14, now);
        oscSub.connect(gSub);
        gSub.connect(this.masterGain!);
        oscSub.start(now);
        oscillators.push(oscSub);
        gains.push(gSub);
        // Periodic sonar ping
        this.playSonarPing();
        break;
      }

      case 'certifications': {
        // 06 HIGH-ALTITUDE BALLOON: Peaceful high-altitude wind breeze + calm tone
        const oscAir = ctx.createOscillator();
        const gAir = ctx.createGain();
        oscAir.type = 'sine';
        oscAir.frequency.setValueAtTime(175, now);
        gAir.gain.setValueAtTime(0.08, now);
        oscAir.connect(gAir);
        gAir.connect(this.masterGain!);
        oscAir.start(now);
        oscillators.push(oscAir);
        gains.push(gAir);
        break;
      }

      case 'core-skills': {
        // 07 EXPEDITION BIKE: High-torque cyber combustion growl
        const oscBike = ctx.createOscillator();
        const gBike = ctx.createGain();
        oscBike.type = 'sawtooth';
        oscBike.frequency.setValueAtTime(95, now);
        oscBike.frequency.linearRampToValueAtTime(180, now + 3.0);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        gBike.gain.setValueAtTime(0.09, now);
        oscBike.connect(filter);
        filter.connect(gBike);
        gBike.connect(this.masterGain!);
        oscBike.start(now);
        oscillators.push(oscBike);
        gains.push(gBike);
        filters.push(filter);
        break;
      }

      case 'technical-skills': {
        // 08 NEURAL TRANSIT POD: High-speed synaptic pulse & harmonic data stream
        [440, 660, 880].forEach((freq) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          g.gain.setValueAtTime(0.04, now);
          osc.connect(g);
          g.connect(this.masterGain!);
          osc.start(now);
          oscillators.push(osc);
          gains.push(g);
        });
        break;
      }

      case 'contact': {
        // 09 DIPLOMATIC SHUTTLE: Thruster stabilization & docking guide tone
        const oscDock = ctx.createOscillator();
        const gDock = ctx.createGain();
        oscDock.type = 'triangle';
        oscDock.frequency.setValueAtTime(130, now);
        gDock.gain.setValueAtTime(0.12, now);
        oscDock.connect(gDock);
        gDock.connect(this.masterGain!);
        oscDock.start(now);
        oscillators.push(oscDock);
        gains.push(gDock);
        break;
      }
    }

    this.currentVehicleNodes = {
      oscillators,
      gains,
      filters,
    };
  }

  // Modulate engine pitch and intensity based on throttle & journey progress
  public updateVehicleThrottle(throttle: number, progress: number) {
    if (!this.currentVehicleNodes || !this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const { oscillators, gains } = this.currentVehicleNodes;

    // Smooth gain modulation
    gains.forEach((g) => {
      const baseGain = 0.08 + throttle * 0.08;
      g.gain.setValueAtTime(baseGain * (1 - Math.pow(progress, 3) * 0.5), now);
    });

    // Pitch bends slightly with acceleration
    oscillators.forEach((osc) => {
      try {
        const currentFreq = osc.frequency.value;
        const targetFreq = currentFreq * (1.0 + throttle * 0.15);
        osc.frequency.setTargetAtTime(targetFreq, now, 0.1);
      } catch {
        // ignore
      }
    });
  }

  public playArrivalChime(tabId: string) {
    this.stopVehicleAudio();
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    // Distinct arrival chimes per vehicle theme
    const notesByTab: Record<string, number[]> = {
      profile: [440, 554.37, 659.25], // A major
      internships: [523.25, 659.25, 783.99], // C major
      experience: [392.00, 493.88, 587.33, 783.99], // G major
      projects: [261.63, 392.00, 523.25, 659.25], // Space octave
      education: [349.23, 440.00, 523.25], // F major sonar
      certifications: [587.33, 739.99, 880.00, 1174.66], // D high celestial
      'core-skills': [293.66, 369.99, 440.00], // D cyber
      'technical-skills': [659.25, 830.61, 987.77, 1318.51], // E crystalline
      contact: [440, 554.37, 659.25, 880], // Warm welcome
    };

    const notes = notesByTab[tabId] || [440, 554.37, 659.25];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.14, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.6);
    });
  }

  private playSonarPing() {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now + 1.2);
    gain.gain.setValueAtTime(0.18, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now + 1.2);
    osc.stop(now + 2.5);
  }

  public stopVehicleAudio() {
    if (this.currentVehicleNodes && this.ctx) {
      const now = this.ctx.currentTime;
      this.currentVehicleNodes.gains.forEach((g) => {
        try {
          g.gain.linearRampToValueAtTime(0.001, now + 0.2);
        } catch {
          // ignore
        }
      });
      setTimeout(() => {
        this.currentVehicleNodes?.oscillators.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch {
            // ignore
          }
        });
        this.currentVehicleNodes = null;
        this.activeVehicleId = null;
      }, 250);
    }
  }
}

export const soundEngine = new SoundEngine();
