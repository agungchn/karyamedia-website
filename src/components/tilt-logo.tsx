"use client"

import { useRef, useState } from "react"
import Image from "next/image"

export function TiltLogo({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const [glare, setGlare] = useState<React.CSSProperties>({ opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMove = (e: React.PointerEvent) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const dx = (x - cx) / cx
    const dy = (y - cy) / cy
    const rotateX = -dy * 12
    const rotateY = dx * 12

    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`,
      transition: "transform 0.15s ease-out",
    })

    setIsHovered(true)

    setGlare({
      opacity: 1,
      background: `conic-gradient(from ${(x / rect.width) * 360}deg at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,0,0,0.65), rgba(255,165,0,0.65), rgba(255,255,0,0.65), rgba(0,255,0,0.65), rgba(0,255,255,0.65), rgba(0,0,255,0.65), rgba(255,0,255,0.65), rgba(255,0,0,0.65))`,
      filter: "blur(2px)",
      mixBlendMode: "screen" as const,
    })
  }

  const handleLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      transition: "transform 0.5s ease-out",
    })
    setGlare({ opacity: 0, transition: "opacity 0.5s ease-out" })
    setIsHovered(false)
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative inline-block"
      style={{ touchAction: "none" }}
    >
      <div
        className={`${
          size === "sm" ? "w-[104px] h-[104px]" :
          size === "md" ? "w-44 h-44" :
          "w-56 h-56 lg:w-64 lg:h-64"
        } relative flex items-center justify-center`}
        style={style}
      >
        <div className="absolute inset-0 pointer-events-none rounded-2xl" style={glare} />
        <Image
          src="/images/logo-karyamedia.png"
          alt="Logo Karyamedia Souvenir"
          fill
          className={`object-contain relative z-10 transition-all duration-300 ${isHovered ? "brightness-0 invert" : ""}`}
          sizes="256px"
        />
      </div>
    </div>
  )
}
