// Submit new article URLs to IndexNow (Bing + partners) for instant crawling.
// Google is progressively adopting IndexNow too. Requires a hosted key file
// in /public (the file name == key, content == key).
//
//   node scripts/seo/indexnow.mjs <slug1> [slug2 ...]
//   SITE_URL=... node scripts/seo/indexnow.mjs medali-resin-custom
//
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")

const KEY = "7541da6c-855c-4178-a3e7-278400039b50"
const KEY_FILE = `${KEY}.txt`
const SITE = process.env.SITE_URL || "https://karyamediasouvenir.com"
const KEY_LOCATION = `${SITE}/${KEY_FILE}`

const slugs = process.argv.slice(2)
if (!slugs.length) {
  console.error("Pakai: node scripts/seo/indexnow.mjs <slug1> [slug2 ...]")
  process.exit(1)
}

// sanity: pastikan key file ada & bisa dibaca
try {
  const onDisk = readFileSync(join(root, "public", KEY_FILE), "utf8").trim()
  if (onDisk !== KEY) {
    console.error(`Key file tidak cocok (${KEY_FILE}).`)
    process.exit(1)
  }
} catch {
  console.error(`Key file tidak ditemukan: public/${KEY_FILE}`)
  process.exit(1)
}

const urlList = slugs.map((s) => `${SITE}/blog/${s}`)

async function main() {
  console.log("IndexNow submit:", urlList.join(", "))
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  })
  const text = await res.text()
  console.log(`HTTP ${res.status}: ${text.slice(0, 200)}`)
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})
