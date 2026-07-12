import { MetadataRoute } from "next"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { articles } from "@/data/articles"

const BASE_URL = "https://karyamediasouvenir.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/katalog-produk`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/profil`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/kontak`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/cara-pesan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/katalog-produk/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const subcategoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) =>
    cat.subcategories.map((sub) => {
      const canonical = cat.subcategories.length === 1
        ? `${BASE_URL}/katalog-produk/${cat.slug}`
        : `${BASE_URL}/katalog-produk/${cat.slug}/${sub.slug}`
      return {
        url: canonical,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }
    })
  )

  const productPages: MetadataRoute.Sitemap = products.map((product) => {
    const cat = categories.find((c) => c.id === product.categoryId)
    const sub = cat?.subcategories.find((s) => s.id === product.subcategoryId)
    const subSlug = sub?.slug || product.subcategoryId
    return {
      url: `${BASE_URL}/katalog-produk/${product.categoryId}/${subSlug}/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }
  })

  const blogPages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...subcategoryPages, ...productPages, ...blogPages]
}
