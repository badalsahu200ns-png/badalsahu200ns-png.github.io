import fs from 'fs';
import path from 'path';

/**
 * Procedural PCM WAV Audio Generator for Badal's Portfolio
 * Generates 9 distinct, authentic, multi-layered transportation audio files.
 * Format: 44.1 kHz, 16-bit Stereo PCM WAV
 */

const SAMPLE_RATE = 44100;
const DURATION_SEC = 6.0;
const NUM_SAMPLES = Math.floor(SAMPLE_RATE * DURATION_SEC);
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/audio/transportation');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function writeWavFile(filename, leftChannel, rightChannel) {
  const numChannels = 2;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = leftChannel.length * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk 1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34); // bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < leftChannel.length; i++) {
    // Clamp to -1.0 .. 1.0
    const l = Math.max(-1, Math.min(1, leftChannel[i]));
    const r = Math.max(-1, Math.min(1, rightChannel[i]));

    const sL = l < 0 ? l * 0x8000 : l * 0x7FFF;
    const sR = r < 0 ? r * 0x8000 : r * 0x7FFF;

    buffer.writeInt16LE(Math.floor(sL), offset);
    buffer.writeInt16LE(Math.floor(sR), offset + 2);
    offset += 4;
  }

  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

// Low-pass filter helper (1-pole)
function createLowPass(cutoffFreq) {
  const rc = 1.0 / (2.0 * Math.PI * cutoffFreq);
  const dt = 1.0 / SAMPLE_RATE;
  const alpha = dt / (rc + dt);
  let prev = 0;
  return (sample) => {
    prev = prev + alpha * (sample - prev);
    return prev;
  };
}

// High-pass filter helper
function createHighPass(cutoffFreq) {
  const rc = 1.0 / (2.0 * Math.PI * cutoffFreq);
  const dt = 1.0 / SAMPLE_RATE;
  const alpha = rc / (rc + dt);
  let prevIn = 0;
  let prevOut = 0;
  return (sample) => {
    const out = alpha * (prevOut + sample - prevIn);
    prevIn = sample;
    prevOut = out;
    return out;
  };
}

// Band-pass filter helper
function createBandPass(centerFreq, q = 2.0) {
  const lp = createLowPass(centerFreq * (1 + 1 / (2 * q)));
  const hp = createHighPass(centerFreq * (1 - 1 / (2 * q)));
  return (sample) => hp(lp(sample));
}

// Noise generators
function whiteNoise() {
  return Math.random() * 2 - 1;
}

// ==========================================
// 1. MODE 01: EXECUTIVE HOVERCRAFT
// Twin jet turbine whine + air-cushion pressurized skirt hiss + repulsor magnetic harmonic
// ==========================================
function generateHovercraft() {
  const left = new Float32Array(NUM_SAMPLES);
  const right = new Float32Array(NUM_SAMPLES);
  const skirtFilterL = createLowPass(320);
  const skirtFilterR = createLowPass(320);
  const ventFilterL = createBandPass(750, 1.5);
  const ventFilterR = createBandPass(750, 1.5);

  let phaseTurbine1 = 0;
  let phaseTurbine2 = 0;
  let phaseRepulsor = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // Throttle speed curve: ramps up from 0 to 1.8s, full speed cruise, gentle deceleration
    const throttle = t < 1.5 ? 0.6 + (t / 1.5) * 0.4 : t < 4.5 ? 1.0 : 1.0 - ((t - 4.5) / 1.5) * 0.3;

    // Twin spool turbine frequencies
    const freqT1 = 440 + throttle * 280 + Math.sin(t * 8) * 6;
    const freqT2 = 455 + throttle * 290 + Math.cos(t * 7) * 6;
    phaseTurbine1 += (2 * Math.PI * freqT1) / SAMPLE_RATE;
    phaseTurbine2 += (2 * Math.PI * freqT2) / SAMPLE_RATE;

    const turbineWhineL = (Math.sin(phaseTurbine1) * 0.5 + Math.sin(phaseTurbine1 * 2) * 0.25) * 0.22;
    const turbineWhineR = (Math.sin(phaseTurbine2) * 0.5 + Math.sin(phaseTurbine2 * 2) * 0.25) * 0.22;

    // Air cushion ground rush
    const rawNoiseL = whiteNoise();
    const rawNoiseR = whiteNoise();
    const skirtL = skirtFilterL(rawNoiseL) * 0.35 * throttle;
    const skirtR = skirtFilterR(rawNoiseR) * 0.35 * throttle;
    const ventL = ventFilterL(rawNoiseL) * 0.18;
    const ventR = ventFilterR(rawNoiseR) * 0.18;

    // Repulsor magnetic hum
    phaseRepulsor += (2 * Math.PI * 110) / SAMPLE_RATE;
    const hum = Math.sin(phaseRepulsor) * 0.15 + Math.sin(phaseRepulsor * 3) * 0.08;

    left[i] = (turbineWhineL + skirtL + ventL + hum) * 0.8;
    right[i] = (turbineWhineR + skirtR + ventR + hum) * 0.8;
  }
  writeWavFile('mode-01-hovercraft.wav', left, right);
}

// ==========================================
// 2. MODE 02: RECONNAISSANCE QUADCOPTER DRONE
// 4 distinct high-RPM brushless motor tones + blade passing frequency chop & turbulent air wash
// ==========================================
function generateDrone() {
  const left = new Float32Array(NUM_SAMPLES);
  const right = new Float32Array(NUM_SAMPLES);
  const airWashL = createBandPass(1200, 1.2);
  const airWashR = createBandPass(1200, 1.2);

  // 4 motor phases
  let pM1 = 0, pM2 = 0, pM3 = 0, pM4 = 0;
  let pChop = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // Aerodynamic throttle adjustments
    const throttle = t < 1.2 ? 0.7 + (t / 1.2) * 0.3 : t < 4.8 ? 1.0 : 0.8;

    // 4 brushless outrunner motor fundamental frequencies
    const f1 = 280 * throttle + Math.sin(t * 12) * 4;
    const f2 = 295 * throttle + Math.cos(t * 11) * 4;
    const f3 = 315 * throttle + Math.sin(t * 14) * 5;
    const f4 = 330 * throttle + Math.cos(t * 13) * 5;

    pM1 += (2 * Math.PI * f1) / SAMPLE_RATE;
    pM2 += (2 * Math.PI * f2) / SAMPLE_RATE;
    pM3 += (2 * Math.PI * f3) / SAMPLE_RATE;
    pM4 += (2 * Math.PI * f4) / SAMPLE_RATE;

    const motorL = (Math.sin(pM1) + Math.sin(pM3) * 0.8 + Math.sin(pM1 * 2) * 0.3) * 0.18;
    const motorR = (Math.sin(pM2) + Math.sin(pM4) * 0.8 + Math.sin(pM2 * 2) * 0.3) * 0.18;

    // Propeller blade chop (blade passing frequency at ~220Hz modulated by motor rotation)
    pChop += (2 * Math.PI * (210 * throttle)) / SAMPLE_RATE;
    const chopMod = Math.pow(Math.max(0, Math.sin(pChop)), 3) * 0.35;

    // Turbulent rotor-wash air noise
    const washL = airWashL(whiteNoise()) * (0.25 + chopMod);
    const washR = airWashR(whiteNoise()) * (0.25 + chopMod);

    // Stator coil high-frequency PWM whine (3800Hz)
    const pwmWhine = Math.sin((2 * Math.PI * 3800 * i) / SAMPLE_RATE) * 0.04;

    left[i] = (motorL + washL + pwmWhine) * 0.85;
    right[i] = (motorR + washR + pwmWhine) * 0.85;
  }
  writeWavFile('mode-02-drone.wav', left, right);
}

// ==========================================
// 3. MODE 03: MAGLEV BULLET TRAIN
// Heavy steel rail track rolling rhythm, magnetic stator hum, inverter whine, and pneumatic train horn
// ==========================================
function generateTrain() {
  const left = new Float32Array(NUM_SAMPLES);
  const right = new Float32Array(NUM_SAMPLES);
  const railFrictionL = createBandPass(1600, 2.0);
  const railFrictionR = createBandPass(1600, 2.0);
  const trackRumbleL = createLowPass(180);
  const trackRumbleR = createLowPass(180);

  let phaseStator = 0;
  let phaseInverter = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const speed = t < 2.0 ? 0.4 + (t / 2.0) * 0.6 : t < 4.8 ? 1.0 : 0.7;

    // Rhythmic rail joint impact (click-clack pair every 0.6 seconds)
    const cycleTime = (t * (2.8 * speed)) % 1.0;
    let clickClack = 0;
    if (cycleTime > 0.0 && cycleTime < 0.05) {
      clickClack = Math.sin((cycleTime / 0.05) * Math.PI) * 0.45;
    } else if (cycleTime > 0.12 && cycleTime < 0.17) {
      clickClack = Math.sin(((cycleTime - 0.12) / 0.05) * Math.PI) * 0.35;
    }

    // Steel wheel-rail rolling friction noise
    const rollNoiseL = railFrictionL(whiteNoise()) * 0.16 * speed;
    const rollNoiseR = railFrictionR(whiteNoise()) * 0.16 * speed;
    const rumbleL = trackRumbleL(whiteNoise()) * 0.32 * speed;
    const rumbleR = trackRumbleR(whiteNoise()) * 0.32 * speed;

    // Magnetic levitation induction stator hum (60Hz + 120Hz harmonics)
    phaseStator += (2 * Math.PI * 60) / SAMPLE_RATE;
    const statorHum = (Math.sin(phaseStator) * 0.4 + Math.sin(phaseStator * 2) * 0.25) * 0.25;

    // High-speed variable frequency inverter whine
    const invFreq = 500 + speed * 850;
    phaseInverter += (2 * Math.PI * invFreq) / SAMPLE_RATE;
    const inverterWhine = Math.sin(phaseInverter) * 0.08;

    // Pneumatic two-tone rail horn at t = 1.4s to 2.2s and t = 4.2s to 4.9s
    let horn = 0;
    const hornActive = (t >= 1.4 && t <= 2.2) || (t >= 4.2 && t <= 4.9);
    if (hornActive) {
      const hPhase1 = (2 * Math.PI * 311.13 * i) / SAMPLE_RATE; // Eb4
      const hPhase2 = (2 * Math.PI * 369.99 * i) / SAMPLE_RATE; // F#4
      horn = (Math.sin(hPhase1) * 0.5 + Math.sin(hPhase2) * 0.5) * 0.32;
    }

    left[i] = (rumbleL + rollNoiseL + clickClack + statorHum + inverterWhine + horn) * 0.85;
    right[i] = (rumbleR + rollNoiseR + clickClack * 0.8 + statorHum + inverterWhine + horn) * 0.85;
  }
  writeWavFile('mode-03-train.wav', left, right);
}

// ==========================================
// 4. MODE 04: DEEP-SPACE EXPLORER SPACECRAFT
// Sub-bass fusion drive rumble, ion plasma thruster roar, and celestial cockpit ambiance
// ==========================================
function generateSpacecraft() {
  const left = new Float32Array(NUM_SAMPLES);
  const right = new Float32Array(NUM_SAMPLES);
  const plasmaFilterL = createBandPass(920, 1.0);
  const plasmaFilterR = createBandPass(920, 1.0);
  const subFilterL = createLowPass(75);
  const subFilterR = createLowPass(75);

  let phaseSub = 0;
  let phaseHarmonic = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const warp = t < 1.8 ? 0.5 + (t / 1.8) * 0.5 : t < 4.5 ? 1.0 : 0.7;

    // 38Hz fusion drive sub-bass pulse with stereo panning
    phaseSub += (2 * Math.PI * 38) / SAMPLE_RATE;
    phaseHarmonic += (2 * Math.PI * 76) / SAMPLE_RATE;
    const fusionL = (Math.sin(phaseSub) * 0.5 + Math.sin(phaseHarmonic) * 0.3) * 0.35 * warp;
    const fusionR = (Math.sin(phaseSub + 0.3) * 0.5 + Math.sin(phaseHarmonic + 0.3) * 0.3) * 0.35 * warp;

    // Heavy broadband ion thruster exhaust
    const noiseL = whiteNoise();
    const noiseR = whiteNoise();
    const plasmaL = plasmaFilterL(noiseL) * 0.28 * warp;
    const plasmaR = plasmaFilterR(noiseR) * 0.28 * warp;
    const deepRumbleL = subFilterL(noiseL) * 0.45 * warp;
    const deepRumbleR = subFilterR(noiseR) * 0.45 * warp;

    // Ethereal cosmic resonance (slow binaural beat at 528Hz and 532Hz)
    const cosmicL = Math.sin((2 * Math.PI * 528 * i) / SAMPLE_RATE) * 0.06;
    const cosmicR = Math.sin((2 * Math.PI * 532 * i) / SAMPLE_RATE) * 0.06;

    left[i] = (fusionL + plasmaL + deepRumbleL + cosmicL) * 0.85;
    right[i] = (fusionR + plasmaR + deepRumbleR + cosmicR) * 0.85;
  }
  writeWavFile('mode-04-spacecraft.wav', left, right);
}

// ==========================================
// 5. MODE 05: OCEAN RESEARCH SUBMARINE
// Deep underwater water displacement, propeller screw cavitation wake, and periodic active sonar ping
// ==========================================
function generateSubmarine() {
  const left = new Float32Array(NUM_SAMPLES);
  const right = new Float32Array(NUM_SAMPLES);
  const hydroFilterL = createLowPass(110);
  const hydroFilterR = createLowPass(110);
  const cavFilterL = createBandPass(480, 1.8);
  const cavFilterR = createBandPass(480, 1.8);

  let phaseHull = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;

    // Slow rhythmic 2.2Hz 7-blade propeller cavitation wake modulation
    const screwMod = 0.5 + 0.5 * Math.sin(2 * Math.PI * 2.2 * t);
    const cavL = cavFilterL(whiteNoise()) * (0.2 + screwMod * 0.3);
    const cavR = cavFilterR(whiteNoise()) * (0.2 + screwMod * 0.3);

    // Deep ocean water pressure displacement
    const hydroL = hydroFilterL(whiteNoise()) * 0.45;
    const hydroR = hydroFilterR(whiteNoise()) * 0.45;

    // Submarine pressure hull low resonance
    phaseHull += (2 * Math.PI * 52) / SAMPLE_RATE;
    const hullRes = Math.sin(phaseHull) * 0.18;

    // Active marine sonar echo ping at t = 1.0s and t = 3.8s
    let sonar = 0;
    const ping1 = t >= 1.0 && t <= 2.2;
    const ping2 = t >= 3.8 && t <= 5.0;
    if (ping1) {
      const pingT = t - 1.0;
      const decay = Math.exp(-pingT * 3.5);
      sonar = Math.sin(2 * Math.PI * 1420 * pingT) * decay * 0.4;
    } else if (ping2) {
      const pingT = t - 3.8;
      const decay = Math.exp(-pingT * 3.5);
      sonar = Math.sin(2 * Math.PI * 1420 * pingT) * decay * 0.4;
    }

    left[i] = (cavL + hydroL + hullRes + sonar) * 0.85;
    right[i] = (cavR + hydroR + hullRes + sonar * 0.8) * 0.85;
  }
  writeWavFile('mode-05-submarine.wav', left, right);
}

// ==========================================
// 6. MODE 06: HIGH-ALTITUDE RESEARCH BALLOON
// Gusty high-altitude laminar wind sweep, cable rigging flutter, and periodic propane burner blast roar
// ==========================================
function generateBalloon() {
  const left = new Float32Array(NUM_SAMPLES);
  const right = new Float32Array(NUM_SAMPLES);
  const windFilterL = createBandPass(620, 0.8);
  const windFilterR = createBandPass(620, 0.8);
  const burnerFilterL = createLowPass(450);
  const burnerFilterR = createLowPass(450);

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;

    // Atmospheric high-altitude wind gusting
    const gust = 0.5 + 0.5 * Math.sin(t * 1.5) * Math.cos(t * 0.8);
    const windL = windFilterL(whiteNoise()) * (0.2 + gust * 0.25);
    const windR = windFilterR(whiteNoise()) * (0.2 + gust * 0.25);

    // Cable tension flutter
    const cableVibe = Math.sin(2 * Math.PI * (160 + gust * 40) * t) * 0.05 * gust;

    // Propane burner blast at t = 1.0s to 2.4s and t = 4.0s to 5.2s
    let burner = 0;
    const isBurner1 = t >= 1.0 && t <= 2.4;
    const isBurner2 = t >= 4.0 && t <= 5.2;
    if (isBurner1) {
      const bT = t - 1.0;
      const env = bT < 0.1 ? bT / 0.1 : bT > 1.2 ? (1.4 - bT) / 0.2 : 1.0;
      burner = burnerFilterL(whiteNoise()) * env * 0.75;
    } else if (isBurner2) {
      const bT = t - 4.0;
      const env = bT < 0.1 ? bT / 0.1 : bT > 1.0 ? (1.2 - bT) / 0.2 : 1.0;
      burner = burnerFilterR(whiteNoise()) * env * 0.75;
    }

    left[i] = (windL + cableVibe + burner) * 0.85;
    right[i] = (windR + cableVibe + burner) * 0.85;
  }
  writeWavFile('mode-06-balloon.wav', left, right);
}

// ==========================================
// 7. MODE 07: ALL-TERRAIN CYBER MOTORCYCLE
// 4-stroke internal combustion engine piston pulses, rapid cylinder revving, exhaust rumble, and tire roar
// ==========================================
function generateMotorcycle() {
  const left = new Float32Array(NUM_SAMPLES);
  const right = new Float32Array(NUM_SAMPLES);
  const exhaustFilterL = createBandPass(380, 1.4);
  const exhaustFilterR = createBandPass(380, 1.4);
  const tireFilterL = createLowPass(600);
  const tireFilterR = createLowPass(600);

  let phaseCrank = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // Engine RPM profile: idle -> heavy acceleration run -> high RPM -> gear shift
    let rpm = 45; // Hz
    if (t < 2.0) {
      rpm = 45 + (t / 2.0) * 55;
    } else if (t < 4.2) {
      rpm = 100 + Math.sin((t - 2.0) * 4) * 8;
    } else {
      rpm = 85 - ((t - 4.2) / 1.8) * 20;
    }

    phaseCrank += (2 * Math.PI * rpm) / SAMPLE_RATE;
    // Sharp cylinder combustion impulse (sawtooth with exponential decay per stroke)
    const stroke = (phaseCrank % (2 * Math.PI)) / (2 * Math.PI);
    const firingPulse = Math.exp(-stroke * 8) * Math.sin(stroke * Math.PI * 4);

    // Exhaust pipe resonance
    const exhaustL = exhaustFilterL(firingPulse + whiteNoise() * 0.2) * 0.65;
    const exhaustR = exhaustFilterR(firingPulse + whiteNoise() * 0.2) * 0.65;

    // Knobby off-road tire friction roar
    const tireL = tireFilterL(whiteNoise()) * 0.22 * (rpm / 80);
    const tireR = tireFilterR(whiteNoise()) * 0.22 * (rpm / 80);

    left[i] = (exhaustL + tireL) * 0.85;
    right[i] = (exhaustR + tireR) * 0.85;
  }
  writeWavFile('mode-07-motorcycle.wav', left, right);
}

// ==========================================
// 8. MODE 08: TRANSPARENT NEURAL TRANSIT POD
// Hyperloop evacuated tube pneumatic air rush, magnetic linear induction motor hum, and pressure vents
// ==========================================
function generateTransitPod() {
  const left = new Float32Array(NUM_SAMPLES);
  const right = new Float32Array(NUM_SAMPLES);
  const tubeRushL = createBandPass(850, 1.2);
  const tubeRushR = createBandPass(850, 1.2);
  const subGuidewayL = createLowPass(140);
  const subGuidewayR = createLowPass(140);

  let phaseMag = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const speed = t < 1.5 ? 0.5 + (t / 1.5) * 0.5 : t < 4.5 ? 1.0 : 0.7;

    // High-speed air rush inside vacuum tube
    const rushL = tubeRushL(whiteNoise()) * 0.35 * speed;
    const rushR = tubeRushR(whiteNoise()) * 0.35 * speed;
    const guideL = subGuidewayL(whiteNoise()) * 0.25 * speed;
    const guideR = subGuidewayR(whiteNoise()) * 0.25 * speed;

    // Linear induction stator field glide (480Hz ramp to 720Hz)
    const magFreq = 480 + speed * 240;
    phaseMag += (2 * Math.PI * magFreq) / SAMPLE_RATE;
    const magHum = Math.sin(phaseMag) * 0.14 + Math.sin(phaseMag * 2) * 0.07;

    // Periodic pneumatic pressure equalizing vents at t = 2.5s and t = 5.0s
    let vent = 0;
    if ((t >= 2.3 && t <= 2.8) || (t >= 4.8 && t <= 5.3)) {
      const vT = (t - 2.3) % 2.5;
      const env = Math.exp(-vT * 8);
      vent = whiteNoise() * env * 0.3;
    }

    left[i] = (rushL + guideL + magHum + vent) * 0.85;
    right[i] = (rushR + guideR + magHum + vent) * 0.85;
  }
  writeWavFile('mode-08-transit-pod.wav', left, right);
}

// ==========================================
// 9. MODE 09: INTERSTELLAR DIPLOMATIC SHUTTLE
// Heavy twin ion propulsion roar, atmospheric orbital friction, and docking RCS thruster nitrogen bursts
// ==========================================
function generateDiplomaticShuttle() {
  const left = new Float32Array(NUM_SAMPLES);
  const right = new Float32Array(NUM_SAMPLES);
  const ionRoarL = createLowPass(280);
  const ionRoarR = createLowPass(280);
  const rcsFilterL = createBandPass(1800, 1.5);
  const rcsFilterR = createBandPass(1800, 1.5);

  let phaseIonL = 0;
  let phaseIonR = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const thrust = t < 1.6 ? 0.6 + (t / 1.6) * 0.4 : t < 4.4 ? 1.0 : 0.65;

    // Heavy low-end ion propulsion roar
    const roarL = ionRoarL(whiteNoise()) * 0.45 * thrust;
    const roarR = ionRoarR(whiteNoise()) * 0.45 * thrust;

    // Dual ion chamber harmonic resonance
    phaseIonL += (2 * Math.PI * 124) / SAMPLE_RATE;
    phaseIonR += (2 * Math.PI * 128) / SAMPLE_RATE;
    const ionL = Math.sin(phaseIonL) * 0.16 * thrust;
    const ionR = Math.sin(phaseIonR) * 0.16 * thrust;

    // RCS attitude control nitrogen gas bursts at t = 1.5s to 1.9s and t = 3.6s to 4.0s
    let rcsL = 0, rcsR = 0;
    if (t >= 1.5 && t <= 1.9) {
      const rT = t - 1.5;
      const env = Math.sin((rT / 0.4) * Math.PI);
      rcsL = rcsFilterL(whiteNoise()) * env * 0.4;
    } else if (t >= 3.6 && t <= 4.0) {
      const rT = t - 3.6;
      const env = Math.sin((rT / 0.4) * Math.PI);
      rcsR = rcsFilterR(whiteNoise()) * env * 0.4;
    }

    // Docking beacon carrier tone (880Hz / 440Hz pulse)
    const beacon = (t % 1.5 < 0.15 ? Math.sin((2 * Math.PI * 880 * i) / SAMPLE_RATE) * 0.08 : 0);

    left[i] = (roarL + ionL + rcsL + beacon) * 0.85;
    right[i] = (roarR + ionR + rcsR + beacon) * 0.85;
  }
  writeWavFile('mode-09-diplomatic-shuttle.wav', left, right);
}

// Generate all 9 audio assets
console.log('--- Generating 9 Distinct Mode-Specific Transportation Audio Assets ---');
generateHovercraft();
generateDrone();
generateTrain();
generateSpacecraft();
generateSubmarine();
generateBalloon();
generateMotorcycle();
generateTransitPod();
generateDiplomaticShuttle();
console.log('--- Successfully generated all 9 mode-specific audio files in public/audio/transportation ---');
