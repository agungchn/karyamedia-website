import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Award } from "lucide-react"
import { Metadata } from "next"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { getWhatsAppLink, generateWhatsAppMessage } from "@/lib/utils"
import { BreadcrumbSchema } from "@/components/json-ld"
import { readdirSync } from "fs"
import { join } from "path"


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

  return {
      title: `${sub.name} ${cat.name} Custom`,
    description: `Produksi ${sub.name} ${cat.name} custom harga murah di Jogja. Cocok untuk penghargaan, event, dan souvenir instansi.`,
    alternates: {
      canonical,
    },
    openGraph: {
    title: `${sub.name} ${cat.name} Custom`,
      description: `Produksi ${sub.name} ${cat.name} custom oleh Karyamedia Souvenir Jogja.`,
      url: canonical,
    },
  }
}

function getImagesFromFolder(subcategorySlug: string): { path: string; slug: string }[] {
  const folderMap: Record<string, string> = {
    "plakat-akrilik": "plakat-akrilik",
    "plakat-kayu": "plakat-kayu",
    "plakat-kayu-premium": "plakat-kayu-eksklusif",
    "plakat-marmer": "plakat-marmer",
    "plakat-fiberglass": "plakat-fiberglass",
    "plakat-wayang": "plakat-wayang",
    "medali-custom": "medali-custom",
    "medali-3d": "medali-3d",
    "piala-trophy": "piala-trophy",
    "piala-golf": "piala-golf",
    "samir-gordon-wisuda": "samir-wisuda",
    "patung-wisuda": "patung-wisuda",
    "kalung-rektor": "kalung-rektor",
    "pedel-tongkat-rektor": "tongkat-rektor",
    "map-ijazah": "map-ijazah",
    "box-bludru": "box-bludru",
    "box-kertas-import": "box-kertas-import",
    "box-batik": "box-batik",
    "box-kertas-marga": "box-kertas-marga",
    "name-tag": "name-tag",
    "pin-bross": "pin-bross",
    "gantungan-kunci": "gantungan-kunci",
    "tumbler": "tumbler",
    "papan-nama": "papan-nama",
    "prasasti-marmer": "prasasti-marmer",
    "prasasti-kuningan": "prasasti-kuningan",
    "prasasti-stainless-steel": "prasasti-stainless-steel",
    "souvenir-pernikahan": "souvenir-pernikahan",
  }

  const folderName = folderMap[subcategorySlug] || subcategorySlug

  try {
    const folderPath = join(process.cwd(), "public", "images", "produk-unggulan", folderName)
    const files = readdirSync(folderPath)
    return files
      .filter((f) => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg"))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || "0")
        const numB = parseInt(b.match(/\d+/)?.[0] || "0")
        if (numA !== numB) return numA - numB
        return a.localeCompare(b)
      })
      .map((f) => {
        const slug = f
          .replace(/\.(png|jpg|jpeg)$/i, "")
          .replace(/\s*\(\d+\)\s*$/, (m) => "-" + m.match(/\d+/)?.[0] || "")
          .replace(/\s+/g, "-")
          .replace(/\(+|\)+/g, "")
        return { path: `/images/produk-unggulan/${folderName}/${f}`, slug }
      })
  } catch {
    return []
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

  const firstProduct = subProducts[0]

  const folderImages = getImagesFromFolder(sub.slug)

  const cards: { product: typeof subProducts[0]; image: string; imageIndex: number }[] = []

  if (folderImages.length > 0 && subProducts.length > 0) {
    folderImages.forEach((img) => {
      const product = subProducts.find((p) => p.slug === img.slug) || subProducts[0]
      cards.push({ product, image: img.path, imageIndex: 0 })
    })
  } else if (subProducts.length > 0) {
    subProducts.forEach((product) => {
      if (product.images.length > 0) {
        cards.push({ product, image: product.images[0], imageIndex: 0 })
      }
    })
  }

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
      <section className="bg-gradient-to-br from-primary to-foreground py-16">
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
          <h1 className="heading-display text-3xl md:text-4xl text-white mb-3">{sub.name}</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
              <div
                key={`${card.product.id}-${idx}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {card.imageIndex === 0 && card.product.bestSeller && (
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
                      className="flex-1 text-center py-2 rounded-lg bg-[#25D366] text-white text-xs font-medium hover:bg-[#20bd5a] transition-colors"
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
              className="inline-flex items-center gap-2 text-accent font-medium hover:text-accent-accessible"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke {cat.name}
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
