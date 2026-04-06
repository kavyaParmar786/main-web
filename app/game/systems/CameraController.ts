// FILE: /app/game/systems/CameraController.ts

import Phaser from "phaser";
import { Zone } from "./gameStore";

interface ShakeParams {
  intensity: number;
  duration: number;
}

export default class CameraController {
  private camera: Phaser.Cameras.Scene2D.Camera;
  private targetX = 0;
  private targetZoom = 1;
  private shakeTimer = 0;
  private shakeIntensity = 0;
  private shakeDuration = 0;
  private lerpSpeed = 0.07;
  private zoomLerpSpeed = 0.04;

  // Zone-specific camera zoom levels
  private readonly ZONE_ZOOMS: Partial<Record<Zone, number>> = {
    boot: 1.0,
    about: 1.0,
    projects: 0.95,
    skills: 1.0,
    experience: 1.0,
    contact: 1.05,
  };

  constructor(camera: Phaser.Cameras.Scene2D.Camera) {
    this.camera = camera;
  }

  // ── Set follow target ─────────────────────────────────────
  setTarget(x: number) {
    const screenW = this.camera.width;
    // Keep player at ~35% from left
    this.targetX = x - screenW * 0.35;
    this.targetX = Math.max(0, this.targetX);
  }

  // ── Update camera each frame ──────────────────────────────
  update(delta: number) {
    const dt = delta / 1000;

    // Smooth scroll
    this.camera.scrollX += (this.targetX - this.camera.scrollX) * this.lerpSpeed;

    // Smooth zoom
    this.camera.setZoom(
      this.camera.zoom + (this.targetZoom - this.camera.zoom) * this.zoomLerpSpeed
    );

    // Shake
    if (this.shakeTimer > 0) {
      this.shakeTimer -= delta;
      const progress = this.shakeTimer / this.shakeDuration;
      const shakeX = (Math.random() - 0.5) * this.shakeIntensity * progress;
      const shakeY = (Math.random() - 0.5) * this.shakeIntensity * progress;
      this.camera.setScroll(
        this.camera.scrollX + shakeX,
        this.camera.scrollY + shakeY
      );
    }
  }

  // ── Trigger camera shake ───────────────────────────────────
  shake({ intensity = 4, duration = 200 }: Partial<ShakeParams> = {}) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  // ── Set zone-based zoom ────────────────────────────────────
  setZone(zone: Zone) {
    this.targetZoom = this.ZONE_ZOOMS[zone] ?? 1.0;
  }

  // ── Flash effect ───────────────────────────────────────────
  flash(r = 0, g = 212, b = 255, duration = 300) {
    this.camera.flash(duration, r, g, b, false);
  }

  // ── Fade in/out ────────────────────────────────────────────
  fadeIn(duration = 500) {
    this.camera.fadeIn(duration, 0, 0, 0);
  }

  fadeOut(duration = 500, callback?: () => void) {
    this.camera.fadeOut(duration, 0, 0, 0);
    if (callback) {
      this.camera.once("camerafadeoutcomplete", callback);
    }
  }

  // ── Pan to world X position (for zone teleport) ────────────
  panTo(worldX: number, duration = 600) {
    this.camera.pan(
      worldX,
      this.camera.scrollY + this.camera.height / 2,
      duration,
      "Power2",
      false
    );
  }

  get scrollX() {
    return this.camera.scrollX;
  }
}
