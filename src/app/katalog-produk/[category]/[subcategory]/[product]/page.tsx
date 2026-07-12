import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Award, MessageCircle, Package, Ruler, Palette, Tag, Clock, Minus, Share2, Send, PenTool, Settings, Truck, ArrowRight, CheckCircle } from "lucide-react"
import { Metadata } from "next"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { companyInfo } from "@/data/company"
import { getWhatsAppLink, generateWhatsAppMessage } from "@/lib/utils"
import { BreadcrumbSchema, ProductSchema } from "@/components/json-ld"

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
    description: `${product.shortDescription} | Bahan: ${product.material} | Ukuran: ${product.size} | ${product.price}`,
    alternates: {
      canonical: `/katalog-produk/${category}/${subSlug}/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} - ${product.code}`,
      description: `${product.shortDescription} | Custom ${sub?.name || ""} di Karyamedia Souvenir`,
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

  const waMessage = generateWhatsAppMessage(product.code, product.name)

  const iconColors: Record<string, string> = {
    Bahan: "text-blue-600",
    Stand: "text-amber-600",
    "Sistem Pengerjaan": "text-cyan-600",
    "Logo & Teks": "text-cyan-600",
    Logo: "text-purple-600",
    Ukuran: "text-orange-500",
    "Ketebalan Bahan": "text-slate-600",
    "Warna/Finishing": "text-pink-500",
    "Warna Bahan": "text-pink-500",
    Kegunaan: "text-emerald-600",
    "Minimal Order": "text-red-500",
    "Biaya Molding": "text-rose-600",
    "Estimasi Produksi": "text-amber-500",
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
        image={product.images[0] || "/images/placeholder.png"}
        category={sub?.name || product.categoryId}
        price={product.price}
      />
      <section className="bg-gradient-to-br from-primary to-foreground py-3">
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative">
              {product.images.length > 0 ? (
                <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
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
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="25vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-primary-light font-medium mb-2">{product.code}</p>
            <h1 className="heading-display text-3xl md:text-4xl text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">Spesifikasi Produk</h3>
              {[
                { icon: Package, label: "Bahan", value: product.material },
                ...(product.standMaterial ? [{ icon: Package, label: "Stand", value: product.standMaterial }] : []),
                ...(product.subcategoryId !== "gw" ? [{ icon: PenTool, label: product.subcategoryId === "md" || product.subcategoryId === "md3d" ? "Sistem Pengerjaan" : product.subcategoryId === "tr" ? "Logo & Ornament" : "Logo & Teks", value: product.subcategoryId === "pkp" ? "Kuningan / Stainless" : product.subcategoryId === "pm" ? "Stiker / Kuningan" : product.subcategoryId === "pw" ? "Kuningan / Stainless" : product.subcategoryId === "pt" ? "Stiker / Printing" : product.subcategoryId === "md3d" ? "Cor Die Casting" : product.subcategoryId === "md" ? "Etching / Etsa" : product.subcategoryId === "ptw" ? "Kuningan / Stiker Print" : product.subcategoryId === "kr" ? "Custom" : product.subcategoryId === "tr" ? "Kuningan" : product.subcategoryId === "mi" ? "Hot Print / Sablon" : product.subcategoryId === "pwa" ? "Stiker / Print UV" : product.subcategoryId === "tw" ? "Sablon" : product.subcategoryId === "prk" || product.subcategoryId === "pss" || product.subcategoryId === "brt" || product.subcategoryId === "cp" ? "Etching/Etsa" : product.subcategoryId === "pr" ? "Ukir/Pahat" : "Print UV / Kuningan" }] : []),
                ...(product.logoType ? [{ icon: Package, label: "Logo", value: product.logoType }] : []),
                { icon: Ruler, label: "Ukuran", value: product.size },
                ...(product.thickness ? [{ icon: Package, label: "Ketebalan Bahan", value: product.thickness }] : []),
                ...(product.color ? [{ icon: Palette, label: product.subcategoryId === "mi" ? "Warna Bahan" : "Warna/Finishing", value: product.color }] : []),
                { icon: Tag, label: "Kegunaan", value: product.usage },
                { icon: Minus, label: "Minimal Order", value: product.minOrder },
                ...(product.moldingFee ? [{ icon: Package, label: "Biaya Molding", value: product.moldingFee }] : []),
                { icon: Clock, label: "Estimasi Produksi", value: product.productionTime },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon className={`w-5 h-5 ${iconColors[item.label] || "text-primary"} mt-0.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    {item.value.includes("/") && false ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 mt-1">
                        {item.value.split(" / ").map((opt, i) => (
                          <div
                            key={i}
                            className="px-1.5 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-medium text-gray-900 text-center hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] hover:shadow-md transition-all duration-200 cursor-default"
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-1">Harga</p>
              {sub?.slug === "souvenir-pernikahan" ? (
                <p className="text-2xl font-extrabold text-primary">Harga Mulai Rp. 150.000 - Rp. 500.000</p>
              ) : (
                <p className="text-2xl font-extrabold text-primary">{product.price}</p>
              )}
              <p className="text-sm font-medium text-gray-700 mt-1">
                Harga bervariasi tergantung spesifikasi, jumlah, kompleksitas desain dan Bahan yang digunakan. Hubungi kami untuk penawaran terbaik.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-[#25D366]/25"
              >
                <MessageCircle className="w-5 h-5" />
                Tanya Harga via WhatsApp
              </a>
              <a
                href={getWhatsAppLink(`Halo Karyamedia Souvenir, saya ingin request quote untuk produk ${product.code} (${product.name}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-[#0A1A30] text-white py-3.5 rounded-xl font-medium transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Request Quote
              </a>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                <strong>Info Custom:</strong> Produk ini bisa di-custom sesuai kebutuhan Anda. Kirimkan logo, desain, atau referensi via WhatsApp untuk konsultasi gratis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-8">Produk Terkait</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/katalog-produk/${rp.categoryId}/${getSubSlug(rp)}/${rp.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {rp.images.length > 0 ? (
                      <Image
                        src={rp.images[0]}
                        alt={rp.name}
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
            <h2 className="heading-display text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">Cara Pesan</h2>
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
                  <Icon className="w-6 h-6 text-primary mx-auto mb-3 group-hover:text-accent transition-all duration-300" />
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
