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

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")

const CAT_MAP = {
  plakat: "Plakat", medali: "Medali", piala: "Piala & Trophy", "gift box": "Gift Box",
  prasasti: "Prasasti", "name tag": "Accessories", "gantungan kunci": "Accessories",
  "souvenir wisuda": "Souvenir Wisuda", souvenir: "Souvenir", "batas wilayah": "Batas Wilayah",
  tumbler: "Souvenir", samir: "Souvenir Wisuda", toga: "Souvenir Wisuda",
}
function inferCategory(kw) {
  const k = kw.toLowerCase()
  for (const [k2, v] of Object.entries(CAT_MAP)) if (k.includes(k2)) return v
  return "Blog"
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
function pickImage(category) {
  const base = join(root, "public/images/produk-unggulan")
  for (const f of FOLDER[category] || []) {
    const dir = join(base, f)
    if (existsSync(dir)) {
      const imgs = readdirSync(dir).filter((x) => /\.(png|jpe?g|webp)$/i.test(x))
      if (imgs.length) return `/images/produk-unggulan/${f}/${imgs[0]}`
    }
  }
  const found = walk(base)
  if (found) return found.replace(join(root, "public"), "").split("\\").join("/")
  return "/images/produk-unggulan/plakat/plakat-akrilik-1.png"
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
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--category") category = args[++i]
    else if (!keyword) keyword = args[i]
  }
  if (!keyword) {
    console.error('Pakai: node scripts/seo/article-generate.mjs "<keyword>" [--category X]')
    process.exit(1)
  }
  if (!category) category = inferCategory(keyword)

  let slug = slugify(keyword)
  if (!slug.endsWith("-custom")) slug += "-custom"

  const working = readFileSync(articlesPath, "utf8")
  if (slugRe.exec(working) && extractArticles(working).some((a) => slugRe.exec(a.block)?.[1] === slug)) {
    console.error(`DUPLIKAT: slug "${slug}" sudah ada. Gunakan keyword lain.`)
    process.exit(1)
  }

  console.log(`Keyword: "${keyword}"  ->  slug: ${slug}  kategori: ${category}`)
  console.log("Menulis prose via LLM...")
  const data = await generateArticle({ keyword, category })

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
  const rel = findRelatedLink(slug, category, working)
  if (rel) content += rel

  let tags = Array.isArray(data.tags) ? data.tags.map(String).slice(0, 6) : []
  while (tags.length < 4) tags.push(slugify(keyword).split("-").filter((w) => w && w !== "custom")[tags.length] || `karyamedia${tags.length}`)

  const image = pickImage(category)
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

  const newText = working.replace(/(},\s*)\](\s*)$/, `$1${obj}]`)
  if (newText === working) {
    console.error("Gagal menyisipkan artikel (pola array tidak ditemukan).")
    process.exit(1)
  }
  writeFileSync(articlesPath, newText)
  console.log(`✓ Artikel disisipkan: blog/${slug} (image: ${image})`)

  console.log("\n--- gate: cek duplikat ---")
  execSync(`node scripts/seo/article-check.mjs`, { env: { ...process.env, ARTICLE_LINT_SLUGS: slug }, cwd: root, stdio: "inherit" })
  console.log("\n--- gate: cek standart ---")
  execSync(`node scripts/seo/article-lint.mjs`, { env: { ...process.env, ARTICLE_LINT_SLUGS: slug }, cwd: root, stdio: "inherit" })
  console.log(`\nReview artikel di src/data/articles.ts (blog/${slug}), lalu git commit.`)
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})
