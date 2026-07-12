// Local Bing Webmaster Tools analyzer — NO external dependencies.
// API key: env BING_API_KEY, or a local gitignored file ./apikey.txt
// Free: get key from Bing Webmaster Tools -> Settings -> API Access.
// Site must be verified in Bing WMT first (can import from GSC).
//
// Note: the JSON API takes the site as the `siteUrl` query parameter
// (NOT in the path). Putting the site in the path triggers an ASP.NET
// "dangerous Request.Path" 400 because of the ":" in https://.

import fs from "fs";

// Bing stores the verified site WITH a trailing slash.
const SITE = (process.env.SITE_URL || "https://karyamediasouvenir.com/").replace(/\/?$/, "/");

function getKey() {
  if (process.env.BING_API_KEY) return process.env.BING_API_KEY;
  try {
    return fs.readFileSync(new URL("./apikey.txt", import.meta.url), "utf8").trim();
  } catch {
    return "";
  }
}

async function bing(method, key) {
  const url =
    `https://ssl.bing.com/webmaster/api.svc/json/${method}` +
    `?siteUrl=${encodeURIComponent(SITE)}&apikey=${key}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) {
    return { _raw: text, _status: res.status };
  }
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text, _status: res.status };
  }
}

async function main() {
  const key = getKey();
  if (!key) {
    console.log("ERROR: API key belum ada. Set BING_API_KEY atau file scripts/bing/apikey.txt");
    process.exit(1);
  }

  console.log(`Bing Webmaster Tools — site: ${SITE}\n`);

  // --- Traffic overview (rank & traffic stats, last ~6 months) ---
  const traffic = await bing("GetRankAndTrafficStats", key);
  console.log("=== TRAFFIC (Rank & Traffic Stats) ===");
  if (traffic && Array.isArray(traffic.d)) {
    const rows = traffic.d;
    const totC = rows.reduce((s, r) => s + (r.Clicks || 0), 0);
    const totI = rows.reduce((s, r) => s + (r.Impressions || 0), 0);
    console.log(`Total data points: ${rows.length} | Clicks: ${totC} | Impressions: ${totI}`);
    rows.slice(-8).forEach((r) => {
      const d = new Date(r.Date.match(/\d+/)[0] * 1);
      console.log(`  ${d.toISOString().slice(0, 10)} | imp:${r.Impressions} clk:${r.Clicks}`);
    });
  } else {
    console.log(JSON.stringify(traffic, null, 2));
  }

  // --- Top queries ---
  const queries = await bing("GetQueryStats", key);
  console.log("\n=== TOP QUERIES (GetQueryStats) ===");
  if (queries && Array.isArray(queries.d) && queries.d.length) {
    queries.d
      .sort((a, b) => (b.Impressions || 0) - (a.Impressions || 0))
      .slice(0, 15)
      .forEach((q) =>
        console.log(`  ${q.Query || q.query} | imp:${q.Impressions ?? 0} | clk:${q.Clicks ?? 0}`)
      );
  } else {
    console.log("  (belum ada data query — situs baru / belum terindeks di Bing)");
  }

  // --- Crawl stats ---
  const crawl = await bing("GetCrawlStats", key);
  console.log("\n=== CRAWL STATS (GetCrawlStats) ===");
  if (crawl && Array.isArray(crawl.d) && crawl.d.length) {
    const latest = crawl.d[crawl.d.length - 1];
    console.log(
      `  CrawledPages:${latest.CrawledPages} | Code2xx:${latest.Code2xx} | Code301:${latest.Code301} | Code4xx:${latest.Code4xx} | Code5xx:${latest.Code5xx} | CrawlErrors:${latest.CrawlErrors} | BlockedByRobotsTxt:${latest.BlockedByRobotsTxt}`
    );
  } else {
    console.log("  (belum ada data crawl)");
  }

  // --- Crawl / SEO issues ---
  const issues = await bing("GetCrawlIssues", key);
  console.log("\n=== CRAWL / SEO ISSUES (GetCrawlIssues) ===");
  if (issues && Array.isArray(issues.d) && issues.d.length) {
    console.log(`  Total issues: ${issues.d.length}`);
    const byCode = {};
    issues.d.forEach((i) => {
      byCode[i.HttpCode] = (byCode[i.HttpCode] || 0) + 1;
    });
    console.log("  per HTTP code:", JSON.stringify(byCode));
    issues.d.slice(0, 10).forEach((i) =>
      console.log(`  - [${i.HttpCode}] ${i.Url} (inlinks:${i.InLinks})`)
    );
  } else {
    console.log("  (tidak ada crawl issue)");
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
