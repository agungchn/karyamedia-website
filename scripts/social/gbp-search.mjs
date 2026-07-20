import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ENV_PATH = join(__dirname, "..", "..", ".env.local")

const GBP_CLIENT_ID = process.env.GBP_CLIENT_ID
const GBP_CLIENT_SECRET = process.env.GBP_CLIENT_SECRET
const GBP_REFRESH_TOKEN = process.env.GBP_REFRESH_TOKEN

async function getAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GBP_CLIENT_ID,
      client_secret: GBP_CLIENT_SECRET,
      refresh_token: GBP_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`token refresh gagal: ${json.error} - ${json.error_description || ""}`)
  return json.access_token
}

async function searchLocation(token, query) {
  const res = await fetch("https://mybusinessbusinessinformation.googleapis.com/v1/googleLocations:search", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      location: { businessName: query.name, address: { regionCode: "ID", locality: query.city } },
      regionCode: "ID",
    }),
  })
  const json = await res.json()
  if (!res.ok) {
    const msg = json.error?.message || JSON.stringify(json)
    throw new Error(`searchLocation: ${msg}`)
  }
  return json
}

async function getAccountByLocation(token, locationName) {
  const res = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) {
    const msg = json.error?.message || JSON.stringify(json)
    throw new Error(`getAccounts: ${msg}`)
  }
  return json
}

const queries = [
  { name: "Karyamedia Souvenir", city: "Denpasar" },
  { name: "Karyamedia Souvenir Bali", city: "Badung" },
  { name: "Karya Media Souvenir", city: "Denpasar" },
  { name: "Souvenir Khas Bali", city: "Denpasar" },
]

try {
  const token = await getAccessToken()
  console.log("Token OK")

  for (const q of queries) {
    console.log(`\nSearching: "${q.name}" di ${q.city}...`)
    try {
      const result = await searchLocation(token, q)
      const locations = result.matchingGoogleLocations || []
      if (locations.length === 0) {
        console.log("  Tidak ditemukan")
        continue
      }
      for (const loc of locations) {
        const l = loc.location
        console.log(`  ${l.locationName || l.businessName}`)
        console.log(`    Name: ${l.name}`)
        if (l.name) {
          const parts = l.name.match(/accounts\/(\d+)\/locations\/(\d+)/)
          if (parts) {
            console.log(`    Account ID: ${parts[1]}`)
            console.log(`    Location ID: ${parts[2]}`)
          }
        }
        if (l.metadata?.mapsUri) console.log(`    Maps: ${l.metadata.mapsUri}`)
      }
      // found something, stop
      if (locations.length > 0) break
    } catch (e) {
      console.log(`  Error: ${e.message}`)
    }
  }
} catch (e) {
  console.error("Gagal:", e.message)
}
