import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const SITE_URL = process.env.SITE_URL || "https://karyamediasouvenir.com"
const FB_PAGE_ID = process.env.FB_PAGE_ID
const FB_PAGE_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN
const IG_USER_ID = process.env.IG_USER_ID
const SECRET = process.env.AUTOPOST_SECRET
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ""
const CHAT_ID = "1998667945"

async function sendTelegram(text: string) {
  if (!BOT_TOKEN) return
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    })
  } catch { /* not critical */ }
}
const LIMIT = Math.max(1, Number(process.env.AUTOPOST_LIMIT || "3"))
const DRYRUN = process.env.AUTOPOST_DRYRUN === "1"
const GRAPH = "https://graph.facebook.com/v21.0"

const STORE_PATH = path.join(process.cwd(), "data", "autopost-posted.json")
const KV_URL = process.env.AUTOPOST_STATE_URL || process.env.UPSTASH_REDIS_REST_URL
const KV_TOKEN = process.env.AUTOPOST_STATE_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

export const dynamic = "force-dynamic"

interface FeedItem {
  title: string
  link: string
  guid: string
  description: string
  image: string
  pubDate: string
}

function unescapeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function parseFeed(xml: string): FeedItem[] {
  const items: FeedItem[] = []
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  let m: RegExpExecArray | null
  while ((m = itemRe.exec(xml))) {
    const block = m[1]
    const get = (tag: string): string => {
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
      image: get("image") || (block.match(/<enclosure[^>]+url="([^"]+)"/) ? unescapeXml(block.match(/<enclosure[^>]+url="([^"]+)"/)![1]) : ""),
      pubDate: get("pubDate"),
    })
  }
  items.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )
  return items
}

// ---- persistent store (dedupe) ----
async function getPosted(): Promise<Set<string>> {
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/autopost_posted`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
      })
      const json = await res.json()
      if (json.result) return new Set(JSON.parse(json.result))
    } catch (e) {
      console.error("KV get failed:", e)
    }
    return new Set()
  }
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8")
    return new Set(JSON.parse(raw))
  } catch {
    return new Set()
  }
}

async function markPosted(guid: string): Promise<void> {
  const set = await getPosted()
  set.add(guid)
  const arr = JSON.stringify([...set])
  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/set/autopost_posted/${encodeURIComponent(arr)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
      })
    } catch (e) {
      console.error("KV set failed:", e)
    }
    return
  }
  try {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true })
    await fs.writeFile(STORE_PATH, arr)
  } catch (e) {
    console.error("local store write failed:", e)
  }
}

// ---- Meta Graph API ----
async function postToFacebook(item: FeedItem): Promise<string> {
  const caption = `${item.title}\n\n${item.description}\n\n${item.link}`
  // Facebook /photos requires the image uploaded as a file (multipart),
  // not just a URL. Download it first, then upload.
  const imgRes = await fetch(item.image)
  if (!imgRes.ok) throw new Error(`FB image fetch gagal: ${imgRes.status}`)
  const blob = await imgRes.blob()
  const fd = new FormData()
  fd.append("source", blob, "cover.png")
  fd.append("message", caption)
  fd.append("access_token", FB_PAGE_TOKEN as string)
  const res = await fetch(`${GRAPH}/${FB_PAGE_ID}/photos`, {
    method: "POST",
    body: fd,
  })
  const json = await res.json()
  if (json.error) throw new Error(`FB: ${json.error.message}`)
  return json.id
}

async function postToInstagram(item: FeedItem): Promise<string> {
  const caption = `${item.title}\n\n${item.description}\n\nBaca selengkapnya:\n${item.link}\n\n#KaryamediaSouvenir #SouvenirJogja #PlakatCustom #PrasastiCustom`
  const cUrl = new URL(`${GRAPH}/${IG_USER_ID}/media`)
  cUrl.searchParams.set("image_url", encodeURI(item.image))
  cUrl.searchParams.set("caption", caption)
  cUrl.searchParams.set("access_token", FB_PAGE_TOKEN as string)
  const cRes = await fetch(cUrl, { method: "POST" })
  const cJson = await cRes.json()
  if (cJson.error) throw new Error(`IG container: ${cJson.error.message}`)
  const creationId = cJson.id

  // wait for container to finish (images are usually immediate)
  for (let i = 0; i < 10; i++) {
    const sRes = await fetch(
      `${GRAPH}/${creationId}?fields=status_code&access_token=${FB_PAGE_TOKEN}`,
      { cache: "no-store" }
    )
    const sJson = await sRes.json()
    if (sJson.status_code === "FINISHED") break
    if (sJson.status_code === "ERROR")
      throw new Error(`IG container error: ${sJson.status_code}`)
    await new Promise((r) => setTimeout(r, 2000))
  }

  const pUrl = new URL(`${GRAPH}/${IG_USER_ID}/media_publish`)
  pUrl.searchParams.set("creation_id", creationId)
  pUrl.searchParams.set("access_token", FB_PAGE_TOKEN as string)
  const pRes = await fetch(pUrl, { method: "POST" })
  const pJson = await pRes.json()
  if (pJson.error) throw new Error(`IG publish: ${pJson.error.message}`)
  return pJson.id
}

export async function GET(req: NextRequest) {
  if (SECRET && req.nextUrl.searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
    return NextResponse.json(
      { error: "FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN belum di-set" },
      { status: 500 }
    )
  }

  let items: FeedItem[] = []
  try {
    const res = await fetch(`${SITE_URL}/feed.xml`, { cache: "no-store" })
    items = parseFeed(await res.text())
  } catch (e) {
    return NextResponse.json(
      { error: `gagal fetch feed: ${String(e)}` },
      { status: 500 }
    )
  }

  const posted = await getPosted()
  const toPost = items.filter((i) => !posted.has(i.guid)).slice(0, LIMIT)

  if (toPost.length === 0) {
    return NextResponse.json({ message: "tidak ada artikel baru", posted: [] })
  }

  await sendTelegram(`📢 <b>Autopost: ${toPost.length} artikel</b> akan diposting ke FB/IG`)

  const results: Array<Record<string, unknown>> = []
  for (const item of toPost) {
    const r: Record<string, unknown> = { title: item.title, link: item.link }
    if (DRYRUN) {
      r.dryrun = true
      results.push(r)
      continue
    }
    try {
      if (FB_PAGE_ID && FB_PAGE_TOKEN) r.fb = await postToFacebook(item)
      if (IG_USER_ID && FB_PAGE_TOKEN) {
        try {
          r.ig = await postToInstagram(item)
        } catch (e) {
          r.igError = String(e)
        }
      }
      await markPosted(item.guid)
    } catch (e) {
      r.error = String(e)
    }
    results.push(r)
  }

  const ok = results.filter((r) => r.fb || r.ig).length
  const fail = results.filter((r) => r.error || r.igError).length
  const lines = results.map((r) => {
    let s = `• ${r.title}`
    if (r.fb) s += " ✅FB"
    if (r.ig) s += " ✅IG"
    if (r.error) s += " ❌FB"
    if (r.igError) s += " ❌IG"
    return s
  })
  await sendTelegram(`✅ <b>Autopost Selesai</b> (${ok} ok, ${fail} gagal)\n${lines.join("\n")}`)

  return NextResponse.json({ message: "ok", posted: results })
}
