// FILE: /app/components/UIOverlay.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore, Zone, PORTFOLIO_DATA } from "../game/systems/gameStore";

interface Props {
  onTeleport: (zone: Zone) => void;
}

export default function UIOverlay({ onTeleport }: Props) {
  const { currentZone } = useGameStore();
  const [prevZone, setPrevZone] = useState<Zone>("boot");
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (currentZone !== prevZone) {
      setTransitioning(true);
      setTimeout(() => {
        setPrevZone(currentZone);
        setTransitioning(false);
      }, 400);
    }
  }, [currentZone]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Zone info panel (top-right) */}
      <ZoneInfoPanel zone={currentZone} transitioning={transitioning} />

      {/* About zone overlay content */}
      {currentZone === "about" && <AboutOverlay />}

      {/* Skills zone overlay */}
      {currentZone === "skills" && <SkillsOverlay />}

      {/* Experience zone overlay */}
      {currentZone === "experience" && <ExperienceOverlay />}

      {/* Contact zone overlay */}
      {currentZone === "contact" && <ContactOverlay />}

      {/* Player status (bottom-left) */}
      <PlayerStatus zone={currentZone} />
    </div>
  );
}

// ─── Zone Info Badge ─────────────────────────────────────────────────────────
function ZoneInfoPanel({ zone, transitioning }: { zone: Zone; transitioning: boolean }) {
  const labels: Record<Zone, string> = {
    boot: "BOOT SEQUENCE",
    about: "PROFILE // ABOUT",
    projects: "PROJECT TERMINALS",
    skills: "SKILL MATRIX",
    experience: "TIMELINE",
    contact: "COMM CHANNEL",
  };

  return (
    <div
      className="absolute top-16 right-6 glass-panel px-4 py-2"
      style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "translateY(-8px)" : "translateY(0)",
        transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        pointerEvents: "none",
      }}
    >
      <div
        className="font-mono text-xs tracking-[0.2em] opacity-40 mb-0.5"
        style={{ color: "var(--neon-blue)" }}
      >
        CURRENT ZONE
      </div>
      <div
        className="font-display text-sm font-bold tracking-wider"
        style={{ color: "var(--neon-blue)" }}
      >
        {labels[zone]}
      </div>
    </div>
  );
}

// ─── About Overlay ────────────────────────────────────────────────────────────
function AboutOverlay() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <div
      className="absolute left-8 top-1/2 -translate-y-1/2 glass-panel p-6 pointer-events-auto"
      style={{
        width: 320,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0, -50%)" : "translate(-20px, -50%)",
        transition: "all 0.6s cubic-bezier(0.23,1,0.32,1)",
        border: "1px solid rgba(0,212,255,0.2)",
      }}
    >
      {/* Header */}
      <div
        className="font-mono text-xs tracking-[0.3em] mb-3 opacity-50"
        style={{ color: "var(--neon-blue)" }}
      >
        // PROFILE.JSON
      </div>

      {/* Avatar placeholder */}
      <div
        className="w-14 h-14 rounded-sm mb-4 flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(179,71,255,0.15))",
          border: "1px solid rgba(0,212,255,0.3)",
        }}
      >
        <div
          className="font-display text-2xl font-black"
          style={{ color: "var(--neon-blue)" }}
        >
          KP
        </div>
      </div>

      <div
        className="font-display text-xl font-bold mb-1"
        style={{ color: "var(--neon-blue)" }}
      >
        {PORTFOLIO_DATA.name}
      </div>
      <div
        className="font-mono text-xs mb-4 opacity-60"
        style={{ color: "var(--neon-cyan)" }}
      >
        {PORTFOLIO_DATA.title}
      </div>
      <p
        className="font-body text-xs leading-5 opacity-70 mb-4"
        style={{ color: "#a0c4d8" }}
      >
        {PORTFOLIO_DATA.bio}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "PROJECTS", val: "6+" },
          { label: "COMMITS", val: "400+" },
          { label: "YEARS", val: "3" },
        ].map(({ label, val }) => (
          <div
            key={label}
            className="text-center py-2 rounded"
            style={{
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.12)",
            }}
          >
            <div
              className="font-display text-base font-bold"
              style={{ color: "var(--neon-blue)" }}
            >
              {val}
            </div>
            <div className="font-mono text-[9px] opacity-40" style={{ color: "#aaa" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Location */}
      <div
        className="font-mono text-xs opacity-40 flex items-center gap-2"
        style={{ color: "var(--neon-cyan)" }}
      >
        <span>◉</span>
        <span>{PORTFOLIO_DATA.location}</span>
      </div>
    </div>
  );
}

// ─── Skills Overlay ────────────────────────────────────────────────────────────
function SkillsOverlay() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  const categories = ["frontend", "backend", "languages", "tools"] as const;

  return (
    <div
      className="absolute right-6 top-1/2 -translate-y-1/2 glass-panel p-5 pointer-events-auto"
      style={{
        width: 300,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0, -50%)" : "translate(20px, -50%)",
        transition: "all 0.6s cubic-bezier(0.23,1,0.32,1)",
        border: "1px solid rgba(0,212,255,0.2)",
        maxHeight: "70vh",
        overflowY: "auto",
      }}
    >
      <div
        className="font-mono text-xs tracking-[0.3em] mb-4 opacity-50"
        style={{ color: "var(--neon-blue)" }}
      >
        // SKILL_MATRIX.DAT
      </div>

      {categories.map((cat) => {
        const catSkills = PORTFOLIO_DATA.skills.filter((s) => s.category === cat);
        if (!catSkills.length) return null;

        return (
          <div key={cat} className="mb-4">
            <div
              className="font-mono text-[10px] tracking-widest mb-2 opacity-40"
              style={{ color: "var(--neon-cyan)" }}
            >
              {cat.toUpperCase()}
            </div>
            {catSkills.map((skill, i) => (
              <div key={skill.name} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span
                    className="font-mono text-xs opacity-80"
                    style={{ color: "#a0c4d8" }}
                  >
                    {skill.name}
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: skill.color }}
                  >
                    {skill.level}%
                  </span>
                </div>
                <div
                  className="w-full h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${skill.level}%`,
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                      boxShadow: `0 0 6px ${skill.color}`,
                      animation: `fillBar 1.5s ${i * 0.1}s cubic-bezier(0.23,1,0.32,1) both`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── Experience Overlay ────────────────────────────────────────────────────────
function ExperienceOverlay() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <div
      className="absolute left-8 top-1/2 -translate-y-1/2 glass-panel p-5 pointer-events-auto"
      style={{
        width: 340,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,-50%)" : "translate(-20px,-50%)",
        transition: "all 0.6s cubic-bezier(0.23,1,0.32,1)",
        border: "1px solid rgba(179,71,255,0.2)",
      }}
    >
      <div
        className="font-mono text-xs tracking-[0.3em] mb-4 opacity-50"
        style={{ color: "var(--neon-purple)" }}
      >
        // TIMELINE.LOG
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-2 top-0 bottom-0 w-px"
          style={{ background: "rgba(179,71,255,0.3)" }}
        />

        {PORTFOLIO_DATA.experience.map((exp, i) => (
          <div
            key={i}
            className="relative pl-8 mb-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-10px)",
              transition: `all 0.5s ${0.2 + i * 0.1}s cubic-bezier(0.23,1,0.32,1)`,
            }}
          >
            {/* Node */}
            <div
              className="absolute left-0 top-1 w-4 h-4 rounded-sm flex items-center justify-center"
              style={{
                background: "rgba(179,71,255,0.2)",
                border: "1px solid rgba(179,71,255,0.5)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--neon-purple)" }}
              />
            </div>

            <div
              className="font-mono text-[10px] mb-0.5 opacity-50"
              style={{ color: "var(--neon-purple)" }}
            >
              {exp.year}
            </div>
            <div
              className="font-display text-sm font-bold mb-0.5"
              style={{ color: "var(--neon-blue)" }}
            >
              {exp.title}
            </div>
            <div
              className="font-mono text-xs opacity-60 mb-1"
              style={{ color: "var(--neon-cyan)" }}
            >
              {exp.org}
            </div>
            <div
              className="font-body text-xs opacity-50 leading-4"
              style={{ color: "#8fb3c4" }}
            >
              {exp.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Contact Overlay ────────────────────────────────────────────────────────────
function ContactOverlay() {
  const [visible, setVisible] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div
      id="contact-overlay"
      className="absolute right-6 top-1/2 -translate-y-1/2 glass-panel p-6 pointer-events-auto"
      style={{
        width: 360,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,-50%)" : "translate(20px,-50%)",
        transition: "all 0.6s cubic-bezier(0.23,1,0.32,1)",
        border: "1px solid rgba(0,255,231,0.2)",
      }}
    >
      <div
        className="font-mono text-xs tracking-[0.3em] mb-4 opacity-50"
        style={{ color: "var(--neon-cyan)" }}
      >
        // CONTACT_TERMINAL.SH
      </div>

      {sent ? (
        <div className="text-center py-6">
          <div
            className="text-4xl mb-3"
            style={{ color: "var(--neon-cyan)" }}
          >
            ✓
          </div>
          <div
            className="font-display text-sm font-bold mb-2"
            style={{ color: "var(--neon-cyan)" }}
          >
            MESSAGE TRANSMITTED
          </div>
          <div
            className="font-mono text-xs opacity-50"
            style={{ color: "#aaa" }}
          >
            I will respond within 24 hours.
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {["name", "email", "message"].map((field) => (
              <div key={field}>
                <div
                  className="font-mono text-[10px] tracking-widest mb-1 opacity-40"
                  style={{ color: "var(--neon-cyan)" }}
                >
                  {">"} {field.toUpperCase()}
                </div>
                {field === "message" ? (
                  <textarea
                    rows={3}
                    value={formState[field as keyof typeof formState]}
                    onChange={(e) =>
                      setFormState({ ...formState, [field]: e.target.value })
                    }
                    placeholder={`Enter ${field}...`}
                    className="w-full px-3 py-2 font-mono text-xs resize-none outline-none"
                    style={{
                      background: "rgba(0,255,231,0.04)",
                      border: "1px solid rgba(0,255,231,0.2)",
                      color: "var(--neon-cyan)",
                      caretColor: "var(--neon-cyan)",
                    }}
                  />
                ) : (
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={formState[field as keyof typeof formState]}
                    onChange={(e) =>
                      setFormState({ ...formState, [field]: e.target.value })
                    }
                    placeholder={`Enter ${field}...`}
                    className="w-full px-3 py-2 font-mono text-xs outline-none"
                    style={{
                      background: "rgba(0,255,231,0.04)",
                      border: "1px solid rgba(0,255,231,0.2)",
                      color: "var(--neon-cyan)",
                      caretColor: "var(--neon-cyan)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSend}
            disabled={sending}
            className="btn-neon w-full text-center py-3"
            style={{
              borderColor: "var(--neon-cyan)",
              color: "var(--neon-cyan)",
              cursor: "none",
            }}
          >
            {sending ? "TRANSMITTING..." : "▶ SEND MESSAGE"}
          </button>

          {/* Social links */}
          <div className="flex gap-4 mt-4 justify-center">
            {[
              { label: "GitHub", value: PORTFOLIO_DATA.github },
              { label: "LinkedIn", value: PORTFOLIO_DATA.linkedin },
            ].map(({ label, value }) => (
              <a
                key={label}
                href={`https://${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs opacity-40 hover:opacity-80 transition-opacity"
                style={{ color: "var(--neon-cyan)", cursor: "none" }}
              >
                {label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Player Status ─────────────────────────────────────────────────────────────
function PlayerStatus({ zone }: { zone: Zone }) {
  return (
    <div
      className="absolute bottom-8 left-6 font-mono text-xs"
      style={{ color: "rgba(0,212,255,0.4)" }}
    >
      <div className="tracking-widest">PLAYER // KAVYA_EXPLORER</div>
      <div className="opacity-60">
        ZONE:{" "}
        <span style={{ color: "var(--neon-blue)" }}>
          {zone.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
