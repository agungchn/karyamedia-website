"use client"

import { useState, useEffect, useRef } from "react"
import { Building } from "lucide-react"
import { SparklesCore } from "@/components/ui/sparkles-core"

type TimeTheme = {
  bg: string
  particleColor: string
  badge: string
  desc: string
  glowFrom: string
  glowVia: string
  headingFrom: string
  headingTo: string
  panel: string
}

function getTimeTheme(): TimeTheme {
  const h = new Date().getHours()
  if (h >= 6 && h < 10) {
    return {
      bg: "#C2DAEE",
      particleColor: "#FFFFFF",
      badge: "bg-black/10 text-gray-800",
      desc: "text-gray-800",
      glowFrom: "#FFFFFF",
      glowVia: "#C2DAEE",
      headingFrom: "#0B1F3A",
      headingTo: "#2563EB",
      panel: "bg-white/55 backdrop-blur-md",
    }
  }
  if (h >= 10 && h < 14) {
    return {
      bg: "#A9CDE8",
      particleColor: "#FFFFFF",
      badge: "bg-black/10 text-gray-800",
      desc: "text-gray-700",
      glowFrom: "#FFFFFF",
      glowVia: "#A9CDE8",
      headingFrom: "#0B1F3A",
      headingTo: "#1D4ED8",
      panel: "bg-white/50 backdrop-blur-md",
    }
  }
  if (h >= 14 && h < 18) {
    return {
      bg: "#EFA368",
      particleColor: "#FFF1CF",
      badge: "bg-black/10 text-red-950",
      desc: "text-red-950",
      glowFrom: "#7C2D12",
      glowVia: "#EFA368",
      headingFrom: "#7C2D12",
      headingTo: "#9A3412",
      panel: "bg-white/50 backdrop-blur-md",
    }
  }
  if (h >= 18 && h < 19) {
    return {
      bg: "#6B6BA0",
      particleColor: "#FFE6A8",
      badge: "bg-white/20 text-white",
      desc: "text-purple-50",
      glowFrom: "#FFE6A8",
      glowVia: "#6B6BA0",
      headingFrom: "#FFD700",
      headingTo: "#FFFFFF",
      panel: "bg-[#1E1B4B]/45 backdrop-blur-md",
    }
  }
  return {
    bg: "#0B1B3A",
    particleColor: "#D4AF37",
    badge: "bg-white/10 text-white/80",
    desc: "text-blue-100",
    glowFrom: "#FFD700",
    glowVia: "#C9D6FF",
    headingFrom: "#FFD700",
    headingTo: "#FFFFFF",
    panel: "bg-black/55 backdrop-blur-md",
  }
}

export function TentangKamiBanner() {
  const [theme, setTheme] = useState<TimeTheme>(getTimeTheme())
  const panelRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(getTimeTheme())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateY(-4px)`

    const gx = ((e.clientX - rect.left) / rect.width) * 100
    const gy = ((e.clientY - rect.top) / rect.height) * 100
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.45), rgba(255,255,255,0) 45%)`
    }
  }

  const handleMouseLeave = () => {
    const el = panelRef.current
    if (!el) return
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)"
    if (glareRef.current) {
      glareRef.current.style.background = "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.25), rgba(255,255,255,0) 55%)"
    }
  }

  return (
    <section className="relative overflow-hidden py-20">
      <style>{`
        .shimmer-line {
          background: linear-gradient(90deg, #B8860B 0%, #D4AF37 20%, #FFE9A8 45%, #FFFFFF 50%, #FFE9A8 55%, #D4AF37 80%, #B8860B 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div className="absolute inset-0" style={{ backgroundColor: theme.bg }}>
        <SparklesCore
          id="tentang-kami-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.8}
          particleColor={theme.particleColor}
          particleDensity={100}
          speed={3}
          className="w-full h-full"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          ref={panelRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative inline-block ${theme.panel} rounded-3xl px-6 py-8 sm:px-10 sm:py-10 border border-white/10 transition-transform duration-200 ease-out will-change-transform`}
        >
          <div
            ref={glareRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 rounded-3xl"
            style={{ background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.25), rgba(255,255,255,0) 55%)" }}
          />
          <div className="relative z-10">
          <div className={`inline-flex items-center gap-2 ${theme.badge} px-5 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-md border border-white/10 shadow-lg hover:scale-105 hover:shadow-xl hover:border-white/30 transition-all duration-300 cursor-default`}>
            <Building className="w-4 h-4" />
            Tentang Kami
          </div>
          <h1
            className="heading-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r mb-4"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.headingFrom}, ${theme.headingTo})`,
            }}
          >
            Mengenal Lebih Dekat<br />Karyamedia Souvenir
          </h1>
          <div className="flex justify-center mb-6">
            <div
              className="w-full max-w-lg h-0.5 rounded-full shimmer-line"
            />
          </div>
          <p className={`${theme.desc} max-w-2xl mx-auto font-medium`}>
            Produsen souvenir custom berpengalaman sejak 2001, berbadan hukum, berbasis di Yogyakarta
          </p>
          </div>
        </div>
      </div>
    </section>
  )
}
