// SEO content-idea finder (steps 1-2 of the automation):
// pulls real search queries from Google Search Console AND Bing Webmaster
// Tools (merged & deduped by query), filters out queries that ALREADY have a
// matching article (gap analysis), ranks the rest by search demand
// (impressions, with a soft Bing seed-demand boost), and prints a prioritized
// list of topics to write. Optionally chains straight into article:generate
// for the top N.
//
//   node scripts/seo/ideas.mjs                 # print prioritized opportunities
//   node scripts/seo/ideas.mjs --generate-top 3  # also draft top 3 via LLM
//   node scripts/seo/ideas.mjs --days 90         # wider window (default 28)
//
// Sources (merged, deduped, ranked by demand):
//   1. GSC search-analytics (real Google queries)
//   2. Bing GetQueryStats (real Bing queries)
//   3. Bing GetKeywordStats -> seed-derived long-tail topics (data-driven,
//      expanded from the top-demand seeds so content follows real market demand)
//   4. Competitor sitemaps (scripts/seo/competitors.json) -> proven-ranking
//      topics scraped from public sitemaps of rival sites
//   5. Curated long-tail fallback (FALLBACK_KEYWORDS) when the above are empty.
// Bing seed demand is also used as a soft ranking boost. Needs GSC credentials
// (scripts/gsc/credentials.json). Set GSC_MOCK / BING_MOCK for offline fixtures.
// Set GSC_MOCK / BING_MOCK to run offline with fixtures (no network).

import { execSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { getToken, getSite, api } from "../gsc/analyze.mjs"
import { bingQueryOpportunities, bingSeedVolumes, bingTopicIdeas } from "../bing/source.mjs"
import { competitorTopics } from "./competitor-topics.mjs"
import { buildTopics } from "./geo.mjs"
import { extractArticles } from "./article-lint.mjs"
import { inferCategory } from "./article-generate.mjs"
import { commitAndPush } from "./git.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")

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

function fmtDate(d) {
  return d.toISOString().slice(0, 10)
}

async function main() {
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
      console.error("Tidak menemukan property Search Console — menggunakan fallback (Geo + Bing + curated).")
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

  // --- Bing Webmaster Tools: real queries (Bing's GSC equivalent) ---
  let bingRows = []
  if (process.env.BING_MOCK) {
    bingRows = ["piala golf custom untuk event", "nama dada akrilik premium", "plakat resin custom"].map(
      (q) => ({ keys: [q], impressions: 300, clicks: 3, ctr: 0.01, position: 6 }),
    )
    console.log("BING_MOCK aktif — pakai query fixture (tanpa network)")
  } else if (!process.env.GSC_MOCK) {
    try {
      bingRows = await bingQueryOpportunities()
      console.log(`Total query dari Bing WMT: ${bingRows.length}`)
    } catch (e) {
      console.error(`Bing WMT tidak tersedia (${e.message}); lanjut dengan GSC saja.`)
    }
  }

  // Merge GSC + Bing by query (case-insensitive), summing demand signals so a
  // query that ranks on BOTH engines gets the combined demand. Priority order
  // GSC -> Bing is naturally preserved: real Google demand dominates ranking.
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
  bingRows.forEach(ingest)
  rows = [...byQuery.values()]

  console.log(`Total query (GSC + Bing): ${rows.length}\n`)

  const working = readFileSync(articlesPath, "utf8")
  const opportunities = []
  let covered = 0
  for (const r of rows) {
    const query = r.keys[0]
    if (isCovered(query, working)) {
      covered++
      continue
    }
    opportunities.push({
      query,
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
    })
  }

  // --- Bing seed-derived topic ideas (data-driven from GetKeywordStats) ---
  // Expand top-demand seeds into specific long-tail topics so the pipeline is
  // driven by real market demand, not just a static list. Filtered with
  // nearDup (full-subset) so broad product words already covered don't block
  // these more specific angles.
  try {
    const seedIdeas = await bingTopicIdeas()
    const have = new Set(opportunities.map((o) => o.query.trim().toLowerCase()))
    let added = 0
    for (const idea of seedIdeas) {
      const q = idea.query.trim().toLowerCase()
      if (have.has(q)) continue
      if (nearDup(idea.query, working)) continue
      opportunities.push({
        query: idea.query,
        impressions: Math.round((idea.impressions || 0) / 5),
        clicks: 0,
        ctr: 0,
        position: 0,
        _seed: true,
      })
      have.add(q)
      added++
    }
    if (added) console.log(`Bing seed-derived topics: ${added} (by demand volume)`)
  } catch (e) {
    console.error(`Bing seed ideas gagal (${e.message}); lanjut tanpa itu.`)
  }

  // --- Competitor sitemap topics (Sumber 5) ---
  // Scrape PUBLIC sitemaps of competitor sites (scripts/seo/competitors.json)
  // and turn their article slugs into candidate topics. Strong market signal
  // (these are proven-ranking topics). Ranked with a demand proxy + seed boost.
  try {
    const comp = await competitorTopics()
    const have = new Set(opportunities.map((o) => o.query.trim().toLowerCase()))
    let added = 0
    for (const c of comp) {
      const q = c.query.trim().toLowerCase()
      if (have.has(q)) continue
      if (nearDup(c.query, working)) continue
      opportunities.push({
        query: c.query,
        impressions: 100,
        clicks: 0,
        ctr: 0,
        position: 0,
        _comp: true,
      })
      have.add(q)
      added++
    }
    if (added) console.log(`Competitor-derived topics: ${added} (dari sitemap pesaing)`)
  } catch (e) {
    console.error(`Competitor topics gagal (${e.message}); lanjut tanpa itu.`)
  }
  // Soft ranking boost from Bing broad seed demand (GetKeywordStats): a topic
  // that sits under a high-volume seed gets nudged up without overriding the
  // real per-query demand from GSC/Bing.
  let seedVol = new Map()
  try {
    seedVol = await bingSeedVolumes()
  } catch {
    seedVol = new Map()
  }
  if (seedVol.size) {
    const boost = (q) => {
      const lq = (q || "").toLowerCase()
      let b = 0
      for (const [seed, vol] of seedVol) if (lq.includes(seed)) b += vol
      return Math.round(b / 10)
    }
    for (const o of opportunities) o._boost = boost(o.query)
    opportunities.sort((a, b) => b.impressions + (b._boost || 0) - (a.impressions + (a._boost || 0)))
  } else {
    opportunities.sort((a, b) => b.impressions - a.impressions)
  }

  // Geo pool: provinsi × segmen × produk dijadikan MESIN KONTEN UTAMA agar
  // artikel baru menyebar ke seluruh Indonesia (bukan cuma Jogja). Selalu
  // disertakan (bukan sekadar fallback) dengan impression sintetik yang lebih
  // tinggi dari topik competitor-derived, sehingga generator memprioritaskan
  // sebaran geografis — namun tetap di bawah demand riil GSC/Bing bila ada.
  // Rotasi per-hari di buildTopics() menjamin provinsi/segmen terdistribusi
  // merata, dan topik yang sudah jadi artikel gugur otomatis via nearDup.
  const GEO_IMP = 100
  const geo = buildTopics()
  const haveQ = new Set(opportunities.map((o) => o.query.trim().toLowerCase()))
  let geoAdded = 0
  for (const t of geo) {
    const q = t.query.trim().toLowerCase()
    if (haveQ.has(q)) continue
    if (nearDup(t.query, working)) continue
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
    if (!nearDup(kw, working)) {
      opportunities.push({ query: kw, impressions: 10, clicks: 0, ctr: 0, position: 0 })
    }
  }
  console.log(`Geo pool: ${geoAdded} opportunity provinsi×segmen (imp ${GEO_IMP}) disertakan.`)

  // Re-rank SETELAH geo pool disertakan agar topik provinsi×segmen (imp ${GEO_IMP})
  // benar-benar memimpin daftar, di atas competitor-derived & bing-seed.
  // +300 boost untuk kategori prioritas: Plakat & Souvenir Wisuda (beserta turunannya).
  const catBoost = (o) => {
    const cat = o._category || inferCategory(o.query)
    if (cat === "Plakat" || cat === "Souvenir Wisuda") return 300
    return 0
  }
  const reBoost = (q) => {
    const lq = (q || "").toLowerCase()
    let b = 0
    for (const [seed, vol] of seedVol) if (lq.includes(seed)) b += vol
    return Math.round(b / 10)
  }
  if (seedVol.size) {
    for (const o of opportunities) o._boost = reBoost(o.query)
    opportunities.sort((a, b) => b.impressions + (b._boost || 0) + catBoost(b) - (a.impressions + (a._boost || 0) + catBoost(a)))
  } else {
    opportunities.sort((a, b) => b.impressions + catBoost(b) - (a.impressions + catBoost(a)))
  }

  console.log(`Sudah punya artikel: ${covered}`)
  console.log(`OPPORTUNITY (belum ada artikel): ${opportunities.length}\n`)
  console.log("Rank | Impressions | Clicks | CTR  | Pos | Query")
  console.log("-".repeat(70))
  opportunities.slice(0, 30).forEach((o, i) => {
    console.log(
      `${(i + 1).toString().padEnd(4)} | ${String(o.impressions).padStart(11)} | ${String(o.clicks).padStart(6)} | ${(o.ctr * 100).toFixed(1).padStart(4)}% | ${o.position.toFixed(1).padStart(4)} | ${o.query}`,
    )
  })

  writeFileSync(join(here, "ideas.json"), JSON.stringify(opportunities, null, 2))
  console.log(`\nDisimpan ke scripts/seo/ideas.json (${opportunities.length} opportunity).`)

  if (GEN_TOP > 0 && opportunities.length) {
    console.log(`\n>>> Generate draft untuk top ${GEN_TOP} (LLM)...`)
    const top = opportunities.slice(0, GEN_TOP)
    const generatedSlugs = []
    for (const o of top) {
      const cat = o._category || inferCategory(o.query)
      const genEnv = {
        ...process.env,
        ARTICLE_PROVINCE: o._province || "",
        ARTICLE_SEGMENT: o._segment || "",
      }
      console.log(`\n### "${o.query}" (kategori: ${cat}${o._province ? ", lokasi: " + o._province : ""}${o._segment ? ", segmen: " + o._segment : ""})`)
      // Per-topik: satu topik gagal (mis. duplikat / LLM error) tidak boleh
      // membatalkan topik lain maupun seluruh run.
      try {
        const out = execSync(`node scripts/seo/article-generate.mjs "${o.query}" --category "${cat}"`, {
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
          commitAndPush(`feat(seo): auto-generate ${generatedSlugs.length} article(s) from GSC + Bing opportunities`)
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
