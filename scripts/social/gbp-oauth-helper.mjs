import { createServer } from "http"
import { writeFileSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ENV_PATH = join(__dirname, "..", "..", ".env.local")

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""
const REDIRECT_URI = "http://localhost:8080"
const SCOPES = "https://www.googleapis.com/auth/business.manage"

async function exchangeCode(code) {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  })
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`${json.error}: ${json.error_description || ""}`)
  return json
}

async function discoverGBP(accessToken) {
  const accRes = await fetch("https://mybusiness.googleapis.com/v4/accounts", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const accJson = await accRes.json()
  if (!accRes.ok) throw new Error(`Get accounts: ${accJson.error?.message || JSON.stringify(accJson)}`)
  const accounts = accJson.accounts
  if (!accounts || accounts.length === 0) throw new Error("No GBP account found")

  const accountName = accounts[0].name
  const accountId = accountName.replace("accounts/", "")
  console.log(`[gbp] Account: ${accounts[0].accountName} -> ${accountId}`)

  const locRes = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations?pageSize=100`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const locJson = await locRes.json()
  if (!locRes.ok) throw new Error(`Get locations: ${locJson.error?.message || JSON.stringify(locJson)}`)
  const locations = locJson.locations
  if (!locations || locations.length === 0) throw new Error("No locations found")

  const locationName = locations[0].name
  const locationId = locationName.replace(`accounts/${accountId}/locations/`, "")
  console.log(`[gbp] Location: ${locations[0].locationName} -> ${locationId}`)

  return { accountId, locationId, accountName: accounts[0].accountName, locationName: locations[0].locationName }
}

function updateEnvFile(envVars) {
  let existing = ""
  try { existing = readFileSync(ENV_PATH, "utf8") } catch {}

  const lines = existing.split("\n").filter(l => {
    const key = l.split("=")[0]
    return !key.startsWith("GBP_") && key !== ""
  })

  for (const [k, v] of Object.entries(envVars)) {
    lines.push(`${k}=${v}`)
  }
  lines.push("")

  writeFileSync(ENV_PATH, lines.join("\n"), "utf8")
  console.log(`[gbp] .env.local updated`)
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI)
  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")

  if (error) {
    res.writeHead(400, { "Content-Type": "text/html" })
    res.end(`<h1>Error: ${error}</h1><p>Silakan coba lagi.</p>`)
    return
  }

  if (!code) {
    res.writeHead(200, { "Content-Type": "text/html" })
    res.end(`<h1>Waiting for authorization...</h1><script>location.href="${authUrl}"</script>`)
    return
  }

  res.writeHead(200, { "Content-Type": "text/html" })
  res.end(`<h1>Token received!</h1><p>Silakan tutup tab ini dan kembali ke terminal.</p>`)

  console.log("[gbp] Code received, exchanging for tokens...")

  try {
    const tokens = await exchangeCode(code)
    if (!tokens.refresh_token) {
      console.error("[gbp] ERROR: No refresh_token! Hapus akses di https://myaccount.google.com/permissions lalu coba lagi.")
      server.close()
      process.exit(1)
    }
    console.log("[gbp] Access token OK")
    console.log("[gbp] Refresh token OK")

    let accountId = ""
    let locationId = ""
    try {
      console.log("[gbp] Discovering GBP account & location...")
      const result = await discoverGBP(tokens.access_token)
      accountId = result.accountId
      locationId = result.locationId
      console.log(`[gbp] Found: ${result.accountName} / ${result.locationName}`)
    } catch (e) {
      console.warn("[gbp] Discovery gagal (kemungkinan quota blm disetujui). Token tetap disimpan.")
      console.warn("[gbp] Nanti isi GBP_ACCOUNT_ID & GBP_LOCATION_ID manual setelah quota OK.")
    }

    updateEnvFile({
      GBP_CLIENT_ID: CLIENT_ID,
      GBP_CLIENT_SECRET: CLIENT_SECRET,
      GBP_REFRESH_TOKEN: tokens.refresh_token,
      GBP_ACCOUNT_ID: accountId,
      GBP_LOCATION_ID: locationId,
      GBP_AUTOPOST_LIMIT: "3",
    })

    console.log("[gbp] DONE! .env.local sudah diupdate.")
    if (!accountId) {
      console.log("[gbp] >>> SETELAH quota disetujui, jalankan ulang: node scripts/social/gbp-oauth-helper.mjs")
      console.log("[gbp] >>> untuk deteksi account & location ID secara otomatis.")
    }
  } catch (e) {
    console.error("[gbp] Gagal:", e)
  }

  server.close()
})

const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}&access_type=offline&prompt=consent`

server.listen(8080, () => {
  console.log("[gbp] Server listening on http://localhost:8080")
  console.log("[gbp] Buka URL ini di browser:")
  console.log(authUrl)
})
