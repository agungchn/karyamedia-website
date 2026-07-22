// Auto Schema Markup Generator — scans articles.ts & generates Article + BreadcrumbList + Product schema
// Usage: node scripts/seo/generate-schema.mjs
// Output: prints summary + saves to src/data/schema-cache.json
import { readFileSync, writeFileSync } from "fs"
import { join, dirname, resolve } from "path"
import { fileURLToPath } from "url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")
const outputPath = join(root, "src/data/schema-cache.json")

const SITE_URL = "https://karyamediasouvenir.com"
const COMPANY_NAME = "Karyamedia Souvenir"

const src = readFileSync(articlesPath, "utf8")
const blocks = src.split(/},\s*\n\s*\{/)
const schemas = []

for (const b of blocks) {
  const slug = b.match(/slug:\s*"([^"]+)"/)?.[1]
  const title = b.match(/title:\s*"([^"]+)"/)?.[1]
  const desc = b.match(/description:\s*"([^"]+)"/)?.[1]
  const cat = b.match(/category:\s*"([^"]+)"/)?.[1]
  const img = b.match(/image:\s*"([^"]+)"/)?.[1]
  const dateMatch = b.match(/date:\s*"([^"]+)"/)?.[1]
  const tags = b.match(/tags:\s*\[([^\]]+)\]/)?.[1]

  if (!slug || !title) continue

  const articleUrl = `${SITE_URL}/blog/${slug}`
  const imageUrl = img ? `${SITE_URL}${img}` : `${SITE_URL}/images/og-default.png`
  const date = dateMatch || new Date().toISOString().split("T")[0]
  const tagList = tags ? tags.split(",").map((t) => t.trim().replace(/"/g, "")) : []
  const catSlug = (cat || "blog").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

  // Article schema
  schemas.push({
    slug,
    title,
    article: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: desc || `Artikel tentang ${title} dari ${COMPANY_NAME} Yogyakarta`,
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
        { "@type": "ListItem", position: 2, name: cat || "Blog", item: `${SITE_URL}/katalog-produk/${catSlug}` },
        { "@type": "ListItem", position: 3, name: title, item: articleUrl },
      ],
    },
    keywords: tagList,
  })
}

writeFileSync(outputPath, JSON.stringify(schemas, null, 2))
console.log(`✅ Schema untuk ${schemas.length} artikel → ${outputPath}`)
console.log("ℹ️  Inject schema di halaman artikel via <script type=\"application/ld+json\">")
