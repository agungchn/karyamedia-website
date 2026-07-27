import { readFileSync } from "fs"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const products = require("../src/data/products.json")

const featured = products.filter((p) => p.featured)
const noImg = featured.filter((p) => !p.images?.[0])
console.log(`Featured products: ${featured.length}`)
console.log(`Without images: ${noImg.length}`)
noImg.forEach((p) => console.log(`  ❌ ${p.slug} (${p.name})`))

// check if every featuredImageMap path actually points to an existing file
const content = readFileSync("src/app/page.tsx", "utf8")
const mapMatches = content.matchAll(/"([^"]+)":\s*"([^"]+)"/g)
let allExist = true
for (const m of mapMatches) {
  const slug = m[1]
  const imgPath = m[2].replace(/^\//, "public/")
  if (!require("fs").existsSync(imgPath)) {
    console.log(`  ❌ featuredImageMap: ${slug} -> FILE NOT FOUND: ${imgPath}`)
    allExist = false
  }
}
if (allExist) console.log("All featuredImageMap files exist ✅")

// check if product.images[0] exists for the 3 broken map entries
const brokenSlugs = ["tabung-wisuda-1", "tabung-wisuda-2", "plakat-fiberglass-38"]
for (const slug of brokenSlugs) {
  const prod = products.find((p) => p.slug === slug)
  if (prod && prod.images?.[0]) {
    const diskPath = "public/" + prod.images[0].replace(/^\//, "")
    console.log(`${slug}: featuredImageMap BROKEN, product.images[0]=${prod.images[0]} exists=${require("fs").existsSync(diskPath)}`)
  }
}

// check opt webp for a sample of piala-olahraga products
const po = featured.filter((p) => p.subcategoryId === "po")
let missingWebp = 0
for (const p of po) {
  const slug = p.slug
  for (const w of [320, 480, 640, 960]) {
    const webpPath = `public/images/opt/produk-unggulan/piala-olahraga/${slug}-w${w}.webp`
    if (!require("fs").existsSync(webpPath)) {
      console.log(`  ❌ Missing WebP: ${slug}-w${w}.webp`)
      missingWebp++
    }
  }
}
if (missingWebp === 0) console.log("All piala-olahraga WebP variants exist ✅")
