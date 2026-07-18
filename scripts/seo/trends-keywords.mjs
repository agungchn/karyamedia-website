// Google Trends keyword discovery for Karyamedia.
// Fetches related + rising queries for seed product keywords,
// filters out already-covered topics, enriches with region & peak timing,
// and passes data-backed suggestions to the LLM for brainstorming.
//
// Usage:
//   node scripts/seo/trends-keywords.mjs                     # print top suggestions
//   node scripts/seo/trends-keywords.mjs --generate-next 3    # draft articles for top 3

import { execSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { resolve, join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import googleTrends from "google-trends-api"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")

const SEEDS = [
  "plakat akrilik", "plakat kayu", "plakat marmer", "plakat fiberglass", "plakat wayang",
  "medali custom", "medali 3d", "piala trophy", "piala golf",
  "souvenir wisuda", "samir wisuda", "patung wisuda", "kalung rektor", "tongkat rektor",
  "baju toga", "map ijazah", "tabung wisuda",
  "gift box souvenir", "box bludru", "box batik",
  "name tag", "pin bross", "gantungan kunci", "tumbler souvenir", "papan nama",
  "prasasti marmer", "prasasti kuningan", "brass table", "center point batas wilayah",
  "souvenir pernikahan", "souvenir acara", "souvenir seminar",
]

function loadExistingSlugs() {
  try {
    const src = readFileSync(articlesPath, "utf8")
    const slugs = new Set()
    for (const m of src.matchAll(/slug:\s*"([^"]+)"/g)) slugs.add(m[1])
    return slugs
  } catch {
    return new Set()
  }
}

async function fetchRelated(keyword) {
  try {
    const res = await googleTrends.relatedQueries({
      keyword, startTime: new Date("2025-01-01"), geo: "ID",
    })
    const data = JSON.parse(res)
    const ranked = data.default?.rankedList
    if (!ranked) return { top: [], rising: [] }
    const top = (ranked[0]?.rankedKeyword || []).map((i) => ({ query: i.query, value: i.value, type: "top" }))
    const rising = (ranked[1]?.rankedKeyword || []).map((i) => ({ query: i.query, value: i.value, type: "rising" }))
    return { top, rising }
  } catch {
    return { top: [], rising: [] }
  }
}

async function fetchRegion(keyword) {
  try {
    const res = await googleTrends.interestByRegion({
      keyword, startTime: new Date("2025-01-01"), geo: "ID", resolution: "PROVINCE",
    })
    const data = JSON.parse(res)
    return (data.default?.geoMapData || [])
      .filter((r) => r.geoName && r.value?.[0] != null)
      .sort((a, b) => (b.value?.[0] || 0) - (a.value?.[0] || 0))
      .slice(0, 5)
      .map((r) => ({ province: r.geoName, interest: r.value[0] }))
  } catch {
    return []
  }
}

async function fetchTimeline(keyword) {
  try {
    const res = await googleTrends.interestOverTime({
      keyword, startTime: new Date("2025-01-01"), geo: "ID",
    })
    const data = JSON.parse(res)
    const timeline = data.default?.timelineData || []
    if (!timeline.length) return null

    let maxVal = 0, maxTime = 0
    for (const t of timeline) {
      const v = t.value?.[0] || 0
      if (v > maxVal) { maxVal = v; maxTime = t.time }
    }
    const peakDate = new Date(maxTime * 1000)
    // Suggest publish: 1 month before peak
    const publishDate = new Date(peakDate)
    publishDate.setMonth(publishDate.getMonth() - 1)

    return {
      peakMonth: peakDate.toLocaleString("id-ID", { month: "long", year: "numeric" }),
      peakValue: maxVal,
      publishBefore: publishDate.toLocaleString("id-ID", { month: "long", year: "numeric" }),
    }
  } catch {
    return null
  }
}

function slugify(s) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

const STOP_QUERY = new Set([
  "el rumi", "syifa hadju", "luna maya", "amanda manopo", "raffi ahmad",
  "nagita slavina", "attahalil", "aurak", "thariq", "aqilla",
  "disney", "marvel", "star wars", "hello kitty",
  "cara membuat", "tutorial", "how to",
])

function isRelevant(query) {
  const q = query.toLowerCase()
  for (const stop of STOP_QUERY) if (q.includes(stop)) return false
  return true
}

function scoreQuery(query, existingSlugs) {
  const slug = slugify(query)
  const tokens = new Set(slug.split("-").filter((w) => w.length > 2))
  let overlap = 0
  for (const ex of existingSlugs) {
    const exTokens = new Set(ex.split("-"))
    let shared = 0
    for (const t of tokens) if (exTokens.has(t)) shared++
    if (shared > overlap) overlap = shared
  }
  return tokens.size - overlap
}

async function main() {
  const args = process.argv.slice(2)
  const generateNext = args.includes("--generate-next")
    ? parseInt(args[args.indexOf("--generate-next") + 1], 10) || 3
    : 0

  console.error("Memuat artikel existing...")
  const existingSlugs = loadExistingSlugs()
  console.error(`  ${existingSlugs.size} slug ditemukan.`)

  // Pass 1: related queries
  console.error(`\nMengambil relatedQueries untuk ${SEEDS.length} seed keyword...`)
  const results = await Promise.all(SEEDS.map(async (seed) => {
    const r = await fetchRelated(seed)
    return { seed, ...r }
  }))

  const seen = new Set()
  const candidates = []
  for (const { seed, top, rising } of results) {
    for (const q of [...top, ...rising]) {
      const key = q.query.toLowerCase().trim()
      if (seen.has(key)) continue
      seen.add(key)
      const slug = slugify(q.query)
      if (existingSlugs.has(slug) || existingSlugs.has(slug + "-custom")) continue
      if (key.length < 8 || key.split(" ").length < 2) continue
      if (!isRelevant(key)) continue
      candidates.push({
        query: q.query, slug, value: q.value, type: q.type, seed,
        score: scoreQuery(q.query, existingSlugs),
        trend: q.type === "rising" ? "📈" : "📊",
      })
    }
  }
  candidates.sort((a, b) => b.score - a.score || b.value - a.value)
  const topCandidates = candidates.slice(0, 15)

  // Pass 2: enrich top candidates with region + peak timing
  console.error(`\nMemperkaya ${topCandidates.length} kandidat dengan data region & timeline...`)
  for (const c of topCandidates) {
    console.error(`  ${c.query}...`)
    const [regions, timeline] = await Promise.all([
      fetchRegion(c.query),
      fetchTimeline(c.query),
    ])
    c.regions = regions
    c.timeline = timeline
  }

  // Display
  console.error("\n" + "=".repeat(120))
  console.error("GOOGLE TRENDS — KEYWORD CANDIDATES + REGION + PEAK TIMING")
  console.error("=".repeat(120))
  for (const c of topCandidates) {
    const regionStr = c.regions?.length
      ? c.regions.slice(0, 3).map((r) => `${r.province}(${r.interest})`).join(", ")
      : "-"
    const timeStr = c.timeline
      ? `Puncak ${c.timeline.peakMonth} | Publikasi ideal: ${c.timeline.publishBefore}`
      : "-"
    console.error(`\n${c.trend} ${c.query}`)
    console.error(`   Value: ${c.value}/100  |  Seed: ${c.seed}  |  Score: ${c.score}`)
    console.error(`   Region: ${regionStr}`)
    console.error(`   Timing: ${timeStr}`)
  }

  // JSON output
  console.log("\n" + JSON.stringify(topCandidates, null, 2))

  // ---- LLM Brainstorming + Auto-generate ----
  if (generateNext > 0 && topCandidates.length) {
    console.error("\n--- LLM Brainstorming dari data Trends ---")

    const alibabaTxt = readFileSync(join(root, "scripts/llm/alibaba cloude.txt"), "utf8")
    const alibabaKey = alibabaTxt.match(/api key\s+(\S+)/i)?.[1]
    const alibabaUrl = alibabaTxt.match(/OpenAI Compatible Endpoint\s+(\S+)/)?.[1] ||
      "https://ws-tcg785c7rcx4lc75.eu-central-1.maas.aliyuncs.com/compatible-mode/v1"

    const trendData = topCandidates.map((c) => {
      const regionStr = c.regions?.length
        ? c.regions.slice(0, 3).map((r) => `${r.province}`).join(", ")
        : "seluruh Indonesia"
      const timeAdvice = c.timeline
        ? `Publikasikan artikel SEBELUM ${c.timeline.publishBefore} (puncak pencarian ${c.timeline.peakMonth})`
        : "Tidak ada data timeline spesifik"
      return `- "${c.query}" (popularitas: ${c.value}/100)
   Target wilayah: ${regionStr}
   ${timeAdvice}`
    }).join("\n\n")

    const prompt = `Anda ahli strategi konten SEO Karyamedia.com (produsen souvenir Yogyakarta sejak 2001).

DATA DARI GOOGLE TRENDS (query nyata yang dicari orang Indonesia — lengkap dengan wilayah & waktu puncak):
${trendData}

TUGAS: Pilih ${generateNext} query PALING MENARIK dari daftar di atas untuk dijadikan artikel.

STRATEGI:
- Publikasikan artikel SEKARANG (Juli 2026) agar terindeks sebelum puncak pencarian
- Gunakan data WILAYAH untuk menentukan angle artikel: mis. "Kebutuhan di ${region}" jika region spesifik
- Pilih query yang belum ada artikelnya (slug aman) dan spesifik

Untuk setiap query, tentukan kategori yang TEPAT:
- "Plakat" | "Medali" | "Piala & Trophy" | "Souvenir Wisuda" | "Gift Box"
- "Accessories" | "Prasasti" | "Batas Wilayah" | "Souvenir" | "Blog"

Kembalikan JSON array:
[{ "keyword": "...", "category": "...", "slug": "...", "reason": "jelaskan angle + region target + timing" }]
HANYA JSON array.`

    const res = await fetch(alibabaUrl + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + alibabaKey },
      body: JSON.stringify({
        model: "qwen-plus",
        messages: [
          { role: "system", content: "Kembalikan HANYA JSON array valid, tanpa teks lain." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(60000),
    })

    const j = await res.json()
    const text = j.choices?.[0]?.message?.content
    console.log("\n" + text)

    try {
      const picks = JSON.parse(text)
      if (Array.isArray(picks)) {
        for (const pick of picks.slice(0, generateNext)) {
          const kw = pick.keyword
          const cat = pick.category || "Blog"
          console.error(`\n⏳ Generate: "${kw}" (${cat})...`)
          try {
            execSync(`node scripts/seo/article-generate.mjs "${kw}" --category "${cat}"`, {
              cwd: root, stdio: "inherit", timeout: 180000,
            })
          } catch (e) {
            console.error(`⚠️  "${kw}" gagal: ${e.message}`)
          }
        }
      }
    } catch {
      console.error("Gagal parse JSON dari LLM.")
    }
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})
