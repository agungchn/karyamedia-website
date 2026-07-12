"use client"

import { useRef, useState } from "react"

export function StepCircle({ step, isLast }: { step: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [glare, setGlare] = useState<React.CSSProperties>({})

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const gx = ((e.clientX - rect.left) / rect.width) * 100
    const gy = ((e.clientY - rect.top) / rect.height) * 100
    const cx = rect.width / 2
    const cy = rect.height / 2
    const dx = (e.clientX - rect.left - cx) / cx
    const dy = (e.clientY - rect.top - cy) / cy
    el.style.transform = `perspective(900px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`
    setGlare({
      background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(212,175,55,0.5), rgba(212,175,55,0) 60%)`,
    })
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)"
    setGlare({})
  }

  return (
    <div className="flex flex-col items-center shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-0 z-10">
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:bg-accent transition-colors relative overflow-hidden cursor-pointer"
        style={{ touchAction: "none", transition: "transform 0.15s ease-out" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={glare} />
        <span className="text-white font-bold relative z-10">{step}</span>
      </div>
      {!isLast && <div className="w-0.5 h-16 bg-gray-200 md:hidden" />}
    </div>
  )
}
