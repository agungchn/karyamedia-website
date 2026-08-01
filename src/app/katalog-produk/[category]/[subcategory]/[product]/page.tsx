import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Award, MessageCircle, Send, PenTool, Settings, Truck, ArrowRight, CheckCircle } from "lucide-react"
import { Metadata } from "next"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { companyInfo } from "@/data/company"

import { BreadcrumbSchema, ProductSchema } from "@/components/json-ld"
import ProductClient from "./ProductClient"

function getSubSlug(product: { categoryId: string; subcategoryId: string }): string {
  for (const cat of categories) {
    if (cat.id === product.categoryId) {
      const sub = cat.subcategories.find((s) => s.id === product.subcategoryId)
      if (sub) return sub.slug
    }
  }
  return product.subcategoryId
}

interface Props {
  params: Promise<{ category: string; subcategory: string; product: string }>
}

export async function generateStaticParams() {
  const params = products.map((p) => {
    const cat = categories.find((c) => c.id === p.categoryId)
    const sub = cat?.subcategories.find((s) => s.id === p.subcategoryId)
    return {
      category: cat?.slug ?? p.categoryId,
      subcategory: sub?.slug ?? p.subcategoryId,
      product: p.slug,
    }
  })
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory, product: productSlug } = await params
  const product = products.find((p) => p.slug === productSlug)
  if (!product) return {}

  const cat = categories.find((c) => c.slug === category)
  const sub = cat?.subcategories.find((s) => s.slug === subcategory)
  const imageUrl = product.images[0] || "/images/logo-karyamedia.png"

  const subSlug = getSubSlug(product)
  return {
    title: `${product.name}${sub?.name ? " - " + sub.name : ""}`,
    description: `${product.shortDescription} | Custom ${sub?.name || cat?.name || "souvenir"} berkualitas di Karyamedia Souvenir Jogja. Bahan: ${product.material} | Ukuran: ${product.size} | ${product.price}`,
    alternates: {
      canonical: `/katalog-produk/${category}/${subSlug}/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} - ${product.code}`,
      description: `${product.shortDescription} | Custom ${sub?.name || ""} di Karyamedia Souvenir Jogja`,
      url: `/katalog-produk/${category}/${subSlug}/${product.slug}`,
      images: [{ url: imageUrl, width: 800, height: 800 }],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, subcategory, product: productSlug } = await params
  const product = products.find((p) => p.slug === productSlug)
  if (!product) notFound()

  const cat = categories.find((c) => c.slug === category)
  const sub = cat?.subcategories.find((s) => s.slug === subcategory)

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 6)

  const iconMap: Record<string, React.ElementType> = {
    MessageCircle, Send, PenTool, Settings, Truck, CheckCircle,
  }

  const breadcrumbItems = [
    { name: "Beranda", url: "/" },
    { name: "Katalog", url: "/katalog-produk" },
    ...(cat ? [{ name: cat.name, url: `/katalog-produk/${cat.slug}` }] : []),
    ...(sub ? [{ name: sub.name, url: `/katalog-produk/${cat!.slug}/${sub.slug}` }] : []),
    { name: product.name, url: `/katalog-produk/${category}/${getSubSlug(product)}/${product.slug}` },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ProductSchema
        name={product.name}
        description={product.shortDescription}
        sku={product.code}
        image={product.images[0] || "/images/logo-karyamedia.png"}
        category={sub?.name || product.categoryId}
        price={product.price}
      />
      <section className="bg-gradient-to-br from-[#000030] to-[#002878] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-3 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <Link href="/katalog-produk" className="hover:text-white transition-colors">Katalog</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            {cat && (
              <>
                <Link href={`/katalog-produk/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </>
            )}
            {sub && (
              <>
                <Link href={`/katalog-produk/${cat!.slug}/${sub.slug}`} className="hover:text-white transition-colors">{sub.name}</Link>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </>
            )}
            <span className="text-white truncate">{product.name}</span>
          </nav>
        </div>
      </section>
      <div className="w-full h-0.5 shimmer-line" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative">
              {product.images.length > 0 ? (
                <Image src={product.images[0]} alt={`${product.name} - ${sub?.name || cat?.name || "Souvenir"} Karyamedia Souvenir`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-32 h-32 text-gray-300" />
                </div>
              )}
              {product.bestSeller && (
                <span className="absolute top-4 left-4 bg-accent text-white text-sm font-medium px-3 py-1.5 rounded-full">
                  Best Seller
                </span>
              )}
              {product.custom && (
                <span className="absolute top-4 right-4 bg-primary-light text-white text-sm font-medium px-3 py-1.5 rounded-full">
                  Custom
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {product.images.map((img, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                    <Image src={img} alt={`${product.name} - ${sub?.name || cat?.name || "Souvenir"} Karyamedia Souvenir (${i + 1})`} fill loading="lazy" sizes="25vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            {product.subcategoryId === "cp" && (
              <div className="mt-4">
                <h3 className="heading-display text-xl text-gray-900 mb-3">Tersedia 3 Varian Ukuran As</h3>
                <Image
                  src="/images/produk-unggulan/plakat-batas-wilayah/ukuran-as-center-point.png"
                  alt="Ukuran Acuan Center Point"
                  width={1575}
                  height={775}
                  loading="lazy"
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          <ProductClient product={product} cat={cat} sub={sub} />
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-8">Produk Terkait</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/katalog-produk/${categories.find((c) => c.id === rp.categoryId)?.slug || rp.categoryId}/${getSubSlug(rp)}/${rp.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {rp.images.length > 0 ? (
<Image
                         src={rp.images[0]}
                         alt={`${rp.name} - ${categories.find((c) => c.id === rp.categoryId)?.subcategories.find((s) => s.id === rp.subcategoryId)?.name || categories.find((c) => c.id === rp.categoryId)?.name || "Souvenir"} Karyamedia Souvenir`}
                         fill
                         loading="lazy"
                         sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                         className="object-cover group-hover:scale-110 transition-transform duration-700"
                       />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Award className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-bold text-sm line-clamp-2">{rp.name}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{rp.code}</p>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{rp.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{rp.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-display text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-2">Cara Pesan</h2>
            <p className="text-gray-500">Proses pemesanan yang mudah dan transparan</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {companyInfo.orderSteps.map((step, i) => {
              const Icon = iconMap[step.icon] || CheckCircle
              return (
                <div key={i} className="relative text-center group">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary flex items-center justify-center mb-4 group-hover:bg-accent group-hover:rotate-[360deg] transition-all duration-500 relative overflow-hidden cursor-pointer outline outline-1 outline-primary/10 outline-offset-2 group-hover:outline-accent/30">
                    <span className="text-white font-bold text-lg relative z-10">{step.step}</span>
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at 50% 50%, rgba(212,175,55,0.4), rgba(212,175,55,0) 60%)` }} />
                  </div>
                  <Icon className="w-6 h-6 text-primary mx-auto mb-3 group-hover:text-accent-accessible transition-all duration-300" />
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-600">{step.description}</p>
                  {i < companyInfo.orderSteps.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute top-7 -right-3 w-5 h-5 text-gray-300" />
                  )}
                </div>
              )
            })}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/cara-pesan"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary-light transition-colors"
            >
              Lihat Detail Cara Pesan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
