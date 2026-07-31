import { getToken, getSite } from "./analyze.mjs"

async function inspect(token, site, url) {
  const res = await fetch(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: site }),
    },
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HTTP ${res.status}: ${err}`)
  }
  const data = await res.json()
  const r = data.inspectionResult?.indexStatusResult || {}
  return r.verdict || r.coverageState || "UNKNOWN"
}

async function main() {
  const urls = [
    "https://karyamediasouvenir.com/katalog-produk/medali/medali-3d-zink-alloy/medali-3d-8",
    "https://karyamediasouvenir.com/katalog-produk/medali/medali-3d-zink-alloy/medali-3d-7",
    "https://karyamediasouvenir.com/katalog-produk/medali/medali-3d-zink-alloy/medali-3d-6",
  ]

  const token = await getToken()
  const site = await getSite(token)
  console.log(`Site: ${site}`)
  console.log(`Memeriksa ${urls.length} URL produk Medali 3D Zink Alloy...\n`)

  let indexed = 0
  for (const url of urls) {
    try {
      const state = await inspect(token, site, url)
      const ok = /pass|indexed|neutral/i.test(state)
      if (ok) indexed++
      console.log(`  [${ok ? "OK" : "  "}] ${state.padEnd(38)} ${url}`)
    } catch (e) {
      console.log(`  [!!] ERROR  ${url}\n       ${e.message}`)
    }
  }
  console.log(`\nRingkasan: ${indexed}/${urls.length} terindeks (atau netral).`)
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})
