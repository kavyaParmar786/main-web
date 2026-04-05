// FILE: /app/components/ClassicMode.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { PORTFOLIO_DATA } from "../game/systems/gameStore";

interface Props {
  onExit: () => void;
}

export default function ClassicMode({ onExit }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("about");
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = ["about", "projects", "skills", "experience", "contact"];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      setScrollY(el.scrollTop);
      const sectionEls = sections.map((s) => document.getElementById(`classic-${s}`));
      sectionEls.forEach((sec, i) => {
        if (sec && el.scrollTop >= sec.offsetTop - 200) {
          setActiveSection(sections[i]);
        }
      });
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`classic-${id}`);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#020408" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-8 py-4 shrink-0"
        style={{
          background: "rgba(2,4,8,0.95)",
          borderBottom: "1px solid rgba(0,212,255,0.1)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          className="font-display text-sm font-bold tracking-widest"
          style={{ color: "var(--neon-blue)" }}
        >
          KAVYA.SYS <span className="opacity-40 font-mono text-xs">// CLASSIC MODE</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollToSection(s)}
              className="font-mono text-xs tracking-widest uppercase transition-all"
              style={{
                color: activeSection === s ? "var(--neon-blue)" : "rgba(0,212,255,0.35)",
                cursor: "none",
              }}
            >
              {s}
            </button>
          ))}
        </nav>

        <button
          onClick={onExit}
          className="btn-neon text-xs px-4 py-2"
          style={{ cursor: "none" }}
        >
          ▶ GAME MODE
        </button>
      </div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* ── HERO ── */}
        <section
          className="relative min-h-screen flex items-center justify-center"
          style={{
            background: "radial-gradient(ellipse at 60% 50%, #0a1628 0%, #020408 70%)",
          }}
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 grid-bg opacity-40" />

          {/* Ambient glow */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-10"
            style={{ background: "var(--neon-blue)" }}
          />

          <div className="relative z-10 text-center px-6">
            <div
              className="font-mono text-xs tracking-[0.5em] mb-6 opacity-50"
              style={{ color: "var(--neon-blue)" }}
            >
              PORTFOLIO // DEVELOPER PROFILE
            </div>
            <h1
              className="font-display text-6xl md:text-8xl font-black mb-4"
              style={{
                color: "transparent",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                backgroundImage: "linear-gradient(135deg, var(--neon-blue) 0%, var(--neon-purple) 100%)",
                filter: "drop-shadow(0 0 40px rgba(0,212,255,0.3))",
                lineHeight: 1.1,
              }}
            >
              KAVYA
              <br />
              PARMAR
            </h1>
            <div
              className="font-body text-lg md:text-xl font-light mb-8 opacity-60"
              style={{ color: "#a0c4d8" }}
            >
              {PORTFOLIO_DATA.title}
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={() => scrollToSection("projects")}
                className="btn-neon px-8 py-3"
                style={{ cursor: "none" }}
              >
                VIEW PROJECTS
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="font-mono text-xs tracking-widest opacity-50 hover:opacity-80 transition-opacity"
                style={{ color: "var(--neon-blue)", cursor: "none" }}
              >
                GET IN TOUCH →
              </button>
            </div>

            <div
              className="mt-16 font-mono text-xs opacity-25"
              style={{ color: "var(--neon-blue)", animation: "float 3s ease-in-out infinite" }}
            >
              ↓ SCROLL TO EXPLORE
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section
          id="classic-about"
          className="py-28 px-6 md:px-16 lg:px-32"
          style={{ borderTop: "1px solid rgba(0,212,255,0.06)" }}
        >
          <SectionLabel label="01 // ABOUT" color="var(--neon-blue)" />
          <div className="grid md:grid-cols-2 gap-16 mt-10 items-center">
            <div>
              <h2
                className="font-display text-4xl font-bold mb-6"
                style={{ color: "var(--neon-blue)" }}
              >
                Hello, World.
              </h2>
              <p
                className="font-body text-base leading-8 mb-6"
                style={{ color: "rgba(160,196,216,0.8)" }}
              >
                {PORTFOLIO_DATA.bio}
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Projects", value: "6+" },
                  { label: "GitHub Commits", value: "400+" },
                  { label: "Years Coding", value: "3" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="p-4 text-center"
                    style={{
                      background: "rgba(0,212,255,0.04)",
                      border: "1px solid rgba(0,212,255,0.1)",
                    }}
                  >
                    <div
                      className="font-display text-2xl font-bold mb-1"
                      style={{ color: "var(--neon-blue)" }}
                    >
                      {value}
                    </div>
                    <div
                      className="font-mono text-[10px] tracking-widest opacity-50"
                      style={{ color: "#aaa" }}
                    >
                      {label.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avatar box */}
            <div className="flex justify-center">
              <div
                className="relative w-60 h-60 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(179,71,255,0.08))",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              >
                {/* Corner decorations */}
                {[
                  ["top-0 left-0", "border-t-2 border-l-2"],
                  ["top-0 right-0", "border-t-2 border-r-2"],
                  ["bottom-0 left-0", "border-b-2 border-l-2"],
                  ["bottom-0 right-0", "border-b-2 border-r-2"],
                ].map(([pos, border]) => (
                  <div
                    key={pos}
                    className={`absolute ${pos} w-6 h-6 ${border}`}
                    style={{ borderColor: "var(--neon-blue)" }}
                  />
                ))}
                <div
                  className="font-display text-6xl font-black"
                  style={{
                    color: "transparent",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    backgroundImage: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                  }}
                >
                  KP
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section
          id="classic-projects"
          className="py-28 px-6 md:px-16 lg:px-32"
          style={{
            borderTop: "1px solid rgba(0,212,255,0.06)",
            background: "linear-gradient(180deg, transparent 0%, rgba(10,22,40,0.3) 100%)",
          }}
        >
          <SectionLabel label="02 // PROJECTS" color="var(--neon-purple)" />
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {PORTFOLIO_DATA.projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section
          id="classic-skills"
          className="py-28 px-6 md:px-16 lg:px-32"
          style={{ borderTop: "1px solid rgba(0,212,255,0.06)" }}
        >
          <SectionLabel label="03 // SKILLS" color="var(--neon-cyan)" />
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-4 mt-10">
            {PORTFOLIO_DATA.skills.map((skill, i) => (
              <SkillBar key={skill.name} skill={skill} index={i} />
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section
          id="classic-experience"
          className="py-28 px-6 md:px-16 lg:px-32"
          style={{
            borderTop: "1px solid rgba(0,212,255,0.06)",
            background: "linear-gradient(180deg, transparent 0%, rgba(10,22,40,0.3) 100%)",
          }}
        >
          <SectionLabel label="04 // EXPERIENCE" color="var(--neon-purple)" />
          <div className="relative mt-10 max-w-2xl">
            {/* Timeline spine */}
            <div
              className="absolute left-4 top-0 bottom-0 w-px"
              style={{ background: "rgba(179,71,255,0.25)" }}
            />
            {PORTFOLIO_DATA.experience.map((exp, i) => (
              <TimelineItem key={i} exp={exp} index={i} />
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section
          id="classic-contact"
          className="py-28 px-6 md:px-16 lg:px-32"
          style={{ borderTop: "1px solid rgba(0,212,255,0.06)" }}
        >
          <SectionLabel label="05 // CONTACT" color="var(--neon-cyan)" />
          <div className="grid md:grid-cols-2 gap-16 mt-10 items-start">
            <div>
              <h2
                className="font-display text-3xl font-bold mb-4"
                style={{ color: "var(--neon-cyan)" }}
              >
                Let&apos;s build something.
              </h2>
              <p
                className="font-body text-base leading-7 mb-6 opacity-60"
                style={{ color: "#a0c4d8" }}
              >
                Open to collaborations, projects, and interesting conversations. Reach out!
              </p>
              <div className="space-y-3">
                {[
                  { label: "EMAIL", value: PORTFOLIO_DATA.email },
                  { label: "GITHUB", value: PORTFOLIO_DATA.github },
                  { label: "LINKEDIN", value: PORTFOLIO_DATA.linkedin },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <span
                      className="font-mono text-[10px] tracking-widest opacity-40 w-20"
                      style={{ color: "var(--neon-cyan)" }}
                    >
                      {label}
                    </span>
                    <a
                      href={label === "EMAIL" ? `mailto:${value}` : `https://${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm opacity-70 hover:opacity-100 transition-opacity"
                      style={{ color: "var(--neon-cyan)", cursor: "none" }}
                    >
                      {value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <ClassicContactForm />
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-8 px-16 text-center"
          style={{ borderTop: "1px solid rgba(0,212,255,0.06)" }}
        >
          <div
            className="font-mono text-xs opacity-25"
            style={{ color: "var(--neon-blue)" }}
          >
            KAVYA PARMAR © {new Date().getFullYear()} // DESIGNED & BUILT WITH ♥
          </div>
        </footer>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="font-mono text-xs tracking-[0.4em] opacity-60"
        style={{ color }}
      >
        {label}
      </div>
      <div className="flex-1 h-px" style={{ background: `${color}20` }} />
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PORTFOLIO_DATA.projects)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative p-6 transition-all duration-300"
      style={{
        background: hovered ? `${project.color}08` : "rgba(6,13,23,0.8)",
        border: `1px solid ${hovered ? project.color + "40" : "rgba(0,212,255,0.08)"}`,
        boxShadow: hovered ? `0 0 40px ${project.color}15` : "none",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Index */}
      <div
        className="font-mono text-[10px] tracking-widest mb-3 opacity-30"
        style={{ color: project.color }}
      >
        PROJECT_{String(index + 1).padStart(2, "0")}
      </div>

      <h3
        className="font-display text-xl font-bold mb-1"
        style={{ color: project.color }}
      >
        {project.title}
      </h3>
      <div
        className="font-mono text-xs mb-4 opacity-50"
        style={{ color: project.color }}
      >
        {project.subtitle}
      </div>

      <p
        className="font-body text-sm leading-6 mb-5 opacity-65"
        style={{ color: "#a0c4d8" }}
      >
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="font-mono text-[10px] px-2.5 py-1"
            style={{
              background: `${project.color}10`,
              border: `1px solid ${project.color}25`,
              color: project.color,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: project.color, cursor: "none" }}
          >
            ↗ LIVE DEMO
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-widest opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: project.color, cursor: "none" }}
          >
            ⌥ GITHUB
          </a>
        )}
      </div>
    </div>
  );
}

function SkillBar({
  skill,
  index,
}: {
  skill: (typeof PORTFOLIO_DATA.skills)[0];
  index: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), index * 80);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="mb-1">
      <div className="flex justify-between mb-1.5">
        <span
          className="font-mono text-xs opacity-75"
          style={{ color: "#a0c4d8" }}
        >
          {skill.name}
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: skill.color }}
        >
          {animated ? skill.level : 0}%
        </span>
      </div>
      <div
        className="w-full h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: animated ? `${skill.level}%` : "0%",
            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
            boxShadow: `0 0 8px ${skill.color}`,
            transition: `width 1.2s ${index * 0.06}s cubic-bezier(0.23,1,0.32,1)`,
          }}
        />
      </div>
    </div>
  );
}

function TimelineItem({
  exp,
  index,
}: {
  exp: (typeof PORTFOLIO_DATA.experience)[0];
  index: number;
}) {
  const colors = ["var(--neon-blue)", "var(--neon-purple)", "var(--neon-cyan)", "var(--neon-pink)"];
  const color = colors[index % colors.length];

  return (
    <div className="relative pl-12 pb-10">
      {/* Node */}
      <div
        className="absolute left-2.5 top-1 w-3 h-3 rounded-sm -translate-x-1/2"
        style={{
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />

      <div
        className="font-mono text-[10px] tracking-widest mb-1 opacity-50"
        style={{ color }}
      >
        {exp.year}
      </div>
      <div
        className="font-display text-lg font-bold mb-0.5"
        style={{ color: "var(--neon-blue)" }}
      >
        {exp.title}
      </div>
      <div
        className="font-mono text-xs mb-2 opacity-60"
        style={{ color }}
      >
        {exp.org}
      </div>
      <p
        className="font-body text-sm opacity-55"
        style={{ color: "#8fb3c4" }}
      >
        {exp.desc}
      </p>
    </div>
  );
}

function ClassicContactForm() {
  const [state, setState] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  };

  if (sent) {
    return (
      <div
        className="p-8 text-center"
        style={{
          background: "rgba(0,255,231,0.04)",
          border: "1px solid rgba(0,255,231,0.2)",
        }}
      >
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
          MESSAGE SENT
        </div>
        <div
          className="font-mono text-xs opacity-50"
          style={{ color: "#aaa" }}
        >
          I'll get back to you soon!
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6"
      style={{
        background: "rgba(0,255,231,0.03)",
        border: "1px solid rgba(0,255,231,0.12)",
      }}
    >
      <div className="space-y-4 mb-5">
        {[
          { field: "name", placeholder: "Your name" },
          { field: "email", placeholder: "your@email.com" },
        ].map(({ field, placeholder }) => (
          <div key={field}>
            <div
              className="font-mono text-[10px] tracking-widest mb-1.5 opacity-40"
              style={{ color: "var(--neon-cyan)" }}
            >
              {">"} {field.toUpperCase()}
            </div>
            <input
              type={field === "email" ? "email" : "text"}
              value={state[field as keyof typeof state]}
              onChange={(e) => setState({ ...state, [field]: e.target.value })}
              placeholder={placeholder}
              className="w-full px-4 py-2.5 font-mono text-sm outline-none transition-all"
              style={{
                background: "rgba(0,255,231,0.04)",
                border: "1px solid rgba(0,255,231,0.15)",
                color: "var(--neon-cyan)",
                caretColor: "var(--neon-cyan)",
              }}
            />
          </div>
        ))}
        <div>
          <div
            className="font-mono text-[10px] tracking-widest mb-1.5 opacity-40"
            style={{ color: "var(--neon-cyan)" }}
          >
            {">"} MESSAGE
          </div>
          <textarea
            rows={4}
            value={state.message}
            onChange={(e) => setState({ ...state, message: e.target.value })}
            placeholder="What's on your mind?"
            className="w-full px-4 py-2.5 font-mono text-sm outline-none resize-none transition-all"
            style={{
              background: "rgba(0,255,231,0.04)",
              border: "1px solid rgba(0,255,231,0.15)",
              color: "var(--neon-cyan)",
              caretColor: "var(--neon-cyan)",
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={sending || !state.name || !state.email || !state.message}
        className="w-full py-3 font-display text-xs tracking-[0.3em] font-bold transition-all"
        style={{
          background: sending ? "rgba(0,255,231,0.15)" : "rgba(0,255,231,0.08)",
          border: "1px solid rgba(0,255,231,0.4)",
          color: "var(--neon-cyan)",
          cursor: "none",
          opacity: !state.name || !state.email || !state.message ? 0.4 : 1,
        }}
      >
        {sending ? "TRANSMITTING..." : "SEND MESSAGE ▶"}
      </button>
    </div>
  );
}
