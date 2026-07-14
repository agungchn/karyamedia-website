// Detection-driven consolidation of near-duplicate articles.
//
//   node scripts/seo/consolidate.mjs          # apply (auto-detect + merge safe cases)
//   node scripts/seo/consolidate.mjs --dry    # report only
//
// How it works:
//   * Computes Jaccard token similarity between every article pair
//     (same heuristic as article-lint.mjs).
//   * For each pair >= SIM_SOFT (0.80):
//       - always rewires internal links from the weaker slug -> canonical (safe)
//       - if similarity >= SIM_HARD (0.85): fully merges (removes the weaker
//         article, adds a 301 in next.config.ts, excludes it from sitemap.ts)
//       - if 0.80-0.84: rewires links + records to duplicates.pending.txt,
//         no deletion (borderline -> human review)
//   * Idempotent: already-merged pairs are recorded in consolidate.merges.json
//     and skipped; running again changes nothing.
//
// The BASELINE map keeps the 4 originally-merged pairs stable so the live
// 301s already deployed stay authoritative.

import { readFileSync, writeFileSync, existsSync, appendFileSync } from "fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "path"
import { extractArticles } from "./article-lint.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = resolve(root, "src/data/articles.ts")
const nextConfigPath = resolve(root, "next.config.ts")
const sitemapPath = resolve(root, "src/app/sitemap.ts")
const registryPath = resolve(here, "consolidate.merges.json")
const pendingPath = resolve(here, "duplicates.pending.txt")

const DRY = process.argv.includes("--dry")
const SIM_SOFT = 0.8
const SIM_HARD = 0.85

// weak slug -> canonical slug (seeded with the original 4 merges)
const BASELINE = {
  "tumbler-souvenir-perusahaan-untuk-branding-bisnis": "tumbler-promosi-untuk-branding-dan-merchandise-event",
  "tumbler-stainless-steel-custom-untuk-merchandise-premium": "tumbler-promosi-untuk-branding-dan-merchandise-event",
  "tumbler-custom-murah-berkualitas-untuk-semua-kebutuhan": "tumbler-souvenir-untuk-event-dan-merchandise-custom",
  "medali-custom-untuk-kompetisi-dan-event": "medali-custom-panduan-memilih-dan-memesan",
}

const stop = new Set(
  "dan,untuk,dengan,yang,di,dari,ke,pada,atau,the,a,an,of,to,in,ini,itu,ada,bisa,juga,akan,atau,sebagai".split(","),
)
const toks = (s) => (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => !stop.has(w))
const contentOf = (block) => {
  const m = block.match(/content:\s*`([\s\S]*?)`/)
  return m ? m[1] : ""
}
const wordCount = (c) => (c.replace(/<[^>]*>/g, " ").match(/\S+/g) || []).length
const internalLinks = (c) => (c.match(/href="\/blog\//g) || []).length

function loadRegistry() {
  try {
    return new Set(JSON.parse(readFileSync(registryPath, "utf8")).map((r) => r.weak))
  } catch {
    return new Set()
  }
}
function saveRegistry(set) {
  writeFileSync(registryPath, JSON.stringify([...set].map((w) => ({ weak: w })), null, 2))
}

// -------------------------------------------------------------- core actions
function rewireLinks(text, old, can) {
  const re = new RegExp(`href=(["'])/blog/${old}\\1`, "g")
  return text.replace(re, `href="/blog/${can}"`)
}

function removeArticle(text, slug) {
  const openRe = new RegExp(`\\{\\s*slug:\\s*"${slug}"`)
  const openIdx = text.search(openRe)
  if (openIdx === -1) return text
  const rest = text.slice(openIdx)
  const closeM = rest.match(/[\s\S]*?\n\s*\},?/)
  if (!closeM) return text
  return text.slice(0, openIdx) + text.slice(openIdx + closeM[0].length)
}

function ensureRedirect(text, source, dest) {
  if (text.includes(`source: "${source}"`)) return text
  const marker = "    ];\n  }," // closes redirects() array
  const idx = text.indexOf(marker)
  if (idx === -1) return text
  const line = `      { source: "${source}", destination: "${dest}", permanent: true },\n`
  return text.slice(0, idx) + line + text.slice(idx)
}

function ensureSitemapExclude(text, slug) {
  if (text.includes(`"${slug}"`)) return text
  const marker = "  ])\n\n  const blogPages" // closes the REDIRECTED Set array
  const idx = text.indexOf(marker)
  if (idx === -1) return text
  return text.slice(0, idx) + `    "${slug}",\n` + text.slice(idx)
}

// -------------------------------------------------------------- main
function main() {
  let text = readFileSync(articlesPath, "utf8")
  const arts = extractArticles(text)
  const resolved = loadRegistry()
  const meta = arts.map((a) => {
    const c = contentOf(a.block)
    return {
      slug: a.slug,
      block: a.block,
      toksSet: new Set(toks(c)),
      words: wordCount(c),
      links: internalLinks(c),
    }
  })

  // similarity matrix -> candidate pairs
  const candidates = []
  for (let i = 0; i < meta.length; i++) {
    for (let j = i + 1; j < meta.length; j++) {
      const A = meta[i].toksSet
      const B = meta[j].toksSet
      if (!A.size || !B.size) continue
      let inter = 0
      for (const w of A) if (B.has(w)) inter++
      const jac = inter / Math.min(A.size, B.size)
      if (jac >= SIM_SOFT) candidates.push({ i, j, jac })
    }
  }
  // de-dup pairs where either side already resolved
  const live = candidates.filter((c) => !resolved.has(meta[c.i].slug) && !resolved.has(meta[c.j].slug))
  live.sort((a, b) => b.jac - a.jac)

  const linkLog = []
  const mergeLog = []
  const pendingLog = []

  for (const { i, j, jac } of live) {
    const a = meta[i]
    const b = meta[j]
    // canonical = more internal links, then longer content, then lexicographic
    let canonical, weak
    if (b.links !== a.links) [canonical, weak] = b.links > a.links ? [b, a] : [a, b]
    else if (b.words !== a.words) [canonical, weak] = b.words > a.words ? [b, a] : [a, b]
    else [canonical, weak] = a.slug < b.slug ? [a, b] : [b, a]

    // baseline override (keep deployed 301s stable)
    let forceMerge = false
    if (BASELINE[a.slug] && BASELINE[a.slug] === (a === weak ? canonical.slug : weak.slug)) {
      weak = a
      canonical = meta.find((m) => m.slug === BASELINE[a.slug]) || b
      forceMerge = true
    } else if (BASELINE[b.slug] && BASELINE[b.slug] === (b === weak ? canonical.slug : weak.slug)) {
      weak = b
      canonical = meta.find((m) => m.slug === BASELINE[b.slug]) || a
      forceMerge = true
    }

    // 1) always rewire links (safe)
    const before = text
    text = rewireLinks(text, weak.slug, canonical.slug)
    if (text !== before) linkLog.push(`${weak.slug} -> ${canonical.slug} (sim ${Math.round(jac * 100)}%)`)

    if (jac >= SIM_HARD || forceMerge) {
      // 2a) full merge
      let cfg = readFileSync(nextConfigPath, "utf8")
      let sm = readFileSync(sitemapPath, "utf8")
      cfg = ensureRedirect(cfg, `/blog/${weak.slug}`, `/blog/${canonical.slug}`)
      sm = ensureSitemapExclude(sm, weak.slug)
      text = removeArticle(text, weak.slug)
      if (!DRY) {
        writeFileSync(nextConfigPath, cfg)
        writeFileSync(sitemapPath, sm)
      }
      resolved.add(weak.slug)
      mergeLog.push(`${weak.slug} -> ${canonical.slug} (sim ${Math.round(jac * 100)}%, merged)`)
    } else {
      // 2b) borderline: only links + flag for review
      pendingLog.push(`${weak.slug} ~ ${canonical.slug} (sim ${Math.round(jac * 100)}%) — review before merge`)
      resolved.add(weak.slug)
    }
  }

  if (!DRY) {
    writeFileSync(articlesPath, text)
    saveRegistry(resolved)
    if (pendingLog.length) {
      appendFileSync(pendingPath, `\n# ${new Date().toISOString()}\n` + pendingLog.join("\n") + "\n")
    }
  }

  if (DRY) {
    console.log(`[DRY] Candidate pairs >=${SIM_SOFT}: ${live.length}`)
    for (const l of linkLog) console.log("  link: " + l)
    for (const l of mergeLog) console.log("  MERGE: " + l)
    for (const l of pendingLog) console.log("  PENDING: " + l)
  } else {
    console.log(`✓ Link rewrites: ${linkLog.length}, merges: ${mergeLog.length}, pending: ${pendingLog.length}`)
    mergeLog.forEach((l) => console.log("  merged: " + l))
    pendingLog.forEach((l) => console.log("  pending: " + l))
  }
}

main()
