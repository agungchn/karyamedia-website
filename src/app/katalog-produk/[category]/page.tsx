import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Award, Sparkles } from "lucide-react"
import { categoryIconMap } from "@/components/icons/product-icons"
import { SparklesCore } from "@/components/ui/sparkles-core"
import { Metadata } from "next"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { getWhatsAppLink, generateWhatsAppMessage } from "@/lib/utils"
import { BreadcrumbSchema } from "@/components/json-ld"

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = categories.find((c) => c.slug === category)
  if (!cat) return {}

  return {
    title: `${cat.name} Custom Murah Jogja`,
    description: `Produsen ${cat.name.toLowerCase()} custom murah di Jogja. ${cat.description}. Pesan sekarang, kirim seluruh Indonesia.`,
    alternates: {
      canonical: `/katalog-produk/${category}`,
    },
    openGraph: {
      title: `${cat.name} Custom`,
      description: cat.description,
      url: `/katalog-produk/${category}`,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = categories.find((c) => c.slug === category)
  if (!cat) notFound()

  const catProducts = products.filter((p) => p.categoryId === cat.id)

  function getSubSlug(product: { subcategoryId: string }): string {
    const sub = cat!.subcategories.find((s) => s.id === product.subcategoryId)
    return sub?.slug ?? product.subcategoryId
  }

  const productsBySub = cat.subcategories
    .map((sub) => ({
      subcategory: sub,
      products: catProducts
        .filter((p) => p.subcategoryId === sub.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 8),
    }))
    .filter((g) => g.products.length > 0)

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Beranda", url: "/" },
          { name: "Katalog Produk", url: "/katalog-produk" },
          { name: cat.name, url: `/katalog-produk/${category}` },
        ]}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-[#C2DAEE] via-[#A9CDE8] to-[#8BB8D6] py-8">
        <div className="absolute inset-0 opacity-30">
          <SparklesCore
            id={`category-sparkles-${cat.slug}`}
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleColor="#FFFFFF"
            particleDensity={300}
            speed={1}
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#C2DAEE]/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600/80 mb-4">
            <Link href="/" className="hover:text-gray-900 transition-colors">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/katalog-produk" className="hover:text-gray-900 transition-colors">Katalog Produk</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{cat.name}</span>
          </nav>
          <h1 className="heading-display text-4xl md:text-5xl mb-4 flex items-center gap-4">
            {(() => {
              const CatIcon = categoryIconMap[cat.slug]
              return CatIcon ? <CatIcon size={40} className="shrink-0" /> : null
            })()}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #0B1F3A, #2563EB)" }}>
              {cat.name}
            </span>
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Subkategori</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {cat.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/katalog-produk/${cat.slug}/${sub.slug}`}
              className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-accent/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">{sub.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Lihat produk</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {productsBySub.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Produk dalam Kategori Ini</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsBySub.flatMap((group) => group.products).map((product, i) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "forwards" }}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {product.bestSeller && (
                      <span className="absolute top-3 left-3 bg-accent text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        Best Seller
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{product.code}</p>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.shortDescription}</p>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/katalog-produk/${cat.slug}/${getSubSlug(product)}/${product.slug}`}
                        className="flex-1 text-center py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Detail
                      </Link>
                      <a
                        href={getWhatsAppLink(generateWhatsAppMessage(product.code, product.name))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2 rounded-lg bg-[#25D366] text-white text-xs font-medium hover:bg-[#20bd5a] transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}
