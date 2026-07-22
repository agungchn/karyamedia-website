import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..", "..")
const ENV_PATH = join(root, ".env.local")

// Baca dari .env.local
function getEnv(key) {
  const txt = readFileSync(ENV_PATH, "utf8")
  const m = txt.match(new RegExp(key + "=(.*)"))
  return m ? m[1].trim() : ""
}

const CLIENT_ID = getEnv("GBP_CLIENT_ID")
const CLIENT_SECRET = getEnv("GBP_CLIENT_SECRET")
const REFRESH_TOKEN = getEnv("GBP_REFRESH_TOKEN")

async function getAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`Token gagal: ${json.error} - ${json.error_description || ""}`)
  console.log("✅ Access token OK")
  return json.access_token
}

async function discoverGBP(accessToken) {
  // Step 1: Cari accounts (dengan retry untuk rate limit)
  console.log("\n🔍 Mencari GBP accounts...")
  let accRes, accJson
  for (let attempt = 1; attempt <= 5; attempt++) {
    accRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const text = await accRes.text()
    if (accRes.ok) {
      accJson = JSON.parse(text)
      break
    }
    if (accRes.status === 429) {
      const wait = attempt * 20
      console.log(`  Rate limit (429), tunggu ${wait} detik (percobaan ${attempt}/5)...`)
      await new Promise(r => setTimeout(r, wait * 1000))
      continue
    }
    // Error lain
    try { accJson = JSON.parse(text) } catch { accJson = {} }
    break
  }
  if (!accJson || !accJson.accounts) {
    throw new Error(`Gagal get accounts: ${accJson.error?.message || JSON.stringify(accJson)}`)
  }
  const accounts = accJson.accounts
  if (!accounts || accounts.length === 0) {
    throw new Error("Tidak ada GBP account ditemukan. Pastikan quota sudah disetujui.")
  }

  console.log(`Ditemukan ${accounts.length} account(s):`)
  for (let i = 0; i < accounts.length; i++) {
    const a = accounts[i]
    const id = a.name.replace("accounts/", "")
    console.log(`  [${i}] ${a.accountName} -> ID: ${id}`)
  }

  // Pilih account pertama
  const accountName = accounts[0].name
  const accountId = accountName.replace("accounts/", "")
  console.log(`\n✅ Account: ${accounts[0].accountName}`)
  console.log(`   Account ID: ${accountId}`)

  // Step 2: Cari locations
  console.log("\n🔍 Mencari locations...")
  const locRes = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations?pageSize=100`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  const locJson = await locRes.json()
  if (!locRes.ok) {
    throw new Error(`Gagal get locations: ${locJson.error?.message || JSON.stringify(locJson)}`)
  }
  const locations = locJson.locations
  if (!locations || locations.length === 0) {
    throw new Error("Tidak ada location ditemukan.")
  }

  console.log(`Ditemukan ${locations.length} location(s):`)
  for (let i = 0; i < locations.length; i++) {
    const l = locations[i]
    const lid = l.name.replace(`accounts/${accountId}/locations/`, "")
    console.log(`  [${i}] ${l.locationName} -> ID: ${lid}`)
  }

  const locationName = locations[0].name
  const locationId = locationName.replace(`accounts/${accountId}/locations/`, "")
  console.log(`\n✅ Location: ${locations[0].locationName}`)
  console.log(`   Location ID: ${locationId}`)

  return { accountId, locationId }
}

function updateEnvFile(accountId, locationId) {
  let existing = readFileSync(ENV_PATH, "utf8")
  
  // Hapus baris GBP_ACCOUNT_ID & GBP_LOCATION_ID lama
  const lines = existing.split("\n").filter(l => {
    const key = l.split("=")[0].trim()
    return key !== "GBP_ACCOUNT_ID" && key !== "GBP_LOCATION_ID"
  })

  // Tambah baris baru setelah GBP_AUTOPOST_LIMIT
  const result = []
  let added = false
  for (const line of lines) {
    result.push(line)
    if (line.startsWith("GBP_AUTOPOST_LIMIT") && !added) {
      result.push(`GBP_ACCOUNT_ID=${accountId}`)
      result.push(`GBP_LOCATION_ID=${locationId}`)
      added = true
    }
  }
  if (!added) {
    result.push(`GBP_ACCOUNT_ID=${accountId}`)
    result.push(`GBP_LOCATION_ID=${locationId}`)
  }

  writeFileSync(ENV_PATH, result.join("\n"), "utf8")
  console.log("\n✅ .env.local updated dengan Account ID & Location ID!")
}

async function main() {
  console.log("=== GBP Auto Discovery ===\n")
  
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error("❌ GBP_CLIENT_ID, GBP_CLIENT_SECRET, atau GBP_REFRESH_TOKEN belum diisi di .env.local")
    process.exit(1)
  }
  
  console.log("Client ID: " + CLIENT_ID.slice(0, 8) + "...")
  console.log("Refresh Token: " + REFRESH_TOKEN.slice(0, 10) + "...")

  try {
    const token = await getAccessToken()
    const { accountId, locationId } = await discoverGBP(token)
    updateEnvFile(accountId, locationId)
    console.log("\n🎉 GBP setup selesai! Sekarang autopost siap digunakan.")
    console.log("\nCoba jalankan: npm run social:gbp")
  } catch (e) {
    console.error(`\n❌ Error: ${e.message}`)
    if (e.message.includes("quota")) {
      console.log("\n📋 Kemungkinan penyebab:")
      console.log("  1. Quota My Business API belum disetujui Google")
      console.log("  2. Buka https://console.cloud.google.com/apis/api/mybusiness.googleapis.com/quotas")
      console.log("  3. Klik 'Request additional quota' dan isi formulir")
      console.log("  4. Butuh beberapa hari ~ minggu untuk approval")
    }
  }
}

main()
