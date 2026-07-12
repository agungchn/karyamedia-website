// Article standard linter for karyamedia-web
// Validates src/data/articles.ts against the editorial + SEO standards.
// Errors (exit 1) block commits via the git pre-commit hook.
// Warnings are reported but do not block.

import { readFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const articlesPath = join(root, "src/data/articles.ts")
const categoriesPath = join(root, "src/data/categories.ts")
const pagePath = join(root, "src/app/blog/[slug]/page.tsx")
const publicDir = join(root, "public")

const text = readFileSync(articlesPath, "utf8")
const catText = readFileSync(categoriesPath, "utf8")
const pageText = readFileSync(pagePath, "utf8")

// --- taxonomy from categories.ts ---
const topSlugs = new Set(
  [...catText.matchAll(/slug:\s*"([^"]+)"\s*,\s*icon:\s*"[^"]*",\s*description:\s*"[^"]*",\s*subcategories:/g)].map((m) => m[1]),
)
const allCatSlugs = [...catText.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1])
const subSlugs = new Set(allCatSlugs.filter((s) => !topSlugs.has(s)))

// allowed article category vocabulary (categorySlugMap keys + legacy "Blog"/"Souvenir")
const mapKeys = [...pageText.matchAll(/"([^"]+)":\s*"(?:plakat|medali|piala-trophy|gift-box|accessories|prasasti|souvenir-wisuda|batas-wilayah)"/g)].map((m) => m[1])
const allowedCategories = new Set([...mapKeys, "Blog", "Souvenir"])

// --- split articles by slug position ---
const slugRe = /slug:\s*"([^"]+)"/g
const positions = []
let m
while ((m = slugRe.exec(text))) positions.push({ slug: m[1], idx: m.index })
if (positions.length === 0) {
  console.error("No articles found in", articlesPath)
  process.exit(1)
}
const allSlugsSet = new Set(positions.map((p) => p.slug))
// optional filter: only lint specific slugs (used by the git pre-commit hook)
const onlySlugs = process.env.ARTICLE_LINT_SLUGS ? new Set(process.env.ARTICLE_LINT_SLUGS.split(",")) : null

const field = (chunk, name) => {
  const mm = chunk.match(new RegExp(name + ':\\s*"([^"]*)"'))
  return mm ? mm[1] : null
}

const errors = []
const warnings = []
const slugCounts = {}

for (let i = 0; i < positions.length; i++) {
  const slug = positions[i].slug
  slugCounts[slug] = (slugCounts[slug] || 0) + 1
  if (onlySlugs && !onlySlugs.has(slug)) continue
  const chunk = text.slice(positions[i].idx, positions[i + 1] ? positions[i + 1].idx : text.length)
  const at = `blog/${slug}`

  const title = field(chunk, "title")
  const description = field(chunk, "description")
  const category = field(chunk, "category")
  const date = field(chunk, "date")
  const image = field(chunk, "image")
  const tagsM = chunk.match(/tags:\s*\[([\s\S]*?)\]/)
  const tags = tagsM ? [...tagsM[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : []
  const cM = chunk.match(/content:\s*`([\s\S]*?)`/)
  const content = cM ? cM[1] : ""

  // required fields
  for (const [k, v] of [["title", title], ["description", description], ["category", category], ["date", date], ["image", image], ["content", content], ["tags", tags.length ? "x" : null]]) {
    if (v === null || v === "") errors.push(`${at}: field "${k}" wajib diisi`)
  }

  // category vocabulary
  if (category && !allowedCategories.has(category))
    errors.push(`${at}: category "${category}" tidak dikenali (harus salah satu: ${[...allowedCategories].join(", ")})`)

  // date format
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date))
    warnings.push(`${at}: date harus format YYYY-MM-DD`)

  // meta description length (template: 155-160)
  if (description) {
    if (description.length > 170) errors.push(`${at}: description ${description.length} karakter (>170, batas aman 160)`)
    else if (description.length < 120) warnings.push(`${at}: description ${description.length} karakter (<120, ideal 155-160)`)
  }

  // title length (template: max 60)
  if (title && title.length > 60) errors.push(`${at}: title ${title.length} karakter (>60, maksimal 60)`)

  // image exists
  if (image) {
    const fp = join(publicDir, image)
    if (!existsSync(fp)) errors.push(`${at}: gambar tidak ditemukan: ${image}`)
  }

  // tags count (template: 4-6)
  if (tags.length && (tags.length < 4 || tags.length > 6))
    warnings.push(`${at}: tags ${tags.length} (ideal 4-6)`)

  // content checks
  if (content) {
    const plain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    const words = plain ? plain.split(" ").length : 0
    if (words < 400) warnings.push(`${at}: konten ${words} kata (<400, ideal 400-1000)`)
    else if (words > 1000) warnings.push(`${at}: konten ${words} kata (>1000)`)

    const h2 = (content.match(/<h2/g) || []).length
    if (h2 < 2) warnings.push(`${at}: hanya ${h2} <h2> (butuh >=2 untuk struktur + daftar isi)`)
    if (!/<h2[^>]*>\s*FAQ\s*<\/h2>/i.test(content)) warnings.push(`${at}: tidak ada bagian FAQ (<h2>FAQ</h2>)`)

    // internal links
    const hrefs = [...content.matchAll(/href="([^"]+)"/g)].map((x) => x[1])
    let internal = 0
    for (const href of hrefs) {
      if (href.startsWith("/blog/")) {
        const s = href.replace(/^\/blog\//, "")
        if (!allSlugsSet.has(s) && s !== slug) errors.push(`${at}: link blog rusak ke "${href}" (slug tidak ada)`)
        else internal++
      } else if (href.startsWith("/katalog-produk/")) {
        const parts = href.split("/").filter(Boolean) // ["katalog-produk", a, b?]
        if (parts.length === 2) {
          if (!topSlugs.has(parts[1])) errors.push(`${at}: link katalog rusak ke "${href}" (bukan kategori)`)
        } else if (parts.length === 3) {
          if (!topSlugs.has(parts[1])) errors.push(`${at}: link katalog rusak ke "${href}" (bukan kategori)`)
          else if (!subSlugs.has(parts[2])) errors.push(`${at}: link katalog rusak ke "${href}" (subkategori tidak ada)`)
        } else {
          errors.push(`${at}: link katalog rusak ke "${href}" (format salah, harus /katalog-produk/{kategori}/{sub})`)
        }
        internal++
      } else if (href.startsWith("http") || href.startsWith("#")) {
        // external / anchor: ignore
      } else {
        warnings.push(`${at}: link internal aneh: "${href}"`)
      }
    }
    if (internal === 0) warnings.push(`${at}: tidak ada link internal (butuh >=1 untuk cluster/pilar)`)
  }
}

// duplicate slugs
for (const [s, c] of Object.entries(slugCounts)) {
  if (c > 1) errors.push(`DUPLICATE slug "${s}" ditemukan ${c}x — slug harus unik`)
}

console.log(`\nArtikel diperiksa: ${positions.length}`)
console.log(`ERROR  : ${errors.length}`)
console.log(`WARNING: ${warnings.length}\n`)
for (const e of errors) console.log("  ✗ " + e)
for (const w of warnings) console.log("  ! " + w)

process.exit(errors.length ? 1 : 0)
