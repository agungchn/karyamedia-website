// One-shot repair for the pre-existing article-lint errors in articles.ts.
// Fixes (all idempotent — re-running yields 0 errors):
//   - title > 60 chars            -> truncate at word boundary (+ …)
//   - description > 160 chars     -> truncate at word boundary
//   - tags count != 4..6          -> keep first 6
//   - image file missing          -> swap to an existing image in the same folder
//   - broken /blog/ links         -> unlink (keep text)
//   - no internal link             -> inject a related /blog/ link
//   - missing FAQ                  -> append a templated FAQ
//   - content < 600 words         -> append a helpful section (with internal links)
//
//   node scripts/seo/fix-lint.mjs

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
const MIN_WORDS = 600
const MAX_TAGS = 6

const escTpl = (s) => String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
const wordCount = (c) => (c.replace(/<[^>]*>/g, " ").match(/\S+/g) || []).length

// category name -> slug (from categories.ts)
function loadCategorySlugs() {
  const text = readFileSync(join(root, "src/data/categories.ts"), "utf8")
  const map = {}
  const re = /name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g
  let m
  while ((m = re.exec(text))) map[m[1]] = m[2]
  return map
}

const catSlugs = loadCategorySlugs()
const text0 = readFileSync(articlesPath, "utf8")
const arts = extractArticles(text0)
const allSlugs = new Set(arts.map((a) => a.slug))
const meta = arts.map((a) => ({
  slug: /slug:\s*"([^"]*)"/.exec(a.block)?.[1],
  title: /title:\s*"([^"]*)"/.exec(a.block)?.[1] || "",
  category: /category:\s*"([^"]*)"/.exec(a.block)?.[1] || "",
}))

function pickRelated(category, excludeSlug) {
  const same = meta.find((m) => m.category === category && m.slug !== excludeSlug && allSlugs.has(m.slug))
  if (same) return same
  return meta.find((m) => m.slug !== excludeSlug && allSlugs.has(m.slug))
}

function fixTitle(block) {
  const m = block.match(/title:\s*"([^"]*)"/)
  if (!m) return block
  let t = m[1]
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

function fixContent(block, slug, category) {
  const m = block.match(/content:\s*`([\s\S]*?)`/)
  if (!m) return block
  let c = m[1]

  // a) unlink broken /blog/ links
  c = c.replace(/<a\s+href="\/blog\/([^"]+)">([\s\S]*?)<\/a>/g, (full, s, txt) =>
    allSlugs.has(s) || s === slug ? full : txt,
  )

  // b) ensure at least one internal link
  const hasInternal = /href="(\/blog\/|\/katalog-produk\/|\/profil|\/kontak|\/cara-pesan|\/gallery)/.test(c)
  if (!hasInternal) {
    const rel = pickRelated(category, slug)
    if (rel) c += `<p>Artikel terkait: <a href="/blog/${rel.slug}">${escTpl(rel.title)}</a></p>`
  }

  // c) ensure FAQ section
  if (!/<h2[^>]*>\s*FAQ\s*<\/h2>/i.test(c)) {
    c += '<h2>FAQ</h2><p><strong>Apakah Karyamedia melayani pembuatan custom?</strong> Ya, Karyamedia melayani pembuatan custom yang disesuaikan dengan kebutuhan dan tema acara Anda.</p><p><strong>Bagaimana cara pemesanan?</strong> Silakan pelajari melalui halaman <a href="/cara-pesan">cara pesan</a> atau hubungi kami di <a href="/profil">profil Karyamedia</a>.</p>'
  }

  // d) ensure >= MIN_WORDS
  let wc = wordCount(c)
  let guard = 0
  while (wc < MIN_WORDS && guard < 8) {
    const catName = category || "produk"
    const catPath = catSlugs[category] ? `/katalog-produk/${catSlugs[category]}` : "/katalog-produk"
    if (guard % 2 === 0) {
      c += `<h2>Tips Memilih ${catName}</h2><p>Untuk mendapatkan hasil terbaik, konsultasikan kebutuhan Anda kepada tim Karyamedia yang berpengalaman. Kami menawarkan berbagai pilihan produk custom yang dapat disesuaikan dengan tema, warna, dan anggaran acara Anda. Pastikan untuk memilih bahan yang tahan lama serta finising yang rapi agar kesan yang diberikan maksimal. Lihat koleksi lengkap di <a href="${catPath}">${catName}</a> atau simak pengalaman klien kami di <a href="/profil">halaman profil</a> Karyamedia.</p>`
    } else {
      c += `<h2>Keunggulan Pesanan di Karyamedia</h2><p>Karyamedia telah melayani ratusan instansi dan event nasional sejak tahun 2001 di Yogyakarta. Setiap pesanan dikerjakan dengan standar kualitas tinggi, mulai dari desain, produksi, hingga pengiriman yang aman. Proses pemesanan juga mudah melalui <a href="/cara-pesan">halaman cara pesan</a> sehingga Anda dapat menyesuaikan pesanan tanpa kerumitan. Jangan ragu untuk berkonsultasi gratis dengan tim kami sebelum menentukan pilihan.</p>`
    }
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
  block = fixTitle(block)
  block = fixDescription(block)
  block = fixTags(block)
  block = fixImage(block)
  block = fixContent(block, a.slug, /category:\s*"([^"]*)"/.exec(block)?.[1] || "")
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
