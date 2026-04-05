// FILE: /app/components/GameWorld.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import type GameScene from "../game/scenes/GameScene";
import type { Interactable } from "../game/objects/WorldMap";
import { useGameStore, Zone, ZONE_POSITIONS } from "../game/systems/gameStore";
import ModalSystem from "./ModalSystem";
import UIOverlay from "./UIOverlay";
import ZoneTransition from "./ZoneTransition";
import InteractHint from "./InteractHint";

export default function GameWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<import("phaser").Game | null>(null);
  const sceneRef = useRef<GameScene | null>(null);
  const [gameReady, setGameReady] = useState(false);

  const {
    setCurrentZone,
    setPlayerPosition,
    openModal,
    modalOpen,
    modalContent,
    closeModal,
    setGameReady: storeSetReady,
  } = useGameStore();

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    let game: import("phaser").Game;

    // Dynamic import Phaser (SSR-safe)
    const initPhaser = async () => {
      const Phaser = (await import("phaser")).default;
      const { default: GameSceneClass } = await import("../game/scenes/GameScene");

      const config: import("phaser").Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#020408",
        parent: containerRef.current!,
        physics: {
          default: "arcade",
          arcade: { gravity: { x: 0, y: 0 }, debug: false },
        },
        scene: [GameSceneClass],
        render: {
          antialias: true,
          pixelArt: false,
          roundPixels: false,
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: window.innerWidth,
          height: window.innerHeight,
        },
      };

      game = new Phaser.Game(config);
      gameRef.current = game;

      game.events.once("ready", () => {
        const scene = game.scene.getScene("GameScene") as GameScene;
        sceneRef.current = scene;

        // Bridge callbacks
        scene.onZoneChange = (zone: Zone) => {
          setCurrentZone(zone);
        };

        scene.onInteract = (obj: Interactable) => {
          if (obj.type === "project" && obj.data) {
            openModal(obj.data as Parameters<typeof openModal>[0]);
          } else if (obj.type === "contact") {
            // Scroll to contact UI overlay
            document.getElementById("contact-overlay")?.scrollIntoView({ behavior: "smooth" });
            const el = document.getElementById("contact-overlay");
            if (el) {
              el.style.opacity = "1";
              el.style.pointerEvents = "all";
            }
          }
        };

        scene.onPlayerMove = (x: number, y: number) => {
          setPlayerPosition(x, y);
        };

        setGameReady(true);
        storeSetReady(true);
      });

      // Handle resize
      const handleResize = () => {
        if (game) {
          game.scale.resize(window.innerWidth, window.innerHeight);
        }
      };
      window.addEventListener("resize", handleResize);
    };

    initPhaser();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Expose teleport function to nav
  const teleportToZone = (zone: Zone) => {
    sceneRef.current?.teleportToZone(zone);
  };

  // Register teleport globally for NavigationOverlay
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__kavyaTeleport = teleportToZone;
  }, [gameReady]);

  return (
    <div className="relative w-screen h-screen">
      {/* Phaser container */}
      <div
        id="phaser-container"
        ref={containerRef}
        className="absolute inset-0"
        style={{ cursor: "none" }}
      />

      {/* Loading overlay */}
      {!gameReady && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-dark-900">
          <div className="text-center font-mono">
            <div
              className="text-2xl font-display mb-4"
              style={{ color: "var(--neon-blue)" }}
            >
              BUILDING WORLD...
            </div>
            <div
              className="text-xs tracking-widest opacity-50"
              style={{ color: "var(--neon-cyan)" }}
            >
              INITIALIZING PHASER ENGINE
            </div>
          </div>
        </div>
      )}

      {/* React UI overlays on top of canvas */}
      {gameReady && <UIOverlay onTeleport={teleportToZone} />}
      {gameReady && <ZoneTransition />}
      {gameReady && <InteractHint />}

      {/* Modal system */}
      {modalOpen && modalContent && (
        <ModalSystem project={modalContent} onClose={closeModal} />
      )}
    </div>
  );
}
