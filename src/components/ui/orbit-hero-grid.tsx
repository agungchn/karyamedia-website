"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

// 7 set gambar — berganti setiap hari
const IMAGE_SETS: { src: string; alt: string }[][] = [
  // Set 0 — Minggu (existing)
  [
    { src: "/images/hero/kalung-rektor-hero.webp", alt: "Kalung Rektor" },
    { src: "/images/hero/medali-hero.webp", alt: "Medali 3D" },
    { src: "/images/hero/patung-wisuda-hero.webp", alt: "Patung Wisuda" },
    { src: "/images/hero/plakat-akrilik-hero.webp", alt: "Plakat Akrilik" },
    { src: "/images/hero/plakat-wayang-hero.webp", alt: "Plakat Wayang" },
  ],
  // Set 1 — Senin (day-1)
  [
    { src: "/images/hero/day-1/medali.webp", alt: "Medali" },
    { src: "/images/hero/day-1/patung-wisuda.webp", alt: "Patung Wisuda" },
    { src: "/images/hero/day-1/plakat-akrilik.webp", alt: "Plakat Akrilik" },
    { src: "/images/hero/day-1/plakat-akrilik-miror.webp", alt: "Plakat Akrilik" },
    { src: "/images/hero/day-1/tongkat-rektor.webp", alt: "Tongkat Rektor" },
  ],
  // Set 2 — Selasa (day-2)
  [
    { src: "/images/hero/day-2/medali.webp", alt: "Medali" },
    { src: "/images/hero/day-2/patung-wisuda.webp", alt: "Patung Wisuda" },
    { src: "/images/hero/day-2/plakat-akrilik.webp", alt: "Plakat Akrilik" },
    { src: "/images/hero/day-2/plakat-wayang.webp", alt: "Plakat Wayang" },
    { src: "/images/hero/day-2/tongkat-rektor-9.webp", alt: "Tongkat Rektor" },
  ],
  // Set 3 — Rabu (day-3)
  [
    { src: "/images/hero/day-3/medali.webp", alt: "Medali" },
    { src: "/images/hero/day-3/patung-wisuda.webp", alt: "Patung Wisuda" },
    { src: "/images/hero/day-3/plakat-akrilik.webp", alt: "Plakat Akrilik" },
    { src: "/images/hero/day-3/souvenir-wayang.webp", alt: "Souvenir Wayang" },
    { src: "/images/hero/day-3/tongkat-rektor-5.webp", alt: "Tongkat Rektor" },
  ],
  // Set 4 — Kamis (day-4)
  [
    { src: "/images/hero/day-4/medali.webp", alt: "Medali" },
    { src: "/images/hero/day-4/patung-wisuda.webp", alt: "Patung Wisuda" },
    { src: "/images/hero/day-4/plakat-akrilik.webp", alt: "Plakat Akrilik" },
    { src: "/images/hero/day-4/plakat-wayang.webp", alt: "Plakat Wayang" },
    { src: "/images/hero/day-4/tongkat-rektor.webp", alt: "Tongkat Rektor" },
  ],
  // Set 5 — Jumat (day-5)
  [
    { src: "/images/hero/day-5/medali.webp", alt: "Medali" },
    { src: "/images/hero/day-5/patung-wisuda.webp", alt: "Patung Wisuda" },
    { src: "/images/hero/day-5/plakat-akrilik.webp", alt: "Plakat Akrilik" },
    { src: "/images/hero/day-5/plakat-wayang.webp", alt: "Plakat Wayang" },
    { src: "/images/hero/day-5/tongkat-rektor.webp", alt: "Tongkat Rektor" },
  ],
  // Set 6 — Sabtu (day-6)
  [
    { src: "/images/hero/day-6/medali.webp", alt: "Medali" },
    { src: "/images/hero/day-6/patung-wisuda.webp", alt: "Patung Wisuda" },
    { src: "/images/hero/day-6/plakat-akrilik.webp", alt: "Plakat Akrilik" },
    { src: "/images/hero/day-6/plakat-wayang.webp", alt: "Plakat Wayang" },
    { src: "/images/hero/day-6/tongkat-rektor.webp", alt: "Tongkat Rektor" },
  ],
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

function getTodaySet(): number {
  // 0=Minggu, 1=Senin, ... 6=Sabtu
  return new Date().getDay()
}

export function OrbitHeroGrid() {
  const setIndex = getTodaySet()
  const IMAGES = IMAGE_SETS[setIndex]

  const [current, setCurrent] = useState([0, 1, 2, 3, 4])
  const [next, setNext] = useState<number[] | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setNext((prev) => {
        if (prev) return prev
        return rotatePositions(current)
      })
    }, 6000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [current])

  useEffect(() => {
    if (!next) return
    const t = setTimeout(() => {
      setCurrent(next)
      setNext(null)
    }, 2000)
    return () => clearTimeout(t)
  }, [next])

  const transitioning = next !== null

  return (
    <div className="relative h-[500px] overflow-hidden">
      <div className="relative z-10 grid h-full" style={GRID_TEMPLATE}>
        {POSITIONS.map((pos, posIdx) => {
          const isMain = posIdx === 0
          const [exitX, exitY, enterX, enterY] = DIRECTIONS[posIdx]
          const currentImg = IMAGES[current[posIdx]]
          const nextImg = next ? IMAGES[next[posIdx]] : null

          return (
            <div
              key={posIdx}
              style={{ gridArea: pos.gridArea }}
              className="relative rounded-2xl overflow-hidden"
            >
              {/* Gambar saat ini (akan keluar) */}
              <motion.div
                key={`current-${currentImg.src}`}
                className="absolute inset-0"
                animate={{
                  x: transitioning ? exitX : "0%",
                  y: transitioning ? exitY : "0%",
                  opacity: transitioning ? 0 : 1,
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <Image
                  src={currentImg.src}
                  alt=""
                  unoptimized
                  width={isMain ? 400 : 200}
                  height={isMain ? 400 : 200}
                  priority={isMain}
                  fetchPriority={isMain ? "high" : undefined}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Gambar berikutnya (akan masuk) */}
              <AnimatePresence>
                {nextImg && (
                  <motion.div
                    key={`next-${nextImg.src}`}
                    className="absolute inset-0"
                    initial={{ x: enterX, y: enterY, opacity: 0 }}
                    animate={{ x: "0%", y: "0%", opacity: 1 }}
                    exit={{ x: "0%", y: "0%", opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  >
                    <Image
                      src={nextImg.src}
                      alt={nextImg.alt}
                      unoptimized
                      width={isMain ? 400 : 200}
                      height={isMain ? 400 : 200}
                      priority={isMain}
                      loading={isMain ? undefined : "lazy"}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
