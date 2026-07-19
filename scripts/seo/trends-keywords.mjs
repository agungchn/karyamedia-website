// Google Trends keyword discovery for Karyamedia.
// Fetches related + rising queries for seed product keywords,
// filters out already-covered topics, enriches with region & peak timing,
// and passes data-backed suggestions to the LLM for brainstorming.
//
// Usage:
//   node scripts/seo/trends-keywords.mjs                     # print top suggestions
//   node scripts/seo/trends-keywords.mjs --generate-next 3    # draft articles for top 3

import { execSync } from "node:child_process"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { resolve, join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import googleTrends from "google-trends-api"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")

const SEEDS = [
  "plakat akrilik", "medali custom", "piala trophy",
  "souvenir wisuda", "nama dada", "gantungan kunci",
  "souvenir pernikahan", "prasasti",
]

// 3 detik antar request biar tidak kena rate limit
const SLEEP_MS = 3000
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

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
  for (let attempt = 0; attempt < 3; attempt++) {
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
      if (attempt < 2) {
        console.error(`  ⏳ ${keyword} gagal, coba lagi ${attempt + 2}/3...`)
        await sleep(5000)
      }
    }
  }
  return { top: [], rising: [] }
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
  "prasasti kerajaan", "prasasti peninggalan", "prasasti mulawarman",
  "prasasti mataram", "prasasti tarumanegara", "prasasti kutai",
  "prasasti sriwijaya", "kerajaan mataram kuno", "peninggalan kerajaan",
  "prasasti kebon kopi", "prasasti kedukan bukit", "prasasti talang tuo",
  "prasasti kota kapur", "prasasti pasir awi", "prasasti tts",
  "prasasti center", "tulisan kuno pada prasasti",
  "boneka", "blind box", "pokemon",
  "kartu ucapan souvenir pernikahan", "souvenir pernikahan bermanfaat",
  "gambar gantungan kunci", "kerajaan majapahit",
  "ucapan souvenir pernikahan", "bahan gantungan kunci",
  "souvenir pernikahan murah", "membuat gantungan kunci",
  "kartu souvenir pernikahan", "tas souvenir pernikahan",
  "buat gantungan kunci", "souvenir pernikahan yang bermanfaat",
])

// "prasasti" hanya diterima jika mengandung kata produk ini
const PRASASTI_PRODUCT = [
  "marmer", "kuningan", "tembaga", "stainless", "stenlist",
  "peresmian", "gedung", "kantor", "masjid", "musala", "gereja", "pura", "vihara",
  "showroom", "monumen", "plakat", "granit", "nama", "tanda", "arah",
  "papan", "label", "plat", "tag", "logo",
]

function isRelevant(query) {
  const q = query.toLowerCase()
  for (const stop of STOP_QUERY) if (q.includes(stop)) return false
  // prasasti harus disertai kata produk, tanpa itu = sejarah
  if (q.includes("prasasti") && !PRASASTI_PRODUCT.some((w) => q.includes(w))) return false
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

  // Pass 1: related queries — SEQUENTIAL dengan delay biar tidak kena rate limit
  console.error(`\nMengambil relatedQueries untuk ${SEEDS.length} seed keyword (1 per ${SLEEP_MS / 1000}s)...`)
  const results = []
  for (let i = 0; i < SEEDS.length; i++) {
    const seed = SEEDS[i]
    console.error(`  [${i + 1}/${SEEDS.length}] ${seed}...`)
    const r = await fetchRelated(seed)
    results.push({ seed, ...r })
    if (i < SEEDS.length - 1) await sleep(SLEEP_MS)
  }

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
  let topCandidates = candidates.slice(0, 15)

  // Fallback: jika Trends tidak cukup, pakai data ideas.json (GSC+Bing)
  if (topCandidates.length < 5) {
    const ideasPath = join(root, "scripts/seo/ideas.json")
    if (existsSync(ideasPath)) {
      console.error(`\nTrends hanya menghasilkan ${topCandidates.length} kandidat. Fallback ke ideas.json...`)
      const ideas = JSON.parse(readFileSync(ideasPath, "utf8"))
      const slugSet = new Set([...existingSlugs, ...candidates.map((c) => c.slug)])
      const fallback = []
      for (const idea of ideas) {
        const q = (idea.query || "").toLowerCase().trim()
        const slug = slugify(q)
        if (slugSet.has(slug) || slugSet.has(slug + "-custom")) continue
        if (q.length < 8 || q.split(" ").length < 2) continue
        if (!isRelevant(q)) continue
        slugSet.add(slug)
        fallback.push({
          query: idea.query,
          slug,
          value: idea.impressions || 0,
          type: "ideas",
          seed: idea._category || "ideas",
          score: scoreQuery(q, existingSlugs),
          trend: "📊",
          regions: idea._province ? [{ province: idea._province, interest: 100 }] : [],
          timeline: null,
        })
        if (topCandidates.length + fallback.length >= 15) break
      }
      if (fallback.length) {
        console.error(`  ${fallback.length} kandidat tambahan dari ideas.json.`)
        topCandidates = [...topCandidates, ...fallback]
      }
    }
  }

  // Pass 2: enrich top candidates with region + peak timing (sequential)
  console.error(`\nMemperkaya ${topCandidates.length} kandidat dengan data region & timeline...`)
  for (let i = 0; i < topCandidates.length; i++) {
    const c = topCandidates[i]
    console.error(`  [${i + 1}/${topCandidates.length}] ${c.query}...`)
    const [regions, timeline] = await Promise.all([
      fetchRegion(c.query).catch(() => []),
      fetchTimeline(c.query).catch(() => null),
    ])
    c.regions = regions
    c.timeline = timeline
    if (i < topCandidates.length - 1) await sleep(SLEEP_MS)
  }

  // Display
  console.error("\n" + "=".repeat(120))
  console.error("KEYWORD CANDIDATES — Google Trends + GSC/Bing Ideas")
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

DATA DARI GOOGLE TRENDS & GSC/BING (query nyata yang dicari orang Indonesia — lengkap dengan wilayah & waktu puncak jika tersedia):
${trendData}

TUGAS: Pilih ${Math.max(generateNext * 3, 5)} query PALING MENARIK dari daftar di atas untuk dijadikan artikel (urutkan dari yang paling menarik).

STRATEGI:
- Publikasikan artikel SEKARANG (Juli 2026) agar terindeks sebelum puncak pencarian
- Gunakan data WILAYAH untuk menentukan angle artikel (jika data wilayah ada, artikel harus spesifik ke provinsi tersebut)
- Pilih query yang belum ada artikelnya (slug aman) dan spesifik

JANGAN pilih produk yang TIDAK KAMI jual, seperti: mpls, ospek, banner, spanduk, stiker, undangan, kartu nama, seragam, kaos, topi, mug, gelas, tas, goodie bag, standing banner, backdrop, poster, flyer, kalender, boneka, blind box, pokemon.
JANGAN pilih: kartu ucapan souvenir pernikahan, souvenir pernikahan bermanfaat, gambar gantungan kunci, kerajaan majapahit, ucapan souvenir pernikahan, bahan gantungan kunci, souvenir pernikahan murah, membuat gantungan kunci, kartu souvenir pernikahan, tas souvenir pernikahan, buat gantungan kunci, souvenir pernikahan yang bermanfaat.
JANGAN pilih topik sejarah/arkeologi seperti: prasasti kerajaan, prasasti peninggalan, prasasti mulawarman, prasasti mataram kuno, prasasti tarumanegara, prasasti kutai, prasasti sriwijaya, prasasti kebon kopi, prasasti kedukan bukit, prasasti talang tuo, prasasti kota kapur, prasasti pasir awi, prasasti tts, prasasti center, apa itu prasasti, tulisan kuno — fokus pada prasasti sebagai PRODUK PLAQUE/PIALA, bukan sebagai artefak sejarah.

Untuk setiap query, tentukan kategori yang TEPAT:
- "Plakat" | "Medali" | "Piala & Trophy" | "Souvenir Wisuda" | "Gift Box"
- "Accessories" | "Prasasti" | "Batas Wilayah" | "Souvenir" | "Blog"

Kembalikan JSON array:
[{ "keyword": "...", "category": "...", "slug": "...", "province": "nama provinsi jika region spesifik, atau kosongkan jika nasional", "reason": "jelaskan angle + region target + timing" }]
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
        let success = 0
        for (const pick of picks) {
          if (success >= generateNext) break
          const kw = pick.keyword
          const cat = pick.category || "Blog"
          const province = pick.province || ""
          const seg = pick.segment || ""
          let cmd = `node scripts/seo/article-generate.mjs "${kw}" --category "${cat}"`
          if (province) cmd += ` --province "${province}"`
          if (seg) cmd += ` --segment "${seg}"`
          console.error(`\n⏳ Generate: "${kw}" (${cat})${province ? " — target: " + province : ""}...`)
          try {
            execSync(cmd, { cwd: root, stdio: "inherit", timeout: 180000 })
            success++
            console.error(`✅ "${kw}" berhasil (${success}/${generateNext})`)
          } catch (e) {
            console.error(`⚠️  "${kw}" gagal: ${e.message}. Coba kandidat berikutnya...`)
          }
        }
        if (success < generateNext) console.error(`\n⚠️  Hanya ${success}/${generateNext} artikel berhasil dibuat.`)
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
