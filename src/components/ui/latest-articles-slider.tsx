"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface Item {
  slug: string
  title: string
  description: string
  image: string
  category: string
}

export function LatestArticlesSlider({ articles }: { articles: Item[] }) {
  const [isPaused, setIsPaused] = useState(false)

  if (!articles.length) return null

  const duplicated = [...articles, ...articles]

  return (
    <section className="bg-gray-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="heading-display text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Artikel Terbaru
        </h2>
        <p className="text-gray-500 text-sm mt-1">Tips &amp; panduan souvenir custom dari Karyamedia</p>
      </div>

      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <style>{`
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
        <div
          className="flex gap-4"
          style={{
            animation: `marquee-reverse ${articles.length * 5}s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {duplicated.map((a, i) => (
            <Link
              key={`${a.slug}-${i}`}
              href={`/blog/${a.slug}`}
              className="group w-72 shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-100">
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-[11px] uppercase tracking-wide text-accent font-semibold">{a.category}</span>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mt-1 group-hover:text-accent transition-colors leading-snug">
                  {a.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">{a.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
