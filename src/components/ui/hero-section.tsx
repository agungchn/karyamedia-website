"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle, Search, X, Shield, Calendar, Users, Truck, Sparkles, Star } from "lucide-react"
import { getWhatsAppLink } from "@/lib/utils"
import { products } from "@/data/products"
import { categories } from "@/data/categories"
import { getTimeTheme, TimeTheme } from "@/lib/time-theme"
import { LazySparklesCore } from "@/components/ui/lazy-effects"
import { OrbitHeroGrid } from "@/components/ui/orbit-hero-grid"

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "gray",
  darkLineColor = "gray",
  overlayColor = "from-primary",
}: {
  angle?: number
  cellSize?: number
  opacity?: number
  lightLineColor?: string
  darkLineColor?: string
  overlayColor?: string
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
      <div className={`absolute inset-0 bg-gradient-to-t ${overlayColor} to-transparent to-90%`} />
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
        .filter((p) => {
          const cat = categories.find((c) => c.id === p.categoryId)
          const sub = cat?.subcategories.find((s) => s.id === p.subcategoryId)
          const aliases = sub?.aliases ?? []
          return (
            p.name.toLowerCase().includes(q) ||
            p.code.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            cat?.name.toLowerCase().includes(q) ||
            sub?.name.toLowerCase().includes(q) ||
            aliases.some((a) => a.toLowerCase().includes(q))
          )
        })
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
                <Image src={p.images[0] || "/placeholder.png"} alt={`${p.name} - ${categories.find((c) => c.id === p.categoryId)?.subcategories.find((s) => s.id === p.subcategoryId)?.name || categories.find((c) => c.id === p.categoryId)?.name || "Souvenir"} Karyamedia Jogja`} width={40} height={40} className="object-cover w-full h-full" />
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
  const [theme, setTheme] = useState<TimeTheme>(() => getTimeTheme())
  const isNight = theme.bgTop === "#020617"
  const isSore = theme.bgTop === "#E8A0B0"

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(getTimeTheme())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <section className="relative overflow-hidden py-6 pt-[84px]">
      {/* Time-based background */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundImage: `linear-gradient(to bottom, ${theme.bgTop} 0%, ${theme.bgMid} 50%, ${theme.bgBottom} 100%)` }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[70%] overflow-hidden">
          <RetroGrid
            angle={65}
            opacity={0.025}
            cellSize={60}
            lightLineColor="rgba(255,255,255,0.35)"
            darkLineColor="rgba(255,255,255,0.35)"
            overlayColor="from-transparent"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[40%] overflow-hidden">
          <LazySparklesCore
            id="hero-sparkles"
            background="transparent"
            minSize={0.5}
            maxSize={1.3}
            particleColor={theme.particleColor}
            particleDensity={40}
            speed={1}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Cinematic background effects */}
      <div className="absolute top-0 z-[0] h-full w-full bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(29,78,216,0.15),rgba(11,31,58,0))]" />
      
      {/* Animated light rays + glow orbs (night only) */}
      {isNight && (
        <>
          <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-blue-500/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-amber-400/25 rounded-full blur-[120px]" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-cyan-400/20 rounded-full blur-[100px]" />

          {/* Particle effects */}
          <div className="absolute top-20 left-56">
            <div className="w-10 h-10 bg-amber-400/40 rounded-full blur-xl absolute -top-3 -left-3 animate-pulse" />
            <div className="w-8 h-8 bg-blue-400/30 rounded-full blur-md absolute -top-1.5 -left-1.5" />
            <div className="w-5 h-5 bg-amber-300 rounded-full opacity-95 shadow-[0_0_12px_white,0_0_24px_#D4AF37] animate-float" />
          </div>
          <div className="absolute top-16 right-48 w-3 h-3 bg-white rounded-full opacity-90 shadow-[0_0_8px_white] animate-float" style={{ animationDelay: "0.5s" }} />
          <div className="absolute top-12 left-[30%] w-3 h-3 bg-amber-300 rounded-full opacity-90 shadow-[0_0_8px_#D4AF37] animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-24 right-32 w-3 h-3 bg-blue-300 rounded-full opacity-95 shadow-[0_0_8px_#3B82F6] animate-float" style={{ animationDelay: "2s" }} />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className={`relative inline-flex items-center gap-2 border-[2px] rounded-3xl px-5 py-2.5 backdrop-blur-sm ${isNight ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10' : isSore ? 'border-white/40 bg-white/10' : 'border-white/30 bg-white/10'}`}>
              <div className={`absolute -top-px left-3 right-3 h-px rounded-full ${isNight ? 'bg-[#D4AF37]/70' : isSore ? 'bg-white/60' : 'bg-white/40'}`} />
              <Sparkles className={`w-4 h-4 ${isNight ? 'text-[#D4AF37]' : isSore ? 'text-white' : 'text-amber-600'}`} />
              <span className={`text-sm ${isNight ? 'text-[#FFE9A8]' : 'text-white'}`}>
                Souvenir Custom Premium
              </span>
              <Star className={`w-3 h-3 ${isNight ? 'text-[#D4AF37] fill-[#D4AF37]' : isSore ? 'text-white fill-white' : 'text-amber-600 fill-amber-600'}`} />
            </div>

            {/* Headline */}
            <h1 className="heading-display text-3xl md:text-4xl lg:text-5xl">
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${theme.headingFrom}, ${theme.headingTo})` }}>
                Souvenir Custom &amp; Plakat
              </span>
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${theme.headingFrom}, ${theme.headingTo})` }}>
                Premium Jogja
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg md:text-xl leading-relaxed max-w-xl ${theme.desc}`}>
              untuk Penghargaan, Wisuda, Event, dan Instansi
            </p>

            {/* Description */}
            <p className={`text-base leading-relaxed max-w-xl ${theme.desc}`}>
              Karyamedia Souvenir telah melayani pembuatan Plakat, Medali, Piala/Trophy, kebutuhan Souvenir untuk Perlengkapan Wisuda dan Souvenir Custom lebih dari 15 Tahun.
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
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isNight ? 'bg-white/20 hover:bg-[#D4AF37]/20' : isSore ? 'bg-white/15 hover:bg-white/25' : 'bg-black/10 hover:bg-black/20'} hover:-translate-y-1`}>
                    <item.icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isNight ? 'text-[#FFE9A8]' : isSore ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${theme.badge}`}>{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product showcase with orbital rotation */}
          <div className="relative hidden lg:block h-[500px]">
            <OrbitHeroGrid />
          </div>
        </div>
      </div>
    </section>
    <div className="w-full h-0.5 shimmer-line" />
    </>
  )
}
