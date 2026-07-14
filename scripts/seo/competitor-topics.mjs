// Competitor topic discovery — reads PUBLIC sitemaps of competitor sites and
// turns their article slugs into candidate keywords for our content pipeline.
// No API key needed; sitemaps are public by design. Read-only.
//
// Configure competitors in scripts/seo/competitors.json, e.g.:
//   ["plakatabc.com", "https://toko-xy.id", "souvenirjogja.net"]
// Leave as [] to disable. Each domain's sitemap.xml / sitemap_index.xml (and a
// few common blog-sitemap paths) is fetched, parsed, and the last URL segment
// is converted to a topic ("cara-memilih-plakat-akrilik" -> "cara memilih
// plakat akrilik"). Short/non-article slugs are skipped.
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, "..", "..")

function loadCompetitors() {
  try {
    const p = path.join(here, "competitors.json")
    const arr = JSON.parse(fs.readFileSync(p, "utf8"))
    return Array.isArray(arr) ? arr.filter(Boolean) : []
  } catch {
    return []
  }
}

async function fetchText(url, timeout = 12000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; KaryamediaSEO/1.0)" },
    })
    if (!res.ok) return ""
    return await res.text()
  } catch {
    return ""
  } finally {
    clearTimeout(t)
  }
}

export function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim())
}

async function sitemapUrls(domain) {
  const base = domain.startsWith("http") ? domain.replace(/\/+$/, "") : `https://${domain}`
  const candidates = [
    `${base}/sitemap.xml`,
    `${base}/sitemap_index.xml`,
    `${base}/blog/sitemap.xml`,
    `${base}/post-sitemap.xml`,
    `${base}/sitemap-posts.xml`,
  ]
  for (const c of candidates) {
    const xml = await fetchText(c)
    if (!xml) continue
    const locs = extractLocs(xml)
    if (!locs.length) continue
    const subs = locs.filter((l) => l.endsWith(".xml"))
    if (subs.length && subs.length !== locs.length) {
      const urls = []
      for (const s of subs.slice(0, 10)) {
        const sx = await fetchText(s)
        if (sx) urls.push(...extractLocs(sx))
      }
      return urls
    }
    return locs
  }
  return []
}

export function slugToTopic(url) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split("/").filter(Boolean)
    if (!parts.length) return null
    let seg = decodeURIComponent(parts[parts.length - 1]).replace(/\.(html?|php|aspx?)$/i, "")
    if (!seg || seg.endsWith(".xml")) return null
    const words = seg.split(/[-_]+/).filter((w) => w && w.length > 1)
    if (words.length < 3) return null // too short to be an article topic
    const topic = words.join(" ").toLowerCase().trim()
    if (!/[a-z]{3}/.test(topic)) return null
    return topic
  } catch {
    return null
  }
}

export async function competitorTopics() {
  const comps = loadCompetitors()
  if (!comps.length) return []
  const out = []
  const seen = new Set()
  for (const domain of comps) {
    let urls = []
    try {
      urls = await sitemapUrls(domain)
    } catch {
      urls = []
    }
    for (const u of urls.slice(0, 400)) {
      const topic = slugToTopic(u)
      if (!topic || seen.has(topic)) continue
      seen.add(topic)
      out.push({ query: topic, source: domain })
    }
  }
  return out
}
