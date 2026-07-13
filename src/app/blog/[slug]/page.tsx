import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Calendar, ChevronRight, MessageCircle, Tag, ArrowLeft, Sparkles, Award } from "lucide-react"
import { articles } from "@/data/articles"
import { getWhatsAppLink } from "@/lib/utils"
import { ArticleSchema, BreadcrumbSchema, FAQPageSchema } from "@/components/json-ld"
import { categories } from "@/data/categories"
import { FaqAccordion } from "@/components/faq-accordion"
import { ShareButtons } from "@/components/share-buttons"

interface Props {
  params: Promise<{ slug: string }>
}

const categorySlugMap: Record<string, string> = {
  "Plakat": "plakat",
  "Medali": "medali",
  "Piala & Trophy": "piala-trophy",
  "Souvenir Wisuda": "souvenir-wisuda",
  "Accessories": "accessories",
  "Prasasti": "prasasti",
  "Gift Box": "gift-box",
  "Batas Wilayah": "batas-wilayah",
}

const subcategoryMap: Record<string, string> = {
  "panduan-lengkap-plakat-custom": "plakat-akrilik",
  "panduan-memilih-plakat-akrilik-custom": "plakat-akrilik",
  "plakat-akrilik-custom-untuk-berbagai-kebutuhan": "plakat-akrilik",
  "plakat-wisuda-custom-untuk-kenang-kenangan-kelulusan": "plakat-akrilik",
  "medali-custom-untuk-kompetisi-dan-event": "medali-custom",
  "medali-custom-panduan-memilih-dan-memesan": "medali-custom",
  "medali-piala-souvenir-turnamen-olahraga": "medali-custom",
  "medali-custom-untuk-lomba-sekolah": "medali-custom",
  "perbandingan-medali-logam-akrilik": "medali-custom",
  "tips-desain-medali-custom-menarik": "medali-custom",
  "harga-medali-perunggu-lengkap": "medali-custom",
  "pengrajin-medali-custom-jogja": "medali-custom",
  "prasasti-marmer-custom-untuk-gedung-dan-peresmian": "prasasti-marmer",
  "souvenir-wisuda-custom-untuk-universitas": "souvenir-wisuda",
  "souvenir-wisuda-panduan-memilih-untuk-kampus": "souvenir-wisuda",
  "piala-golf-custom-untuk-turnamen-profesional": "piala-golf",
  "panduan-memilih-piala-golf-custom-berkualitas": "piala-golf",
  "trophy-golf-elegan-untuk-berbagai-jenis-kejuaraan": "piala-golf",
  "tumbler-souvenir-custom-untuk-event-dan-perusahaan": "tumbler",
  "tumbler-souvenir-perusahaan-untuk-branding-bisnis": "tumbler",
  "tumbler-stainless-steel-custom-untuk-merchandise-premium": "tumbler",
  "tumbler-promosi-untuk-branding-dan-merchandise-event": "tumbler",
  "tumbler-custom-murah-berkualitas-untuk-semua-kebutuhan": "tumbler",
  "tumbler-souvenir-untuk-event-dan-merchandise-custom": "tumbler",
  "plakat-wayang-custom-untuk-penghargaan-instansi": "plakat-wayang",
  "harga-plakat-wayang-custom-dan-tips-memilih": "plakat-wayang",
  "souvenir-wayang-khas-indonesia": "plakat-wayang",
  "plakat-wayang-kayu-ukir-premium": "plakat-wayang",
  "plakat-wayang-untuk-acara-perusahaan": "plakat-wayang",
  "plakat-wayang-jogja-terpercaya": "plakat-wayang",
  "plakat-fiberglass-custom-untuk-penghargaan-dan-event": "plakat-fiberglass",
  "plakat-fiberglass-custom-untuk-penghargaan": "plakat-fiberglass",
  "prasasti-marmer-custom-untuk-peresmian-dan-penghargaan": "prasasti-marmer",
  "prasasti-marmer-untuk-peresmian-dan-kenang-kenangan": "prasasti-marmer",
  "souvenir-wisuda-custom": "souvenir-wisuda",
  "patung-wisuda-custom": "patung-wisuda",
  "name-tag-custom-untuk-kantor-dan-event": "name-tag",
  "prasasti-kuningan-custom-untuk-penghargaan-dan-peresmian": "prasasti-kuningan",
  "prasasti-stainless-steel-untuk-kebutuhan-modern": "prasasti-stainless-steel",
  "box-kertas-import-custom-untuk-kemasan-premium": "box-kertas-import",
  "box-batik-custom-untuk-souvenir-tradisional": "box-batik",
  "box-kertas-marga-custom-untuk-souvenir-adat": "box-kertas-marga",
  "brass-table-sebagai-penanda-gedung-dan-ruangan": "brass-table",
  "center-point-custom-untuk-penanda-lokasi": "center-point",
  "panduan-lengkap-souvenir-wisuda-custom": "souvenir-wisuda",
  "panduan-lengkap-piala-dan-trophy-custom": "piala-trophy",
  "panduan-lengkap-prasasti-custom": "prasasti-marmer",
  "panduan-lengkap-gift-box-custom": "gift-box",
  "panduan-lengkap-tumbler-custom": "tumbler",
  "panduan-lengkap-medali-custom": "medali-custom",
  "panduan-memilih-piala-trophy": "piala-trophy",
  "jenis-plakat-custom": "plakat-akrilik",
  "plakat-akrilik-custom": "plakat-akrilik",
  "medali-custom": "medali-custom",
  "name-tag-custom": "name-tag",
  "panduan-gantungan-kunci-custom": "gantungan-kunci",
  "gift-box-souvenir": "gift-box",
  "prasasti-peresmian": "prasasti-marmer",
  "piala-akrilik-custom-untuk-berbagai-kejuaraan": "piala-trophy",
  "piala-fiberglass-custom-untuk-turnamen-olahraga": "piala-trophy",
  "piala-futsal-custom-untuk-turnamen-sepak-bola": "piala-trophy",
  "piala-17-agustus-custom-untuk-lomba-kemerdekaan": "piala-trophy",
  "toga-wisuda-custom-untuk-upacara-kelulusan": "souvenir-wisuda",
  "bingkai-ijazah-dan-foto-wisuda-custom": "souvenir-wisuda",
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  if (!article) return {}

  const readTime = Math.max(1, Math.round(article.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200))

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `https://karyamediasouvenir.com/blog/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://karyamediasouvenir.com/blog/${slug}`,
      type: "article",
      siteName: "Karyamedia Souvenir",
      locale: "id_ID",
      publishedTime: article.date,
      tags: article.tags,
      images: [article.image],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  if (!article) notFound()

  const catSlug = categorySlugMap[article.category] || ""
  const subSlug = subcategoryMap[article.slug]
  const productUrl = subSlug ? `/katalog-produk/${catSlug}/${subSlug}` : catSlug ? `/katalog-produk/${catSlug}` : ""
  const productLabel = subSlug
    ? categories.find(c => c.slug === catSlug)?.subcategories.find(s => s.slug === subSlug)?.name || article.category
    : article.category

  const breadcrumbItems = [
    { name: "Beranda", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: article.title, url: `/blog/${article.slug}` },
  ]

  const sameCategory = articles.filter((a) => a.slug !== slug && a.category === article.category)
  const otherArticles = sameCategory.length >= 3
    ? sameCategory.slice(0, 3)
    : [...sameCategory, ...articles.filter((a) => a.slug !== slug && a.category !== article.category)].slice(0, 3)

  const readTime = Math.max(1, Math.round(article.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200))

  const headingMatches = [...article.content.matchAll(/<h2>(.*?)<\/h2>/g)]
  const contentWithIds = article.content.replace(/<h2>(.*?)<\/h2>/g, (_, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    return `<h2 id="${id}">${text}</h2>`
  })
  const hasToc = headingMatches.length >= 3

  const faqStart = contentWithIds.indexOf('<h2 id="faq">FAQ</h2>')
  let contentBeforeFaq = contentWithIds
  let faqItems: { q: string; a: string }[] = []
  let contentAfterFaq = ""

  if (faqStart !== -1) {
    const nextH2 = contentWithIds.indexOf("<h2", faqStart + 1)
    const faqBlock = nextH2 !== -1
      ? contentWithIds.slice(faqStart, nextH2)
      : contentWithIds.slice(faqStart)

    const faqRegex = /<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g
    let m: RegExpExecArray | null
    let lastFaqEnd = 0
    while ((m = faqRegex.exec(faqBlock)) !== null) {
      faqItems.push({ q: m[1], a: m[2] })
      lastFaqEnd = m.index + m[0].length
    }

    contentBeforeFaq = contentWithIds.slice(0, faqStart)
    if (nextH2 !== -1) {
      contentAfterFaq = contentWithIds.slice(nextH2)
    } else {
      contentAfterFaq = faqBlock.slice(lastFaqEnd).trim()
    }
  }

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ArticleSchema
        title={article.title}
        description={article.description}
        image={article.image}
        date={article.date}
        slug={article.slug}
        category={article.category}
        tags={article.tags}
        wordCount={article.content.replace(/<[^>]*>/g, "").split(/\s+/).length}
        readTime={readTime}
      />
      <section className="relative bg-gradient-to-br from-primary to-foreground overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary-light/10 rounded-full blur-[80px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
          </Link>
          <div className="flex items-center gap-3 text-sm text-blue-200 mb-4">
            {productUrl ? (
              <Link href={productUrl} className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium hover:bg-accent/20 transition-colors">
                <Sparkles className="w-3 h-3" />
                {article.category}
              </Link>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                {article.category}
              </div>
            )}
            <span className="text-blue-200/60">|</span>
            <Calendar className="w-4 h-4" />
            <span>{article.date}</span>
            <span className="text-blue-200/40">|</span>
            <span className="text-blue-200/80 text-xs">{readTime} menit baca</span>
          </div>
          <h1 className="heading-display text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-accent-accessible via-accent to-accent-light">
            {article.title}
          </h1>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {article.image && (
          <div className="float-left mr-6 mb-4 w-44 sm:w-72 rounded-2xl overflow-hidden shadow-lg aspect-[3/4] relative ring-1 ring-white/10">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 176px, 288px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {hasToc && (
          <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
            <h2 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Daftar Isi</h2>
            <nav className="space-y-1.5">
              {headingMatches.map(([_, h2]) => {
                const id = h2.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block text-sm text-gray-600 hover:text-accent transition-colors"
                  >
                    {h2}
                  </a>
                )
              })}
            </nav>
          </div>
        )}

        <div
          className="prose prose-gray max-w-none
            prose-headings:text-primary prose-headings:heading-display
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-ul:text-gray-700 prose-ul:mb-6
            prose-ol:text-gray-700 prose-ol:mb-6
            prose-li:mb-1.5
            prose-strong:text-primary
            prose-a:text-primary-light prose-a:no-underline hover:prose-a:underline
          "
          dangerouslySetInnerHTML={{ __html: contentBeforeFaq }}
        />

        {faqItems.length > 0 && (
          <>
            <FAQPageSchema items={faqItems} />
            <div className="not-prose my-10">
              <h2 id="faq" className="text-2xl font-bold text-primary mb-6">FAQ</h2>
              <FaqAccordion items={faqItems} />
            </div>
          </>
        )}

        {contentAfterFaq && (
          <div
            className="prose prose-gray max-w-none mt-10
              prose-headings:text-primary prose-headings:heading-display
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-primary
              prose-a:text-primary-light prose-a:no-underline hover:prose-a:underline
            "
            dangerouslySetInnerHTML={{ __html: contentAfterFaq }}
          />
        )}

        {productUrl && (
          <div className="mt-10 p-6 bg-gradient-to-br from-accent/5 to-background rounded-2xl border border-accent/10 text-center">
            <Award className="w-10 h-10 text-accent mx-auto mb-3" />
            <h3 className="heading-display text-lg text-primary mb-1">
              Lihat Koleksi {productLabel}
            </h3>
            <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
              Temukan berbagai pilihan produk {productLabel.toLowerCase()} custom untuk kebutuhan Anda.
            </p>
            <Link
              href={productUrl}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-accessible text-white px-6 py-2.5 rounded-full font-medium transition-all text-sm"
            >
              Lihat Produk <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Tag className="w-4 h-4 text-gray-400" />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-accent/10 hover:text-accent transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <ShareButtons slug={article.slug} title={article.title} />
          </div>

          <div className="relative bg-gradient-to-br from-background to-white rounded-2xl p-8 text-center border border-accent/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 shimmer-line" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <Award className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="heading-display text-xl text-primary mb-2">
                Butuh Bantuan?
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Konsultasi gratis dengan tim Karyamedia Souvenir. Kami siap membantu Anda memilih produk yang tepat.
              </p>
              <a
                href={getWhatsAppLink(`Halo Karyamedia Souvenir, saya ingin konsultasi tentang ${article.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-[#25D366]/25"
              >
                <MessageCircle className="w-5 h-5" />
                Konsultasi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </article>

      {otherArticles.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="heading-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-8">
              Artikel Lainnya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {a.image ? (
                      <Image src={a.image} alt={a.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">Karyamedia</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-bold text-sm line-clamp-2">{a.title}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{a.date}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{a.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
