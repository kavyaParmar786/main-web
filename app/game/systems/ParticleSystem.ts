// FILE: /app/game/systems/ParticleSystem.ts

import Phaser from "phaser";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  color: number;
  life: number;
  maxLife: number;
  type: "float" | "burst" | "trail" | "data";
}

export default class ParticleSystem {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private particles: Particle[] = [];
  private readonly MAX_PARTICLES = 300;

  constructor(scene: Phaser.Scene, depth = 25) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(depth);
  }

  // ── Spawn ambient floating particles ──────────────────────
  spawnAmbient(worldWidth: number, worldHeight: number, count = 80) {
    const colors = [0x00d4ff, 0xb347ff, 0x00ffe7, 0xff2d9b];

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.MAX_PARTICLES) break;

      this.particles.push({
        x: Math.random() * worldWidth,
        y: Math.random() * worldHeight,
        vx: (Math.random() - 0.5) * 8,
        vy: -(Math.random() * 12 + 3),
        size: Math.random() * 2 + 0.5,
        alpha: 0,
        maxAlpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 8000,
        maxLife: 8000 + Math.random() * 4000,
        type: "float",
      });
    }
  }

  // ── Burst effect at position ───────────────────────────────
  burst(x: number, y: number, color: number, count = 20) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.MAX_PARTICLES) break;

      const angle = (i / count) * Math.PI * 2;
      const speed = Math.random() * 120 + 40;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        size: Math.random() * 3 + 1,
        alpha: 0,
        maxAlpha: Math.random() * 0.8 + 0.2,
        color,
        life: 0,
        maxLife: 800 + Math.random() * 400,
        type: "burst",
      });
    }
  }

  // ── Data stream particles (falling matrix-style) ───────────
  spawnDataStream(x: number, worldHeight: number, color = 0x00d4ff) {
    if (this.particles.length >= this.MAX_PARTICLES) return;

    this.particles.push({
      x: x + (Math.random() - 0.5) * 40,
      y: -10,
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 60 + 30,
      size: Math.random() * 1.5 + 0.5,
      alpha: 0,
      maxAlpha: Math.random() * 0.4 + 0.1,
      color,
      life: 0,
      maxLife: (worldHeight / 90) * 1000,
      type: "data",
    });
  }

  // ── Trail particles for player ────────────────────────────
  spawnTrail(x: number, y: number, vx: number) {
    if (this.particles.length >= this.MAX_PARTICLES || Math.abs(vx) < 10) return;

    this.particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: -vx * 0.3 + (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      size: Math.random() * 2 + 0.5,
      alpha: 0,
      maxAlpha: 0.5,
      color: 0x00d4ff,
      life: 0,
      maxLife: 400,
      type: "trail",
    });
  }

  // ── Update all particles ──────────────────────────────────
  update(delta: number) {
    const dt = delta / 1000;

    this.particles = this.particles.filter((p) => {
      p.life += delta;

      // Life progress [0..1]
      const progress = p.life / p.maxLife;

      // Position
      if (p.type !== "data") {
        p.vy += 5 * dt; // tiny gravity for float particles
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Alpha curve: fade in → hold → fade out
      if (progress < 0.1) {
        p.alpha = (progress / 0.1) * p.maxAlpha;
      } else if (progress > 0.7) {
        p.alpha = ((1 - progress) / 0.3) * p.maxAlpha;
      } else {
        p.alpha = p.maxAlpha;
      }

      // For float particles, reset when they leave screen top
      if (p.type === "float" && p.y < -20) {
        p.y = 800;
        p.life = 0;
        return true;
      }

      return p.life < p.maxLife;
    });

    this.draw();
  }

  private draw() {
    this.graphics.clear();

    this.particles.forEach((p) => {
      if (p.alpha <= 0.01) return;

      if (p.type === "data") {
        // Small rectangle for data particles
        this.graphics.fillStyle(p.color, p.alpha);
        this.graphics.fillRect(p.x, p.y, p.size, p.size * 2);
      } else {
        // Circle for all others
        this.graphics.fillStyle(p.color, p.alpha);
        this.graphics.fillCircle(p.x, p.y, p.size);

        // Extra glow for burst
        if (p.type === "burst") {
          this.graphics.fillStyle(p.color, p.alpha * 0.3);
          this.graphics.fillCircle(p.x, p.y, p.size * 2.5);
        }
      }
    });
  }

  get count() {
    return this.particles.length;
  }

  destroy() {
    this.graphics.destroy();
    this.particles = [];
  }
}
