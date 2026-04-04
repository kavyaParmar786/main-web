// FILE: /components/sections/Skills.tsx
'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const groups = [
  { key: 'GAME DEV',      color:'#00d4ff', icon:'🎮',
    skills:[{n:'Godot 4',v:88},{n:'GDScript',v:85},{n:'3D Design',v:82},{n:'Game Physics',v:78},{n:'Shaders',v:65}] },
  { key: 'AI & AUTO',     color:'#6c35de', icon:'🤖',
    skills:[{n:'Python',v:86},{n:'Streamlit',v:90},{n:'AI Pipelines',v:78},{n:'Data Extract',v:85},{n:'Glide',v:80}] },
  { key: 'WEB DEV',       color:'#23f080', icon:'🌐',
    skills:[{n:'Next.js',v:82},{n:'React',v:84},{n:'TypeScript',v:75},{n:'Tailwind',v:88},{n:'Three.js',v:70}] },
  { key: 'CREATIVE',      color:'#f0a500', icon:'✨',
    skills:[{n:'UI/UX',v:80},{n:'Game Design',v:87},{n:'Curriculum',v:82},{n:'Prototyping',v:85},{n:'Systems',v:90}] },
]

function Radar({ group, animate }: { group: typeof groups[0]; animate: boolean }) {
  const size = 200, cx = 100, cy = 100, r = 75
  const n = group.skills.length
  const angles = group.skills.map((_, i) => (i * 2 * Math.PI / n) - Math.PI / 2)

  const poly = (scale = 1) => angles.map((a, i) => {
    const v = animate ? (group.skills[i].v / 100) * scale : 0
    return `${cx + Math.cos(a) * r * v},${cy + Math.sin(a) * r * v}`
  }).join(' ')

  const gridPoly = (frac: number) => angles.map(a =>
    `${cx + Math.cos(a) * r * frac},${cy + Math.sin(a) * r * frac}`
  ).join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25,0.5,0.75,1].map(f => (
        <polygon key={f} points={gridPoly(f)} fill="none"
          stroke={group.color} strokeWidth={0.5} opacity={0.12} />
      ))}
      {angles.map((a,i) => (
        <line key={i} x1={cx} y1={cy}
          x2={cx+Math.cos(a)*r} y2={cy+Math.sin(a)*r}
          stroke={group.color} strokeWidth={0.5} opacity={0.15}
        />
      ))}
      <motion.polygon
        points={poly()}
        fill={group.color} fillOpacity={0.1}
        stroke={group.color} strokeWidth={1.5} strokeOpacity={0.8}
        initial={{ opacity:0 }}
        animate={animate ? { opacity:1 } : { opacity:0 }}
        transition={{ duration:1, ease:[0.16,1,0.3,1] }}
        style={{ filter:`drop-shadow(0 0 5px ${group.color}50)` }}
      />
      {angles.map((a,i) => {
        const v = group.skills[i].v / 100
        const x = cx + Math.cos(a)*r*v
        const y = cy + Math.sin(a)*r*v
        return (
          <motion.circle key={i} cx={x} cy={y} r={3} fill={group.color}
            initial={{ scale:0 }} animate={animate?{scale:1}:{scale:0}}
            transition={{ delay:0.8+i*0.07, type:'spring', bounce:0.5 }}
            style={{ filter:`drop-shadow(0 0 4px ${group.color})`, transformOrigin:`${x}px ${y}px` }}
          />
        )
      })}
      {angles.map((a,i)=>{
        const lx = cx+Math.cos(a)*(r+16)
        const ly = cy+Math.sin(a)*(r+16)
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize={8} fill={group.color} fillOpacity={0.6}
            fontFamily="Space Mono, monospace"
          >{group.skills[i].n.split(' ')[0]}</text>
        )
      })}
    </svg>
  )
}

function Bar({ name, val, color, delay }: { name:string; val:number; color:string; delay:number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once:true })
  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between f-mono text-[10px] mb-1.5">
        <span className="text-[var(--text)] opacity-70">{name}</span>
        <span style={{ color }}>{val}%</span>
      </div>
      <div className="h-px bg-white/5 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width:0 }}
          animate={inView?{ width:`${val}%` }:{}}
          transition={{ delay:delay+0.2, duration:1.1, ease:[0.16,1,0.3,1] }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ background:`linear-gradient(90deg,${color}60,${color})` }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0"
            animate={{ x:['-100%','200%'] }}
            transition={{ delay:delay+1.4, duration:1, repeat:Infinity, repeatDelay:4 }}
            style={{ background:`linear-gradient(90deg,transparent,${color}80,transparent)` }}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{ background:color, boxShadow:`0 0 6px ${color}` }}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default function Skills() {
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })

  useEffect(() => { if (inView) setShown(true) }, [inView])

  const g = groups[active]

  return (
    <section id="skills" className="py-32 bg-[var(--deep)]">
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={inView?{ opacity:1, y:0 }:{}}
          className="mb-16"
        >
          <div className="sec-label"><span>03 / Skills</span></div>
          <h2 className="f-display font-black text-white leading-none"
            style={{ fontSize:'clamp(2.5rem,6vw,5.5rem)' }}
          >
            MY ARSENAL<span className="text-cyan-400">.</span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {groups.map((gr,i)=>(
            <button key={gr.key} onClick={()=>setActive(i)} data-cursor
              className="f-mono text-[10px] tracking-widest px-4 py-2.5 border transition-all duration-250 relative"
              style={{
                borderColor: active===i ? `${gr.color}60` : 'rgba(255,255,255,0.08)',
                color: active===i ? gr.color : 'var(--muted)',
                background: active===i ? `${gr.color}10` : 'transparent',
              }}
            >
              {gr.icon} {gr.key}
              {active===i && (
                <motion.div layoutId="skill-tab"
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background:gr.color }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            {/* Radar */}
            <div className="flex justify-center">
              <div className="glass p-8" style={{ borderColor:`${g.color}18` }}>
                <div className="f-mono text-[9px] tracking-widest text-[var(--muted)] mb-5 text-center">
                  SKILL RADAR — {g.key}
                </div>
                <Radar group={g} animate={shown} />
              </div>
            </div>
            {/* Bars */}
            <div className="glass p-8" style={{ borderColor:`${g.color}18` }}>
              <div className="f-mono text-[9px] tracking-widest text-[var(--muted)] mb-5">
                PROFICIENCY MATRIX
              </div>
              {g.skills.map((s,i)=>(
                <Bar key={s.n} name={s.n} val={s.v} color={g.color} delay={i*0.07} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
