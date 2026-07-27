import { readFileSync } from "fs"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const products = require("../src/data/products.json")

const content = readFileSync("src/app/page.tsx", "utf8")

const featured = products.filter((p) => p.featured)

for (const p of featured) {
  const inMap = content.includes(`"${p.slug}"`) || content.includes(`'${p.slug}'`)
  if (!p.images?.[0]) {
    console.log(`❌ ${p.slug} -> NO IMAGE in product data`)
  } else if (!inMap) {
    console.log(`⚠️  ${p.slug} -> not in featuredImageMap (falls back to product.images)`)
  }
}

console.log("\n✅ All featured products checked.")
