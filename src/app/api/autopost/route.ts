import { NextRequest, NextResponse } from "next/server"

const SITE_URL = process.env.SITE_URL || "https://karyamediasouvenir.com"
const FB_PAGE_ID = process.env.FB_PAGE_ID
const FB_PAGE_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN
const IG_USER_ID = process.env.IG_USER_ID
const SECRET = process.env.AUTOPOST_SECRET
const DRYRUN = process.env.AUTOPOST_DRYRUN === "1"
const GRAPH = "https://graph.facebook.com/v21.0"

const LI_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
const LI_PERSON_URN = process.env.LINKEDIN_PERSON_URN || "urn:li:person:gJJdD_DcmC"

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
  // Urutkan dari artikel tertua ke terbaru supaya share harian berurutan
  // (artikel terlama yang belum diposting dipilih lebih dulu).
  items.sort(
    (a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime()
  )
  return items
}

function cleanDesc(d: string): string {
  return d.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim().replace(/\b[Ss]ejak\s+2001[,.]?\s*/g, "")
}

// ---- Meta Graph API ----
async function postToFacebook(item: FeedItem): Promise<string> {
  const caption = `${item.title}\n\n${cleanDesc(item.description)}\n\n${item.link}`
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
  const caption = `${item.title}\n\n${cleanDesc(item.description)}\n\nBaca selengkapnya:\n${item.link}\n\n#KaryamediaSouvenir #SouvenirJogja #PlakatCustom #PrasastiCustom`
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

// ---- LinkedIn API ----
async function uploadLinkedInImage(imageUrl: string): Promise<string> {
  const initRes = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LI_TOKEN}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202508",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({ initializeUploadRequest: { owner: LI_PERSON_URN } }),
  })
  if (!initRes.ok) throw new Error(`LI init upload ${initRes.status}`)
  const { value } = await initRes.json()
  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error(`LI dl image ${imgRes.status}`)
  const buf = await imgRes.arrayBuffer()
  const upRes = await fetch(value.uploadUrl, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: buf })
  if (!upRes.ok) throw new Error(`LI upload ${upRes.status}`)
  return value.image
}

async function postToLinkedIn(item: FeedItem): Promise<string> {
  const clean = cleanDesc(item.description).substring(0, 300)
  const commentary = `${item.title}\n\n${clean}`.substring(0, 3000)
  const body: Record<string, unknown> = {
    author: LI_PERSON_URN,
    commentary,
    visibility: "PUBLIC",
    distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  }
  if (item.image) {
    try {
      const imageUrn = await uploadLinkedInImage(item.image)
      body.content = { article: { source: item.link, thumbnail: imageUrn, title: item.title.substring(0, 200), description: clean.substring(0, 250) } }
    } catch { /* fallback ke text-only */ }
  }
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LI_TOKEN}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202508",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(`LI ${res.status}: ${(json as Record<string, string>).message || JSON.stringify(json)}`)
  }
  return res.headers.get("x-restli-id") || "published"
}

export async function GET(req: NextRequest) {
  if (SECRET && req.nextUrl.searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
    if (!LI_TOKEN) {
      return NextResponse.json(
        { error: "FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN dan LINKEDIN_ACCESS_TOKEN belum di-set" },
        { status: 500 }
      )
    }
  }

  const reqLimit = Number(req.nextUrl.searchParams.get("limit"))
  const limit = Math.max(
    1,
    (Number.isFinite(reqLimit) && reqLimit) ||
      Number(process.env.AUTOPOST_LIMIT || "3")
  )

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
  const postedPlatforms = postedRaw ? JSON.parse(postedRaw) : { fb: [], ig: [], li: [] }

  const toPost = items.filter((i) => {
    const fbDone = postedPlatforms.fb?.includes(i.guid)
    const igDone = postedPlatforms.ig?.includes(i.guid)
    const liDone = postedPlatforms.li?.includes(i.guid)
    return !(fbDone && igDone && liDone)
  }).slice(0, limit)

  if (toPost.length === 0) {
    return NextResponse.json({ message: "tidak ada artikel baru", posted: [], nextPosted: postedPlatforms })
  }

  const results: Array<Record<string, unknown>> = []
  const updatedPosted = {
    fb: [...(postedPlatforms.fb || [])],
    ig: [...(postedPlatforms.ig || [])],
    li: [...(postedPlatforms.li || [])],
  }

  for (const item of toPost) {
    const r: Record<string, unknown> = { title: item.title, link: item.link }
    if (DRYRUN) {
      r.dryrun = true
      results.push(r)
      continue
    }

    const fbDone = updatedPosted.fb.includes(item.guid)
    const igDone = updatedPosted.ig.includes(item.guid)
    const liDone = updatedPosted.li.includes(item.guid)

    try {
      // Facebook
      if (!fbDone && FB_PAGE_ID && FB_PAGE_TOKEN) {
        try {
          r.fb = await postToFacebook(item)
          updatedPosted.fb.push(item.guid)
          r.fbStatus = "success"
        } catch (e) {
          r.fbError = String(e)
          r.fbStatus = "failed"
        }
      } else if (fbDone) {
        r.fbStatus = "already_posted"
      }

      // Instagram
      if (!igDone && IG_USER_ID && FB_PAGE_TOKEN) {
        try {
          r.ig = await postToInstagram(item)
          updatedPosted.ig.push(item.guid)
          r.igStatus = "success"
        } catch (e) {
          r.igError = String(e)
          r.igStatus = "failed"
        }
      } else if (igDone) {
        r.igStatus = "already_posted"
      }

      // LinkedIn
      if (!liDone && LI_TOKEN) {
        try {
          r.li = await postToLinkedIn(item)
          updatedPosted.li.push(item.guid)
          r.liStatus = "success"
        } catch (e) {
          r.liError = String(e)
          r.liStatus = "failed"
        }
      } else if (liDone) {
        r.liStatus = "already_posted"
      }
    } catch (e) {
      r.error = String(e)
    }
    results.push(r)
  }

  return NextResponse.json({ message: "ok", posted: results, nextPosted: updatedPosted })
}
