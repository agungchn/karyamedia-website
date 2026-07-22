import sharp from "sharp"
import fs from "fs/promises"
import path from "path"

const heroDir = "public/images/hero"
const files = await fs.readdir(heroDir)
const images = files.filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))

console.log(`Found ${images.length} images in ${heroDir}`)

for (const file of images) {
  const inputPath = path.join(heroDir, file)
  const ext = path.extname(file)
  const base = path.basename(file, ext)
  const outputPath = path.join(heroDir, `${base}.webp`)

  const info = await sharp(inputPath).metadata()
  const targetWidth = Math.min(info.width, 1280)

  await sharp(inputPath)
    .resize({ width: targetWidth, height: targetWidth, fit: "inside" })
    .webp({ quality: 80, effort: 6 })
    .toFile(outputPath)

  const oldSize = (await fs.stat(inputPath)).size
  const newSize = (await fs.stat(outputPath)).size
  const reduction = ((oldSize - newSize) / oldSize * 100).toFixed(1)

  console.log(`${file} → ${base}.webp: ${(oldSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${reduction}% smaller)`)
}

console.log("Done ✅")
