// Generate a small og-meta.json (slug -> {title, category, image}) from .mdx files.
// Keeps the OG image worker light (avoids parsing all .mdx files at request time).
import { writeFileSync } from "fs"
import { readAllMdxArticles, PATHS } from "./mdx-helpers.mjs"

const out = PATHS.ARTICLES_INDEX.replace("articles-index.json", "og-meta.json")

const articles = readAllMdxArticles()
const meta = {}
for (const a of articles) {
  meta[a.slug] = { title: a.title, category: a.category, image: a.image }
}

writeFileSync(out, JSON.stringify(meta, null, 2))
console.log(`Wrote ${Object.keys(meta).length} entries -> ${out}`)