// Pre-creation / pre-commit duplicate-content checker for karyamedia-web.
// Detects whether a NEW article overlaps an existing topic, to avoid
// duplicate content (bad for SEO). Integrates with the pre-commit hook:
// it only flags articles that are NEW (not yet in HEAD).
//
// Usage:
//   node scripts/seo/article-check.mjs                         # uses ARTICLE_LINT_SLUGS
//   ARTICLE_LINT_SLUGS=a,b node scripts/seo/article-check.mjs  # check given slugs (new ones)
//   node scripts/seo/article-check.mjs "plakat akrilik custom" # free-text pre-write search
//
// Exit 1 (block) only on clear duplication:
//   - slug already exists (exact)
//   - title is (near) identical to an existing title
//   - topic similarity is extremely high
// Otherwise it prints an advisory report of the most-similar existing
// articles so the author can pick a different angle.

import { readFileSync } from "node:fs"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { readAllMdxArticles, PATHS } from "./mdx-helpers.mjs"

const root = PATHS.ROOT

// generic + site-wide category terms that are NOT distinctive
const STOP = new Set(
  "custom,kustom,souvenir,plakat,medali,piala,trophy,gift,box,accessories,prasasti,batas,wilayah,wisuda,dan,untuk,ke,di,dari,pada,atau,dengan,yang,the,a,an,of,to,in,for,cara,membuat,panduan,lengkap,guide,model,jenis,terbaik,bagi,acara,adalah,this,that,vs".split(","),
)

function field(block, name) {
  const m = block.match(new RegExp(name + ':\\s*"([^"]*)"'))
  return m ? m[1] : null
}
function tagsOf(block) {
  const m = block.match(/tags:\s*\[([\s\S]*?)\]/)
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : []
}
function tokens(str) {
  return (str || "")
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .split(/[^a-z0-9]+/i)
    .filter((w) => w && !STOP.has(w) && w.length > 1)
}
function jaccard(a, b) {
  const A = new Set(a)
  const B = new Set(b)
  if (!A.size || !B.size) return 0
  let inter = 0
  for (const x of A) if (B.has(x)) inter++
  return inter / (A.size + B.size - inter)
}
// how much of `a` is contained in `b` (1 = a is a subset of b)
function containment(a, b) {
  const A = new Set(a)
  const B = new Set(b)
  if (!A.size) return 0
  let inter = 0
  for (const x of A) if (B.has(x)) inter++
  return inter / Math.min(A.size, B.size)
}
function tokenKey(arr) {
  return [...new Set(arr)].sort().join(" ")
}
function articleTokens(slug, title, tags) {
  return [...tokens(slug.replace(/-/g, " ")), ...tokens(title), ...tags.flatMap(tokens)]
}

// ---------------------------------------------------------------- inputs
// Read articles from .mdx files
const mdxArticles = readAllMdxArticles()

// Convert to block format for backward compatibility
const arts = mdxArticles.map(a => ({
  slug: a.slug,
  block: `slug: "${a.slug}",\ntitle: "${a.title}",\ndescription: "${a.description}",\ncategory: "${a.category}",\ndate: "${a.date}",\nimage: "${a.image}",\ntags: [${a.tags.map(t => `"${t}"`).join(", ")}],\ncontent: \`${a.content}\``
}))

// For HEAD comparison, try to read from git (old articles.ts or .mdx files)
let headArts = []
try {
  const headText = execSync("git show HEAD:src/data/articles.ts", { cwd: root, encoding: "utf8" })
  if (headText) {
    const slugRe = /slug:\s*"([^"]+)"/g
    const positions = []
    let m
    while ((m = slugRe.exec(headText))) positions.push({ slug: m[1], idx: m.index })
    for (let i = 0; i < positions.length; i++) {
      const start = positions[i].idx
      const end = positions[i + 1] ? positions[i + 1].idx : headText.length
      headArts.push({ slug: positions[i].slug, block: headText.slice(start, end) })
    }
  }
} catch {
  // articles.ts doesn't exist in HEAD, try .mdx files
  try {
    const headFiles = execSync("git ls-tree --name-only HEAD content/blog/", { cwd: root, encoding: "utf8" }).trim().split("\n")
    for (const f of headFiles) {
      if (!f.endsWith(".mdx")) continue
      const slug = f.replace("content/blog/", "").replace(".mdx", "")
      const content = execSync(`git show HEAD:${f}`, { cwd: root, encoding: "utf8" })
      headArts.push({ slug, block: content })
    }
  } catch {
    headArts = []
  }
}
const headSlugs = new Set(headArts.map((a) => a.slug))

let candidateSlugs = []
if (process.env.ARTICLE_LINT_SLUGS) candidateSlugs = process.env.ARTICLE_LINT_SLUGS.split(",")
else if (process.argv[2]) candidateSlugs = [process.argv[2]]

const errors = []
const reports = []

function checkNew(slug) {
  const cand = arts.find((a) => a.slug === slug)
  if (!cand) return // not in file -> handled as query mode by caller
  if (headSlugs.has(slug)) return // modified existing article, skip topic check

  const title = field(cand.block, "title") || ""
  const tags = tagsOf(cand.block)
  const cTokens = articleTokens(slug, title, tags)
  const cTitleKey = tokenKey(tokens(title))

  const scored = headArts.map((ex) => {
    const eTitle = field(ex.block, "title") || ""
    const eTags = tagsOf(ex.block)
    const eTokens = articleTokens(ex.slug, eTitle, eTags)
    const sim = jaccard(cTokens, eTokens)
    const titleSim = jaccard(tokens(title), tokens(eTitle))
    const titleCont = containment(tokens(title), tokens(eTitle))
    const topicCont = containment(cTokens, eTokens)
    const shared = [...new Set(cTokens)].filter((x) => new Set(eTokens).has(x))
    return { slug: ex.slug, title: eTitle, sim, titleSim, titleCont, topicCont, shared }
  })
  scored.sort((a, b) => b.sim - a.sim)
  const top = scored.slice(0, 3)
  reports.push({ slug, title, top })

  // --- hard rules (block) ---
  for (const ex of headArts) {
    if (ex.slug === slug) {
      errors.push(`blog/${slug}: slug sudah ada — duplikat konten!`)
      break
    }
  }
  for (const s of scored) {
    // title of the new article is fully contained in an existing title
    // (or vice versa) -> near-duplicate topic
    if (s.titleCont >= 1 && tokens(title).length >= 1) {
      errors.push(`blog/${slug}: title hampir sama dengan "${s.title}" (blog/${s.slug}) — risiko duplikat konten`)
      break
    }
    // whole-topic strong overlap
    if (s.topicCont >= 0.9 && s.shared.length >= 2) {
      errors.push(`blog/${slug}: topik terlalu mirip dengan "${s.title}" (blog/${s.slug}, similarity ${(s.sim * 100).toFixed(0)}%) — hindari duplikat konten`)
      break
    }
  }
}

function queryMode(text) {
  const qTokens = tokens(text)
  const scored = headArts.map((ex) => {
    const eTitle = field(ex.block, "title") || ""
    const eTags = tagsOf(ex.block)
    const eTokens = articleTokens(ex.slug, eTitle, eTags)
    return { slug: ex.slug, title: eTitle, sim: jaccard(qTokens, eTokens) }
  })
  scored.sort((a, b) => b.sim - a.sim)
  reports.push({ query: text, top: scored.slice(0, 5) })
}

for (const slug of candidateSlugs) {
  const inFile = arts.some((a) => a.slug === slug)
  if (inFile) checkNew(slug)
  else queryMode(slug)
}

// ---------------------------------------------------------------- output
console.log("")
if (reports.length) {
  for (const r of reports) {
    if (r.query) {
      console.log(`Cek topik: "${r.query}"`)
      for (const t of r.top) console.log(`  ~ similarity ${(t.sim * 100).toFixed(0)}%  blog/${t.slug}  — ${t.title}`)
    } else {
      console.log(`Artikel baru: blog/${r.slug} — ${r.title}`)
      if (r.top.length && r.top[0].sim > 0) {
        console.log("  Artikel terdekat yang sudah ada:")
        for (const t of r.top) console.log(`  ~ similarity ${(t.sim * 100).toFixed(0)}%  blog/${t.slug}  — ${t.title}`)
      } else {
        console.log("  ✓ tidak ada topik yang mirip — aman dibuat.")
      }
    }
  }
}
console.log("")
if (errors.length) {
  console.log("DUPLIKAT TERDETEKSI:")
  for (const e of errors) console.log("  ✗ " + e)
} else {
  console.log("✓ tidak ada duplikat konten yang jelas.")
}

process.exit(errors.length ? 1 : 0)