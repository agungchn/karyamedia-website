import { readFileSync, existsSync, mkdirSync } from "fs"
import sharp from "sharp"

// List of image paths (relative to public/images) that need 420px WebP
const images = [
  "produk-unggulan/samir-wisuda/samir-wisuda-akrilik-5.png",
  "produk-unggulan/plakat-akrilik/plakat-akrilik-23.png",
  "produk-unggulan/plakat-akrilik/plakat-akrilik-51.png",
  "produk-unggulan/plakat-fiberglass/plakat-fiberglass-10.png",
  "produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-58.png",
  "produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png",
  "produk-unggulan/plakat-fiberglass/plakat-fiberglass-14.png",
  "produk-unggulan/name-tag/name-tag-18.png",
  "produk-unggulan/name-tag/name-tag-15.png",
  "produk-unggulan/samir-wisuda/samir-wisuda-logam-3.png",
  "produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png", // duplicate
  "produk-unggulan/samir-wisuda/samir-wisuda-logam-28.png",
  "produk-unggulan/samir-wisuda/samir-wisuda-logam-5.png",
  "produk-unggulan/plakat-fiberglass/plakat-fiberglass-88.png",
  "produk-unggulan/tongkat-rektor/tongkat-rektor-2.png",
  "produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (10).png",
  "produk-unggulan/plakat-fiberglass/plakat-fiberglass-75.png",
  "produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-3.png",
  "produk-unggulan/plakat-fiberglass/plakat-fiberglass-9.png",
  "produk-unggulan/plakat-fiberglass/plakat-fiberglass-40.png",
  "produk-unggulan/plakat-fiberglass/plakat-fiberglass-65.png",
  "produk-unggulan/plakat-fiberglass/plakat-fiberglass-83.png",
  "produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-4.png",
  "produk-unggulan/plakat-marmer/plakat-marmer-42.png"
]

// Remove duplicates
const unique = [...new Set(images)]
console.log(`Processing ${unique.length} unique images`)

for (const img of unique) {
  const src = `public/images/${img}`
  if (!existsSync(src)) {
    console.log(`❌ Source not found: ${src}`)
    continue
  }
  const outDir = `public/images/opt/${img.replace(/\.[^.]+$/, '')}` // remove extension
  const outFile = `${outDir}-w420.webp`
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }
  if (!existsSync(outFile)) {
    try {
      await sharp(src)
        .resize({ width: 420, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toFile(outFile)
      console.log(`✅ ${outFile}`)
    } catch (e) {
      console.log(`❌ Failed to process ${src}: ${e.message}`)
    }
  } else {
    console.log(`⏩ Already exists: ${outFile}`)
  }
}