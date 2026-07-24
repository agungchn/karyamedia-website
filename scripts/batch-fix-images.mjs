import { readFileSync, writeFileSync, existsSync } from "fs"
import sharp from "sharp"
import { execSync } from "child_process"

let c = readFileSync("src/data/articles.ts", "utf8")

// Mapping: article title/substring -> correct image
const fixes = [
  { title: "Piala Resin untuk Pemerintahan Kalimantan Utara", img: "/images/produk-unggulan/piala-golf/piala-golf-4.png" },
  { title: "biaya-pembuatan-plakat-custom", img: "/images/plakat-akrilik/plakat-akrilik-23.png" },
  { title: "Media Karya dalam Dunia Plakat dan Souvenir Custom", img: "/images/plakat-akrilik/plakat-akrilik-51.png" },
  { title: "Piala Resin untuk Kampus Gorontalo: Tren Terkini", img: "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-10.png" },
  { title: "Plakat Kayu untuk Komunitas Kepulauan Bangka Belitung", img: "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-58.png" },
  { title: "Samir Wisuda untuk Pemerintahan Lengkap", img: "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png" },
  { title: "Plakat Akrilik untuk Komunitas Papua Pegunungan Lengkap", img: "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-14.png" },
  { title: "Menghitung Value Nama Dada Custom untuk Pengadaan", img: "/images/produk-unggulan/name-tag/name-tag-18.png" },
  { title: "Papan Nama Dada Custom", img: "/images/produk-unggulan/name-tag/name-tag-15.png" },
  { title: "Kalung Wisuda Custom Berkualitas Tinggi dari Yogyakarta", img: "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-3.png" },
  { title: "Produsen Mendali Wisuda Custom Berkualitas", img: "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png" },
  { title: "Gordon Wisuda Custom Terbaik untuk Kampus & Instansi", img: "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-28.png" },
  { title: "Medali Kelulusan Custom: Mitos vs Fakta", img: "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-5.png" },
  { title: "Souvenir untuk Acara Reuni", img: "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-88.png" },
  { title: "Tongkat Rektor Kayu Jati Custom", img: "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-2.png" },
  { title: "Prasasti Batas Wilayah Kabupaten", img: "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable%20(10).png" },
  { title: "Toko Souvenir Terdekat untuk Instansi", img: "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-75.png" },
  { title: "Panduan Lengkap Souvenir Pernikahan Custom", img: "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-3.png" },
  { title: "Kenapa Souvenir Custom Tidak Bisa Langsung Ada Pricelist", img: "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-9.png" },
  { title: "Plakat Akrilik untuk Pemerintahan Kepulauan Bangka Belitung", img: "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-40.png" },
  { title: "Plakat Penghargaan untuk Pemerintahan Jawa Timur", img: "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-65.png" },
  { title: "Plakat Akrilik untuk Kampus Jawa Barat", img: "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-83.png" },
  { title: "Ide Souvenir Pernikahan yang Unik dan Berkesan", img: "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-4.png" },
  { title: "Ide Souvenir Wisuda Tahfidz dan Santri", img: "/images/produk-unggulan/plakat-marmer/plakat-marmer-42.png" },
]

let updated = 0
let notFound = []

// Collect unique image paths for optimization
const imagePaths = new Set()

for (const fix of fixes) {
  // Try finding by slug first (for biaya-pembuatan-plakat-custom)
  let slugPattern = fix.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  
  // Check by slug directly for slug-like titles
  let idx = c.indexOf(`slug: "${slugPattern}"`)
  
  // Also try partial title match from articles data
  if (idx < 0) {
    // Search by looking for the title in articles
    const raw = execSync(`git show 0b8bdb0:src/data/articles.ts`, { encoding: "utf8" })
    // Try to find the article in the ORIGINAL data first
    const all = execSync(`git show HEAD:src/data/articles.ts 2>/dev/null || echo ""`, { encoding: "utf8" })
    // Fallback: search by title substring in current file
    const titleSearch = fix.title.split(":")[0].trim().toLowerCase()
    // Search in current file
    const lines = c.split("\n")
    for (let li = 0; li < lines.length; li++) {
      if (lines[li].includes('title:') && lines[li].toLowerCase().includes(titleSearch.slice(0, 20))) {
        // Found the title line, look for slug before it
        for (let b = li - 2; b >= 0 && b > li - 10; b--) {
          if (lines[b].includes("slug:")) {
            idx = c.indexOf(lines[b])
            break
          }
        }
        break
      }
    }
  }

  if (idx < 0) {
    notFound.push(fix.title)
    continue
  }

  // Find entry
  const entryStart = c.lastIndexOf("{", idx)
  let d = 0, i = entryStart; while (i < c.length) { if (c[i] === "{") d++; if (c[i] === "}") d--; if (d === 0) break; i++ }
  let entry = c.slice(entryStart, i + 1)
  
  const oldImg = entry.match(/image: "([^"]+)"/)
  if (oldImg && oldImg[1] !== fix.img) {
    entry = entry.replace(/image: "[^"]+"/, `image: "${fix.img}"`)
    c = c.slice(0, entryStart) + entry + c.slice(i + 1)
    updated++
    imagePaths.add(fix.img)
    console.log(`✅ ${fix.title.slice(0, 30)}... → ${fix.img.split("/").pop()}`)
  }
}

writeFileSync("src/data/articles.ts", c)
console.log(`\nUpdated ${updated} articles`)

if (notFound.length) {
  console.log(`\n❌ Not found (${notFound.length}):`)
  notFound.forEach(t => console.log(`  - ${t}`))
}

// Optimize images
console.log("\n=== OPTIMASI GAMBAR ===")
for (const img of imagePaths) {
  const src = `public${img}`
  if (!existsSync(src)) {
    console.log(`❌ File not found: ${src}`)
    continue
  }
  for (const w of [320, 480, 640, 960]) {
    const base = src.replace(/\.\w+$/, "")
    const out = `public/images/opt${img.slice(8).replace(/\.\w+$/, "")}-w${w}.webp`
    const dir = out.substring(0, out.lastIndexOf("/"))
    if (!existsSync(dir)) {
      execSync(`mkdir -p "${dir}"`, { stdio: "ignore" })
    }
    if (!existsSync(out)) {
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(out)
      console.log(`  Created ${out.split("/").pop()}`)
    }
  }
}
console.log("✅ Done!")
