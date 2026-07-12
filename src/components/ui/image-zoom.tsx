"use client"

import { useRef, useState } from "react"
import Image from "next/image"

interface ImageZoomProps {
  src: string
  alt: string
}

export function ImageZoom({ src, alt }: ImageZoomProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [origin, setOrigin] = useState("50% 50%")
  const [zoomed, setZoomed] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setOrigin(`${x}% ${y}%`)
    setZoomed(true)
  }

  const handleMouseLeave = () => {
    setZoomed(false)
    setOrigin("50% 50%")
  }

  return (
    <div
      ref={ref}
      className="w-full h-full relative overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-200"
        style={{
          transform: zoomed ? "scale(2.5)" : "scale(1)",
          transformOrigin: origin,
        }}
      />
    </div>
  )
}
