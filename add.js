const fs = require("fs")
const path = require("path")

const file = "src/data/articles.ts"
const src = fs.readFileSync(file, "utf8")

let article = fs.readFileSync("article.txt", "utf8").trim()
// Bersihkan markdown wrapper
article = article.replace(/^```[\s\S]*?\n/, "").replace(/\n```$/, "").trim()

if (!article.startsWith("{")) {
  console.log("Format tidak valid. article.txt harus berisi objek { ... }")
  process.exit(1)
}

// Bersihkan trailing comma
article = article.replace(/,\s*$/, "")

// Ambil slug
const slugMatch = article.match(/slug:\s*"([^"]+)"/)
const slug = slugMatch ? slugMatch[1] : ""

// Cek duplikat slug
if (slug && src.includes(`slug: "${slug}"`)) {
  console.log("SLUG SUDAH ADA — Artikel tidak ditambahkan. Ganti slug-nya.")
  process.exit(0)
}

// === Perbaiki path gambar ===
const imageMatch = article.match(/image:\s*"([^"]+)"/)
if (imageMatch) {
  const currentPath = imageMatch[1]

  // Scan semua folder produk
  const produkDir = path.join(__dirname, "public", "images", "produk-unggulan")
  const folders = fs.readdirSync(produkDir).filter(f =>
    fs.statSync(path.join(produkDir, f)).isDirectory()
  )

  // Alias: folder yg namanya beda dari potongan slug artikel
  const aliasMap = {
    "samir-gordon-wisuda": "samir-wisuda",
    "pedel-tongkat-rektor": "tongkat-rektor",
    "plakat-kayu-premium": "plakat-kayu-eksklusif",
    "box-custom": "box-bludru",
    "brass-table": "plakat-batas-wilayah",
    "center-point": "plakat-batas-wilayah",
    "batas-wilayah": "plakat-batas-wilayah",
  }
  let slugNorm = slug.toLowerCase()
  for (const [key, val] of Object.entries(aliasMap)) {
    if (slugNorm.includes(key)) slugNorm = slugNorm.replace(key, val)
  }

  // Cari folder terbaik: nama folder yg MUNCUL UTUH di slug (prioritas),
  // pilih yg TERPANJANG agar plakat-kayu-eksklusif menang atas plakat-kayu
  let bestFolder = ""
  let bestLen = 0
  for (const f of folders) {
    const fl = f.toLowerCase()
    if (slugNorm.includes(fl) && fl.length > bestLen) {
      bestLen = fl.length
      bestFolder = f
    }
  }
  // Fallback: cocokkan per-kata bila tidak ada yg utuh
  if (!bestFolder) {
    const slugWords = slugNorm.replace(/-/g, " ").split(" ")
    let bestScore = 0
    for (const f of folders) {
      const fParts = f.replace(/-/g, " ").toLowerCase().split(" ")
      const score = fParts.reduce((s, p) => s + (slugWords.includes(p) ? 1 : 0), 0)
      if (score > bestScore) { bestScore = score; bestFolder = f }
    }
  }

  // Ambil semua gambar yang sudah dipakai artikel lain
  const usedImages = new Set()
  const allImg = src.match(/image:\s*"\/images\/produk-unggulan\/[^/]+\/([^"]+)"/g)
  if (allImg) allImg.forEach(m => {
    const f = m.match(/\/([^/"]+\.\w+)"/)
    if (f) usedImages.add(f[1])
  })

  // Folder target = folder terbaik (tanpa override yg mengunci folder lama)
  const targetFolder = bestFolder || folders.find(f => currentPath.includes(f)) || folders[0]
  const folderPath = path.join(produkDir, targetFolder)

  if (fs.existsSync(folderPath)) {
    // Rename file ChatGPT → nama rapi
    let files = fs.readdirSync(folderPath).filter(f => /\.(png|jpg|jpeg)$/i.test(f)).sort()
    files.forEach((f, i) => {
      if (/^ChatGPT Image/i.test(f)) {
        const ext = path.extname(f)
        const newName = targetFolder + "-" + (i + 1) + ext
        fs.renameSync(path.join(folderPath, f), path.join(folderPath, newName))
      }
    })
    // Baca ulang setelah rename
    files = fs.readdirSync(folderPath).filter(f => /\.(png|jpg|jpeg)$/i.test(f)).sort()
    // Pilih yang belum dipakai (selalu jalan)
    let unused = files.filter(f => !usedImages.has(f))
    if (unused.length === 0) unused = files
    const chosen = unused[Math.floor(Math.random() * unused.length)]
    const newPath = `/images/produk-unggulan/${targetFolder}/${chosen}`
    if (newPath !== currentPath) {
      article = article.replace(currentPath, newPath)
      console.log("Gambar: " + newPath)
    }
  }
}

// Tambahkan ke array
const idx = src.lastIndexOf("\n]")
const result = src.slice(0, idx) + "\n  " + article + ",\n" + src.slice(idx + 1)
fs.writeFileSync(file, result)

console.log("Artikel berhasil ditambahkan!")
console.log("Build...")
try {
  require("child_process").execSync("npm run build", { cwd: __dirname, stdio: "inherit" })
  console.log("BUILD SUKSES!")
} catch (e) {
  console.log("Build gagal, tapi artikel sudah tersimpan.")
  console.log("Jalankan 'npm run build' manual untuk lihat error detail.")
}