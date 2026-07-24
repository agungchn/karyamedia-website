import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import sharp from "sharp"

let c = readFileSync("src/data/articles.ts", "utf8")
const latest = readFileSync("/tmp/articles-latest.ts", "utf8")

// Slug -> correct image
const fixes = {
  "piala-resin-untuk-pemerintahan-kalimantan-utara": "/images/produk-unggulan/piala-golf/piala-golf-4.png",
  "piala-resin-untuk-kampus-gorontalo-tren-terkini": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-10.png",
  "plakat-kayu-untuk-komunitas-kepulauan-bangka-belitung": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-58.png",
  "samir-wisuda-untuk-pemerintahan-lengkap": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png",
  "plakat-akrilik-untuk-komunitas-papua-pegunungan-lengkap": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-14.png",
  "menghitung-value-nama-dada-custom-untuk-pengadaan": "/images/produk-unggulan/name-tag/name-tag-18.png",
  "kalung-wisuda-custom-berkualitas-tinggi-dari-yogyakarta": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-3.png",
  "produsen-mendali-wisuda-custom-berkualitas-karyamedia": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png",
  "gordon-wisuda-custom-terbaik-untuk-kampus-instansi": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-28.png",
  "medali-kelulusan-custom-mitos-vs-fakta-panduan-lengkap": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-5.png",
  "souvenir-untuk-acara-reuni": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-88.png",
  "tongkat-rektor-kayu-jati-custom": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-2.png",
  "prasasti-batas-wilayah-kabupaten": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable%20(10).png",
  "toko-souvenir-terdekat-untuk-instansi-event-di-yogyakarta": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-75.png",
  "plakat-akrilik-untuk-pemerintahan-kepulauan-bangka-belitung": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-40.png",
  "plakat-penghargaan-untuk-pemerintahan-jawa-timur": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-65.png",
  "plakat-akrilik-untuk-kampus-jawa-barat": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-83.png",
  "ide-souvenir-pernikahan-yang-unik-dan-berkesan": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-4.png",
  "ide-souvenir-wisuda-tahfidz-dan-santri-pondok-pesantren": "/images/produk-unggulan/plakat-marmer/plakat-marmer-42.png",
}

const imgPaths = new Set()
let added = 0

for (const [slug, img] of Object.entries(fixes)) {
  // Find in latest file
  const li = latest.indexOf(`slug: "${slug}"`)
  if (li < 0) { console.log(`❌ Not in latest: ${slug}`); continue }
  
  const start = latest.lastIndexOf("{", li)
  let d = 0, p = start; while (p < latest.length) { if (latest[p] === "{") d++; if (latest[p] === "}") d--; if (d === 0) break; p++ }
  let entry = latest.slice(start, p + 1)
  
  // Fix image
  entry = entry.replace(/image: "[^"]+"/, `image: "${img}"`)
  
  // Insert into current file
  const insertPos = c.lastIndexOf("]")
  c = c.slice(0, insertPos) + "\n  " + entry.trim() + ",\n" + c.slice(insertPos)
  added++
  imgPaths.add(img)
  console.log(`➕ Added with fixed image: ${slug}`)
}

writeFileSync("src/data/articles.ts", c)
console.log(`\nAdded ${added} articles`)

// Optimize
console.log("\n=== OPTIMASI ===")
for (const img of imgPaths) {
  const src = `public${img}`
  if (!existsSync(src)) {
    console.log(`❌ File not found: ${src}`)
    continue
  }
  // Generate WebP
  for (const w of [320, 480, 640, 960]) {
    const base = img.replace("/images/", "").replace(/\.[^.]+$/, "")
    const outPath = `public/images/opt/${base}-w${w}.webp`
    const dir = outPath.substring(0, outPath.lastIndexOf("/"))
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    if (!existsSync(outPath)) {
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toFile(outPath)
      console.log(`  Created: ${outPath.split("/").pop()}`)
    } else {
      console.log(`  OK: ${outPath.split("/").pop()}`)
    }
  }
}

console.log("\n✅ DONE!")
