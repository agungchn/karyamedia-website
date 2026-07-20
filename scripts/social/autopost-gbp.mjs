#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_PATH = join(__dirname, "..", "..", "data", "autopost-gbp-posted.json")
const SITE_URL = process.env.SITE_URL || "https://karyamediasouvenir.com"

const GBP_CLIENT_ID = process.env.GBP_CLIENT_ID
const GBP_CLIENT_SECRET = process.env.GBP_CLIENT_SECRET
const GBP_REFRESH_TOKEN = process.env.GBP_REFRESH_TOKEN
const GBP_ACCOUNT_ID = process.env.GBP_ACCOUNT_ID
const GBP_LOCATION_ID = process.env.GBP_LOCATION_ID

const LIMIT = Math.max(1, Number(process.env.GBP_AUTOPOST_LIMIT || "3"))
const DRYRUN = process.env.GBP_DRYRUN === "1"

async function getAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GBP_CLIENT_ID,
      client_secret: GBP_CLIENT_SECRET,
      refresh_token: GBP_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`token refresh gagal: ${json.error} - ${json.error_description || ""}`)
  return json.access_token
}

async function postToGBP(item, accessToken) {
  const clean = item.description.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").substring(0, 1500)

  const body = {
    languageCode: "id-ID",
    summary: `${item.title}\n\n${clean}`,
    callToAction: {
      actionType: "LEARN_MORE",
      url: item.link,
    },
    topicType: "STANDARD",
  }

  if (item.image) {
    body.media = [{ mediaFormat: "PHOTO", sourceUrl: item.image }]
  }

  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}/localPosts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )
  const json = await res.json()
  if (!res.ok) throw new Error(`GBP: ${json.error?.message || JSON.stringify(json)}`)
  return json.name
}

function unescapeXml(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
}

function parseFeed(xml) {
  const items = []
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  let m
  while ((m = itemRe.exec(xml))) {
    const block = m[1]
    const get = (tag) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
      const mm = block.match(r)
      return mm ? unescapeXml(mm[1].trim()) : ""
    }
    const link = get("link")
    if (!link) continue
    items.push({
      title: get("title"),
      link,
      guid: get("guid") || link,
      description: get("description"),
      image: get("image") || (block.match(/<enclosure[^>]+url="([^"]+)"/) ? unescapeXml(block.match(/<enclosure[^>]+url="([^"]+)"/)[1]) : ""),
      pubDate: get("pubDate"),
    })
  }
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  return items
}

async function main() {
  if (!GBP_CLIENT_ID || !GBP_CLIENT_SECRET || !GBP_REFRESH_TOKEN || !GBP_ACCOUNT_ID || !GBP_LOCATION_ID) {
    console.error("[gbp] ERROR: GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN, GBP_ACCOUNT_ID, GBP_LOCATION_ID wajib di .env.local")
    console.error("[gbp] Lihat scripts/social/get-gbp-tokens.ps1 untuk panduan setup")
    process.exit(1)
  }

  let postedGuids = []
  if (existsSync(STATE_PATH)) {
    try { postedGuids = JSON.parse(readFileSync(STATE_PATH, "utf8")) } catch {}
  }

  let items
  try {
    const res = await fetch(`${SITE_URL}/feed.xml`, { cache: "no-store" })
    items = parseFeed(await res.text())
  } catch (e) {
    console.error("[gbp] gagal fetch feed:", e)
    process.exit(1)
  }

  const toPost = items.filter((i) => !postedGuids.includes(i.guid)).slice(0, LIMIT)
  if (toPost.length === 0) {
    console.log("[gbp] tidak ada artikel baru")
    return
  }

  console.log(`[gbp] ${toPost.length} artikel baru akan diposting ke GBP`)

  if (DRYRUN) {
    for (const item of toPost) {
      console.log(`[gbp] DRYRUN: ${item.title} -> ${item.link}`)
    }
    return
  }

  let accessToken
  try {
    accessToken = await getAccessToken()
  } catch (e) {
    console.error("[gbp] gagal refresh token:", e)
    process.exit(1)
  }

  for (const item of toPost) {
    try {
      const name = await postToGBP(item, accessToken)
      console.log(`[gbp] OK: ${item.title} -> ${name}`)
      postedGuids.push(item.guid)
    } catch (e) {
      console.error(`[gbp] GAGAL: ${item.title}: ${e}`)
    }
  }

  writeFileSync(STATE_PATH, JSON.stringify(postedGuids))
  console.log(`[gbp] state saved: ${postedGuids.length} guid(s)`)
}

main().catch((e) => {
  console.error("[gbp] fatal:", e)
  process.exit(1)
})
