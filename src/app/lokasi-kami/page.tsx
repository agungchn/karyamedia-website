import { Metadata } from "next"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, ArrowRight, MessageCircle, Package, Truck, Plane, Bus, Ship } from "lucide-react"
import { companyInfo } from "@/data/company"
import { getWhatsAppLink } from "@/lib/utils"
import { BatikBackground } from "@/components/ui/batik-bg"
import { GoogleMapEmbed } from "@/components/ui/google-map-embed"

export const metadata: Metadata = {
  title: "Lokasi Kami",
  description: "Alamat workshop Karyamedia Souvenir di Jl. Menteri Supeno No. 90, Pandeyan, Umbulharjo, Yogyakarta. Produsen plakat, medali, dan souvenir custom sejak 2001.",
  alternates: {
    canonical: "/lokasi-kami",
  },
  openGraph: {
    title: "Lokasi Karyamedia Souvenir - Produsen Souvenir Custom Jogja",
    description: "Alamat workshop Karyamedia Souvenir di Yogyakarta. Melayani pengiriman ke seluruh Indonesia.",
    url: "/lokasi-kami",
  },
}

export default function LokasiKamiPage() {
  return (
    <>
      <section className="relative overflow-hidden py-16 md:py-24">
        <BatikBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-accent-accessible font-medium mb-3">Lokasi</p>
            <h1 className="heading-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-4">Lokasi Kami</h1>
            <p className="text-gray-600 text-lg">
              Kunjungi workshop kami di Yogyakarta untuk konsultasi langsung dan melihat contoh produk.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <GoogleMapEmbed title="Peta Lokasi Karyamedia Souvenir" height={450} />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent-accessible" />
                  Alamat Workshop
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {companyInfo.address}
                </p>
                <a
                  href="https://www.google.com/maps/place/Karyamedia+Souvenir/@-7.8169638,110.3812425,17z/data=!4m15!1m8!3m7!1s0x2e7a570b42ab55bf:0x371476a1a0620096!2sJl.+Menteri+Supeno+No.90,+Pandeyan,+Kec.+Umbulharjo,+Kota+Yogyakarta,+Daerah+Istimewa+Yogyakarta+55161!3b1!8m2!3d-7.8169638!4d110.3838174!16s%2Fg%2F11g9q4_2nn!3m5!1s0x2e7a5829a7552b7b:0x9ae18b5b53a9e726!8m2!3d-7.8169864!4d110.3838586!16s%2Fg%2F1pzsq22z0?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary-light text-sm font-medium hover:underline"
                >
                  Buka di Google Maps <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-accent-accessible mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp / Telepon</p>
                    <p className="text-sm font-medium text-gray-900">{companyInfo.whatsapp}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent-accessible mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{companyInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-accent-accessible mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Jam Operasional</p>
                    <p className="text-sm font-medium text-gray-900">{companyInfo.operationalHours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6">Wilayah Pelayanan</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Kami melayani pengiriman ke seluruh Indonesia melalui berbagai ekspedisi terpercaya.
                Dari Sabang sampai Merauke, produk kami dapat dijangkau oleh klien di mana pun berada.
                Tidak perlu datang langsung — Anda dapat memesan dari kota mana pun dan barang akan dikirim ke alamat Anda.
              </p>
              <div className="flex flex-wrap gap-2">
                {companyInfo.shipping.map((s) => {
                  const iconMap: Record<string, React.ReactNode> = {
                    "Lion Parcel": <Package className="w-4 h-4" />,
                    "JNE": <Truck className="w-4 h-4" />,
                    "TIKI": <Plane className="w-4 h-4" />,
                    "Bus Puspasari (Jogja–Bali–NTB)": <Bus className="w-4 h-4" />,
                    "Bus Lintas Sumatera": <Bus className="w-4 h-4" />,
                    "Cargo Port to Port": <Ship className="w-4 h-4" />,
                  }
                  return (
                    <span key={s.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-light/10 text-primary-light rounded-full text-sm font-medium">
                      {iconMap[s.name] || <Package className="w-4 h-4" />}
                      {s.name}
                    </span>
                  )
                })}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-4">Mau Konsultasi?</h2>
              <p className="text-gray-600 text-sm mb-6">
                Tim kami siap membantu Anda memilih produk yang tepat. Hubungi kami via WhatsApp untuk konsultasi gratis.
              </p>
              <div className="space-y-4">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#075E54] hover:bg-[#054E43] text-white px-6 py-3 rounded-full font-medium transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Konsultasi via WhatsApp
                </a>
                <Link
                  href="/katalog-produk"
                  className="flex items-center justify-center gap-2 w-full border border-primary/20 text-primary hover:bg-primary/5 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Lihat Katalog Produk <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
