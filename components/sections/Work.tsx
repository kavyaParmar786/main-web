// FILE: /components/sections/Work.tsx
// Active Theory inspired: large full-bleed project items, clean typography, no clutter
'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const projects = [
  {
    id: 'eduquest',
    index: '01',
    title: 'EduQuest 3D',
    sub: 'AI + Robotics Learning Game',
    year: '2024',
    category: 'GAME DEV',
    status: 'LIVE',
    color: '#00d4ff',
    gradient: 'from-cyan-950/80 to-black/90',
    tech: ['Godot 4','GDScript','3D Physics','AI NPCs'],
    desc: 'A 3D puzzle-based game that teaches AI and robotics through immersive play. Physics-based puzzles, AI-driven characters, full curriculum integration.',
    impact: '→ Makes STEM feel like an adventure, not a textbook.',
  },
  {
    id: 'vortex',
    index: '02',
    title: 'Vortex Chronicles',
    sub: 'Sci-Fi Vehicle Combat Game',
    year: '2024',
    category: 'GAME DEV',
    status: 'IN DEV',
    color: '#6c35de',
    gradient: 'from-purple-950/80 to-black/90',
    tech: ['Godot 4','Shader Programming','Combat AI','3D World Design'],
    desc: 'Open-world sci-fi vehicle combat. Boss battles, dynamic environments, a fleet of futuristic vehicles. Every system handbuilt.',
    impact: '→ AAA ambition, indie execution.',
  },
  {
    id: 'datamind',
    title: 'DataMind AI',
    index: '03',
    sub: 'Automated Data Extraction',
    year: '2023',
    category: 'AI TOOLS',
    status: 'LIVE',
    color: '#23f080',
    gradient: 'from-emerald-950/80 to-black/90',
    tech: ['Python','Streamlit','NLP','REST APIs'],
    desc: 'AI-powered pipeline for structured data extraction from unstructured sources. Reduces manual processing by 80%+.',
    impact: '→ Real clients. Real time saved.',
  },
  {
    id: 'geoplay',
    title: 'GeoPlay Series',
    index: '04',
    sub: 'Educational Board Games',
    year: '2024',
    category: 'CREATIVE ENG',
    status: 'COMPLETE',
    color: '#f0a500',
    gradient: 'from-amber-950/80 to-black/90',
    tech: ['Game Design','Curriculum Dev','Prototyping','Illustration'],
    desc: 'Three board games covering geomorphology, seismology, and robotics. Play-tested with students, iterated on feedback.',
    impact: '→ Learning and play are the same thing.',
  },
]

// Background color placeholders for projects (since no real images)
const bgColors: Record<string, string> = {
  eduquest: 'linear-gradient(135deg, #001a2e 0%, #003344 40%, #00d4ff08 100%)',
  vortex:   'linear-gradient(135deg, #0d0018 0%, #1a003a 40%, #6c35de08 100%)',
  datamind: 'linear-gradient(135deg, #001a0e 0%, #002a18 40%, #23f08008 100%)',
  geoplay:  'linear-gradient(135deg, #1a0e00 0%, #2a1800 40%, #f0a50008 100%)',
}

// Modal detail view
function ProjectModal({ p, onClose }: { p: typeof projects[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9000] flex items-end md:items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(4,5,7,0.95)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type:'spring', bounce:0.2, duration:0.5 }}
        className="glass w-full max-w-2xl p-8 md:p-10 relative"
        style={{ borderColor: `${p.color}30` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient top line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute top-0 left-0 right-0 h-px origin-left"
          style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }}
        />

        <button onClick={onClose}
          className="absolute top-4 right-5 f-mono text-[10px] tracking-widest text-[var(--muted)] hover:text-white transition-colors"
          data-cursor
        >[ CLOSE ]</button>

        <div className="flex items-start gap-4 mb-6">
          <span className="f-mono text-[10px] text-[var(--muted)] mt-1">{p.index}</span>
          <div>
            <div className="f-mono text-[10px] tracking-widest mb-2" style={{ color: p.color }}>
              {p.category} · {p.year} · {p.status}
            </div>
            <h3 className="f-display text-2xl md:text-3xl font-black text-white leading-none mb-1">{p.title}</h3>
            <p className="f-body text-[var(--muted)]">{p.sub}</p>
          </div>
        </div>

        <p className="f-body text-[var(--text)] leading-relaxed mb-6 text-[15px]">{p.desc}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {p.tech.map(t => (
            <span key={t} className="f-mono text-[9px] px-3 py-1 border border-white/10 text-[var(--muted)] tracking-widest">{t}</span>
          ))}
        </div>

        <p className="f-mono text-[11px] italic border-t border-white/5 pt-4" style={{ color: p.color }}>
          {p.impact}
        </p>
      </motion.div>
    </motion.div>
  )
}

// Single work item — Active Theory full-bleed style
function WorkItem({ p, i }: { p: typeof projects[0]; i: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16,1,0.3,1] }}
        onClick={() => setOpen(true)}
        className="work-item group cursor-none rounded-sm overflow-hidden"
        style={{ height: i === 0 ? '520px' : '340px' }}
        data-cursor
      >
        {/* Background */}
        <div className="absolute inset-0" style={{ background: bgColors[p.id] }}>
          {/* Grid texture */}
          <div className="absolute inset-0 h-grid opacity-40" />
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full opacity-30"
              style={{
                background: `radial-gradient(circle, ${p.color}, transparent)`,
                filter: 'blur(40px)',
                animation: 'glow-pulse 3s ease-in-out infinite',
              }}
            />
          </div>
          {/* Large background number */}
          <div className="bg-number absolute -right-8 bottom-0 opacity-[0.04]"
            style={{ color: p.color, WebkitTextStroke: `1px ${p.color}` }}
          >
            {p.index}
          </div>
        </div>

        {/* Overlay */}
        <div className="work-item-overlay" />

        {/* Content — bottom aligned */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          {/* Top row: category + status */}
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <span className="f-mono text-[10px] tracking-widest text-[var(--muted)]">{p.index}</span>
            <span className="f-mono text-[9px] tracking-widest px-2 py-0.5 border"
              style={{ borderColor:`${p.color}40`, color:p.color, background:`${p.color}10` }}
            >{p.category}</span>
            {p.status === 'LIVE' && (
              <span className="flex items-center gap-1 f-mono text-[9px] text-[var(--green)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]"
                  style={{ animation:'pulse-dot 2s ease-in-out infinite' }}
                />
                LIVE
              </span>
            )}
          </div>
          <span className="absolute top-6 right-6 f-mono text-[10px] text-[var(--muted)]">{p.year}</span>

          {/* Title */}
          <h3
            className="f-display font-black text-white leading-none mb-2"
            style={{
              fontSize: i === 0 ? 'clamp(2rem,5vw,4rem)' : 'clamp(1.4rem,3.5vw,2.4rem)',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
            }}
          >
            {p.title}
          </h3>
          <p className="f-body text-[var(--muted)] mb-4 text-sm">{p.sub}</p>

          {/* Hover reveal */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {p.tech.slice(0,3).map(t => (
                <span key={t} className="f-mono text-[9px] text-[var(--muted)] opacity-60">{t}</span>
              ))}
            </div>
            <span className="f-mono text-[11px] tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ color: p.color }}
            >
              OPEN →
            </span>
          </div>
        </div>

        {/* Color accent line — bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
          style={{ background: p.color }}
        />
      </motion.div>

      <AnimatePresence>
        {open && <ProjectModal p={p} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

export default function Work() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="work" className="py-32">
      <div className="container">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:20 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          className="mb-16"
        >
          <div className="sec-label"><span>02 / Work</span></div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="f-display font-black text-white leading-none"
              style={{ fontSize:'clamp(2.5rem,6vw,5.5rem)' }}
            >
              SELECTED<br />
              <span className="grad-text">PROJECTS.</span>
            </h2>
            <p className="f-mono text-[11px] text-[var(--muted)] tracking-wider max-w-xs text-right leading-relaxed hide-mobile">
              Click any project<br />to open the file.
            </p>
          </div>
        </motion.div>

        {/* Featured + grid */}
        <div className="space-y-3">
          {/* First item — full width featured */}
          <WorkItem p={projects[0]} i={0} />
          {/* Rest — 3 column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {projects.slice(1).map((p, i) => <WorkItem key={p.id} p={p} i={i+1} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
