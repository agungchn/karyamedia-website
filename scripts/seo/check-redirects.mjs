// Redirect Mapper — scan & visualize all 301 redirects from next.config.ts
// Usage: node scripts/seo/check-redirects.mjs
import { readFileSync, writeFileSync } from "fs"
import { join, dirname, resolve } from "path"
import { fileURLToPath } from "url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const configPath = join(root, "next.config.ts")
const outputPath = join(root, "src/data/redirect-map.json")

const src = readFileSync(configPath, "utf8")

const redirectRegex = /\{\s*source:\s*"([^"]+)",\s*destination:\s*"([^"]+)",\s*permanent:\s*true\s*\}/g
const redirects = []
let match
while ((match = redirectRegex.exec(src)) !== null) {
  redirects.push({ source: match[1], destination: match[2], permanent: true })
}

// Check chains
const destSet = new Set(redirects.map((r) => r.destination))
const chains = redirects.filter((r) => destSet.has(r.source))

// Check multi-source
const destCount = {}
redirects.forEach((r) => { destCount[r.destination] = (destCount[r.destination] || 0) + 1 })
const multiSource = Object.entries(destCount)
  .filter(([, c]) => c > 1)
  .map(([d]) => ({ destination: d, count: destCount[d], sources: redirects.filter((r) => r.destination === d).map((r) => r.source) }))

console.log("=".repeat(70))
console.log(" \uD83D\uDDFA\uFE0F  REDIRECT MAPPER — Karyamedia")
console.log("=".repeat(70))
console.log(`\nTotal 301 redirects: ${redirects.length}\n`)
redirects.forEach((r, i) => console.log(`${(i+1).toString().padStart(2)}. ${r.source.padEnd(50)} \u2192 ${r.destination}`))

if (chains.length) {
  console.log("\n\u26A0\uFE0F  CHAINS DETECTED:")
  chains.forEach((c) => console.log(`  ${c.source} \u2192 ${c.destination}`))
}
if (multiSource.length) {
  console.log("\n\uD83D\uDCCC MULTI-SOURCE:")
  multiSource.forEach((m) => {
    console.log(`  ${m.count}x \u2192 ${m.destination}`)
    m.sources.forEach((s) => console.log(`    \u2022 ${s}`))
  })
}

writeFileSync(outputPath, JSON.stringify(redirects, null, 2))
console.log(`\n\u2705 Saved \u2192 ${outputPath}`)
