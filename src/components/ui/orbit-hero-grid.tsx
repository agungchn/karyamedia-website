"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const IMAGES = [
  { src: "/images/hero/kalung-rektor-hero.webp", alt: "Kalung Rektor" },
  { src: "/images/hero/medali-hero.webp", alt: "Medali 3D" },
  { src: "/images/hero/patung-wisuda-hero.webp", alt: "Patung Wisuda" },
  { src: "/images/hero/plakat-akrilik-hero.webp", alt: "Plakat Akrilik" },
  { src: "/images/hero/plakat-wayang-hero.webp", alt: "Plakat Wayang" },
]

const POSITIONS = [
  { gridArea: "main" },
  { gridArea: "top" },
  { gridArea: "mid" },
  { gridArea: "btm1" },
  { gridArea: "btm2" },
]

const GRID_TEMPLATE = {
  gridTemplateColumns: "6fr 2fr 2fr",
  gridTemplateRows: "1fr 1fr 1fr",
  gap: "12px",
  gridTemplateAreas: `
    "main top top"
    "main mid mid"
    "main btm1 btm2"
  `,
}

// Arah slide: [exitX, exitY, enterX, enterY]
const DIRECTIONS = [
  ["-100%", "0", "-100%", "0"],   // main
  ["0", "100%", "0", "-100%"],     // top
  ["0", "100%", "0", "-100%"],     // mid
  ["100%", "0", "100%", "0"],      // btm1
  ["100%", "0", "100%", "0"],      // btm2
]

function rotatePositions(prev: number[]) {
  const last = prev[prev.length - 1]
  return [last, ...prev.slice(0, -1)]
}

export function OrbitHeroGrid() {
  const [positions, setPositions] = useState([0, 1, 2, 3, 4])
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const rotate = useRef(() => {
    setPositions((prev) => {
      setTransitioning(true)
      return rotatePositions(prev)
    })
  }).current

  useEffect(() => {
    timerRef.current = setInterval(rotate, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [rotate])

  useEffect(() => {
    if (!transitioning) return
    const t = setTimeout(() => setTransitioning(false), 2000)
    return () => clearTimeout(t)
  }, [transitioning])

  return (
    <div className="relative h-[500px] overflow-hidden">
      <div className="relative z-10 grid h-full" style={GRID_TEMPLATE}>
        {POSITIONS.map((pos, posIdx) => {
          const [exitX, exitY, enterX, enterY] = DIRECTIONS[posIdx]
          const img = IMAGES[positions[posIdx]]
          const isMain = posIdx === 0

          return (
            <div
              key={posIdx}
              style={{ gridArea: pos.gridArea }}
              className="relative rounded-2xl overflow-hidden"
            >
              <AnimatePresence>
                <motion.div
                  key={`img-${positions[posIdx]}`}
                  className="absolute inset-0"
                  initial={{ x: enterX, y: enterY, opacity: 0 }}
                  animate={{ x: "0%", y: "0%", opacity: 1 }}
                  exit={{
                    x: transitioning ? exitX : "0%",
                    y: transitioning ? exitY : "0%",
                    opacity: transitioning ? 0 : 1,
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={isMain ? 400 : 200}
                    height={isMain ? 400 : 200}
                    priority
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
