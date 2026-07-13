// Bing Webmaster Tools keyword sources for the SEO pipeline.
// Exposes two signals that mirror what we get from Google Search Console:
//   1. bingQueryOpportunities() — real organic queries Bing sees for the
//      site (GetQueryStats). Shaped exactly like GSC search-analytics rows
//      so ideas.mjs can merge the two sources seamlessly.
//   2. bingSeedVolumes() — broad seed demand (GetKeywordStats), used only as
//      a soft ranking boost, never as article topics (those are broad terms
//      that would collide with existing pillar content).
//
// Everything fails soft: no key / site unverified / network error => empty
// results, so the pipeline keeps working with GSC (and the curated fallback).
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { bingOpportunities } from "./keywords.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, "..", "..")
const SITE = (process.env.SITE_URL || "https://karyamediasouvenir.com/").replace(/\/?$/, "/")

export function getBingKey() {
  if (process.env.BING_API_KEY) return process.env.BING_API_KEY
  try {
    return fs.readFileSync(path.join(root, "scripts/bing/apikey.txt"), "utf8").trim()
  } catch {
    return ""
  }
}

async function bingCall(method, key) {
  const url =
    `https://ssl.bing.com/webmaster/api.svc/json/${method}` +
    `?siteUrl=${encodeURIComponent(SITE)}&apikey=${key}`
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok) return { _raw: text, _status: res.status }
  try {
    return JSON.parse(text)
  } catch {
    return { _raw: text, _status: res.status }
  }
}

// Real organic queries Bing sees for the site (Bing's equivalent of GSC).
// Returns rows shaped like GSC search-analytics: { keys:[query], impressions, clicks, ctr, position }
export async function bingQueryOpportunities() {
  const key = getBingKey()
  if (!key) return []
  const j = await bingCall("GetQueryStats", key)
  const rows = j && Array.isArray(j.d) ? j.d : []
  return rows
    .map((r) => {
      const query = r.Query || r.query || ""
      if (!query) return null
      const imp = r.Impressions ?? r.impressions ?? 0
      const clk = r.Clicks ?? r.clicks ?? 0
      return {
        keys: [query],
        impressions: imp,
        clicks: clk,
        ctr: imp > 0 ? clk / imp : 0,
        position: r.AvgPosition ?? r.avgPosition ?? r.Position ?? 0,
      }
    })
    .filter(Boolean)
}

// Broad seed demand (GetKeywordStats) used as a ranking boost, not as topics.
export async function bingSeedVolumes() {
  try {
    const results = await bingOpportunities()
    const map = new Map()
    for (const r of results) map.set(r.q.toLowerCase(), r.total || 0)
    return map
  } catch {
    return new Map()
  }
}

// Distinctive modifiers used to turn a high-demand seed into specific,
// coverable long-tail topics. Ordered sensibly so the first combos rank well.
const MODIFIERS = [
  "turnamen", "lomba", "kompetisi", "event", "pernikahan", "wisuda",
  "peresmian", "sekolah", "universitas", "kantor", "perusahaan",
  "instansi", "klub", "jogja", "yogyakarta", "akrilik", "resin",
  "marmer", "fiberglass", "kuningan", "premium", "elegan",
]

// Data-driven topic ideas: expand the top Bing seeds (by real search volume)
// into long-tail queries. Each candidate carries its seed's volume as a demand
// proxy so ideas.mjs can rank it. Returns [{ query, impressions }].
export async function bingTopicIdeas() {
  let vols
  try {
    vols = await bingSeedVolumes()
  } catch {
    vols = new Map()
  }
  const seeds = [...vols.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  const out = []
  const seen = new Set()
  for (const [seed, vol] of seeds) {
    for (const m of MODIFIERS) {
      const q = `${seed} ${m} custom`
      const key = q.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ query: q, impressions: vol })
    }
  }
  return out
}
