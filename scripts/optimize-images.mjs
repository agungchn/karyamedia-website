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

let optimized = 0
for (const img of images) {
  const src = `public${img}`
  if (!existsSync(src)) {
    console.log(`❌ Source not found: ${src}`)
    continue
  }
  // Determine output directory: public/images/opt/<same path without leading /images/> but with .webp
  // Example: /images/produk-unggulan/xyz.png -> public/images/opt/produk-unggulan/xyz-w320.webp
  const pathWithoutImages = img.startsWith('/images/') ? img.slice('/images/'.length) : (img.startsWith('/') ? img.slice(1) : img)
  const base = pathWithoutImages.replace(/\.[^.]+$/, '') // remove extension
  for (const w of [320, 480, 640, 960]) {
    const outDir = `public/images/opt/${base.split('/').slice(0, -1).join('/')}` // directory without filename
    const outFile = `public/images/opt/${base}-w${w}.webp`
    // Ensure directory exists
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true })
    }
    if (!existsSync(outFile)) {
      try {
        await sharp(src)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 80, effort: 4 })
          .toFile(outFile)
        console.log(`  ✅ ${outFile.split('/').pop()}`)
        optimized++
      } catch (e) {
        console.log(`  ❌ Failed to process ${src} for width ${w}: ${e.message}`)
      }
    }
  }
}
console.log(`\nOptimization complete. Created ${optimized} WebP images.`)