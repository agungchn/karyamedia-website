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
const LIMIT = Math.max(1, Number(process.env.AUTOPOST_LIMIT || "3"))

// baca state lokal (daftar GUID artikel yg sudah pernah diposting per platform)
let postedPlatforms = { fb: [], ig: [], li: [] }
if (existsSync(STATE_PATH)) {
  try {
    const data = JSON.parse(readFileSync(STATE_PATH, "utf8"))
    // backward compatibility: jika format lama (array), migrate ke format baru
    if (Array.isArray(data)) {
      postedPlatforms = { fb: data, ig: [], li: [] }
    } else {
      postedPlatforms = data
    }
  } catch {}
}
const postedParam = `&posted=${encodeURIComponent(JSON.stringify(postedPlatforms))}`

const url = `${SITE_URL}/api/autopost?secret=${SECRET}&limit=${LIMIT}${postedParam}`

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
    const fbCount = json.nextPosted.fb?.length || 0
    const igCount = json.nextPosted.ig?.length || 0
    const liCount = json.nextPosted.li?.length || 0
    console.log(`[autopost] state saved: FB=${fbCount}, IG=${igCount}, LI=${liCount}`)
  }
  
  // tampilkan summary per platform
  if (json.posted && json.posted.length > 0) {
    console.log("\n[autopost] Summary:")
    for (const item of json.posted) {
      console.log(`  ${item.title}`)
      console.log(`    FB: ${item.fbStatus || "skipped"}`)
      console.log(`    IG: ${item.igStatus || "skipped"}`)
      console.log(`    LI: ${item.liStatus || "skipped"}`)
    }
  }
} catch (e) {
  console.error("[autopost] gagal:", e)
  process.exit(1)
}
