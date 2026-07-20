import sharp from "sharp"
import { readFileSync, existsSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "..", "..")
const productsPath = join(root, "src/data/products.json")
const outputDir = join(root, "public/social-content")

const W = 720
const H = 1280

const products = JSON.parse(readFileSync(productsPath, "utf-8"))

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function wrapText(text, maxLen) {
  maxLen = maxLen || 30
  const words = text.split(" ")
  const lines = []
  let cur = ""
  for (const w of words) {
    if ((cur + w).length > maxLen) { lines.push(cur.trim()); cur = "" }
    cur += w + " "
  }
  if (cur.trim()) lines.push(cur.trim())
  return lines
}

async function generate() {
  const p = pick(products)
  const name = p.name || "Produk Custom"
  const lines = wrapText(name, 28)

  const imgPath = p.images?.[0]
    ? join(root, "public", p.images[0].replace(/^\//, ""))
    : null
  let imgBuffer = null
  if (imgPath && existsSync(imgPath)) {
    imgBuffer = await sharp(imgPath).resize(520, 520, { fit: "contain" }).toBuffer()
  }

  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

  const imgData = imgBuffer ? imgBuffer.toString("base64") : null

  const svgText = `
    <svg width="${W}" height="${H}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000030"/>
          <stop offset="100%" stop-color="#002878"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bg)" rx="0"/>
      <text x="${W/2}" y="160" text-anchor="middle" font-family="sans-serif" font-size="42" font-weight="bold" fill="#FFE9A8">Karyamedia Souvenir</text>
      <text x="${W/2}" y="220" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#ffffff" opacity="0.7">Jogja</text>

      ${imgData ? `<image x="${(W-520)/2}" y="290" width="520" height="520" href="data:image/webp;base64,${imgData}"/>` : `<rect x="${(W-400)/2}" y="330" width="400" height="400" fill="#ffffff" opacity="0.1" rx="20"/><text x="${W/2}" y="560" text-anchor="middle" font-size="28" fill="#aaa">${p.categoryId || "souvenir"}</text>`}

      ${lines.map(function(l, i) { return `<text x="${W/2}" y="${imgData ? 900 : 870 + i * 50}" text-anchor="middle" font-family="sans-serif" font-size="${lines.length > 2 ? 32 : 38}" font-weight="bold" fill="#ffffff">${l.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>` }).join("")}

      <text x="${W/2}" y="${imgData ? 970 : 970 + Math.max(0, lines.length - 1) * 10}" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#D4AF37">Custom sesuai kebutuhan Anda</text>

      <rect x="${W/2 - 160}" y="${imgData ? 1030 : 1040}" width="320" height="50" rx="25" fill="#075E54"/>
      <text x="${W/2}" y="${imgData ? 1062 : 1072}" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff">Pesan via WhatsApp</text>
    </svg>
  `

  const outPath = join(outputDir, "tiktok-" + (p.slug || p.id || Date.now()) + ".webp")
  await sharp(Buffer.from(svgText))
    .resize(W, H)
    .webp({ quality: 85 })
    .toFile(outPath)

  console.log("[generate] " + outPath)
  console.log("  Produk: " + name)
  console.log("  WhatsApp: 0822 4358 0777")
}

generate().catch(console.error)
