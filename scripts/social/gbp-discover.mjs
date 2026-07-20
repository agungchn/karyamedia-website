import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ENV_PATH = join(__dirname, "..", "..", ".env.local")

const GBP_CLIENT_ID = process.env.GBP_CLIENT_ID
const GBP_CLIENT_SECRET = process.env.GBP_CLIENT_SECRET
const GBP_REFRESH_TOKEN = process.env.GBP_REFRESH_TOKEN
const SCOPES = "https://www.googleapis.com/auth/business.manage"

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

async function discover(accessToken) {
  const accRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const accJson = await accRes.json()
  if (!accRes.ok) throw new Error(`Get accounts: ${accJson.error?.message || JSON.stringify(accJson)}`)
  const accounts = accJson.accounts
  if (!accounts || accounts.length === 0) throw new Error("No GBP account found")

  const accountName = accounts[0].name
  const accountId = accountName.replace("accounts/", "")
  console.log(`Account: ${accounts[0].accountName} -> ${accountId}`)

  const locRes = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?pageSize=100`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const locJson = await locRes.json()
  if (!locRes.ok) throw new Error(`Get locations: ${locJson.error?.message || JSON.stringify(locJson)}`)
  const locations = locJson.locations
  if (!locations || locations.length === 0) throw new Error("No locations found")

  const locationName = locations[0].name
  const locationId = locationName.replace(`accounts/${accountId}/locations/`, "")

  return { accountId, locationId }
}

async function updateEnv(accountId, locationId) {
  let content = readFileSync(ENV_PATH, "utf8")
  content = content.replace(/^GBP_ACCOUNT_ID=.*$/m, `GBP_ACCOUNT_ID=${accountId}`)
  content = content.replace(/^GBP_LOCATION_ID=.*$/m, `GBP_LOCATION_ID=${locationId}`)
  writeFileSync(ENV_PATH, content, "utf8")
  console.log("\n.env.local updated with GBP_ACCOUNT_ID & GBP_LOCATION_ID")
}

try {
  console.log("Getting access token...")
  const token = await getAccessToken()
  console.log("Discovering GBP account & location...")
  const { accountId, locationId } = await discover(token)
  await updateEnv(accountId, locationId)
  console.log("\nDONE! GBP autopost siap dijalankan.")
} catch (e) {
  console.error("Gagal:", e.message)
  process.exit(1)
}
