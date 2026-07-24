import { readFileSync } from "fs"
import sharp from "sharp"
import { existsSync, mkdirSync } from "fs"

const c = readFileSync("src/data/articles.ts", "utf8")
// Find all image paths
const matches = c.match(/image: "[^"]+"/g)
const images = new Set()
if (matches) {
  for (const m of matches) {
    const img = m.slice(8, -1) // remove 'image: "' and '"'
    images.add(img)
  }
}
console.log(`Found ${images.size} unique images in articles.ts`)

const targetWidth = 420
let optimized = 0
for (const img of images) {
  const src = `public${img}`
  if (!existsSync(src)) {
    // console.log(`❌ Source not found: ${src}`)
    continue
  }
  // Determine output path: public/images/opt/<same path without leading slash> -w420.webp
  const pathWithoutLeading = img.startsWith('/') ? img.slice(1) : img
  const base = pathWithoutLeading.replace(/\.[^.]+$/, '') // remove extension
  const outDir = `public/images/opt/${base.split('/').slice(0, -1).join('/')}`
  const outFile = `public/images/opt/${base}-w${targetWidth}.webp`
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }
  if (!existsSync(outFile)) {
    try {
      await sharp(src)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toFile(outFile)
      console.log(`  ✅ ${outFile.split('/').pop()}`)
      optimized++
    } catch (e) {
      console.log(`  ❌ Failed to process ${src}: ${e.message}`)
    }
  }
}
console.log(`\nOptimization complete. Created ${optimized} WebP images at width ${targetWidth}.`)