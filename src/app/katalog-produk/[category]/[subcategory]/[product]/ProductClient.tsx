"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MessageCircle, Package, Ruler, Palette, Tag, Clock, Minus, Share2 } from "lucide-react"
import { getWhatsAppLink, generateWhatsAppMessage } from "@/lib/utils"
import hargaBatasWilayah from "@/data/harga-bataswilayah.json"
import hargaCP from "@/data/harga-cp.json"

function parseDelimited(value: string): string[] {
  return value.split(" / ").map((s) => s.trim())
}

function formatPrice(num: number): string {
  return `Rp. ${Math.round(num).toLocaleString("id-ID")}`
}

function normalizeSizeKey(size: string): string {
  if (size === "9x13cm") return "9 x 13cm"
  if (size === "18cm x 18cm") return "18cm"
  if (size === "20cm x 20cm") return "20cm"
  return size
}

function normalizeThickness(t: string): string {
  return t.replace(".", ",")
}

function lookupPriceCP(material: string, diameter: string, ukuranAs: string, thickness: string): number | null {
  const byMaterial = (hargaCP as Record<string, any>)[material]
  if (!byMaterial) return null
  const byDiameter = byMaterial[diameter]
  if (!byDiameter) return null
  const byUkuranAs = byDiameter[ukuranAs]
  if (!byUkuranAs) return null
  return byUkuranAs[normalizeThickness(thickness)] ?? null
}

function lookupPrice(material: string, size: string, thickness: string): number | null {
  const sizeKey = normalizeSizeKey(size)
  const byMaterial = (hargaBatasWilayah as Record<string, any>)[material]
  if (!byMaterial) return null
  const bySize = byMaterial[sizeKey]
  if (!bySize) return null
  return bySize[thickness] ?? null
}

interface ProductClientProps {
  product: Record<string, any>
  cat: Record<string, any> | undefined
  sub: Record<string, any> | undefined
}

export default function ProductClient({ product, cat, sub }: ProductClientProps) {
  const isBataswilayah = cat?.slug === "batas-wilayah"

  const sizeOptions = isBataswilayah
    ? (product.subcategoryId === "cp"
      ? ["6cm", "8cm", "10cm", "12cm"]
      : parseDelimited(product.size).map((s) => {
          if (s === "18cm") return "18cm x 18cm"
          if (s === "20cm") return "20cm x 20cm"
          return s
        })
    ) : []
  const materialOptions = isBataswilayah
    ? (product.subcategoryId === "cp" ? ["Kuningan", "Tembaga"] : ["Kuningan", "Tembaga", "Stainless"])
    : []
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] || "")
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0] || "")
  const [orderQuantity, setOrderQuantity] = useState(1)
  const ukuranAsOptions = ["10cm x 2cm", "10cm x 1,5cm", "7cm x 5mm"]
  const [selectedUkuranAs, setSelectedUkuranAs] = useState(ukuranAsOptions[0])
  const minOrderQty = selectedSize === "20cm x 20cm" ? 5 : 1

  const thicknessOptions = isBataswilayah ? ["1mm", "1.5mm", "2mm", "3mm"] : []

  const [selectedThickness, setSelectedThickness] = useState(thicknessOptions[0] || "")

  const pricePerUnit = isBataswilayah
    ? (product.subcategoryId === "cp"
      ? lookupPriceCP(selectedMaterial, selectedSize, selectedUkuranAs, selectedThickness)
      : lookupPrice(selectedMaterial, selectedSize, selectedThickness))
    : null

  const discount = isBataswilayah && orderQuantity >= 20 ? 0.1 : 0

  const glowRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = glowRef.current?.getBoundingClientRect()
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePos({ x, y })
    }
  }, [])

  const displayPrice = isBataswilayah
    ? (pricePerUnit != null ? formatPrice(pricePerUnit) : "Rp. - (Hubungi kami)")
    : product.price

  const waMessage = isBataswilayah
    ? (product.subcategoryId === "cp"
      ? `Halo Karyamedia Souvenir, saya tertarik dengan produk ${product.code} (${product.name}).\n\nDetail pemesanan:\n- Bahan: ${selectedMaterial}\n- Diameter: ${selectedSize}\n- Ukuran As: ${selectedUkuranAs}\n- Ketebalan: ${selectedThickness}\n- Jumlah: ${orderQuantity} pcs\n\nMohon informasi harga dan estimasi pengerjaannya.`
      : `Halo Karyamedia Souvenir, saya tertarik dengan produk ${product.code} (${product.name}).\n\nDetail pemesanan:\n- Bahan: ${selectedMaterial}\n- Ukuran: ${selectedSize}\n- Ketebalan: ${selectedThickness}\n- Jumlah: ${orderQuantity} pcs\n\nMohon informasi harga dan estimasi pengerjaannya.`)
    : generateWhatsAppMessage(product.code, product.name)

  const iconColors: Record<string, string> = {
    Bahan: "text-blue-600",
    Stand: "text-amber-600",

    Logo: "text-purple-600",
    Ukuran: "text-orange-500",
    "Ketebalan Bahan": "text-slate-600",
    "Warna/Finishing": "text-pink-500",
    "Warna Bahan": "text-pink-500",
    Kegunaan: "text-emerald-600",
    "Varian Ukuran As": "text-orange-500",
    "Harga Satuan": "text-emerald-600",
    "Jumlah Order": "text-red-500",
    "Biaya Molding": "text-rose-600",
    "Estimasi Produksi": "text-amber-500",
  }

  return (
    <div>
      <p className="text-sm text-primary-light font-medium mb-2">{product.code}</p>
      <h1 className="heading-display text-3xl md:text-4xl text-gray-900 mb-4">{product.name}</h1>
      <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4">
        <h3 className="font-semibold text-gray-900 mb-3">Spesifikasi Produk</h3>
        {[
          { icon: Tag, label: "Kegunaan", value: product.usage },
          ...(isBataswilayah
            ? [
                {
                  icon: Package,
                  label: "Bahan",
                  value: (
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    >
                      {materialOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ),
                },
              ]
            : [{ icon: Package, label: "Bahan", value: product.material } as { icon: any; label: string; value: string }]
          ),
          ...(isBataswilayah && product.thickness
            ? [
                {
                  icon: Package,
                  label: "Ketebalan Bahan",
                  value: (
                    <select
                      value={selectedThickness}
                      onChange={(e) => setSelectedThickness(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    >
                      {thicknessOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ),
                },
              ]
              : product.thickness
              ? [{ icon: Package, label: "Ketebalan Bahan", value: product.thickness }]
              : []
          ),
          ...(product.standMaterial ? [{ icon: Package, label: "Stand", value: product.standMaterial }] : []),
          ...(product.logoType ? [{ icon: Package, label: "Logo", value: product.logoType }] : []),
          ...(isBataswilayah
            ? [
                {
                  icon: Ruler,
                  label: product.subcategoryId === "cp" ? "Diameter" : "Ukuran",
                  value: (
                    <select
                      value={selectedSize}
                      onChange={(e) => {
                        setSelectedSize(e.target.value)
                        const newMin = e.target.value === "20cm x 20cm" ? 5 : 1
                        if (orderQuantity < newMin) setOrderQuantity(newMin)
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    >
                      {sizeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ),
                },
              ]
            : [{ icon: Ruler, label: product.subcategoryId === "cp" ? "Diameter" : "Ukuran", value: product.size } as { icon: any; label: string; value: string }]
          ),
          ...(product.subcategoryId === "cp"
            ? [
                {
                  icon: Ruler,
                  label: "Varian Ukuran As",
                  value: (
                    <select
                      value={selectedUkuranAs}
                      onChange={(e) => setSelectedUkuranAs(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    >
                      {ukuranAsOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ),
                },
              ]
            : []
          ),
          ...(isBataswilayah && pricePerUnit != null
            ? [{ icon: Tag, label: "Harga Satuan", value: formatPrice(pricePerUnit) }]
            : []
          ),
          ...(product.color ? [{ icon: Palette, label: product.subcategoryId === "mi" ? "Warna Bahan" : "Warna/Finishing", value: product.color }] : []),
          ...(isBataswilayah
            ? [
                {
                  icon: Minus,
                  label: "Jumlah Order",
                  value: (
                    <div className="space-y-1">
                      <input
                        type="number"
                        min={minOrderQty}
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(Math.max(minOrderQty, parseInt(e.target.value) || minOrderQty))}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      {minOrderQty > 1 && (
                        <p className="text-[11px] text-accent font-medium">Min. order untuk ukuran ini: {minOrderQty} pcs</p>
                      )}
                    </div>
                  ),
                },
              ]
            : [{ icon: Minus, label: "Jumlah Order", value: product.minOrder } as { icon: any; label: string; value: string }]
          ),
          ...(product.moldingFee ? [{ icon: Package, label: "Biaya Molding", value: product.moldingFee }] : []),
          { icon: Clock, label: "Estimasi Produksi", value: product.productionTime },
        ].map((item: any) => (
          <div key={item.label} className="flex items-start gap-3">
            <item.icon className={`w-5 h-5 ${iconColors[item.label] || "text-primary"} mt-0.5 shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">{item.label}</p>
              {typeof item.value === "string" && item.value.includes("/") && false ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 mt-1">
                  {item.value.split(" / ").map((opt: string, i: number) => (
                    <div
                      key={i}
                      className="px-1.5 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-medium text-gray-900 text-center hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] hover:shadow-md transition-all duration-200 cursor-default"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-medium text-gray-900">{item.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        ref={glowRef}
        onMouseMove={handleMouseMove}
        className="group relative overflow-hidden bg-primary/5 rounded-2xl p-6 mb-8 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/20 border border-transparent"
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 shimmer-line rounded-t-2xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.1) 35%, transparent 65%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.12) 0%, transparent 50%)`,
          }}
        />
        <div className="relative z-10">
        <p className="text-sm text-gray-600 mb-1">Total Biaya</p>
        {sub?.slug === "souvenir-pernikahan" ? (
          <p className="text-2xl font-extrabold text-primary">Harga Mulai Rp. 150.000 - Rp. 500.000</p>
        ) : isBataswilayah && pricePerUnit != null ? (
          <div>
            {discount > 0 ? (
              <>
                <p className="text-sm line-through text-gray-400">{formatPrice(pricePerUnit * orderQuantity)}</p>
                <p className="text-2xl font-extrabold text-accent">{formatPrice(pricePerUnit * orderQuantity * (1 - discount))}</p>
              </>
            ) : (
              <p className="text-2xl font-extrabold text-primary">{formatPrice(pricePerUnit * orderQuantity)}</p>
            )}
          </div>
        ) : (
          <p className="text-2xl font-extrabold text-primary">{displayPrice}</p>
        )}
        {isBataswilayah && pricePerUnit != null && orderQuantity >= 20 && (
          <p className="text-sm font-medium text-green-700 mt-1">
            Diskon <span className="text-xl font-extrabold text-accent drop-shadow-lg animate-pulse font-serif">10%</span> telah diterapkan! Pesan {orderQuantity} pcs, hemat {formatPrice(pricePerUnit * orderQuantity * discount)}.
          </p>
        )}
        {isBataswilayah && pricePerUnit != null && orderQuantity < 20 && (
          <p className="text-sm font-medium text-gray-700 mt-1">
            Pesan minimal 20 pcs untuk mendapatkan diskon <span className="text-xl font-extrabold text-accent font-serif">10%</span> otomatis! Semakin banyak, semakin hemat.
          </p>
        )}
        {isBataswilayah && pricePerUnit != null && (
          <p className="text-xs text-gray-500 mt-1">
            {formatPrice(pricePerUnit)} × {orderQuantity} pcs
          </p>
        )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={getWhatsAppLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#075E54] hover:bg-[#054E43] text-white py-3.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-[#25D366]/25"
        >
          <MessageCircle className="w-5 h-5" />
          Tanya Harga via WhatsApp
        </a>
        <a
          href={getWhatsAppLink(`Halo Karyamedia Souvenir, saya ingin request quote untuk produk ${product.code} (${product.name}).`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-[#0A1A30] text-white py-3.5 rounded-xl font-medium transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Request Quote
        </a>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-sm text-yellow-800">
          <strong>Info Custom:</strong> Produk ini bisa di-custom sesuai kebutuhan Anda. Kirimkan logo, desain, atau referensi via WhatsApp untuk konsultasi gratis.
        </p>
      </div>
    </div>
  )
}
