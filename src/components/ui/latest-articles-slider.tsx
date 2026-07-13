"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Item {
  slug: string
  title: string
  image: string
  category: string
}

export function LatestArticlesSlider({ articles }: { articles: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const step = Math.min(el.clientWidth * 0.8, 320)
    el.scrollBy({ left: dir * step, behavior: "smooth" })
  }

  if (!articles.length) return null

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="heading-display text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Artikel Terbaru
            </h2>
            <p className="text-gray-500 text-sm mt-1">Tips &amp; panduan souvenir custom dari Karyamedia</p>
          </div>
          <div className="flex items-center gap-2 flex-none">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Sebelumnya"
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Berikutnya"
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link href="/blog" className="ml-1 text-sm font-medium text-accent hover:underline whitespace-nowrap">
              Lihat semua
            </Link>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none]"
          style={{ scrollbarWidth: "none" }}
        >
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="group flex-none w-64 snap-start bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 p-3">
                <Image
                  src={a.image}
                  alt={a.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg object-cover flex-none"
                />
                <div className="min-w-0">
                  <span className="text-[11px] uppercase tracking-wide text-accent font-semibold">{a.category}</span>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                    {a.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
