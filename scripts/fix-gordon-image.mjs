import { readFileSync, writeFileSync, existsSync } from "fs"
import sharp from "sharp"

let c = readFileSync("src/data/articles.ts", "utf8")
const slug = "gordon-wisuda-bordir-custom"

// Check if article already exists
if (c.includes(`slug: "${slug}"`)) {
  // Update image only
  const s = c.indexOf(`slug: "${slug}"`)
  const start = c.lastIndexOf("{", s)
  let d = 0, i = start; while (i < c.length) { if (c[i] === "{") d++; if (c[i] === "}") d--; if (d === 0) break; i++ }
  let entry = c.slice(start, i + 1)
  entry = entry.replace(/image: "[^"]+"/, `image: "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-7.png"`)
  c = c.slice(0, start) + entry + c.slice(i + 1)
  console.log("Artikel sudah ada, update image")
} else {
  // Extract article from git and insert
  const { execSync } = await import("child_process")
  const raw = execSync('git show 0b8bdb0:src/data/articles.ts', { encoding: "utf8" })
  const s2 = raw.indexOf(`slug: "${slug}"`)
  const start2 = raw.lastIndexOf("{", s2)
  let d2 = 0, i2 = start2; while (i2 < raw.length) { if (raw[i2] === "{") d2++; if (raw[i2] === "}") d2--; if (d2 === 0) break; i2++ }
  let article = raw.slice(start2, i2 + 1)
  // Fix image
  article = article.replace(/image: "[^"]+"/, `image: "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-7.png"`)
  // Insert into current file
  const insertPos = c.lastIndexOf("]")
  c = c.slice(0, insertPos) + "\n  " + article.trim() + ",\n" + c.slice(insertPos)
  console.log("Artikel baru ditambahkan dengan image yang sudah diperbaiki")
}

writeFileSync("src/data/articles.ts", c)

// Optimize image
const src = "public/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-7.png"
if (existsSync(src)) {
  for (const w of [320, 480, 640, 960]) {
    const out = `public/images/opt/produk-unggulan/samir-wisuda/samir-wisuda-logam-7-w${w}.webp`
    if (!existsSync(out)) {
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(out)
      console.log(`  Created ${out}`)
    } else {
      console.log(`  Already exists: ${out}`)
    }
  }
}

console.log("✅ Done")
