"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle, Search, X, Shield, Calendar, Users, Truck, Sparkles, Star } from "lucide-react"
import { getWhatsAppLink } from "@/lib/utils"
import { products } from "@/data/products"
import { categories } from "@/data/categories"

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "gray",
  darkLineColor = "gray",
}) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as React.CSSProperties

  return (
    <div
      className="pointer-events-none absolute size-full overflow-hidden [perspective:200px]"
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:130vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:200vw] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent to-90%" />
    </div>
  )
}

function SearchDropdown({ query, onQueryChange, onClose }: { query: string; onQueryChange: (v: string) => void; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("keydown", handleKey)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const q = query.toLowerCase().trim()
  const results = q
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.code.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        )
        .slice(0, 8)
    : []

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || categoryId

  return (
    <div ref={dropdownRef} className="relative">
      <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white text-gray-900 border border-accent/30 shadow-xl">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Temukan Produk Anda Disini..."
          className="flex-1 text-sm placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
        {query && (
          <button onClick={() => { onQueryChange(""); inputRef.current?.focus() }} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {q && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto">
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/katalog-produk/${p.categoryId}/${p.subcategoryId}/${p.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                <Image src={p.images[0] || "/placeholder.png"} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm text-gray-900 group-hover:text-accent-accessible transition-colors truncate">{p.name}</div>
                <div className="text-xs text-gray-400">{p.code} &middot; {getCategoryName(p.categoryId)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {q && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 px-4 py-6 text-center text-sm text-gray-400">
          Tidak ditemukan produk untuk &quot;{query}&quot;
        </div>
      )}
    </div>
  )
}

export function HeroSection() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  return (
    <section className="relative bg-primary overflow-hidden py-6 pt-[84px]">
      {/* Cinematic background effects */}
      <div className="absolute top-0 z-[0] h-full w-full bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(29,78,216,0.15),rgba(11,31,58,0))]" />
      
      {/* Animated light rays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" style={{ animationDelay: "1s" }} />
      
      {/* Particle effects */}
      <div className="absolute top-20 left-56">
        <div className="w-10 h-10 bg-accent/20 rounded-full blur-xl absolute -top-3 -left-3 animate-pulse" />
        <div className="w-8 h-8 bg-white/10 rounded-full blur-md absolute -top-1.5 -left-1.5" />
        <div className="w-5 h-5 bg-accent rounded-full opacity-90 shadow-[0_0_10px_white,0_0_20px_#D4AF37/50] animate-float" />
      </div>
      <div className="absolute top-16 right-48 w-3 h-3 bg-white rounded-full opacity-80 shadow-[0_0_6px_white] animate-float" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-12 left-[30%] w-3 h-3 bg-accent rounded-full opacity-80 shadow-[0_0_6px_#D4AF37] animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-24 right-32 w-3 h-3 bg-accent rounded-full opacity-90 shadow-[0_0_6px_#D4AF37] animate-float" style={{ animationDelay: "2s" }} />

      <RetroGrid
        angle={65}
        opacity={0.3}
        cellSize={50}
        lightLineColor="#D4AF37"
        darkLineColor="#1D4ED8"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-tr from-accent/20 via-primary-light/20 to-transparent border-[2px] border-accent/30 rounded-3xl px-5 py-2.5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-accent-accessible" />
              <span className="text-white text-sm font-medium">
                Souvenir Custom Premium
              </span>
              <Star className="w-3 h-3 text-accent-accessible fill-accent" />
            </div>

            {/* Headline */}
            <h1 className="heading-display text-3xl md:text-4xl lg:text-5xl">
              <span className="text-transparent bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.75)_100%)]">
                Souvenir Custom
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-accessible to-accent">
                Premium
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
              untuk Penghargaan, Wisuda, Event, dan Instansi
            </p>

            {/* Description */}
            <p className="text-base text-gray-400 leading-relaxed max-w-xl">
              Karyamedia Souvenir telah melayani pembuatan Plakat, Medali, Piala/Trohy, kebutuhan Souvenir untuk Perlengkapan Wisuda dan Souvenir Custom lebih dari 15 Tahun.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {searchOpen ? (
                <div className="w-full max-w-md">
                  <SearchDropdown query={searchQuery} onQueryChange={setSearchQuery} onClose={() => { setSearchOpen(false); setSearchQuery("") }} />
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="relative inline-block overflow-hidden rounded-full p-[1.5px] group cursor-pointer"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#D4AF37_0%,#1D4ED8_50%,#D4AF37_100%)]" />
                  <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-primary text-xs font-medium backdrop-blur-3xl">
                    <span className="inline-flex rounded-full text-center items-center w-full justify-center bg-gradient-to-tr from-accent/20 via-primary-light/30 to-transparent text-white border-[1px] border-accent/30 hover:from-accent/30 hover:via-primary-light/40 transition-all sm:w-auto py-4 px-10 gap-2">
                      <Search className="w-4 h-4" />
                      Temukan Produk Anda Disini
                    </span>
                  </div>
                </button>
              )}

            </div>


            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-4">
              {[
                { icon: Calendar, label: "Sejak 2001" },
                { icon: Shield, label: "Berbadan Hukum" },
                { icon: Users, label: "Pengerajin Langsung" },
                { icon: Truck, label: "Pengiriman Indonesia" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent/20 transition-colors">
                    <item.icon className="w-4 h-4 text-accent-accessible" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product showcase */}
          <div className="relative hidden lg:block h-[500px]">
            {/* Glow effects behind products */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-light/15 rounded-full blur-[120px]" />
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />

            {/* Grid layout - Featured + Stack */}
            <div className="grid grid-cols-[2fr_1fr] gap-3 h-full content-center relative z-10">
              {/* Featured: Plakat Akrilik (full height) */}
              <div className="row-span-3 rounded-2xl overflow-hidden shadow-xl shadow-[#1D4ED8]/20 group hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/images/hero/plakat-akrilik (2).webp"
                  alt="Plakat Akrilik Custom"
                  width={300}
                  height={300}
                  priority
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Right top: Kalung Rektor */}
              <div className="rounded-2xl overflow-hidden shadow-xl shadow-accent/20 group hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/images/hero/kalung-rektor (12).webp"
                  alt="Kalung Rektor"
                  width={250}
                  height={250}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Right middle: Plakat Wayang */}
              <div className="rounded-2xl overflow-hidden shadow-xl shadow-accent/20 group hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/images/hero/plakat-wayang (33).webp"
                  alt="Plakat Wayang"
                  width={180}
                  height={180}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Right bottom: Map Ijazah + Patung Wisuda */}
              <div className="flex gap-3">
                <div className="flex-1 rounded-2xl overflow-hidden shadow-xl shadow-black/30 group hover:scale-[1.02] transition-transform duration-500">
                  <Image
                    src="/images/hero/map-wisuda (8).webp"
                    alt="Medali"
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden shadow-xl shadow-[#1D4ED8]/20 group hover:scale-[1.02] transition-transform duration-500">
                  <Image
                    src="/images/hero/patung-wisuda (20).webp"
                    alt="Patung Wisuda"
                    width={280}
                    height={280}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-4 left-1/3 w-16 h-16 bg-accent/20 rounded-full blur-2xl animate-float" />
            <div className="absolute bottom-8 right-0 w-20 h-20 bg-primary-light/15 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-0 w-12 h-12 bg-accent/15 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
          </div>
        </div>
      </div>
    </section>
  )
}
