// Panggil endpoint autopost dari mana saja (cron sistem, cron-job.org, dsb).
// Jalankan: node scripts/social/autopost.mjs
// Atau via npm: npm run social:autopost
const SITE_URL = process.env.SITE_URL || "https://karyamediasouvenir.com"
const SECRET = process.env.AUTOPOST_SECRET || ""
const url = `${SITE_URL}/api/autopost${SECRET ? `?secret=${SECRET}` : ""}`

try {
  const res = await fetch(url)
  const text = await res.text()
  console.log(`[autopost] HTTP ${res.status}`)
  console.log(text)
  if (!res.ok) process.exit(1)
} catch (e) {
  console.error("[autopost] gagal:", e)
  process.exit(1)
}
