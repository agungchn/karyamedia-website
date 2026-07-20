import { writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const API_KEY = process.env.AI_IMAGE_KEY
const BASE = "https://dashscope-intl.aliyuncs.com/api/v1"

if (!API_KEY) {
  console.error("ERROR: set AI_IMAGE_KEY=your_api_key")
  process.exit(1)
}

async function generateImage(prompt, outputPath) {
  const res = await fetch(`${BASE}/services/aigc/multimodal-generation/generation`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen-image-2.0-pro",
      input: {
        messages: [
          {
            role: "user",
            content: [{ text: prompt }],
          },
        ],
      },
      parameters: {
        prompt_extend: true,
        watermark: false,
        size: "1024*1024",
        n: 1,
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text}`)
  }

  const json = await res.json()
  console.log("Response:", JSON.stringify(json, null, 2))

  const content = json.output?.choices?.[0]?.message?.content
  if (content) {
    for (const item of content) {
      if (item.image) {
        const imgRes = await fetch(item.image)
        if (!imgRes.ok) throw new Error(`download gagal: ${imgRes.status}`)
        const buf = Buffer.from(await imgRes.arrayBuffer())
        writeFileSync(outputPath, buf)
        console.log(`OK -> ${outputPath}`)
      }
    }
  } else if (json.output?.results?.[0]?.url) {
    const imgRes = await fetch(json.output.results[0].url)
    if (!imgRes.ok) throw new Error(`download gagal: ${imgRes.status}`)
    const buf = Buffer.from(await imgRes.arrayBuffer())
    writeFileSync(outputPath, buf)
    console.log(`OK -> ${outputPath}`)
  }
}

const output = join(__dirname, "..", "..", "test-ai-image-output.png")
const prompt = "Plakat akrilik bening premium dengan ukiran logo emas, diletakkan di atas meja kayu minimalis, pencahayaan studio softbox, fotografi produk katalog e-commerce, depth of field, sharp details, 8k, realistic, tidak ada tulisan atau teks pada plakat"

generateImage(prompt, output).catch((e) => {
  console.error("Gagal:", e)
  process.exit(1)
})
