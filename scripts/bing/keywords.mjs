// Local keyword research — uses Bing Webmaster API (already have the key).
// Returns search-volume (impressions) for seed keywords in the Indonesian
// market, so we know which terms are worth creating content for.
//   node scripts/bing/keywords.mjs                 # default category list
//   node scripts/bing/keywords.mjs "plakat" "medali jogja"   # custom seeds
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");

function getKey() {
  if (process.env.BING_API_KEY) return process.env.BING_API_KEY;
  try {
    return fs.readFileSync(path.join(root, "scripts/bing/apikey.txt"), "utf8").trim();
  } catch {
    return "";
  }
}

// Indonesian market. Bing rejects "id-ID"; "country=id" + "language=en-US" works.
const COUNTRY = "id";
const LANGUAGE = "en-US";

async function keywordStats(q, key) {
  const url =
    `https://ssl.bing.com/webmaster/api.svc/json/GetKeywordStats` +
    `?q=${encodeURIComponent(q)}&country=${COUNTRY}&language=${LANGUAGE}&apikey=${key}`;
  const res = await fetch(url);
  const j = await res.json();
  const rows = j.d || [];
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + (r.Impressions || 0), 0);
  const latest = rows[rows.length - 1];
  return { q, weeks: rows.length, total, latest: latest.Impressions || 0 };
}

const DEFAULT_SEEDS = [
  "plakat",
  "plakat akrilik",
  "plakat jogja",
  "medali",
  "medali jogja",
  "piala",
  "souvenir wisuda",
  "souvenir pernikahan",
  "prasasti",
  "gift box",
  "name tag",
  "samir wisuda",
  "patung wisuda",
  "map ijazah",
  "gantungan kunci",
];

async function main() {
  const key = getKey();
  if (!key) {
    console.log("ERROR: API key belum ada. Set BING_API_KEY atau file scripts/bing/apikey.txt");
    process.exit(1);
  }
  const seeds = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_SEEDS;

  console.log(`Riset keyword — pasar Indonesia (country=${COUNTRY}, lang=${LANGUAGE})\n`);
  const results = [];
  for (const s of seeds) {
    const r = await keywordStats(s, key);
    if (r) results.push(r);
    else console.log(`  (kosong) ${s}`);
  }

  results.sort((a, b) => b.total - a.total);
  console.log("Keyword".padEnd(22), "Total Imp".padStart(10), "Minggu terakhir".padStart(14));
  console.log("-".repeat(48));
  for (const r of results) {
    console.log(r.q.padEnd(22), String(r.total).padStart(10), String(r.latest).padStart(14));
  }
  console.log("\nKeterangan: 'Total Imp' = total impressions (~6 bulan terakhir di Bing Indonesia).");
  console.log("Semakin tinggi, semakin banyak orang mencari kata itu -> prioritas buat konten.");
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
