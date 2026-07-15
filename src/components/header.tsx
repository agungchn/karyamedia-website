"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { getWhatsAppLink } from "@/lib/utils"
import {
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  Award,
  Medal,
  Trophy,
  GraduationCap,
  Package,
  Gem,
  Scroll,
  MapPin,
} from "lucide-react"
import { categories } from "@/data/categories"
import { categoryIconMap } from "@/components/icons/product-icons"

const iconMap: Record<string, React.ElementType> = {
  Award,
  Medal,
  Trophy,
  GraduationCap,
  Package,
  Gem,
  Scroll,
  MapPin,
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const catalogRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)

  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
    setCatalogOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) {
        setCatalogOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-accent/20 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white"
      }`}
    >
      {/* Top bar */}
      <div className="bg-gradient-to-r from-accent via-accent-light to-accent-accessible border-b border-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <p className="text-sm text-[#FFF8E7] text-right font-medium heading-display-light italic tracking-[0.2em]" style={{ wordSpacing: "0.3em" }}>
            Sentuhan Estetik, Berjuta Makna
          </p>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-16 lg:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
          >
            <Image src="/images/logo-karyamedia.png" alt="Karyamedia Souvenir" width={40} height={40} className="w-10 h-10 object-contain" />
            <div className="hidden sm:block">
              <div className="font-bold text-primary text-lg leading-tight">Karyamedia</div>
              <div className="text-[10px] text-accent-accessible font-medium tracking-widest uppercase">Souvenir</div>
            </div>
          </Link>

          {/* Katalog Dropdown */}
          <div className="relative hidden lg:block ml-6" ref={catalogRef}>
            <button
              onClick={() => setCatalogOpen(!catalogOpen)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setCatalogOpen(false)
                if (e.key === "Enter" || e.key === " ") setCatalogOpen(!catalogOpen)
              }}
              aria-expanded={catalogOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/katalog-produk")
                  ? "text-accent-accessible bg-accent/5"
                  : "text-gray-700 hover:text-accent-accessible hover:bg-accent/5"
              }`}
            >
              Katalog Produk
              <ChevronDown className={`w-4 h-4 transition-transform ${catalogOpen ? "rotate-180" : ""}`} />
            </button>

            {catalogOpen && (
              <div className="absolute top-full left-0 mt-1 w-[640px] bg-white rounded-xl shadow-2xl border border-accent/10 p-6 animate-scale-in">
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const ColoredIcon = categoryIconMap[cat.slug]
                    const Icon = iconMap[cat.icon] || Award
                    return (
                      <Link
                        key={cat.id}
                        href={`/katalog-produk/${cat.slug}`}
                        className="group flex items-start gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                          {ColoredIcon ? <ColoredIcon size={20} /> : <Icon className="w-4 h-4 text-primary" />}
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-gray-900 group-hover:text-accent-accessible transition-colors block">{cat.name}</span>
                          <p className="text-xs text-gray-500 line-clamp-1">{cat.description}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-accent/10">
                  <Link
                    href="/katalog-produk"
                    className="text-sm font-medium text-accent-accessible hover:text-accent-accessible"
                  >
                    Lihat Semua Produk &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-8 ml-auto">
            {[
              { label: "Profil", href: "/profil" },
              { label: "Galeri", href: "/gallery" },
              { label: "Cara Pesan", href: "/cara-pesan" },
              { label: "Kontak", href: "/kontak" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 ${
                  pathname === item.href
                    ? "text-primary after:w-full"
                    : "text-gray-700 hover:text-accent-accessible after:w-0 hover:after:w-full"
                }`}
              >
                  {item.label}
                </Link>
            ))}
          </nav>

          {/* WhatsApp Button */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 border-2 border-accent/30 text-accent-accessible hover:bg-accent/5 hover:border-accent/60 px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            Tanya Kami di WhatsApp
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden ml-auto p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/katalog-produk"
              className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-accent-accessible hover:bg-accent/5 transition-colors"
            >
              Katalog Produk
            </Link>
            <div className="pl-4 space-y-0.5">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || Award
                return (
                  <Link
                    key={cat.id}
                    href={`/katalog-produk/${cat.slug}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-accent-accessible hover:bg-accent/5 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </Link>
                )
              })}
            </div>

            {[
              { label: "Profil", href: "/profil" },
              { label: "Galeri", href: "/gallery" },
              { label: "Cara Pesan", href: "/cara-pesan" },
              { label: "Kontak", href: "/kontak" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-accent-accessible bg-accent/5"
                    : "text-gray-700 hover:text-accent-accessible hover:bg-accent/5"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-accent/30 text-accent-accessible hover:bg-accent/5 px-4 py-3 rounded-full text-sm font-medium mt-4"
            >
              <MessageCircle className="w-4 h-4" />
              Tanya Kami di WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
