"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MessageCircle, Package, Ruler, Palette, Tag, Clock, Minus, Share2, ShoppingCart, Box, Layers } from "lucide-react"
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
  const isMedaliCustom = product.subcategoryId === "md"
  const isPlakatInstansi = cat?.id === "plakat-instansi"

  const plakatInstansiSizeOptions = ["Small (14x20cm)", "Medium (16x25cm)", "Large (19x29cm)"]
  const [selectedPlakatInstansiSize, setSelectedPlakatInstansiSize] = useState(plakatInstansiSizeOptions[0])

  const kemasanOptions = ["Kertas Marga (Free)", "Box Kertas Import", "Box Batik", "Box Bludru", "Box Custom"]
  const [selectedKemasan, setSelectedKemasan] = useState(kemasanOptions[0])

  const plakatInstansiThicknessOptions = ["Akrilik 1cm", "Akrilik 1,5cm", "Akrilik 2cm"]
  const [selectedPlakatInstansiThickness, setSelectedPlakatInstansiThickness] = useState(plakatInstansiThicknessOptions[0])

  const plakatInstansiQtyOptions = ["1 pcs", "5 pcs", "10 pcs", "25 pcs", "50 pcs", "100 pcs"]
  const [selectedPlakatInstansiQty, setSelectedPlakatInstansiQty] = useState("1")

  // Pricing lookup for plakat instansi
  const plakatInstansiPricing: Record<string, Record<string, number>> = {
    "Small (14x20cm)": {
      "Akrilik 1cm": 150000,
      "Akrilik 1,5cm": 175000,
      "Akrilik 2cm": 200000,
    },
    "Medium (16x25cm)": {
      "Akrilik 1cm": 175000,
      "Akrilik 1,5cm": 200000,
      "Akrilik 2cm": 250000,
    },
    "Large (19x29cm)": {
      "Akrilik 1cm": 300000,
      "Akrilik 1,5cm": 375000,
      "Akrilik 2cm": 425000,
    },
  }

  const boxPricing: Record<string, number> = {
    "Small (14x20cm)": 50000,
    "Medium (16x25cm)": 60000,
    "Large (19x29cm)": 75000,
  }

  // Calculate price based on selected options
  const calculatePlakatInstansiPrice = () => {
    const basePrice = plakatInstansiPricing[selectedPlakatInstansiSize]?.[selectedPlakatInstansiThickness] || 0
    const boxPrice = selectedKemasan !== "Kertas Marga (Free)" ? (boxPricing[selectedPlakatInstansiSize] || 0) : 0
    const qty = parseInt(selectedPlakatInstansiQty) || 1
    return (basePrice + boxPrice) * qty
  }

  const plakatInstansiPrice = calculatePlakatInstansiPrice()
  const plakatInstansiQty = parseInt(selectedPlakatInstansiQty) || 1
  
  // Progressive discount system
  const getPlakatInstansiDiscount = (qty: number) => {
    if (qty >= 100) return 0.15
    if (qty >= 50) return 0.12
    if (qty >= 10) return 0.10
    return 0
  }
  
  const plakatInstansiDiscount = getPlakatInstansiDiscount(plakatInstansiQty)
  const plakatInstansiFinalPrice = plakatInstansiPrice * (1 - plakatInstansiDiscount)

  const formatPlakatInstansiPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`
  }

  const getDiscountMessage = (qty: number) => {
    if (qty >= 100) return { discount: 15, message: "Pesan ≥100 pcs" }
    if (qty >= 50) return { discount: 12, message: "Pesan 50-99 pcs" }
    if (qty >= 10) return { discount: 10, message: "Pesan 10-49 pcs" }
    return { discount: 0, message: "" }
  }

  const getEstimasiProduksi = (qty: number) => {
    if (qty >= 100) return "14-30 hari kerja"
    if (qty >= 50) return "7-21 hari kerja"
    if (qty >= 10) return "1-7 hari kerja"
    return "2-3 hari kerja"
  }

  const sizeOptions = isBataswilayah || isMedaliCustom
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

  const thicknessOptions = isBataswilayah ? ["1mm", "1.5mm", "2mm", "3mm"] : isMedaliCustom && product.thickness ? ["0,8 mm", ...parseDelimited(product.thickness)] : []

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
    : isPlakatInstansi
    ? `Halo Karyamedia Souvenir, saya tertarik dengan produk ${product.code} (${product.name}).\n\nDetail pemesanan:\n- Kegunaan: ${product.usage}\n- Material Bahan: Akrilik | Stand Resin Fiberglass\n- Warna/Finishing: UV Flatbed Printing\n- Ukuran: ${selectedPlakatInstansiSize}\n- Ketebalan: ${selectedPlakatInstansiThickness}\n- Kemasan: ${selectedKemasan}\n- Jumlah: ${selectedPlakatInstansiQty} pcs\n- Total Harga: ${formatPlakatInstansiPrice(plakatInstansiFinalPrice)}\n- Estimasi Produksi: ${getEstimasiProduksi(plakatInstansiQty)}\n\nMohon informasi harga dan estimasi pengerjaannya.`
    : generateWhatsAppMessage(product.code, product.name)

  const iconColors: Record<string, string> = {
    Bahan: "text-blue-600",
    "Material Bahan": "text-blue-600",
    Stand: "text-amber-600",
    Logo: "text-purple-600",
    Ukuran: "text-orange-500",
    "Ukuran Plakat": "text-orange-500",
    "Pilih Ukuran Plakat": "text-orange-500",
    "Ketebalan Bahan": "text-slate-600",
    "Pilih Ketebalan bahan": "text-slate-600",
    "Warna/Finishing": "text-pink-500",
    "Warna Bahan": "text-pink-500",
    Kegunaan: "text-emerald-600",
    Kemasan: "text-amber-600",
    "Pilih Kemasan": "text-amber-600",
    "Varian Ukuran As": "text-orange-500",
    "Harga Satuan": "text-emerald-600",
    Harga: "text-emerald-600",
    "Jumlah Order": "text-red-500",
    "Minimal Order": "text-red-500",
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
          ...(isPlakatInstansi
            ? [
                {
                  icon: Package,
                  label: "Material Bahan",
                  value: "Akrilik | Stand Resin Fiberglass",
                },
              ]
            : []
          ),
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
            : []
          ),
          ...(product.color ? [{ icon: Palette, label: product.subcategoryId === "mi" ? "Warna Bahan" : "Warna/Finishing", value: product.color }] : []),
          ...(isPlakatInstansi
            ? [
                {
                  icon: Ruler,
                  label: "Pilih Ukuran Plakat",
                  value: (
                    <select
                      value={selectedPlakatInstansiSize}
                      onChange={(e) => setSelectedPlakatInstansiSize(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    >
                      {plakatInstansiSizeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ),
                },
                {
                  icon: Layers,
                  label: "Pilih Ketebalan bahan",
                  value: (
                    <select
                      value={selectedPlakatInstansiThickness}
                      onChange={(e) => setSelectedPlakatInstansiThickness(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    >
                      {plakatInstansiThicknessOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ),
                },
                {
                  icon: Box,
                  label: "Pilih Kemasan",
                  value: (
                    <div>
                      <select
                        value={selectedKemasan}
                        onChange={(e) => setSelectedKemasan(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        {kemasanOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {selectedKemasan !== "Kertas Marga (Free)" && (
                        <p className="text-[11px] text-amber-600 font-medium mt-1">Penambahan logo & tulisan di box ada biaya extra, min.order 50pcs</p>
                      )}
                    </div>
                  ),
                },
              ]
            : []
          ),
          ...((isBataswilayah || isMedaliCustom) && product.thickness
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
          ...(isBataswilayah || isMedaliCustom
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
            : isPlakatInstansi
            ? []
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
          ...(isBataswilayah
            ? [
                {
                  icon: Minus,
                  label: isBataswilayah ? "Jumlah Order" : (cat?.slug === "medali" ? "Minimal Order" : "Jumlah Order"),
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
            : isPlakatInstansi
            ? [
                {
                  icon: ShoppingCart,
                  label: "Jumlah Order",
                  value: (
                    <div className="space-y-1">
                      <input
                        type="number"
                        min={1}
                        value={selectedPlakatInstansiQty}
                        onChange={(e) => setSelectedPlakatInstansiQty(Math.max(1, parseInt(e.target.value) || 1).toString())}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <p className="text-[11px] text-gray-500">Masukkan jumlah yang dibutuhkan</p>
                    </div>
                  ),
                },
                {
                  icon: Tag,
                  label: "Harga Satuan",
                  value: formatPlakatInstansiPrice(plakatInstansiPrice),
                },
              ]
            : []
          ),
          ...(product.moldingFee ? [{ icon: Package, label: "Biaya Molding", value: product.moldingFee }] : []),
          { icon: Clock, label: "Estimasi Produksi", value: isPlakatInstansi ? getEstimasiProduksi(plakatInstansiQty) : product.productionTime },
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
        ) : isPlakatInstansi ? (
          <div>
            {plakatInstansiDiscount > 0 ? (
              <>
                <p className="text-sm line-through text-gray-400">{formatPlakatInstansiPrice(plakatInstansiPrice)}</p>
                <p className="text-2xl font-extrabold text-accent">{formatPlakatInstansiPrice(plakatInstansiFinalPrice)}</p>
              </>
            ) : (
              <p className="text-2xl font-extrabold text-primary">{formatPlakatInstansiPrice(plakatInstansiPrice)}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {selectedPlakatInstansiSize} | {selectedPlakatInstansiThickness} | {selectedKemasan} | {selectedPlakatInstansiQty} pcs
            </p>
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
        {isPlakatInstansi && plakatInstansiDiscount > 0 && (
          <p className="text-sm font-medium text-green-700 mt-1">
            Diskon <span className="text-xl font-extrabold text-accent drop-shadow-lg animate-bounce font-serif">{getDiscountMessage(plakatInstansiQty).discount}%</span> telah diterapkan! {getDiscountMessage(plakatInstansiQty).message}, hemat {formatPlakatInstansiPrice(plakatInstansiPrice * plakatInstansiDiscount)}.
          </p>
        )}
        {isPlakatInstansi && plakatInstansiDiscount === 0 && (
          <p className="text-sm font-medium text-gray-700 mt-1">
            Pesan minimal 10 pcs untuk mendapatkan diskon <span className="text-xl font-extrabold text-accent font-serif animate-pulse">10%</span> otomatis! Semakin banyak, semakin hemat.
          </p>
        )}
        {isPlakatInstansi && (
          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 mb-1">Tabel Diskon:</p>
            <div className="grid grid-cols-4 gap-1 text-xs">
              <div className="text-center p-1 bg-white rounded">1-9 pcs</div>
              <div className="text-center p-1 bg-white rounded">10-49 pcs</div>
              <div className="text-center p-1 bg-white rounded">50-99 pcs</div>
              <div className="text-center p-1 bg-white rounded">≥100 pcs</div>
              <div className="text-center p-1 bg-gray-100 rounded font-medium">0%</div>
              <div className="text-center p-1 bg-green-50 rounded font-medium text-green-600">10%</div>
              <div className="text-center p-1 bg-green-50 rounded font-medium text-green-600">12%</div>
              <div className="text-center p-1 bg-green-50 rounded font-medium text-green-600">15%</div>
            </div>
          </div>
        )}
        {isPlakatInstansi && (
          <p className="text-xs text-gray-500 mt-1">
            {formatPlakatInstansiPrice(plakatInstansiPrice / plakatInstansiQty)} × {selectedPlakatInstansiQty} pcs
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
          {cat?.slug === "medali" ? (
            <><strong>Info Custom:</strong> Gambar yang ditampilkan adalah referensi produk. Medali ini bisa di-custom sepenuhnya sesuai keinginan Anda — dari desain, ukuran, hingga pilihan finishing. Kirimkan ide atau referensi Anda via WhatsApp dan tim kami akan membantu mewujudkannya secara gratis.</>
          ) : (
            <><strong>Info Custom:</strong> Produk ini bisa di-custom sesuai kebutuhan Anda. Kirimkan logo, desain, atau referensi via WhatsApp untuk konsultasi gratis.</>
          )}
        </p>
      </div>
    </div>
  )
}
