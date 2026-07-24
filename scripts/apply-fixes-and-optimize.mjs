import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import sharp from "sharp"

// User-provided list: title substring -> correct image path
const fixes = {
  "Piala Resin untuk Pemerintahan Kalimantan Utara": "/images/produk-unggulan/piala-golf/piala-golf-4.png",
  "biaya-pembuatan-plakat-custom": "/images/plakat-akrilik/plakat-akrilik-23.png",
  "Media Karya dalam Dunia Plakat dan Souvenir Custom": "/images/plakat-akrilik/plakat-akrilik-51.png",
  "Piala Resin untuk Kampus Gorontalo: Tren Terkini": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-10.png",
  "Plakat Kayu untuk Komunitas Kepulauan Bangka Belitung": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-58.png",
  "Samir Wisuda untuk Pemerintahan Lengkap": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png",
  "Plakat Akrilik untuk Komunitas Papua Pegunungan Lengkap": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-14.png",
  "Menghitung Value Nama Dada Custom untuk Pengadaan": "/images/produk-unggulan/name-tag/name-tag-18.png",
  "Papan Nama Dada Custom": "/images/produk-unggulan/name-tag/name-tag-15.png",
  "Kalung Wisuda Custom Berkualitas Tinggi dari Yogyakarta": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-3.png",
  "Produsen Mendali Wisuda Custom Berkualitas - Karyamedia": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png",
  "Gordon Wisuda Custom Terbaik untuk Kampus & Instansi": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-28.png",
  "Medali Kelulusan Custom: Mitos vs Fakta & Panduan Lengkap": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-5.png",
  "Souvenir untuk Acara Reuni: Pilihan Hemat & Berkelas": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-88.png",
  "Tongkat Rektor Kayu Jati Custom untuk Pelantikan Rektor": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-2.png",
  "Prasasti Batas Wilayah Kabupaten: Solusi Resmi untuk -": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (10).png",
  "Toko Souvenir Terdekat untuk Instansi & Event di Yogyakarta": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-75.png",
  "Panduan Lengkap Souvenir Pernikahan Custom": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-3.png",
  "Kenapa Souvenir Custom Tidak Bisa Langsung Ada Pricelist?": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-9.png",
  "Plakat Akrilik untuk Pemerintahan Kepulauan Bangka Belitung": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-40.png",
  "Plakat Penghargaan untuk Pemerintahan Jawa Timur": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-65.png",
  "Plakat Akrilik untuk Kampus Jawa Barat - Karyamedia": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-83.png",
  "Ide Souvenir Pernikahan yang Unik dan Berkesan untuk Tamu…": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-4.png",
  "Ide Souvenir Wisuda Tahfidz dan Santri Pondok Pesantren": "/images/produk-unggulan/plakat-marmer/plakat-marmer-42.png",
}

// Helper to slugify a title (simplistic)
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Read current and committed versions
let current = readFileSync("src/data/articles.ts", "utf8")
let committed
try {
  committed = readFileSync(".git/HEAD", "utf8").trim().startsWith('ref: ')
    ? readFileSync(".git/" + readFileSync(".git/HEAD", "utf8").trim().split(' ')[1], "utf8")
    : readFileSync(".git/HEAD", "utf8")
} catch {
  // fallback to using git show
  const { execSync } = require("child_process")
  committed = execSync("git show HEAD:src/data/articles.ts", { encoding: "utf8" })
}

// Parse articles from a source text
function parseArticles(source) {
  const articles = []
  // Match each article object: starts with { after whitespace/newline, ends with } followed by comma or end of array
  // Simpler: find all occurrences of 'slug:' then extract the object
  const lines = source.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim().startsWith('slug:')) {
      // Found start of an article, find the matching closing brace
      let braceCount = 0
      let start = i
      // Go back to find the opening brace of this article
      let j = i
      while (j >= 0 && !(lines[j].trim() === '{' && braceCount === 0)) {
        if (lines[j].trim() === '}') braceCount++
        if (lines[j].trim() === '{') braceCount--
        j--
      }
      start = j + 1 // index of the opening brace line
      braceCount = 0
      let k = start
      let articleLines = []
      while (k < lines.length) {
        const l = lines[k]
        articleLines.push(l)
        if (l.trim() === '{') braceCount++
        if (l.trim() === '}') braceCount--
        if (braceCount === 0 && l.trim() === '}') {
          // finished this article
          break
        }
        k++
      }
      const articleText = articleLines.join('\n')
      articles.push({ text: articleText, startLine: start, endLine: k })
      i = k + 1
    } else {
      i++
    }
  }
  return articles
}

// We'll instead do a simpler regex approach: find each article block between { and } that contains slug:
const articleRegex = /\{\s*\n\s+slug: "[^"]+"[\s\S]*?\n\s*\}/g
const committedArticles = []
let match
while ((match = articleRegex.exec(committed)) !== null) {
  committedArticles.push(match[0])
}
console.log(`Found ${committedArticles.length} articles in committed version`)

// Build a map from slug to article text (from committed)
const slugToArticle = {}
for (const art of committedArticles) {
  const slugMatch = art.match(/slug: "([^"]+)"/)
  if (slugMatch) {
    slugToArticle[slugMatch[1]] = art
  }
}

// Process each fix
let updatedCurrent = current
let updatedCount = 0
let addedCount = 0
for (const [titleSubstr, correctImage] of Object.entries(fixes)) {
  // Find article in committed that contains this title substring
  let found = null
  for (const art of committedArticles) {
    if (art.includes(titleSubstr)) {
      found = art
      break
    }
  }
  if (!found) {
    console.log(`❌ Not found in committed: "${titleSubstr}"`)
    continue
  }
  // Get slug from this article
  const slugMatch = found.match(/slug: "([^"]+)"/)
  if (!slugMatch) {
    console.log(`❌ No slug in article for "${titleSubstr}"`)
    continue
  }
  const slug = slugMatch[1]
  // Update image in the article
  let fixedArt = found.replace(/image: "[^"]+"/, `image: "${correctImage}"`)
  // Check if slug exists in current
  if (current.includes(`slug: "${slug}"`)) {
    // Replace the article in current
    // We'll replace the whole article block for this slug
    const currentArticleRegex = new RegExp(`\\{\\s*\\n\\s*slug: "${slug}"[\\s\\S]*?\\n\\s*\\}`, 'g')
    updatedCurrent = updatedCurrent.replace(currentArticleRegex, fixedArt)
    console.log(`✅ Updated image for slug: ${slug}`)
    updatedCount++
  } else {
    // Insert new article before the closing ]
    const insertPos = updatedCurrent.lastIndexOf(']')
    if (insertPos >= 0) {
      updatedCurrent = updatedCurrent.slice(0, insertPos) + '\n  ' + fixedArt.trim() + ',\n' + updatedCurrent.slice(insertPos)
      console.log(`➕ Added new article: ${slug}`)
      addedCount++
    } else {
      console.log(`❌ Could not find insertion point in current file`)
    }
  }
}

// Write back
writeFileSync("src/data/articles.ts", updatedCurrent)
console.log(`\nProcessed: ${updatedCount} updated, ${addedCount} added`)

// Now optimize images: ensure WebP 420 exists for all images referenced in the current file
const imageMatches = updatedCurrent.match(/image: "[^"]+"/g)
const images = new Set()
if (imageMatches) {
  for (const m of imageMatches) {
    const img = m.slice(8, -1)
    images.add(img)
  }
}
console.log(`\nFound ${images.size} unique image references in current file`)

const targetWidth = 420
let optimized = 0
for (const img of images) {
  const src = `public${img}`
  if (!existsSync(src)) {
    console.log(`❌ Source not found: ${src}`)
    continue
  }
  const pathWithoutLeading = img.startsWith('/') ? img.slice(1) : img
  const base = pathWithoutLeading.replace(/\.[^.]+$/, '')
  const outDir = `public/images/opt/${base.split('/').slice(0, -1).join('/')}`
  const outFile = `public/images/opt/${base}-w${targetWidth}.webp`
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }
  if (!existsSync(outFile)) {
    try {
      await sharp(src)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toFile(outFile)
      console.log(`  ✅ ${outFile.split('/').pop()}`)
      optimized++
    } catch (e) {
      console.log(`  ❌ Failed to process ${src}: ${e.message}`)
    }
  }
}
console.log(`\nOptimization complete. Created ${optimized} WebP images at width ${targetWidth}.`)