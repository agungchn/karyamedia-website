#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from "fs"
import { join, dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const envPath = resolve(__dirname, "..", "..", ".env.local")
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf8").split("\n")
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIdx = trimmed.indexOf("=")
    if (eqIdx === -1) continue
    const key = trimmed.substring(0, eqIdx).trim()
    const val = trimmed.substring(eqIdx + 1).trim()
    const clean = val.replace(/^["']|["']$/g, "")
    if (!process.env[key]) process.env[key] = clean
  }
}

const STATE_PATH = join(__dirname, "..", "..", "data", "autopost-linkedin-posted.json")
const SITE_URL = process.env.SITE_URL || "https://karyamediasouvenir.com"

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
const PERSON_URN = process.env.LINKEDIN_PERSON_URN || "urn:li:person:gJJdD_DcmC"
const LIMIT = Math.max(1, Number(process.env.LINKEDIN_AUTOPOST_LIMIT || "3"))
const DRYRUN = process.env.LINKEDIN_DRYRUN === "1"

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

async function uploadImage(imageUrl) {
  const initRes = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202508",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({ initializeUploadRequest: { owner: PERSON_URN } }),
  })

  if (!initRes.ok) {
    const err = await initRes.json().catch(() => ({}))
    throw new Error(`init upload: ${JSON.stringify(err)}`)
  }

  const { value } = await initRes.json()
  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error(`download image ${imgRes.status}`)
  const buf = await imgRes.arrayBuffer()
  const upRes = await fetch(value.uploadUrl, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: buf })
  if (!upRes.ok) throw new Error(`upload binary ${upRes.status}`)
  return value.image
}

async function postToLinkedIn(item) {
  let clean = item.description
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 300)
  clean = clean.replace(/\b[Ss]ejak\s+2001[,.]?\s*/g, "")

  let commentary = `${item.title}\n\n${clean}`
  if (commentary.length > 3000) commentary = commentary.substring(0, 2997) + "..."

  const body = {
    author: PERSON_URN,
    commentary,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  }

  if (item.image) {
    try {
      const imageUrn = await uploadImage(item.image)
      body.content = {
        article: {
          source: item.link,
          thumbnail: imageUrn,
          title: (item.title || "").substring(0, 200),
          description: clean.substring(0, 250),
        },
      }
    } catch (e) {
      console.log(`  [warning] upload gambar: ${e.message}`)
    }
  }

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202508",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(`LinkedIn ${res.status}: ${json.message || JSON.stringify(json)}`)
  }

  const postId = res.headers.get("x-restli-id") || "published"
  return postId
}

async function main() {
  if (!ACCESS_TOKEN) {
    console.error("[linkedin] ERROR: LINKEDIN_ACCESS_TOKEN wajib di .env.local")
    console.error("[linkedin] Jalankan npm run social:linkedin-setup dulu")
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
    console.error("[linkedin] gagal fetch feed:", e)
    process.exit(1)
  }

  const toPost = items.filter((i) => !postedGuids.includes(i.guid)).slice(0, LIMIT)
  if (toPost.length === 0) {
    console.log("[linkedin] tidak ada artikel baru")
    return
  }

  console.log(`[linkedin] ${toPost.length} artikel baru akan diposting ke profil`)

  if (DRYRUN) {
    for (const item of toPost) {
      console.log(`[linkedin] DRYRUN: ${item.title} -> ${item.link}`)
    }
    return
  }

  for (const item of toPost) {
    try {
      const id = await postToLinkedIn(item)
      console.log(`[linkedin] OK: ${item.title} -> ${id}`)
      postedGuids.push(item.guid)
    } catch (e) {
      console.error(`[linkedin] GAGAL: ${item.title}: ${e}`)
    }
  }

  writeFileSync(STATE_PATH, JSON.stringify(postedGuids))
  console.log(`[linkedin] state saved: ${postedGuids.length} guid(s)`)
}

main().catch((e) => {
  console.error("[linkedin] fatal:", e)
  process.exit(1)
})
