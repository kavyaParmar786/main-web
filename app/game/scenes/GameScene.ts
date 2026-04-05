// FILE: /app/game/scenes/GameScene.ts

import Phaser from "phaser";
import PlayerController from "../objects/PlayerController";
import WorldMap, { Interactable } from "../objects/WorldMap";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  ZONE_POSITIONS,
  Zone,
  useGameStore,
} from "../systems/gameStore";

export default class GameScene extends Phaser.Scene {
  private player!: PlayerController;
  private worldMap!: WorldMap;
  private camTarget = { x: 0 };
  private nearbyInteractable: Interactable | null = null;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private uiText!: Phaser.GameObjects.Text;
  private eKeyPrompt!: Phaser.GameObjects.Graphics;
  private zoneCheckTimer = 0;
  private lastZone: Zone = "boot";
  private hintText!: Phaser.GameObjects.Text;
  private miniMapGraphics!: Phaser.GameObjects.Graphics;

  // Callbacks to React
  public onZoneChange?: (zone: Zone) => void;
  public onInteract?: (obj: Interactable) => void;
  public onPlayerMove?: (x: number, y: number) => void;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {}

  create() {
    const { width, height } = this.scale;

    // World bounds
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Build world
    this.worldMap = new WorldMap(this);

    // Spawn player
    const groundY = WORLD_HEIGHT - 80;
    this.player = new PlayerController({
      scene: this,
      x: 200,
      y: groundY,
      onPositionChange: (x, y) => {
        this.onPlayerMove?.(x, y);
      },
    });

    // Camera — manual scroll in update(), no startFollow needed
    this.cameras.main.setZoom(1);

    // Input
    this.interactKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );

    // UI
    this.buildUI();

    // Mini map
    this.buildMiniMap();
  }

  private buildUI() {
    const h = this.scale.height;
    const w = this.scale.width;

    // E-key interaction prompt
    this.eKeyPrompt = this.add.graphics();
    this.eKeyPrompt.setScrollFactor(0);
    this.eKeyPrompt.setDepth(200);
    this.eKeyPrompt.setAlpha(0);

    // Movement hint
    this.hintText = this.add.text(
      w / 2,
      h - 25,
      "← A / → D / ARROW KEYS to move  ·  SPACE to jump  ·  E to interact",
      {
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "11px",
        color: "#00d4ff",
        alpha: 0.35,
      }
    );
    this.hintText.setOrigin(0.5, 1);
    this.hintText.setScrollFactor(0);
    this.hintText.setDepth(200);

    // Fade hint out after 5s
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: this.hintText,
        alpha: 0,
        duration: 1500,
        ease: "Power2",
      });
    });
  }

  private buildMiniMap() {
    this.miniMapGraphics = this.add.graphics();
    this.miniMapGraphics.setScrollFactor(0);
    this.miniMapGraphics.setDepth(300);
  }

  update(time: number, delta: number) {
    // Update world
    const camX = this.cameras.main.scrollX;
    this.worldMap.update(delta, camX);

    // Update player
    this.player.update(delta);

    // Smooth camera follow
    const pos = this.player.getPosition();
    this.cameras.main.scrollX +=
      (pos.x - this.cameras.main.scrollX - this.scale.width * 0.35) * 0.06;
    this.cameras.main.scrollY = 0;

    // Zone detection
    this.zoneCheckTimer += delta;
    if (this.zoneCheckTimer > 200) {
      this.zoneCheckTimer = 0;
      this.detectZone(pos.x);
    }

    // Interactable proximity
    this.checkInteractables(pos.x, pos.y);

    // E key interaction
    if (Phaser.Input.Keyboard.JustDown(this.interactKey) && this.nearbyInteractable) {
      this.onInteract?.(this.nearbyInteractable);
    }

    // Update mini map
    this.updateMiniMap(pos.x);
  }

  private detectZone(playerX: number) {
    let zone: Zone = "boot";

    if (playerX >= ZONE_POSITIONS.contact) zone = "contact";
    else if (playerX >= ZONE_POSITIONS.experience) zone = "experience";
    else if (playerX >= ZONE_POSITIONS.skills) zone = "skills";
    else if (playerX >= ZONE_POSITIONS.projects) zone = "projects";
    else if (playerX >= ZONE_POSITIONS.about) zone = "about";

    if (zone !== this.lastZone) {
      this.lastZone = zone;
      this.onZoneChange?.(zone);

      // Zone flash effect
      this.cameras.main.flash(300, 0, 212, 255, false);
    }
  }

  private checkInteractables(px: number, py: number) {
    const nearby = this.worldMap.getInteractableAt(px, py);

    if (nearby !== this.nearbyInteractable) {
      this.nearbyInteractable = nearby;
      this.updateEPrompt(nearby);
    }
  }

  private updateEPrompt(obj: Interactable | null) {
    this.eKeyPrompt.clear();

    if (!obj) {
      this.tweens.add({
        targets: this.eKeyPrompt,
        alpha: 0,
        duration: 200,
      });
      return;
    }

    // Draw E key badge (in screen space — need to convert world→screen)
    this.tweens.add({
      targets: this.eKeyPrompt,
      alpha: 1,
      duration: 200,
    });

    const screenX =
      obj.x - this.cameras.main.scrollX;
    const screenY = this.scale.height * 0.65;

    this.eKeyPrompt.fillStyle(0x00d4ff, 0.15);
    this.eKeyPrompt.fillRoundedRect(screenX - 70, screenY - 18, 140, 36, 4);
    this.eKeyPrompt.lineStyle(1, 0x00d4ff, 0.6);
    this.eKeyPrompt.strokeRoundedRect(screenX - 70, screenY - 18, 140, 36, 4);
  }

  private updateMiniMap(playerX: number) {
    this.miniMapGraphics.clear();

    const mapW = 200;
    const mapH = 30;
    const mapX = 20;
    const mapY = 20;
    const scale = mapW / WORLD_WIDTH;

    // Background
    this.miniMapGraphics.fillStyle(0x060d17, 0.85);
    this.miniMapGraphics.fillRect(mapX, mapY, mapW, mapH);
    this.miniMapGraphics.lineStyle(1, 0x00d4ff, 0.3);
    this.miniMapGraphics.strokeRect(mapX, mapY, mapW, mapH);

    // Zone markers
    const zones: { pos: number; color: number }[] = [
      { pos: ZONE_POSITIONS.about, color: 0x00d4ff },
      { pos: ZONE_POSITIONS.projects, color: 0xb347ff },
      { pos: ZONE_POSITIONS.skills, color: 0x00ffe7 },
      { pos: ZONE_POSITIONS.experience, color: 0xff2d9b },
      { pos: ZONE_POSITIONS.contact, color: 0x00d4ff },
    ];

    zones.forEach(({ pos, color }) => {
      const mx = mapX + pos * scale;
      this.miniMapGraphics.fillStyle(color, 0.3);
      this.miniMapGraphics.fillRect(mx, mapY + 2, 2, mapH - 4);
    });

    // Player indicator
    const px = mapX + playerX * scale;
    this.miniMapGraphics.fillStyle(0xffffff, 1);
    this.miniMapGraphics.fillTriangle(px - 4, mapY + mapH - 4, px + 4, mapY + mapH - 4, px, mapY + 4);
  }

  public teleportToZone(zone: Zone) {
    const x = ZONE_POSITIONS[zone] + 300;
    this.player.teleportTo(x);
    this.cameras.main.flash(500, 0, 212, 255, false);
  }

  shutdown() {
    this.worldMap.destroy();
    this.player.destroy();
  }
}
