// Local SEO snapshot + trend — saves key metrics each run, prints deltas
// vs the previous snapshot. Reads the same gitignored keys as the others.
//   node scripts/seo/snapshot.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const SITE = process.env.SITE_URL || "https://karyamediasouvenir.com";
const HISTORY = path.join(here, "seo-history.json");
const fmt = (d) => d.toISOString().slice(0, 10);

// ---------- Google Search Console ----------
function gscCreds() {
  if (process.env.GSC_CREDENTIALS) return JSON.parse(process.env.GSC_CREDENTIALS);
  return JSON.parse(fs.readFileSync(path.join(root, "scripts/gsc/credentials.json"), "utf8"));
}
async function gscToken(creds) {
  const iat = Math.floor(Date.now() / 1000);
  const claim = {
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat,
    exp: iat + 3600,
  };
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const header = b64({ alg: "RS256", typ: "JWT" });
  const payload = b64(claim);
  const sig = crypto.createSign("RSA-SHA256").update(`${header}.${payload}`).sign(creds.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${header}.${payload}.${sig}` }),
  });
  const d = await res.json();
  if (d.error) throw new Error(JSON.stringify(d));
  return d.access_token;
}
async function gscApi(token, p, body) {
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3${p}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}
async function gscMetrics() {
  const token = await gscToken(gscCreds());
  const sites = await gscApi(token, "/sites");
  const target =
    process.env.SITE_URL ||
    (sites.siteEntry || []).find((s) => s.siteUrl.includes("karyamediasouvenir"))?.siteUrl ||
    sites.siteEntry?.[0]?.siteUrl;
  const enc = encodeURIComponent(target);
  const sm = await gscApi(token, `/sites/${enc}/sitemaps`);
  const c = sm.sitemap?.[0]?.contents?.[0] || {};
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 28);
  const range = { startDate: fmt(start), endDate: fmt(end) };
  const tot = (await gscApi(token, `/sites/${enc}/searchAnalytics/query`, range)).rows || [];
  return {
    submitted: Number(c.submitted) || 0,
    indexed: Number(c.indexed) || 0,
    clicks: tot.reduce((s, r) => s + r.clicks, 0),
    impressions: tot.reduce((s, r) => s + r.impressions, 0),
  };
}

// ---------- Bing Webmaster Tools ----------
function bingKey() {
  if (process.env.BING_API_KEY) return process.env.BING_API_KEY;
  try {
    return fs.readFileSync(path.join(root, "scripts/bing/apikey.txt"), "utf8").trim();
  } catch {
    return "";
  }
}
const BSITE = (process.env.SITE_URL || "https://karyamediasouvenir.com/").replace(/\/?$/, "/");
async function bingMetrics(key) {
  const b = (m) =>
    fetch(`https://ssl.bing.com/webmaster/api.svc/json/${m}?siteUrl=${encodeURIComponent(BSITE)}&apikey=${key}`).then((r) => r.json());
  const issues = await b("GetCrawlIssues");
  const traffic = await b("GetRankAndTrafficStats");
  const crawled = (traffic.d || []).slice(-1)[0]?.CrawledPages ?? 0;
  return { issues: (issues.d || []).length, crawledPages: Number(crawled) };
}

// ---------- PageSpeed Insights ----------
function psiKey() {
  if (process.env.PSI_API_KEY) return process.env.PSI_API_KEY;
  try {
    return fs.readFileSync(path.join(root, "scripts/ps/apikey.txt"), "utf8").trim();
  } catch {
    return "";
  }
}
async function psiScore(strategy, key) {
  const r = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE)}&strategy=${strategy}&category=PERFORMANCE&key=${key}`
  );
  const d = await r.json();
  return Math.round((d.lighthouseResult?.categories?.performance?.score ?? 0) * 100);
}
async function psiMetrics(key) {
  if (!key) return { mobile: null, desktop: null };
  const [m, de] = await Promise.all([psiScore("mobile", key), psiScore("desktop", key)]);
  return { mobile: m, desktop: de };
}

const sd = (n) => (n > 0 ? `+${n}` : `${n}`);

async function main() {
  const snap = { date: fmt(new Date()) };
  try {
    snap.gsc = await gscMetrics();
  } catch (e) {
    snap.gsc = { error: e.message };
  }
  try {
    const k = bingKey();
    snap.bing = k ? await bingMetrics(k) : { error: "no key" };
  } catch (e) {
    snap.bing = { error: e.message };
  }
  try {
    snap.psi = await psiMetrics(psiKey());
  } catch (e) {
    snap.psi = { error: e.message };
  }

  let hist = [];
  try {
    hist = JSON.parse(fs.readFileSync(HISTORY, "utf8"));
  } catch {}
  hist.push(snap);
  fs.writeFileSync(HISTORY, JSON.stringify(hist, null, 2));

  const line = "=".repeat(64);
  console.log(`\n${line}\n  SEO TREND (snapshot tersimpan)\n${line}`);
  console.log(`Tanggal: ${snap.date}`);
  const prev = hist[hist.length - 2];
  if (prev) {
    if (snap.gsc && prev.gsc && !snap.gsc.error)
      console.log(
        `  GSC  indexed: ${snap.gsc.indexed} (${sd(snap.gsc.indexed - prev.gsc.indexed)}) | impr 28d: ${snap.gsc.impressions} (${sd(snap.gsc.impressions - prev.gsc.impressions)}) | clicks: ${snap.gsc.clicks} (${sd(snap.gsc.clicks - prev.gsc.clicks)})`
      );
    if (snap.bing && prev.bing && !snap.bing.error)
      console.log(`  Bing crawl issues: ${snap.bing.issues} (${sd(snap.bing.issues - prev.bing.issues)}) | crawled: ${snap.bing.crawledPages}`);
    if (snap.psi && prev.psi && snap.psi.mobile != null)
      console.log(`  PSI  mobile: ${snap.psi.mobile} (${sd(snap.psi.mobile - prev.psi.mobile)}) | desktop: ${snap.psi.desktop} (${sd(snap.psi.desktop - prev.psi.desktop)})`);
  } else {
    console.log("  (snapshot pertama — belum ada pembanding minggu lalu)");
    if (snap.gsc && !snap.gsc.error) console.log(`  GSC  indexed:${snap.gsc.indexed} | impr:${snap.gsc.impressions} | clicks:${snap.gsc.clicks}`);
    if (snap.bing && !snap.bing.error) console.log(`  Bing issues:${snap.bing.issues} | crawled:${snap.bing.crawledPages}`);
    if (snap.psi) console.log(`  PSI  mobile:${snap.psi.mobile} | desktop:${snap.psi.desktop}`);
  }
  console.log(`\n  Total snapshot tersimpan: ${hist.length} (scripts/seo/seo-history.json)`);
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
