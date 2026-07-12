import Link from "next/link"
import { Metadata } from "next"
import { StepCircle } from "@/components/step-circle"
import {
  MessageCircle,
  Send,
  PenTool,
  Settings,
  Truck,
  CheckCircle,
  Shield,
  CreditCard,
  ChevronRight,
  ArrowRight,
  Package,
  ClipboardList,
  Calculator,
  HelpCircle,
} from "lucide-react"
import { companyInfo } from "@/data/company"
import { getWhatsAppLink } from "@/lib/utils"
import { FaqAccordion } from "@/components/faq-accordion"
import { KetentuanCards } from "@/components/ketentuan-cards"

export const metadata: Metadata = {
  title: "Cara Pesan Souvenir Custom",
  description: "Panduan lengkap cara memesan souvenir custom di Karyamedia Souvenir. Dari konsultasi, desain, produksi, hingga pengiriman ke seluruh Indonesia.",
  alternates: {
    canonical: "/cara-pesan",
  },
  openGraph: {
    title: "Cara Pesan Souvenir Custom - Karyamedia Souvenir",
    description: "Proses pemesanan yang mudah, transparan, dan profesional. Konsultasi gratis via WhatsApp.",
    url: "/cara-pesan",
  },
}

const orderSteps = [
  {
    step: 1,
    icon: Package,
    title: "Pilih Produk",
    desc: "Jelajahi katalog produk kami dan pilih produk yang sesuai kebutuhan Anda. Lihat detail spesifikasi, bahan, dan opsi custom.",
    iconColor: "#059669",
  },
  {
    step: 2,
    icon: ClipboardList,
    title: "Tentukan Spesifikasi",
    desc: "Tentukan jumlah, ukuran, bahan, warna, dan detail custom seperti logo, teks, atau desain khusus yang diinginkan.",
    iconColor: "#0284C7",
  },
  {
    step: 3,
    icon: Send,
    title: "Kirim Permintaan Penawaran",
    desc: "Hubungi kami via WhatsApp atau isi form request quote. Sertakan detail kebutuhan dan referensi desain jika ada.",
    iconColor: "#7C3AED",
  },
  {
    step: 4,
    icon: MessageCircle,
    title: "Konsultasi & Penawaran Harga",
    desc: "Tim kami akan merespons dengan penawaran harga terbaik sesuai spesifikasi dan anggaran Anda.",
    iconColor: "#0D9488",
  },
  {
    step: 5,
    icon: PenTool,
    title: "Persetujuan Desain",
    desc: "Kami buatkan desain/mockup untuk persetujuan Anda sebelum produksi dimulai. Revisi hingga sesuai keinginan.",
    iconColor: "#D97706",
  },
  {
    step: 6,
    icon: CreditCard,
    title: "Pembayaran",
    desc: "Lakukan pembayaran via QRIS atau Transfer Bank BCA (No. Rek: 1260580864). Pastikan hanya transfer ke rekening resmi.",
    iconColor: "#CA8A04",
  },
  {
    step: 7,
    icon: Settings,
    title: "Proses Produksi",
    desc: "Produk diproduksi oleh pengerajin berpengalaman dengan kontrol kualitas ketat di setiap tahapan.",
    iconColor: "#475569",
  },
  {
    step: 8,
    icon: CheckCircle,
    title: "Quality Control & Packing",
    desc: "Setiap produk melewati QC ketat sebelum dikemas dengan bubble wrap, karton, atau packing kayu sesuai karakter barang.",
    iconColor: "#16A34A",
  },
  {
    step: 9,
    icon: Truck,
    title: "Pengiriman",
    desc: "Produk dikirim via ekspedisi pilihan Anda (JNE, TIKI, Lion Parcel, Bus, atau Cargo) ke seluruh Indonesia.",
    iconColor: "#4F46E5",
  },
]

const faqs = [
  {
    q: "Berapa lama proses produksi?",
    a: "Estimasi produksi bervariasi tergantung produk dan jumlah, umumnya 7-30 hari kerja. Produk custom dengan detail kompleks membutuhkan waktu lebih lama.",
  },
  {
    q: "Apakah bisa custom desain?",
    a: "Ya, semua produk kami bisa di-custom sesuai kebutuhan. Kirimkan logo, konsep, atau referensi desain via WhatsApp untuk konsultasi gratis.",
  },
  {
    q: "Bagaimana cara pembayaran?",
    a: "Kami menerima pembayaran via QRIS dan Transfer Bank BCA (No. Rek: 1260580864). Pastikan hanya transfer ke rekening resmi yang terkonfirmasi admin.",
  },
  {
    q: "Apakah ada minimal order?",
    a: "Minimal order bervariasi per produk. Beberapa produk bisa dipesan mulai 1 pcs, sementara yang lain membutuhkan minimal 50-100 pcs.",
  },
  {
    q: "Bagaimana dengan ongkos kirim?",
    a: "Ongkir tergantung berat, ukuran, dan tujuan pengiriman. Kami bisa bantu estimasi ongkir via WhatsApp sebelum Anda memutuskan order.",
  },
]

export default function CaraPesanPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-1.5 rounded-full text-sm mb-6">
            <ClipboardList className="w-4 h-4" />
            Cara Pesan
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-white mb-4">
            Cara Memesan di<br />Karyamedia Souvenir
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Proses pemesanan yang mudah, transparan, dan profesional
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary/5 rounded-2xl p-8 mb-16">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-3">Alur Pemesanan</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Berikut alur lengkap pemesanan di Karyamedia Souvenir. Kami tidak menggunakan sistem checkout e-commerce kaku,
            melainkan konsultasi langsung untuk memastikan setiap produk sesuai kebutuhan Anda.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line behind circles (desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block -translate-x-1/2" />

          <div className="space-y-0">
            {orderSteps.map((item, i) => {
              const isLeft = i % 2 === 0
              return (
                <div key={item.step} className="group relative flex gap-4 items-start md:block md:min-h-[110px]">
                  {/* Circle - left on mobile, absolutely centered on desktop */}
                  <StepCircle step={item.step} isLast={i === orderSteps.length - 1} />

                  {/* Content */}
                  <div className={`flex-1 pb-8 md:max-w-[calc(50%-2rem)] ${isLeft ? 'md:mr-auto md:pr-10 md:text-right' : 'md:ml-auto md:pl-10 md:text-left'}`}>
                    <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                      <item.icon className="w-5 h-5 shrink-0 group-hover:text-accent transition-colors" style={{ color: item.iconColor }} />
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-accent transition-colors">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-8 flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent" />
            Ketentuan Penting
          </h2>
          <KetentuanCards />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-8 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-accent" />
          FAQ - Pertanyaan Umum
        </h2>
        <FaqAccordion items={faqs} />
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">Siap Memesan?</h2>
          <p className="text-gray-500 mb-8">
            Hubungi kami sekarang untuk konsultasi gratis dan penawaran harga terbaik.
          </p>
          <a
            href={getWhatsAppLink("Halo Karyamedia Souvenir, saya ingin memesan produk.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-[#25D366]/30"
          >
            <MessageCircle className="w-5 h-5" />
            Pesan via WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
