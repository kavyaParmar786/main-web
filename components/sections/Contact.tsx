// FILE: /components/sections/Contact.tsx
'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const channels = [
  { label:'GitHub',   val:'kavyaParmar786', href:'https://github.com/kavyaParmar786',       color:'#fff',     icon:'⌥' },
  { label:'Email',    val:'kavya@example.com', href:'mailto:kavya@example.com',              color:'#00d4ff',  icon:'✉' },
  { label:'LinkedIn', val:'kavyaparmar',    href:'https://linkedin.com/in/kavyaparmar',      color:'#6c35de',  icon:'◈' },
]

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', msg:'' })
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [status, setStatus] = useState<'idle'|'sending'|'done'>('idle')
  const [focused, setFocused] = useState('')
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once:true })

  const validate = () => {
    const e: Record<string,string> = {}
    if (!form.name.trim())            e.name  = 'Required'
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (form.msg.trim().length < 10)  e.msg   = 'Too short (min 10 chars)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setStatus('sending')
    await new Promise(r => setTimeout(r, 2000))
    setStatus('done')
  }

  const inputBase = (field: string) => `
    w-full bg-transparent f-body text-sm text-[var(--text)] outline-none
    placeholder:text-[var(--muted)]/40 py-3 px-4 border transition-all duration-200
    ${errors[field]
      ? 'border-red-500/50'
      : focused === field
        ? 'border-cyan-400/50 shadow-[0_0_12px_rgba(0,212,255,0.06)]'
        : 'border-white/6 hover:border-white/12'
    }
  `.trim().replace(/\s+/g,' ')

  return (
    <section id="contact" ref={ref} className="py-32">
      <div className="container">
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={inView?{ opacity:1, y:0 }:{}}
          className="mb-16"
        >
          <div className="sec-label"><span>04 / Contact</span></div>
          <h2 className="f-display font-black text-white leading-none"
            style={{ fontSize:'clamp(2.5rem,6vw,5.5rem)' }}
          >
            LET'S<br />
            <span className="grad-text">TALK.</span>
          </h2>
          <p className="f-body text-[var(--muted)] mt-4 max-w-md leading-relaxed">
            Got a project, collab, or interesting problem? Transmit below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity:0, x:-30 }}
            animate={inView?{ opacity:1, x:0 }:{}}
            transition={{ delay:0.15 }}
          >
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="done"
                  initial={{ opacity:0, scale:0.95 }}
                  animate={{ opacity:1, scale:1 }}
                  className="glass p-10 flex flex-col items-center justify-center gap-5 text-center"
                  style={{ minHeight:360 }}
                >
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                    transition={{ type:'spring', bounce:0.5, delay:0.1 }}
                    className="text-5xl"
                  >✅</motion.div>
                  <div className="f-display text-lg font-bold text-cyan-400 tracking-widest">SIGNAL RECEIVED</div>
                  <p className="f-body text-sm text-[var(--muted)]">I'll respond within 24 hours.</p>
                  <button onClick={()=>{setStatus('idle');setForm({name:'',email:'',msg:''})}}
                    className="f-mono text-[10px] tracking-widest text-cyan-400/60 hover:text-cyan-400 border border-cyan-400/20 hover:border-cyan-400/50 px-4 py-2 transition-colors"
                    data-cursor
                  >SEND ANOTHER →</button>
                </motion.div>
              ) : (
                <motion.div key="form" className="glass p-8 space-y-4">
                  {/* Terminal bar */}
                  <div className="flex items-center gap-1.5 pb-4 border-b border-white/5">
                    {['bg-red-500/50','bg-yellow-500/50','bg-green-500/50'].map(c=>(
                      <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                    ))}
                    <span className="ml-2 f-mono text-[9px] text-[var(--muted)] tracking-widest">TRANSMISSION_TERMINAL</span>
                  </div>

                  {/* Name */}
                  <div>
                    <div className="f-mono text-[9px] tracking-widest text-[var(--muted)]/50 mb-1.5">&gt; SENDER_ID</div>
                    <input value={form.name} onChange={e=>{ setForm(f=>({...f,name:e.target.value})); setErrors(er=>({...er,name:''})) }}
                      onFocus={()=>setFocused('name')} onBlur={()=>setFocused('')}
                      placeholder="Your name" className={inputBase('name')} />
                    {errors.name && <p className="f-mono text-[9px] text-red-400/70 mt-1">✗ {errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <div className="f-mono text-[9px] tracking-widest text-[var(--muted)]/50 mb-1.5">&gt; RETURN ADDRESS</div>
                    <input type="email" value={form.email} onChange={e=>{ setForm(f=>({...f,email:e.target.value})); setErrors(er=>({...er,email:''})) }}
                      onFocus={()=>setFocused('email')} onBlur={()=>setFocused('')}
                      placeholder="your@email.com" className={inputBase('email')} />
                    {errors.email && <p className="f-mono text-[9px] text-red-400/70 mt-1">✗ {errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex justify-between f-mono text-[9px] tracking-widest text-[var(--muted)]/50 mb-1.5">
                      <span>&gt; PAYLOAD</span>
                      <span className={form.msg.length > 10 ? 'text-green-400/60' : ''}>{form.msg.length}/500</span>
                    </div>
                    <textarea rows={4} maxLength={500} value={form.msg}
                      onChange={e=>{ setForm(f=>({...f,msg:e.target.value})); setErrors(er=>({...er,msg:''})) }}
                      onFocus={()=>setFocused('msg')} onBlur={()=>setFocused('')}
                      placeholder="What's on your mind?" className={`${inputBase('msg')} resize-none`}
                    />
                    {errors.msg && <p className="f-mono text-[9px] text-red-400/70 mt-1">✗ {errors.msg}</p>}
                  </div>

                  <button onClick={submit} disabled={status==='sending'} className="btn-primary w-full justify-center" data-cursor>
                    <span>
                      {status==='sending' ? (
                        <span className="flex items-center gap-2">
                          {[0,1,2].map(i=>(
                            <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] block"
                              animate={{ y:[0,-5,0] }} transition={{ duration:0.5, repeat:Infinity, delay:i*0.12 }}
                            />
                          ))}
                          Transmitting...
                        </span>
                      ) : 'Send Message'}
                    </span>
                    {status==='idle' && <span>→</span>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right panel */}
          <motion.div
            initial={{ opacity:0, x:30 }}
            animate={inView?{ opacity:1, x:0 }:{}}
            transition={{ delay:0.25 }}
            className="space-y-4"
          >
            {/* Status */}
            <div className="glass p-6">
              <div className="f-mono text-[9px] tracking-widest text-[var(--muted)] mb-5">SYS_INFO</div>
              {[
                ['LOCATION',      'Rajkot, Gujarat, India'],
                ['STATUS',        'OPEN_TO_COLLAB'],
                ['RESPONSE',      '< 24 hours'],
                ['TIMEZONE',      'IST — UTC+5:30'],
              ].map(([k,v])=>(
                <div key={k} className="flex justify-between f-mono text-[11px] mb-3">
                  <span className="text-[var(--muted)]">{k}</span>
                  <span className={k==='STATUS'?'text-[var(--green)] flex items-center gap-1.5':'text-[var(--text)]'}>
                    {k==='STATUS'&&<span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" style={{animation:'pulse-dot 2s infinite'}} />}
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Channels */}
            {channels.map((ch,i)=>(
              <motion.a key={ch.label} href={ch.href}
                target={ch.href.startsWith('http')?'_blank':undefined}
                rel="noopener noreferrer"
                initial={{ opacity:0, x:20 }}
                animate={inView?{ opacity:1, x:0 }:{}}
                transition={{ delay:0.4+i*0.08 }}
                className="glass flex items-center justify-between px-5 py-4 group transition-all duration-300 hover:border-opacity-30"
                style={{ borderColor:`${ch.color}15` }}
                data-cursor
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border flex items-center justify-center"
                    style={{ borderColor:`${ch.color}40`, background:`${ch.color}08` }}
                  >
                    <span style={{ color:ch.color }} className="text-sm">{ch.icon}</span>
                  </div>
                  <div>
                    <div className="f-mono text-[9px] tracking-widest mb-0.5" style={{ color:ch.color }}>{ch.label}</div>
                    <div className="f-body text-sm text-[var(--text)]/70 group-hover:text-[var(--text)] transition-colors">{ch.val}</div>
                  </div>
                </div>
                <span className="f-mono text-sm text-[var(--muted)] group-hover:text-[var(--cyan)] transition-colors">→</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
