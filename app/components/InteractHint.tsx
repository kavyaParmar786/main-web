// FILE: /app/components/InteractHint.tsx

"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "../game/systems/gameStore";

/**
 * InteractHint — floating "Press E" prompt that appears in React
 * when the player is near an interactable object.
 * Positioned based on world → screen coordinates.
 */
export default function InteractHint() {
  const { activeInteractable } = useGameStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (activeInteractable) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [activeInteractable]);

  if (!activeInteractable) return null;

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 8}px)`,
        transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 glass-panel"
        style={{
          border: "1px solid rgba(0,212,255,0.3)",
          boxShadow: "0 0 20px rgba(0,212,255,0.15)",
        }}
      >
        {/* E key badge */}
        <div
          className="w-7 h-7 flex items-center justify-center font-mono text-xs font-bold"
          style={{
            background: "rgba(0,212,255,0.15)",
            border: "1px solid rgba(0,212,255,0.4)",
            color: "var(--neon-blue)",
          }}
        >
          E
        </div>
        <span
          className="font-mono text-xs tracking-widest"
          style={{ color: "var(--neon-blue)" }}
        >
          INTERACT
        </span>

        {/* Pulse dot */}
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: "var(--neon-cyan)",
            animation: "pulseNeon 1.5s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
