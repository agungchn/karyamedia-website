// Generate a small og-meta.json (slug -> {title, category, image}) from articles.ts.
// Keeps the OG image worker light (avoids parsing the 1MB articles.ts at request time).
import { readFileSync, writeFileSync } from "fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..", "..")
const src = join(root, "src", "data", "articles.ts")
const out = join(root, "src", "data", "og-meta.json")

const text = readFileSync(src, "utf8")
const re = /slug:\s*"([^"]*)"[\s\S]*?title:\s*"([^"]*)"[\s\S]*?category:\s*"([^"]*)"[\s\S]*?image:\s*"([^"]*)"/g

const meta = {}
let m
while ((m = re.exec(text)) !== null) {
  meta[m[1]] = { title: m[2], category: m[3], image: m[4] }
}

writeFileSync(out, JSON.stringify(meta, null, 2))
console.log(`Wrote ${Object.keys(meta).length} entries -> ${out}`)
