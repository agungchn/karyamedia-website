// Generate a standards-compliant article from a keyword using the LLM writer.
// Pipeline: keyword -> infer category + slug -> duplicate check -> LLM prose
// -> ensure FAQ + internal link + valid image -> insert into articles.ts
// -> run the standard gate (article-check + article-lint) on the new slug.
//
//   node scripts/seo/article-generate.mjs "plakat akrilik" [--category Plakat]
//   LLM_MOCK=1 node scripts/seo/article-generate.mjs "plakat akrilik"   # no API call
//
// After this runs, review the article and `git commit` (the pre-commit hook
// will re-validate it).

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { extractArticles } from "./article-lint.mjs"
import { generateArticle } from "../llm/write.mjs"
import { commitAndPush } from "./git.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")

const CAT_MAP = {
  plakat: "Plakat", medali: "Medali", piala: "Piala & Trophy", "gift box": "Gift Box",
  prasasti: "Prasasti", "name tag": "Accessories", "gantungan kunci": "Accessories",
  "souvenir wisuda": "Souvenir Wisuda", souvenir: "Souvenir", "batas wilayah": "Batas Wilayah",
  tumbler: "Souvenir", samir: "Souvenir Wisuda", toga: "Souvenir Wisuda",
}
export function inferCategory(kw) {
  const k = kw.toLowerCase()
  for (const [k2, v] of Object.entries(CAT_MAP)) if (k.includes(k2)) return v
  return "Blog"
}

// ---- authority gate: ensure the draft contains concrete proof signals ----
function isAuthoritative(content) {
  const c = content || ""
  let score = 0
  if (/\b(19|20)\d{2}\b/.test(c)) score++ // contains a year
  if (/Yogyakarta|Jogja/i.test(c)) score++ // mentions base location
  if (/\b\d+\s?(tahun|instansi|klien|event|mm|cm|pcs|ribu|ratusan|%|x)\b/i.test(c)) score++ // number + unit
  if (/sejak|berdiri|pengalaman|ratusan|ribuan|1\.000|1000\+/i.test(c)) score++ // experience / scale proof
  if (/instansi|klien|pelanggan|event nasional|universitas|kementerian/i.test(c)) score++ // credible clients
  return score >= 2
}
function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ---- duplicate detection (lightweight; full check runs at commit) ----
const STOP = new Set(
  "custom,kustom,souvenir,plakat,medali,piala,trophy,gift,box,accessories,prasasti,batas,wilayah,wisuda,dan,untuk,ke,di,dari,pada,atau,dengan,yang,the,a,an,of,to,in,for,cara,membuat,panduan,lengkap,guide,model,jenis,terbaik,bagi,acara,adalah,this,that,vs".split(","),
)
const tokensOf = (s) => (s || "").toLowerCase().replace(/<[^>]*>/g, " ").split(/[^a-z0-9]+/i).filter((w) => w && !STOP.has(w) && w.length > 1)
const tk = (a) => [...new Set(a)].sort().join(" ")
const cont = (a, b) => {
  const A = new Set(a), B = new Set(b)
  if (!A.size) return 0
  let i = 0
  for (const x of A) if (B.has(x)) i++
  return i / Math.min(A.size, B.size)
}
const slugRe = /slug:\s*"([^"]*)"/
const titleRe = /title:\s*"([^"]*)"/
const catRe = /category:\s*"([^"]*)"/
function dupCheck(slug, title, workingText) {
  for (const a of extractArticles(workingText)) {
    const s = slugRe.exec(a.block)?.[1]
    if (s === slug) return `slug "${slug}" sudah ada`
    const t = titleRe.exec(a.block)?.[1] || ""
    const tt = tk(tokensOf(t)), nt = tk(tokensOf(title))
    if (tt && nt && tt === nt) return `title mirip dengan "${t}"`
    if (nt && cont(tokensOf(title), tokensOf(t)) >= 1) return `topik mirip dengan "${t}"`
  }
  return null
}

// ---- image picker (must exist on disk) ----
const FOLDER = {
  "Plakat": ["plakat", "plakat-akrilik", "plakat-kayu", "plakat-marmer", "plakat-fiberglass", "plakat-wayang"],
  "Medali": ["medali-custom", "medali-3d"],
  "Piala & Trophy": ["piala-trophy", "piala-golf"],
  "Accessories": ["name-tag", "gantungan-kunci", "pin-bross", "papan-nama"],
  "Gift Box": ["box-batik", "box-bludru", "box-kertas-import", "box-kertas-marga"],
  "Prasasti": ["prasasti-marmer", "prasasti-kuningan", "prasasti-stainless-steel"],
  "Souvenir Wisuda": ["souvenir-wisuda", "patung-wisuda", "samir-wisuda", "kalung-rektor", "tabung-wisuda", "tongkat-rektor", "toga-wisuda", "map-ijazah"],
  "Souvenir": ["souvenir-pernikahan"],
  "Batas Wilayah": ["plakat-batas-wilayah"],
}
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) { const r = walk(p); if (r) return r }
    else if (/\.(png|jpe?g|webp)$/i.test(e.name)) return p
  }
  return null
}
// ---- used images (avoid reusing images already used by other articles) ----
function usedImages(workingText) {
  const set = new Set()
  const re = /\/images\/produk-unggulan\/[^\s"')>]+/g
  let m
  while ((m = re.exec(workingText))) set.add(m[0])
  return set
}

// ---- category name -> slug (read from categories.ts, no TS import needed) ----
function loadCategorySlugs() {
  const text = readFileSync(join(root, "src/data/categories.ts"), "utf8")
  const map = {}
  const re = /name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g
  let m
  while ((m = re.exec(text))) map[m[1]] = m[2]
  return map
}

function pickImage(category, used) {
  const base = join(root, "public/images/produk-unggulan")
  const candidates = []
  for (const f of FOLDER[category] || []) {
    const dir = join(base, f)
    if (existsSync(dir)) {
      for (const x of readdirSync(dir).filter((n) => /\.(png|jpe?g|webp)$/i.test(n))) {
        candidates.push(`/images/produk-unggulan/${f}/${x}`)
      }
    }
  }
  if (!candidates.length) {
    const found = walk(base)
    if (found) candidates.push(found.replace(join(root, "public"), "").split("\\").join("/"))
  }
  const fresh = candidates.filter((p) => !used.has(p))
  return fresh[0] || candidates[0] || "/images/produk-unggulan/plakat/plakat-akrilik-1.png"
}

// ---- automatic internal links (programmatic, URL-safe) ----
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
function injectCategoryLink(content, category, catSlugs) {
  const slug = catSlugs[category]
  if (!slug) return content
  const re = new RegExp(`(${escapeRe(category)})`, "i")
  return content.replace(re, `<a href="/katalog-produk/${slug}">$1</a>`)
}
function injectTestimoniLink(content) {
  const re = /(instansi|klien|pelanggan|testimoni|customer)/i
  if (re.test(content)) {
    return content.replace(re, `<a href="/profil">$1</a>`)
  }
  return (
    content +
    '<p>Simak <a href="/profil">testimoni klien Karyamedia</a> dari ratusan instansi &amp; event di seluruh Indonesia.</p>'
  )
}

// ---- backward internal links: older same-category articles link to the new one ----
function injectBacklink(block, newSlug, newTitle) {
  const open = block.indexOf("content:")
  if (open === -1) return block
  const c0 = block.indexOf("`", open)
  if (c0 === -1) return block
  const c1 = block.lastIndexOf("`")
  if (c1 <= c0) return block
  const body = block.slice(c0 + 1, c1)
  if (body.includes(`/blog/${newSlug}`)) return block // already linked
  const words = body.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
  if (words > 1400) return block // keep older articles under the soft cap
  const link = `<p>Artikel terkait: <a href="/blog/${newSlug}">${escTpl(newTitle)}</a></p>`
  return block.slice(0, c1) + link + block.slice(c1)
}

function findRelatedLink(slug, category, workingText) {
  const arts = extractArticles(workingText)
  const pick = (pred) => {
    for (const a of arts) {
      const s = slugRe.exec(a.block)?.[1]
      if (s === slug || !pred(a)) continue
      const t = titleRe.exec(a.block)?.[1] || "artikel terkait"
      return `<p>Artikel terkait: <a href="/blog/${s}">${t}</a></p>`
    }
    return ""
  }
  return pick((a) => catRe.exec(a.block)?.[1] === category) || pick(() => true)
}

const escStr = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")
const escTpl = (s) => String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")

// ---------------------------------------------------------------- main
async function main() {
  const args = process.argv.slice(2)
  let keyword = "", category = null
  let commitPush = false
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--category") category = args[++i]
    else if (args[i] === "--commit-push") commitPush = true
    else if (!keyword) keyword = args[i]
  }
  if (!keyword) {
    console.error('Pakai: node scripts/seo/article-generate.mjs "<keyword>" [--category X] [--commit-push]')
    process.exit(1)
  }
  if (!category) category = inferCategory(keyword)

  let slug = slugify(keyword)
  if (!/custom/.test(keyword.toLowerCase())) slug += "-custom"

  const working = readFileSync(articlesPath, "utf8")
  const used = usedImages(working)
  const catSlugs = loadCategorySlugs()
  if (slugRe.exec(working) && extractArticles(working).some((a) => slugRe.exec(a.block)?.[1] === slug)) {
    console.error(`DUPLIKAT: slug "${slug}" sudah ada. Gunakan keyword lain.`)
    process.exit(1)
  }

  console.log(`Keyword: "${keyword}"  ->  slug: ${slug}  kategori: ${category}`)
  console.log("Menulis prose via LLM...")
  let data = await generateArticle({ keyword, category })
  for (let attempt = 1; attempt <= 2; attempt++) {
    const plain = (data.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    const words = plain ? plain.split(/\s+/).length : 0
    if (words >= 600) break
    console.log(`Konten ${words} kata (<600), perpanjang (percobaan ${attempt})...`)
    data = await generateArticle({
      keyword,
      category,
      extra: `\n\nPENTING: draf sebelumnya hanya ${words} kata. Buat ULANG artikel yang LEBIH PANJANG, minimal 800 kata, dengan lebih banyak sub-bagian <h2> dan paragraf.`,
    })
  }

  // authority gate: guarantee concrete proof signals are present
  for (let a = 1; a <= 2; a++) {
    if (isAuthoritative(data.content || "")) break
    console.log(`Konten kurang otoritatif (tidak ada bukti konkret), regenerate (percobaan ${a})...`)
    data = await generateArticle({
      keyword,
      category,
      extra:
        "\n\nPENTING: draf sebelumnya KURANG OTORITATIF dan tidak punya bukti konkret. Wajib sertakan fakta: Karyamedia BERDIRI SEJAK 2001, berbasis YOGYAKARTA/JOGJA, melayani RATUSAN INSTANSI & EVENT nasional, serta cantumkan ANGKA/TAHUN/STANDAR produksi. Hindari kalimat promosi generik tanpa bukti.",
    })
  }

  const dup = dupCheck(slug, data.title || keyword, working)
  if (dup) {
    console.error(`DUPLIKAT setelah generate: ${dup}. Batal menyisipkan.`)
    process.exit(1)
  }

  let content = (data.content || "").trim()
    .replace(/^```(?:html)?/i, "").replace(/```$/i, "").trim()
  if (!/<h2[^>]*>\s*FAQ\s*<\/h2>/i.test(content)) {
    content += '<h2>FAQ</h2><p><strong>Apakah Karyamedia melayani pembuatan custom?</strong> Ya, Karyamedia melayani pembuatan custom sesuai kebutuhan Anda.</p>'
  }
  content = injectCategoryLink(content, category, catSlugs)
  content = injectTestimoniLink(content)
  const rel = findRelatedLink(slug, category, working)
  if (rel) content += rel

  // backward links: older same-category articles reference the new article
  let modified = working
  for (const a of extractArticles(working)) {
    const s = slugRe.exec(a.block)?.[1]
    if (s === slug) continue
    if ((catRe.exec(a.block)?.[1] || "") !== category) continue
    modified = modified.replace(a.block, injectBacklink(a.block, slug, data.title || keyword))
  }

  let tags = Array.isArray(data.tags) ? data.tags.map(String).slice(0, 6) : []
  while (tags.length < 4) tags.push(slugify(keyword).split("-").filter((w) => w && w !== "custom")[tags.length] || `karyamedia${tags.length}`)

  const image = pickImage(category, used)
  const obj =
    `  {\n` +
    `    slug: "${escStr(slug)}",\n` +
    `    title: "${escStr(data.title || keyword)}",\n` +
    `    description: "${escStr(data.description || "")}",\n` +
    `    category: "${category}",\n` +
    `    date: "${new Date().toISOString().slice(0, 10)}",\n` +
    `    image: "${escStr(image)}",\n` +
    `    tags: [${tags.map((t) => `"${escStr(t)}"`).join(", ")}],\n` +
    `    content: \`${escTpl(content)}\`,\n` +
    `  },\n`

  const newText = modified.replace(/(},\s*)\](\s*)$/, `$1${obj}]`)
  if (newText === working) {
    console.error("Gagal menyisipkan artikel (pola array tidak ditemukan).")
    process.exit(1)
  }
  writeFileSync(articlesPath, newText)
  console.log(`✓ Artikel disisipkan: blog/${slug} (image: ${image})`)
  console.log(`GENERATED_SLUG:${slug}`)

  console.log("\n--- regenerate og-meta.json ---")
  execSync(`node scripts/seo/gen-og-meta.mjs`, { cwd: root, stdio: "inherit" })

  console.log("\n--- gate: cek duplikat ---")
  execSync(`node scripts/seo/article-check.mjs`, { env: { ...process.env, ARTICLE_LINT_SLUGS: slug }, cwd: root, stdio: "inherit" })
  console.log("\n--- gate: cek standart ---")
  execSync(`node scripts/seo/article-lint.mjs`, { env: { ...process.env, ARTICLE_LINT_SLUGS: slug }, cwd: root, stdio: "inherit" })

  if (commitPush) {
    let gateOk = true
    try {
      execSync(`node scripts/seo/article-lint.mjs`, { env: { ...process.env, ARTICLE_LINT_SLUGS: slug }, cwd: root, stdio: "pipe" })
    } catch {
      gateOk = false
    }
    if (gateOk) commitAndPush(`feat(seo): auto-generate article blog/${slug}`)
    else console.error("\nGagal: artikel tidak lolos standar. Tidak di-commit/push.")
  } else {
    console.log(`\nReview artikel di src/data/articles.ts (blog/${slug}), lalu git commit (atau pakai --commit-push).`)
  }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isMain) {
  main().catch((e) => {
    console.error("ERROR:", e.message)
    process.exit(1)
  })
}
