"use client"

import { useState, useMemo, useEffect } from "react"
import { Calculator, HelpCircle, ChevronRight } from "lucide-react"
import { TimeHeroBg } from "@/components/ui/time-hero-bg"
import { TimeHeading } from "@/components/ui/time-heading"
import { TimeText } from "@/components/ui/time-text"
import {
  materialPrices,
  etchingPrices,
  chromePolesPrices,
  cuttingPrices,
  shapePrices,
  layerPrices,
  colorPrices,
  attachmentPrices,
  kalkulasi,
  formatPrice,
  type KalkulasiOutput,
} from "@/data/pricing-medali"

const allThicknesses = [...new Set(materialPrices.map(m => m.thickness))]
const allSizes = [...new Set(materialPrices.map(m => m.size))]

const getSizesForThickness = (thickness: string) =>
  materialPrices.filter(m => m.thickness === thickness).map(m => m.size)

const cuttingForThickness = (thickness: string) => {
  const mm = parseFloat(thickness.replace("mm", "").replace(",", "."))
  if (mm <= 0.6) return cuttingPrices
  return cuttingPrices.filter(c => !c.label.startsWith("Gunting"))
}

export default function KalkulatorHargaPage() {
  const [thickness, setThickness] = useState("2mm")
  const [size, setSize] = useState("7.5cm")
  const [etching, setEtching] = useState("2 Muka Masir")
  const [finishType, setFinishType] = useState<"chrome" | "poles">("chrome")
  const [finishOption, setFinishOption] = useState("Crome 8 cm")
  const [shape, setShape] = useState("Tebal > 2mm")
  const [layer, setLayer] = useState("Tanpa Lapisan")
  const [coloring, setColoring] = useState("2 Warna")
  const [cutting, setCutting] = useState("Laser Cut 6 cm")
  const [attachment, setAttachment] = useState("Pita Sablon")
  const [quantity, setQuantity] = useState(50)

  const sizes = useMemo(() => getSizesForThickness(thickness), [thickness])
  const cutOptions = useMemo(() => cuttingForThickness(thickness), [thickness])

  const chromeBySize = useMemo(() => {
    const sizeCm = parseFloat(size.replace("cm", "").replace(",", "."))
    const chromeOptions = chromePolesPrices.filter(c => c.label.startsWith("Crome"))
    const sizeNum = chromeOptions.map(c => ({ label: c.label, size: parseFloat(c.label.replace("Crome ", "").replace("cm", "")) }))
    const match = sizeNum.find(s => s.size >= sizeCm)
    if (match) return match.label
    return chromeOptions[chromeOptions.length - 1]?.label || "Crome 8 cm"
  }, [size])

  useEffect(() => {
    if (finishType === "chrome") {
      setFinishOption(chromeBySize)
    }
  }, [chromeBySize, finishType])

  const result = useMemo<KalkulasiOutput | null>(() => {
    if (!quantity || quantity < 1) return null
    return kalkulasi({
      thickness, size, etching,
      finishType, finishOption,
      shape, layer, coloring, cutting, attachment,
      quantity,
    })
  }, [thickness, size, etching, finishType, finishOption, shape, layer, coloring, cutting, attachment, quantity])

  return (
    <>
      <section className="relative overflow-hidden py-20">
        <TimeHeroBg />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative inline-flex overflow-hidden rounded-full p-[1.5px] mb-6">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#D4AF37_0%,#1D4ED8_50%,#D4AF37_100%)]" />
            <div className="inline-flex items-center gap-2 rounded-full bg-primary text-xs font-medium backdrop-blur-3xl">
              <span className="inline-flex items-center gap-2 rounded-full text-center bg-gradient-to-tr from-accent/20 via-primary-light/30 to-transparent text-white border-[1px] border-accent/30 py-2.5 px-6 text-sm font-medium">
                <Calculator className="w-4 h-4" />
                Kalkulator Harga
              </span>
            </div>
          </div>
          <TimeHeading className="text-4xl md:text-5xl mb-4">
            Hitung Estimasi Harga<br />Medali, Samir &amp; PIN Custom
          </TimeHeading>
          <TimeText className="max-w-2xl mx-auto mb-8">
            Pilih spesifikasi produk di bawah untuk mendapatkan estimasi harga secara instan
          </TimeText>
        </div>
      </section>
      <div className="w-full h-0.5 shimmer-line" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Spesifikasi Produk
              </h2>

              {/* Baris 1: Ketebalan & Ukuran */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ketebalan Bahan</label>
                  <select value={thickness} onChange={e => { setThickness(e.target.value); setSize(getSizesForThickness(e.target.value)[0] || "") }}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary">
                    {allThicknesses.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran</label>
                  <select value={size} onChange={e => setSize(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary">
                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Baris 2: Etsa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biaya Etsa</label>
                <select value={etching} onChange={e => setEtching(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary">
                  {etchingPrices.map(e => <option key={e.label} value={e.label}>{e.label} — {formatPrice(e.price)}</option>)}
                </select>
              </div>

              {/* Baris 3: Crome / Poles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Finishing</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="finish" checked={finishType === "chrome"} onChange={() => setFinishType("chrome")}
                        className="w-4 h-4 text-primary" />
                      <span className="text-sm">Crome</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="finish" checked={finishType === "poles"} onChange={() => setFinishType("poles")}
                        className="w-4 h-4 text-primary" />
                      <span className="text-sm">Poles (wajib jika tidak crome)</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pilihan</label>
                  <select value={finishOption} onChange={e => setFinishOption(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary">
                    {finishType === "chrome"
                      ? chromePolesPrices.filter(c => c.label.startsWith("Crome")).map(c => (
                          <option key={c.label} value={c.label}>{c.label} — {formatPrice(c.price)}</option>
                        ))
                      : chromePolesPrices.filter(c => c.label.startsWith("Poles")).map(c => (
                          <option key={c.label} value={c.label}>{c.label} — {formatPrice(c.price)}</option>
                        ))
                    }
                  </select>
                </div>
              </div>

              {/* Baris 4: Flat/Cekung & Lapisan */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flat / Cekung</label>
                  <select value={shape} onChange={e => setShape(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary">
                    {shapePrices.map(s => <option key={s.label} value={s.label}>{s.label} — {formatPrice(s.price)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lapisan Lycal</label>
                  <select value={layer} onChange={e => setLayer(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary">
                    {layerPrices.map(l => <option key={l.label} value={l.label}>{l.label} — {formatPrice(l.price)}</option>)}
                  </select>
                </div>
              </div>

              {/* Baris 5: Pewarnaan & Cutting */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pewarnaan</label>
                  <select value={coloring} onChange={e => setColoring(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary">
                    {colorPrices.map(c => <option key={c.label} value={c.label}>{c.label} — {formatPrice(c.price)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pemotongan</label>
                  <select value={cutting} onChange={e => setCutting(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary">
                    {cutOptions.map(c => <option key={c.label} value={c.label}>{c.label} — {formatPrice(c.price)}</option>)}
                  </select>
                </div>
              </div>

              {/* Baris 6: Kain / Pengait */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kain / Pengait PIN</label>
                <select value={attachment} onChange={e => setAttachment(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary">
                  {attachmentPrices.map(a => <option key={a.label} value={a.label}>{a.label} — {formatPrice(a.price)}</option>)}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pesanan (pcs)</label>
                <input type="number" min={1} value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary" />
              </div>
            </div>
          </div>

          {/* RIGHT: Result */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Estimasi Harga
              </h2>

              {result ? (
                <>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">Bahan ({thickness} / {size})</span>
                      <span className="font-medium">{formatPrice(result.materialPrice)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">Etsa</span>
                      <span className="font-medium">{formatPrice(result.etchingPrice)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">{finishType === "chrome" ? "Crome" : "Poles"}</span>
                      <span className="font-medium">{formatPrice(result.finishPrice)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">Flat/Cekung</span>
                      <span className="font-medium">{formatPrice(result.shapePrice)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">Lapisan</span>
                      <span className="font-medium">{formatPrice(result.layerPrice)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">Pewarnaan</span>
                      <span className="font-medium">{formatPrice(result.coloringPrice)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">Pemotongan</span>
                      <span className="font-medium">{formatPrice(result.cuttingPrice)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">Kain/Pengait</span>
                      <span className="font-medium">{formatPrice(result.attachmentPrice)}</span>
                    </div>

                    <div className="flex justify-between py-2 font-bold text-gray-900 border-b-2 border-gray-200">
                      <span>Total HPP</span>
                      <span>{formatPrice(result.totalHPP)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-sm text-gray-600">
                      <span>Markup (Qty {result.markupLabel})</span>
                      <span>+{result.markupPercent}%</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-extrabold text-primary">
                      <span>Harga/pcs</span>
                      <span>{formatPrice(result.finalPrice)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-xl font-bold text-gray-900 bg-primary/5 rounded-xl px-3">
                      <span>Total ({quantity} pcs)</span>
                      <span>{formatPrice(result.totalPrice)}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/6281227444984?text=Halo%20Karyamedia%2C%20saya%20dapat%20estimasi%20harga%20dari%20kalkulator%3A%0A${encodeURIComponent(
                      `- Bahan: ${thickness} / ${size}\n- Etsa: ${etching}\n- Finishing: ${finishOption}\n- Flat/Cekung: ${shape}\n- Lapisan: ${layer}\n- Pewarnaan: ${coloring}\n- Potong: ${cutting}\n- Kain: ${attachment}\n- Qty: ${quantity} pcs\n- Estimasi: ${formatPrice(result.finalPrice)}/pcs = ${formatPrice(result.totalPrice)}`
                    )}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#075E54] hover:bg-[#054E43] text-white py-3 rounded-xl font-medium transition-all"
                  >
                    Konsultasi via WhatsApp
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </>
              ) : (
                <p className="text-sm text-gray-500">Pilih spesifikasi produk untuk melihat estimasi harga.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
