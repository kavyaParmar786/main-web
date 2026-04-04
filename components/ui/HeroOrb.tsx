// FILE: /components/ui/HeroOrb.tsx
// Lightweight single-mesh orb — no postprocessing, no heavy imports
// Falls back to CSS animation on mobile / low-end devices
'use client'
import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

function Orb() {
  const mesh = useRef<THREE.Mesh>(null)
  const mat  = useRef<any>(null)
  const { mouse } = useThree()

  useFrame(({ clock }) => {
    if (!mesh.current) return
    // Gentle mouse follow — lerp only, no heavy compute
    mesh.current.rotation.x += (mouse.y * 0.2 - mesh.current.rotation.x) * 0.04
    mesh.current.rotation.y += (mouse.x * 0.3 - mesh.current.rotation.y) * 0.04
    if (mat.current) mat.current.distort = 0.3 + Math.sin(clock.elapsedTime * 0.5) * 0.08
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.4, 4]} />
        <MeshDistortMaterial
          ref={mat}
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.25}
          distort={0.3}
          speed={1.5}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Inner wireframe for depth */}
      <mesh scale={0.72}>
        <icosahedronGeometry args={[1.4, 2]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.1} wireframe />
      </mesh>
    </Float>
  )
}

// Rings — separate component, very cheap
function Rings() {
  const r1 = useRef<THREE.Mesh>(null)
  const r2 = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (r1.current) r1.current.rotation.y = clock.elapsedTime * 0.4
    if (r2.current) { r2.current.rotation.y = -clock.elapsedTime * 0.25; r2.current.rotation.x = Math.PI / 4 }
  })
  return (
    <>
      <mesh ref={r1} rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[2.2, 0.006, 8, 80]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[2.8, 0.004, 8, 80]} />
        <meshBasicMaterial color="#6c35de" transparent opacity={0.4} />
      </mesh>
    </>
  )
}

// CSS fallback for mobile / low-end
function CSSOrb() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 rounded-full border border-cyan-400/20"
          style={{ animation: 'spin-slow 12s linear infinite' }}
        />
        <div className="absolute inset-4 rounded-full border border-purple-500/20"
          style={{ animation: 'spin-slow 8s linear infinite reverse' }}
        />
        <div className="absolute inset-12 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.3), rgba(108,53,222,0.2), transparent)',
            animation: 'glow-pulse 3s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  )
}

export default function HeroOrb() {
  return (
    <div className="absolute inset-0" style={{ zIndex: 1 }}>
      {/* Desktop: lightweight WebGL */}
      <div className="hidden md:block w-full h-full">
        <Suspense fallback={<CSSOrb />}>
          <Canvas
            camera={{ position: [0,0,4.5], fov: 55 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
            dpr={[1, 1.2]}
            performance={{ min: 0.5 }}
          >
            <ambientLight intensity={0.2} />
            <pointLight position={[4,4,4]}  intensity={2}   color="#00d4ff" />
            <pointLight position={[-4,-3,-4]} intensity={1.2} color="#6c35de" />
            <Orb />
            <Rings />
          </Canvas>
        </Suspense>
      </div>
      {/* Mobile: pure CSS */}
      <div className="md:hidden w-full h-full">
        <CSSOrb />
      </div>
    </div>
  )
}
