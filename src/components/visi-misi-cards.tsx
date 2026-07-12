"use client"

import { useRef } from "react"
import { Eye, Target, Heart } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Eye, Target, Heart,
}

interface VisiMisiItem {
  icon: string
  title: string
  desc: string
}

interface VisiMisiCardsProps {
  items: VisiMisiItem[]
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateY(-4px)`

    const gx = ((e.clientX - rect.left) / rect.width) * 100
    const gy = ((e.clientY - rect.top) / rect.height) * 100
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(212,175,55,0.45), rgba(212,175,55,0) 50%)`
    }
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)"
    if (glareRef.current) {
      glareRef.current.style.background = "none"
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      <div
        ref={glareRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
        style={{ background: "none" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function VisiMisiCards({ items }: VisiMisiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {items.map((item, i) => {
        const Icon = iconMap[item.icon] || Eye
        return (
          <TiltCard key={i} className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
          </TiltCard>
        )
      })}
    </div>
  )
}
