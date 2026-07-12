// Local PageSpeed Insights checker — NO external dependencies.
// API key: env PSI_API_KEY, or a local gitignored file ./apikey.txt
// Free API: enable "PageSpeed Insights API" in Google Cloud (no billing needed).

import fs from "fs";

const SITE = process.env.SITE_URL || "https://karyamediasouvenir.com";

function getKey() {
  if (process.env.PSI_API_KEY) return process.env.PSI_API_KEY;
  try {
    return fs.readFileSync(new URL("./apikey.txt", import.meta.url), "utf8").trim();
  } catch {
    return "";
  }
}

async function runPsi(url, strategy, key) {
  const api =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(url)}&strategy=${strategy}` +
    (key ? `&key=${encodeURIComponent(key)}` : "");
  const res = await fetch(api);
  return res.json();
}

function report(strategy, data) {
  const lr = data.lighthouseResult;
  const cats = lr?.categories || {};
  const sc = (c) => (c?.score != null ? Math.round(c.score * 100) : "n/a");
  console.log(`\n=== ${strategy.toUpperCase()} ===`);
  console.log(`  Performance : ${sc(cats.performance)}`);
  console.log(`  Accessibility: ${sc(cats.accessibility)}`);
  console.log(`  Best Practices: ${sc(cats["best-practices"])}`);
  console.log(`  SEO         : ${sc(cats.seo)}`);

  const le = data.loadingExperience?.metrics;
  if (le) {
    const f = (m) =>
      le[m] ? `${le[m].displayValue} (${le[m].category})` : "n/a";
    console.log("  --- Field CWV (real users) ---");
    console.log(`  LCP : ${f("LARGEST_CONTENTFUL_PAINT_MS")}`);
    console.log(`  CLS : ${f("CUMULATIVE_LAYOUT_SHIFT_SCORE")}`);
    console.log(`  INP : ${f("INTERACTION_TO_NEXT_PAINT_MS")}`);
  } else {
    console.log("  (field CWV belum tersedia — butuh data riil dari Chrome UX Report)");
  }
}

async function main() {
  const key = getKey();
  if (!key) {
    console.log("ERROR: API key belum ada. Set PSI_API_KEY atau file scripts/ps/apikey.txt");
    process.exit(1);
  }
  for (const strategy of ["mobile", "desktop"]) {
    const data = await runPsi(SITE, strategy, key);
    if (data.error) {
      console.log(`\n=== ${strategy.toUpperCase()} ERROR ===`);
      console.log(JSON.stringify(data.error, null, 2));
    } else {
      report(strategy, data);
    }
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
