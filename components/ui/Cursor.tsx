// FILE: /components/ui/Cursor.tsx
// Pure DOM cursor — zero React renders after mount
'use client'
import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const dot  = document.getElementById('kp-cursor-dot')
    const ring = document.getElementById('kp-cursor-ring')
    if (!dot || !ring) return

    let mx = -100, my = -100
    let rx = -100, ry = -100
    let raf: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const tick = () => {
      // Dot: instant
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
      // Ring: lerp
      rx += (mx - rx) * 0.11
      ry += (my - ry) * 0.11
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(tick)
    }

    const grow = () => {
      ring.style.width  = '56px'
      ring.style.height = '56px'
      ring.style.borderColor = 'rgba(0,212,255,0.8)'
      ring.style.background  = 'rgba(0,212,255,0.04)'
    }
    const shrink = () => {
      ring.style.width  = '36px'
      ring.style.height = '36px'
      ring.style.borderColor = 'rgba(0,212,255,0.4)'
      ring.style.background  = 'transparent'
    }
    const press = () => {
      ring.style.width  = '20px'
      ring.style.height = '20px'
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mousedown', press)
    document.addEventListener('mouseup', shrink)

    // Attach to interactive elements
    const attach = () => {
      document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
    }
    attach()
    const obs = new MutationObserver(attach)
    obs.observe(document.body, { childList: true, subtree: true })

    raf = requestAnimationFrame(tick)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', press)
      document.removeEventListener('mouseup', shrink)
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <div
        id="kp-cursor-dot"
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 99999,
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--cyan)', pointerEvents: 'none',
          transition: 'width .15s, height .15s',
        }}
      />
      <div
        id="kp-cursor-ring"
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 99998,
          width: 36, height: 36, borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.4)',
          pointerEvents: 'none',
          transition: 'width .3s, height .3s, border-color .3s, background .3s',
        }}
      />
    </>
  )
}
