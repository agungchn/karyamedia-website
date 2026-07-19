import { NextRequest, NextResponse } from "next/server"

const SITE_URL = process.env.SITE_URL || "https://karyamediasouvenir.com"
const FB_PAGE_ID = process.env.FB_PAGE_ID
const FB_PAGE_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN
const IG_USER_ID = process.env.IG_USER_ID
const SECRET = process.env.AUTOPOST_SECRET
const LIMIT = Math.max(1, Number(process.env.AUTOPOST_LIMIT || "3"))
const DRYRUN = process.env.AUTOPOST_DRYRUN === "1"
const GRAPH = "https://graph.facebook.com/v21.0"

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

  const postedRaw = req.nextUrl.searchParams.get("posted") || ""
  const posted = new Set(postedRaw ? postedRaw.split(",") : [])

  const toPost = items.filter((i) => !posted.has(i.guid)).slice(0, LIMIT)

  if (toPost.length === 0) {
    return NextResponse.json({ message: "tidak ada artikel baru", posted: [], nextPosted: [...posted] })
  }

  const results: Array<Record<string, unknown>> = []
  const updatedPosted = new Set(posted)
  for (const item of toPost) {
    const r: Record<string, unknown> = { title: item.title, link: item.link }
    if (DRYRUN) {
      r.dryrun = true
      results.push(r)
      continue
    }
    try {
      if (FB_PAGE_ID && FB_PAGE_TOKEN) {
        r.fb = await postToFacebook(item)
        updatedPosted.add(item.guid)
      }
      if (IG_USER_ID && FB_PAGE_TOKEN) {
        try {
          r.ig = await postToInstagram(item)
        } catch (e) {
          r.igError = String(e)
        }
      }
    } catch (e) {
      r.error = String(e)
    }
    results.push(r)
  }

  return NextResponse.json({ message: "ok", posted: results, nextPosted: [...updatedPosted] })
}
