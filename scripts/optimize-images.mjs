import { readdirSync, statSync, existsSync, mkdirSync } from "fs"
import sharp from "sharp"

// Walk public/images/ recursively to find all PNG files
const rootDir = "public/images"
const pngFiles = []

function walkDir(dir, basePath = "") {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = `${dir}/${entry.name}`
    if (entry.isDirectory()) {
      // Skip the opt directory (already processed images)
      if (entry.name === "opt") continue
      walkDir(fullPath, `${basePath}/${entry.name}`)
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
      pngFiles.push({ fullPath, relPath: `${basePath}/${entry.name}` })
    }
  }
}

walkDir(rootDir)
console.log(`Found ${pngFiles.length} PNG files in public/images/`)

let optimized = 0
let errors = 0

for (const { fullPath, relPath } of pngFiles) {
  // relPath format: /hero/file.png or /produk-unggulan/x/file.png
  // Remove leading / if present
  const cleanPath = relPath.startsWith("/") ? relPath.slice(1) : relPath
  const base = cleanPath.replace(/\.\w+$/, "") // remove extension

  for (const w of [320, 480, 640, 960]) {
    const outFile = `public/images/opt/${base}-w${w}.webp`
    const outDir = outFile.substring(0, outFile.lastIndexOf("/"))

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true })
    }

    if (!existsSync(outFile)) {
      try {
        await sharp(fullPath)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 80, effort: 4 })
          .toFile(outFile)
        optimized++
      } catch (e) {
        errors++
        console.log(`  ❌ ${relPath} (w${w}): ${e.message}`)
      }
    }
  }
}

console.log(`\nOptimization complete. Created ${optimized} WebP images. Errors: ${errors}`)