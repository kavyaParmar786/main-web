// FILE: /app/components/GameWorld.tsx

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type GameScene from "../game/scenes/GameScene";
import type { Interactable } from "../game/objects/WorldMap";
import { useGameStore, Zone } from "../game/systems/gameStore";
import ModalSystem from "./ModalSystem";
import UIOverlay from "./UIOverlay";
import ZoneTransition from "./ZoneTransition";
import InteractHint from "./InteractHint";

export default function GameWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gameRef = useRef<any>(null);
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

    let resizeHandler: (() => void) | null = null;

    const initPhaser = async () => {
      const Phaser = (await import("phaser")).default;
      const { default: GameSceneClass } = await import("../game/scenes/GameScene");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config: any = {
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
        },
      };

      const game = new Phaser.Game(config);
      gameRef.current = game;

      // Wait for scene to be ready via events
      game.events.once("ready", () => {
        // Poll until GameScene is created
        const tryGetScene = () => {
          const scene = game.scene.getScene("GameScene") as GameScene | null;
          if (!scene || !scene.sys.isActive()) {
            setTimeout(tryGetScene, 100);
            return;
          }

          sceneRef.current = scene;

          scene.onZoneChange = (zone: Zone) => {
            setCurrentZone(zone);
          };

          scene.onInteract = (obj: Interactable) => {
            if (obj.type === "project" && obj.data) {
              openModal(obj.data as Parameters<typeof openModal>[0]);
            }
          };

          scene.onPlayerMove = (x: number, y: number) => {
            setPlayerPosition(x, y);
          };

          setGameReady(true);
          storeSetReady(true);
        };

        setTimeout(tryGetScene, 200);
      });

      resizeHandler = () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", resizeHandler);
    };

    initPhaser();

    return () => {
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const teleportToZone = useCallback((zone: Zone) => {
    sceneRef.current?.teleportToZone(zone);
  }, []);

  // Expose teleport globally for NavigationOverlay
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__kavyaTeleport = teleportToZone;
  }, [teleportToZone]);

  return (
    <div className="relative w-screen h-screen">
      <div
        id="phaser-container"
        ref={containerRef}
        className="absolute inset-0"
        style={{ cursor: "none" }}
      />

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

      {gameReady && <UIOverlay onTeleport={teleportToZone} />}
      {gameReady && <ZoneTransition />}
      {gameReady && <InteractHint />}

      {modalOpen && modalContent && (
        <ModalSystem project={modalContent} onClose={closeModal} />
      )}
    </div>
  );
}
