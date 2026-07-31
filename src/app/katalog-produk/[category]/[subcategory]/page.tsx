import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Metadata } from "next"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { BreadcrumbSchema } from "@/components/json-ld"
import { SubcategoryProductGrid } from "./product-grid"

// ISR: revalidate setiap 1 jam.
export const revalidate = 3600

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
  const allImages = subs.flatMap((p) => p.images || []).filter(Boolean)
  const ogImage = allImages.length > 0
    ? allImages[Math.floor(Math.random() * allImages.length)]
    : undefined

  return {
    title: `${sub.name} Custom | Karyamedia Souvenir`,
    description: sub.description || `${sub.name} custom berkualitas dari Yogyakarta untuk penghargaan, event, dan souvenir instansi.`,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${sub.name} Custom | Karyamedia Souvenir`,
      description: `${sub.name} custom berkualitas dari Karyamedia Souvenir Yogyakarta.`,
      url: canonical,
      images: ogImage ? [{ url: ogImage, width: 800, height: 800 }] : [],
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

  // Serialize products for client component (minimal data)
  const productData = subProducts.map((p) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    slug: p.slug,
    subcategoryId: p.subcategoryId,
    shortDescription: p.shortDescription,
    image: p.images[0] ?? "",
    bestSeller: p.bestSeller,
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
        <SubcategoryProductGrid
          products={productData}
          categoryName={cat.name}
          subName={sub.name}
          categorySlug={cat.slug}
          subSlug={sub.slug}
        />
      </section>
    </>
  )
}
