// Compress large images to <1MB (replace original)
import { readdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import sharp from "sharp"

const folder = "H:\\karyamedia-web\\public\\images\\plakat-akrilik"

const files = readdirSync(folder).filter((f) => /^plakat-akrilik-\d+\.png$/i.test(f))
let compressed = 0

for (const f of files) {
  const src = join(folder, f)
  const origSize = readFileSync(src).length
  if (origSize < 1024 * 1024) continue // <1MB, skip

  try {
    const buf = await sharp(src)
      .resize({ width: 1280, withoutEnlargement: true })
      .png({ compressionLevel: 9, quality: 80 })
      .toBuffer()
    writeFileSync(src, buf)
    const newSize = buf.length
    const ratio = ((1 - newSize / origSize) * 100).toFixed(0)
    console.log(`✓ ${f}: ${(origSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (${ratio}% smaller)`)
    compressed++
  } catch (e) {
    console.error(`✗ ${f}: ${e.message}`)
  }
}
console.log(`\n${compressed} file dikompres.`)
