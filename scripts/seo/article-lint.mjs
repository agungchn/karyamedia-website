// Article standard linter for karyamedia-web
// Validates src/data/articles.ts against the editorial + SEO standards.
// ALL rules are MANDATORY: any violation exits 1 and blocks the commit
// via the git pre-commit hook.
//
// Usage:
//   node scripts/seo/article-lint.mjs                 # lint ALL articles
//   ARTICLE_LINT_SLUGS=a,b,c node .../article-lint.mjs # lint only given slugs
// (the git pre-commit hook calls it with changed/new slugs)

import { readFileSync, existsSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const articlesPath = join(root, "src/data/articles.ts")
const categoriesPath = join(root, "src/data/categories.ts")
const pagePath = join(root, "src/app/blog/[slug]/page.tsx")
const publicDir = join(root, "public")

// ---------------------------------------------------------------- parser
// Split the articles source into per-article blocks keyed by slug.
export function extractArticles(text) {
  const slugRe = /slug:\s*"([^"]+)"/g
  const positions = []
  let m
  while ((m = slugRe.exec(text))) positions.push({ slug: m[1], idx: m.index })
  const arts = []
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].idx
    const end = positions[i + 1] ? positions[i + 1].idx : text.length
    arts.push({ slug: positions[i].slug, block: text.slice(start, end) })
  }
  return arts
}

// ---------------------------------------------------------------- linter
export function lintText(text, { onlySlugs = null } = {}) {
  const catText = readFileSync(categoriesPath, "utf8")
  const pageText = readFileSync(pagePath, "utf8")

  const topSlugs = new Set(
    [...catText.matchAll(/slug:\s*"([^"]+)"\s*,\s*icon:\s*"[^"]*",\s*description:\s*"[^"]*",\s*subcategories:/g)].map((mm) => mm[1]),
  )
  const allCatSlugs = [...catText.matchAll(/slug:\s*"([^"]+)"/g)].map((mm) => mm[1])
  const subSlugs = new Set(allCatSlugs.filter((s) => !topSlugs.has(s)))

  const mapKeys = [...pageText.matchAll(/"([^"]+)":\s*"(?:plakat|medali|piala-trophy|gift-box|accessories|prasasti|souvenir-wisuda|batas-wilayah)"/g)].map((mm) => mm[1])
  const allowedCategories = new Set([...mapKeys, "Blog", "Souvenir"])

  const arts = extractArticles(text)
  const allSlugsSet = new Set(arts.map((a) => a.slug))
  const only = onlySlugs ? new Set(onlySlugs) : null

  const errors = []
  const warnings = []
  const slugCounts = {}
  const field = (chunk, name) => {
    const mm = chunk.match(new RegExp(name + ':\\s*"([^"]*)"'))
    return mm ? mm[1] : null
  }

  for (const { slug, block } of arts) {
    slugCounts[slug] = (slugCounts[slug] || 0) + 1
    if (only && !only.has(slug)) continue
    const at = `blog/${slug}`

    const title = field(block, "title")
    const description = field(block, "description")
    const category = field(block, "category")
    const date = field(block, "date")
    const image = field(block, "image")
    const tagsM = block.match(/tags:\s*\[([\s\S]*?)\]/)
    const tags = tagsM ? [...tagsM[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : []
    const cM = block.match(/content:\s*`([\s\S]*?)`/)
    const content = cM ? cM[1] : ""

    for (const [k, v] of [
      ["title", title], ["description", description], ["category", category],
      ["date", date], ["image", image], ["content", content],
      ["tags", tags.length ? "x" : null],
    ]) {
      if (v === null || v === "") errors.push(`${at}: field "${k}" wajib diisi`)
    }

    if (category && !allowedCategories.has(category))
      errors.push(`${at}: category "${category}" tidak dikenali (harus salah satu: ${[...allowedCategories].join(", ")})`)

    const canonical = field(block, "canonical")
    const canonicalSlug = canonical ? canonical.replace(/^\/blog\//, "") : null
    if (canonicalSlug && !allSlugsSet.has(canonicalSlug))
      errors.push(`${at}: canonical "${canonical}" harus merujuk ke slug artikel yang ada`)

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date))
      errors.push(`${at}: date harus format YYYY-MM-DD`)

    if (description) {
      if (description.length > 160) errors.push(`${at}: description ${description.length} karakter (>160, maksimal 160)`)
      else if (description.length < 120) errors.push(`${at}: description ${description.length} karakter (<120, ideal 155-160)`)
    }

    if (title && title.length > 60) errors.push(`${at}: title ${title.length} karakter (>60, maksimal 60)`)

    if (image) {
      const fp = join(publicDir, image)
      if (!existsSync(fp)) errors.push(`${at}: gambar tidak ditemukan: ${image}`)
      else {
        const sz = statSync(fp).size
        if (sz > 1024 * 1024) warnings.push(`${at}: gambar ${Math.round(sz / 1024)} KB (>1MB, kompres)`)
      }
    }

    if (tags.length && (tags.length < 4 || tags.length > 6))
      errors.push(`${at}: tags ${tags.length} (wajib 4-6)`)

    if (content) {
      const plain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      const words = plain ? plain.split(" ").length : 0
      if (words < 800) errors.push(`${at}: konten ${words} kata (<800, minimal wajib 800)`)
      else if (words > 1800) warnings.push(`${at}: konten ${words} kata (>1800, hindari filler)`)

      const h2 = (content.match(/<h2/g) || []).length
      if (h2 < 2) errors.push(`${at}: hanya ${h2} <h2> (wajib >=2)`)
      if (!/<h2[^>]*>\s*FAQ\s*<\/h2>/i.test(content)) errors.push(`${at}: wajib ada bagian FAQ (<h2>FAQ</h2>)`)
      else {
        const faqIdx = content.search(/<h2[^>]*>\s*FAQ\s*<\/h2>/i)
        const faqBlock = content.slice(faqIdx)
        const faqPairs = (faqBlock.match(/<h3>[\s\S]*?<\/h3>\s*<p>[\s\S]*?<\/p>/g) || []).length
        if (faqPairs < 1) errors.push(`${at}: FAQ ada tapi tidak ada pasangan <h3>pertanyaan</h3><p>jawaban</p>`)
      }

      // keyword relevance: head noun keyword utama wajib di title (==H1),
      // dan keyword utama lengkap wajib di 240 karakter pertama (intro)
      if (tags.length) {
        const kw = tags[0].toLowerCase()
        const head = kw.split(" ")[0]
        if (title && !title.toLowerCase().includes(head))
          errors.push(`${at}: keyword utama "${tags[0]}" (kata kunci "${head}") tidak ada di title/H1`)
        const intro = plain.slice(0, 240).toLowerCase()
        if (!intro.includes(kw))
          errors.push(`${at}: keyword utama "${tags[0]}" tidak ada di 240 karakter pertama`)
      }

      // readability: rata-rata kata per kalimat
      const sentences = plain.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      const avg = sentences.length ? words / sentences.length : 0
      if (avg > 30) warnings.push(`${at}: rata-rata ${Math.round(avg)} kata/kalimat (terlalu panjang, kurang readable)`)

      // alt attribute: every <img> MUST have a non-empty alt (accessibility + image SEO)
      const imgs = [...content.matchAll(/<img\b[^>]*>/gi)]
      for (const im of imgs) {
        const tag = im[0]
        const hasAlt = /\balt\s*=\s*"([^"]*)"/i.test(tag)
        const altVal = hasAlt ? (tag.match(/\balt\s*=\s*"([^"]*)"/i)?.[1] ?? "") : null
        if (!hasAlt || altVal.trim() === "") {
          errors.push(`${at}: setiap <img> wajib punya atribut alt yang deskriptif (ditemukan tag tanpa alt)`)
          break
        }
      }

      const hrefs = [...content.matchAll(/href="([^"]+)"/g)].map((x) => x[1])
      let internal = 0
      for (const href of hrefs) {
        if (href.startsWith("/blog/")) {
          const s = href.replace(/^\/blog\//, "")
          if (!allSlugsSet.has(s) && s !== slug) errors.push(`${at}: link blog rusak ke "${href}" (slug tidak ada)`)
          else internal++
        } else if (href.startsWith("/katalog-produk/")) {
          const parts = href.split("/").filter(Boolean)
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
        } else if (["/profil", "/kontak", "/cara-pesan", "/gallery"].some((p) => href === p || href.startsWith(p + "#") || href.startsWith(p + "/"))) {
          internal++
        } else {
          warnings.push(`${at}: link internal aneh: "${href}"`)
        }
      }
      if (internal === 0) errors.push(`${at}: wajib ada >=1 link internal (cluster/pilar)`)
    }
  }

  for (const [s, c] of Object.entries(slugCounts)) {
    if (c > 1) errors.push(`DUPLICATE slug "${s}" ditemukan ${c}x — slug harus unik`)
  }

  // duplicate content detection (Jaccard similarity pada token konten)
  const stop = new Set("dan,untuk,dengan,yang,di,dari,ke,pada,atau,the,a,an,of,to,in,ini,itu,ada,bisa,juga,akan,atau,sebagai".split(","))
  const toks = (s) => (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => !stop.has(w))
  const tokSets = arts.map((a) => {
    const c = a.block.match(/content:\s*`([\s\S]*?)`/)
    return c ? new Set(toks(c[1].replace(/<[^>]*>/g, " "))) : new Set()
  })
  for (let i = 0; i < arts.length; i++) {
    if (only && !only.has(arts[i].slug)) continue
    let best = 0
    let bestSlug = null
    for (let j = 0; j < arts.length; j++) {
      if (i === j) continue
      const A = tokSets[i]
      const B = tokSets[j]
      if (!A.size || !B.size) continue
      let inter = 0
      for (const w of A) if (B.has(w)) inter++
      const jac = inter / Math.min(A.size, B.size)
      if (jac > best) {
        best = jac
        bestSlug = arts[j].slug
      }
    }
    if (best >= 0.85) errors.push(`blog/${arts[i].slug}: konten hampir duplikat dengan blog/${bestSlug} (similarity ${Math.round(best * 100)}%)`)
    else if (best >= 0.6) warnings.push(`blog/${arts[i].slug}: konten mirip blog/${bestSlug} (similarity ${Math.round(best * 100)}%)`)
  }

  return { errors, warnings, count: arts.length }
}

// ---------------------------------------------------------------- main
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isMain) {
  const text = readFileSync(articlesPath, "utf8")
  const only = process.env.ARTICLE_LINT_SLUGS ? process.env.ARTICLE_LINT_SLUGS.split(",") : null
  const { errors, warnings, count } = lintText(text, { onlySlugs: only })
  console.log(`\nArtikel diperiksa: ${count}`)
  console.log(`ERROR  : ${errors.length}`)
  console.log(`WARNING: ${warnings.length}\n`)
  for (const e of errors) console.log("  ✗ " + e)
  for (const w of warnings) console.log("  ! " + w)
  process.exit(errors.length ? 1 : 0)
}
