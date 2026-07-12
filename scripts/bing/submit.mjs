// Local Bing URL submitter — NO external dependencies.
// Pushes URLs to Bing for faster indexing (free, our own site only).
// API key: env BING_API_KEY, or a local gitignored file ./apikey.txt
//
// Usage:
//   node scripts/bing/submit.mjs <url>                 # 1 URL
//   node scripts/bing/submit.mjs url1 url2 ...         # several URLs
//   node scripts/bing/submit.mjs --file urls.txt       # 1 URL per line

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = (process.env.SITE_URL || "https://karyamediasouvenir.com/").replace(/\/?$/, "/");

function getKey() {
  if (process.env.BING_API_KEY) return process.env.BING_API_KEY;
  try {
    return fs.readFileSync(path.join(here, "apikey.txt"), "utf8").trim();
  } catch {
    return "";
  }
}

async function submitOne(url, key) {
  const api = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey=${key}`;
  const res = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteUrl: SITE, url }),
  });
  return { url, status: res.status, body: await res.text() };
}

async function submitBatch(urls, key) {
  const api = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=${key}`;
  const res = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteUrl: SITE, urlList: urls }),
  });
  return { status: res.status, body: await res.text() };
}

async function main() {
  const key = getKey();
  if (!key) {
    console.log("ERROR: API key belum ada. Set BING_API_KEY atau file scripts/bing/apikey.txt");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (args[0] === "--file") {
    const file = args[1];
    if (!file) {
      console.log("ERROR: --file butuh path file");
      process.exit(1);
    }
    const urls = fs
      .readFileSync(file, "utf8")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    console.log(`Mengirim ${urls.length} URL (batch) ke Bing...`);
    const r = await submitBatch(urls, key);
    console.log(`Batch status: ${r.status}`);
    console.log(r.body);
  } else if (args.length) {
    for (const u of args) {
      const r = await submitOne(u, key);
      console.log(`[${r.status}] ${u} -> ${r.body}`);
    }
  } else {
    console.log("Cara pakai:");
    console.log("  node scripts/bing/submit.mjs <url>");
    console.log("  node scripts/bing/submit.mjs url1 url2 ...");
    console.log("  node scripts/bing/submit.mjs --file urls.txt");
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
