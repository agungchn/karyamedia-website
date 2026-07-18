// Google Trends keyword discovery for Karyamedia.
// Fetches related + rising queries for seed product keywords,
// filters out already-covered topics, and passes data-backed
// suggestions to the LLM for final brainstorming.
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

// ---- Seed keywords (product categories Karyamedia jual) ----
const SEEDS = [
  "plakat akrilik",
  "plakat kayu",
  "plakat marmer",
  "plakat fiberglass",
  "plakat wayang",
  "medali custom",
  "medali 3d",
  "piala trophy",
  "piala golf",
  "souvenir wisuda",
  "samir wisuda",
  "patung wisuda",
  "kalung rektor",
  "tongkat rektor",
  "baju toga",
  "map ijazah",
  "tabung wisuda",
  "gift box souvenir",
  "box bludru",
  "box batik",
  "name tag",
  "pin bross",
  "gantungan kunci",
  "tumbler souvenir",
  "papan nama",
  "prasasti marmer",
  "prasasti kuningan",
  "brass table",
  "center point batas wilayah",
  "souvenir pernikahan",
  "souvenir acara",
  "souvenir seminar",
]

// ---- Helper: load existing article slugs ----
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

// ---- Google Trends: related queries for a keyword ----
async function fetchRelated(keyword) {
  try {
    const res = await googleTrends.relatedQueries({
      keyword,
      startTime: new Date("2025-01-01"),
      geo: "ID",
    })
    const data = JSON.parse(res)
    const ranked = data.default?.rankedList
    if (!ranked) return { top: [], rising: [] }

    const top = (ranked[0]?.rankedKeyword || []).map((i) => ({
      query: i.query,
      value: i.value,
      type: "top",
    }))
    const rising = (ranked[1]?.rankedKeyword || []).map((i) => ({
      query: i.query,
      value: i.value,
      type: "rising",
    }))
    return { top, rising }
  } catch {
    return { top: [], rising: [] }
  }
}

// ---- Slugify ----
function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ---- Stopwords / irrelevant filters ----
const STOP_QUERY = new Set([
  // selebriti, public figure (trending irrelevant)
  "el rumi", "syifa hadju", "luna maya", "amanda manopo", "raffi ahmad",
  "nagita slavina", "attahalil", "aurak", "thariq", "aqilla",
  // brand luar / non-produsen
  "disney", "marvel", "star wars", "hello kitty",
  // DIY / tutorial (bukan pesan ke produsen)
  "cara membuat", "tutorial", "how to",
])

function isRelevant(query) {
  const q = query.toLowerCase()
  for (const stop of STOP_QUERY) if (q.includes(stop)) return false
  return true
}

// ---- Score query for article-worthiness ----
// Higher = better: prefers unique topics not yet covered
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
  const uniqueTokens = tokens.size - overlap
  return uniqueTokens
}

async function main() {
  const args = process.argv.slice(2)
  const generateNext = args.includes("--generate-next")
    ? parseInt(args[args.indexOf("--generate-next") + 1], 10) || 3
    : 0

  console.error("Memuat artikel existing...")
  const existingSlugs = loadExistingSlugs()
  console.error(`  ${existingSlugs.size} slug ditemukan.`)

  // Fetch related queries from ALL seeds (parallel)
  console.error(`\nMengambil data Google Trends untuk ${SEEDS.length} seed keyword...`)
  const results = await Promise.all(
    SEEDS.map(async (seed) => {
      const r = await fetchRelated(seed)
      return { seed, ...r }
    })
  )

  // Collect & deduplicate all queries
  const seen = new Set()
  const candidates = []
  for (const { seed, top, rising } of results) {
    for (const q of [...top, ...rising]) {
      const key = q.query.toLowerCase().trim()
      if (seen.has(key)) continue
      seen.add(key)

      const slug = slugify(q.query)
      // Skip if slug already exists
      if (existingSlugs.has(slug) || existingSlugs.has(slug + "-custom")) continue
      // Skip generic/broad queries
      if (key.length < 8 || key.split(" ").length < 2) continue
      // Skip irrelevant (selebriti, brand luar, DIY tutorial)
      if (!isRelevant(key)) continue

      const score = scoreQuery(q.query, existingSlugs)
      candidates.push({
        query: q.query,
        slug,
        value: q.value,
        type: q.type,
        seed,
        score,
        trend: q.type === "rising" ? "📈" : "📊",
      })
    }
  }

  // Sort by score (novelty) first, then by Trends value (popularity)
  candidates.sort((a, b) => b.score - a.score || b.value - a.value)

  // Print top candidates
  console.error("\n=== GOOGLE TRENDS KEYWORD CANDIDATES ===\n")
  console.error(`${"QUERY".padEnd(55)} ${"VALUE".padEnd(6)} ${"SEED".padEnd(22)} ${"SCORE"}`)
  console.error("─".repeat(95))
  for (const c of candidates.slice(0, 30)) {
    console.error(
      `${c.trend} ${c.query.padEnd(50)} ${String(c.value).padEnd(5)} ${c.seed.padEnd(20)} ${c.score}`
    )
  }

  // Print JSON for pipe / AI consumption
  const topCandidates = candidates.slice(0, 15)
  console.log("\n" + JSON.stringify(topCandidates, null, 2))

  // ---- LLM Brainstorming ----
  if (generateNext > 0 && topCandidates.length) {
    console.error("\n--- LLM Brainstorming dari data Trends ---")

    const alibabaTxt = readFileSync(join(root, "scripts/llm/alibaba cloude.txt"), "utf8")
    const key = alibabaTxt.match(/api key\s+(\S+)/i)?.[1]
    const url = alibabaTxt.match(/OpenAI Compatible Endpoint\s+(\S+)/)?.[1] ||
      "https://ws-tcg785c7rcx4lc75.eu-central-1.maas.aliyuncs.com/compatible-mode/v1"

    const trendData = topCandidates.slice(0, 10).map((c) =>
      `- "${c.query}" (popularitas: ${c.value}/100, sumber: ${c.seed})`
    ).join("\n")

    const prompt = `Anda ahli strategi konten SEO Karyamedia.com.

DATA DARI GOOGLE TRENDS (query nyata yang dicari orang Indonesia):
${trendData}

TUGAS: Pilih ${generateNext} query PALING MENARIK dari daftar di atas untuk dijadikan artikel.

Kriteria:
- Prioritas query yang BELUM ADA artikelnya (cek slug sudah aman)
- Spesifik, bukan broad topic
- Bisa dikaitkan dengan produk Karyamedia (plakat, medali, piala, dll)
- Punya angle unik untuk dikembangkan

Untuk setiap query, tentukan kategori yang TEPAT dari daftar berikut:
- "Plakat" (plakat akrilik, kayu, marmer, fiberglass, wayang)
- "Medali" (medali custom, medali 3D)
- "Piala & Trophy" (piala trophy, piala golf)
- "Souvenir Wisuda" (samir, patung wisuda, kalung rektor, tongkat rektor, toga, map ijazah, tabung wisuda)
- "Gift Box" (box bludru, box batik, box kertas, box custom)
- "Accessories" (name tag, pin/bross, gantungan kunci, tumbler, papan nama)
- "Prasasti" (prasasti marmer, kuningan, stainless steel)
- "Batas Wilayah" (brass table, center point)
- "Souvenir" (souvenir pernikahan, souvenir acara, merchandise)
- "Blog" (jika tidak cocok dengan kategori di atas)

Kembalikan JSON array dengan format:
[{ "keyword": "...", "category": "kategori dari daftar di atas", "slug": "...", "reason": "..." }]
HANYA JSON array.

    const res = await fetch(url + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
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

    // Auto-generate articles
    try {
      const picks = JSON.parse(text)
      if (Array.isArray(picks)) {
        for (const pick of picks.slice(0, generateNext)) {
          const kw = pick.keyword
          const cat = pick.category || "Blog"
          console.error(`\n⏳ Generate: "${kw}" (${cat})...`)
          try {
            execSync(`node scripts/seo/article-generate.mjs "${kw}" --category "${cat}"`, {
              cwd: root,
              stdio: "inherit",
              timeout: 180000,
            })
          } catch (e) {
            console.error(`⚠️  Artikel "${kw}" gagal generate: ${e.message}. Lanjut ke berikutnya.`)
          }
        }
      }
    } catch (e) {
      console.error("Gagal parse JSON dari LLM.")
    }
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})
