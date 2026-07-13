"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronRight, Award } from "lucide-react"
import { categories } from "@/data/categories"
import { categoryIconMap } from "@/components/icons/product-icons"

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateY(-4px)`

    const gx = ((e.clientX - rect.left) / rect.width) * 100
    const gy = ((e.clientY - rect.top) / rect.height) * 100
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(212,175,55,0.25), rgba(212,175,55,0) 50%)`
    }
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)"
    if (glareRef.current) {
      glareRef.current.style.background = "none"
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-2xl transition-transform duration-200 ease-out will-change-transform h-full"
    >
      <div
        ref={glareRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
        style={{ background: "none" }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

export function KategoriCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <TiltCard key={cat.id}>
          <Link
            href={`/katalog-produk/${cat.slug}`}
            className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-accent/20 transition-all block h-full"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {(() => {
                const CatIcon = categoryIconMap[cat.slug]
                return CatIcon ? <CatIcon size={28} /> : <Award className="w-7 h-7 text-primary" />
              })()}
            </div>
            <h3 className="font-bold text-gray-900 group-hover:text-accent-accessible transition-colors mb-1">{cat.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{cat.description}</p>
            <div className="flex items-center gap-1 text-sm font-medium text-accent-accessible">
              {cat.subcategories.length} subkategori
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </TiltCard>
      ))}
    </div>
  )
}
