import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Award } from "lucide-react"
import { Metadata } from "next"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { getWhatsAppLink, generateWhatsAppMessage } from "@/lib/utils"
import { BreadcrumbSchema } from "@/components/json-ld"

// Selalu render dari data terkini (hindari snapshot build statis usang
// yang bisa menampilkan kartu produk tanpa gambar).
export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ category: string; subcategory: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params
  const cat = categories.find((c) => c.slug === category)
  if (!cat) return {}
  const sub = cat.subcategories.find((s) => s.slug === subcategory)
  if (!sub) return {}

  const canonical = cat.subcategories.length === 1
    ? `/katalog-produk/${category}`
    : `/katalog-produk/${category}/${subcategory}`

  const subs = products.filter(
    (p) => p.categoryId === cat.id && p.subcategoryId === sub.id
  )
  const firstImage = subs[0]?.images?.[0]

  return {
    title: `${sub.name} ${cat.name} Custom`,
    description: `Produksi ${sub.name} ${cat.name} custom harga murah di Jogja. Cocok untuk penghargaan, event, dan souvenir instansi.`,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${sub.name} ${cat.name} Custom`,
      description: `Produksi ${sub.name} ${cat.name} custom oleh Karyamedia Souvenir Jogja.`,
      url: canonical,
      images: firstImage ? [{ url: firstImage, width: 800, height: 800 }] : [],
    },
  }
}

export default async function SubCategoryPage({ params }: Props) {
  const { category, subcategory } = await params
  const cat = categories.find((c) => c.slug === category)
  if (!cat) notFound()
  const sub = cat.subcategories.find((s) => s.slug === subcategory)
  if (!sub) notFound()

  const subProducts = products.filter(
    (p) => p.categoryId === cat.id && p.subcategoryId === sub.id
  )

  // Satu kartu per produk, pakai gambar produk masing-masing (sumber terpercaya).
  const cards: { product: (typeof subProducts)[number]; image: string }[] =
    subProducts.map((product) => ({
      product,
      image: product.images[0] ?? "",
    }))

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Beranda", url: "/" },
          { name: "Katalog Produk", url: "/katalog-produk" },
          { name: cat.name, url: `/katalog-produk/${category}` },
          { name: sub.name, url: `/katalog-produk/${category}/${subcategory}` },
        ]}
      />
      <section className="bg-gradient-to-br from-[#000030] to-[#002878] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <Link href="/katalog-produk" className="hover:text-white transition-colors">Katalog</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <Link href={`/katalog-produk/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-white">{sub.name}</span>
          </nav>
          <h1 className="heading-display text-3xl md:text-4xl text-transparent bg-clip-text mb-1" style={{ backgroundImage: "linear-gradient(to right, #D4AF37, #FFD700)" }}>{sub.name}</h1>
          {sub.aliases && sub.aliases.length > 0 && (
            <p className="text-sm text-gray-300">Juga dikenal sebagai: {sub.aliases.join(" / ")}</p>
          )}
        </div>
      </section>
      <div className="w-full h-0.5 shimmer-line" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
              <div
                key={`${card.product.id}-${idx}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={`${card.product.name} - ${sub?.name || cat?.name || "Souvenir"} Karyamedia Jogja`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {card.product.bestSeller && (
                    <span className="absolute top-3 left-3 bg-accent text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      Best Seller
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full mb-1">
                      {card.product.subcategoryId}
                    </span>
                    <p className="text-white font-bold text-sm line-clamp-2">{card.product.name}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{card.product.code}</p>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{card.product.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {card.product.shortDescription}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/katalog-produk/${cat.slug}/${sub.slug}/${card.product.slug}`}
                      className="flex-1 text-center py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Detail
                    </Link>
                    <a
                      href={getWhatsAppLink(generateWhatsAppMessage(card.product.code, card.product.name))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 rounded-lg bg-[#075E54] text-white text-xs font-medium hover:bg-[#054E43] transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Produk Segera Hadir</h2>
            <p className="text-gray-500 mb-6">Produk untuk subkategori ini sedang dalam proses penambahan.</p>
            <Link
              href={`/katalog-produk/${cat.slug}`}
              className="inline-flex items-center gap-2 text-accent-accessible font-medium hover:text-accent-accessible"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke {cat.name}
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
