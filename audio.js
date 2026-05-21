/**
 * AI Agency Tycoon - 8-Bit Audio Synthesis Engine & Visualizer
 * Workspace: c:/Users/murat/Desktop/ai-agency
 * Built using native Web Audio API to dynamically synthesize retro chiptunes and sound effects.
 */

class AudioManager {
  constructor() {
    this.musicEnabled = false;
    this.sfxEnabled = true;
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.analyser = null;
    
    // BGM Sequencer state
    this.isPlayingMusic = false;
    this.tempo = 120;
    this.lookahead = 25.0; // How often to call scheduling function (in milliseconds)
    this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
    this.nextNoteTime = 0.0; // When the next note is due
    this.current16thNote = 0; // Current step (0-63)
    this.timerId = null;

    // Visualizer loop variables
    this.vizCanvas = null;
    this.vizCtx = null;
    this.vizAnimationId = null;

    // 8-Bit Cyberpunk BGM Notes (A-Minor / G-Major / F-Major Progression)
    // 0 represents a rest (no note)
    this.bassSequence = [
      // Bar 1-2: Am (Rhythmic arpeggiated low bass pluck)
      45, 0, 45, 0, 52, 0, 45, 0, 45, 0, 45, 0, 52, 0, 45, 0,
      45, 0, 45, 0, 52, 0, 45, 0, 45, 0, 45, 0, 52, 0, 45, 0,
      // Bar 3: F
      41, 0, 41, 0, 48, 0, 41, 0, 41, 0, 41, 0, 48, 0, 41, 0,
      // Bar 4: G
      43, 0, 43, 0, 50, 0, 43, 0, 43, 0, 43, 0, 50, 0, 47, 0
    ];

    this.melodySequence = [
      // Section A: Atmospheric retro lead
      57, 0, 57, 0, 59, 0, 59, 0, 60, 0, 60, 0, 60, 0, 60, 0,
      64, 0, 64, 0, 64, 0, 64, 0, 62, 0, 62, 0, 62, 0, 62, 0,
      60, 0, 60, 0, 59, 0, 59, 0, 57, 0, 57, 0, 57, 0, 57, 0,
      55, 0, 55, 0, 55, 0, 55, 0, 59, 0, 59, 0, 59, 0, 59, 0,
      
      // Section B: Escalation
      60, 0, 60, 0, 62, 0, 62, 0, 64, 0, 64, 0, 67, 0, 67, 0,
      69, 0, 69, 0, 67, 0, 67, 0, 64, 0, 64, 0, 62, 0, 62, 0,
      60, 0, 60, 0, 59, 0, 59, 0, 57, 0, 57, 0, 57, 0, 57, 0,
      59, 0, 59, 0, 60, 0, 60, 0, 62, 0, 62, 0, 64, 0, 64, 0
    ];
  }

  // Convert MIDI note numbers to frequency in Hz
  midiToFreq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  // Initialize the Audio Context safely
  init() {
    if (this.ctx) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Master Gain Node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      // Music Gain Node
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.25, this.ctx.currentTime); // Low BGM volume by default
      this.musicGain.connect(this.masterGain);

      // SFX Gain Node
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime); // Moderate SFX volume
      this.sfxGain.connect(this.masterGain);

      // Analyser Node for Visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64; // Small fftSize for responsive vertical bars
      
      // Connect master to analyser, and analyser to output destination
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      console.log("Audio Context initialized successfully.");
    } catch (e) {
      console.error("Web Audio API is not supported in this browser:", e);
    }
  }

  // Resume context if suspended (standard browser autoplay workaround)
  async resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
      console.log("Audio Context resumed.");
    }
  }

  // Set visualizer canvas
  setVisualizer(canvasId) {
    this.vizCanvas = document.getElementById(canvasId);
    if (this.vizCanvas) {
      this.vizCtx = this.vizCanvas.getContext('2d');
      // Hide visualizer by default until music starts
      this.vizCanvas.style.display = 'none';
    }
  }

  // Trigger synthesized Sound Effects
  async playSFX(type) {
    if (!this.sfxEnabled) return;
    await this.resume(); // Ensure context is active

    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    switch (type) {
      case 'type': // Subtle mechanical keyboard tick
        this.synthesizeTick(now);
        break;
      case 'click': // Standard UI click
        this.synthesizeClick(now);
        break;
      case 'success': // Successful operation (quick rising arpeggio)
        this.synthesizeSuccess(now);
        break;
      case 'error': // Action failed (harsh retro drop buzz)
        this.synthesizeError(now);
        break;
      case 'outbound': // Cold email / outbound pitch sound (retro laser)
        this.synthesizeLaser(now);
        break;
      case 'dealClose': // Closed deal (classic double-tone coin ring)
        this.synthesizeCoin(now);
        break;
      case 'levelUp': // Game level-up (triumphant major arpeggio cascade)
        this.synthesizeLevelUp(now);
        break;
    }
  }

  /* SFX SYNTHESIZERS */

  synthesizeTick(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    // Fast frequency sweep for a crisp mechanical click
    osc.frequency.setValueAtTime(1200, time);
    osc.frequency.exponentialRampToValueAtTime(700, time + 0.015);

    gain.gain.setValueAtTime(0.04, time); // Extremely quiet to not be annoying
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.015);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.02);
  }

  synthesizeClick(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, time);
    osc.frequency.exponentialRampToValueAtTime(300, time + 0.05);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  synthesizeSuccess(time) {
    const notes = [60, 64, 67, 72]; // C4, E4, G4, C5 (major chord arpeggio)
    const noteDuration = 0.07;

    notes.forEach((note, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = time + (index * noteDuration);

      osc.type = 'square';
      osc.frequency.setValueAtTime(this.midiToFreq(note), noteTime);

      gain.gain.setValueAtTime(0.1, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.16);
    });
  }

  synthesizeError(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.linearRampToValueAtTime(50, time + 0.25);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.26);
  }

  synthesizeLaser(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1600, time);
    osc.frequency.exponentialRampToValueAtTime(150, time + 0.25);

    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.26);
  }

  synthesizeCoin(time) {
    // Two quick square wave notes (e.g. Super Mario style)
    const note1 = 987.77; // B5
    const note2 = 1318.51; // E6
    
    // Note 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(note1, time);
    gain1.gain.setValueAtTime(0.12, time);
    gain1.gain.setValueAtTime(0.12, time + 0.08);
    gain1.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(time);
    osc1.stop(time + 0.1);

    // Note 2 (played slightly delayed)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    const startTime2 = time + 0.08;
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(note2, startTime2);
    gain2.gain.setValueAtTime(0.12, startTime2);
    gain2.gain.exponentialRampToValueAtTime(0.001, startTime2 + 0.35);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(startTime2);
    osc2.stop(startTime2 + 0.4);
  }

  synthesizeLevelUp(time) {
    const scale = [48, 52, 55, 60, 64, 67, 72, 76, 79, 84]; // C3 to C6 upward arpeggio
    const stepTime = 0.08;

    scale.forEach((note, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = time + (index * stepTime);

      osc.type = index === scale.length - 1 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(this.midiToFreq(note), noteTime);
      
      // Add a pitch swell to the final note
      if (index === scale.length - 1) {
        osc.frequency.setValueAtTime(this.midiToFreq(note), noteTime);
        osc.frequency.linearRampToValueAtTime(this.midiToFreq(note) + 10, noteTime + 0.4);
      }

      const dur = index === scale.length - 1 ? 0.6 : 0.15;
      gain.gain.setValueAtTime(0.15, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + dur);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + dur + 0.05);
    });
  }

  /* BGM SEQUENCER (CHIPTUNE MUSIC LOOP) */

  startMusic() {
    this.resume();
    if (!this.ctx || this.isPlayingMusic) return;

    this.isPlayingMusic = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.current16thNote = 0;
    
    // Show visualizer canvas when BGM is running
    if (this.vizCanvas) {
      this.vizCanvas.style.display = 'block';
      this.startVisualizerLoop();
    }

    this.scheduler();
  }

  stopMusic() {
    if (!this.isPlayingMusic) return;

    this.isPlayingMusic = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    // Hide visualizer canvas and stop animation loop
    if (this.vizCanvas) {
      this.vizCanvas.style.display = 'none';
      if (this.vizAnimationId) {
        cancelAnimationFrame(this.vizAnimationId);
        this.vizAnimationId = null;
      }
    }
  }

  // Schedules notes in lookahead windows to keep audio perfectly on-beat
  scheduler() {
    if (!this.isPlayingMusic) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.advanceNote();
    }

    this.timerId = setTimeout(() => this.scheduler(), this.lookahead);
  }

  // Advance time cursor to the next 16th note
  advanceNote() {
    const secondsPerBeat = 60.0 / this.tempo;
    const sixteenthNoteDuration = secondsPerBeat / 4; // 16th note length
    this.nextNoteTime += sixteenthNoteDuration;

    // Loop at 64 steps (4 bars of 16th notes)
    this.current16thNote = (this.current16thNote + 1) % 64;
  }

  // Schedule a synth note to play at a specific future time
  scheduleNote(step, time) {
    if (!this.musicEnabled) return;

    const secondsPerBeat = 60.0 / this.tempo;
    const stepDuration = secondsPerBeat / 4;

    // 1. Play Bass Note (Every 2 steps = 8th notes, if present)
    const bassNote = this.bassSequence[step % 64];
    if (bassNote > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle'; // Warm, round bass pluck
      osc.frequency.setValueAtTime(this.midiToFreq(bassNote), time);

      // Bass envelope (short punchy pluck)
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.08, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.5);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + stepDuration * 1.6);
    }

    // 2. Play Melody Note (Square lead, if present)
    const melodyNote = this.melodySequence[step % 64];
    if (melodyNote > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      // We run the square wave through a low-pass filter to make it warmer & more retro-futuristic
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, time);
      filter.Q.setValueAtTime(4, time);

      osc.type = 'square'; // Classic chiptune sound
      osc.frequency.setValueAtTime(this.midiToFreq(melodyNote), time);

      // Subtle vibrato (pitch LFO) to make the melody sound organic
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(6, time); // 6 Hz vibrato
      lfoGain.gain.setValueAtTime(5, time); // Pitch offset range
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(time);
      lfo.stop(time + stepDuration * 1.8);

      // Melody envelope (slight decay, nice sustain)
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.06, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.04, time + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + stepDuration * 1.9);

      // Synthesize a quick chiptune "Echo/Delay" effect
      const echoDelay = 0.15; // 150ms delay
      const echoGain = this.ctx.createGain();
      echoGain.gain.setValueAtTime(0, time + echoDelay);
      echoGain.gain.linearRampToValueAtTime(0.02, time + echoDelay + 0.01);
      echoGain.gain.exponentialRampToValueAtTime(0.001, time + echoDelay + stepDuration * 1.5);
      
      const echoOsc = this.ctx.createOscillator();
      echoOsc.type = 'square';
      echoOsc.frequency.setValueAtTime(this.midiToFreq(melodyNote), time + echoDelay);
      
      echoOsc.connect(filter);
      filter.connect(echoGain);
      echoGain.connect(this.musicGain);

      echoOsc.start(time + echoDelay);
      echoOsc.stop(time + echoDelay + stepDuration * 1.6);
    }
  }

  /* RETRO SPECTRUM ANALYSER DRAWING */

  startVisualizerLoop() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.isPlayingMusic || !this.vizCtx || !this.vizCanvas) return;

      this.vizAnimationId = requestAnimationFrame(draw);

      const width = this.vizCanvas.width;
      const height = this.vizCanvas.height;

      // Retrieve frequency data from analyser node
      this.analyser.getByteFrequencyData(dataArray);

      // Clear visualizer background with slight transparency for a neon trail effect
      this.vizCtx.fillStyle = 'rgba(5, 8, 17, 0.4)';
      this.vizCtx.fillRect(0, 0, width, height);

      // Draw small neon spectrum bars
      const barCount = 10;
      const barWidth = Math.floor(width / barCount) - 1;
      
      for (let i = 0; i < barCount; i++) {
        // Sample frequencies from index 1 to 20 (lows to mids)
        const sampleIndex = Math.floor(i * 1.8) + 1;
        const value = dataArray[sampleIndex] || 0;
        
        // Normalize height to fit the visualizer canvas (20px max)
        const percent = value / 255;
        const barHeight = percent * height;
        
        // Horizontal placement
        const x = i * (barWidth + 1);
        const y = height - barHeight;

        // Alternate neon green and neon blue gradients
        const isGreen = i % 2 === 0;
        this.vizCtx.fillStyle = isGreen ? '#00ff66' : '#00e5ff';
        
        // Render bar
        this.vizCtx.fillRect(x, y, barWidth, barHeight);
      }
    };

    draw();
  }
}

// Export single instances so it behaves as a global singleton across files
window.audioManager = new AudioManager();
