// FILE: /app/components/ZoneTransition.tsx

"use client";

import { useEffect, useRef } from "react";
import { useGameStore, Zone } from "../game/systems/gameStore";

const ZONE_COLORS: Record<Zone, string> = {
  boot: "#00d4ff",
  about: "#00d4ff",
  projects: "#b347ff",
  skills: "#00ffe7",
  experience: "#ff2d9b",
  contact: "#00ffe7",
};

const ZONE_NAMES: Record<Zone, string> = {
  boot: "BOOT SEQUENCE",
  about: "ABOUT // PROFILE",
  projects: "PROJECTS // TERMINALS",
  skills: "SKILLS // MATRIX",
  experience: "EXPERIENCE // TIMELINE",
  contact: "CONTACT // COMM",
};

export default function ZoneTransition() {
  const { currentZone } = useGameStore();
  const prevZoneRef = useRef<Zone>(currentZone);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentZone === prevZoneRef.current) return;
    prevZoneRef.current = currentZone;

    const overlay = overlayRef.current;
    const text = textRef.current;
    if (!overlay || !text) return;

    const color = ZONE_COLORS[currentZone];
    const name = ZONE_NAMES[currentZone];

    // Update text
    text.textContent = name;
    text.style.color = color;
    overlay.style.borderColor = `${color}30`;

    // Animate: flash in → hold → fade out
    overlay.style.transition = "none";
    overlay.style.opacity = "1";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.transition = "opacity 0.6s ease 0.8s";
        overlay.style.opacity = "0";
      });
    });
  }, [currentZone]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center opacity-0"
      style={{
        background: "rgba(2,4,8,0.4)",
        border: "1px solid transparent",
      }}
    >
      <div className="text-center">
        {/* Zone label */}
        <div
          className="font-mono text-xs tracking-[0.5em] mb-2 opacity-50"
          style={{ color: "var(--neon-blue)" }}
        >
          ENTERING ZONE
        </div>

        <div
          ref={textRef}
          className="font-display text-2xl md:text-4xl font-bold tracking-widest"
          style={{ color: "var(--neon-blue)" }}
        />

        {/* Decorative lines */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div
            className="h-px w-16 opacity-30"
            style={{ background: "var(--neon-blue)" }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full opacity-60"
            style={{ background: "var(--neon-blue)" }}
          />
          <div
            className="h-px w-16 opacity-30"
            style={{ background: "var(--neon-blue)" }}
          />
        </div>
      </div>
    </div>
  );
}
