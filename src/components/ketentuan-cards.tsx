"use client"

import { useRef } from "react"
import { AlertTriangle } from "lucide-react"

const items = [
  "Pembayaran hanya ke rekening resmi BCA 1260580864 atas nama Karyamedia",
  "Desain final disetujui sebelum produksi dimulai",
  "Estimasi produksi dapat berubah tergantung antrian order",
  "Ongkir ditanggung pembeli, dihitung berdasarkan berat aktual",
  "Produk custom tidak dapat dikembalikan kecuali ada cacat produksi",
  "Foto produk yang dikirim dapat sedikit berbeda dari mockup",
]

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
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(212,175,55,0.3), rgba(212,175,55,0) 50%)`
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
      className="relative overflow-hidden rounded-xl transition-transform duration-200 ease-out will-change-transform h-full"
    >
      <div
        ref={glareRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-xl"
        style={{ background: "none" }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

export function KetentuanCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <TiltCard key={i}>
          <div className="flex items-start gap-3 bg-white rounded-xl p-4 h-full relative overflow-hidden">
            <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-accent via-accent-light to-accent-accessible rounded-full" />
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{item}</p>
          </div>
        </TiltCard>
      ))}
    </div>
  )
}
