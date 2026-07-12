// Local Bing Webmaster Tools analyzer — NO external dependencies.
// API key: env BING_API_KEY, or a local gitignored file ./apikey.txt
// Free: get key from Bing Webmaster Tools -> Settings -> API Access.
// Site must be verified in Bing WMT first (can import from GSC).

import fs from "fs";

const SITE = process.env.SITE_URL || "https://karyamediasouvenir.com";

function getKey() {
  if (process.env.BING_API_KEY) return process.env.BING_API_KEY;
  try {
    return fs.readFileSync(new URL("./apikey.txt", import.meta.url), "utf8").trim();
  } catch {
    return "";
  }
}

async function bing(path, key) {
  const url =
    `https://ssl.bing.com/webmaster/api.svc/json/${encodeURIComponent(SITE)}/${path}?apikey=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  const text = await res.text();
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

  const stats = await bing("getsitestatistics", key);
  console.log("=== SITE STATISTICS ===");
  console.log(JSON.stringify(stats, null, 2));

  const kw = await bing("getkeywordstats", key);
  console.log("\n=== TOP KEYWORDS ===");
  if (Array.isArray(kw)) {
    kw.slice(0, 15).forEach((k) =>
      console.log(`${k.Keyword || k.keyword} | impressions:${k.Impressions ?? k.impressions} | clicks:${k.Clicks ?? k.clicks}`)
    );
  } else {
    console.log(JSON.stringify(kw, null, 2));
  }

  const issues = await bing("getseoissues", key);
  console.log("\n=== SEO ISSUES ===");
  if (Array.isArray(issues)) {
    console.log(`Total issues: ${issues.length}`);
    issues.slice(0, 15).forEach((i) => console.log(`- ${i.Description || i.description || JSON.stringify(i)}`));
  } else {
    console.log(JSON.stringify(issues, null, 2));
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
