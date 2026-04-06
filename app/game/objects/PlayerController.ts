// FILE: /app/game/objects/PlayerController.ts

import Phaser from "phaser";

export interface PlayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  onPositionChange?: (x: number, y: number) => void;
}

export default class PlayerController {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private container: Phaser.GameObjects.Container;
  private glow: Phaser.GameObjects.Graphics;
  private trail: Phaser.GameObjects.Graphics;
  private trailPoints: Array<{ x: number; y: number; alpha: number }> = [];

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;

  private velocity = { x: 0, y: 0 };
  private readonly SPEED = 280;
  private readonly FRICTION = 0.82;
  private readonly GROUND_Y: number;

  private isGrounded = true;
  private facingRight = true;
  private state: "idle" | "run" | "jump" = "idle";
  private animTimer = 0;

  public body: Phaser.GameObjects.Container;
  private onPositionChange?: (x: number, y: number) => void;

  constructor({ scene, x, y, onPositionChange }: PlayerConfig) {
    this.scene = scene;
    this.GROUND_Y = y;
    this.onPositionChange = onPositionChange;

    this.glow = scene.add.graphics();
    this.trail = scene.add.graphics();
    this.graphics = scene.add.graphics();
    this.container = scene.add.container(x, y);
    this.container.setDepth(50);
    this.trail.setDepth(49);
    this.glow.setDepth(48);

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.keyA = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keySpace = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.body = this.container;
  }

  update(delta: number) {
    const dt = delta / 1000;
    const prevX = this.container.x;

    this.handleInput(dt);
    this.applyPhysics(dt);
    this.updateTrail();
    this.draw();
    this.animTimer += delta;

    if (this.container.x !== prevX && this.onPositionChange) {
      this.onPositionChange(this.container.x, this.container.y);
    }
  }

  private handleInput(dt: number) {
    const goLeft = this.cursors.left.isDown || this.keyA.isDown;
    const goRight = this.cursors.right.isDown || this.keyD.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keyW) ||
      Phaser.Input.Keyboard.JustDown(this.keySpace);

    if (goLeft) {
      this.velocity.x -= this.SPEED * dt * 6;
      this.facingRight = false;
      this.state = "run";
    } else if (goRight) {
      this.velocity.x += this.SPEED * dt * 6;
      this.facingRight = true;
      this.state = "run";
    } else {
      this.state = this.isGrounded ? "idle" : "jump";
    }

    if (jumpPressed && this.isGrounded) {
      this.velocity.y = -600;
      this.isGrounded = false;
      this.state = "jump";
    }
  }

  private applyPhysics(dt: number) {
    if (!this.isGrounded) {
      this.velocity.y += 1400 * dt;
    }

    this.velocity.x *= this.FRICTION;
    this.velocity.x = Phaser.Math.Clamp(this.velocity.x, -this.SPEED, this.SPEED);

    this.container.x += this.velocity.x * dt;
    this.container.y += this.velocity.y * dt;

    if (this.container.y >= this.GROUND_Y) {
      this.container.y = this.GROUND_Y;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    this.container.x = Math.max(60, this.container.x);
  }

  private updateTrail() {
    if (Math.abs(this.velocity.x) > 20 || !this.isGrounded) {
      this.trailPoints.push({
        x: this.container.x,
        y: this.container.y,
        alpha: 1,
      });
    }
    this.trailPoints = this.trailPoints
      .map((p) => ({ ...p, alpha: p.alpha - 0.08 }))
      .filter((p) => p.alpha > 0);
  }

  private draw() {
    this.graphics.clear();
    this.glow.clear();
    this.trail.clear();

    const x = this.container.x;
    const y = this.container.y;
    const t = this.animTimer;
    const breathing = Math.sin(t * 0.003) * 1.5;
    const runBob = this.state === "run" ? Math.sin(t * 0.012) * 3 : 0;

    // Trail
    this.trailPoints.forEach((p) => {
      this.trail.fillStyle(0x00d4ff, p.alpha * 0.3);
      this.trail.fillCircle(p.x, p.y - 20, 4 * p.alpha);
    });

    // Glow halo
    const glowAlpha = 0.1 + Math.sin(t * 0.002) * 0.05;
    this.glow.fillStyle(0x00d4ff, glowAlpha);
    this.glow.fillCircle(x, y - 20, 40);
    this.glow.fillStyle(0xb347ff, glowAlpha * 0.5);
    this.glow.fillCircle(x, y - 20, 60);

    const bodyY = y + runBob;
    const legOffset = this.state === "run" ? Math.sin(t * 0.015) * 8 : 0;

    // Legs
    this.graphics.fillStyle(0x0a1628, 1);
    this.graphics.fillRect(x - 8, bodyY - 12, 7, 14);
    this.graphics.fillRect(x + 2, bodyY - 12, 7, 14);
    this.graphics.fillStyle(0x00d4ff, 0.9);
    this.graphics.fillRect(x - 7, bodyY - 1 + legOffset, 5, 5);
    this.graphics.fillRect(x + 3, bodyY - 1 - legOffset, 5, 5);

    // Torso
    this.graphics.fillStyle(0x0a2040, 1);
    this.graphics.fillRect(x - 10, bodyY - 34, 20, 22);
    this.graphics.fillStyle(0x00d4ff, 0.8);
    this.graphics.fillRect(x - 3, bodyY - 30, 6, 14);
    this.graphics.fillStyle(0xb347ff, 0.6);
    this.graphics.fillRect(x - 6, bodyY - 24, 12, 2);

    // Arms
    const armSwing = this.state === "run" ? Math.sin(t * 0.015) * 6 : 0;
    this.graphics.fillStyle(0x0a2040, 1);
    this.graphics.fillRect(x - 16, bodyY - 32 + armSwing, 6, 14);
    this.graphics.fillRect(x + 10, bodyY - 32 - armSwing, 6, 14);
    this.graphics.fillStyle(0x00ffe7, 0.7);
    this.graphics.fillCircle(x - 13, bodyY - 18 + armSwing, 4);
    this.graphics.fillCircle(x + 13, bodyY - 18 - armSwing, 4);

    // Head
    this.graphics.fillStyle(0x0d1f35, 1);
    this.graphics.fillRoundedRect(x - 11, bodyY - 56 + breathing, 22, 22, 3);
    const visorColor = this.state === "jump" ? 0xff2d9b : 0x00d4ff;
    this.graphics.fillStyle(visorColor, 0.9);
    this.graphics.fillRect(x - 9, bodyY - 51 + breathing, 18, 6);
    this.graphics.fillStyle(0xffffff, 0.5);
    this.graphics.fillRect(x - 9, bodyY - 49 + breathing, 18, 1);

    // Antenna
    this.graphics.fillStyle(0x00d4ff, 0.8);
    this.graphics.fillRect(x - 1, bodyY - 62 + breathing, 2, 8);
    this.graphics.fillCircle(x, bodyY - 64 + breathing, 3);

    // Idle pulse ring
    if (this.state === "idle") {
      const pulse = (Math.sin(t * 0.003) + 1) * 0.5;
      this.graphics.lineStyle(1, 0x00d4ff, pulse * 0.3);
      this.graphics.strokeCircle(x, bodyY - 30, 30 + pulse * 10);
    }
  }

  public getPosition() {
    return { x: this.container.x, y: this.container.y };
  }

  public teleportTo(x: number) {
    this.container.x = x;
    this.velocity.x = 0;
  }

  public destroy() {
    this.graphics.destroy();
    this.glow.destroy();
    this.trail.destroy();
    this.container.destroy();
  }
}
