"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface RuixenCardProps {
  title?: string
  subtitle?: string
  image?: string
  badge?: {
    text: string
    variant: "pink" | "indigo" | "orange"
  }
  href?: string
  id?: string
}

const badgeColors = {
  pink: "bg-pink-600 text-white",
  indigo: "bg-indigo-600 text-white",
  orange: "bg-orange-500 text-white",
}

export default function RuixenCarouselWave({ cards }: { cards: RuixenCardProps[] }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = cards.length

  const shift = (direction: "next" | "prev") => {
    setCurrentIndex((i) =>
      direction === "next" ? (i + 1) % total : (i - 1 + total) % total
    )
  }

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return

      let position = i - currentIndex
      if (position < -Math.floor(total / 2)) position += total
      else if (position > Math.floor(total / 2)) position -= total

      const x = position * 320
      const y = position === 0 ? 20 : 0
      const scale = position === 0 ? 1.03 : 0.95

      if (Math.abs(position) > 2) {
        gsap.set(card, { x, y, scale })
      } else {
        gsap.to(card, {
          x,
          y,
          scale,
          duration: 0.7,
          ease: "power3.out",
        })
      }
    })
  }, [currentIndex, total])

  useEffect(() => {
    if (paused || total <= 1) return
    const id = setInterval(() => shift("next"), 2800)
    return () => clearInterval(id)
  }, [paused, total])

  if (!total) return null

  return (
    <div
      className="h-full w-full relative px-6 py-12 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex items-center justify-center h-[400px]">
        {cards.map((card, index) => (
          <div
            key={card.id ?? index}
            ref={(el) => {
              cardRefs.current[index] = el
            }}
            className="absolute transition-transform"
          >
            <div className="flex flex-col group">
              <Link
                href={card.href ?? "#"}
                className="relative block overflow-hidden rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-tr from-white/50 to-zinc-100 dark:from-zinc-900/40 dark:to-zinc-800/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-[300px] w-[260px]">
                  <Image
                    src={card.image ?? ""}
                    alt={card.title ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {card.badge && (
                  <div className="absolute top-4 -left-10 transform -rotate-45">
                    <div
                      className={cn(
                        "px-3 py-0.5 text-xs font-bold shadow-md",
                        badgeColors[card.badge.variant]
                      )}
                    >
                      {card.badge.text}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 group-hover:scale-[1.01] group-hover:translate-y-[-4px] transform transition-all duration-300 ease-out bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/10 dark:border-zinc-700">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                      {card.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-snug">
                      {card.subtitle}
                    </p>
                    <div className="flex justify-end mt-2">
                      <div className="group relative w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100/70 dark:bg-zinc-800/60 transition-all duration-300 hover:scale-110 hover:shadow-md">
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 dark:text-white transition-transform duration-300 group-hover:rotate-45" />
                        <div className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 right-6 flex gap-2">
        <button
          onClick={() => shift("prev")}
          className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:scale-110 transition"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-700 dark:text-white" />
        </button>
        <button
          onClick={() => shift("next")}
          className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:scale-110 transition"
        >
          <ChevronRight className="w-5 h-5 text-zinc-700 dark:text-white" />
        </button>
      </div>
    </div>
  )
}
