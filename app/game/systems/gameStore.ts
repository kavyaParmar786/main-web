// FILE: /app/game/systems/gameStore.ts

import { create } from "zustand";

export type Zone = "boot" | "about" | "projects" | "skills" | "experience" | "contact";

export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  color: string;
}

export interface SkillData {
  name: string;
  level: number;
  category: "frontend" | "backend" | "tools" | "languages";
  color: string;
}

interface GameState {
  currentZone: Zone;
  playerX: number;
  playerY: number;
  modalOpen: boolean;
  modalContent: ProjectData | null;
  soundEnabled: boolean;
  gameReady: boolean;
  unlockedZones: Zone[];
  activeInteractable: string | null;

  // Actions
  setCurrentZone: (zone: Zone) => void;
  setPlayerPosition: (x: number, y: number) => void;
  openModal: (project: ProjectData) => void;
  closeModal: () => void;
  toggleSound: () => void;
  setGameReady: (ready: boolean) => void;
  unlockZone: (zone: Zone) => void;
  setActiveInteractable: (id: string | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentZone: "boot",
  playerX: 0,
  playerY: 0,
  modalOpen: false,
  modalContent: null,
  soundEnabled: false,
  gameReady: false,
  unlockedZones: ["boot"],
  activeInteractable: null,

  setCurrentZone: (zone) => set({ currentZone: zone }),
  setPlayerPosition: (x, y) => set({ playerX: x, playerY: y }),
  openModal: (project) => set({ modalOpen: true, modalContent: project }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setGameReady: (ready) => set({ gameReady: ready }),
  unlockZone: (zone) =>
    set((state) => ({
      unlockedZones: state.unlockedZones.includes(zone)
        ? state.unlockedZones
        : [...state.unlockedZones, zone],
    })),
  setActiveInteractable: (id) => set({ activeInteractable: id }),
}));

// ─── Portfolio Data ───────────────────────────────────────────────────────────

export const PORTFOLIO_DATA = {
  name: "Kavya Parmar",
  title: "Teen Developer · Builder · Creator",
  bio: "16-year-old developer from India building the future one line at a time. I craft web experiences, automate the mundane, and turn ideas into reality.",
  location: "India",
  email: "kavya@example.com",
  github: "github.com/kavyaparmar",
  linkedin: "linkedin.com/in/kavyaparmar",

  skills: [
    { name: "React / Next.js", level: 85, category: "frontend", color: "#00d4ff" },
    { name: "TypeScript", level: 78, category: "languages", color: "#b347ff" },
    { name: "Python", level: 82, category: "languages", color: "#00ffe7" },
    { name: "Node.js", level: 75, category: "backend", color: "#00d4ff" },
    { name: "Tailwind CSS", level: 90, category: "frontend", color: "#ff2d9b" },
    { name: "MongoDB", level: 70, category: "backend", color: "#b347ff" },
    { name: "Git / GitHub", level: 88, category: "tools", color: "#00ffe7" },
    { name: "Figma", level: 72, category: "tools", color: "#00d4ff" },
  ] as SkillData[],

  projects: [
    {
      id: "proj-1",
      title: "NeuralChat",
      subtitle: "AI Conversation Platform",
      description:
        "A full-stack AI chat application with real-time streaming, conversation history, and custom personas. Built with Next.js, OpenAI API, and MongoDB.",
      tech: ["Next.js", "OpenAI", "MongoDB", "Socket.io"],
      link: "https://neuralchat.demo",
      github: "https://github.com/kavya/neuralchat",
      color: "#00d4ff",
    },
    {
      id: "proj-2",
      title: "PixelForge",
      subtitle: "No-Code Game Builder",
      description:
        "Drag-and-drop browser-based game builder that exports to WebGL. Features sprite editor, physics engine, and one-click publishing.",
      tech: ["React", "Canvas API", "WebGL", "Node.js"],
      github: "https://github.com/kavya/pixelforge",
      color: "#b347ff",
    },
    {
      id: "proj-3",
      title: "EcoTrackr",
      subtitle: "Carbon Footprint Dashboard",
      description:
        "Data visualization dashboard that gamifies eco-friendly habits. Won 2nd place at national school hackathon 2024.",
      tech: ["React", "D3.js", "Python", "FastAPI"],
      link: "https://ecotrackr.demo",
      color: "#00ffe7",
    },
    {
      id: "proj-4",
      title: "CodePeer",
      subtitle: "Live Code Collaboration",
      description:
        "Real-time collaborative code editor with video chat, syntax highlighting, and AI-powered code review built for student developers.",
      tech: ["Next.js", "WebRTC", "Monaco Editor", "Redis"],
      color: "#ff2d9b",
    },
  ] as ProjectData[],

  experience: [
    {
      year: "2024",
      title: "Open Source Contributor",
      org: "Mozilla Firefox",
      desc: "Contributed 3 bug fixes to browser devtools",
    },
    {
      year: "2024",
      title: "Hackathon Winner",
      org: "National School Hackathon",
      desc: "2nd Place — EcoTrackr project",
    },
    {
      year: "2023",
      title: "Freelance Developer",
      org: "Self-Employed",
      desc: "Built 6 client websites and web apps",
    },
    {
      year: "2023",
      title: "Started Coding",
      org: "Self-Taught",
      desc: "Learned HTML/CSS/JS through online resources",
    },
  ],
};

// ─── Zone World Positions (pixel offsets in world space) ──────────────────────
export const ZONE_POSITIONS: Record<Zone, number> = {
  boot: 0,
  about: 1400,
  projects: 2900,
  skills: 4500,
  experience: 6000,
  contact: 7400,
};

export const WORLD_WIDTH = 9000;
export const WORLD_HEIGHT = 720;
