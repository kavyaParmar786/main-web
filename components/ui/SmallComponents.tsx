// FILE: /components/ui/SmallComponents.tsx
// BootSequence + Footer + EasterEgg + AudioToggle — all in one file to keep things small
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── BOOT ─────────────────────────────────────────────────────────────────── */
const LINES = [
  { t:'> KAVYA_OS v4.0 — Initializing...', c:'dim',   d:0   },
  { t:'> Loading modules...',               c:'dim',   d:280 },
  { t:'> game_engine.core     [OK]',        c:'green', d:560 },
  { t:'> ai_systems.node      [OK]',        c:'green', d:800 },
  { t:'> web_dev.stack        [OK]',        c:'green', d:1040},
  { t:'> Welcome, operator.',               c:'cyan',  d:1280},
]

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState<number[]>([])
  const [prog, setProg]   = useState(0)
  const [out, setOut]     = useState(false)

  useEffect(() => {
    LINES.forEach((l,i) => setTimeout(() => setShown(p=>[...p,i]), l.d + 300))
    const iv = setInterval(() => setProg(p => { const n=Math.min(p+3,100); if(n===100)clearInterval(iv); return n }), 50)
    const t  = setTimeout(() => { setOut(true); setTimeout(onDone, 500) }, 2600)
    return () => { clearInterval(iv); clearTimeout(t) }
  }, [onDone])

  return (
    <AnimatePresence>
      {!out && (
        <motion.div exit={{ opacity:0, scale:1.04 }} transition={{ duration:0.5 }}
          className="fixed inset-0 z-[99999] bg-[var(--black)] flex flex-col items-center justify-center p-6"
          style={{ backgroundImage:'linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)', backgroundSize:'40px 40px' }}
        >
          <div className="f-display text-4xl font-black text-cyan-400 tracking-[0.3em] mb-2"
            style={{ textShadow:'0 0 20px rgba(0,212,255,0.8)' }}
          >KP</div>
          <div className="f-mono text-[9px] tracking-[0.5em] text-[var(--muted)] mb-10">SYSTEM BOOT</div>

          <div className="glass p-5 w-full max-w-md f-mono text-[11px] space-y-1.5 mb-6">
            <div className="flex gap-1.5 pb-3 border-b border-white/5 mb-3">
              {['bg-red-500/60','bg-yellow-500/60','bg-green-500/60'].map(c=><div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`}/>)}
              <span className="ml-2 text-[var(--muted)] text-[9px] tracking-widest">KAVYA_OS TERMINAL</span>
            </div>
            {LINES.map((l,i) => (
              <AnimatePresence key={i}>
                {shown.includes(i) && (
                  <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.2 }}
                    className={l.c==='cyan'?'text-cyan-400 font-bold':l.c==='green'?'text-[var(--green)]':'text-[var(--muted)]'}
                  >{l.t}</motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>

          <div className="w-full max-w-md">
            <div className="flex justify-between f-mono text-[9px] text-[var(--muted)] mb-1.5">
              <span>LOADING</span><span>{prog}%</span>
            </div>
            <div className="h-[2px] bg-[var(--panel)] rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{ width:`${prog}%`, background:'linear-gradient(90deg,#6c35de,#00d4ff)', boxShadow:'0 0 8px rgba(0,212,255,0.6)' }}
              />
            </div>
          </div>
          <button onClick={onDone} className="absolute bottom-6 right-6 f-mono text-[9px] text-[var(--muted)] hover:text-cyan-400 transition-colors tracking-widest">
            [ SKIP ]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── EASTER EGG ───────────────────────────────────────────────────────────── */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
export function EasterEgg() {
  const [show, setShow] = useState(false)
  const seq = useRef<string[]>([])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      seq.current = [...seq.current, e.key].slice(-10)
      if (seq.current.join(',') === KONAMI.join(',')) { setShow(true); setTimeout(()=>setShow(false),5000); seq.current=[] }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.05}}
          className="fixed inset-0 z-[99998] flex items-center justify-center pointer-events-none"
        >
          <div className="glass p-10 max-w-sm text-center" style={{ border:'1px solid rgba(0,212,255,0.3)', boxShadow:'0 0 40px rgba(0,212,255,0.15)' }}>
            <div className="f-display text-cyan-400 text-base font-bold tracking-widest mb-2">⚡ CLASSIFIED ACCESS ⚡</div>
            <div className="f-mono text-[9px] text-[var(--muted)] tracking-widest mb-4">KONAMI PROTOCOL AUTHENTICATED</div>
            <p className="f-body text-sm text-[var(--text)]/80 leading-relaxed mb-3">
              Kavya hides easter eggs in everything she builds.<br />
              <span className="text-cyan-400">This is a feature, not a bug.</span>
            </p>
            <div className="f-mono text-[9px] text-[var(--green)] tracking-widest">ACHIEVEMENT: EXPLORER</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── AUDIO TOGGLE ─────────────────────────────────────────────────────────── */
export function AudioToggle() {
  const [on, setOn] = useState(false)
  const ctx = useRef<AudioContext|null>(null)
  const gain = useRef<GainNode|null>(null)
  const oscs = useRef<OscillatorNode[]>([])

  const start = () => {
    const c = new (window.AudioContext||(window as any).webkitAudioContext)()
    ctx.current = c
    const g = c.createGain()
    g.gain.setValueAtTime(0, c.currentTime)
    g.gain.linearRampToValueAtTime(0.035, c.currentTime + 2)
    g.connect(c.destination)
    gain.current = g
    ;[55,110,165,220].forEach((f,i)=>{
      const o = c.createOscillator()
      const og = c.createGain()
      o.type = i%2===0?'sine':'triangle'
      o.frequency.value = f
      og.gain.value = 0.25/(i+1)
      o.connect(og); og.connect(g); o.start()
      oscs.current.push(o)
    })
  }

  const stop = () => {
    if(!gain.current||!ctx.current) return
    gain.current.gain.linearRampToValueAtTime(0, ctx.current.currentTime+1)
    setTimeout(()=>{ oscs.current.forEach(o=>{try{o.stop()}catch(_){}});  oscs.current=[];ctx.current?.close();ctx.current=null },1100)
  }

  const toggle = () => { on?stop():start(); setOn(!on) }

  return (
    <motion.button
      initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
      onClick={toggle} data-cursor
      className="fixed bottom-6 right-6 z-[800] glass px-3 py-2 f-mono text-[9px] tracking-widest text-[var(--muted)] hover:text-cyan-400 transition-colors flex items-center gap-2"
    >
      <div className="flex gap-0.5 items-end h-3">
        {[3,5,4,6,3].map((h,i)=>(
          <div key={i} className={`w-0.5 rounded-sm ${on?'bg-cyan-400':'bg-[var(--muted)]'}`}
            style={{ height:`${h*2}px`, animation: on ? `hud-pulse ${0.5+i*0.1}s ease-in-out infinite alternate` : 'none' }}
          />
        ))}
      </div>
      {on?'SFX:ON':'SFX:OFF'}
    </motion.button>
  )
}

/* ─── FOOTER ───────────────────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="f-display text-lg font-black grad-text tracking-widest">KAVYA PARMAR</div>
        <div className="flex items-center gap-2 f-mono text-[9px] text-[var(--muted)] tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" style={{animation:'pulse-dot 2s infinite',boxShadow:'0 0 6px var(--green)'}} />
          ALL SYSTEMS OPERATIONAL
        </div>
        <div className="f-mono text-[9px] text-[var(--muted)] text-right">
          <div>© {new Date().getFullYear()} KAVYA PARMAR</div>
          <div className="opacity-40">// BUILT WITH NEXT.JS + THREE.JS</div>
          <div className="opacity-20 mt-1">// TRY: ↑↑↓↓←→←→BA</div>
        </div>
      </div>
    </footer>
  )
}

/* ─── SCROLL PROGRESS ──────────────────────────────────────────────────────── */
export function ScrollProgress() {
  const [prog, setProg] = useState(0)
  useEffect(()=>{
    const h = ()=>{
      const s = window.scrollY
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProg(h>0?s/h:0)
    }
    window.addEventListener('scroll',h,{passive:true})
    return ()=>window.removeEventListener('scroll',h)
  },[])
  return (
    <div className="fixed top-0 left-0 right-0 z-[950] h-[2px] bg-transparent pointer-events-none">
      <div className="h-full transition-none"
        style={{
          width:`${prog*100}%`,
          background:'linear-gradient(90deg,#6c35de,#00d4ff)',
          boxShadow:'0 0 6px rgba(0,212,255,0.7)',
        }}
      />
    </div>
  )
}
