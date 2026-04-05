// FILE: /app/game/systems/SoundSystem.ts

/**
 * SoundSystem — lightweight Web Audio API manager.
 * Generates procedural UI sounds without any asset files.
 * All sounds are synthesized at runtime.
 */
export default class SoundSystem {
  private ctx: AudioContext | null = null;
  private enabled = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // Lazy-init AudioContext on first interaction
  }

  private ensureContext() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    } catch {
      console.warn("Web Audio API not available");
    }
  }

  enable() {
    this.enabled = true;
    this.ensureContext();
    if (this.ctx?.state === "suspended") {
      this.ctx.resume();
    }
  }

  disable() {
    this.enabled = false;
    if (this.masterGain) {
      this.masterGain.gain.value = 0;
    }
  }

  toggle() {
    if (this.enabled) this.disable();
    else this.enable();
    return this.enabled;
  }

  // ── UI Hover ──────────────────────────────────────────────
  playHover() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // ── UI Click ──────────────────────────────────────────────
  playClick() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = "square";
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // ── Zone Entry ─────────────────────────────────────────────
  playZoneEnter() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;

    const freqs = [261, 329, 392, 523];
    freqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.type = "sine";
      osc.frequency.value = freq;

      const t = this.ctx!.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  // ── Jump ──────────────────────────────────────────────────
  playJump() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = "sine";
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // ── Interact / Open Modal ──────────────────────────────────
  playInteract() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;

    [0, 0.06, 0.12].forEach((delay, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.type = "triangle";
      osc.frequency.value = [440, 554, 659][i];

      const t = this.ctx!.currentTime + delay;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // ── Ambient drone (looping) ────────────────────────────────
  private ambientNode: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  startAmbient() {
    if (!this.enabled || !this.ctx || !this.masterGain || this.ambientNode) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0.03;
    this.ambientGain.connect(this.masterGain);

    this.ambientNode = this.ctx.createOscillator();
    this.ambientNode.type = "sine";
    this.ambientNode.frequency.value = 55; // Low A drone
    this.ambientNode.connect(this.ambientGain);
    this.ambientNode.start();

    // Add slight wobble
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.3;
    lfoGain.gain.value = 2;
    lfo.connect(lfoGain);
    lfoGain.connect(this.ambientNode.frequency);
    lfo.start();
  }

  stopAmbient() {
    if (this.ambientNode) {
      this.ambientNode.stop();
      this.ambientNode = null;
    }
  }

  // ── Boot beep sequence ────────────────────────────────────
  playBootSequence() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;

    const sequence = [
      { freq: 220, dur: 0.08, t: 0 },
      { freq: 440, dur: 0.05, t: 0.1 },
      { freq: 880, dur: 0.12, t: 0.2 },
      { freq: 1760, dur: 0.3, t: 0.4 },
    ];

    sequence.forEach(({ freq, dur, t }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.type = "square";
      osc.frequency.value = freq;

      const start = this.ctx!.currentTime + t;
      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.start(start);
      osc.stop(start + dur);
    });
  }
}

// Singleton
export const soundSystem = typeof window !== "undefined" ? new SoundSystem() : null;
