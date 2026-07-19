import { articles } from "@/data/articles"
import { NextResponse } from "next/server"

const SITE_URL = "https://karyamediasouvenir.co.id"

export const dynamic = "force-static"

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function GET() {
  const sorted = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1))

  const items = sorted
    .map((a) => {
      const url = `${SITE_URL}/blog/${a.slug}`
      const image = a.image?.startsWith("http")
        ? a.image
        : `${SITE_URL}${a.image}`
      const pubDate = new Date(a.date).toUTCString()
      const ext = image.split('.').pop()?.toLowerCase() || 'jpg'
      const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
      return `    <item>
      <title>${xmlEscape(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xmlEscape(a.description)}</description>
      <category>${xmlEscape(a.category)}</category>
      <enclosure url="${xmlEscape(image)}" length="0" type="${mime}" />
      <media:content url="${xmlEscape(image)}" medium="image" type="${mime}" />
      <pubDate>${pubDate}</pubDate>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Karyamedia Souvenir</title>
    <link>${SITE_URL}</link>
    <description>Artikel seputar plakat, prasasti, medali, piala, dan souvenir custom dari Karyamedia Yogyakarta sejak 2001.</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
