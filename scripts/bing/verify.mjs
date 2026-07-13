// Bing Webmaster Tools verification helper (read/register only by default).
//   node scripts/bing/verify.mjs            # add site + print verification code
//   node scripts/bing/verify.mjs --verify   # call VerifySite (after code is live)
//
// The meta-tag code can be embedded in the Next.js <head> (layout.tsx) and
// deployed, or added as a DNS TXT record `bing-site-verification`. Once the
// code is live on https://karyamediasouvenir.com, run --verify.
import { getBingKey } from "./source.mjs"

const SITE = (process.env.SITE_URL || "https://karyamediasouvenir.com/").replace(/\/?$/, "/")

async function bing(method, key, opts = {}) {
  const params = new URLSearchParams({ siteUrl: SITE, apikey: key })
  if (opts.params) for (const [k, v] of Object.entries(opts.params)) params.set(k, v)
  const url = `https://ssl.bing.com/webmaster/api.svc/json/${method}?${params.toString()}`
  const res = await fetch(url, {
    method: opts.body ? "POST" : "GET",
    headers: opts.body ? { "Content-Type": "application/json; charset=utf-8" } : {},
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { _raw: text.slice(0, 200), _status: res.status }
  }
  return { status: res.status, json }
}

async function main() {
  const key = getBingKey()
  if (!key) {
    console.error("ERROR: BING_API_KEY / scripts/bing/apikey.txt tidak ada.")
    process.exit(1)
  }
  console.log(`Site: ${SITE}`)

  if (process.argv.includes("--verify")) {
    let r = await bing("VerifySite", key, { params: { method: "MetaTag" } })
    console.log("VerifySite(MetaTag) ->", r.status, JSON.stringify(r.json).slice(0, 400))
    if (r.status !== 200) {
      r = await bing("VerifySite", key, { body: { siteUrl: SITE } })
      console.log("VerifySite(POST {siteUrl}) ->", r.status, JSON.stringify(r.json).slice(0, 400))
    }
    return
  }

  const add = await bing("AddSite", key, SITE)
  console.log("AddSite ->", add.status, JSON.stringify(add.json).slice(0, 120))

  const sites = await bing("GetUserSites", key)
  const list = sites.json && sites.json.d ? sites.json.d : []
  console.log("GetUserSites ->", sites.status)
  for (const s of list) {
    console.log(`\nSite: ${s.Url}`)
    console.log(`  IsVerified: ${s.IsVerified}`)
    console.log(`  MetaTag code (content): ${s.AuthenticationCode}`)
    console.log(`  DNS TXT value:         ${s.DnsVerificationCode}`)
  }
  console.log("\nSalin 'Code' di atas, lalu tempel ke <head> via meta tag:")
  console.log(`  <meta name="msvalidate.01" content="<CODE>" />`)
  console.log("Setelah deploy & code live, jalankan: node scripts/bing/verify.mjs --verify")
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})
