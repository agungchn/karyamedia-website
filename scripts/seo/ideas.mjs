// SEO content-idea finder (steps 1-2 of the automation):
// pulls real search queries from Google Search Console, filters out queries
// that ALREADY have a matching article (gap analysis), ranks the rest by
// search demand (impressions), and prints a prioritized list of topics to
// write. Optionally chains straight into article:generate for the top N.
//
//   node scripts/seo/ideas.mjs                 # print prioritized opportunities
//   node scripts/seo/ideas.mjs --generate-top 3  # also draft top 3 via LLM
//   node scripts/seo/ideas.mjs --days 90         # wider window (default 28)
//
// Sources (merged, deduped, ranked by demand):
//   1. GSC search-analytics (real Google queries)
//   2. Geo pool (provinsi × segmen × produk)
//   3. Curated long-tail fallback (FALLBACK_KEYWORDS) when the above are empty.
// Needs GSC credentials (scripts/gsc/credentials.json).
// Set GSC_MOCK to run offline with fixtures (no network).

import { execSync } from "node:child_process"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { getToken, getSite, api } from "../gsc/analyze.mjs"
import { buildTopics } from "./geo.mjs"
import { googleSuggest } from "../google/suggest.mjs"
import { extractArticles } from "./article-lint.mjs"
import { inferCategory } from "./article-generate.mjs"
import { commitAndPush } from "./git.mjs"
import { isBlocked } from "./blocked-keywords.js"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")
const FAILED_KEYWORDS_PATH = join(here, "failed-keywords.json")
const MAX_FAILS = 2 // skip keyword permanently after 2nd duplicate failure

// Curated long-tail topics used as fallback keyword source when GSC has no
// data yet (e.g. site not indexed). These are specific enough to not collide
// with the broad articles already on the site. Once an article is generated
// for a topic, its tokens make that topic "covered" so the list rotates.
const FALLBACK_KEYWORDS = [
  "plakat akrilik custom untuk perusahaan",
  "plakat penghargaan karya terbaik",
  "plakat resin custom untuk lomba",
  "medali finishing emas untuk kompetisi",
  "medali couples untuk pernikahan",
  "medali custom untuk lomba sekolah",
  "piala resin custom untuk turnamen",
  "piala golf custom untuk event",
  "prasasti marmer untuk gedung",
  "prasasti kuningan untuk instansi",
  "souvenir wisuda untuk pria",
  "samir wisuda bordir logo",
  "gift box souvenir batik isi 5 pcs",
  "box kertas custom untuk souvenir",
  "nama dada akrilik premium",
  "gantungan kunci akrilik custom",
  "pin bross custom untuk event",
  "patung wisuda fiber custom",
]

const args = process.argv.slice(2)
const opt = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : null
}
const GEN_TOP = parseInt(opt("--generate-top") || "0", 10)
const DAYS = parseInt(opt("--days") || "28", 10)
const COMMIT_PUSH = args.includes("--commit-push")
const DRY_RUN = args.includes("--dry-run")

// --- query coverage check (reuse token logic) ---
const STOP = new Set(
  "custom,kustom,souvenir,plakat,medali,piala,trophy,gift,box,accessories,prasasti,batas,wilayah,wisuda,dan,untuk,ke,di,dari,pada,atau,dengan,yang,the,a,an,of,to,in,for,cara,membuat,panduan,lengkap,guide,model,jenis,terbaik,bagi,acara,adalah,this,that,vs".split(","),
)
const MOD_IGNORE = new Set(
  "jogja,jakarta,jkt,online,murah,mahal,terbaik,bagus,dekat,termurah,terdekat,lucu,unik,cantik,simple,modern,elegan,dll,untuk,dan,di,ke,the,a,an".split(","),
)
const tokensOf = (s) => (s || "").toLowerCase().replace(/<[^>]*>/g, " ").split(/[^a-z0-9]+/i).filter((w) => w && !STOP.has(w) && w.length > 1)
const sigTokens = (s) => tokensOf(s).filter((w) => !MOD_IGNORE.has(w))
const slugRe = /slug:\s*"([^"]*)"/
const titleRe = /title:\s*"([^"]*)"/
const tagsRe = /tags:\s*\[([\s\S]*?)\]/
const catRe = /category:\s*"([^"]*)"/

function isCovered(query, workingText) {
  if (/karyamedia/i.test(query)) return true
  const q = sigTokens(query)
  if (q.length === 0) return true // no distinctive term -> skip
  const arts = extractArticles(workingText)
  for (const a of arts) {
    const slug = slugRe.exec(a.block)?.[1] || ""
    const title = titleRe.exec(a.block)?.[1] || ""
    const tagsM = tagsRe.exec(a.block)
    const tags = tagsM ? [...tagsM[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).join(" ") : ""
    const aTok = sigTokens(`${slug} ${title} ${tags}`)
    if (q.some((t) => aTok.includes(t))) return true
  }
  return false
}

// Stricter filter for the fallback list: only treat as duplicate if EVERY
// distinctive token of the query already exists in an article (full subset).
// This avoids the loose isCovered blocking all broad keywords.
function nearDup(query, workingText) {
  const q = sigTokens(query)
  if (q.length === 0) return true
  const Q = new Set(q)
  const arts = extractArticles(workingText)
  for (const a of arts) {
    const slug = slugRe.exec(a.block)?.[1] || ""
    const title = titleRe.exec(a.block)?.[1] || ""
    const tagsM = tagsRe.exec(a.block)
    const tags = tagsM ? [...tagsM[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).join(" ") : ""
    const aTok = sigTokens(`${slug} ${title} ${tags}`)
    const A = new Set(aTok)
    let inBoth = 0
    for (const x of Q) if (A.has(x)) inBoth++
    if (inBoth / Q.size >= 1) return true
  }
  return false
}

// Jaccard similarity between two keyword queries.
function jaccard(a, b) {
  const A = new Set(sigTokens(a))
  const B = new Set(sigTokens(b))
  const both = new Set([...A].filter((x) => B.has(x)))
  const all = new Set([...A, ...B])
  return all.size ? both.size / all.size : 0
}

// Pre-generation duplicate check: skip if keyword is too similar (≥55% Jaccard)
// to any keyword already attempted in this run, or has ≥50% token overlap
// with an existing article title.
function isKeywordDuplicate(query, workingText, attemptedKeywords) {
  const q = sigTokens(query)
  if (q.length === 0) return true
  for (const ak of attemptedKeywords) {
    if (jaccard(query, ak) >= 0.55) return true
  }
  const arts = extractArticles(workingText)
  for (const a of arts) {
    const title = titleRe.exec(a.block)?.[1] || ""
    if (jaccard(query, title) >= 0.5) return true
  }
  return false
}

// Enhanced pre-screening: cek keyword terhadap SELURUH konten artikel yang sudah ada
// menggunakan duplicate detection yang sama dengan article-generate.mjs
// Tujuannya: skip keyword sebelum LLM dipanggil, hemat quota dan waktu.
const STOP_SCREEN = new Set(
  "custom,kustom,souvenir,plakat,medali,piala,trophy,gift,box,accessories,prasasti,batas,wilayah,wisuda,dan,untuk,ke,di,dari,pada,atau,dengan,yang,the,a,an,of,to,in,for,cara,membuat,panduan,lengkap,guide,model,jenis,terbaik,bagi,acara,adalah,this,that,vs".split(","),
)
const tokensScreen = (s) => (s || "").toLowerCase().replace(/<[^>]*>/g, " ").split(/[^a-z0-9]+/i).filter((w) => w && !STOP_SCREEN.has(w) && w.length > 1)
const contScreen = (a, b) => {
  const A = new Set(a), B = new Set(b)
  if (!A.size) return 0
  let i = 0
  for (const x of A) if (B.has(x)) i++
  return i / Math.min(A.size, B.size)
}
const headingsFromContent = (text) => {
  return [...text.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map((h) => h[1].replace(/<[^>]*>/g, "").trim().toLowerCase())
    .filter(Boolean)
}

// Pre-screen: simulasi duplicate check seperti di article-generate.mjs
// tanpa benar-benar manggil LLM. Cek heading similarity & konten similarity
// terhadap artikel yang sudah ada. Gunakan threshold yang sama persis dengan
// article-generate.mjs: heading ≥80% DAN konten ≥50% baru dianggap duplikat.
// Daftar kategori yang sudah jenuh — artikel baru di kategori ini hampir pasti
// duplikat konten karena LLM menghasilkan struktur heading yang mirip.
const SATURATED_CATS = new Set(["Souvenir Wisuda"])

function preScreenDuplicate(keyword, category, workingText) {
  const kwTokens = tokensScreen(keyword)
  if (kwTokens.length === 0) return null

  // Kategori jenuh: langsung skip kecuali keyword spesifik yang terdaftar
  if (SATURATED_CATS.has(category)) {
    const ALLOWED_SPECIFIC = [
      "kalung rektor", "tongkat rektor", "map ijazah", "tabung wisuda",
      "toga wisuda", "patung wisuda", "plakat wisuda akrilik",
      "samir wisuda", "gordon wisuda", "kalung wisuda",
    ]
    const kwLower = keyword.toLowerCase()
    const isAllowed = ALLOWED_SPECIFIC.some((a) => kwLower.includes(a))
    if (!isAllowed) {
      return `kategori "${category}" sudah jenuh — hanya terima keyword spesifik (samir/gordon/patung/kalung rektor/tongkat rektor/map ijazah/tabung wisuda)`
    }
  }
  
  const arts = extractArticles(workingText)
  for (const a of arts) {
    const aSlug = slugRe.exec(a.block)?.[1] || ""
    const aTitle = titleRe.exec(a.block)?.[1] || ""
    const aCat = catRe.exec(a.block)?.[1] || ""
    
    // Cek token overlap dengan title artikel existing
    const aTok = tokensScreen(aTitle)
    const c = contScreen(kwTokens, aTok)
    if (c >= 0.85) return `topik terlalu mirip dengan "${aTitle}" (token overlap ${(c*100).toFixed(0)}%)`
    
    // Cek konten content article existing untuk heading similarity
    // Ini baru dilakukan jika kategorinya SAMA, karena artikel beda kategori
    // biasanya punya struktur heading berbeda.
    const contentRe_ = /content:\s*`([\s\S]*?)`,\s*\n\s*\},/
    const cm = contentRe_.exec(a.block)
    if (cm && aCat === category && category !== "Blog") {
      const eContent = cm[1]
      const eHeadings = new Set(headingsFromContent(eContent))
      if (eHeadings.size >= 4) {
        // Keyword dengan kategori sama: hitung overlap token dengan konten
        const eTokens = tokensScreen(eContent)
        if (eTokens.length > 0) {
          const contentOverlap = contScreen(kwTokens, eTokens)
          // Threshold ringan: jika keyword token sangat mirip dengan konten yang ada
          if (contentOverlap >= 0.7) {
            return `konten mirip dengan "${aTitle}" (blog/${aSlug}, token overlap ${(contentOverlap*100).toFixed(0)}%)`
          }
        }
      }
    }
  }
  return null
}

// Persistent failed-keyword tracking: keywords that repeatedly fail the
// post-generation duplicate check are blacklisted so they won't be retried.
function loadFailedKeywords() {
  try {
    if (existsSync(FAILED_KEYWORDS_PATH)) {
      return JSON.parse(readFileSync(FAILED_KEYWORDS_PATH, "utf8"))
    }
  } catch { /* corrupt file — reset */ }
  return {}
}

function saveFailedKeyword(keywords, query) {
  const key = query.toLowerCase().trim()
  if (!key) return
  if (!keywords[key]) keywords[key] = { count: 0, last_fail: null }
  keywords[key].count++
  keywords[key].last_fail = new Date().toISOString()
  writeFileSync(FAILED_KEYWORDS_PATH, JSON.stringify(keywords, null, 2))
}

function isFailedKeyword(query, failedKeywords) {
  const key = query.toLowerCase().trim()
  const entry = failedKeywords[key]
  return entry && entry.count >= MAX_FAILS
}

function fmtDate(d) {
  return d.toISOString().slice(0, 10)
}

async function main() {
  // Persistent blacklist: keywords that repeatedly failed duplicate check
  const failedKeywords = loadFailedKeywords()
  const activeFails = Object.keys(failedKeywords).filter((k) => isFailedKeyword(k, failedKeywords))
  const failedSet = new Set(activeFails)
  if (activeFails.length) {
    console.log(`⚠ ${activeFails.length} keyword(s) di-blacklist (gagal duplikat ≥${MAX_FAILS}x): ${activeFails.slice(0, 5).join(", ")}${activeFails.length > 5 ? "..." : ""}`)
  }

  let rows
  let target = ""
  if (process.env.GSC_MOCK) {
    // offline test fixture: some covered, some opportunities
    const q = [
      "plakat akrilik custom", "souvenir pernikahan murah jogja", "karyamedia jogja",
      "medali emas custom jogja", "plakat resin custom", "piala basket custom",
    ]
    rows = q.map((query, i) => ({ keys: [query], impressions: 1000 - i * 100, clicks: 10, ctr: 0.01, position: 5 }))
    target = "MOCK"
    console.log("GSC_MOCK aktif — pakai query fixture (tanpa network)\n")
  } else {
    let token
    try {
      token = await getToken()
    } catch (e) {
      console.error(`GSC token gagal (${e.message}); lanjut tanpa GSC.`)
      token = null
    }
    if (token) {
      try {
        target = await getSite(token)
      } catch (e) {
        console.error(`GSC getSite gagal (${e.message}); lanjut tanpa GSC.`)
        target = ""
      }
    }
    if (!target) {
      console.error("Tidak menemukan property Search Console — menggunakan fallback (Geo + curated).")
      rows = []
    } else {
      console.log(`GSC property: ${target}\n`)
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - DAYS)
      const enc = encodeURIComponent(target)
      try {
        const report = await api(token, `/sites/${enc}/searchAnalytics/query`, {
          startDate: fmtDate(start),
          endDate: fmtDate(end),
          dimensions: ["query"],
          rowLimit: 1000,
        })
        rows = report.rows || []
      } catch (e) {
        console.error(`GSC searchAnalytics gagal (${e.message}); lanjut tanpa GSC.`)
        rows = []
      }
    }
  }

  // Merge GSC queries by case-insensitive dedup
  const byQuery = new Map()
  const ingest = (r) => {
    const raw = r.keys?.[0] || ""
    const q = raw.trim().toLowerCase()
    if (!q) return
    const imp = r.impressions || 0
    const clk = r.clicks || 0
    if (byQuery.has(q)) {
      const e = byQuery.get(q)
      e.impressions += imp
      e.clicks += clk
    } else {
      byQuery.set(q, { keys: [raw], impressions: imp, clicks: clk, ctr: r.ctr || 0, position: r.position || 0 })
    }
  }
  rows.forEach(ingest)
  rows = [...byQuery.values()]

  console.log(`Total query (GSC): ${rows.length}\n`)

  const working = readFileSync(articlesPath, "utf8")
  const opportunities = []
  let covered = 0
  // Dapatkan hari ini untuk blocked keywords check
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const hariIni = days[new Date().getDay()]
  
  for (const r of rows) {
    const query = r.keys[0]
    if (isCovered(query, working)) {
      covered++
      continue
    }
    // Skip blocked keywords untuk hari ini (avoid duplikasi dengan 10:00 WIB)
    if (isBlocked(query, hariIni)) {
      continue
    }
    // Skip persistently failed keywords (duplicate ≥2x)
    if (failedSet.has(query.trim().toLowerCase())) {
      continue
    }
    opportunities.push({
      query,
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
      _real: true, // GSC real queries
    })
  }

  opportunities.sort((a, b) => b.impressions - a.impressions)

  // Track semua query yang sudah ada untuk dedup
  const haveQ = new Set(opportunities.map((o) => o.query.trim().toLowerCase()))

  // Google Suggest: fetch long-tail keywords dari Google Autocomplete
  // Data real dari search behavior, lebih reliable dari geo pool sintetis
  let suggestAdded = 0
  try {
    const suggestions = await googleSuggest()
    for (const s of suggestions) {
      const q = s.query.trim().toLowerCase()
      if (haveQ.has(q)) continue
      if (nearDup(s.query, working)) continue
      // Skip blocked keywords untuk hari ini
      if (isBlocked(s.query, hariIni)) continue
      // Skip persistently failed keywords (duplicate ≥2x)
      if (failedSet.has(q)) continue
      opportunities.push({
        query: s.query,
        impressions: s.impressions,
        clicks: 0,
        ctr: 0,
        position: 0,
        _suggest: true,
      })
      haveQ.add(q)
      suggestAdded++
    }
    console.log(`Google Suggest: ${suggestAdded} long-tail keywords (imp ${suggestions[0]?.impressions || 50})`)
  } catch (e) {
    console.warn(`Google Suggest gagal: ${e.message}`)
  }

  // Geo pool: provinsi × segmen × produk dijadikan MESIN KONTEN UTAMA agar
  // artikel baru menyebar ke seluruh Indonesia (bukan cuma Jogja). Selalu
  // disertakan (bukan sekadar fallback) dengan impression sintetik yang LEBIH
  // RENDAH dari demand riil GSC, sehingga generator memprioritaskan
  // query nyata. Rotasi per-hari di buildTopics() menjamin provinsi/segmen
  // terdistribusi merata, dan topik yang sudah jadi artikel gugur otomatis
  // via nearDup.
  const GEO_IMP = 30
  const GEO_LIMIT = 50 // Limit untuk performa (nearDup lambat di 22k+ topics)
  const geo = buildTopics().slice(0, GEO_LIMIT)
  let geoAdded = 0
  for (const t of geo) {
    const q = t.query.trim().toLowerCase()
    if (haveQ.has(q)) continue
    if (nearDup(t.query, working)) continue
    if (failedSet.has(q)) continue
    opportunities.push({
      query: t.query,
      impressions: GEO_IMP,
      clicks: 0,
      ctr: 0,
      position: 0,
      _province: t.province,
      _segment: t.segment,
      _category: t.category,
    })
    haveQ.add(q)
    geoAdded++
  }
  // pelengkap: long-tail non-geo (resolusi rendah) sebagai cadangan
  for (const kw of FALLBACK_KEYWORDS) {
    const q = kw.trim().toLowerCase()
    if (failedSet.has(q)) continue
    if (!nearDup(kw, working)) {
      opportunities.push({ query: kw, impressions: 10, clicks: 0, ctr: 0, position: 0 })
    }
  }
  console.log(`Geo pool: ${geoAdded} opportunity provinsi×segmen (imp ${GEO_IMP}) disertakan.`)

  // Re-rank SETELAH geo pool disertakan. Prioritas:
  //   1. Real GSC queries (10x) — demand asli selalu menang
  //   2. Geo pool (8x +50) — historis paling jarang duplikat, diberi boost
  //   3. Google Suggest (5x) — sering gagal duplikat, prioritas diturunkan
  //   4. Fallback (1x) — cadangan
  const isRealQuery = (o) => o._real === true
  const isSuggestQuery = (o) => o._suggest === true
  const isGeoQuery = (o) => !!o._province
  for (const o of opportunities) {
    if (isGeoQuery(o)) o.impressions = (o.impressions || 0) + 50
  }
  const realImp = (o) => {
    if (isRealQuery(o)) return (o.impressions || 0) * 10
    if (isGeoQuery(o)) return (o.impressions || 0) * 8
    if (isSuggestQuery(o)) return (o.impressions || 0) * 5
    return o.impressions || 0
  }
  opportunities.sort((a, b) => realImp(b) - realImp(a))

  console.log(`Sudah punya artikel: ${covered}`)
  console.log(`OPPORTUNITY (belum ada artikel): ${opportunities.length}\n`)
  console.log("Rank | Impressions | Clicks | CTR  | Pos | Source | Query")
  console.log("-".repeat(80))
  opportunities.slice(0, 30).forEach((o, i) => {
    const source = o._real ? "GSC" : o._suggest ? "Suggest" : o._province ? "Geo" : "Fallback"
    console.log(
      `${(i + 1).toString().padEnd(4)} | ${String(o.impressions).padStart(11)} | ${String(o.clicks).padStart(6)} | ${(o.ctr * 100).toFixed(1).padStart(4)}% | ${o.position.toFixed(1).padStart(4)} | ${source.padEnd(8)} | ${o.query}`,
    )
  })

  writeFileSync(join(here, "ideas.json"), JSON.stringify(opportunities, null, 2))
  console.log(`\nDisimpan ke scripts/seo/ideas.json (${opportunities.length} opportunity).`)

  if (GEN_TOP > 0 && opportunities.length) {
    console.log(`\n>>> Generate draft untuk top ${GEN_TOP} (LLM)...`)
    const top = opportunities.slice(0, GEN_TOP)
    const generatedSlugs = []
    const attemptedKeywords = []
    const maxRun = GEN_TOP * 3 // safety cap: maks 3× lipat untuk cari pengganti
    let runCount = 0
    for (const o of top) {
      let cat = o._category || inferCategory(o.query)
      let genProvince = o._province || ""
      let genSegment = o._segment || ""
      // Enhanced pre-screening: cek potensi duplikat dengan konten existing
      const screenResult = preScreenDuplicate(o.query, cat, working)
      if (screenResult) {
        console.log(`  ⏭ Skip "${o.query}" — ${screenResult}, cari pengganti...`)
        if (runCount++ >= maxRun) break
        for (let j = GEN_TOP; j < opportunities.length; j++) {
          const alt = opportunities[j]
          if (alt._used) continue
          const altScreen = preScreenDuplicate(alt.query, alt._category || inferCategory(alt.query), working)
          if (altScreen) continue
          if (isKeywordDuplicate(alt.query, working, attemptedKeywords)) continue
          alt._used = true
          o.query = alt.query
          o._category = alt._category
          o._province = alt._province || ""
          o._segment = alt._segment || ""
          cat = o._category || inferCategory(o.query)
          genProvince = o._province
          genSegment = o._segment
          console.log(`  → Ganti dengan "${o.query}" (kategori: ${cat}${genProvince ? ", lokasi: " + genProvince : ""}${genSegment ? ", segmen: " + genSegment : ""})`)
          break
        }
        // Jika tidak ada pengganti yang lolos screening, skip topik ini
        if (o._used) continue
        else {
          console.log(`  Tidak ada pengganti yang lolos screening. Lanjut topik berikutnya...`)
          continue
        }
      }
      // Pre-generation duplicate check: skip keyword yang terlalu mirip
      // dengan keyword yg sudah gagal atau artikel existing — hemat LLM quota.
      if (isKeywordDuplicate(o.query, working, attemptedKeywords)) {
        console.log(`  ⏭ Skip "${o.query}" — terlalu mirip dengan keyword/artikel yang sudah ada, cari pengganti...`)
        if (runCount++ >= maxRun) break
        for (let j = GEN_TOP; j < opportunities.length; j++) {
          const alt = opportunities[j]
          if (alt._used) continue
          const altScreen = preScreenDuplicate(alt.query, alt._category || inferCategory(alt.query), working)
          if (altScreen) continue
          if (isKeywordDuplicate(alt.query, working, attemptedKeywords)) continue
          alt._used = true
          o.query = alt.query
          o._category = alt._category
          o._province = alt._province || ""
          o._segment = alt._segment || ""
          cat = o._category || inferCategory(o.query)
          genProvince = o._province
          genSegment = o._segment
          console.log(`  → Ganti dengan "${o.query}" (kategori: ${cat}${genProvince ? ", lokasi: " + genProvince : ""}${genSegment ? ", segmen: " + genSegment : ""})`)
          break
        }
      }
      const genEnv = {
        ...process.env,
        ARTICLE_PROVINCE: genProvince,
        ARTICLE_SEGMENT: genSegment,
      }
      console.log(`\n### "${o.query}" (kategori: ${cat}${genProvince ? ", lokasi: " + genProvince : ""}${genSegment ? ", segmen: " + genSegment : ""})`)
      attemptedKeywords.push(o.query)
      // Per-topik: satu topik gagal (mis. duplikat / LLM error) tidak boleh
      // membatalkan topik lain maupun seluruh run.
      try {
        const dryRunFlag = DRY_RUN ? " --dry-run" : ""
        const out = execSync(`node scripts/seo/article-generate.mjs "${o.query}" --category "${cat}"${dryRunFlag}`, {
          env: genEnv,
          cwd: root,
          stdio: "pipe",
        }).toString()
        process.stdout.write(out)
        const m = out.match(/GENERATED_SLUG:(\S+)/)
        if (m) generatedSlugs.push(m[1])
      } catch (err) {
        const msg = (err.stderr || err.stdout || err.message || "").toString().trim()
        const tail = msg.split("\n").slice(-3).join("\n")
        console.error(`✗ Generate gagal untuk "${o.query}": ${tail || err.message}`)
        // Persistent tracking: jika gagal karena duplikat, catat ke blacklist
        if (/duplikat/i.test(msg)) {
          saveFailedKeyword(failedKeywords, o.query)
        }
        console.error("  Lanjut ke topik berikutnya...")
      }
    }

    if (COMMIT_PUSH && generatedSlugs.length) {
      console.log("\n>>> Validasi gate sebelum commit...")
      let gateOk = true
      try {
        execSync(`node scripts/seo/article-lint.mjs`, {
          env: { ...process.env, ARTICLE_LINT_SLUGS: generatedSlugs.join(",") },
          cwd: root,
          stdio: "inherit",
        })
      } catch {
        gateOk = false
      }
      if (gateOk) {
        try {
          commitAndPush(`feat(seo): auto-generate ${generatedSlugs.length} article(s) from GSC opportunities`)
        } catch (err) {
          console.error(
            `\nGagal: commit/push error (${err.message}). Artikel sudah tersimpan di src/data/articles.ts — lakukan git commit/push manual.`,
          )
        }
      } else {
        console.error(
          "\nGagal: ada artikel yang tidak lolos standar. Tidak di-commit/push. Perbaiki lalu commit manual.",
        )
      }
    } else {
      console.log("\nDraft selesai disisipkan. Review di src/data/articles.ts" + (COMMIT_PUSH ? "" : ", lalu jalankan dengan --commit-push atau git commit manual."))
    }
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})
