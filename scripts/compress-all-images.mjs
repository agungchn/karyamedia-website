// Compress all large images across all product folders to <500KB
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs"
import { join } from "path"
import sharp from "sharp"

const root = "H:/karyamedia-web/public"
const folders = [
  "images/produk-unggulan/box-batik",
  "images/produk-unggulan/kalung-rektor", 
  "images/produk-unggulan/medali-3d",
  "images/produk-unggulan/medali-custom",
  "images/produk-unggulan/piala-trophy",
  "images/produk-unggulan/pin-bross",
  "images/produk-unggulan/samir-wisuda",
  "images/produk-unggulan/plakat-kayu-eksklusif",
  "images/produk-unggulan/prasasti-marmer",
  "images/produk-unggulan/trophy-fiber-akrilik",
  "images/produk-unggulan/plakat-wayang",
  "images/produk-unggulan/tumbler",
  "images/produk-unggulan/name-tag",
  "images/produk-unggulan/tabung-wisuda",
]

let total = 0
let compressed = 0
for (const rel of folders) {
  const dir = join(root, rel)
  try {
    const files = readdirSync(dir).filter(f => /\.(png|jpe?g)$/i.test(f))
    for (const f of files) {
      const src = join(dir, f)
      const stat = statSync(src)
      if (stat.size < 500 * 1024) continue // <500KB skip
      total++
      try {
        const buf = await sharp(src)
          .resize({ width: 1280, withoutEnlargement: true })
          .png({ compressionLevel: 9, quality: 80 })
          .toBuffer()
        writeFileSync(src, buf)
        const ratio = ((1 - buf.length / stat.size) * 100).toFixed(0)
        console.log(`✓ ${rel}/${f}: ${(stat.size/1024).toFixed(0)}KB → ${(buf.length/1024).toFixed(0)}KB (${ratio}%)`)
        compressed++
      } catch(e) {
        console.error(`✗ ${rel}/${f}: ${e.message}`)
      }
    }
  } catch(e) {
    // skip folders that don't exist
  }
}
console.log(`\n${compressed}/${total} large images compressed.`)
