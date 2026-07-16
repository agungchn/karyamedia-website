// Cek status index halaman utama via URL Inspection API.
import { getToken, getSite } from "./analyze.mjs";

const urls = [
  "https://karyamediasouvenir.com/",
  "https://karyamediasouvenir.com/kontak",
  "https://karyamediasouvenir.com/profil",
  "https://karyamediasouvenir.com/katalog-produk",
  "https://karyamediasouvenir.com/cara-pesan",
];

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
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const r = data.inspectionResult?.indexStatusResult || {};
  return {
    verdict: r.verdict || "UNKNOWN",
    coverage: r.coverageState || "UNKNOWN",
    indexed: r.pageFetchState || "?",
    lastCrawl: r.lastCrawlTime || "-",
    robots: r.robotsTxtState || "?",
    canonical: r.googleCanonical || "-",
  };
}

async function main() {
  const token = await getToken();
  const site = await getSite(token);
  console.log(`Site: ${site}\n`);
  for (const url of urls) {
    try {
      const s = await inspect(token, site, url);
      console.log(`• ${url}`);
      console.log(`    verdict   : ${s.verdict}`);
      console.log(`    coverage  : ${s.coverage}`);
      console.log(`    fetch     : ${s.indexed}`);
      console.log(`    lastCrawl : ${s.lastCrawl}`);
      console.log(`    robots    : ${s.robots}`);
      console.log(`    canonical : ${s.canonical}`);
      console.log("");
    } catch (e) {
      console.log(`• ${url}\n    ERROR: ${e.message}\n`);
    }
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
