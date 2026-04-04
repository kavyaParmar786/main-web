// FILE: /components/sections/About.tsx
'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const traits = [
  { icon: '🎮', key: 'GAME DEV',    color: '#00d4ff', desc: 'Godot 4 — 3D games from scratch. Physics, shaders, AI behaviour trees.' },
  { icon: '🤖', key: 'AI TOOLS',    color: '#6c35de', desc: 'Python + Streamlit automation pipelines. Real workflows, real impact.' },
  { icon: '🦾', key: 'ROBOTICS',    color: '#f0a500', desc: 'Cobot systems and human-machine interfaces. Physical meets digital.' },
  { icon: '🌐', key: 'WEB DEV',     color: '#23f080', desc: 'Next.js, React, TypeScript. Production apps shipped to Vercel.' },
]

const timeline = [
  { year: '2022', event: 'First line of code',         note: 'A calculator. Then broke it. Fixed it better.' },
  { year: '2023', event: 'First 3D game in Godot 4',   note: 'Physics, AI, shaders — completely self-taught.' },
  { year: '2023', event: 'AI automation tool shipped', note: 'Real clients. 80%+ time reduction.' },
  { year: '2024', event: 'Board game curriculum',      note: '3 games — geomorphology, seismology, robotics.' },
  { year: '2025', event: 'Full-stack web developer',   note: 'Next.js, R3F, production-grade. You are here.' },
]

function TraitCard({ t, i }: { t: typeof traits[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:30 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ delay:i*0.08, duration:0.6, ease:[0.16,1,0.3,1] }}
      className="glass p-6 relative overflow-hidden group"
      style={{ borderColor:`${t.color}18` }}
    >
      <div className="absolute top-0 left-0 w-0 h-px group-hover:w-full transition-all duration-500"
        style={{ background: t.color }}
      />
      <div className="text-2xl mb-3">{t.icon}</div>
      <div className="f-mono text-[10px] tracking-widest mb-2" style={{ color: t.color }}>{t.key}</div>
      <p className="f-body text-sm text-[var(--muted)] leading-relaxed">{t.desc}</p>
    </motion.div>
  )
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="about" className="py-32">
      <div className="container">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:20 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          className="mb-20"
        >
          <div className="sec-label"><span>01 / About</span></div>
          <h2 className="f-display font-black text-white leading-none mb-8"
            style={{ fontSize:'clamp(2.5rem,6vw,5.5rem)' }}
          >
            WHO I AM<span className="text-cyan-400">.</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <p className="f-body text-lg text-[var(--text)] leading-relaxed">
                I'm <span className="text-cyan-400 font-semibold">Kavya Parmar</span>, a teenage developer
                from Rajkot, India. I build games, AI tools, and digital experiences that push what's possible.
              </p>
              <p className="f-body text-[var(--muted)] leading-relaxed">
                I don't wait to be taught. I find problems, break them apart, and build
                solutions that didn't exist before — whether that's a 3D sci-fi game,
                an automation pipeline, or a full-stack web app.
              </p>
              <p className="f-mono text-sm text-cyan-400/50">// AGE: TEENAGER. AMBITION: INFINITE.</p>
            </div>
            {/* Timeline */}
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity:0, x:20 }}
                  whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true }}
                  transition={{ delay:i*0.08 }}
                  className="flex gap-5 group"
                >
                  <div className="flex-shrink-0 pt-1">
                    <div className="f-mono text-[10px] text-cyan-400/60 tracking-widest">{item.year}</div>
                  </div>
                  <div className="border-l border-white/8 pl-5 pb-6 flex-1">
                    <div className="f-body font-semibold text-white text-sm mb-0.5 group-hover:text-cyan-400 transition-colors">
                      {item.event}
                    </div>
                    <div className="f-mono text-[10px] text-[var(--muted)] tracking-wide">{item.note}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trait cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {traits.map((t, i) => <TraitCard key={t.key} t={t} i={i} />)}
        </div>
      </div>
    </section>
  )
}
