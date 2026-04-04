// FILE: /components/sections/Hero.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'

const HeroOrb = dynamic(() => import('@/components/ui/HeroOrb'), { ssr: false })

// Scramble text — stable, no excessive re-renders
function Scramble({ text, delay = 0 }: { text: string; delay?: number }) {
  const [out, setOut] = useState(text.replace(/\S/g, '▓'))
  const chars = '!#$%&?~ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  useEffect(() => {
    const t = setTimeout(() => {
      let f = 0, total = 28
      const iv = setInterval(() => {
        const p = f / total
        const revealed = Math.floor(p * text.length)
        setOut(text.split('').map((c, i) =>
          i < revealed || c === ' ' || c === '·' ? c : chars[Math.floor(Math.random() * chars.length)]
        ).join(''))
        if (++f > total) { setOut(text); clearInterval(iv) }
      }, 45)
    }, delay)
    return () => clearTimeout(t)
  }, [text, delay])
  return <>{out}</>
}

export default function Hero({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const [ready, setReady] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Parallax: text lifts up, fades — Active Theory style
  const y    = useTransform(scrollYProgress, [0, 1], [0, -120])
  const fade = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => { setReady(true) }, [])

  return (
    <section ref={ref} id="hero" className="relative h-screen min-h-[640px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 h-grid opacity-60" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 60% 50%, rgba(7,9,15,0.6) 0%, var(--black) 100%)' }}
      />
      {/* Ambient blobs — CSS only */}
      <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)', filter: 'blur(40px)' }}
      />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(108,53,222,0.07), transparent 70%)', filter: 'blur(40px)' }}
      />

      {/* 3D orb — right side on desktop */}
      <div className="absolute right-0 top-0 w-full md:w-1/2 h-full">
        {ready && <HeroOrb />}
      </div>

      {/* Main content — left side */}
      <motion.div style={{ y, opacity: fade }} className="container relative z-10">
        <div className="max-w-xl">
          {/* Status */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.7, duration:0.7 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--green)]"
              style={{ animation:'pulse-dot 2s ease-in-out infinite', boxShadow:'0 0 8px var(--green)' }}
            />
            <span className="f-mono text-[10px] tracking-[0.4em] text-[var(--muted)] uppercase">
              System online · Available for work
            </span>
          </motion.div>

          {/* Name — Active Theory scale */}
          <div className="overflow-hidden mb-3">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay:0.9, duration:0.9, ease:[0.16,1,0.3,1] }}
              className="f-display font-black leading-[0.9] tracking-tight"
              style={{ fontSize:'clamp(3.5rem,9vw,8.5rem)' }}
            >
              <span className="block text-white">KAVYA</span>
              <span className="block grad-text">PARMAR</span>
            </motion.h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:1.4, duration:0.6 }}
            className="f-mono text-[11px] tracking-[0.3em] text-[var(--muted)] mb-10 uppercase"
          >
            {ready && <Scramble text="Game Dev · AI Engineer · Creative Technologist" delay={1600} />}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:1.7, duration:0.6 }}
            className="flex gap-5 items-center flex-wrap"
          >
            <button
              onClick={() => document.querySelector('#work')?.scrollIntoView({ behavior:'smooth' })}
              className="btn-primary" data-cursor
            >
              <span>View Work</span>
              <span>→</span>
            </button>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior:'smooth' })}
              className="f-mono text-[11px] tracking-widest text-[var(--muted)] hover:text-[var(--cyan)] transition-colors"
              data-cursor
            >
              Get in touch ↓
            </button>
          </motion.div>

          {/* Stat row */}
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:2.0, duration:0.6 }}
            className="flex gap-10 mt-14 pt-8 border-t border-white/5"
          >
            {[['4+','Projects shipped'],['3','Games built'],['∞','Ideas queued']].map(([n,l]) => (
              <div key={l}>
                <div className="f-display text-2xl font-black text-white mb-0.5"
                  style={{ textShadow:'0 0 30px rgba(0,212,255,0.4)' }}
                >{n}</div>
                <div className="f-mono text-[9px] tracking-widest text-[var(--muted)] uppercase">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:2.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-cyan-400/50" />
        <span className="f-mono text-[8px] tracking-[0.5em] text-[var(--muted)] uppercase">Scroll</span>
      </motion.div>

      {/* Corner telemetry — hidden on mobile */}
      <div className="absolute bottom-8 right-8 hide-mobile f-mono text-[9px] text-[var(--muted)] text-right space-y-1 opacity-40">
        <div>LAT 22.3°N · LON 70.8°E</div>
        <div>BUILD v4.0 · 2025</div>
      </div>
    </section>
  )
}
