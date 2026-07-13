import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Camera, Sparkles, Zap, Award, ArrowRight } from "lucide-react"
import { getWhatsAppLink } from "@/lib/utils"
import { GeometricBackground } from "@/components/ui/geometric-bg"

const engineItems = [
  {
    title: "Laser Cutting",
    description: "Mesin ini digunakan untuk memotong berbagai jenis bahan, seperti akrilik, kayu, dan kulit, dengan pola sederhana hingga rumit. Dengan dukungan mesin ini, proses pengerjaan produk lebih tepat, cepat, dan rapi.",
    image: "/images/gallery/Laser Cutting.webp",
    gradient: "from-purple-500 via-pink-500 to-red-500",
    textColor: "text-purple-600",
  },
  {
    title: "UV Flatbed Printer",
    description: "Mesin ini digunakan untuk membuat motif pada produk dengan ukuran pelat maksimal 10 cm. Adanya mesin flatbed UV printer menjadikan produk terlihat lebih menarik dengan tambahan ornamen-ornamen hiasan.",
    image: "/images/gallery/UV Flatbed Printer.webp",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    textColor: "text-blue-600",
  },
  {
    title: "Metal Cutting Fiber",
    description: "Logam menjadi salah satu material dalam membuat berbagai jenis souvenir. Metal cutting machine memudahkan proses pemotongan logam sesuai desain dengan presisi tinggi.",
    image: "/images/gallery/Metal Cutting Fiber.webp",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    textColor: "text-orange-600",
  },
  {
    title: "3D Printer",
    description: "Mesin ini dapat digunakan untuk mencetak master produk berbahan resin dan logam. Mendukung pembuatan souvenir 3D, seperti merek dan logo timbul serta relief.",
    image: "/images/gallery/3DPrinter.webp",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    textColor: "text-green-600",
  },
  {
    title: "Engraving Machine",
    description: "Mesin ini berfungsi untuk menangani produk berbahan akrilik, kayu, dan kulit. Hasilnya terlihat lebih detail, presisi, dan halus sehingga kualitas produk lebih terjaga.",
    image: "/images/gallery/engraving machine.webp",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    textColor: "text-indigo-600",
  },
  {
    title: "Molding Box",
    description: "Mesin molding digunakan untuk membentuk box dan packaging custom dengan berbagai ukuran dan bentuk sesuai kebutuhan produk souvenir.",
    image: "/images/gallery/molding Box.webp",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    textColor: "text-amber-600",
  },
]

const productImages = [
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (1).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (2).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (3).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (6).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (7).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (8).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (9).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (10).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (11).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (12).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (13).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (14).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (15).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (16).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (17).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (18).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (19).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (20).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (21).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (22).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (23).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (24).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (25).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (26).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (27).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat/plakat-hasil-produksi (28).png", alt: "Plakat Hasil Produksi", category: "Plakat" },
  { src: "/images/hasil-produksi/plakat-wayang/plakat-wayang-1.png", alt: "Plakat Wayang Hasil Produksi", category: "Plakat Wayang" },
  { src: "/images/hasil-produksi/plakat-wayang/plakat-wayang-2.png", alt: "Plakat Wayang Hasil Produksi", category: "Plakat Wayang" },
  { src: "/images/hasil-produksi/plakat-wayang/plakat-wayang-3.png", alt: "Plakat Wayang Hasil Produksi", category: "Plakat Wayang" },
  { src: "/images/hasil-produksi/plakat-wayang/plakat-wayang-4.png", alt: "Plakat Wayang Hasil Produksi", category: "Plakat Wayang" },
  { src: "/images/hasil-produksi/plakat-wayang/plakat-wayang-5.png", alt: "Plakat Wayang Hasil Produksi", category: "Plakat Wayang" },
  { src: "/images/hasil-produksi/plakat-wayang/plakat-wayang-6.png", alt: "Plakat Wayang Hasil Produksi", category: "Plakat Wayang" },
  { src: "/images/hasil-produksi/plakat-wayang/plakat-wayang-7.png", alt: "Plakat Wayang Hasil Produksi", category: "Plakat Wayang" },
  { src: "/images/hasil-produksi/plakat-wayang/plakat-wayang-8.png", alt: "Plakat Wayang Hasil Produksi", category: "Plakat Wayang" },
  { src: "/images/hasil-produksi/souvenir-wisuda/patung-wisuda (1).png", alt: "Patung Wisuda Hasil Produksi", category: "Souvenir Wisuda" },
  { src: "/images/hasil-produksi/souvenir-wisuda/patung-wisuda (2).png", alt: "Patung Wisuda Hasil Produksi", category: "Souvenir Wisuda" },
  { src: "/images/hasil-produksi/souvenir-wisuda/patung-wisuda (3).png", alt: "Patung Wisuda Hasil Produksi", category: "Souvenir Wisuda" },
  { src: "/images/hasil-produksi/souvenir-wisuda/patung-wisuda (4).png", alt: "Patung Wisuda Hasil Produksi", category: "Souvenir Wisuda" },
  { src: "/images/hasil-produksi/souvenir-wisuda/patung-wisuda (5).png", alt: "Patung Wisuda Hasil Produksi", category: "Souvenir Wisuda" },
  { src: "/images/hasil-produksi/souvenir-wisuda/patung-wisuda (6).png", alt: "Patung Wisuda Hasil Produksi", category: "Souvenir Wisuda" },
  { src: "/images/hasil-produksi/souvenir-wisuda/patung-wisuda (7).png", alt: "Patung Wisuda Hasil Produksi", category: "Souvenir Wisuda" },
  { src: "/images/hasil-produksi/souvenir-wisuda/patung-wisuda (8).png", alt: "Patung Wisuda Hasil Produksi", category: "Souvenir Wisuda" },
  { src: "/images/hasil-produksi/souvenir-wisuda/patung-wisuda (9).png", alt: "Patung Wisuda Hasil Produksi", category: "Souvenir Wisuda" },
  { src: "/images/hasil-produksi/souvenir-wisuda/patung-wisuda (10).png", alt: "Patung Wisuda Hasil Produksi", category: "Souvenir Wisuda" },
]

export const metadata: Metadata = {
  title: "Galeri Produk & Workshop",
  description: "Lihat galeri workshop & mesin modern kami: laser cutting, UV printer, 3D printer, dan engraving untuk souvenir custom berkualitas.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Galeri Produk & Workshop - Karyamedia Souvenir",
    description: "Mesin-mesin modern dan proses produksi souvenir custom di Karyamedia Souvenir Jogja.",
    url: "/gallery",
  },
}

function limitPerCategory(images: typeof productImages, max: number) {
  const groups: Record<string, typeof productImages> = {}
  for (const img of images) {
    if (!groups[img.category]) groups[img.category] = []
    groups[img.category].push(img)
  }
  return Object.values(groups).flatMap((g) => g.slice(0, max))
}

export default function GalleryPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#030303] py-20 overflow-hidden">
        <GeometricBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <span className="text-white/60">›</span>
            <span className="text-white font-medium">Galeri</span>
          </nav>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-6">
              <Camera className="w-4 h-4" />
              <span className="font-medium">Galeri Produksi</span>
            </div>
            
            <h1 className="heading-display text-5xl md:text-7xl mb-4 tracking-[0.2em]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-accessible to-accent">
                GALERI
              </span>
              <br />
              <span className="text-white">KARYAMEDIA</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 font-light">
              Karyamedia Souvenir telah menjadi penyedia souvenir custom full custom sejak 2001.
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-accent-accessible" />
                <span className={"text-white text-sm"}>Mesin Modern</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-accent-accessible" />
                <span className={"text-white text-sm"}>Teknologi Terbaru</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Award className="w-4 h-4 text-accent-accessible" />
                <span className={"text-white text-sm"}>Kualitas Terjamin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engine Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-display text-4xl md:text-6xl mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible">
                ENGINE
              </span>
            </h2>
            <p className={"text-gray-600 text-lg max-w-2xl mx-auto"}>
              Mesin-mesin modern yang kami gunakan untuk menghasilkan produk berkualitas tinggi
            </p>
          </div>

          <div className="space-y-16">
            {engineItems.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="flex-1">
                  <div className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`} />
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="inline-block">
                    <h3 className={`heading-display text-transparent bg-clip-text bg-gradient-to-r ${item.gradient} text-4xl md:text-5xl`}>
                      {item.title}
                    </h3>
                  </div>
                  <p className={"text-gray-600 text-lg leading-relaxed"}>
                    {item.description}
                  </p>
                  <div className={`w-20 h-1 bg-gradient-to-r ${item.gradient} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Gallery Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-display text-4xl md:text-6xl mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible">
                PRODUCT
              </span>
            </h2>
            <p className={"text-gray-600 text-lg max-w-2xl mx-auto"}>
              Foto hasil produksi plakat, souvenir wisuda, dan aneka produk custom Karyamedia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {limitPerCategory(productImages, 12).map((img, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-2">
                    {img.category}
                  </span>
                  <h3 className={"text-white font-bold text-lg"}>{img.alt}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 rounded-3xl p-12 max-w-3xl mx-auto">
              <Camera className="w-16 h-16 text-accent-accessible mx-auto mb-4" />
              <h3 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-accent-accessible to-accent mb-3">
                Galeri Lebih Lengkap
              </h3>
              <p className={"text-gray-600 mb-6"}>
                Galeri ini menampilkan sebagian dari mesin dan proses produksi kami.
                Untuk melihat lebih banyak hasil karya, silakan hubungi via WhatsApp atau kunjungi workshop kami di Yogyakarta.
              </p>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent-accessible text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-accent/25 transition-all"
              >
                <Camera className="w-4 h-4" />
                Lihat Lebih Banyak
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
