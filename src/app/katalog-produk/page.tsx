import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { ChevronRight, Search, Filter, Award } from "lucide-react"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { getWhatsAppLink, generateWhatsAppMessage } from "@/lib/utils"
import { categoryIconMap } from "@/components/icons/product-icons"
import { KategoriCards } from "@/components/kategori-cards"
import { TimeHeroBg } from "@/components/ui/time-hero-bg"
import { TimeHeading } from "@/components/ui/time-heading"
import { TimeText } from "@/components/ui/time-text"
import { SearchGlow } from "@/components/search-glow"

// Selalu render dari data terkini (produk sering ditambah via script).
export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const featured = products.filter((p) => p.featured)
  const allImages = featured.flatMap((p) => p.images || []).filter(Boolean)
  const ogImage = allImages.length > 0
    ? allImages[Math.floor(Math.random() * allImages.length)]
    : undefined

  return {
    title: "Katalog Plakat & Souvenir Custom Jogja",
    description: "Jelajahi katalog souvenir custom Karyamedia Jogja: plakat, medali, piala, souvenir wisuda, gift box, aksesoris, & prasasti. Custom desain, kualitas terbaik.",
    alternates: {
      canonical: "/katalog-produk",
    },
    openGraph: {
      title: "Katalog Plakat & Souvenir Custom Jogja - Karyamedia",
      description: "Jelajahi berbagai kategori produk souvenir custom berkualitas tinggi yang kami produksi sejak 2001.",
      url: "/katalog-produk",
      images: ogImage ? [{ url: ogImage, width: 800, height: 800 }] : [],
    },
  }
}

export default function KatalogPage() {
  const featured = products.filter((p) => p.featured)

  const subcategories = categories.flatMap((cat) => cat.subcategories)

  const popularBySub = subcategories
    .map((sub) => ({
      sub,
      products: featured
        .filter((p) => p.subcategoryId === sub.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 12),
    }))
    .filter((g) => g.products.length > 0)

  return (
    <>
      <section className="relative overflow-hidden py-20">
        <TimeHeroBg />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative inline-flex overflow-hidden rounded-full p-[1.5px] mb-6 cursor-default hover:scale-105 transition-transform duration-300">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#D4AF37_0%,#1D4ED8_50%,#D4AF37_100%)]" />
            <div className="inline-flex items-center gap-2 rounded-full bg-primary text-xs font-medium backdrop-blur-3xl">
              <span className="inline-flex items-center gap-2 rounded-full text-center bg-gradient-to-tr from-accent/20 via-primary-light/30 to-transparent text-white border-[1px] border-accent/30 py-2.5 px-6 text-sm font-medium">
                <Award className="w-4 h-4" />
                Katalog Produk
              </span>
            </div>
          </div>
          <TimeHeading className="text-4xl md:text-5xl mb-4" style={{ letterSpacing: "0.02em", wordSpacing: "0.1em" } as React.CSSProperties}>
            Temukan Souvenir &amp; Plakat Jogja<br />Sesuai Kebutuhan Anda
          </TimeHeading>
          <TimeText className="max-w-2xl mx-auto mb-8">
            Jelajahi berbagai kategori produk souvenir custom berkualitas tinggi yang kami produksi sejak 2001
          </TimeText>
          <div className="max-w-xl mx-auto relative">
            <SearchGlow>
              <div className="relative z-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-40" />
                <input
                  type="text"
                  placeholder="Cari produk, kategori, atau kode produk..."
                  className="w-full pl-14 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/50 shadow-xl relative z-30"
                />
              </div>
            </SearchGlow>
          </div>
        </div>
      </section>
      <div className="w-full h-0.5 shimmer-line" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-2 mb-8">
          <Filter className="w-5 h-5 text-gray-400" />
          <h2 className="heading-display italic text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible">Semua Kategori</h2>
        </div>
        <KategoriCards />
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-8">Produk Populer</h2>
          {popularBySub.map((group) => (
            <div key={group.sub.id} className="mb-10 last:mb-0">
              <div className="flex items-center gap-3 mb-5">
                <h3 className="text-base font-bold text-gray-900">{group.sub.name}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {group.products.map((product) => {
                  const _cat = categories.find((c) => c.id === product.categoryId)
                  const _sub = _cat?.subcategories.find((s) => s.id === product.subcategoryId)
                  return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={`${product.name} - ${_sub?.name || _cat?.name || "Souvenir"} Karyamedia Jogja`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Award className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {product.bestSeller && (
                        <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Best Seller
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full mb-1">
                          {product.subcategoryId}
                        </span>
                        <p className="text-white font-bold text-xs line-clamp-2">{product.name}</p>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] text-gray-400 mb-0.5 truncate">{product.code}</p>
                      <h3 className="font-semibold text-gray-900 text-xs mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-[10px] text-gray-500 mb-2 line-clamp-1">{product.shortDescription}</p>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/katalog-produk/${product.categoryId}/${product.subcategoryId}/${product.slug}`}
                          className="flex-1 text-center py-1.5 rounded-md border border-gray-200 text-[10px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Detail
                        </Link>
                        <a
                          href={getWhatsAppLink(generateWhatsAppMessage(product.code, product.name))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-1.5 rounded-md bg-[#075E54] text-white text-[10px] font-medium hover:bg-[#054E43] transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
