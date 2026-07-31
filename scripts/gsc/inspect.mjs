// Check Google indexing status of recent blog articles via the
// Search Console URL Inspection API (READ-ONLY — uses the readonly scope).
//
//   node scripts/gsc/inspect.mjs            # last 5 articles
//   node scripts/gsc/inspect.mjs 10         # last 10
//   SITE_URL=... node scripts/gsc/inspect.mjs
//
// NOTE: Google does not expose a public "submit URL for indexing" API for
// ordinary sites — discovery happens automatically via the sitemap. This tool
// only *verifies* indexing state so we know what Google has picked up.

import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import { readAllMdxArticles } from "../seo/mdx-helpers.mjs"
import { getToken, getSite } from "./analyze.mjs"

const here = dirname(fileURLToPath(import.meta.url))

const N = parseInt(process.argv[2] || "5", 10)

function lastSlugs(n) {
  const articles = readAllMdxArticles()
  return articles.slice(-n).map((a) => a.slug)
}

async function inspect(token, site, url) {
  const res = await fetch(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: site }),
    },
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HTTP ${res.status}: ${err}`)
  }
  const data = await res.json()
  const r = data.inspectionResult?.indexStatusResult || {}
  return r.verdict || r.coverageState || "UNKNOWN"
}

async function main() {
  const slugs = lastSlugs(N)
  if (!slugs.length) {
    console.error("Tidak ada artikel ditemukan.")
    process.exit(1)
  }
  const token = await getToken()
  const site = await getSite(token)
  console.log(`Site: ${site}`)
  console.log(`Memeriksa ${slugs.length} artikel terbaru...\n`)

  let indexed = 0
  for (const slug of slugs) {
    const url = `https://karyamediasouvenir.com/blog/${slug}`
    try {
      const state = await inspect(token, site, url)
      const ok = /pass|indexed|neutral/i.test(state)
      if (ok) indexed++
      console.log(`  [${ok ? "OK" : "  "}] ${state.padEnd(38)} ${url}`)
    } catch (e) {
      console.log(`  [!!] ERROR  ${url}\n       ${e.message}`)
    }
  }
  console.log(`\nRingkasan: ${indexed}/${slugs.length} terindeks (atau netral).`)
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})
