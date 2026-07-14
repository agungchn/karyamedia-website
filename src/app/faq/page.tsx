import type { Metadata } from "next"
import { MessageCircle, ArrowRight } from "lucide-react"
import { FaqAccordion } from "@/components/faq-accordion"
import { FAQPageSchema } from "@/components/json-ld"
import { GbpReviewCta } from "@/components/gbp-review-cta"
import { companyInfo } from "@/data/company"
import { getWhatsAppLink } from "@/lib/utils"

export const metadata: Metadata = {
  title: "FAQ - Karyamedia Souvenir",
  description:
    "Pertanyaan umum seputar pemesanan souvenir custom di Karyamedia Souvenir: jam operasional, alamat workshop, pengiriman, cara pesan, pembayaran, dan garansi kualitas.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ Karyamedia Souvenir - Pemesanan Souvenir Custom",
    description:
      "Jawaban lengkap seputar souvenir custom: jam buka, alamat, pengiriman seluruh Indonesia, cara pesan, dan garansi kualitas.",
    url: "/faq",
  },
}

const faqs = [
  {
    q: "Apa jam operasional Karyamedia Souvenir?",
    a: "Kami beroperasi Senin–Sabtu pukul 08.00–18.00 WIB. Minggu dan hari libur nasional kami tutup. Konsultasi via WhatsApp dilayani di jam operasional tersebut.",
  },
  {
    q: "Di mana alamat workshop Karyamedia Souvenir?",
    a: "Workshop kami berada di Jl. Menteri Supeno No. 90, Pandeyan, Umbulharjo, Yogyakarta 55161. Kunjungan langsung sebaiknya membuat janji terlebih dahulu via WhatsApp 0822-4358-0777.",
  },
  {
    q: "Apakah Karyamedia menerima pesanan dari luar Yogyakarta?",
    a: "Ya. Kami melayani pengiriman ke seluruh Indonesia melalui ekspedisi JNE, Lion Parcel, TIKI, cargo laut/udara, serta titip bus untuk rute Jogja–Bali–NTB dan Sumatera. Order dapat dilakukan sepenuhnya secara online.",
  },
  {
    q: "Produk apa saja yang bisa dipesan?",
    a: "Kami memproduksi plakat (akrilik, kayu, marmer, fiberglass, wayang), medali custom & 3D, piala & trophy, prasasti (marmer, kuningan, stainless), souvenir wisuda (samir, patung, plakat, kalung rektor, toga), gift box, name tag, pin/bross, gantungan kunci, tumbler, dan papan nama.",
  },
  {
    q: "Apakah semua produk bisa custom desain?",
    a: "Ya, setiap produk dapat disesuaikan dengan logo, nama, foto, dan kebutuhan instansi Anda. Tim kami akan membuatkan desain & penawaran sebelum produksi dimulai.",
  },
  {
    q: "Bagaimana cara memesan souvenir di Karyamedia?",
    a: "Cara pesan sangat mudah: (1) Konsultasi via WhatsApp, (2) Kirim referensi/logo, (3) Kami buatkan desain & penawaran, (4) Produksi oleh pengerajin, (5) Quality control lalu pengiriman. Penjelasan lengkap ada di halaman Cara Pesan.",
  },
  {
    q: "Berapa lama waktu pengerjaan pesanan?",
    a: "Waktu produksi bervariasi tergantung jenis dan jumlah pesanan. Untuk estimasi pasti, silakan konsultasi via WhatsApp dengan menyertakan detail produk dan kuantitas yang dibutuhkan.",
  },
  {
    q: "Metode pembayaran apa yang tersedia?",
    a: "Pembayaran dapat dilakukan melalui transfer bank BCA 1260580864 (a.n. Karyamedia) dan QRIS. Pembayaran hanya ke rekening resmi tersebut; kami tidak pernah meminta transfer ke rekening lain.",
  },
  {
    q: "Apakah ada jaminan kualitas?",
    a: "Setiap produk melewati quality control ketat sebelum dikemas dan dikirim. Sebagai produsen berbadan hukum sejak 2001, kami berkomitmen pada hasil yang presisi dan rapi. Kendala dapat dibicarakan langsung via WhatsApp.",
  },
  {
    q: "Apakah Karyamedia sudah berpengalaman?",
    a: "Ya. Karyamedia Souvenir berdiri sejak 2001, berbadan hukum, dan telah melayani berbagai instansi pemerintah, kampus, perusahaan, dan acara wisuda di seluruh Indonesia selama lebih dari dua dekade.",
  },
]

export default function FaqPage() {
  return (
    <>
      <FAQPageSchema items={faqs} />
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/15 text-accent-accessible px-4 py-1.5 rounded-full text-sm mb-6 border border-accent/20">
            <MessageCircle className="w-4 h-4" />
            FAQ
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-white mb-4">
            Pertanyaan Umum
          </h1>
          <p className="text-blue-200/80 max-w-2xl mx-auto">
            Jawaban seputar pemesanan souvenir custom di Karyamedia Souvenir. Masih ada
            pertanyaan? Konsultasi gratis via WhatsApp kami.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FaqAccordion items={faqs} />

        <div className="mt-12 bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
          <h2 className="font-semibold text-gray-900 mb-2">Tidak menemukan jawaban?</h2>
          <p className="text-sm text-gray-500 mb-4">
            Tim kami siap membantu konsultasi gratis untuk kebutuhan souvenir Anda.
          </p>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#075E54] hover:bg-[#054E43] text-white px-6 py-3 rounded-full font-medium transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp
          </a>
        </div>
      </section>

      <GbpReviewCta />
    </>
  )
}
