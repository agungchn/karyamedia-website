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
    // Plakat Marmer
    "https://karyamediasouvenir.com/katalog-produk/plakat/plakat-marmer/plakat-marmer-2",
    "https://karyamediasouvenir.com/katalog-produk/plakat/plakat-marmer/plakat-marmer-10",
    // Plakat Kayu
    "https://karyamediasouvenir.com/katalog-produk/plakat/plakat-kayu/plakat-kayu-1",
    "https://karyamediasouvenir.com/katalog-produk/plakat/plakat-kayu/plakat-kayu-5",
    // Plakat Fiberglass
    "https://karyamediasouvenir.com/katalog-produk/plakat/plakat-fiberglass/plakat-fiberglass-1",
    "https://karyamediasouvenir.com/katalog-produk/plakat/plakat-fiberglass/plakat-fiberglass-50",
    // Plakat Wayang
    "https://karyamediasouvenir.com/katalog-produk/plakat/plakat-wayang/plakat-wayang-1",
    "https://karyamediasouvenir.com/katalog-produk/plakat/plakat-wayang/plakat-wayang-10",
    // Plakat Kayu Premium
    "https://karyamediasouvenir.com/katalog-produk/plakat/plakat-kayu-premium/plakat-kuningan-universitas-box-kayu",
    "https://karyamediasouvenir.com/katalog-produk/plakat/plakat-kayu-premium/plakat-kayu-premium-5",
  ]

  const token = await getToken()
  const site = await getSite(token)
  console.log(`Site: ${site}`)
  console.log(`Memeriksa ${urls.length} URL produk plakat...\n`)

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
