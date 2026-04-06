// FILE: /app/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import BootScreen from "./components/BootScreen";
import GameWorld from "./components/GameWorld";
import ClassicMode from "./components/ClassicMode";
import CustomCursor from "./components/CustomCursor";
import NavigationOverlay from "./components/NavigationOverlay";
import { useGameStore } from "./game/systems/gameStore";

type AppPhase = "boot" | "enter" | "game" | "classic";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("boot");
  const [classicMode, setClassicMode] = useState(false);
  const { currentZone } = useGameStore();

  // Easter egg: Konami-like code → KAVYA
  useEffect(() => {
    let typed = "";
    const secret = "kavya";

    const handleKey = (e: KeyboardEvent) => {
      typed += e.key.toLowerCase();
      if (typed.length > secret.length) typed = typed.slice(-secret.length);
      if (typed === secret) {
        document.body.classList.toggle("easter-egg-mode");
        const el = document.getElementById("easter-egg-flash");
        if (el) {
          el.style.display = "flex";
          setTimeout(() => (el.style.display = "none"), 3000);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleBootComplete = useCallback(() => {
    setPhase("enter");
  }, []);

  const handleEnterWorld = useCallback(() => {
    setPhase("game");
  }, []);

  const toggleClassicMode = useCallback(() => {
    setClassicMode((prev) => !prev);
    setPhase((prev) => prev === "classic" ? "game" : "classic");
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-dark-900">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Easter egg flash */}
      <div
        id="easter-egg-flash"
        className="fixed inset-0 z-[99999] hidden items-center justify-center"
        style={{ background: "rgba(179, 71, 255, 0.15)", backdropFilter: "blur(8px)" }}
      >
        <div className="text-center">
          <div
            className="text-6xl font-display font-black mb-4 glitch-text"
            style={{ color: "var(--neon-purple)", textShadow: "0 0 40px var(--neon-purple)" }}
          >
            ∞ KAVYA MODE ∞
          </div>
          <div className="font-mono text-sm tracking-widest" style={{ color: "var(--neon-cyan)" }}>
            SECRET UNLOCKED // HIDDEN PROTOCOL ACTIVATED
          </div>
        </div>
      </div>

      {/* Boot Phase */}
      {phase === "boot" && <BootScreen onComplete={handleBootComplete} />}

      {/* Enter Phase */}
      {phase === "enter" && (
        <EnterScreen onEnter={handleEnterWorld} onClassic={toggleClassicMode} />
      )}

      {/* Game Phase */}
      {phase === "game" && (
        <>
          <GameWorld />
          <NavigationOverlay onToggleClassic={toggleClassicMode} />
        </>
      )}

      {/* Classic Mode */}
      {phase === "classic" && (
        <ClassicMode onExit={() => setPhase("game")} />
      )}
    </main>
  );
}

// ─── Enter Screen ───────────────────────────────────────────────
function EnterScreen({
  onEnter,
  onClassic,
}: {
  onEnter: () => void;
  onClassic: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handler = (e: KeyboardEvent) => {
      if (e.key) onEnter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center grid-bg"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease",
        background: "radial-gradient(ellipse at center, #0a1628 0%, #020408 70%)",
      }}
    >
      {/* Ambient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--neon-blue)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--neon-purple)" }}
      />

      {/* Logo */}
      <div className="text-center mb-16 relative z-10">
        <div
          className="text-xs font-mono tracking-[0.5em] mb-6 opacity-60"
          style={{ color: "var(--neon-blue)" }}
        >
          SYSTEM READY // ACCESS GRANTED
        </div>
        <div
          className="text-7xl font-display font-black mb-4 glitch-text"
          style={{
            color: "transparent",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            backgroundImage: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
            textShadow: "none",
            filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.5))",
          }}
        >
          KAVYA.SYS
        </div>
        <div
          className="text-sm font-mono tracking-[0.3em] opacity-70"
          style={{ color: "var(--neon-cyan)" }}
        >
          INTERACTIVE PORTFOLIO INTERFACE v2.0
        </div>
      </div>

      {/* Press any key prompt */}
      <div
        className="relative z-10 text-center"
        style={{ animation: "blink 1.5s ease-in-out infinite" }}
      >
        <button
          onClick={onEnter}
          className="btn-neon text-base tracking-[0.4em] px-16 py-5"
          style={{ fontSize: "13px" }}
        >
          ▶ PRESS ANY KEY TO ENTER
        </button>
      </div>

      {/* Classic mode toggle */}
      <div className="absolute bottom-8 right-8 z-10">
        <button
          onClick={onClassic}
          className="font-mono text-xs tracking-widest opacity-40 hover:opacity-80 transition-opacity"
          style={{ color: "var(--neon-blue)", cursor: "none" }}
        >
          ◌ CLASSIC MODE
        </button>
      </div>

      {/* Bottom hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest opacity-30"
        style={{ color: "var(--neon-cyan)" }}
      >
        USE ARROW KEYS OR WASD TO EXPLORE · CLICK OBJECTS TO INTERACT
      </div>
    </div>
  );
}
