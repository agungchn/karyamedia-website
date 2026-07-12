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
// Needs GSC credentials (scripts/gsc/credentials.json, already present).

import { execSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { getToken, getSite, api } from "../gsc/analyze.mjs"
import { extractArticles } from "./article-lint.mjs"
import { inferCategory } from "./article-generate.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")

const args = process.argv.slice(2)
const opt = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : null
}
const GEN_TOP = parseInt(opt("--generate-top") || "0", 10)
const DAYS = parseInt(opt("--days") || "28", 10)

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
    const token = await getToken()
    target = await getSite(token)
    if (!target) {
      console.error("Tidak menemukan property Search Console.")
      process.exit(1)
    }
    console.log(`GSC property: ${target}\n`)

    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - DAYS)
    const enc = encodeURIComponent(target)
    const report = await api(token, `/sites/${enc}/searchAnalytics/query`, {
      startDate: fmtDate(start),
      endDate: fmtDate(end),
      dimensions: ["query"],
      rowLimit: 1000,
    })
    rows = report.rows || []
  }
  console.log(`Total query dari GSC (${DAYS}hari): ${rows.length}\n`)

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
  opportunities.sort((a, b) => b.impressions - a.impressions)

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
    for (const o of top) {
      const cat = inferCategory(o.query)
      console.log(`\n### "${o.query}" (kategori: ${cat})`)
      execSync(`node scripts/seo/article-generate.mjs "${o.query}" --category "${cat}"`, {
        env: process.env,
        cwd: root,
        stdio: "inherit",
      })
    }
    console.log("\nDraft selesai disisipkan. Review di src/data/articles.ts, lalu git commit.")
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})
