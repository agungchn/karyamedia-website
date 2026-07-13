import Link from "next/link"
import { Metadata } from "next"
import { ChevronRight } from "lucide-react"
import { articles } from "@/data/articles"
import { BreadcrumbSchema } from "@/components/json-ld"
import { BlogSearch } from "@/components/blog-search"

export const metadata: Metadata = {
  title: "Blog & Artikel",
  description: "Baca artikel dan panduan seputar souvenir custom, plakat, medali, souvenir wisuda, dan tips memilih produk souvenir berkualitas dari Karyamedia Souvenir.",
  alternates: {
    canonical: "https://karyamediasouvenir.com/blog",
  },
  openGraph: {
    title: "Blog & Artikel - Karyamedia Souvenir",
    description: "Panduan dan tips seputar souvenir custom, plakat, medali, dan perlengkapan wisuda.",
    url: "https://karyamediasouvenir.com/blog",
    siteName: "Karyamedia Souvenir",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Artikel - Karyamedia Souvenir",
    description: "Panduan dan tips seputar souvenir custom, plakat, medali, dan perlengkapan wisuda.",
  },
}

const breadcrumbItems = [
  { name: "Beranda", url: "/" },
  { name: "Blog", url: "/blog" },
]

export default function BlogPage() {
  const sorted = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <section className="bg-gradient-to-br from-primary to-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="heading-display text-4xl md:text-5xl text-white mb-4">
            Blog & Artikel
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Panduan, tips, dan informasi seputar souvenir custom, plakat, medali, dan perlengkapan wisuda
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-accent-accessible transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-accent-accessible font-medium">Blog & Artikel</span>
        </nav>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogSearch articles={sorted} />
      </section>
    </>
  )
}
