// Submit (re-notify) the sitemap to Google Search Console.
// Menggantikan "public sitemap ping" (google.com/ping) yang sudah tidak didukung (404/410).
// Ini adalah cara resmi yang tersisa untuk menegur Google bahwa sitemap (berisi artikel
// baru) sudah diperbarui, sehingga artikel ter-crawl lebih cepat di Google.
// Menggunakan service-account yang sama dengan snapshot.mjs, tapi dengan WRITE scope.
//   node scripts/seo/submit-sitemap.mjs
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const SITEMAP = "https://karyamediasouvenir.com/sitemap.xml";

function gscCreds() {
  if (process.env.GSC_CREDENTIALS) return JSON.parse(process.env.GSC_CREDENTIALS);
  return JSON.parse(fs.readFileSync(path.join(root, "scripts/gsc/credentials.json"), "utf8"));
}

async function gscToken(creds) {
  const iat = Math.floor(Date.now() / 1000);
  const claim = {
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/webmasters",
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

async function gscApi(token, p, method = "GET", body) {
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3${p}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.text() };
}

async function resolveSite(token) {
  const { body } = await gscApi(token, "/sites");
  const sites = JSON.parse(body).siteEntry || [];
  const target =
    process.env.SITE_URL ||
    sites.find((s) => s.siteUrl.includes("karyamediasouvenir"))?.siteUrl ||
    sites[0]?.siteUrl;
  if (!target) throw new Error("no GSC site found");
  return target;
}

async function main() {
  const token = await gscToken(gscCreds());
  const site = await resolveSite(token);
  const encSite = encodeURIComponent(site);
  const encSm = encodeURIComponent(SITEMAP);
  const r = await gscApi(token, `/sites/${encSite}/sitemaps/${encSm}`, "PUT");
  console.log(`GSC sitemap submit -> HTTP ${r.status} (${site})`);
  if (r.status >= 400) {
    console.log("body:", r.body);
    process.exit(1);
  }
  console.log("OK: Google diberitahu sitemap diperbarui (artikel baru akan ter-crawl lebih cepat)");
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
