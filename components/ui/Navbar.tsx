// FILE: /components/ui/Navbar.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'About',    href: '#about' },
  { label: 'Work',     href: '#work' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Contact',  href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16,1,0.3,1] }}
        className={`fixed top-0 left-0 right-0 z-[900] transition-all duration-500 ${
          scrolled ? 'backdrop-blur-md border-b border-white/5 bg-black/60' : ''
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })} className="group flex items-center gap-3" data-cursor>
            <div className="w-8 h-8 border border-cyan-400/50 flex items-center justify-center relative"
              style={{ clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
            >
              <span className="f-display text-xs font-bold text-cyan-400">KP</span>
              <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="f-display text-[11px] font-bold tracking-[0.3em] text-cyan-400 hidden sm:block">KAVYA PARMAR</span>
          </button>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <button key={l.href} onClick={() => go(l.href)} data-cursor
                className="f-mono text-[11px] tracking-widest text-[var(--muted)] hover:text-[var(--cyan)] transition-colors duration-200 relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <button onClick={() => go('#contact')} data-cursor className="btn-primary">
              <span>Hire me</span>
            </button>
          </nav>

          {/* Mobile burger */}
          <button onClick={() => setOpen(o => !o)} className="md:hidden flex flex-col gap-1.5 p-2" data-cursor>
            <span className={`block w-6 h-px bg-cyan-400 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-4 h-px bg-[var(--muted)] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-cyan-400 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
            className="fixed inset-0 z-[800] bg-[var(--black)] flex flex-col items-center justify-center gap-10"
          >
            {links.map((l,i) => (
              <motion.button
                key={l.href}
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.07 }}
                onClick={() => go(l.href)}
                className="f-display text-3xl font-bold text-white hover:text-cyan-400 transition-colors"
                data-cursor
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
