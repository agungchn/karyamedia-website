"use client"

import { useState, useEffect, useRef } from "react"
import { Building } from "lucide-react"
import { LazySparklesCore, LazyRetroGrid } from "@/components/ui/lazy-effects"
import { getTimeTheme, TimeTheme } from "@/lib/time-theme"

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
    <>
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
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `linear-gradient(to bottom, ${theme.bgTop} 0%, ${theme.bgMid} 50%, ${theme.bgBottom} 100%)` }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[70%] overflow-hidden">
          <LazyRetroGrid
            angle={45}
            cellSize={80}
            opacity={0.18}
            lightLineColor="rgba(255,255,255,0.5)"
            darkLineColor="rgba(255,255,255,0.5)"
            overlayColor="from-transparent"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[40%] overflow-hidden">
          <LazySparklesCore
            id="tentang-kami-sparkles"
            background="transparent"
            minSize={0.5}
            maxSize={1.3}
            particleColor={theme.particleColor}
            particleDensity={70}
            speed={1}
            className="w-full h-full"
          />
        </div>
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
          <div className="relative inline-flex overflow-hidden rounded-full p-[1.5px] mb-6 cursor-default hover:scale-105 transition-transform duration-300">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#D4AF37_0%,#1D4ED8_50%,#D4AF37_100%)]" />
            <div className="inline-flex items-center gap-2 rounded-full bg-primary text-xs font-medium backdrop-blur-3xl">
              <span className="inline-flex items-center gap-2 rounded-full text-center bg-gradient-to-tr from-accent/20 via-primary-light/30 to-transparent text-white border-[1px] border-accent/30 py-2.5 px-6 text-sm font-medium">
                <Building className="w-4 h-4" />
                Tentang Kami
              </span>
            </div>
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
    <div className="w-full h-0.5 shimmer-line" />
    </>
  )
}
