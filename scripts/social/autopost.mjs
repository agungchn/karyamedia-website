// Panggil endpoint autopost dari mana saja (cron sistem, cron-job.org, dsb).
// Jalankan: node scripts/social/autopost.mjs
// Atau via npm: npm run social:autopost
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_PATH = join(__dirname, "..", "data", "autopost-posted.json")

const SITE_URL = process.env.SITE_URL || "https://karyamediasouvenir.com"
const SECRET = process.env.AUTOPOST_SECRET || ""

// baca state lokal (daftar GUID artikel yg sudah pernah diposting)
let postedGuids = []
if (existsSync(STATE_PATH)) {
  try {
    postedGuids = JSON.parse(readFileSync(STATE_PATH, "utf8"))
  } catch {}
}
const postedParam = postedGuids.length ? `&posted=${postedGuids.join(",")}` : ""

const url = `${SITE_URL}/api/autopost?secret=${SECRET}${postedParam}`

try {
  const res = await fetch(url)
  const text = await res.text()
  console.log(`[autopost] HTTP ${res.status}`)
  console.log(text)
  if (!res.ok) process.exit(1)

  // simpan state terbaru dari response
  const json = JSON.parse(text)
  if (json.nextPosted) {
    writeFileSync(STATE_PATH, JSON.stringify(json.nextPosted))
    console.log(`[autopost] state saved: ${json.nextPosted.length} guid(s)`)
  }
} catch (e) {
  console.error("[autopost] gagal:", e)
  process.exit(1)
}
