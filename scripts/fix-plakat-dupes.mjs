#!/usr/bin/env node
// Fix duplicate plakat-akrilik images by swapping old-folder articles to unused images 65+
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"

const HERE = "H:/karyamedia-web"
const ARTICLES = join(HERE, "src/data/articles.ts")

// Available images in old folder (not used by any article yet)
// Check which numbers exist in the old folder physically
const OLD_DIR = join(HERE, "public/images/produk-unggulan/plakat-akrilik")
const oldFiles = readdirSync(OLD_DIR).filter(f => /plakat-akrilik-\d+\.png/i.test(f))
const oldNums = oldFiles.map(f => parseInt(f.match(/\d+/)[1])).sort((a,b) => a-b)

// Image numbers already referenced in articles.ts
const src = readFileSync(ARTICLES, "utf8")
const usedNums = new Set()
for (const m of src.matchAll(/produk-unggulan\/plakat-akrilik\/plakat-akrilik-(\d+)\.png/g)) {
  usedNums.add(parseInt(m[1]))
}
for (const m of src.matchAll(/images\/plakat-akrilik\/plakat-akrilik-(\d+)\.png/g)) {
  usedNums.add(parseInt(m[1]))
}

const availableNums = oldNums.filter(n => !usedNums.has(n))
console.log("Available (exist in folder, NOT in articles):")
availableNums.forEach(n => console.log("  " + n))

// Old-folder articles that have duplicates with watermark folder
// The duplicates are: 1-6, 10-16, 18-19 (all in watermark folder)
// Swap them to available numbers from the pool

const dupeNums = [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 15, 16, 18, 19]

// For each dupe number, find old-folder articles using it
// and collect them with their line positions
const toSwap = []
for (const dn of dupeNums) {
  // Find old-folder articles (with regex)
  const re = new RegExp(`image:\\s*"/images/produk-unggulan/plakat-akrilik/plakat-akrilik-${dn}\\.png"`, "g")
  let m
  while ((m = re.exec(src))) {
    // Count line number
    const line = src.slice(0, m.index).split("\n").length - 1
    // Find slug before this
    const before = src.slice(0, m.index)
    const slugM = before.match(/slug:\s*"([^"]+)"\s*,\s*$/m)
    const slug = slugM?.[1] || "?"
    toSwap.push({ line: line + 1, slug, oldNum: dn, pos: m.index, match: m[0] })
  }
}

console.log(`\n${toSwap.length} old-folder articles to swap:`)
toSwap.forEach(a => console.log(`  L${a.line}: slug=${a.slug}, num=${a.oldNum}`))

if (toSwap.length > availableNums.length) {
  console.log(`\nWarning: ${toSwap.length} articles but only ${availableNums.length} available images!`)
  process.exit(1)
}

// Do the swap
let result = src
const used = new Set()
for (let i = 0; i < toSwap.length; i++) {
  const newNum = availableNums[i]
  const newPath = `/images/produk-unggulan/plakat-akrilik/plakat-akrilik-${newNum}.png`
  const oldPath = `/images/produk-unggulan/plakat-akrilik/plakat-akrilik-${toSwap[i].oldNum}.png`
  result = result.replace(oldPath, newPath)
  console.log(`  ${toSwap[i].slug}: plakat-akrilik-${toSwap[i].oldNum}.png → plakat-akrilik-${newNum}.png`)
}

writeFileSync(ARTICLES, result, "utf8")
console.log("\nDone! All duplicates fixed.")
