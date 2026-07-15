import { articles } from "@/data/articles"
import { NextResponse } from "next/server"

const SITE_URL = "https://karyamediasouvenir.com"

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
      const pubDate = new Date(a.date).toUTCString()
      return `    <item>
      <title>${xmlEscape(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xmlEscape(a.description)}</description>
      <category>${xmlEscape(a.category)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
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
