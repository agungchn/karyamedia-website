// Local Bing auto-submitter — NO external dependencies.
// Reads the live sitemap, submits only URLs never submitted before.
// Bing limits SubmitUrl to ~100 URLs/day, so we cap each run at DAILY_CAP
// and resume the backlog on the next run (state in submitted.json).
//   node scripts/bing/autosubmit.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const SITE = process.env.SITE_URL || "https://karyamediasouvenir.com";
const STORE = path.join(here, "submitted.json");
const BSITE = (process.env.SITE_URL || "https://karyamediasouvenir.com/").replace(/\/?$/, "/");
const DAILY_CAP = 100; // Bing SubmitUrl quota is ~100 URLs/day

function getKey() {
  if (process.env.BING_API_KEY) return process.env.BING_API_KEY;
  try {
    return fs.readFileSync(path.join(root, "scripts/bing/apikey.txt"), "utf8").trim();
  } catch {
    return "";
  }
}

async function getSitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim());
}

async function submitBatch(urls, key) {
  const res = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteUrl: BSITE, urlList: urls }),
  });
  return { status: res.status, body: await res.text() };
}

async function main() {
  const key = getKey();
  if (!key) {
    console.log("ERROR: API key belum ada. Set BING_API_KEY atau file scripts/bing/apikey.txt");
    process.exit(1);
  }

  const urls = await getSitemapUrls();
  let submitted = [];
  try {
    submitted = JSON.parse(fs.readFileSync(STORE, "utf8"));
  } catch {}

  const set = new Set(submitted);
  const news = urls.filter((u) => !set.has(u));
  console.log(`Sitemap: ${urls.length} URL | sudah di-submit: ${submitted.length} | URL baru: ${news.length}`);

  if (!news.length) {
    console.log("Tidak ada URL baru. Semua sudah pernah di-submit ke Bing.");
    return;
  }

  const toSend = news.slice(0, DAILY_CAP);
  console.log(`Mengirim ${toSend.length} URL (batas harian Bing ~${DAILY_CAP})...`);
  const r = await submitBatch(toSend, key);
  if (r.status >= 200 && r.status < 300) {
    submitted.push(...toSend);
    fs.writeFileSync(STORE, JSON.stringify(submitted, null, 2));
    const left = news.length - toSend.length;
    console.log(`Berhasil submit ${toSend.length} URL baru. Total tercatat: ${submitted.length}.${left ? ` Sisa antrean: ${left} (lanjut besok/` + (DAILY_CAP < news.length ? "next run" : "next day") + `).` : ""}`);
  } else if (/[Qq]uota/i.test(r.body)) {
    console.log(`Kuota harian Bing sudah habis. Coba lagi besok — URL baru akan otomatis lanjut.`);
    console.log(`  (pesan Bing: ${r.body})`);
  } else {
    console.log(`GAGAL: ${r.status} ${r.body}`);
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
