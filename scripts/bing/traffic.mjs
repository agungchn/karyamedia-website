// Bing Webmaster Tools traffic report (READ-ONLY, pakai API key).
// Menampilkan total klik/impression/CTR dan top query pencarian di Bing.
//   node scripts/bing/traffic.mjs
// Dipakai oleh scripts/seo/inspect-weekly.ps1 agar rekap Senin juga berisi
// trafik Bing (selain Google), karena Bing mendasari AI search (Copilot/DuckDuckGo).
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const SITE = process.env.SITE_URL || "https://karyamediasouvenir.com/";

function getKey() {
  if (process.env.BING_API_KEY) return process.env.BING_API_KEY;
  try {
    return fs.readFileSync(path.join(root, "scripts/bing/apikey.txt"), "utf8").trim();
  } catch {
    return "";
  }
}

async function bingCall(method, key) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const se = (d) => d.toISOString().slice(0, 10);
  const url =
    `https://ssl.bing.com/webmaster/api.svc/json/${method}` +
    `?siteUrl=${encodeURIComponent(SITE)}&apikey=${key}` +
    `&startDate=${se(start)}&endDate=${se(end)}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) return { _raw: text, _status: res.status };
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text, _status: res.status };
  }
}

async function main() {
  const key = getKey();
  if (!key) {
    console.log("=== TRAFIK BING ===\nBing API key tidak ditemukan.");
    return;
  }
  const j = await bingCall("GetQueryStats", key);
  const rows = Array.isArray(j) ? j : j && Array.isArray(j.d) ? j.d : [];
  if (!rows.length) {
    console.log("=== TRAFIK BING (30 hari) ===\nBelum ada data query di Bing Webmaster Tools.");
    return;
  }

  let tClicks = 0;
  let tImpr = 0;
  const top = rows
    .map((r) => {
      const q = r.Query || r.query || "";
      const imp = r.Impressions ?? r.impressions ?? 0;
      const clk = r.Clicks ?? r.clicks ?? 0;
      const ctr = imp > 0 ? clk / imp : 0;
      const pos = Number(r.AvgPosition ?? r.avgPosition ?? r.Position ?? 0) || 0;
      tClicks += clk;
      tImpr += imp;
      return { q, imp, clk, ctr, pos };
    })
    .filter((x) => x.q)
    .sort((a, b) => b.clk - a.clk || b.imp - a.imp)
    .slice(0, 20);

  console.log("=== TRAFIK BING (30 hari) ===");
  console.log(
    `Total: ${tClicks} klik | ${tImpr} impressions | CTR ${tImpr > 0 ? ((tClicks / tImpr) * 100).toFixed(1) : "0.0"}%`
  );
  if (top.length) {
    console.log("\nTop query pencarian di Bing (lewat mana pengunjung mengklik):");
    for (const r of top) {
      console.log(
        `  ${r.q} -> ${r.clk} klik, ${r.imp} impr, CTR ${(r.ctr * 100).toFixed(1)}%, pos ${r.pos.toFixed(1)}`
      );
    }
  } else {
    console.log("\nBelum ada query dengan klik/impression tercatat.");
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
