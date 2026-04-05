// FILE: /app/components/BootScreen.tsx

"use client";

import { useEffect, useState, useRef } from "react";

interface BootLine {
  text: string;
  color: string;
  delay: number;
  type: "system" | "success" | "warning" | "header";
}

const BOOT_SEQUENCE: BootLine[] = [
  { text: "KAVYA.SYS — PORTFOLIO INTERFACE v2.0", color: "#00d4ff", delay: 0, type: "header" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "#0a2040", delay: 100, type: "system" },
  { text: "[ INIT ] Booting neural kernel...", color: "#00d4ff", delay: 400, type: "system" },
  { text: "[ OK   ] Memory allocation: 512 TB", color: "#00ffe7", delay: 700, type: "success" },
  { text: "[ OK   ] Quantum renderer: ACTIVE", color: "#00ffe7", delay: 1000, type: "success" },
  { text: "[ SCAN ] Detecting hardware profile...", color: "#00d4ff", delay: 1300, type: "system" },
  { text: "[ OK   ] GPU: RTX ∞ (Imagination Class)", color: "#00ffe7", delay: 1600, type: "success" },
  { text: "[ WARN ] Human creativity: DANGEROUSLY HIGH", color: "#b347ff", delay: 1900, type: "warning" },
  { text: "[ LOAD ] Importing skill modules...", color: "#00d4ff", delay: 2200, type: "system" },
  { text: "        ↳ react.core         [████████] 100%", color: "#00ffe7", delay: 2500, type: "success" },
  { text: "        ↳ typescript.engine  [████████] 100%", color: "#00ffe7", delay: 2700, type: "success" },
  { text: "        ↳ python.runtime     [████████] 100%", color: "#00ffe7", delay: 2900, type: "success" },
  { text: "        ↳ creativity.dll     [████████] 100%", color: "#b347ff", delay: 3100, type: "success" },
  { text: "[ LOAD ] Compiling portfolio world...", color: "#00d4ff", delay: 3400, type: "system" },
  { text: "[ OK   ] Zone 01: ABOUT compiled", color: "#00ffe7", delay: 3700, type: "success" },
  { text: "[ OK   ] Zone 02: PROJECTS compiled", color: "#00ffe7", delay: 3900, type: "success" },
  { text: "[ OK   ] Zone 03: SKILLS compiled", color: "#00ffe7", delay: 4100, type: "success" },
  { text: "[ OK   ] Zone 04: EXPERIENCE compiled", color: "#00ffe7", delay: 4300, type: "success" },
  { text: "[ OK   ] Zone 05: CONTACT compiled", color: "#00ffe7", delay: 4500, type: "success" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "#0a2040", delay: 4800, type: "system" },
  { text: "[ SYS ] KAVYA PARMAR // DEVELOPER PROFILE LOADED", color: "#ff2d9b", delay: 5100, type: "header" },
  { text: "[ SYS ] System ready. Launching interface...", color: "#00d4ff", delay: 5500, type: "system" },
];

interface Props {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    // Show lines one by one
    BOOT_SEQUENCE.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, line.delay);
    });

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 1.8, 100));
    }, 100);

    // Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 2500);

    // Complete
    const completeTimer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 6400);

    // Skip on click
    const handleSkip = () => {
      if (!completedRef.current) {
        completedRef.current = true;
        clearTimeout(completeTimer);
        onComplete();
      }
    };
    window.addEventListener("click", handleSkip);

    return () => {
      clearInterval(progressInterval);
      clearInterval(glitchInterval);
      clearTimeout(completeTimer);
      window.removeEventListener("click", handleSkip);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background: "#020408",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Main terminal container */}
      <div
        className="relative w-full max-w-3xl px-8"
        style={{ maxHeight: "80vh" }}
      >
        {/* Terminal header */}
        <div
          className="flex items-center gap-3 mb-4 pb-3"
          style={{ borderBottom: "1px solid rgba(0,212,255,0.15)" }}
        >
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff2d9b" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#b347ff" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#00d4ff" }} />
          </div>
          <span
            className="text-xs tracking-widest opacity-50"
            style={{ color: "#00d4ff" }}
          >
            KAVYA.SYS — TERMINAL v2.0
          </span>
        </div>

        {/* Boot lines */}
        <div
          ref={containerRef}
          className="overflow-hidden"
          style={{ maxHeight: "60vh", overflowY: "hidden" }}
        >
          {BOOT_SEQUENCE.map((line, i) => (
            <div
              key={i}
              className="text-xs leading-6 transition-all duration-200"
              style={{
                color: line.color,
                opacity: visibleLines.includes(i) ? 1 : 0,
                transform: visibleLines.includes(i)
                  ? "translateX(0)"
                  : "translateX(-10px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                fontWeight: line.type === "header" ? "bold" : "normal",
                fontSize: line.type === "header" ? "13px" : "11px",
                letterSpacing: line.type === "header" ? "0.1em" : "0",
                filter:
                  glitchActive && line.type === "header"
                    ? "blur(1px) brightness(1.5)"
                    : "none",
              }}
            >
              {line.text}
            </div>
          ))}

          {/* Blinking cursor at end */}
          {visibleLines.length >= BOOT_SEQUENCE.length && (
            <span
              className="text-xs"
              style={{
                color: "#00d4ff",
                animation: "blink 0.8s infinite",
              }}
            >
              ▋
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2 opacity-50" style={{ color: "#00d4ff" }}>
            <span>LOADING PORTFOLIO INTERFACE</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(0,212,255,0.1)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #00d4ff, #b347ff)",
                boxShadow: "0 0 10px rgba(0,212,255,0.8)",
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </div>

        {/* Skip hint */}
        <div
          className="mt-4 text-center text-xs opacity-25"
          style={{ color: "#00d4ff" }}
        >
          CLICK ANYWHERE TO SKIP
        </div>
      </div>

      {/* Bottom decorative bars */}
      <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-2">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-full"
            style={{
              height: `${4 + Math.sin(i * 0.5) * 8}px`,
              background: `rgba(0, 212, 255, ${0.1 + Math.sin(i * 0.3 + Date.now() * 0.001) * 0.1})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
