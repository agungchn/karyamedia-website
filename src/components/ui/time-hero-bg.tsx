"use client"

import { useEffect, useState } from "react"
import { LazySparklesCore, LazyRetroGrid } from "@/components/ui/lazy-effects"
import { getTimeTheme } from "@/lib/time-theme"

export function TimeHeroBg() {
  const [theme, setTheme] = useState(() => getTimeTheme())

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(getTimeTheme())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${theme.bgTop} 0%, ${theme.bgMid} 50%, ${theme.bgBottom} 100%)`,
      }}
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
          id="time-hero-sparkles"
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
  )
}
