// FILE: /app/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Cursor from '@/components/ui/Cursor'
import Navbar from '@/components/ui/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Work from '@/components/sections/Work'
import Skills from '@/components/sections/Skills'
import Contact from '@/components/sections/Contact'
import {
  BootSequence,
  EasterEgg,
  AudioToggle,
  Footer,
  ScrollProgress,
} from '@/components/ui/SmallComponents'
import { useLenis } from '@/hooks/useLenis'

export default function Page() {
  const [booted, setBooted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useLenis()

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <>
      <Cursor />
      <EasterEgg />

      {!booted ? (
        <BootSequence onDone={() => setBooted(true)} />
      ) : (
        <>
          <ScrollProgress />
          <Navbar />
          <AudioToggle />
          <main>
            <Hero scrollY={scrollY} />
            <About />
            <Work />
            <Skills />
            <Contact />
            <Footer />
          </main>
        </>
      )}
    </>
  )
}
