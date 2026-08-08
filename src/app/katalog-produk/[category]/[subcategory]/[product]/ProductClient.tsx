"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { MessageCircle, Package, Ruler, Palette, Tag, Clock, Minus, Share2, ShoppingCart, Box, Layers, Type, Ribbon } from "lucide-react"
import { getWhatsAppLink, generateWhatsAppMessage } from "@/lib/utils"
import hargaBatasWilayah from "@/data/harga-bataswilayah.json"
import hargaCP from "@/data/harga-cp.json"

function parseDelimited(value: string): string[] {
  return value.split(" / ").map((s) => s.trim())
}

const MedaliQtyInput = memo(function MedaliQtyInput({
  initial,
  min = 6,
  onCommit,
}: {
  initial: number
  min?: number
  onCommit: (v: string) => void
}) {
  const [draft, setDraft] = useState(String(initial))
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const commit = (raw: string) => {
    const n = parseInt(raw.replace(/\D/g, "")) || min
    const clamped = String(Math.max(min, n))
    setDraft(clamped)
    onCommit(clamped)
  }

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  return (
    <div className="space-y-1">
      <input
        type="number"
        min={min}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value)
          if (timer.current) clearTimeout(timer.current)
          timer.current = setTimeout(() => commit(e.target.value), 500)
        }}
        onBlur={() => {
          if (timer.current) clearTimeout(timer.current)
          commit(draft)
        }}
        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
      />
      <p className="text-[11px] text-gray-500">Minimal order 6 pcs</p>
    </div>
  )
})

function labelUkuranWayang(size: string): string {
  const labels: Record<string, string> = {
    "15x20 cm": "Small 14x20 cm",
    "20x25 cm": "Medium 16x25 cm",
    "25x30 cm": "Large 19x29 cm",
    "Small: 10x15 cm": "Small 10x15 cm",
    "Medium: 14x20 cm": "Medium 14x20 cm",
    "Large: 20x26 cm": "Large 20x26 cm",
  }
  return labels[size] || size
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
  const isPlakatInstansi = cat?.id === "plakat-instansi" || product.subcategoryId === "pa" || product.subcategoryId === "pf"
  const isPialaOlahraga = product.subcategoryId === "po"

  const plakatInstansiSizeOptions = ["Small (14x20cm)", "Medium (16x25cm)", "Large (19x29cm)"]
  const [selectedPlakatInstansiSize, setSelectedPlakatInstansiSize] = useState(plakatInstansiSizeOptions[0])

  const kemasanOptions = ["Kertas Marga (Free)", "Box Kertas Import", "Box Batik", "Box Bludru", "Box Custom"]
  const [selectedKemasan, setSelectedKemasan] = useState(kemasanOptions[0])
  const [customKemasan, setCustomKemasan] = useState("")

  const kemasanWayangOptions = ["Kertas Marga (free)", "Box Batik", "Box Bludru", "Box Custum"]
  const [selectedKemasanWayang, setSelectedKemasanWayang] = useState(kemasanWayangOptions[0])

  const ukuranWayangOptions = product.subcategoryId === "pw" || product.subcategoryId === "pkp" ? parseDelimited(product.size) : []
  const [selectedUkuranWayang, setSelectedUkuranWayang] = useState(ukuranWayangOptions[0] || "")

  const [orderQuantityWayang, setOrderQuantityWayang] = useState(1)
  const [customUkuranWayang, setCustomUkuranWayang] = useState("")
  const [customKemasanWayang, setCustomKemasanWayang] = useState("")

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

  const pialaOlahragaPricing: Record<string, Record<string, number>> = {
    "Small (14x20cm)": { "Akrilik 1cm": 150000, "Akrilik 1,5cm": 175000, "Akrilik 2cm": 200000 },
    "Medium (16x25cm)": { "Akrilik 1cm": 175000, "Akrilik 1,5cm": 200000, "Akrilik 2cm": 250000 },
    "Large (19x29cm)": { "Akrilik 1cm": 300000, "Akrilik 1,5cm": 375000, "Akrilik 2cm": 425000 },
  }

  // Calculate price based on selected options
  const calculatePlakatInstansiPrice = () => {
    const sizePricing = isPialaOlahraga ? pialaOlahragaPricing : plakatInstansiPricing
    const basePrice = sizePricing[selectedPlakatInstansiSize]?.[selectedPlakatInstansiThickness]
    if (basePrice == null) return 0
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

  const getMedaliDiscount = (qty: number) => {
    if (qty >= 501) return { percent: 0.15, bigNego: false, discount: 15, message: "Pesan 501 pcs ke atas" }
    if (qty >= 200) return { percent: 0.125, bigNego: false, discount: 12.5, message: "Pesan 200-500 pcs" }
    if (qty >= 100) return { percent: 0.10, bigNego: false, discount: 10, message: "Pesan 100-199 pcs" }
    if (qty >= 50) return { percent: 0.075, bigNego: false, discount: 7.5, message: "Pesan 50-99 pcs" }
    return { percent: 0, bigNego: false, discount: 0, message: "" }
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
      : isMedaliCustom
      ? ["5,5 cm", "6 cm", "6,5 cm", "7 cm", "7,5 cm", "8 cm", "9 cm"].map((s) => `Diameter ${s}`)
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
  const [medaliOrderQty, setMedaliOrderQty] = useState("6")

  const taliMedaliOptions = ["Tanpa Tali", "Tali Polyester 3cm - 90cm", "Pita Sablon 1 Warna - 90cm", "Lanyard 2cm - 90cm", "Lanyard 2,5cm - 90cm", "Lanyard 3cm - 90cm"]
  const [selectedTaliMedali, setSelectedTaliMedali] = useState("Tanpa Tali")
  const [customTaliMedali, setCustomTaliMedali] = useState("")

  const warnaMedaliOptions = ["Poles tanpa Chrome", "Chrome Emas", "Chrome Perak", "Chrome Perunggu", "1 Set Gold, Silver, Bronze"]
  const [selectedWarnaMedali, setSelectedWarnaMedali] = useState(warnaMedaliOptions[0])
  const ukuranAsOptions = ["10cm x 2cm", "10cm x 1,5cm", "7cm x 5mm"]
  const [selectedUkuranAs, setSelectedUkuranAs] = useState(ukuranAsOptions[0])
  const minOrderQty = selectedSize === "20cm x 20cm" ? 5 : 1

  const thicknessOptions = isBataswilayah ? ["1mm", "1.5mm", "2mm", "3mm"] : isMedaliCustom && product.thickness ? ["0,8 mm", ...parseDelimited(product.thickness)].map((t) => `Kuningan ${t}`) : []

  const [selectedThickness, setSelectedThickness] = useState(thicknessOptions[0] || "")

  const medaliCustomPricing: Record<string, Record<string, number>> = {
    "Diameter 5,5 cm": { "Kuningan 0,8 mm": 31000, "Kuningan 1 mm": 31500, "Kuningan 1,5 mm": 36500, "Kuningan 2 mm": 40500, "Kuningan 3 mm": 49500 },
    "Diameter 6 cm": { "Kuningan 0,8 mm": 34500, "Kuningan 1 mm": 35000, "Kuningan 1,5 mm": 42000, "Kuningan 2 mm": 47500, "Kuningan 3 mm": 61000 },
    "Diameter 6,5 cm": { "Kuningan 0,8 mm": 35000, "Kuningan 1 mm": 36000, "Kuningan 1,5 mm": 43500, "Kuningan 2 mm": 49000, "Kuningan 3 mm": 63000 },
    "Diameter 7 cm": { "Kuningan 0,8 mm": 36000, "Kuningan 1 mm": 37000, "Kuningan 1,5 mm": 44500, "Kuningan 2 mm": 51000, "Kuningan 3 mm": 65500 },
    "Diameter 7,5 cm": { "Kuningan 0,8 mm": 40500, "Kuningan 1 mm": 42000, "Kuningan 1,5 mm": 52500, "Kuningan 2 mm": 60500, "Kuningan 3 mm": 80500 },
    "Diameter 8 cm": { "Kuningan 0,8 mm": 46000, "Kuningan 1 mm": 47500, "Kuningan 1,5 mm": 58500, "Kuningan 2 mm": 67500, "Kuningan 3 mm": 88500 },
    "Diameter 9 cm": { "Kuningan 0,8 mm": 55500, "Kuningan 1 mm": 56500, "Kuningan 1,5 mm": 69000, "Kuningan 2 mm": 78500, "Kuningan 3 mm": 101000 },
  }

  const medaliOngkosChrome: Record<string, number> = {
    "Diameter 5,5 cm": 6000,
    "Diameter 6 cm": 7000,
    "Diameter 6,5 cm": 7000,
    "Diameter 7 cm": 8000,
    "Diameter 7,5 cm": 8000,
    "Diameter 8 cm": 9000,
    "Diameter 9 cm": 10000,
  }

  const medaliHargaTali: Record<string, number> = {
    "Tanpa Tali": 0,
    "Tali Polyester 3cm - 90cm": 5000,
    "Pita Sablon 1 Warna - 90cm": 6000,
    "Lanyard 2cm - 90cm": 8000,
    "Lanyard 2,5cm - 90cm": 10000,
    "Lanyard 3cm - 90cm": 12000,
  }

const medaliCustomQty = Math.max(6, parseInt(medaliOrderQty) || 6)
  const medaliBase = isMedaliCustom
    ? medaliCustomPricing[selectedSize]?.[selectedThickness] || 0
    : 0
  const medaliFixed = isMedaliCustom
    ? (selectedWarnaMedali === "Poles tanpa Chrome" ? 4000 : medaliOngkosChrome[selectedSize] || 0)
    + (medaliHargaTali[selectedTaliMedali] || 0)
    : 0
  const medaliUnitPrice = medaliBase + medaliFixed
  const medaliCustomPrice = medaliUnitPrice * medaliCustomQty
  const medaliDiscountInfo = isMedaliCustom
    ? getMedaliDiscount(medaliCustomQty)
    : { percent: 0, bigNego: false, discount: 0, message: "" }
  const medaliBigNego = medaliDiscountInfo.bigNego
  const medaliCustomDiscount = medaliDiscountInfo.percent
  const medaliBaseTotal = medaliBase * medaliCustomQty
  const medaliSavings = medaliBaseTotal * medaliCustomDiscount
  const medaliCustomFinalPrice = medaliBigNego
    ? medaliCustomPrice
    : medaliBaseTotal * (1 - medaliCustomDiscount) + medaliFixed * medaliCustomQty
  const isMedaliCustomSize = isMedaliCustom && selectedSize === "Diameter Custom"

  const isInteractivePrice = isPlakatInstansi || isPialaOlahraga || isMedaliCustom
  const interactiveQty = isMedaliCustom ? medaliCustomQty : plakatInstansiQty
  const interactivePrice = isMedaliCustom ? medaliCustomPrice : plakatInstansiPrice
  const interactiveFinalPrice = isMedaliCustom ? medaliCustomFinalPrice : plakatInstansiFinalPrice
  const interactiveDiscount = isMedaliCustom ? medaliCustomDiscount : plakatInstansiDiscount
  const interactiveBigNego = isMedaliCustom && medaliBigNego
  const isInteractiveCustom = isMedaliCustomSize
  const interactiveSummary = isMedaliCustom
    ? `${selectedSize} | ${selectedThickness} | ${medaliCustomQty} pcs`
    : `${selectedPlakatInstansiSize} | ${selectedPlakatInstansiThickness} | ${selectedKemasan} | ${plakatInstansiQty} pcs`

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
    ? `Halo Karyamedia Souvenir, saya tertarik dengan produk ${product.code} (${product.name}).\n\nDetail pemesanan:\n- Kegunaan: ${product.usage}\n- Material Bahan: Akrilik | Stand Resin Fiberglass\n- Warna/Finishing: UV Flatbed Printing\n- Ukuran: ${selectedPlakatInstansiSize}\n- Ketebalan: ${selectedPlakatInstansiThickness}\n- Kemasan: ${selectedKemasan}${customKemasan ? ` (${customKemasan})` : ""}\n- Jumlah: ${selectedPlakatInstansiQty} pcs\n- Total Harga: ${formatPlakatInstansiPrice(plakatInstansiFinalPrice)}\n- Estimasi Produksi: ${getEstimasiProduksi(plakatInstansiQty)}\n\nMohon informasi harga dan estimasi pengerjaannya.`
    : isPialaOlahraga
    ? `Halo Karyamedia Souvenir, saya tertarik dengan produk ${product.code} (${product.name}).\n\nDetail pemesanan:\n- Ukuran: ${selectedPlakatInstansiSize}\n- Ketebalan: ${selectedPlakatInstansiThickness}\n- Kemasan: ${selectedKemasan}${customKemasan ? ` (${customKemasan})` : ""}\n- Jumlah: ${selectedPlakatInstansiQty} pcs\n- Total Harga: ${formatPlakatInstansiPrice(plakatInstansiFinalPrice)}\n- Estimasi Produksi: ${getEstimasiProduksi(plakatInstansiQty)}\n\nMohon informasi harga dan estimasi pengerjaannya.`
    : isMedaliCustom
    ? `Halo Karyamedia Souvenir, saya tertarik dengan produk ${product.code} (${product.name}).\n\nDetail pemesanan:\n- Ukuran: ${selectedSize}\n- Ketebalan: ${selectedThickness}\n- Warna/Finishing: ${selectedWarnaMedali}\n- Tali Medali: ${selectedTaliMedali}${customTaliMedali ? ` (${customTaliMedali})` : ""}\n- Jumlah: ${medaliCustomQty} pcs${isMedaliCustomSize ? "" : `\n- Total Harga: ${medaliBigNego ? "Big Diskon (Nego)" : formatPlakatInstansiPrice(medaliCustomFinalPrice)}`}\n- Estimasi Produksi: ${getEstimasiProduksi(medaliCustomQty)}\n\nMohon informasi harga dan estimasi pengerjaannya.`
    : generateWhatsAppMessage(product.code, product.name)

  const iconColors: Record<string, string> = {
    Bahan: "text-blue-600",
    "Material Bahan": "text-blue-600",
    "Logo & Tulisan": "text-purple-600",
    Stand: "text-amber-600",
    Logo: "text-purple-600",
    Ukuran: "text-orange-500",
    "Pilih Ukuran": "text-orange-500",
    "Ukuran Plakat": "text-orange-500",
    "Pilih Ukuran Plakat": "text-orange-500",
    "Pilih Ukuran Piala": "text-orange-500",
    "Ketebalan Bahan": "text-slate-600",
    "Pilih Ketebalan bahan": "text-slate-600",
    "Pilih Ketebalan Bahan": "text-slate-600",
    "Warna/Finishing": "text-pink-500",
    "Warna Bahan": "text-pink-500",
    "Perpaduan Bahan": "text-amber-600",
    Kegunaan: "text-emerald-600",
    Kemasan: "text-amber-600",
    "Pilih Kemasan": "text-amber-600",
    "Varian Ukuran As": "text-orange-500",
    "Varian Ukuran": "text-orange-500",
    "Harga Satuan": "text-emerald-600",
    Harga: "text-emerald-600",
    "Jumlah Order": "text-red-500",
    "Minimal Order": "text-red-500",
    "Tali Medali": "text-rose-500",
    "Pilih Tali Medali": "text-rose-500",
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
          ...(product.subcategoryId === "pk" || product.subcategoryId === "pm"
            ? [
                {
                  icon: Type,
                  label: "Logo & Tulisan",
                  value: "Plat Stiker Printing",
                },
              ]
            : []
          ),
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
          ...(product.subcategoryId === "pa" || product.subcategoryId === "pf"
            ? [{ icon: Type, label: "Logo & Tulisan", value: "Plat Kuningan | UV Flatbed Printing" }]
            : product.subcategoryId === "pw" || product.subcategoryId === "pkp"
            ? [{ icon: Layers, label: "Perpaduan Bahan", value: "Logam | Kayu | Akrilik" }]
            : product.color && !isMedaliCustom
            ? [{ icon: Palette, label: product.subcategoryId === "mi" ? "Warna Bahan" : "Warna/Finishing", value: product.color }]
            : []
          ),
          ...(product.subcategoryId === "pw" || product.subcategoryId === "pkp"
            ? [
                {
                  icon: Ruler,
                  label: "Varian Ukuran",
                  value: (
                    <div className="space-y-1">
                      <select
                        value={selectedUkuranWayang}
                        onChange={(e) => setSelectedUkuranWayang(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        {ukuranWayangOptions.map((opt) => (
                          <option key={opt} value={opt}>{labelUkuranWayang(opt)}</option>
                        ))}
                      </select>
                      {selectedUkuranWayang === "Custom" && (
                        <input
                          type="text"
                          value={customUkuranWayang}
                          onChange={(e) => setCustomUkuranWayang(e.target.value)}
                          placeholder="tulis ukuran custom anda, mis. 18x24 cm"
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                      )}
                    </div>
                  ),
                },
              ]
            : []
          ),
          ...(isPlakatInstansi || isPialaOlahraga
            ? [
                {
                  icon: Ruler,
                  label: isPialaOlahraga ? "Pilih Ukuran Piala" : "Pilih Ukuran Plakat",
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
                  label: isPialaOlahraga ? "Pilih Ketebalan Bahan" : "Pilih Ketebalan bahan",
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
                    <div className="space-y-1">
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
                        <input
                          type="text"
                          value={customKemasan}
                          onChange={(e) => setCustomKemasan(e.target.value)}
                          placeholder={
                            selectedKemasan === "Box Kertas Import"
                              ? "tulis pilihan warna, mis. hitam, coklat, gold"
                              : selectedKemasan === "Box Batik"
                              ? "tulis jenis batik yang anda inginkan, mis. truntum, sidomukti, kawung"
                              : selectedKemasan === "Box Custom"
                              ? "kain bisa custom, sesuai motif khas daerah di kota anda"
                              : "tulis pilihan warna box anda, mis. bludru biru satin kuning"
                          }
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                      )}
                      {selectedKemasan === "Box Custom" && (
                        <p className="text-[11px] text-amber-600 font-medium">tambahan logo/tulisan di box ada biaya cetak</p>
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
                  label: isMedaliCustom ? "Pilih Ketebalan Bahan" : "Ketebalan Bahan",
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
              : !isPlakatInstansi && !isPialaOlahraga && product.thickness
              ? [{ icon: Package, label: "Ketebalan Bahan", value: product.thickness }]
              : []
          ),
          ...(product.subcategoryId === "pw" || product.subcategoryId === "pkp"
            ? [
                {
                  icon: Box,
                  label: "Pilih Kemasan",
                  value: (
                    <div className="space-y-1">
                      <select
                        value={selectedKemasanWayang}
                        onChange={(e) => setSelectedKemasanWayang(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        {kemasanWayangOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {selectedKemasanWayang !== "Kertas Marga (free)" && (
                        <input
                          type="text"
                          value={customKemasanWayang}
                          onChange={(e) => setCustomKemasanWayang(e.target.value)}
                          placeholder={
                            selectedKemasanWayang === "Box Batik"
                              ? "tulis jenis batik yang anda inginkan, mis. truntum, sidomukti, kawung"
                              : selectedKemasanWayang === "Box Custum"
                              ? "Tulis ukuran PxLxT, warna box, tambah logo jika diperlukan"
                              : "tulis pilihan warna box anda, mis. bludru biru satin kuning"
                          }
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                      )}
                      {selectedKemasanWayang === "Box Custum" && (
                        <p className="text-[11px] text-amber-600 font-medium">tambahan logo/tulisan di box ada biaya cetak</p>
                      )}
                    </div>
                  ),
                },
              ]
            : product.standMaterial
            ? [{ icon: Package, label: "Stand", value: product.standMaterial }]
            : []
          ),
          ...(product.logoType ? [{ icon: Type, label: "Logo", value: product.logoType }] : []),
          ...(isBataswilayah || isMedaliCustom
            ? [
                {
                  icon: Ruler,
                  label: isMedaliCustom ? "Pilih Ukuran" : (product.subcategoryId === "cp" ? "Diameter" : "Ukuran"),
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
            : isPlakatInstansi || isPialaOlahraga || product.subcategoryId === "pw" || product.subcategoryId === "pkp"
            ? []
            : [{ icon: Ruler, label: product.subcategoryId === "cp" ? "Diameter" : "Ukuran", value: product.size } as { icon: any; label: string; value: string }]
          ),
          ...(isMedaliCustom
            ? [
                {
                  icon: Palette,
                  label: "Warna/Finishing",
                  value: (
                    <select
                      value={selectedWarnaMedali}
                      onChange={(e) => setSelectedWarnaMedali(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    >
                      {warnaMedaliOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ),
                },
              ]
            : []
          ),
          ...(isMedaliCustom
            ? [
                {
                  icon: Ribbon,
                  label: "Pilih Tali Medali",
                  value: (
                    <div className="space-y-1">
                      <select
                        value={selectedTaliMedali}
                        onChange={(e) => setSelectedTaliMedali(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        {taliMedaliOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {(selectedTaliMedali === "Tali Polyester 3cm - 90cm" || selectedTaliMedali === "Pita Sablon 1 Warna - 90cm") && (
                        <input
                          type="text"
                          value={customTaliMedali}
                          onChange={(e) => setCustomTaliMedali(e.target.value)}
                          placeholder={
                            selectedTaliMedali === "Pita Sablon 1 Warna - 90cm"
                              ? "tulis pilihan warna pita, mis. merah, biru, hijau, kuning, hitam"
                              : "tulis pilihan warna, mis. merah putih, biru putih, hijau putih"
                          }
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                      )}
                    </div>
                  ),
                },
              ]
            : []
          ),
          ...(product.subcategoryId === "cp"
            ? [
                {
                  icon: Ruler,
                  label: "Varian Ukuran As",                  value: (
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
            : isMedaliCustom
            ? [
                {
                  icon: ShoppingCart,
                  label: medaliCustomQty === 6 ? "Minimal Order" : "Jumlah Order",
                  value: (
                    <MedaliQtyInput
                      min={6}
                      initial={6}
                      onCommit={(v) => setMedaliOrderQty(v)}
                    />
                  ),
                },
                {
                  icon: Tag,
                  label: "Harga Satuan",
                  value: isMedaliCustomSize ? "Menyesuaikan ukuran custom" : medaliBigNego ? "Nego" : (
                    <div className="space-x-2">
                      {medaliCustomDiscount > 0 && (
                        <span className="text-sm line-through text-gray-400">{formatPlakatInstansiPrice(medaliCustomPrice / medaliCustomQty)}</span>
                      )}
                      <span className="text-sm font-bold text-accent">{formatPlakatInstansiPrice(medaliCustomFinalPrice / medaliCustomQty)}</span>
                    </div>
                  ),
                },
              ]
            : isPlakatInstansi || isPialaOlahraga
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
          ...(product.subcategoryId === "pw" || product.subcategoryId === "pkp"
            ? [
                {
                  icon: ShoppingCart,
                  label: "Jumlah Order",
                  value: (
                    <div className="space-y-1">
                      <input
                        type="number"
                        min={1}
                        value={orderQuantityWayang}
                        onChange={(e) => setOrderQuantityWayang(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <p className="text-[11px] text-gray-500">Masukkan jumlah yang dibutuhkan</p>
                    </div>
                  ),
                },
              ]
            : []
          ),
          ...(product.moldingFee ? [{ icon: Package, label: "Biaya Molding", value: product.moldingFee }] : []),
          { icon: Clock, label: "Estimasi Produksi", value: isInteractivePrice ? getEstimasiProduksi(interactiveQty) : product.productionTime },
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
        ) : isInteractivePrice ? (
          isInteractiveCustom ? (
            <div>
              <p className="text-2xl font-extrabold text-primary">{product.price}</p>
              <p className="text-sm text-gray-500 mt-1">Ukuran custom — harga menyesuaikan, hubungi kami untuk konsultasi gratis.</p>
            </div>
          ) : interactiveBigNego ? (
          <div>
            <p className="text-2xl font-extrabold text-accent">Big Diskon (Nego)</p>
            <p className="text-sm text-gray-500 mt-1">{interactiveSummary}</p>
          </div>
          ) : (
          <div>
            {interactiveDiscount > 0 ? (
              <>
                <p className="text-sm line-through text-gray-400">{formatPlakatInstansiPrice(interactivePrice)}</p>
                <p className="text-2xl font-extrabold text-accent">{formatPlakatInstansiPrice(interactiveFinalPrice)}</p>
              </>
            ) : (
              <p className="text-2xl font-extrabold text-primary">{formatPlakatInstansiPrice(interactivePrice)}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">{interactiveSummary}</p>
          </div>
          )
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
        {isInteractivePrice && !isInteractiveCustom && isMedaliCustom && medaliBigNego && (
          <p className="text-sm font-medium text-green-700 mt-1">
            Big Diskon (Nego) untuk pembelian di atas <span className="text-xl font-extrabold text-accent font-serif animate-pulse">1000 pcs</span>! Hubungi kami untuk penawaran terbaik.
          </p>
        )}
        {isInteractivePrice && !isInteractiveCustom && isMedaliCustom && !medaliBigNego && medaliDiscountInfo.percent > 0 && (
          <p className="text-sm font-medium text-green-700 mt-1">
            Diskon <span className="text-xl font-extrabold text-accent drop-shadow-lg animate-bounce font-serif">{medaliDiscountInfo.discount}%</span> telah diterapkan! {medaliDiscountInfo.message}, hemat {formatPlakatInstansiPrice(medaliSavings)}.
          </p>
        )}
        {isInteractivePrice && !isInteractiveCustom && isMedaliCustom && !medaliBigNego && medaliDiscountInfo.percent === 0 && (
          <p className="text-sm font-medium text-gray-700 mt-1">
            Pesan minimal 50 pcs untuk mendapatkan diskon <span className="text-xl font-extrabold text-accent font-serif animate-pulse">7,5%</span> otomatis! Semakin banyak, semakin hemat.
          </p>
        )}
        {isInteractivePrice && !isInteractiveCustom && !isMedaliCustom && interactiveDiscount > 0 && (
          <p className="text-sm font-medium text-green-700 mt-1">
            Diskon <span className="text-xl font-extrabold text-accent drop-shadow-lg animate-bounce font-serif">{getDiscountMessage(interactiveQty).discount}%</span> telah diterapkan! {getDiscountMessage(interactiveQty).message}, hemat {formatPlakatInstansiPrice(interactivePrice * interactiveDiscount)}.
          </p>
        )}
        {isInteractivePrice && !isInteractiveCustom && !isMedaliCustom && interactiveDiscount === 0 && (
          <p className="text-sm font-medium text-gray-700 mt-1">
            Pesan minimal 10 pcs untuk mendapatkan diskon <span className="text-xl font-extrabold text-accent font-serif animate-pulse">10%</span> otomatis! Semakin banyak, semakin hemat.
          </p>
        )}
        {isInteractivePrice && !isInteractiveCustom && isMedaliCustom && (
          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 mb-1">Tabel Diskon Medali:</p>
            <div className="grid grid-cols-5 gap-1 text-xs">
              <div className="text-center p-1 bg-white rounded">6-49 pcs</div>
              <div className="text-center p-1 bg-white rounded">50-99 pcs</div>
              <div className="text-center p-1 bg-white rounded">100-199 pcs</div>
              <div className="text-center p-1 bg-white rounded">200-500 pcs</div>
              <div className="text-center p-1 bg-white rounded">≥501 pcs</div>
              <div className="text-center p-1 bg-gray-100 rounded font-medium">0%</div>
              <div className="text-center p-1 bg-green-50 rounded font-medium text-green-600">7,5%</div>
              <div className="text-center p-1 bg-green-50 rounded font-medium text-green-600">10%</div>
              <div className="text-center p-1 bg-green-50 rounded font-medium text-green-600">12,5%</div>
              <div className="text-center p-1 bg-green-50 rounded font-medium text-green-600">15%</div>
            </div>
          </div>
        )}
        {isInteractivePrice && !isInteractiveCustom && !isMedaliCustom && (
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
        {isInteractivePrice && !isInteractiveCustom && (
          <p className="text-xs text-gray-500 mt-1">
            {formatPlakatInstansiPrice(interactivePrice / interactiveQty)} × {interactiveQty} pcs
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
