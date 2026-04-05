// FILE: /app/components/NavigationOverlay.tsx

"use client";

import { useState } from "react";
import { Zone, useGameStore } from "../game/systems/gameStore";

interface Props {
  onToggleClassic: () => void;
}

const NAV_ZONES: { zone: Zone; label: string; icon: string }[] = [
  { zone: "about", label: "ABOUT", icon: "◉" },
  { zone: "projects", label: "PROJECTS", icon: "◈" },
  { zone: "skills", label: "SKILLS", icon: "◇" },
  { zone: "experience", label: "XPERIENCE", icon: "◎" },
  { zone: "contact", label: "CONTACT", icon: "◌" },
];

export default function NavigationOverlay({ onToggleClassic }: Props) {
  const { currentZone, soundEnabled, toggleSound } = useGameStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTeleport = (zone: Zone) => {
    const teleport = (window as unknown as Record<string, unknown>).__kavyaTeleport as
      | ((z: Zone) => void)
      | undefined;
    if (teleport) teleport(zone);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Top navigation bar */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(2,4,8,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,212,255,0.08)",
        }}
      >
        {/* Logo */}
        <div
          className="font-display text-sm font-bold tracking-widest"
          style={{
            color: "var(--neon-blue)",
            filter: "drop-shadow(0 0 8px rgba(0,212,255,0.5))",
          }}
        >
          KAVYA.SYS
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ZONES.map(({ zone, label, icon }) => (
            <button
              key={zone}
              onClick={() => handleTeleport(zone)}
              className="relative px-3 py-1.5 font-mono text-xs tracking-wider transition-all"
              style={{
                color:
                  currentZone === zone
                    ? "var(--neon-blue)"
                    : "rgba(0,212,255,0.35)",
                background:
                  currentZone === zone ? "rgba(0,212,255,0.08)" : "transparent",
                border:
                  currentZone === zone
                    ? "1px solid rgba(0,212,255,0.3)"
                    : "1px solid transparent",
                cursor: "none",
              }}
            >
              <span className="mr-1.5 opacity-60">{icon}</span>
              {label}
              {currentZone === zone && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: "var(--neon-blue)" }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="font-mono text-xs opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: "var(--neon-blue)", cursor: "none" }}
            title="Toggle sound"
          >
            {soundEnabled ? "♪" : "♪̶"}
          </button>

          {/* Classic mode */}
          <button
            onClick={onToggleClassic}
            className="font-mono text-xs opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: "var(--neon-blue)", cursor: "none" }}
          >
            CLASSIC
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden font-mono text-xs opacity-60"
            style={{ color: "var(--neon-blue)", cursor: "none" }}
          >
            ≡
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center md:hidden"
          style={{
            background: "rgba(2,4,8,0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 font-mono text-xl opacity-50"
            style={{ color: "var(--neon-blue)", cursor: "none" }}
          >
            ✕
          </button>
          <nav className="flex flex-col items-center gap-4">
            {NAV_ZONES.map(({ zone, label, icon }) => (
              <button
                key={zone}
                onClick={() => handleTeleport(zone)}
                className="font-display text-2xl font-bold tracking-widest transition-all"
                style={{
                  color:
                    currentZone === zone
                      ? "var(--neon-blue)"
                      : "rgba(0,212,255,0.3)",
                  cursor: "none",
                }}
              >
                {icon} {label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
