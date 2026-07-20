import sharp from "sharp"

const path = "H:/karyamedia-web/public/images/produk-unggulan/plakat-akrilik/plakat-akrilik-2.png"

async function analyze() {
  const stats = await sharp(path).stats()
  console.log("=== Stats ===")
  console.log(JSON.stringify(stats, null, 2))

  const meta = await sharp(path).metadata()
  console.log("\n=== Metadata ===")
  console.log(JSON.stringify(meta, null, 2))

  const pixels = await sharp(path).resize(15, 20, { fit: "fill" }).raw().toBuffer()
  const w = 15, h = 20
  let rSum = 0, gSum = 0, bSum = 0
  const colors = {}

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]
      rSum += r; gSum += g; bSum += b
      const key = Math.round(r / 64) + "," + Math.round(g / 64) + "," + Math.round(b / 64)
      colors[key] = (colors[key] || 0) + 1
    }
  }

  const n = w * h
  console.log("\nAvg RGB:", Math.round(rSum / n), Math.round(gSum / n), Math.round(bSum / n))

  const sorted = Object.entries(colors).sort((a, b) => b[1] - a[1])
  console.log("\n=== Color Distribution ===")
  for (const [k, v] of sorted.slice(0, 8)) {
    const parts = k.split(",").map(Number)
    console.log("  RGB~(" + (parts[0] * 64) + "," + (parts[1] * 64) + "," + (parts[2] * 64) + ") " + Math.round(v / n * 100) + "%")
  }

  // edge detection — how sharp are the edges?
  const edgePixels = await sharp(path)
    .resize(300, 400)
    .convolve({
      width: 3, height: 3,
      kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
      scale: 1, offset: 128
    })
    .raw()
    .toBuffer()

  let edgeSum = 0
  for (let i = 0; i < edgePixels.length; i += 3) {
    edgeSum += (edgePixels[i] + edgePixels[i + 1] + edgePixels[i + 2]) / 3
  }
  const edgeAvg = edgeSum / (edgePixels.length / 3)
  console.log("\nEdge sharpness (avg deviation from 128):", Math.abs(edgeAvg - 128).toFixed(2))
  console.log("Interpretation: >25 = very sharp, 15-25 = sharp, <15 = soft")
}

analyze().catch((e) => console.log("Error:", e.message))
