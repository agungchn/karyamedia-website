// Local Search Console analyzer — NO external dependencies.
// Credentials are read from ./credentials.json (gitignored) OR env GSC_CREDENTIALS.
// Scope is READ-ONLY (webmasters.readonly) — safe even if leaked.

import crypto from "crypto";
import fs from "fs";

function getCredentials() {
  if (process.env.GSC_CREDENTIALS) return JSON.parse(process.env.GSC_CREDENTIALS);
  return JSON.parse(
    fs.readFileSync(new URL("./credentials.json", import.meta.url), "utf8")
  );
}

async function getAccessToken(creds) {
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
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(creds.private_key, "base64url");
  const jwt = `${header}.${payload}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data));
  return data.access_token;
}

const API = "https://searchconsole.googleapis.com/webmasters/v3";

async function api(token, path, body) {
  const url = `${API}${path}`;
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

function fmtDate(d) {
  return d.toISOString().slice(0, 10);
}

async function main() {
  const creds = getCredentials();
  console.log(`Authenticating as ${creds.client_email} ...`);
  const token = await getAccessToken(creds);

  // 1. Discover which site(s) this account can access
  const sitesRes = await api(token, "/sites");
  const sites = sitesRes.siteEntry || [];
  console.log("\n=== SITES YOU HAVE ACCESS TO ===");
  sites.forEach((s) => console.log("  " + s.siteUrl));

  // pick target: env SITE_URL, else first matching karyamediasouvenir, else first
  const target =
    process.env.SITE_URL ||
    sites.find((s) => s.siteUrl.includes("karyamediasouvenir"))?.siteUrl ||
    sites[0]?.siteUrl;

  if (!target) {
    console.log("\nNo Search Console property found for this account.");
    return;
  }
  console.log(`\n>>> Using site: ${target}\n`);
  const enc = encodeURIComponent(target);

  // 2. Sitemap status
  const sm = await api(token, `/sites/${enc}/sitemaps`);
  console.log("=== SITEMAP STATUS ===");
  console.log(JSON.stringify(sm.sitemap || sm, null, 2));

  // 3. Search performance (last 28 days) — queries
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 28);
  const range = { startDate: fmtDate(start), endDate: fmtDate(end) };

  const report = await api(token, `/sites/${enc}/searchAnalytics/query`, {
    ...range,
    dimensions: ["query"],
    rowLimit: 15,
  });
  console.log("\n=== TOP QUERIES (28d) ===");
  if (report.rows) {
    console.log("query | clicks | impressions | ctr | position");
    for (const r of report.rows) {
      console.log(
        `${r.keys[0]} | ${r.clicks} | ${r.impressions} | ${(r.ctr * 100).toFixed(1)}% | ${r.position.toFixed(1)}`
      );
    }
  } else {
    console.log(JSON.stringify(report, null, 2));
  }

  // 4. Top pages
  const pages = await api(token, `/sites/${enc}/searchAnalytics/query`, {
    ...range,
    dimensions: ["page"],
    rowLimit: 15,
  });
  console.log("\n=== TOP PAGES (28d) ===");
  if (pages.rows) {
    console.log("page | clicks | impressions | ctr | position");
    for (const r of pages.rows) {
      console.log(
        `${r.keys[0]} | ${r.clicks} | ${r.impressions} | ${(r.ctr * 100).toFixed(1)}% | ${r.position.toFixed(1)}`
      );
    }
  } else {
    console.log(JSON.stringify(pages, null, 2));
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
