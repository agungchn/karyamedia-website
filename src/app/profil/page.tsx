import Link from "next/link"
import { Metadata } from "next"
import {
  Calendar,
  Shield,
  Users,
  Palette,
  DollarSign,
  CheckCircle,
  MapPin,
  Award,
  Eye,
  Target,
  Heart,
  ArrowRight,
  MessageCircle,
  Briefcase,
  Globe,
  CheckCircle2,
  Package,
  Truck,
  Plane,
  Bus,
  Ship,
} from "lucide-react"
import { companyInfo } from "@/data/company"
import { GlowCard } from "@/components/ui/glow-card"
import { getWhatsAppLink } from "@/lib/utils"
import { BatikBackground } from "@/components/ui/batik-bg"
import { TentangKamiBanner } from "@/components/tentang-kami-banner"
import { VisiMisiCards } from "@/components/visi-misi-cards"
import { TiltLogo } from "@/components/tilt-logo"

export const metadata: Metadata = {
  title: "Profil Perusahaan",
  description: "Profil Karyamedia Souvenir - Produsen souvenir custom sejak 2001, berbadan hukum, berbasis di Yogyakarta. Pelajari sejarah, visi misi, dan keunggulan kami.",
  alternates: {
    canonical: "/profil",
  },
  openGraph: {
    title: "Profil Karyamedia Souvenir - Produsen Souvenir Custom Jogja",
    description: "Produsen souvenir custom sejak 2001, berbadan hukum, berbasis di Yogyakarta.",
    url: "/profil",
  },
}

export default function ProfilPage() {
  return (
    <>
      <TentangKamiBanner />

      <section className="relative overflow-hidden py-16">
        <BatikBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6">Profil & Identitas Perusahaan</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>Karyamedia Souvenir</strong> adalah produsen souvenir custom yang telah berdiri sejak tahun 2001.
                Berbasis di Yogyakarta, kami telah melayani ribuan klien dari berbagai instansi, perusahaan, universitas,
                dan organisasi di seluruh Indonesia.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Dengan status berbadan hukum, kami menjamin legalitas dan kepercayaan dalam setiap transaksi.
                Seluruh produk diproduksi langsung oleh pengerajin berpengalaman dengan kontrol kualitas yang ketat.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Kami berkomitmen untuk memberikan produk berkualitas tinggi dengan harga yang kompetitif,
                serta pelayanan yang profesional dan responsif.
              </p>
            </div>
            <GlowCard glowColor="blue" customSize className="!p-8">
              <div className="w-full h-0.5 rounded-full shimmer-line mb-6" />
              <div className="space-y-4">
                {[
                  { label: "Nama Perusahaan", value: companyInfo.name },
                  { label: "Berdiri Sejak", value: `Tahun ${companyInfo.established}` },
                  { label: "Status Usaha", value: companyInfo.legalStatus },
                  { label: "Alamat", value: companyInfo.address },
                  { label: "WhatsApp/Telepon", value: companyInfo.whatsapp },
                  { label: "Email", value: companyInfo.email },
                  { label: "Jam Operasional", value: companyInfo.operationalHours },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-light mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <p className="text-sm uppercase tracking-[0.3em] text-accent-accessible font-medium mb-3">Filosofi</p>
              <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-4">Karyamedia Souvenir</h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-accent to-accent-accessible rounded-full shimmer-line mb-6" />
              <p className="heading-display text-xl md:text-2xl text-accent-accessible italic leading-relaxed mb-6">
                &ldquo;Sentuhan Estetik, Berjuta Makna.&rdquo;
              </p>
              <div className="text-gray-700 leading-relaxed text-base md:text-lg">
                <span className="float-left text-6xl md:text-7xl leading-none font-bold text-accent-accessible mr-3 mt-1 heading-display">K</span>
                <p className="leading-relaxed">
                  aryamedia Souvenir lahir dari keyakinan bahwa setiap karya bukan sekadar benda, melainkan media untuk menyampaikan penghargaan, kenangan, identitas, dan kebanggaan. Dalam setiap plakat, medali, piala, map wisuda, prasasti, pin, maupun souvenir custom, terdapat cerita yang ingin diabadikan dengan cara yang indah, rapi, dan bermakna.
                </p>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Intisari</p>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  Setiap produk Karyamedia bukan sekadar benda, melainkan media untuk menyampaikan penghargaan, kenangan, identitas, dan kebanggaan.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-accessible flex items-center justify-center text-white text-lg font-bold">K</div>
                    <div>
                    <p className="text-xs font-medium text-gray-900">Karyamedia</p>
                    <p className="text-xs text-gray-400">Plakat &amp; Souvenir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-sm uppercase tracking-[0.3em] text-accent-accessible font-medium mb-3">Etimologi</p>
              <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6">Makna Nama Karyamedia</h2>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                Nama Karyamedia mengandung dua makna utama. <strong className="text-accent-accessible">&ldquo;Karya&rdquo;</strong> melambangkan hasil cipta, kreativitas, keterampilan, dan ketelitian tangan para pengrajin. Sedangkan <strong className="text-accent-accessible">&ldquo;Media&rdquo;</strong> berarti sarana penyampai pesan. Maka, Karyamedia Souvenir memposisikan setiap produk sebagai media penghargaan yang tidak hanya terlihat menarik, tetapi juga mampu menyampaikan nilai, prestasi, kehormatan, dan momen penting bagi setiap pelanggan.
              </p>
            </div>
            <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
              <div className="text-center">
                <p className="heading-display text-5xl md:text-6xl text-accent-accessible font-bold leading-none">KARYA</p>
                <div className="w-8 h-0.5 bg-accent mx-auto my-3" />
                <p className="heading-display text-5xl md:text-6xl text-primary font-bold leading-none">MEDIA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.3em] text-accent-accessible font-medium mb-3">Makna</p>
          <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6">Slogan &amp; Filosofi</h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent to-accent-accessible rounded-full shimmer-line mb-8" />
          <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-10 max-w-3xl">
            Slogan <strong>&ldquo;Sentuhan Estetik, Berjuta Makna&rdquo;</strong> menggambarkan komitmen Karyamedia Souvenir dalam menghadirkan produk yang tidak hanya fungsional, tetapi juga memiliki nilai visual dan rasa seni.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative pl-8 border-l-2 border-accent">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent border-2 border-white" />
              <h3 className="heading-display text-xl text-accent-accessible italic mb-3">Sentuhan Estetik</h3>
              <p className="text-gray-600 leading-relaxed">
                Berarti setiap produk dikerjakan dengan perhatian pada desain, proporsi, material, warna, finishing, dan detail akhir.
              </p>
            </div>
            <div className="relative pl-8 border-l-2 border-primary">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-white" />
              <h3 className="heading-display text-xl text-primary italic mb-3">Berjuta Makna</h3>
              <p className="text-gray-600 leading-relaxed">
                Bermakna bahwa dari satu ide sederhana dapat lahir banyak kemungkinan karya: karya untuk wisuda, penghargaan, peresmian, kejuaraan, kenang-kenangan, identitas perusahaan, hingga simbol prestasi yang bernilai.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.3em] text-accent-accessible font-medium mb-3">Identitas Visual</p>
          <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6">Filosofi Logo Karyamedia</h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent to-accent-accessible rounded-full shimmer-line mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
            <div className="lg:col-span-5 flex justify-center">
              <TiltLogo />
            </div>
            <div className="lg:col-span-7">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                Logo Karyamedia Souvenir dengan simbol huruf <strong className="text-accent-accessible">K</strong> di dalam bentuk geometris berwarna emas memiliki makna yang kuat dan mendalam.
              </p>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  &ldquo;Karyamedia bukan hanya membuat souvenir, tetapi menciptakan media penghargaan yang mampu menghidupkan momen, memperkuat identitas, dan meninggalkan kesan mendalam.&rdquo;
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title: "Huruf K", desc: "Menjadi identitas utama dari Karyamedia, sekaligus mewakili kata Karya, Kreativitas, Kualitas, Komitmen, dan Kepercayaan. Garis tegak pada huruf K mencerminkan fondasi yang kokoh, prinsip kerja yang kuat, serta konsistensi perusahaan dalam menjaga mutu produk. Sementara garis diagonalnya melambangkan gerak maju, inovasi, dan keberanian untuk terus berkembang." },
              { title: "Bingkai Heksagon", desc: "Melambangkan keseimbangan, ketelitian, dan kekuatan struktur. Bentuk ini mencerminkan proses kerja yang rapi dan terukur: mulai dari konsultasi, desain, pemilihan bahan, produksi, finishing, quality control, hingga produk sampai ke tangan pelanggan. Bentuk geometris yang tegas juga menunjukkan presisi, profesionalitas, dan tanggung jawab." },
              { title: "Warna Emas", desc: "Menjadi simbol prestasi, kemewahan, nilai, dan penghargaan. Warna ini sangat selaras dengan bidang usaha Karyamedia Souvenir yang banyak berkaitan dengan produk apresiasi seperti plakat, medali, trophy, kalung rektor, prasasti, dan souvenir penghargaan. Emas juga menggambarkan cita-cita perusahaan untuk selalu memberikan hasil terbaik, bernilai tinggi, dan membanggakan." },
              { title: "Ruang Putih", desc: "Mencerminkan keterbukaan, kejujuran, dan ruang kreativitas. Maknanya, Karyamedia Souvenir selalu membuka ruang bagi pelanggan untuk membawa ide, desain, logo, identitas, maupun kebutuhan khusus yang kemudian diwujudkan menjadi produk custom yang estetik dan berkesan." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-7 border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 w-full h-0.5 rounded-full shimmer-line" />
                <h3 className="heading-display text-lg text-accent-accessible italic mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible text-center mb-2">Perjalanan Kami Sejak 2001</h2>
          <p className="text-gray-500 text-sm text-center mb-12">Dari awal berdiri hingga kini</p>
          <div className="relative">
            <div className="absolute top-8 left-6 right-6 h-0.5 bg-gradient-to-r from-accent/30 via-accent to-accent/30 hidden md:block rounded-full" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { year: "2001", title: "Berdiri", desc: "Karyamedia Souvenir didirikan di Yogyakarta" },
              { year: "2005", title: "Ekspansi Produk", desc: "Menambah lini produk plakat, medali, dan piala" },
              { year: "2010", title: "Berbadan Hukum", desc: "Resmi berbadan hukum untuk kepercayaan klien" },
              { year: "2024", title: "Go Digital", desc: "Melayani klien dari seluruh Indonesia via online" },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="hidden md:flex justify-center mb-4">
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-accent group-hover:bg-accent transition-colors z-10" />
                </div>
                <div className="md:hidden flex items-start gap-4 mb-6">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-accent group-hover:bg-accent transition-colors z-10" />
                    {i < 3 && <div className="w-0.5 h-12 bg-gradient-to-b from-accent to-accent/30 mt-1" />}
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 flex-1 group-hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold text-accent-accessible mb-2">{item.year}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <div className="hidden md:block bg-white rounded-2xl p-5 border border-gray-100 group-hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-accent-accessible mb-2">{item.year}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <VisiMisiCards
          items={[
            { icon: "Eye", title: "Visi", desc: "Menjadi produsen souvenir custom terpercaya dan berkualitas tinggi di Indonesia, dikenal karena keunggulan produk dan pelayanan." },
            { icon: "Target", title: "Misi", desc: "Memproduksi souvenir custom berkualitas dengan harga kompetitif, memberikan pelayanan terbaik, dan terus berinovasi mengikuti kebutuhan pasar." },
            { icon: "Heart", title: "Nilai Perusahaan", desc: "Kualitas, Kejujuran, Profesionalisme, Inovasi, dan Kepuasan Pelanggan adalah nilai yang kami junjung dalam setiap produk dan layanan." },
          ]}
        />
      </section>

      <section className="relative overflow-hidden bg-[#1C1410] py-16">
        <BatikBackground noWhite />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#ffffff] text-center mb-12">Keunggulan Kami</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyInfo.advantages.map((adv, i) => {
              const IconMap: Record<string, React.ElementType> = {
                Calendar, Shield, Users, Palette, DollarSign, CheckCircle,
              }
              const Icon = IconMap[adv.icon] || CheckCircle
              const glowColors = ['red', 'orange', 'red', 'orange', 'red', 'orange'] as const
              return (
                <GlowCard key={i} glowColor={glowColors[i % glowColors.length]} customSize className="!p-6">
                  <Icon className="w-8 h-8 text-accent-accessible mb-4" />
                  <h3 className="font-semibold text-white mb-1">{adv.title}</h3>
                  <p className="text-sm text-white/70">{adv.description}</p>
                </GlowCard>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6">Wilayah Pelayanan</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Kami melayani pengiriman ke seluruh Indonesia melalui berbagai ekspedisi terpercaya.
              Dari Sabang sampai Merauke, produk kami dapat dijangkau oleh klien di mana pun berada.
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
                  <span key={s.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-light/10 text-primary-light rounded-full text-sm font-medium hover:bg-primary-light hover:text-white transition-colors cursor-default">
                    {iconMap[s.name] || <Package className="w-4 h-4" />}
                    {s.name}
                  </span>
                )
              })}
            </div>
          </div>
          <div>
            <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-6">Lokasi Kami</h2>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <iframe
                src="https://maps.google.com/maps?q=Karyamedia+Souvenir&output=embed"
                width="100%"
                height="200"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Karyamedia Souvenir"
              />
              <div className="p-3 bg-white">
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
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-4">Tertarik Bekerja Sama?</h2>
          <p className="text-gray-500 mb-8">
            Hubungi kami untuk konsultasi gratis dan penawaran harga terbaik.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#075E54] hover:bg-[#054E43] text-white px-8 py-3 rounded-full font-medium transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Konsultasi via WhatsApp
            </a>
            <Link
              href="/katalog-produk"
              className="inline-flex items-center gap-2 border border-primary/20 text-primary hover:bg-primary/5 px-8 py-3 rounded-full font-medium transition-colors"
            >
              Lihat Katalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
