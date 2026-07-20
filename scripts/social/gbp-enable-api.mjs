import { createPrivateKey, sign } from "crypto"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const credPath = join(__dirname, "..", "gsc", "credentials.json")
const { client_email, private_key } = JSON.parse(readFileSync(credPath, "utf8"))

async function getAccessToken() {
  const header = { alg: "RS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }

  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url")
  const signInput = `${b64(header)}.${b64(claim)}`

  const key = createPrivateKey({ key: private_key, format: "pem", type: "pkcs8" })
  const sigBuf = sign("RSA-SHA256", Buffer.from(signInput), key)
  const sig = Buffer.from(sigBuf).toString("base64url")

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signInput}.${sig}`,
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`token: ${json.error} - ${json.error_description || ""}`)
  return json.access_token
}

async function enableApi(accessToken, serviceName) {
  const url = `https://serviceusage.googleapis.com/v1/projects/karyamedia-souvenir/services/${serviceName}:enable`
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  })
  const json = await res.json()
  if (res.ok) {
    console.log(`[OK] ${serviceName} enabled`)
  } else if (res.status === 403 && json.error?.status === "PERMISSION_DENIED") {
    console.log(`[SKIP] ${serviceName}: service account tidak punya izin`)
    return false
  } else {
    console.log(`[FAIL] ${serviceName}: ${json.error?.message || res.status}`)
    return false
  }
  return true
}

const apis = [
  "mybusinessapi.googleapis.com",
  "mybusinessbusinessinformation.googleapis.com",
  "mybusinessaccountmanagement.googleapis.com",
]

try {
  const token = await getAccessToken()
  console.log("Service account token OK")

  for (const api of apis) {
    console.log(`Enabling ${api}...`)
    await enableApi(token, api)
  }
} catch (e) {
  console.error("Gagal:", e.message)
}
