// Enrich internal linking among ALREADY-PUBLISHED articles (idea #2):
// for each article, append "Artikel terkait" links to a few other
// same-category articles it does not already link to.
//
//   node scripts/seo/link-old.mjs            # apply (idempotent, capped)
//   node scripts/seo/link-old.mjs --dry      # preview only
//
// Safe: only appends a paragraph inside each article's content; never
// touches structure. Lint only warns (non-fatal) past the 1500-word soft cap.

import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { extractArticles } from "./article-lint.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")

const DRY = process.argv.includes("--dry")
const MAX_RELATED = 4 // max "Artikel terkait" links an article may carry
const ADD_PER_RUN = 2 // new links added per article each run (fills up to cap)

const slugRe = /slug:\s*"([^"]*)"/
const titleRe = /title:\s*"([^"]*)"/
const catRe = /category:\s*"([^"]*)"/
const escTpl = (s) => String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")

function linkedSlugs(block) {
  const body = block.slice(block.indexOf("`") + 1, block.lastIndexOf("`"))
  const set = new Set()
  let m
  const re = /href="\/blog\/([^"]+)"/g
  while ((m = re.exec(body))) set.add(m[1])
  return set
}
function relatedCount(block) {
  const body = block.slice(block.indexOf("`") + 1, block.lastIndexOf("`"))
  return (body.match(/Artikel terkait: <a href="\/blog\//g) || []).length
}
function appendLink(block, targetSlug, targetTitle) {
  const open = block.indexOf("content:")
  if (open === -1) return block
  const c0 = block.indexOf("`", open)
  if (c0 === -1) return block
  const c1 = block.lastIndexOf("`")
  if (c1 <= c0) return block
  if (block[c1 + 1] !== ",") return block // not the content closer; bail out
  const link = `<p>Artikel terkait: <a href="/blog/${targetSlug}">${escTpl(targetTitle)}</a></p>`
  return block.slice(0, c1) + link + block.slice(c1)
}

function main() {
  const text = readFileSync(articlesPath, "utf8")
  const arts = extractArticles(text)
  const meta = arts.map((a) => ({
    slug: slugRe.exec(a.block)?.[1],
    title: titleRe.exec(a.block)?.[1] || "",
    category: catRe.exec(a.block)?.[1] || "",
    block: a.block,
    linked: linkedSlugs(a.block),
    related: relatedCount(a.block),
  }))

  const byCat = {}
  for (const m of meta) (byCat[m.category] ||= []).push(m)

  let added = 0
  const changes = []
  for (const a of meta) {
    const others = (byCat[a.category] || []).filter(
      (o) => o.slug !== a.slug && !a.linked.has(o.slug),
    )
    const room = MAX_RELATED - a.related
    if (room <= 0 || !others.length) continue
    const take = others.slice(0, Math.min(ADD_PER_RUN, room))
    let block = a.block
    for (const o of take) {
      block = appendLink(block, o.slug, o.title)
      added++
    }
    changes.push({ slug: a.slug, block })
  }

  if (!changes.length) {
    console.log("Tidak ada link baru yang perlu ditambahkan (sudah jenuh / idempoten).")
    return
  }

  let out = text
  for (const c of changes) out = out.replace(c.block, c.block)

  if (DRY) {
    console.log(`[DRY] Akan menyuntik ${added} link terkait ke ${changes.length} artikel.`)
    return
  }

  writeFileSync(articlesPath, out)
  console.log(`✓ Disuntik ${added} link terkait ke ${changes.length} artikel.`)
}

main()
