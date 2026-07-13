"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import Image from "next/image"
import Link from "next/link"

interface Item {
  slug: string
  title: string
  description: string
  image: string
  category: string
}

const badgePalette = [
  "bg-accent text-white",
  "bg-primary text-white",
  "bg-primary-light text-white",
]

export function LatestArticlesSlider({ articles }: { articles: Item[] }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = articles.length

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

      const x = position * 280
      const y = position === 0 ? 24 : 0
      const scale = position === 0 ? 1.04 : 0.92
      const zIndex = total - Math.abs(position)

      if (Math.abs(position) > 2) {
        gsap.set(card, { x, y, scale, zIndex, opacity: 0 })
      } else {
        gsap.to(card, {
          x,
          y,
          scale,
          zIndex,
          opacity: 1,
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
    <section
      className="relative bg-gradient-to-b from-[#0B1F3A] to-[#0a1730] py-16 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(200,149,46,0.22),transparent_55%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="heading-display text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white to-accent">
            Artikel Terbaru
          </h2>
          <p className="text-gray-300 text-sm mt-1">Tips &amp; panduan souvenir custom dari Karyamedia</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift("prev")}
            aria-label="Sebelumnya"
            className="p-2 rounded-full border border-white/20 bg-white/10 hover:bg-accent hover:text-white hover:border-accent transition"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            type="button"
            onClick={() => shift("next")}
            aria-label="Berikutnya"
            className="p-2 rounded-full border border-white/20 bg-white/10 hover:bg-accent hover:text-white hover:border-accent transition"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center h-[560px]">
        {articles.map((card, index) => (
          <div
            key={card.slug}
            ref={(el) => {
              cardRefs.current[index] = el
            }}
            className="absolute transition-transform"
            style={{ zIndex: total - Math.abs(index - currentIndex) }}
          >
            <Link
              href={`/blog/${card.slug}`}
              className="group relative block rounded-2xl border border-white/10 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)]"
            >
              <div className="relative h-[300px] w-[260px] overflow-hidden rounded-2xl">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="260px"
                />

                {card.category && (
                  <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden">
                    <span
                      className={`absolute top-3 left-[-30px] w-[130px] -rotate-45 text-center text-[10px] font-bold py-0.5 shadow-md ${
                        badgePalette[index % badgePalette.length]
                      }`}
                    >
                      {card.category}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 bg-white/85 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/40">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-gray-900 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-snug line-clamp-2">
                      {card.description}
                    </p>
                    <div className="flex justify-end mt-2">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent">
                        <ArrowUpRight className="w-3.5 h-3.5 text-primary transition-transform duration-300 group-hover:rotate-45 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="relative mt-2 w-[260px] h-[120px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_30%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_30%,transparent)]">
              <div className="absolute inset-0 -scale-y-100">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
