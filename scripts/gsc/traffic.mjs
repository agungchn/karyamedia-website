// Weekly Google traffic report from Search Console (READ-ONLY).
// Menampilkan total klik/impression/CTR dan top query pencarian.
//   node scripts/gsc/traffic.mjs            # 28 hari terakhir
//   node scripts/gsc/traffic.mjs 90         # 90 hari terakhir
// Dipakai oleh scripts/seo/inspect-weekly.ps1 agar rekap Senin juga berisi trafik.
import { getToken, getSite, api } from "./analyze.mjs";

async function main() {
  const days = parseInt(process.argv[2] || "28", 10);
  const token = await getToken();
  const site = await getSite(token);
  const enc = encodeURIComponent(site);
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  const fmt = (d) => d.toISOString().slice(0, 10);
  const range = { startDate: fmt(start), endDate: fmt(end) };

  // total keseluruhan (tanpa dimension)
  const tot = await api(token, `/sites/${enc}/searchAnalytics/query`, range);
  const row = tot.rows && tot.rows[0];
  const tClicks = row?.clicks ?? 0;
  const tImpr = row?.impressions ?? 0;
  const tCtr = row?.ctr ?? 0;

  // top query pencarian
  const q = await api(token, `/sites/${enc}/searchAnalytics/query`, {
    ...range,
    dimensions: ["query"],
    rowLimit: 20,
  });

  console.log(`=== TRAFIK GOOGLE (${days} hari terakhir) ===`);
  console.log(`Total: ${tClicks} klik | ${tImpr} impressions | CTR ${(tCtr * 100).toFixed(1)}%`);
  if (q.rows && q.rows.length) {
    console.log(`\nTop query pencarian (lewat mana pengunjung mengklik):`);
    for (const r of q.rows) {
      console.log(
        `  ${r.keys[0]} -> ${r.clicks} klik, ${r.impressions} impr, CTR ${(r.ctr * 100).toFixed(1)}%, pos ${r.position.toFixed(1)}`
      );
    }
  } else {
    console.log(`\nBelum ada query pencarian tercatat di GSC untuk periode ini.`);
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
