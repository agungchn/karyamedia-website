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
import { generateArticle, buildBeatPrompt, ARTICLE_TEMPLATE_VARIANT_COUNT } from "../llm/write.mjs"
import { commitAndPush } from "./git.mjs"
import { SEGMENTS } from "./geo.mjs"

// map segment key (pemerintahan/kampus/eo/komunitas) -> label manusiawi
function segmentLabel(key) {
  if (!key) return null
  return SEGMENTS.find((s) => s.key === key)?.label || key
}

function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")

const CAT_MAP = {
  plakat: "Plakat", medali: "Medali", piala: "Piala & Trophy", "gift box": "Gift Box",
  prasasti: "Prasasti",   "name tag": "Accessories", "nama dada": "Accessories", "gantungan kunci": "Accessories",
  "souvenir wisuda": "Souvenir Wisuda", souvenir: "Souvenir", "batas wilayah": "Batas Wilayah",
  tumbler: "Souvenir", samir: "Souvenir Wisuda", toga: "Souvenir Wisuda",
}
export function inferCategory(kw) {
  const k = kw.toLowerCase()
  for (const [k2, v] of Object.entries(CAT_MAP)) if (k.includes(k2)) return v
  return "Blog"
}

// ---- English→Indonesian auto-fix for common LLM slip-ups ----
const FIX_KATA = [
  [/\bkepaluan\b/gi, "kepulauan"],
  [/\bdikarenakan\b/gi, "karena"],
  [/\bmerupakan\b/gi, "adalah"],
  [/\bdiantaranya\b/gi, "antara lain"],
  [/\bterdapat\b/gi, "ada"],
  [/\btidak hanya\b/gi, "bukan hanya"],
  [/\bdimana\b/gi, "yang"],
]
const EN_TO_ID = [
  [/\bremains\b/gi, "tetap"],
  [/\bremaining\b/gi, "tersisa"],
  [/\bprovide\b/gi, "menyediakan"],
  [/\bprovided\b/gi, "menyediakan"],
  [/\bprovides\b/gi, "menyediakan"],
  [/\bhowever\b/gi, "namun"],
  [/\btherefore\b/gi, "oleh karena itu"],
  [/\bensure\b/gi, "memastikan"],
  [/\bregarding\b/gi, "mengenai"],
  [/\bwithout\b/gi, "tanpa"],
  [/\bwithin\b/gi, "dalam"],
  [/\baccording\b/gi, "menurut"],
  [/\bespecially\b/gi, "terutama"],
  [/\bthrough\b/gi, "melalui"],
  [/\bbecause\b/gi, "karena"],
  [/\bexample\b/gi, "contoh"],
  [/\busage\b/gi, "penggunaan"],
]
function fixEnglishWords(text) {
  let fixed = text
  for (const [re, id] of EN_TO_ID) {
    fixed = fixed.replace(re, id)
  }
  for (const [re, id] of FIX_KATA) {
    fixed = fixed.replace(re, id)
  }
  return fixed
}

// ---- description: enforce SEO length (120-160) & fix truncation ----
function enforceDescription(desc, location = null) {
  if (!desc) return desc
  let d = desc.trim()

  // Potong di batas kalimat terakhir (dalam 90-159 chars) agar rapi
  const boundaries = []
  for (let i = 0; i < d.length; i++) if (".!?".includes(d[i])) boundaries.push(i)
  const nearEnd = boundaries.filter((b) => b >= 90 && b < 160)
  if (nearEnd.length) {
    d = d.slice(0, nearEnd[nearEnd.length - 1] + 1).trim()
  } else if (d.length > 160) {
    d = d.slice(0, d.lastIndexOf(" ", 157)).trim() || d.slice(0, 157).trim()
  }

  // Bersihkan trailing koma, dash, konjungsi
  d = d.replace(/[,;:\-–—]+(?:\s*(dan|untuk|di|ke|dari|pada|atau|dengan|yang|bagi|serta)?)?\s*$/, "").trim()
  if (d && !/[.!?]$/.test(d)) d += "."

  if (d.length > 160) {
    d = d.slice(0, d.lastIndexOf(" ", 157)).trim() || d.slice(0, 157).trim()
    d = d.replace(/[,;:\-–—]+(?:\s*(dan|untuk|di|ke|dari|pada|atau|dengan|yang|bagi|serta)?)?\s*$/, "").trim()
    if (d && !/[.!?]$/.test(d)) d += "."
  }
  if (d.length < 120) {
    const loc = location || "seluruh Indonesia"
    const pad = ` Produsen langsung Yogyakarta, melayani ${loc}.`
    const pad2 = ` Hubungi tim Karyamedia untuk konsultasi ${loc}.`
    d = trimToWords(d + pad, 160)
    if (d.length < 120) d = trimToWords(d + pad2, 160)
    if (d && !/[.!?]$/.test(d)) d += "."
  }
  return d
}

// ---- authority gate: ensure the draft contains concrete proof signals ----
function isAuthoritative(content) {
  const c = content || ""
  let score = 0
  if (/\b(19|20)\d{2}\b/.test(c)) score += 1
  if (/Yogyakarta|Jogja/i.test(c)) score += 2
  if (/\b\d+\s?(tahun|instansi|klien|event|mm|cm|pcs|ribu|ratusan|%|x)\b/i.test(c)) score += 2
  if (/sejak|berdiri|pengalaman|ratusan|ribuan|1\.000|1000\+/i.test(c)) score += 2
  if (/instansi|klien|pelanggan|event nasional|universitas|kementerian/i.test(c)) score += 1
  return score >= 3
}
async function fetchOutline(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 15000)
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0" } })
    if (!res.ok) return null
    const html = await res.text()
    const clean = (s) => (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || ""
    const outline = []
    for (const m of html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)) {
      const txt = clean(m[1])
      if (txt) outline.push(txt)
    }
    const text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/(script|style)>/gi, " ")
    const words = (text.replace(/<[^>]*>/g, " ").match(/\S+/g) || []).length
    const bullets = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((m) => clean(m[1])).filter(Boolean).slice(0, 15)
    return { title, outline: outline.slice(0, 25), words, bullets }
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ---- deterministic length enforcement (LLM sometimes violates limits) ----
function trimToWords(s, max) {
  s = (s || "").trim()
  if (s.length <= max) return s
  let cut = s.slice(0, max).lastIndexOf(" ")
  if (cut < Math.floor(max * 0.5)) cut = max
  return s.slice(0, cut).trim()
}
function enforceTitle(title, headKw) {
  let t = trimToWords(title, 60)
  // Bersihkan trailing konjungsi/preposisi yang terpotong
  t = t.replace(/[,;:\-–—]?\s*(dan|untuk|di|ke|dari|pada|atau|dengan|yang|bagi|serta|&)\s*$/i, "").trim()
  if (headKw && t && !t.toLowerCase().includes(headKw)) {
    const pre = headKw.length <= 54 ? headKw : headKw.slice(0, 54)
    t = (t ? `${pre} - ${t}` : pre).slice(0, 60)
  }
  t = t.replace(/[,;:\-–—]?\s*(dan|untuk|di|ke|dari|pada|atau|dengan|yang|bagi|serta|&)\s*$/i, "")
  return t.trim() || (headKw ? headKw.slice(0, 60) : title || "")
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
const contentRe = /content:\s*`([\s\S]*?)`,\s*\n\s*\},/
function contentFromBlock(block) {
  const m = contentRe.exec(block)
  return m ? m[1] : ""
}
function headingsFromContent(text) {
  return [...text.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map((h) => h[1].replace(/<[^>]*>/g, "").trim().toLowerCase())
    .filter(Boolean)
}
function dupCheck(slug, title, workingText, newContent = "") {
  const nc = newContent || ""
  const nHeadings = new Set(headingsFromContent(nc))
  const nTokens = tokensOf(nc)
  const nTokSet = new Set(nTokens)
  for (const a of extractArticles(workingText)) {
    const s = slugRe.exec(a.block)?.[1]
    if (s === slug) return `slug "${slug}" sudah ada`
    const t = titleRe.exec(a.block)?.[1] || ""
    const tt = tk(tokensOf(t)), nt = tk(tokensOf(title))
    if (tt && nt && tt === nt) return `title mirip dengan "${t}"`
    if (nt && cont(tokensOf(title), tokensOf(t)) >= 1) return `topik mirip dengan "${t}"`
    if (nTokSet.size && nc) {
      const eContent = contentFromBlock(a.block)
      if (eContent) {
        const eHeadings = new Set(headingsFromContent(eContent))
        if (eHeadings.size && nHeadings.size) {
          let shared = 0
          for (const h of nHeadings) if (eHeadings.has(h)) shared++
          const headingSim = shared / Math.min(nHeadings.size, eHeadings.size)
          if (headingSim >= 0.8) {
            const eTokens = tokensOf(eContent)
            const c = cont(nTokens, eTokens)
            if (c >= 0.5) return `konten mirip dengan "${t}" (blog/${s}, heading ${(headingSim * 100).toFixed(0)}%, konten ${(c * 100).toFixed(0)}%)`
          }
        }
      }
    }
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

function listSubfolders(base) {
  try {
    return readdirSync(base, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  } catch {
    return []
  }
}

// Pick an image whose FOLDER matches the article topic (not just the first on
// disk). For unknown categories (e.g. "Blog") we infer the product category
// from the keyword, then prefer any subfolder whose name shares a keyword token
// (e.g. "akrilik" -> plakat-akrilik). Falls back to any image only as last resort.
function pickImage(category, used, keyword = "") {
  const base = join(root, "public/images/produk-unggulan")
  const kw = (keyword || "").toLowerCase()
  const kwTokens = new Set(kw.split(/[^a-z0-9]+/).filter((w) => w.length > 2))

  let folders = FOLDER[category] || []
  if (!folders.length) {
    const inf = inferCategory(keyword)
    if (inf !== "Blog") folders = FOLDER[inf] || []
  }

  const allSubs = listSubfolders(base)
  const STOP_IMG = new Set("custom,souvenir,murah,berkualitas,untuk,ke,di,dan,atau,dengan,yang,pada".split(","))
  const boosted = allSubs.filter((f) => {
    const ft = new Set(f.toLowerCase().split(/[-_]+/))
    return [...kwTokens].some((t) => ft.has(t) && !STOP_IMG.has(t))
  })
  const chosen = [...new Set([...boosted, ...folders])]

  const candidates = []
  const pushFrom = (f) => {
    const dir = join(base, f)
    if (existsSync(dir)) {
      for (const x of readdirSync(dir).filter((n) => /\.(png|jpe?g|webp)$/i.test(n))) {
        candidates.push(`/images/produk-unggulan/${f}/${x}`)
      }
    }
  }
  if (chosen.length) chosen.forEach(pushFrom)
  if (!candidates.length) allSubs.forEach(pushFrom)
  if (!candidates.length) {
    const found = walk(base)
    if (found) candidates.push(found.replace(join(root, "public"), "").split("\\").join("/"))
  }

  const fresh = candidates.filter((p) => !used.has(p))
  const pool = fresh.length ? fresh : candidates
  // deterministic: first unused image from the most-relevant folder
  return pool[0] || "/images/produk-unggulan/plakat/plakat-akrilik-1.png"
}

// ---- automatic internal links (programmatic, URL-safe) ----
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
const CAT_LINK_WORD = {
  "Plakat": "plakat",
  "Medali": "medali",
  "Piala & Trophy": "piala",
  "Souvenir Wisuda": "souvenir wisuda",
  "Gift Box": "gift box",
  "Accessories": "nama dada",
  "Souvenir": "souvenir",
  "Prasasti": "prasasti",
  "Batas Wilayah": "batas wilayah",
}
// Resolve the product category whose katalog page should be the MAIN link.
// For "Blog"/unknown categories we infer from the keyword so the main link
// still points to the correct product category (e.g. piala -> /katalog-produk/piala-trophy).
function resolveProductCategory(category, keyword, catSlugs) {
  if (catSlugs[category]) return category
  const inf = inferCategory(keyword || "")
  if (catSlugs[inf]) return inf
  return null
}
// ---- pillar detection (sama dengan link-pillar.mjs) ----
const PILLAR_FOR = {
  Plakat: "panduan-lengkap-plakat-custom",
  "Souvenir Wisuda": "panduan-lengkap-souvenir-wisuda-custom",
  "Piala & Trophy": "panduan-lengkap-piala-dan-trophy-custom",
  Accessories: "panduan-lengkap-tumbler-custom",
  Medali: "panduan-lengkap-medali-custom",
  Prasasti: "panduan-lengkap-prasasti-custom",
  "Gift Box": "panduan-lengkap-gift-box-custom",
  Souvenir: "panduan-lengkap-souvenir-custom",
  Blog: "panduan-lengkap-souvenir-custom",
}
const PILLAR_TOPICS = [
  { pillar: "panduan-lengkap-name-tag-custom", re: /name-tag|nametag|id-card|id card|nama-dada|papan-nama-dada|nama-dada-akrilik|nama-dada-pns|nama-dada-guru|nama-dada-pgri|nama-dada-pegawai/ },
  { pillar: "panduan-lengkap-papan-nama-custom", re: /^papan-nama(?!-dada)/ },
  { pillar: "panduan-lengkap-gantungan-kunci-custom", re: /gantungan-kunci|keychain/ },
  { pillar: "panduan-lengkap-pin-bross-custom", re: /pin-bross|pin bross|bross/ },
  { pillar: "panduan-lengkap-souvenir-pernikahan-custom", re: /souvenir-pernikahan|pernikahan|nikah/ },
  { pillar: "panduan-lengkap-batas-wilayah-custom", re: /batas-wilayah|center-point|brass-table|tugu/ },
  { pillar: "panduan-lengkap-plakat-akrilik-custom", re: /plakat-akrilik/ },
  { pillar: "panduan-lengkap-plakat-marmer-custom", re: /plakat-marmer/ },
  { pillar: "panduan-lengkap-plakat-wayang-custom", re: /plakat-wayang/ },
  { pillar: "panduan-lengkap-box-bludru-custom", re: /box-bludru/ },
  { pillar: "panduan-lengkap-box-kertas-import-custom", re: /box-kertas-import/ },
  { pillar: "panduan-lengkap-box-batik-custom", re: /box-batik/ },
  { pillar: "panduan-lengkap-kalung-rektor-custom", re: /kalung-rektor/ },
  { pillar: "panduan-lengkap-samir-gordon-wisuda-custom", re: /samir-wisuda|samir-gordon|kalung-wisuda|mendali-wisuda|gordon-wisuda/ },
  { pillar: "panduan-lengkap-patung-wisuda-custom", re: /patung-wisuda/ },
  { pillar: "panduan-lengkap-map-ijazah-custom", re: /map-ijazah|map-wisuda/ },
  { pillar: "panduan-lengkap-medali-3d-custom", re: /medali-3d/ },
  { pillar: "panduan-lengkap-plakat-kayu-custom", re: /plakat-kayu/ },
  { pillar: "panduan-lengkap-plakat-fiberglass-custom", re: /plakat-fiberglass/ },
  { pillar: "panduan-lengkap-tongkat-rektor-custom", re: /tongkat-rektor/ },
  { pillar: "panduan-lengkap-tabung-wisuda-custom", re: /tabung-wisuda/ },
  { pillar: "panduan-lengkap-prasasti-kuningan-custom", re: /prasasti-kuningan/ },
  { pillar: "panduan-lengkap-prasasti-stainless-steel-custom", re: /prasasti-stainless-steel/ },
]
function resolvePillar(slug, category, allSlugs) {
  const topic = PILLAR_TOPICS.find((t) => t.re.test(slug))
  const pillarSlug = topic && allSlugs.has(topic.pillar) ? topic.pillar : PILLAR_FOR[category]
  return pillarSlug && allSlugs.has(pillarSlug) ? pillarSlug : null
}

function injectCategoryLink(content, category, catSlugs) {
  const slug = catSlugs[category]
  if (!slug) return content
  // Link first 3 occurrences of the category keyword naturally in content
  const words = [
    CAT_LINK_WORD[category] || category,
    (CAT_LINK_WORD[category] || category).toLowerCase(),
  ]
  let count = 0
  return content.replace(new RegExp(`\\b(${words.map((w) => escapeRe(w)).join("|")})\\b`, "gi"), (m) => {
    if (++count > 3) return m
    return `<a href="/katalog-produk/${slug}">${m}</a>`
  })
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
  const existing = (body.match(/Artikel terkait: <a href="\/blog\//g) || []).length
  if (existing >= 4) return block // cap related links per article (avoid link stuffing)
  const link = `<p>Artikel terkait: <a href="/blog/${newSlug}">${escTpl(newTitle)}</a></p>`
  return block.slice(0, c1) + link + block.slice(c1)
}

function findRelatedLinks(slug, category, workingText, max = 3) {
  const arts = extractArticles(workingText)
  const make = (a) => {
    const s = slugRe.exec(a.block)?.[1]
    const t = titleRe.exec(a.block)?.[1] || "artikel terkait"
    return `<p>Artikel terkait: <a href="/blog/${s}">${t}</a></p>`
  }
  const same = arts.filter(
    (a) => (catRe.exec(a.block)?.[1] || "") === category && slugRe.exec(a.block)?.[1] !== slug
  )
  const other = arts.filter(
    (a) => (catRe.exec(a.block)?.[1] || "") !== category && slugRe.exec(a.block)?.[1] !== slug
  )
  return [...same, ...other].slice(0, max).map(make).join("")
}

const escStr = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")
const escTpl = (s) => String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")

// ---------------------------------------------------------------- main
async function main() {
  const args = process.argv.slice(2)
  let keyword = "", category = null
  let commitPush = false, beat = false, competitorUrl = null
  let province = null, segment = null
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--category") category = args[++i]
    else if (args[i] === "--commit-push") commitPush = true
    else if (args[i] === "--beat") beat = true
    else if (args[i] === "--competitor-url") competitorUrl = args[++i]
    else if (args[i] === "--province") province = args[++i]
    else if (args[i] === "--segment") segment = args[++i]
    else if (!keyword) keyword = args[i]
  }
  if (!keyword) {
    console.error('Pakai: node scripts/seo/article-generate.mjs "<keyword>" [--category X] [--province "Nama Provinsi"] [--segment pemerintahan|kampus|eo|komunitas] [--beat] [--competitor-url URL] [--commit-push]')
    process.exit(1)
  }
  // lokasi target (provinsi) & segmen — diinject dari ideas.mjs via env saat
  // dijalankan oleh scheduler; untuk manual run bisa pakai flag di atas.
  const location = province || process.env.ARTICLE_PROVINCE || null
  const seg = segment || process.env.ARTICLE_SEGMENT || null
  const segLabel = segmentLabel(seg)
  const segCtx = seg ? SEGMENTS.find((s) => s.key === seg)?.ctx || "" : ""
  if (!category) category = beat ? "Blog" : inferCategory(keyword)

  let slug = slugify(keyword)
  if (!beat && !/custom/.test(keyword.toLowerCase())) slug += "-custom"

  const working = readFileSync(articlesPath, "utf8")
  const used = usedImages(working)
  const catSlugs = loadCategorySlugs()
  if (slugRe.exec(working) && extractArticles(working).some((a) => slugRe.exec(a.block)?.[1] === slug)) {
    console.error(`DUPLIKAT: slug "${slug}" sudah ada. Gunakan keyword lain.`)
    process.exit(1)
  }

  console.log(`Keyword: "${keyword}"  ->  slug: ${slug}  kategori: ${category}${beat ? "  [BEAT MODE]" : ""}`)

  // Pilih varian kerangka artikel secara deterministik dari slug agar tiap
  // artikel punya struktur & sudut pandang berbeda (menekan kemiripan konten).
  const variantIdx = hashStr(slug) % ARTICLE_TEMPLATE_VARIANT_COUNT

  // ---- competitor outline (skyscraper) ----
  let competitor = null
  if (beat && competitorUrl) {
    console.log("Mengambil kerangka artikel pesaing: " + competitorUrl)
    const o = await fetchOutline(competitorUrl)
    if (o && o.outline.length) {
      competitor = { ...o, url: competitorUrl }
      console.log(`  pesaing: "${o.title}" (~${o.words} kata, ${o.outline.length} heading)`)
    } else {
      console.log("  gagal ambil kerangka pesaing, lanjut mode komprehensif.")
    }
  }

  const minWords = beat ? 1500 : 800
  const targetWords = beat ? 1800 : 1100
  const genOpts = (extra) =>
    beat
      ? { keyword, category, prompt: buildBeatPrompt({ keyword, category, competitor, location, segment: segLabel, segmentCtx: segCtx, variant: variantIdx, extra }) }
      : { keyword, category, location, segment: segLabel, segmentCtx: segCtx, variant: variantIdx, extra }

  console.log("Menulis prose via LLM...")
  let data = await generateArticle(genOpts())
  for (let attempt = 1; attempt <= 3; attempt++) {
    const plain = (data.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    const words = plain ? plain.split(/\s+/).length : 0
    if (words >= minWords) break
    console.log(`Konten ${words} kata (<${minWords}), perpanjang (percobaan ${attempt})...`)
    data = await generateArticle(genOpts(`\n\nPENTING: draf sebelumnya hanya ${words} kata. Buat ULANG artikel yang LEBIH PANJANG, MINIMAL ${targetWords} kata, dengan lebih banyak sub-bagian <h2> dan paragraf serta contoh konkret.`))
  }
  // Safety net: if still short, append extra LLM-written sections.
  {
    let plain = (data.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    let words = plain ? plain.split(/\s+/).length : 0
    for (let e = 1; e <= 2 && words < minWords; e++) {
      console.log(`Konten ${words} kata, tambah section via LLM (percobaan ${e})...`)
      const ext = await generateArticle(genOpts(`\n\nTulis 3 bagian <h2> TAMBAHAN (masing-masing minimal 150 kata, topik terkait "${keyword}") untuk melengkapi artikel. JANGAN sertakan bagian FAQ. Hanya keluarkan HTML <h2>Judul</h2><p>Isi</p> saja, tanpa JSON dan tanpa markdown.`))
      const extraHtml = (ext && ext.content) || ""
      if (extraHtml) data.content = (data.content || "") + "\n" + extraHtml
      plain = (data.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      words = plain ? plain.split(/\s+/).length : 0
    }
  }

  // authority gate: guarantee concrete proof signals are present
  for (let a = 1; a <= 2; a++) {
    if (isAuthoritative(data.content || "")) break
    console.log(`Konten kurang otoritatif (tidak ada bukti konkret), regenerate (percobaan ${a})...`)
    data = await generateArticle(genOpts("\n\nPENTING: draf sebelumnya KURANG OTORITATIF dan tidak punya bukti konkret. Wajib sertakan fakta: Karyamedia berbasis YOGYAKARTA/JOGJA, produsen langsung, melayani RATUSAN INSTANSI & EVENT nasional, serta cantumkan ANGKA/TAHUN/STANDAR produksi. Hindari kalimat promosi generik tanpa bukti."))
  }

  // Auto-fix English words that slipped into Indonesian content
  data.content = fixEnglishWords(data.content || "")
  data.title = fixEnglishWords(data.title || keyword)
  data.description = fixEnglishWords(data.description || "")

  // Auto-fix ejaan Indonesia (Sumatra↔Sumatera, Karawang↔Kerawang, dll)
  // agar kata kunci utama (tags[0]) muncul di title & intro content.
  const rawTags = Array.isArray(data.tags) ? data.tags.map(String).slice(0, 6) : []
  if (rawTags.length) {
    const kw = rawTags[0].toLowerCase()
    const plainContent = (data.content || "").replace(/<[^>]*>/g, '').toLowerCase()
    const needsFix = (
      !plainContent.includes(kw) ||
      !(data.title || "").toLowerCase().includes(kw.split(" ")[0])
    )
    if (needsFix) {
      const VARIANTS = [
        [/\bsumatra\b/gi, "sumatera"], [/\bsumatera\b/gi, "sumatra"],
        [/\bkarawang\b/gi, "kerawang"], [/\bkerawang\b/gi, "karawang"],
      ]
      for (const [re, replacement] of VARIANTS) {
        if (kw.match(re)) {
          data.content = (data.content || "").replace(new RegExp(re.source, 'gi'), replacement)
          data.title = (data.title || "").replace(new RegExp(re.source, 'gi'), replacement)
          data.description = (data.description || "").replace(new RegExp(re.source, 'gi'), replacement)
          console.error(`[FIX] Ejaan "${re.source}" diselaraskan dengan tags[0] di content + title + description.`)
          break
        }
      }
    }
  }

  // Guarantee title/description length rules (LLM sometimes overshoots).
  const headKw = (keyword || "").toLowerCase().split(" ")[0]
  data.title = enforceTitle(data.title || keyword, headKw)
  data.description = enforceDescription(data.description || "", location)

  const dup = dupCheck(slug, data.title || keyword, working, data.content || "")
  if (dup) {
    console.error(`DUPLIKAT setelah generate: ${dup}. Batal menyisipkan.`)
    process.exit(1)
  }

  let content = (data.content || "").trim()
    .replace(/^```(?:html)?/i, "").replace(/```$/i, "").trim()
  // Safety net: hapus stray closing tags (</h2>, </h3>, </p>) yang muncul
  // sebelum tag buka sejenis — indikasi HTML kotor dari LLM.
  content = content.replace(/<\/(h2|h3|p)>\s*(?=<\1\b)/gi, '')
  if (!/<h2[^>]*>\s*FAQ\s*<\/h2>/i.test(content)) {
    const faqKw = keyword
    const faqLoc = location || "seluruh Indonesia"
    content += `<h2>FAQ</h2><h3>Apakah Karyamedia melayani pembuatan ${faqKw} custom?</h3><p>Ya, Karyamedia melayani pembuatan ${faqKw} custom yang disesuaikan dengan kebutuhan, tema, dan anggaran acara Anda di ${faqLoc}.</p><h3>Bagaimana cara memesan ${faqKw}?</h3><p>Silakan pelajari melalui <a href="/cara-pesan">halaman cara pesan</a> atau hubungi tim kami di <a href="/profil">profil Karyamedia</a>.</p>`
  }
  const prodCat = resolveProductCategory(category, keyword, catSlugs)
  content = injectCategoryLink(content, prodCat || category, catSlugs)
  content = injectTestimoniLink(content)
  const rel = findRelatedLinks(slug, category, working, 3)
  content += rel

  // regional article -> auto canonical + pillar link
  let canonical = null
  if (location) {
    const allSlugs = new Set(extractArticles(working).map((a) => slugRe.exec(a.block)?.[1]).filter(Boolean))
    const pillarSlug = resolvePillar(slug, category, allSlugs)
    if (pillarSlug) {
      canonical = `/blog/${pillarSlug}`
      if (!content.includes(`/blog/${pillarSlug}`)) {
        const pBlock = extractArticles(working).find((a) => slugRe.exec(a.block)?.[1] === pillarSlug)?.block
        const pTitle = pBlock ? (titleRe.exec(pBlock)?.[1] || pillarSlug) : pillarSlug
        const anchor = `<p>Baca juga panduan lengkap kami: <a href="/blog/${pillarSlug}">${escTpl(pTitle)}</a> sebagai referensi menyeluruh seputar ${escTpl(category)}.</p>`
        const faqIdx = content.search(/<h2[^>]*>\s*FAQ\s*<\/h2>/i)
        content = faqIdx >= 0 ? content.slice(0, faqIdx) + anchor + content.slice(faqIdx) : content + anchor
      }
    }
  }

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

  const image = pickImage(category, used, keyword)
  const obj =
    `  {\n` +
    `    slug: "${escStr(slug)}",\n` +
    `    title: "${escStr(data.title || keyword)}",\n` +
    `    description: "${escStr(data.description || "")}",\n` +
    `    category: "${category}",\n` +
    `    date: "${new Date().toISOString().slice(0, 10)}",\n` +
    `    image: "${escStr(image)}",\n` +
    `    tags: [${tags.map((t) => `"${escStr(t)}"`).join(", ")}],\n` +
    (canonical ? `    canonical: "${canonical}",\n` : ``) +
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

  console.log("\n--- generate WebP (biar gambar artikel tidak 404, lewat custom loader) ---")
  execSync(`node scripts/optimize-images.mjs`, { cwd: root, stdio: "inherit" })

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
