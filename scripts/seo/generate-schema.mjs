// Auto Schema Markup Generator — scans .mdx files & generates Article + BreadcrumbList + Product schema
// Usage: node scripts/seo/generate-schema.mjs
// Output: prints summary + saves to src/data/schema-cache.json
import { writeFileSync } from "fs"
import { readAllMdxArticles, PATHS } from "./mdx-helpers.mjs"

const outputPath = PATHS.ARTICLES_INDEX.replace("articles-index.json", "schema-cache.json")

const SITE_URL = "https://karyamediasouvenir.com"
const COMPANY_NAME = "Karyamedia Souvenir"

const articles = readAllMdxArticles()
const schemas = []

for (const a of articles) {
  if (!a.slug || !a.title) continue

  const articleUrl = `${SITE_URL}/blog/${a.slug}`
  const imageUrl = a.image ? `${SITE_URL}${a.image}` : `${SITE_URL}/images/og-default.png`
  const date = a.date || new Date().toISOString().split("T")[0]
  const catSlug = (a.category || "blog").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

  // Article schema
  schemas.push({
    slug: a.slug,
    title: a.title,
    article: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.description || `Artikel tentang ${a.title} dari ${COMPANY_NAME} Yogyakarta`,
      image: imageUrl,
      datePublished: date,
      dateModified: date,
      author: { "@type": "Organization", name: COMPANY_NAME, url: SITE_URL },
      publisher: { "@type": "Organization", name: COMPANY_NAME, url: SITE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: a.category || "Blog", item: `${SITE_URL}/katalog-produk/${catSlug}` },
        { "@type": "ListItem", position: 3, name: a.title, item: articleUrl },
      ],
    },
    keywords: a.tags,
  })
}

writeFileSync(outputPath, JSON.stringify(schemas, null, 2))
console.log(`✅ Schema untuk ${schemas.length} artikel → ${outputPath}`)
console.log("ℹ️  Inject schema di halaman artikel via <script type=\"application/ld+json\">")