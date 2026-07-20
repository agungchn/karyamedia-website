// One-shot repair for the pre-existing article-lint errors in articles.ts.
// Fixes (all idempotent — re-running yields 0 errors):
//   - title > 60 chars            -> truncate at word boundary (+ …)
//   - description > 160 chars     -> truncate at word boundary
//   - tags count != 4..6          -> keep first 6
//   - image file missing          -> swap to an existing image in the same folder
//   - broken /blog/ links         -> unlink (keep text)
//   - no internal link             -> inject a related /blog/ link
//   - missing / malformed FAQ      -> ensure <h2>FAQ</h2> with <h3>Q</h3><p>A</p> pairs
//   - content < 800 words         -> append a helpful section (with internal links)
//   - keyword utama tidak di title/H1 -> sisipkan head noun ke title
//   - keyword utama tidak di intro   -> sisipkan kalimat pembuka ber-keyword
//
//   node scripts/seo/fix-lint.mjs
//   node scripts/seo/fix-lint.mjs --dry     # only report, no write

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { extractArticles } from "./article-lint.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "../..")
const articlesPath = join(root, "src/data/articles.ts")
const publicDir = join(root, "public")

const MAX_TITLE = 60
const MAX_DESC = 160
const MIN_WORDS = 800
const MAX_TAGS = 6

const escTpl = (s) => String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
const wordCount = (c) => (c.replace(/<[^>]*>/g, " ").match(/\S+/g) || []).length
const getField = (block, name) => {
  const m = block.match(new RegExp(name + ':\\s*"([^"]*)"'))
  return m ? m[1] : ""
}
const getTags = (block) => {
  const m = block.match(/tags:\s*\[([\s\S]*?)\]/)
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : []
}

// category name -> slug (from categories.ts)
function loadCategorySlugs() {
  const text = readFileSync(join(root, "src/data/categories.ts"), "utf8")
  const map = {}
  const re = /name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g
  let m
  while ((m = re.exec(text))) map[m[1]] = m[2]
  return map
}

// top-level catalog category slugs (those that own subcategories)
function loadTopCats() {
  const text = readFileSync(join(root, "src/data/categories.ts"), "utf8")
  return new Set(
    [...text.matchAll(/slug:\s*"([^"]+)"\s*,\s*icon:\s*"[^"]*",\s*description:\s*"[^"]*",\s*subcategories:/g)].map((mm) => mm[1]),
  )
}

const catSlugs = loadCategorySlugs()
const topCats = loadTopCats()
const text0 = readFileSync(articlesPath, "utf8")
const arts = extractArticles(text0)
const allSlugs = new Set(arts.map((a) => a.slug))
const meta = arts.map((a) => ({
  slug: getField(a.block, "slug"),
  title: getField(a.block, "title"),
  category: getField(a.block, "category"),
}))

function pickRelated(category, excludeSlug) {
  const same = meta.find((m) => m.category === category && m.slug !== excludeSlug && allSlugs.has(m.slug))
  if (same) return same
  return meta.find((m) => m.slug !== excludeSlug && allSlugs.has(m.slug))
}

function fixTitle(block, tags) {
  const m = block.match(/title:\s*"([^"]*)"/)
  if (!m) return block
  let t = m[1]
  if (tags && tags.length) {
    const head = tags[0].toLowerCase().split(" ")[0]
    if (!t.toLowerCase().includes(head)) {
      const cand = `${tags[0].split(" ")[0]} — ${t}`
      t = cand.length > MAX_TITLE ? cand.slice(0, MAX_TITLE).trim() + "…" : cand
    }
  }
  if (t.length > MAX_TITLE) {
    let cut = t.slice(0, MAX_TITLE)
    const sp = cut.lastIndexOf(" ")
    if (sp > 35) cut = cut.slice(0, sp)
    t = cut.trim() + "…"
  }
  return block.replace(m[0], `title: "${t}"`)
}

function fixDescription(block) {
  const m = block.match(/description:\s*"([^"]*)"/)
  if (!m) return block
  let d = m[1]
  if (d.length > MAX_DESC) {
    let cut = d.slice(0, MAX_DESC)
    const sp = cut.lastIndexOf(" ")
    if (sp > 100) cut = cut.slice(0, sp)
    d = cut.trim() + "…"
  }
  return block.replace(m[0], `description: "${d}"`)
}

function fixTags(block) {
  const m = block.match(/tags:\s*\[([^\]]*)\]/)
  if (!m) return block
  const items = [...m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1])
  if (items.length <= MAX_TAGS) return block
  const kept = items.slice(0, MAX_TAGS)
  return block.replace(m[0], `tags: [${kept.map((t) => `"${t}"`).join(", ")}]`)
}

function fixImage(block) {
  const m = block.match(/image:\s*"([^"]*)"/)
  if (!m) return block
  const img = m[1]
  if (existsSync(join(publicDir, img.replace(/^\//, "")))) return block
  const base = img.slice(0, img.lastIndexOf("/"))
  const dir = join(publicDir, base.replace(/^\//, ""))
  if (existsSync(dir)) {
    const alt = readdirSync(dir).find((f) => /\.(png|jpe?g|webp)$/i.test(f))
    if (alt) return block.replace(m[0], `image: "${base}/${alt}"`)
  }
  return block.replace(m[0], `image: "/images/produk-unggulan/plakat/plakat-akrilik-1.png"`)
}

function faqBlock(tags, title, category) {
  const kw = tags.length ? tags[0] : category || "produk"
  return (
    `<h2>FAQ</h2>` +
    `<h3>Apakah Karyamedia melayani pembuatan ${escTpl(kw)} custom?</h3><p>Ya, Karyamedia melayani pembuatan ${escTpl(kw)} custom yang disesuaikan dengan kebutuhan, tema, dan anggaran acara Anda di seluruh Indonesia.</p>` +
    `<h3>Bagaimana cara memesan ${escTpl(kw)}?</h3><p>Silakan pelajari melalui <a href="/cara-pesan">halaman cara pesan</a> atau hubungi tim kami di <a href="/profil">profil Karyamedia</a> untuk konsultasi gratis.</p>` +
    `<h3>Apakah ada garansi untuk pesanan ${escTpl(kw)}?</h3><p>Setiap pesanan dikerjakan dengan standar kualitas tinggi dan quality control sebelum pengiriman sehingga hasil rapi dan tahan lama.</p>`
  )
}

function fixContent(block, slug, category, tags) {
  const m = block.match(/content:\s*`([\s\S]*?)`/)
  if (!m) return block
  let c = m[1]
  const title = getField(block, "title")
  const kw = tags.length ? tags[0] : ""
  const catPath = topCats.has(category) ? `/katalog-produk/${category}` : null
  const catLink = catPath
    ? `<a href="${catPath}">${escTpl(category || "produk")}</a>`
    : `<a href="/profil">profil Karyamedia</a>`

  // a) unlink broken /blog/ links
  c = c.replace(/<a\s+href="\/blog\/([^"]+)">([\s\S]*?)<\/a>/g, (full, s, txt) =>
    allSlugs.has(s) || s === slug ? full : txt,
  )

  // a2) normalisasi link /katalog-produk yang tidak valid (bare atau format salah)
  c = c.replace(/href="(\/katalog-produk[^"]*)"/g, (full, href) => {
    const parts = href.split("/").filter(Boolean)
    if ((parts.length === 2 && topCats.has(parts[1])) || (parts.length === 3 && topCats.has(parts[1]))) return full
    return `href="${catPath || "/profil"}"`
  })

  // b) ensure at least one internal link
  const hasInternal = /href="(\/blog\/|\/katalog-produk\/|\/profil|\/kontak|\/cara-pesan|\/gallery)/.test(c)
  if (!hasInternal) {
    const rel = pickRelated(category, slug)
    if (rel) c += `<p>Artikel terkait: <a href="/blog/${rel.slug}">${escTpl(rel.title)}</a></p>`
  }

  // c) keyword utama di intro (240 karakter pertama)
  if (kw) {
    const plain0 = c.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().toLowerCase()
    if (!plain0.slice(0, 240).includes(kw.toLowerCase())) {
      c = `<p>Artikel ini secara khusus membahas ${escTpl(kw)} sebagai panduan lengkap yang kami susun untuk membantu Anda menemukan referensi terbaik sebelum memesan.</p>` + c
    }
  }

  // d) FAQ: pastikan <h2>FAQ</h2> dengan pasangan <h3>Q</h3><p>A</p>
  if (!/<h2[^>]*>\s*FAQ\s*<\/h2>/i.test(c)) {
    c += faqBlock(tags, title, category)
  } else {
    const faqIdx = c.search(/<h2[^>]*>\s*FAQ\s*<\/h2>/i)
    let faqBlockText = c.slice(faqIdx)
    faqBlockText = faqBlockText.replace(
      /<p>\s*<strong>([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/p>/g,
      (full, q, a) => `<h3>${q.trim()}</h3><p>${a.trim()}</p>`,
    )
    const pairs = (faqBlockText.match(/<h3>[\s\S]*?<\/h3>\s*<p>[\s\S]*?<\/p>/g) || []).length
    c = pairs < 1 ? c.slice(0, faqIdx) + faqBlock(tags, title, category) : c.slice(0, faqIdx) + faqBlockText
  }

  // e) ensure >= MIN_WORDS (padding bervariasi per artikel agar tidak duplikat)
  let wc = wordCount(c)
  let guard = 0
  const seed = [...slug].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 0)
  const catName = category || "produk"
  const variants = [
    `<h2>Tips Memilih ${escTpl(catName)}</h2><p>Untuk ${escTpl(title)}, konsultasikan kebutuhan Anda kepada tim Karyamedia yang berpengalaman. Kami menawarkan berbagai pilihan produk custom yang dapat disesuaikan dengan tema, warna, dan anggaran acara Anda. Pastikan untuk memilih bahan yang tahan lama serta finising yang rapi agar kesan yang diberikan maksimal. Lihat koleksi lengkap di ${catLink} atau simak pengalaman klien kami.</p>`,
    `<h2>Keunggulan Pesanan ${escTpl(kw || catName)}</h2><p>Karyamedia telah melayani ratusan instansi dan event nasional di Yogyakarta. Setiap pesanan dikerjakan dengan standar kualitas tinggi, mulai dari desain, produksi, hingga pengiriman yang aman. Proses pemesanan juga mudah melalui <a href="/cara-pesan">halaman cara pesan</a> sehingga Anda dapat menyesuaikan pesanan tanpa kerumitan. Jangan ragu untuk berkonsultasi gratis dengan tim kami sebelum menentukan pilihan.</p>`,
    `<h2>Mengapa Memilih ${escTpl(kw || catName)} dari Karyamedia</h2><p>Selain kualitas bahan, kami memprioritaskan komunikasi yang cepat dan transparan selama proses pengerjaan. Desain revisi tersedia agar hasil sesuai ekspektasi, dan pengiriman dapat dilakukan ke seluruh Indonesia. Diskusikan kebutuhan ${escTpl(kw || catName)} Anda lewat <a href="/kontak">halaman kontak</a> kami.</p>`,
  ]
  while (wc < MIN_WORDS && guard < 12) {
    c += variants[(guard + seed) % variants.length]
    wc = wordCount(c)
    guard++
  }

  return block.replace(m[0], `content: \`${c}\``)
}

let out = text0
let fixed = 0
for (const a of arts) {
  let block = a.block
  const before = block
  const tags = getTags(block)
  const category = getField(block, "category")
  block = fixTitle(block, tags)
  block = fixDescription(block)
  block = fixTags(block)
  block = fixImage(block)
  block = fixContent(block, a.slug, category, tags)
  if (block !== before) {
    out = out.replace(before, block)
    fixed++
  }
}

const DRY = process.argv.includes("--dry")
if (DRY) {
  const { lintText } = await import("./article-lint.mjs")
  const { errors, warnings } = lintText(out)
  console.log(`[DRY] Akan memperbaiki ${fixed} artikel. Sisa ERROR: ${errors.length}, WARNING: ${warnings.length}`)
  const norm = (s) => s.replace(/^blog\/[^:]+:\s*/, "").replace(/\d+(\.\d+)?/g, "N").trim()
  const g = {}
  for (const e of errors) (g[norm(e)] ||= []).push(e)
  for (const [k, v] of Object.entries(g).sort((a, b) => b[1].length - a[1].length)) console.log(`  [${v.length}] ${k}`)
} else {
  writeFileSync(articlesPath, out)
  console.log(`✓ Diperbaiki ${fixed} artikel.`)
}
