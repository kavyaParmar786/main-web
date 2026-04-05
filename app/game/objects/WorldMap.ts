// FILE: /app/game/objects/WorldMap.ts

import Phaser from "phaser";
import { WORLD_WIDTH, WORLD_HEIGHT, ZONE_POSITIONS, PORTFOLIO_DATA } from "../systems/gameStore";

export interface Interactable {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  type: "project" | "info" | "contact" | "skill";
  data?: unknown;
}

export default class WorldMap {
  private scene: Phaser.Scene;
  public interactables: Interactable[] = [];
  private graphics: Phaser.GameObjects.Graphics;
  private bgGraphics: Phaser.GameObjects.Graphics;
  private fgGraphics: Phaser.GameObjects.Graphics;
  private particles: Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; alpha: number; color: number;
  }> = [];
  private dataStreams: Array<{
    x: number; y: number; speed: number; text: string; alpha: number;
  }> = [];
  private animTimer = 0;
  private zoneLabels: Phaser.GameObjects.Text[] = [];
  private buildingGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.bgGraphics = scene.add.graphics().setDepth(0);
    this.graphics = scene.add.graphics().setDepth(10);
    this.buildingGraphics = scene.add.graphics().setDepth(15);
    this.fgGraphics = scene.add.graphics().setDepth(20);

    this.initParticles();
    this.initDataStreams();
    this.buildInteractables();
    this.buildZoneLabels();
  }

  private initParticles() {
    for (let i = 0; i < 120; i++) {
      this.particles.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        vx: (Math.random() - 0.5) * 15,
        vy: -(Math.random() * 20 + 5),
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
        color: [0x00d4ff, 0xb347ff, 0x00ffe7, 0xff2d9b][Math.floor(Math.random() * 4)],
      });
    }
  }

  private initDataStreams() {
    for (let i = 0; i < 30; i++) {
      this.dataStreams.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        speed: Math.random() * 40 + 20,
        text: Math.random() > 0.5 ? "01" : "10",
        alpha: Math.random() * 0.3 + 0.1,
      });
    }
  }

  private buildInteractables() {
    const projects = PORTFOLIO_DATA.projects;

    // Project terminals
    projects.forEach((proj, i) => {
      const x = ZONE_POSITIONS.projects + 300 + i * 380;
      this.interactables.push({
        id: proj.id,
        x,
        y: WORLD_HEIGHT - 140,
        width: 200,
        height: 120,
        label: proj.title,
        type: "project",
        data: proj,
      });
    });

    // About zone info panel
    this.interactables.push({
      id: "about-panel",
      x: ZONE_POSITIONS.about + 400,
      y: WORLD_HEIGHT - 200,
      width: 180,
      height: 100,
      label: "PROFILE",
      type: "info",
    });

    // Contact terminal
    this.interactables.push({
      id: "contact-terminal",
      x: ZONE_POSITIONS.contact + 500,
      y: WORLD_HEIGHT - 150,
      width: 220,
      height: 130,
      label: "CONTACT",
      type: "contact",
    });
  }

  private buildZoneLabels() {
    const zones = [
      { x: ZONE_POSITIONS.about + 200, name: "ABOUT" },
      { x: ZONE_POSITIONS.projects + 200, name: "PROJECTS" },
      { x: ZONE_POSITIONS.skills + 200, name: "SKILLS" },
      { x: ZONE_POSITIONS.experience + 200, name: "EXPERIENCE" },
      { x: ZONE_POSITIONS.contact + 200, name: "CONTACT" },
    ];

    zones.forEach(({ x, name }) => {
      const text = this.scene.add.text(x, 60, `// ${name}`, {
        fontFamily: "'Orbitron', monospace",
        fontSize: "11px",
        color: "#00d4ff",
      });
      text.setAlpha(0.3);
      text.setDepth(5);
      this.zoneLabels.push(text);
    });
  }

  update(delta: number, camX: number) {
    this.animTimer += delta;
    const dt = delta / 1000;

    // Update particles
    this.particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha -= 0.002;

      if (p.y < -20 || p.alpha <= 0) {
        p.x = Math.random() * WORLD_WIDTH;
        p.y = WORLD_HEIGHT + 10;
        p.alpha = Math.random() * 0.5 + 0.1;
        p.vy = -(Math.random() * 20 + 5);
      }
    });

    // Update data streams
    this.dataStreams.forEach((d) => {
      d.y += d.speed * dt;
      if (d.y > WORLD_HEIGHT + 20) {
        d.y = -20;
        d.alpha = Math.random() * 0.3 + 0.05;
      }
    });

    this.drawAll(camX);
  }

  private drawAll(camX: number) {
    this.bgGraphics.clear();
    this.graphics.clear();
    this.buildingGraphics.clear();
    this.fgGraphics.clear();

    this.drawBackground();
    this.drawGrid();
    this.drawParticles();
    this.drawGround();
    this.drawZones();
    this.drawBuildings();
    this.drawInteractableObjects();
    this.drawForeground();
  }

  private drawBackground() {
    // Deep space gradient - drawn as sky zones
    this.bgGraphics.fillGradientStyle(0x020408, 0x020408, 0x060d17, 0x060d17, 1);
    this.bgGraphics.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT * 0.65);

    // Stars
    for (let i = 0; i < 200; i++) {
      const starX = ((i * 137.5) % WORLD_WIDTH);
      const starY = ((i * 97.3) % (WORLD_HEIGHT * 0.6));
      const brightness = 0.2 + (i % 5) * 0.15;
      const pulse = Math.sin(this.animTimer * 0.001 + i) * 0.2;
      this.bgGraphics.fillStyle(0xffffff, brightness + pulse);
      this.bgGraphics.fillRect(starX, starY, 1.5, 1.5);
    }

    // Nebula zones (colored glow patches)
    const nebulas = [
      { x: ZONE_POSITIONS.about + 600, y: 150, r: 300, color: 0x00d4ff, a: 0.04 },
      { x: ZONE_POSITIONS.projects + 800, y: 200, r: 350, color: 0xb347ff, a: 0.04 },
      { x: ZONE_POSITIONS.skills + 600, y: 150, r: 280, color: 0x00ffe7, a: 0.04 },
      { x: ZONE_POSITIONS.contact + 500, y: 200, r: 320, color: 0xff2d9b, a: 0.04 },
    ];

    nebulas.forEach(({ x, y, r, color, a }) => {
      const pulse = Math.sin(this.animTimer * 0.001) * 0.02;
      this.bgGraphics.fillStyle(color, a + pulse);
      this.bgGraphics.fillCircle(x, y, r);
    });
  }

  private drawGrid() {
    // Perspective grid on ground
    const gridAlpha = 0.06;
    this.graphics.lineStyle(1, 0x00d4ff, gridAlpha);

    // Horizontal lines
    for (let y = WORLD_HEIGHT * 0.65; y <= WORLD_HEIGHT; y += 40) {
      this.graphics.beginPath();
      this.graphics.moveTo(0, y);
      this.graphics.lineTo(WORLD_WIDTH, y);
      this.graphics.strokePath();
    }

    // Vertical lines
    for (let x = 0; x <= WORLD_WIDTH; x += 80) {
      this.graphics.lineStyle(1, 0x00d4ff, gridAlpha * (0.5 + 0.5 * Math.sin(x * 0.01)));
      this.graphics.beginPath();
      this.graphics.moveTo(x, WORLD_HEIGHT * 0.65);
      this.graphics.lineTo(x, WORLD_HEIGHT);
      this.graphics.strokePath();
    }
  }

  private drawParticles() {
    this.particles.forEach((p) => {
      this.bgGraphics.fillStyle(p.color, p.alpha);
      this.bgGraphics.fillCircle(p.x, p.y, p.size);
    });
  }

  private drawGround() {
    const groundY = WORLD_HEIGHT - 80;

    // Ground fill
    this.graphics.fillGradientStyle(0x0a1628, 0x0a1628, 0x060d17, 0x060d17, 1);
    this.graphics.fillRect(0, groundY, WORLD_WIDTH, 80);

    // Ground neon line
    const pulse = 0.6 + Math.sin(this.animTimer * 0.002) * 0.4;
    this.graphics.lineStyle(2, 0x00d4ff, pulse);
    this.graphics.beginPath();
    this.graphics.moveTo(0, groundY);
    this.graphics.lineTo(WORLD_WIDTH, groundY);
    this.graphics.strokePath();

    // Ground secondary line
    this.graphics.lineStyle(1, 0xb347ff, pulse * 0.4);
    this.graphics.beginPath();
    this.graphics.moveTo(0, groundY + 4);
    this.graphics.lineTo(WORLD_WIDTH, groundY + 4);
    this.graphics.strokePath();
  }

  private drawZones() {
    // Zone separator columns
    const zones = [
      ZONE_POSITIONS.about,
      ZONE_POSITIONS.projects,
      ZONE_POSITIONS.skills,
      ZONE_POSITIONS.experience,
      ZONE_POSITIONS.contact,
    ];

    zones.forEach((zx) => {
      const pulse = 0.1 + Math.sin(this.animTimer * 0.002 + zx * 0.001) * 0.05;
      this.graphics.lineStyle(1, 0x00d4ff, pulse);
      this.graphics.beginPath();
      this.graphics.moveTo(zx, 0);
      this.graphics.lineTo(zx, WORLD_HEIGHT);
      this.graphics.strokePath();

      // Zone marker
      this.graphics.fillStyle(0x00d4ff, 0.3);
      this.graphics.fillTriangle(zx - 8, 90, zx + 8, 90, zx, 110);
    });
  }

  private drawBuildings() {
    const t = this.animTimer;

    // ── About Zone: Holographic pillars ──
    this.drawHoloPillar(ZONE_POSITIONS.about + 600, WORLD_HEIGHT - 80, 120, 260, 0x00d4ff);
    this.drawHoloPillar(ZONE_POSITIONS.about + 900, WORLD_HEIGHT - 80, 80, 180, 0xb347ff);
    this.drawHoloPillar(ZONE_POSITIONS.about + 1100, WORLD_HEIGHT - 80, 60, 140, 0x00ffe7);

    // ── Projects Zone: Terminals/Buildings ──
    PORTFOLIO_DATA.projects.forEach((proj, i) => {
      const bx = ZONE_POSITIONS.projects + 280 + i * 380;
      this.drawTerminalBuilding(bx, WORLD_HEIGHT - 80, 220, 160, proj.color as string);
    });

    // ── Skills Zone: Energy cores ──
    PORTFOLIO_DATA.skills.forEach((skill, i) => {
      const sx = ZONE_POSITIONS.skills + 200 + i * 200;
      const sy = WORLD_HEIGHT - 80;
      this.drawEnergyCore(sx, sy, 50 + skill.level * 0.5, skill.color as string, t);
    });

    // ── Experience Zone: Timeline towers ──
    PORTFOLIO_DATA.experience.forEach((exp, i) => {
      const ex = ZONE_POSITIONS.experience + 300 + i * 350;
      this.drawTimelineTower(ex, WORLD_HEIGHT - 80, i, t);
    });

    // ── Contact Zone: Console terminal ──
    this.drawContactConsole(ZONE_POSITIONS.contact + 400, WORLD_HEIGHT - 80, t);
  }

  private drawHoloPillar(x: number, y: number, w: number, h: number, color: number) {
    const t = this.animTimer;
    const hex = color;
    const pulse = 0.3 + Math.sin(t * 0.002 + x * 0.001) * 0.15;

    // Base
    this.buildingGraphics.fillStyle(0x0a1628, 1);
    this.buildingGraphics.fillRect(x - w / 2, y - h, w, h);

    // Color overlay
    this.buildingGraphics.fillStyle(hex, 0.06);
    this.buildingGraphics.fillRect(x - w / 2, y - h, w, h);

    // Border
    this.buildingGraphics.lineStyle(1, hex, pulse);
    this.buildingGraphics.strokeRect(x - w / 2, y - h, w, h);

    // Scanline effect inside
    for (let hy = y - h; hy < y; hy += 16) {
      const lAlpha = 0.05 + Math.sin(hy * 0.1 + t * 0.003) * 0.03;
      this.buildingGraphics.lineStyle(1, hex, lAlpha);
      this.buildingGraphics.beginPath();
      this.buildingGraphics.moveTo(x - w / 2 + 2, hy);
      this.buildingGraphics.lineTo(x + w / 2 - 2, hy);
      this.buildingGraphics.strokePath();
    }

    // Top glow
    this.buildingGraphics.fillStyle(hex, pulse);
    this.buildingGraphics.fillRect(x - w / 2, y - h - 3, w, 3);
  }

  private drawTerminalBuilding(x: number, y: number, w: number, h: number, colorHex: string) {
    const t = this.animTimer;
    const color = parseInt(colorHex.replace("#", ""), 16);
    const pulse = 0.4 + Math.sin(t * 0.002 + x * 0.001) * 0.2;

    // Body
    this.buildingGraphics.fillStyle(0x060d17, 1);
    this.buildingGraphics.fillRect(x - w / 2, y - h, w, h);

    // Border
    this.buildingGraphics.lineStyle(1.5, color, pulse);
    this.buildingGraphics.strokeRect(x - w / 2, y - h, w, h);

    // Screen area
    const screenH = h * 0.55;
    this.buildingGraphics.fillStyle(color, 0.08);
    this.buildingGraphics.fillRect(x - w / 2 + 10, y - h + 10, w - 20, screenH);
    this.buildingGraphics.lineStyle(1, color, 0.3);
    this.buildingGraphics.strokeRect(x - w / 2 + 10, y - h + 10, w - 20, screenH);

    // Code lines inside screen
    for (let li = 0; li < 5; li++) {
      const lineW = (0.4 + Math.random() * 0.4) * (w - 30);
      const lAlpha = 0.2 + Math.sin(t * 0.005 + li * 1.2) * 0.15;
      this.buildingGraphics.fillStyle(color, lAlpha);
      this.buildingGraphics.fillRect(
        x - w / 2 + 15,
        y - h + 20 + li * 14,
        lineW,
        2
      );
    }

    // Bottom label stripe
    this.buildingGraphics.fillStyle(color, 0.2);
    this.buildingGraphics.fillRect(x - w / 2, y - 28, w, 28);

    // Glow base
    this.buildingGraphics.fillStyle(color, 0.06 + pulse * 0.04);
    this.buildingGraphics.fillRect(x - w / 2 - 5, y - 5, w + 10, 5);
  }

  private drawEnergyCore(x: number, y: number, radius: number, colorHex: string, t: number) {
    const color = parseInt(colorHex.replace("#", ""), 16);
    const pulse = Math.sin(t * 0.004 + x * 0.003);
    const r = radius + pulse * 5;

    // Outer ring
    this.buildingGraphics.lineStyle(2, color, 0.3 + pulse * 0.2);
    this.buildingGraphics.strokeCircle(x, y - r, r + 15);
    this.buildingGraphics.lineStyle(1, color, 0.15);
    this.buildingGraphics.strokeCircle(x, y - r, r + 25);

    // Core
    this.buildingGraphics.fillStyle(color, 0.15 + pulse * 0.08);
    this.buildingGraphics.fillCircle(x, y - r, r);

    // Inner bright core
    this.buildingGraphics.fillStyle(0xffffff, 0.2 + pulse * 0.15);
    this.buildingGraphics.fillCircle(x, y - r, r * 0.3);

    // Orbiting particle
    const angle = (t * 0.003 + x) % (Math.PI * 2);
    const orbitX = x + Math.cos(angle) * (r + 10);
    const orbitY = (y - r) + Math.sin(angle) * (r + 10);
    this.buildingGraphics.fillStyle(color, 0.9);
    this.buildingGraphics.fillCircle(orbitX, orbitY, 3);

    // Pedestal
    this.buildingGraphics.fillStyle(0x0a1628, 1);
    this.buildingGraphics.fillRect(x - 10, y - r * 2 + 10, 20, r * 2 - 10);
    this.buildingGraphics.lineStyle(1, color, 0.3);
    this.buildingGraphics.strokeRect(x - 10, y - r * 2 + 10, 20, r * 2 - 10);
  }

  private drawTimelineTower(x: number, y: number, index: number, t: number) {
    const colors = [0x00d4ff, 0xb347ff, 0x00ffe7, 0xff2d9b];
    const color = colors[index % colors.length];
    const h = 140 + index * 20;
    const pulse = 0.4 + Math.sin(t * 0.003 + index) * 0.2;

    // Tower body
    this.buildingGraphics.fillStyle(0x0a1628, 1);
    this.buildingGraphics.fillRect(x - 30, y - h, 60, h);
    this.buildingGraphics.lineStyle(1, color, pulse);
    this.buildingGraphics.strokeRect(x - 30, y - h, 60, h);

    // Year indicator
    this.buildingGraphics.fillStyle(color, 0.8);
    this.buildingGraphics.fillRect(x - 25, y - h + 8, 50, 20);

    // Dot on top
    this.buildingGraphics.fillStyle(color, pulse);
    this.buildingGraphics.fillCircle(x, y - h, 8);
    this.buildingGraphics.lineStyle(1, color, 0.3);
    this.buildingGraphics.strokeCircle(x, y - h, 15);

    // Connector line to next tower
    if (index < 3) {
      this.buildingGraphics.lineStyle(1, color, 0.2);
      this.buildingGraphics.beginPath();
      this.buildingGraphics.moveTo(x + 30, y - h);
      this.buildingGraphics.lineTo(x + 320, y - h - 20);
      this.buildingGraphics.strokePath();
    }
  }

  private drawContactConsole(x: number, y: number, t: number) {
    const w = 380;
    const h = 280;
    const pulse = 0.4 + Math.sin(t * 0.002) * 0.2;

    // Console body
    this.buildingGraphics.fillStyle(0x040b14, 1);
    this.buildingGraphics.fillRect(x - w / 2, y - h, w, h);
    this.buildingGraphics.lineStyle(2, 0x00ffe7, pulse);
    this.buildingGraphics.strokeRect(x - w / 2, y - h, w, h);

    // Screen
    this.buildingGraphics.fillStyle(0x00ffe7, 0.05);
    this.buildingGraphics.fillRect(x - w / 2 + 12, y - h + 12, w - 24, h * 0.65);
    this.buildingGraphics.lineStyle(1, 0x00ffe7, 0.2);
    this.buildingGraphics.strokeRect(x - w / 2 + 12, y - h + 12, w - 24, h * 0.65);

    // Blinking cursor line
    const showCursor = Math.sin(t * 0.01) > 0;
    if (showCursor) {
      this.buildingGraphics.fillStyle(0x00ffe7, 0.8);
      this.buildingGraphics.fillRect(x - w / 2 + 20, y - h * 0.45, 8, 12);
    }

    // Bottom keyboard area
    this.buildingGraphics.fillStyle(0x00ffe7, 0.15);
    this.buildingGraphics.fillRect(x - w / 2 + 12, y - h + h * 0.72, w - 24, h * 0.22);

    // Key grid pattern
    for (let ki = 0; ki < 10; ki++) {
      for (let kj = 0; kj < 3; kj++) {
        this.buildingGraphics.fillStyle(0x00ffe7, 0.1);
        this.buildingGraphics.fillRect(
          x - w / 2 + 18 + ki * 34,
          y - h + h * 0.74 + kj * 17,
          28, 12
        );
      }
    }
  }

  private drawInteractableObjects() {
    const t = this.animTimer;

    this.interactables.forEach((obj) => {
      const pulse = 0.5 + Math.sin(t * 0.003 + obj.x * 0.001) * 0.3;

      // Hover indicator (floating bracket)
      this.fgGraphics.lineStyle(1, 0x00d4ff, pulse);
      const bw = obj.width + 20;
      const bh = 20;
      const bx = obj.x - bw / 2;
      const by = obj.y - obj.height - 40;

      // Corner brackets
      const cs = 8; // corner size
      this.fgGraphics.beginPath();
      this.fgGraphics.moveTo(bx, by + cs);
      this.fgGraphics.lineTo(bx, by);
      this.fgGraphics.lineTo(bx + cs, by);
      this.fgGraphics.strokePath();

      this.fgGraphics.beginPath();
      this.fgGraphics.moveTo(bx + bw - cs, by);
      this.fgGraphics.lineTo(bx + bw, by);
      this.fgGraphics.lineTo(bx + bw, by + cs);
      this.fgGraphics.strokePath();

      this.fgGraphics.beginPath();
      this.fgGraphics.moveTo(bx, by + bh - cs);
      this.fgGraphics.lineTo(bx, by + bh);
      this.fgGraphics.lineTo(bx + cs, by + bh);
      this.fgGraphics.strokePath();

      this.fgGraphics.beginPath();
      this.fgGraphics.moveTo(bx + bw - cs, by + bh);
      this.fgGraphics.lineTo(bx + bw, by + bh);
      this.fgGraphics.lineTo(bx + bw, by + bh - cs);
      this.fgGraphics.strokePath();

      // E prompt (floating above)
      this.fgGraphics.fillStyle(0x00d4ff, pulse * 0.8);
      this.fgGraphics.fillRect(obj.x - 10, by - 22, 20, 16);
      this.fgGraphics.lineStyle(1, 0x00d4ff, 0.5);
      this.fgGraphics.strokeRect(obj.x - 10, by - 22, 20, 16);
    });
  }

  private drawForeground() {
    // Foreground depth elements
    const t = this.animTimer;

    // Floating data nodes
    const nodes = [
      { x: ZONE_POSITIONS.about + 200, baseY: 300 },
      { x: ZONE_POSITIONS.projects + 180, baseY: 250 },
      { x: ZONE_POSITIONS.skills + 180, baseY: 280 },
      { x: ZONE_POSITIONS.contact + 200, baseY: 300 },
    ];

    nodes.forEach(({ x, baseY }) => {
      const floatY = baseY + Math.sin(t * 0.002 + x * 0.001) * 15;
      this.fgGraphics.lineStyle(1, 0x00d4ff, 0.15);
      this.fgGraphics.strokeCircle(x, floatY, 40);
      this.fgGraphics.fillStyle(0x00d4ff, 0.06);
      this.fgGraphics.fillCircle(x, floatY, 40);
      this.fgGraphics.fillStyle(0x00d4ff, 0.3);
      this.fgGraphics.fillCircle(x, floatY, 4);
    });
  }

  public getInteractableAt(x: number, y: number, radius = 120): Interactable | null {
    return (
      this.interactables.find((obj) => {
        const dist = Math.hypot(obj.x - x, obj.y - (obj.y - obj.height / 2));
        return Math.abs(obj.x - x) < radius;
      }) || null
    );
  }

  public destroy() {
    this.bgGraphics.destroy();
    this.graphics.destroy();
    this.buildingGraphics.destroy();
    this.fgGraphics.destroy();
    this.zoneLabels.forEach((t) => t.destroy());
  }
}
