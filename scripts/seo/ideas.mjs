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
  "name tag akrilik premium",
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

  // Fallback: if GSC has no data yet (e.g. site not indexed), source
  // keyword opportunities from a curated long-tail list so the daily run
  // still produces articles. Rotates automatically as articles get added.
  if (opportunities.length === 0 && !process.env.GSC_MOCK) {
    console.log("\nGSC kosong - pakai fallback daftar long-tail kurasi...")
    for (const kw of FALLBACK_KEYWORDS) {
      if (!nearDup(kw, working)) {
        opportunities.push({ query: kw, impressions: 0, clicks: 0, ctr: 0, position: 0 })
      }
    }
    console.log(`Fallback long-tail: ${opportunities.length} opportunity tersedia.`)
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
      const cat = inferCategory(o.query)
      console.log(`\n### "${o.query}" (kategori: ${cat})`)
      const out = execSync(`node scripts/seo/article-generate.mjs "${o.query}" --category "${cat}"`, {
        env: process.env,
        cwd: root,
        stdio: "pipe",
      }).toString()
      process.stdout.write(out)
      const m = out.match(/GENERATED_SLUG:(\S+)/)
      if (m) generatedSlugs.push(m[1])
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
        commitAndPush(`feat(seo): auto-generate ${generatedSlugs.length} article(s) from GSC opportunities`)
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
