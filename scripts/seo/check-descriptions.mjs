// Meta Description Bulk Checker — scans ALL 313 articles for description quality
// Usage: node scripts/seo/check-descriptions.mjs
// Output: summary + problem articles
import { readFileSync } from "fs"
import { join, dirname, resolve } from "path"
import { fileURLToPath } from "url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")

const src = readFileSync(articlesPath, "utf8")
const blocks = src.split(/},\s*\n\s*\{/)

let ok = 0
let short = 0
let long = 0
let missing = 0
let noEndPunct = 0
let letsCheck = []  // articles that need review

for (const b of blocks) {
  const slug = b.match(/slug:\s*"([^"]+)"/)?.[1]
  const title = b.match(/title:\s*"([^"]+)"/)?.[1]
  const desc = b.match(/description:\s*"([^"]+)"/)?.[1]

  if (!slug || !title) continue

  if (!desc) {
    missing++
    letsCheck.push({ slug, title, issue: "❌ Tidak punya deskripsi!" })
    continue
  }

  const len = desc.length
  const endsWell = /[.!?]$/.test(desc.trim())
  const hasKeyword = slug.split("-").slice(0, 3).some((w) =>
    desc.toLowerCase().includes(w)
  )

  const problems = []
  if (len < 120) { short++; problems.push(`Pendek (${len} char)`) }
  if (len > 160) { long++; problems.push(`Kelebihan (${len} char)`) }
  if (!endsWell) { noEndPunct++; problems.push("Tidak diakhiri titik") }

  if (problems.length > 0) {
    letsCheck.push({
      slug,
      title: (title || "").slice(0, 40),
      issue: problems.join(", "),
      desc: desc.slice(0, 80) + "...",
    })
  } else {
    ok++
  }
}

console.log("=".repeat(60))
console.log("📊  META DESCRIPTION BULK CHECK")
console.log("=".repeat(60))
console.log(`\n✅ OK (120-160 char, akhiran benar) : ${ok}`)
console.log(`⚠️  Pendek (< 120 char)           : ${short}`)
console.log(`⚠️  Kelebihan (> 160 char)        : ${long}`)
console.log(`⚠️  Tanpa titik akhir             : ${noEndPunct}`)
console.log(`❌ Tidak punya deskripsi          : ${missing}`)
console.log(`Total artikel: ${ok + short + long + missing - (noEndPunct > 0 ? 0 : 0)}`)

if (letsCheck.length > 0) {
  console.log("\n📋  ARTIKEL PERLU DIPERBAIKI:")
  console.log("-".repeat(60))
  letsCheck.slice(0, 20).forEach((a, i) => {
    console.log(`${i + 1}. ${a.slug.slice(0, 40)}`)
    console.log(`   ${a.issue}`)
    if (a.desc) console.log(`   "${a.desc}"`)
    console.log()
  })
  if (letsCheck.length > 20) {
    console.log(`...dan ${letsCheck.length - 20} artikel lainnya.`)
    console.log("Jalankan: node scripts/seo/check-descriptions.mjs --all  (untuk lihat semua)")
  }
}

console.log("=".repeat(60))
console.log("Saran: node scripts/seo/fix-lint.mjs bisa bantu perbaiki deskripsi otomatis.")
