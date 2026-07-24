import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import sharp from "sharp"

let c = readFileSync("src/data/articles.ts", "utf8")

// slug -> correct image path
const fixes = {
  "piala-resin-untuk-pemerintahan-kalimantan-utara": "/images/produk-unggulan/piala-golf/piala-golf-4.png",
  "biaya-pembuatan-plakat-custom": "/images/plakat-akrilik/plakat-akrilik-23.png",
  "media-karya-plakat-custom": "/images/plakat-akrilik/plakat-akrilik-51.png",
  "piala-resin-untuk-kampus-gorontalo-tren-terkini": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-10.png",
  "plakat-kayu-untuk-komunitas-kepulauan-bangka-belitung": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-58.png",
  "samir-wisuda-untuk-pemerintahan-lengkap": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png",
  "plakat-akrilik-untuk-komunitas-papua-pegunungan-lengkap": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-14.png",
  "menghitung-value-nama-dada-custom-untuk-pengadaan": "/images/produk-unggulan/name-tag/name-tag-18.png",
  "papan-nama-dada-custom": "/images/produk-unggulan/name-tag/name-tag-15.png",
  "kalung-wisuda-custom-berkualitas-tinggi-dari-yogyakarta": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-3.png",
  "produsen-mendali-wisuda-custom-berkualitas-karyamedia": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png",
  "gordon-wisuda-custom-terbaik-untuk-kampus-instansi": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-28.png",
  "medali-kelulusan-custom-mitos-vs-fakta-panduan-lengkap": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-5.png",
  "souvenir-untuk-acara-reuni": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-88.png",
  "tongkat-rektor-kayu-jati-custom": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-2.png",
  "prasasti-batas-wilayah-kabupaten": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (10).png",
  "toko-souvenir-terdekat-untuk-instansi-event-di-yogyakarta": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-75.png",
  "panduan-lengkap-souvenir-pernikahan-custom": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-3.png",
  "kenapa-souvenir-custom-tidak-bisa-langsung-ada-pricelist": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-9.png",
  "plakat-akrilik-untuk-pemerintahan-kepulauan-bangka-belitung": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-40.png",
  "plakat-penghargaan-untuk-pemerintahan-jawa-timur": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-65.png",
  "plakat-akrilik-untuk-kampus-jawa-barat": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-83.png",
  "ide-souvenir-pernikahan-yang-unik-dan-berkesan": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-4.png",
  "ide-souvenir-wisuda-tahfidz-dan-santri-pondok-pesantren": "/images/produk-unggulan/plakat-marmer/plakat-marmer-42.png",
}

const imgPaths = new Set()
let updated = 0
let notFound = []

for (const [slug, img] of Object.entries(fixes)) {
  // Try exact slug
  let idx = c.indexOf(`slug: "${slug}"`)
  
  // If not found, try partial match (some slugs might have additional suffixes)
  if (idx < 0) {
    // Search in the latest committed file content which is in /tmp
    try {
      const latest = readFileSync("/tmp/articles-latest.ts", "utf8")
      const li = latest.indexOf(`slug: "${slug}"`)
      if (li >= 0) {
        // Found in latest, extract the entry
        const entryStart = latest.lastIndexOf("{", li)
        let d = 0, p = entryStart; while (p < latest.length) { if (latest[p] === "{") d++; if (latest[p] === "}") d--; if (d === 0) break; p++ }
        const articleEntry = latest.slice(entryStart, p + 1)
        // Fix image
        const fixedEntry = articleEntry.replace(/image: "[^"]+"/, `image: "${img}"`)
        // Insert into current file before the closing ]
        const insertPos = c.lastIndexOf("]")
        c = c.slice(0, insertPos) + "\n  " + fixedEntry.trim() + ",\n" + c.slice(insertPos)
        updated++
        imgPaths.add(img)
        console.log(`➕ Added: ${slug}`)
        continue
      }
    } catch {}
  }

  if (idx < 0) {
    notFound.push(slug)
    continue
  }

  // Found in current file, update image
  const entryStart = c.lastIndexOf("{", idx)
  let d = 0, p = entryStart; while (p < c.length) { if (c[p] === "{") d++; if (c[p] === "}") d--; if (d === 0) break; p++ }
  let entry = c.slice(entryStart, p + 1)
  const oldImg = entry.match(/image: "([^"]+)"/)
  if (oldImg && oldImg[1] !== img) {
    entry = entry.replace(/image: "[^"]+"/, `image: "${img}"`)
    c = c.slice(0, entryStart) + entry + c.slice(p + 1)
    updated++
    imgPaths.add(img)
    console.log(`✅ Updated: ${slug}`)
  }
}

writeFileSync("src/data/articles.ts", c)
console.log(`\nUpdated ${updated} articles`)

if (notFound.length) {
  console.log(`Not found (${notFound.length}):`)
  notFound.forEach(s => console.log(`  - ${s}`))
}

// Optimize images
console.log("\n=== OPTIMASI GAMBAR ===")
for (const img of imgPaths) {
  const src = `public${img}`
  if (!existsSync(src)) {
    console.log(`❌ NOT FOUND: ${src}`)
    continue
  }
  const { size } = await sharp(src).metadata()
  // Check/Generate WebP
  for (const w of [320, 480, 640, 960]) {
    const out = src
      .replace("public/images/", "public/images/opt/")
      .replace(/produk-unggulan\//, "opt/")
    // Better: use the loader path
    const baseName = img.replace("/images/", "").replace(/\.[^.]+$/, "")
    const outPath = `public/images/opt/${baseName}-w${w}.webp`
    const dir = outPath.substring(0, outPath.lastIndexOf("/"))
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    if (!existsSync(outPath)) {
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toFile(outPath)
      console.log(`  Created: ${outPath.split("/").pop()}`)
    }
  }
}

console.log("\n✅ DONE!")
