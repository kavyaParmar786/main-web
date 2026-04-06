// FILE: /app/components/ModalSystem.tsx

"use client";

import { useEffect, useState } from "react";
import { ProjectData } from "../game/systems/gameStore";

interface Props {
  project: ProjectData;
  onClose: () => void;
}

export default function ModalSystem({ project, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [glitchLine, setGlitchLine] = useState(0);

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setVisible(true), 20);

    // Glitch scan effect
    const interval = setInterval(() => {
      setGlitchLine((l) => (l + 1) % 100);
    }, 80);

    // Escape key
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  const color = project.color || "#00d4ff";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop"
      onClick={handleClose}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      <div
        className="relative max-w-xl w-full mx-6 glass-panel p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          border: `1px solid ${color}40`,
          boxShadow: `0 0 60px ${color}20, 0 0 120px ${color}10`,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
          transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        {/* Glitch scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
        >
          <div
            className="absolute left-0 right-0 h-px opacity-20"
            style={{
              top: `${glitchLine}%`,
              background: color,
            }}
          />
        </div>

        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            background: `${color}0d`,
            borderBottom: `1px solid ${color}20`,
          }}
        >
          <div>
            <div
              className="font-mono text-[10px] tracking-[0.3em] mb-1 opacity-50"
              style={{ color }}
            >
              PROJECT // {project.id.toUpperCase()}
            </div>
            <div
              className="font-display text-xl font-bold"
              style={{ color }}
            >
              {project.title}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="font-mono text-sm w-8 h-8 flex items-center justify-center transition-all hover:rotate-90"
            style={{
              color,
              border: `1px solid ${color}30`,
              cursor: "none",
              transition: "transform 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = `${color}20`;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Subtitle */}
          <div
            className="font-mono text-xs tracking-wider mb-3 opacity-60"
            style={{ color }}
          >
            {project.subtitle}
          </div>

          {/* Description */}
          <p
            className="font-body text-sm leading-6 mb-5 opacity-70"
            style={{ color: "#a0c4d8" }}
          >
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="mb-6">
            <div
              className="font-mono text-[10px] tracking-widest mb-2 opacity-40"
              style={{ color }}
            >
              TECH_STACK
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2.5 py-1 rounded"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    color,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon flex-1 text-center"
                style={{
                  borderColor: color,
                  color,
                  cursor: "none",
                }}
              >
                ▶ LIVE DEMO
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon flex-1 text-center"
                style={{
                  borderColor: `${color}80`,
                  color: `${color}cc`,
                  cursor: "none",
                }}
              >
                ⌥ GITHUB
              </a>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="px-6 py-2 flex justify-between"
          style={{ borderTop: `1px solid ${color}10` }}
        >
          <span
            className="font-mono text-[9px] opacity-30"
            style={{ color }}
          >
            PRESS ESC TO CLOSE
          </span>
          <span
            className="font-mono text-[9px] opacity-30"
            style={{ color }}
          >
            {project.id.toUpperCase()} // v1.0
          </span>
        </div>
      </div>
    </div>
  );
}
