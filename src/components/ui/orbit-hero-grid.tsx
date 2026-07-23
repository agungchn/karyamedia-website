"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"

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

const DIRECTIONS: [string, string, string, string][] = [
  ["-100%", "0", "-100%", "0"],
  ["0", "100%", "0", "-100%"],
  ["0", "100%", "0", "-100%"],
  ["100%", "0", "100%", "0"],
  ["100%", "0", "100%", "0"],
]

function rotatePositions(prev: number[]) {
  const last = prev[prev.length - 1]
  return [last, ...prev.slice(0, -1)]
}

const DURATION = 1
const TOTAL_CYCLE = 6000

export function OrbitHeroGrid() {
  const [occupants, setOccupants] = useState([0, 1, 2, 3, 4])
  const [animOut, setAnimOut] = useState(false)
  const [animIn, setAnimIn] = useState(false)
  const positions = useRef([0, 1, 2, 3, 4])

  const rotate = useCallback(() => {
    positions.current = rotatePositions(positions.current)
    setAnimOut(true)
  }, [])

  useEffect(() => {
    const timer = setInterval(rotate, TOTAL_CYCLE)
    return () => clearInterval(timer)
  }, [rotate])

  useEffect(() => {
    if (!animOut) return
    const t1 = setTimeout(() => {
      setAnimOut(false)
      setOccupants(positions.current)
      setAnimIn(true)
    }, DURATION * 1000)
    const t2 = setTimeout(() => setAnimIn(false), (DURATION + DURATION) * 1000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [animOut])

  return (
    <div className="relative h-[500px] overflow-hidden">
      <div className="relative z-10 grid h-full" style={GRID_TEMPLATE}>
        {POSITIONS.map((pos, posIdx) => {
          const isMain = posIdx === 0
          const [exitX, exitY, enterX, enterY] = DIRECTIONS[posIdx]
          const img = IMAGES[occupants[posIdx]]

          return (
            <div
              key={posIdx}
              style={{ gridArea: pos.gridArea }}
              className="relative rounded-2xl overflow-hidden"
            >
              {animOut && (
                <motion.div
                  key={`out-${occupants[posIdx]}`}
                  className="absolute inset-0"
                  initial={{ x: "0%", y: "0%", opacity: 1 }}
                  animate={{ x: exitX, y: exitY, opacity: 0 }}
                  transition={{ duration: DURATION, ease: "easeInOut" }}
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
              )}
              {!animOut && (
                <motion.div
                  key={`in-${occupants[posIdx]}`}
                  className="absolute inset-0"
                  initial={animIn ? { x: enterX, y: enterY, opacity: 0 } : undefined}
                  animate={{ x: "0%", y: "0%", opacity: 1 }}
                  transition={animIn ? { duration: DURATION, ease: "easeInOut" } : { duration: 0 }}
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
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
