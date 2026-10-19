/**
 * BADAL // 001 — REALISTIC 9-MODE TRANSPORTATION AUDIO ENGINE
 * Dual-layer acoustic system:
 * 1. Primary Layer: High-resolution stereo WAV audio files loaded from the explicit
 *    TransportationAudioManifest for each of the 9 transportation modes.
 * 2. Real-time Dynamic Pitch & Throttle modulation (syncs playback rate and filter cutoff).
 * 3. Fallback Synthesizer Layer: Procedural Web Audio API physical modeling if offline or pending decode.
 * 4. UI Sound FX Suite (playHover, playClick, playConfirm, playCountdownBeep, playLaunchIgnition, playArrivalChime).
 */

import { TRANSPORTATION_AUDIO_MANIFEST, type ModeAudioDefinition } from '../components/transportation/TransportationAudioManifest';

interface ActiveVehicleAudio {
  tabId: string;
  sourceNode: AudioBufferSourceNode | null;
  gainNode: GainNode;
  filterNode: BiquadFilterNode;
  manifest: ModeAudioDefinition;
  proceduralNodes?: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    filters: BiquadFilterNode[];
  };
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private vehicleMasterGain: GainNode | null = null;

  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private sfxVolume: number = 0.85;

  private currentVehicle: ActiveVehicleAudio | null = null;
  private activeVehicleId: string | null = null;
  private audioBufferCache: Map<string, AudioBuffer> = new Map();
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('badal_sound_muted');
      this.isMuted = storedMute === 'true';
      const storedVol = localStorage.getItem('badal_master_volume');
      if (storedVol) {
        const parsed = parseFloat(storedVol);
        if (!isNaN(parsed)) this.masterVolume = Math.max(0, Math.min(1, parsed));
      }
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.vehicleMasterGain = this.ctx.createGain();

        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.vehicleMasterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        this.sfxGain.connect(this.masterGain);
        this.vehicleMasterGain.connect(this.masterGain);
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
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setMasterVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    try {
      localStorage.setItem('badal_master_volume', this.masterVolume.toString());
    } catch {
      // ignore
    }
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public getActiveVehicleId(): string | null {
    return this.activeVehicleId;
  }

  // Pre-calculated pink/brown noise buffer for air, thrusters, and mechanical friction
  private getNoiseBuffer(): AudioBuffer | null {
    const ctx = this.initContext();
    if (!ctx) return null;
    if (this.noiseBuffer) return this.noiseBuffer;

    const bufferSize = ctx.sampleRate * 3.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.5362) * 0.11;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * Loads or retrieves a cached stereo audio buffer for a given file path.
   */
  private async loadAudioBuffer(filePath: string): Promise<AudioBuffer | null> {
    if (this.audioBufferCache.has(filePath)) {
      return this.audioBufferCache.get(filePath)!;
    }
    const ctx = this.initContext();
    if (!ctx) return null;

    try {
      const res = await fetch(filePath);
      if (!res.ok) throw new Error(`Audio fetch failed: ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      this.audioBufferCache.set(filePath, decoded);
      return decoded;
    } catch (err) {
      console.warn(`[SoundEngine] Could not load audio file ${filePath}, using procedural fallback:`, err);
      return null;
    }
  }

  private sessionCounter: number = 0;

  // ==========================================
  // VEHICLE AUDIO PLAYBACK (9 DISTINCT MODES)
  // ==========================================

  public async startVehicleAudio(tabId: string) {
    const ctx = this.initContext();
    if (!ctx) return;

    // Immediately stop previous audio to prevent overlapping tracks
    this.stopVehicleAudio();

    const currentSession = ++this.sessionCounter;
    const manifest = TRANSPORTATION_AUDIO_MANIFEST[tabId] || TRANSPORTATION_AUDIO_MANIFEST['profile'];
    this.activeVehicleId = tabId;

    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(8000, ctx.currentTime);

    // Initial smooth fade-in
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(manifest.baseVolume, ctx.currentTime + 0.2);

    filterNode.connect(gainNode);
    gainNode.connect(this.vehicleMasterGain!);

    const activeRecord: ActiveVehicleAudio = {
      tabId,
      sourceNode: null,
      gainNode,
      filterNode,
      manifest,
    };
    this.currentVehicle = activeRecord;

    // Attempt to load and play the authentic mode-specific audio file
    const audioBuffer = await this.loadAudioBuffer(manifest.audioFilePath);

    // Verify this is still the active session (not switched away while decoding)
    if (this.sessionCounter !== currentSession || this.activeVehicleId !== tabId || this.currentVehicle !== activeRecord) {
      return;
    }

    if (audioBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = manifest.loop;
      source.playbackRate.setValueAtTime(manifest.throttlePitchRange[0], ctx.currentTime);
      source.connect(filterNode);
      source.start();
      activeRecord.sourceNode = source;
    } else {
      // Graceful fallback to rich procedural physical modeling
      this.startProceduralFallback(tabId, filterNode);
    }
  }

  /**
   * Dynamically adjusts playbackRate and filter resonance based on vehicle speed/throttle.
   */
  public updateVehicleThrottle(throttle: number, _progress: number) {
    if (!this.currentVehicle || !this.ctx) return;
    const { sourceNode, filterNode, manifest } = this.currentVehicle;
    const now = this.ctx.currentTime;
    const clampedThrottle = Math.max(0, Math.min(1.5, throttle));

    // 1. Modulate primary file playback rate (pitch & tempo)
    if (sourceNode) {
      const [minPitch, maxPitch] = manifest.throttlePitchRange;
      const targetRate = minPitch + clampedThrottle * (maxPitch - minPitch);
      sourceNode.playbackRate.setValueAtTime(targetRate, now);
    }

    // 2. Modulate low-pass frequency for aerodynamic opening
    const targetFreq = 4000 + clampedThrottle * 7000;
    filterNode.frequency.setValueAtTime(targetFreq, now);
  }

  /**
   * Smoothly stops active vehicle sound with exponential fadeout and complete resource cleanup.
   */
  public stopVehicleAudio() {
    this.sessionCounter++; // Invalidate any in-flight async decodes
    if (!this.currentVehicle || !this.ctx) {
      this.activeVehicleId = null;
      return;
    }

    const { sourceNode, gainNode, proceduralNodes } = this.currentVehicle;
    const now = this.ctx.currentTime;

    // Smooth 0.15s gain fadeout to prevent audio pops
    try {
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(0.001, now + 0.15);
    } catch {
      // ignore
    }

    setTimeout(() => {
      try {
        sourceNode?.stop();
        sourceNode?.disconnect();
      } catch {
        // ignore
      }

      proceduralNodes?.oscillators.forEach((o) => {
        try {
          o.stop();
          o.disconnect();
        } catch {
          // ignore
        }
      });
      gainNode.disconnect();
    }, 180);

    this.currentVehicle = null;
    this.activeVehicleId = null;
  }

  /**
   * Rich procedural acoustic modeling fallback for all 9 modes:
   * Provides unique sonic character if offline or while audio buffer loads.
   */
  private startProceduralFallback(tabId: string, outputNode: AudioNode) {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;

    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    const createOsc = (type: OscillatorType, freq: number, vol: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(vol, now);
      o.connect(g);
      g.connect(outputNode);
      o.start();
      oscs.push(o);
      gains.push(g);
    };

    switch (tabId) {
      case 'profile': // 01: Hovercraft (twin repulsor harmonic + turbine whine)
        createOsc('sine', 110, 0.22);
        createOsc('sine', 330, 0.14);
        createOsc('sawtooth', 520, 0.08);
        break;

      case 'internships': // 02: Quadcopter Drone (detuned multi-rotor buzz)
        createOsc('sawtooth', 285, 0.15);
        createOsc('sawtooth', 305, 0.15);
        createOsc('triangle', 610, 0.1);
        break;

      case 'experience': // 03: Maglev Bullet Train (steel track hum + inverter)
        createOsc('triangle', 95, 0.25);
        createOsc('sawtooth', 480, 0.08);
        createOsc('sine', 720, 0.06);
        break;

      case 'projects': // 04: Spacecraft (38Hz deep fusion sub-bass pulse)
        createOsc('sawtooth', 38, 0.32);
        createOsc('sine', 76, 0.2);
        createOsc('triangle', 152, 0.1);
        break;

      case 'education': // 05: Submarine (52Hz deep pressure hull hum)
        createOsc('sine', 52, 0.3);
        createOsc('triangle', 104, 0.12);
        break;

      case 'certifications': // 06: Balloon (stratospheric whistling wind)
        createOsc('sine', 180, 0.14);
        createOsc('triangle', 360, 0.09);
        break;

      case 'core-skills': // 07: Motorcycle (4-stroke internal combustion firing)
        createOsc('sawtooth', 65, 0.28);
        createOsc('sawtooth', 130, 0.18);
        createOsc('triangle', 260, 0.1);
        break;

      case 'technical-skills': // 08: Transit Pod (linear induction guide whine)
        createOsc('sawtooth', 520, 0.16);
        createOsc('sine', 1040, 0.08);
        break;

      case 'contact': // 09: Diplomatic Shuttle (heavy dual ion drive roar)
        createOsc('sawtooth', 124, 0.24);
        createOsc('sawtooth', 128, 0.24);
        createOsc('sine', 62, 0.2);
        break;

      default:
        createOsc('sine', 220, 0.2);
        break;
    }

    if (this.currentVehicle) {
      this.currentVehicle.proceduralNodes = {
        oscillators: oscs,
        gains,
        filters: [],
      };
    }
  }

  // ==========================================
  // UI & NAVIGATION SOUND FX
  // ==========================================

  public playHover() {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1174, now + 0.04);

    gain.gain.setValueAtTime(0.06 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playClick() {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.12 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playConfirm() {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    [659.25, 880.0].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.14 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  public playCountdownBeep(isFinal: boolean = false) {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freq = isFinal ? 1318.51 : 659.25;
    const dur = isFinal ? 0.35 : 0.15;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime((isFinal ? 0.2 : 0.12) * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  public playLaunchIgnition() {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(45, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.6);

    oscGain.gain.setValueAtTime(0.05 * this.sfxVolume, now);
    oscGain.gain.linearRampToValueAtTime(0.28 * this.sfxVolume, now + 0.3);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 0.85);

    const noise = ctx.createBufferSource();
    const buffer = this.getNoiseBuffer();
    if (buffer) {
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.4);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.02 * this.sfxVolume, now);
      noiseGain.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, now + 0.25);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain!);
      noise.start(now);
      noise.stop(now + 0.9);
    }
  }

  public playArrivalChime(destinationId: string) {
    const ctx = this.initContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    const chords: Record<string, number[]> = {
      profile: [523.25, 659.25, 783.99, 1046.5], // C Major
      internships: [587.33, 739.99, 880.0, 1174.66], // D Major
      experience: [440.0, 554.37, 659.25, 880.0], // A Major
      projects: [466.16, 587.33, 698.46, 932.33], // Bb Major
      education: [392.0, 493.88, 587.33, 783.99], // G Major
      certifications: [659.25, 830.61, 987.77, 1318.51], // E Major
      'core-skills': [523.25, 659.25, 783.99, 1046.5], // C Major
      'technical-skills': [440.0, 554.37, 659.25, 880.0], // A Major
      contact: [587.33, 739.99, 880.0, 1174.66], // D Major
    };

    const notes = chords[destinationId] || [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.01, noteTime);
      gain.gain.linearRampToValueAtTime(0.18 * this.sfxVolume, noteTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(noteTime);
      osc.stop(noteTime + 1.3);
    });
  }
}

export const soundEngine = new SoundEngine();
