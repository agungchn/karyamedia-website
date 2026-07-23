import sharp from "sharp"
import fs from "fs/promises"

const heroDir = "public/images/hero"

// Max width untuk gambar utama (desktop ukur ~375px, kita buat 420px biar aman)
const WIDTH = 420
const QUALITY = 75

async function main() {
  const files = await fs.readdir(heroDir)
  const images = files.filter((f) => /\.webp$/i.test(f))

  for (const file of images) {
    const inPath = `${heroDir}/${file}`
    const outPath = `${heroDir}/${file}`

    const img = sharp(inPath)
    const meta = await img.metadata()
    const inSize = Math.round((meta.size || 0) / 1024)

    if ((meta.width || 0) <= WIDTH) {
      console.log(`  ${file}: already ${meta.width}px ≤ ${WIDTH}px, skip`)
      continue
    }

    await img
      .resize({ width: WIDTH, withoutEnlargement: false })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outPath + ".tmp")

    await fs.rename(outPath + ".tmp", outPath)

    const newMeta = await sharp(inPath).metadata()
    const outSize = Math.round((newMeta.size || 0) / 1024)
    console.log(`  ${file}: ${meta.width}×${meta.height} (${inSize}KB) → ${newMeta.width}×${newMeta.height} (${outSize}KB)`)
  }
}

main().catch(console.error)
