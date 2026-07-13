import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { ChevronRight, Search, Filter, Award } from "lucide-react"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { getWhatsAppLink, generateWhatsAppMessage } from "@/lib/utils"
import { categoryIconMap } from "@/components/icons/product-icons"
import { KategoriCards } from "@/components/kategori-cards"

export const metadata: Metadata = {
  title: "Katalog Produk Souvenir Custom",
  description: "Jelajahi katalog souvenir custom Karyamedia: plakat, medali, piala, souvenir wisuda, gift box, aksesoris, & prasasti. Custom desain, kualitas terbaik.",
  alternates: {
    canonical: "/katalog-produk",
  },
  openGraph: {
    title: "Katalog Produk Souvenir Custom - Karyamedia",
    description: "Jelajahi berbagai kategori produk souvenir custom berkualitas tinggi yang kami produksi sejak 2001.",
    url: "/katalog-produk",
  },
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
      <section className="bg-gradient-to-br from-primary to-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-1.5 rounded-full text-sm mb-6">
            <Award className="w-4 h-4" />
            Katalog Produk
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-transparent bg-clip-text mb-4" style={{ backgroundImage: "linear-gradient(to right, #D4AF37, #FFD700)", letterSpacing: "0.02em", wordSpacing: "0.1em" }}>
            Temukan Souvenir Custom<br />Sesuai Kebutuhan Anda
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto mb-8">
            Jelajahi berbagai kategori produk souvenir custom berkualitas tinggi yang kami produksi sejak 2001
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk, kategori, atau kode produk..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/50 shadow-xl"
            />
          </div>
        </div>
      </section>

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
                {group.products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Award className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {product.bestSeller && (
                        <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Best Seller
                        </span>
                      )}
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
                          className="flex-1 text-center py-1.5 rounded-md bg-[#25D366] text-white text-[10px] font-medium hover:bg-[#20bd5a] transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
