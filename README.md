# KAVYA.SYS — Portfolio Interface v2.0

> A futuristic 2D game-style interactive portfolio for **Kavya Parmar**, built with Next.js 14, Phaser 3, and Framer Motion. Walk through a cinematic digital world where each zone reveals a new section of the portfolio.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Boot sequence** | Animated terminal startup with typewriter text |
| **2D side-scrolling world** | Phaser 3 engine, 9000px wide canvas |
| **Custom player character** | Drawn with Phaser Graphics, runs/jumps/trails |
| **6 distinct zones** | About · Projects · Skills · Experience · Contact |
| **React UI overlays** | Glassmorphism panels per zone, smooth transitions |
| **Project modals** | Click terminals → animated detail overlay |
| **Skill bars** | Animated fills with intersection observer |
| **Experience timeline** | Visual tower/node system |
| **Contact form** | Functional (wire to backend of choice) |
| **Mini-map HUD** | Top-left world position indicator |
| **Navigation bar** | Jump-to-zone teleport with camera flash |
| **Classic Mode** | Full scroll-based fallback layout |
| **Custom cursor** | Glowing dot + trailing ring |
| **Particle system** | Ambient floating particles, burst effects |
| **Zone transitions** | Flash overlay when entering new zones |
| **Easter egg** | Type `kavya` anywhere to trigger hidden mode |
| **Sound system** | Web Audio API synthesized UI sounds |
| **Responsive** | Desktop-first; Classic Mode for mobile |

---

## 📂 Folder Structure

```
kavya-portfolio/
├── app/
│   ├── layout.tsx                 Root layout + metadata
│   ├── page.tsx                   App phase controller (boot→enter→game)
│   ├── components/
│   │   ├── BootScreen.tsx         Terminal boot animation
│   │   ├── GameWorld.tsx          Phaser init + React bridge
│   │   ├── UIOverlay.tsx          Zone-specific HUD panels
│   │   ├── ModalSystem.tsx        Project detail modals
│   │   ├── NavigationOverlay.tsx  Top nav with teleport
│   │   ├── ClassicMode.tsx        Scroll portfolio fallback
│   │   ├── CustomCursor.tsx       Glowing cursor + trail
│   │   ├── InteractHint.tsx       "Press E" prompt
│   │   └── ZoneTransition.tsx     Zone entry flash overlay
│   └── game/
│       ├── scenes/
│       │   └── GameScene.ts       Main Phaser scene
│       ├── objects/
│       │   ├── PlayerController.ts  Character with physics + drawing
│       │   └── WorldMap.ts          All zones, buildings, particles
│       └── systems/
│           ├── gameStore.ts         Zustand state + portfolio data
│           ├── SoundSystem.ts       Web Audio procedural sounds
│           ├── ParticleSystem.ts    Particle spawning + update
│           ├── CameraController.ts  Smooth camera follow + shake
│           └── TextScramble.ts      Glitch text reveal utility
├── styles/
│   └── globals.css                All CSS vars, animations, utilities
├── public/
│   └── assets/                    (Place images/icons here)
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+ or pnpm

### Installation

```bash
# 1. Navigate into the project
cd kavya-portfolio

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

---

## 🎮 Controls

| Input | Action |
|---|---|
| `←` / `A` | Move left |
| `→` / `D` | Move right |
| `↑` / `W` / `Space` | Jump |
| `E` | Interact with nearby object |
| `Escape` | Close modal |
| Type `kavya` | 🔐 Unlock Easter egg mode |

---

## ✏️ Customization Guide

### 1. Update Portfolio Content

All portfolio data lives in one place:

```ts
// app/game/systems/gameStore.ts

export const PORTFOLIO_DATA = {
  name: "Kavya Parmar",          // ← Your name
  title: "Teen Developer...",    // ← Your tagline
  bio: "...",                    // ← Your bio
  email: "kavya@example.com",    // ← Your email
  github: "github.com/...",      // ← Your GitHub
  linkedin: "linkedin.com/in/...", // ← Your LinkedIn

  skills: [...],     // ← Add/remove skills with levels
  projects: [...],   // ← Add/remove projects
  experience: [...], // ← Add/remove timeline entries
};
```

### 2. Change Color Theme

Edit CSS variables in `styles/globals.css`:

```css
:root {
  --neon-blue: #00d4ff;     /* Primary accent */
  --neon-purple: #b347ff;   /* Secondary accent */
  --neon-cyan: #00ffe7;     /* Tertiary / success */
  --neon-pink: #ff2d9b;     /* Highlight / alert */
  --dark-900: #020408;      /* Deepest background */
}
```

### 3. Add a New Project

```ts
// In gameStore.ts → PORTFOLIO_DATA.projects
{
  id: "proj-5",
  title: "MyProject",
  subtitle: "What it does",
  description: "Full description here...",
  tech: ["React", "Node.js"],
  link: "https://myproject.com",
  github: "https://github.com/me/myproject",
  color: "#b347ff",   // Neon color for this card
}
```

### 4. Add a New Skill

```ts
// In gameStore.ts → PORTFOLIO_DATA.skills
{ name: "Three.js", level: 70, category: "frontend", color: "#00d4ff" },
```

Categories: `"frontend"` | `"backend"` | `"tools"` | `"languages"`

### 5. Wire Up the Contact Form

In `UIOverlay.tsx` → `ContactOverlay` → `handleSend`:

```ts
const handleSend = async () => {
  setSending(true);
  await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify(formState),
    headers: { "Content-Type": "application/json" },
  });
  setSending(false);
  setSent(true);
};
```

Then create `app/api/contact/route.ts` with your email service (Resend, Nodemailer, etc).

### 6. Enable Sound by Default

In `gameStore.ts`:
```ts
soundEnabled: true,   // Change from false
```

---

## 🌐 Deployment (Vercel)

### Option A: CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Option B: Git Integration

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repo
4. Click **Deploy**

Vercel auto-detects Next.js — zero config needed.

---

## ⚡ Performance Tips

| Optimization | Status |
|---|---|
| Dynamic Phaser import (SSR safe) | ✅ |
| `reactStrictMode: false` (prevents double Phaser init) | ✅ |
| Particle count cap at 300 | ✅ |
| Graphics reuse (`.clear()` + redraw) | ✅ |
| Phaser AUTO renderer (WebGL with Canvas fallback) | ✅ |
| Font preloading via Google Fonts | ✅ |

If performance dips:
- Reduce `MAX_PARTICLES` in `ParticleSystem.ts`
- Lower particle counts in `WorldMap.ts → initParticles()`
- Disable the background star drawing for older devices

---

## 📱 Mobile Support

The game mode is desktop-first (keyboard controls). On mobile:

- The top navigation bar is always accessible
- **Classic Mode** button switches to a full scroll layout
- Classic Mode is fully touch-friendly

You can auto-detect mobile and skip to Classic Mode:

```ts
// In page.tsx
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (isMobile) setPhase("classic");
```

---

## 🏗️ Tech Stack

| Tool | Role |
|---|---|
| **Next.js 14** | App Router, SSR, routing |
| **Phaser 3** | 2D game engine (world, physics, camera) |
| **Zustand** | Global state (zone, modal, player position) |
| **Tailwind CSS** | UI utility classes |
| **Web Audio API** | Procedural sound synthesis |
| **TypeScript** | Full type safety |
| **Google Fonts** | Orbitron · Share Tech Mono · Exo 2 |

---

## 🔐 Easter Eggs

- **Type `kavya`** on keyboard anywhere → Activates KAVYA MODE with purple flash
- **Hidden mode** toggles a purple overlay class on `document.body` — extend with `body.easter-egg-mode` CSS for anything wild

---

## 📝 License

MIT — free to use, modify, and deploy. Credit appreciated but not required.

---

*Built with ♥ for Kavya Parmar — Teen Developer, Builder, Creator.*
