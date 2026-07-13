import Link from "next/link"
import { Metadata } from "next"
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  Shield,
  Truck,
  HelpCircle,
  CheckCircle2,
} from "lucide-react"
import { companyInfo } from "@/data/company"
import { getWhatsAppLink } from "@/lib/utils"
import { SparklesCore } from "@/components/ui/sparkles-core"

export const metadata: Metadata = {
  title: "Kontak Kami",
  description: "Hubungi Karyamedia Souvenir untuk konsultasi & pemesanan souvenir custom. WhatsApp 0822-4358-0777 atau kunjungi workshop kami di Jogja.",
  alternates: {
    canonical: "/kontak",
  },
  openGraph: {
    title: "Kontak Karyamedia Souvenir - Konsultasi Souvenir Custom",
    description: "Hubungi kami via WhatsApp, email, atau kunjungi workshop di Yogyakarta. Gratis konsultasi.",
    url: "/kontak",
  },
}

const faqs = [
  {
    q: "Apakah bisa konsultasi dulu sebelum order?",
    a: "Tentu! Konsultasi gratis via WhatsApp. Sampaikan kebutuhan Anda dan tim kami akan membantu memberikan rekomendasi terbaik.",
  },
  {
    q: "Berapa lama respons WhatsApp?",
    a: "Kami biasanya merespons dalam 5–30 menit di jam operasional (Senin-Sabtu 08.00-18.00 WIB).",
  },
  {
    q: "Apakah bisa kunjungan langsung ke workshop?",
    a: "Ya, Anda bisa kunjungi workshop kami di Jl. Menteri Supeno No. 90, Yogyakarta. Sebaiknya buat janji terlebih dahulu via WhatsApp.",
  },
]

export default function KontakPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary py-20">
        <div className="absolute inset-0 opacity-30">
          <SparklesCore
            id="kontak-sparkles"
            background="transparent"
            minSize={0.8}
            maxSize={2}
            particleColor="#D4AF37"
            particleDensity={80}
            speed={2}
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/15 text-accent-accessible px-4 py-1.5 rounded-full text-sm mb-6 border border-accent/20">
            <MessageCircle className="w-4 h-4" />
            Hubungi Kami
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-white mb-4">
            Hubungi Karyamedia Souvenir
          </h1>
          <p className="text-blue-200/80 max-w-2xl mx-auto mb-8">
            Kami siap membantu kebutuhan souvenir custom Anda. Hubungi kami melalui channel yang paling nyaman.
          </p>
          <div className="w-32 h-0.5 bg-gradient-to-r from-accent to-accent-accessible rounded-full shimmer-line mx-auto" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            {
              icon: Phone,
              title: "Telepon/WhatsApp",
              value: companyInfo.whatsapp,
              action: "Chat Sekarang",
              href: getWhatsAppLink(),
            },
            {
              icon: Mail,
              title: "Email",
              value: companyInfo.email,
              action: "Kirim Email",
              href: `mailto:${companyInfo.email}`,
            },
            {
              icon: MapPin,
              title: "Alamat",
              value: "Jl. Menteri Supeno No. 90, Yogyakarta",
              action: "Buka di Google Maps",
              href: "https://www.google.com/maps/place/Karyamedia+Souvenir/@-7.8169638,110.3812425,17z/data=!4m15!1m8!3m7!1s0x2e7a570b42ab55bf:0x371476a1a0620096!2sJl.+Menteri+Supeno+No.90,+Pandeyan,+Kec.+Umbulharjo,+Kota+Yogyakarta,+Daerah+Istimewa+Yogyakarta+55161!3b1!8m2!3d-7.8169638!4d110.3838174!16s%2Fg%2F11g9q4_2nn!3m5!1s0x2e7a5829a7552b7b:0x9ae18b5b53a9e726!8m2!3d-7.8169864!4d110.3838586!16s%2Fg%2F1pzsq22z0?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",
            },
            {
              icon: Clock,
              title: "Jam Operasional",
              value: "Senin-Sabtu 08.00-18.00 WIB",
              action: "Lihat Detail",
              href: "/cara-pesan",
            },
          ].map((item, i) => {
            const gradients = [
              "from-emerald-400 to-green-500",
              "from-blue-400 to-indigo-500",
              "from-amber-400 to-yellow-500",
              "from-slate-300 to-gray-400",
            ]
            const iconColors = [
              "text-emerald-600",
              "text-blue-600",
              "text-amber-600",
              "text-slate-500",
            ]
            const iconBgColors = [
              "bg-emerald-50",
              "bg-blue-50",
              "bg-amber-50",
              "bg-slate-50",
            ]
            return (
              <div key={i} className="relative group hover:animate-wiggle">
                <div className={`absolute -inset-1 bg-gradient-to-r ${gradients[i]} rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-700 group-hover:duration-200`} />
                <div className={`relative bg-white rounded-2xl border border-gray-100 p-6 text-center transition-all shadow-sm group-hover:shadow-xl animate-fade-in-up opacity-0 stagger-${Math.min(i + 1, 6)}`}>
                  <div className={`w-14 h-14 mx-auto rounded-2xl ${iconBgColors[i]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-7 h-7 ${iconColors[i]}`} />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-4">{item.value}</p>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-light hover:underline"
                  >
                    {item.action} <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6">Form Konsultasi</h2>
            <p className="text-gray-600 text-sm mb-6">
              Isi form berikut untuk konsultasi. Tim kami akan merespons dalam 5–30 menit di jam operasional.
            </p>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                  <input
                    id="nama"
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div>
                  <label htmlFor="instansi" className="block text-sm font-medium text-gray-700 mb-1">Instansi/Perusahaan</label>
                  <input
                    id="instansi"
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                    placeholder="Nama instansi"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wa" className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp *</label>
                  <input
                    id="wa"
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                    placeholder="08xx-xxxx-xxxx"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="produk" className="block text-sm font-medium text-gray-700 mb-1">Produk Diminati</label>
                <select id="produk" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] text-gray-700">
                  <option value="">Pilih subkategori produk</option>
                  <optgroup label="Plakat">
                    <option>Plakat Akrilik</option>
                    <option>Plakat Kayu Premium</option>
                    <option>Plakat Marmer</option>
                    <option>Plakat Kayu</option>
                    <option>Plakat Fiberglass</option>
                    <option>Plakat Wayang</option>
                    <option>Souvenir Pernikahan</option>
                  </optgroup>
                  <optgroup label="Medali">
                    <option>Medali Custom</option>
                    <option>Medali 3D Zink Alloy</option>
                  </optgroup>
                  <optgroup label="Piala & Trophy">
                    <option>Piala Trophy</option>
                    <option>Piala Golf</option>
                  </optgroup>
                  <optgroup label="Souvenir Wisuda">
                    <option>Samir/Gordon Wisuda</option>
                    <option>Patung Wisuda</option>
                    <option>Plakat Wisuda Akrilik</option>
                    <option>Kalung Rektor</option>
                    <option>Pedel Tongkat Rektor</option>
                    <option>Baju Toga</option>
                    <option>Map Ijazah</option>
                    <option>Tabung Wisuda</option>
                  </optgroup>
                  <optgroup label="Gift Box">
                    <option>Box Bludru</option>
                    <option>Box Kertas Import</option>
                    <option>Box Batik</option>
                    <option>Box Kertas Marga</option>
                    <option>Box Custom</option>
                  </optgroup>
                  <optgroup label="Accessories">
                    <option>Name Tag</option>
                    <option>Pin/Bross</option>
                    <option>Gantungan Kunci</option>
                    <option>Tumbler</option>
                    <option>Papan Nama</option>
                  </optgroup>
                  <optgroup label="Prasasti">
                    <option>Prasasti Marmer</option>
                    <option>Prasasti Kuningan</option>
                    <option>Prasasti Stainless Steel</option>
                  </optgroup>
                  <optgroup label="Batas Wilayah">
                    <option>Brass Table</option>
                    <option>Center Point (CP)</option>
                  </optgroup>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                  <input
                    id="jumlah"
                    type="number"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                    placeholder="Estimasi jumlah"
                  />
                </div>
                <div>
                  <label htmlFor="kota" className="block text-sm font-medium text-gray-700 mb-1">Kota Tujuan</label>
                  <input
                    id="kota"
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                    placeholder="Kota pengiriman"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="pesan" className="block text-sm font-medium text-gray-700 mb-1">Pesan/Kebutuhan</label>
                <textarea
                  id="pesan"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] resize-none"
                  placeholder="Jelaskan kebutuhan Anda..."
                />
              </div>
              <a
                href={getWhatsAppLink("Halo Karyamedia Souvenir, saya ingin konsultasi melalui form.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#0A1A30] text-white py-3 rounded-xl font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                Kirim Konsultasi via WhatsApp
              </a>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6">Lokasi Kami</h2>
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <iframe
                  src="https://maps.google.com/maps?q=Karyamedia+Souvenir&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Karyamedia Souvenir"
                />
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-700 font-medium">Jl. Menteri Supeno No. 90</p>
                  <p className="text-sm text-gray-500">Pandeyan, Umbulharjo, Yogyakarta 55161</p>
                  <a
                    href="https://www.google.com/maps/place/Karyamedia+Souvenir/@-7.8169638,110.3812425,17z/data=!4m15!1m8!3m7!1s0x2e7a570b42ab55bf:0x371476a1a0620096!2sJl.+Menteri+Supeno+No.90,+Pandeyan,+Kec.+Umbulharjo,+Kota+Yogyakarta,+Daerah+Istimewa+Yogyakarta+55161!3b1!8m2!3d-7.8169638!4d110.3838174!16s%2Fg%2F11g9q4_2nn!3m5!1s0x2e7a5829a7552b7b:0x9ae18b5b53a9e726!8m2!3d-7.8169864!4d110.3838586!16s%2Fg%2F1pzsq22z0?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-light text-sm font-medium mt-2 hover:underline"
                  >
                    Buka di Google Maps <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Keamanan Kontak Resmi</h3>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Satu-satunya nomor WhatsApp resmi: {companyInfo.whatsapp}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Pembayaran hanya ke BCA 1260580864
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Kami tidak pernah meminta transfer ke rekening lain
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div>
            <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6 flex items-center gap-2">
              <Truck className="w-6 h-6 text-primary-light" />
              Ekspedisi Pengiriman
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {companyInfo.shipping.map((s) => (
                <div key={s.name} className="bg-white rounded-xl border border-gray-100 p-4">
                  <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary-light" />
              FAQ Singkat
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{faq.q}</h3>
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-4">Butuh Bantuan Segera?</h2>
          <p className="text-gray-500 mb-8">
            Tim kami siap membantu Anda. Respons cepat di jam operasional.
          </p>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-[#25D366]/30"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp Sekarang
          </a>
        </div>
      </section>
    </>
  )
}
