// FILE: /app/types/phaser.d.ts
// Re-export Phaser types for cleaner imports across the project
import type Phaser from "phaser";

export type PhaserGame = Phaser.Game;
export type PhaserGameConfig = Phaser.Types.Core.GameConfig;
export type PhaserScene = Phaser.Scene;
export type PhaserText = Phaser.GameObjects.Text;
export type PhaserGraphics = Phaser.GameObjects.Graphics;
export type PhaserContainer = Phaser.GameObjects.Container;
export type PhaserKey = Phaser.Input.Keyboard.Key;
export type PhaserCursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
export type PhaserCamera = Phaser.Cameras.Scene2D.Camera;
