// Local on-page SEO audit — NO external dependencies.
// Fetches a sample of URLs from the live sitemap and checks:
//   <title>, <meta name=description>, <h1>, <link rel=canonical>
// Flags: missing/duplicate title, missing/short meta description, missing h1.
//
// Usage:
//   node scripts/seo/audit.mjs              # sample 15 URLs
//   node scripts/seo/audit.mjs 30           # sample 30 URLs
//   SITE_URL=https://karyamediasouvenir.com node scripts/seo/audit.mjs

const SITE = process.env.SITE_URL || "https://karyamediasouvenir.com";
const SAMPLE = parseInt(process.argv[2] || "15", 10);

function clean(s) {
  return (s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getSitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim());
  return locs;
}

async function auditPage(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    const title = clean((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]);
    const desc = clean(
      (html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) || [])[1]
    );
    const h1 = clean((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]);
    const canon = (html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) || [])[1] || "";
    return { url, status: res.status, title, desc, h1, canon };
  } catch (e) {
    return { url, status: 0, title: "", desc: "", h1: "", canon: "", error: e.message };
  }
}

function flag(r) {
  const f = [];
  if (!r.title) f.push("NO TITLE");
  else if (r.title.length < 10 || r.title.length > 70) f.push(`TITLE ${r.title.length}c`);
  if (!r.desc) f.push("NO META");
  else if (r.desc.length < 50 || r.desc.length > 160) f.push(`META ${r.desc.length}c`);
  if (!r.h1) f.push("NO H1");
  if (!r.canon) f.push("NO CANON");
  return f.join(", ");
}

async function main() {
  console.log(`On-page audit — sampling ${SAMPLE} URL dari ${SITE}/sitemap.xml\n`);
  const urls = await getSitemapUrls();
  if (!urls.length) {
    console.log("Sitemap kosong / tidak bisa diakses.");
    return;
  }
  const picked = urls.slice(0, SAMPLE);
  console.log(`Sitemap berisi ${urls.length} URL. Memeriksa ${picked.length}...\n`);

  const results = [];
  for (const u of picked) {
    const r = await auditPage(u);
    results.push(r);
    const fl = flag(r);
    const short = u.replace(SITE, "/");
    console.log(
      `${fl ? "‼ " : "  "}${short}\n     title: ${r.title.slice(0, 70) || "(kosong)"}\n     meta : ${r.desc.slice(0, 70) || "(kosong)"}${fl ? `\n     FLAGS: ${fl}` : ""}`
    );
  }

  // duplicate title detection
  const byTitle = {};
  results.forEach((r) => {
    if (r.title) byTitle[r.title] = (byTitle[r.title] || 0) + 1;
  });
  const dups = Object.entries(byTitle).filter(([, n]) => n > 1);
  console.log("\n=== RINGKASAN ===");
  console.log(`URL diperiksa : ${results.length}`);
  console.log(`Tanpa title   : ${results.filter((r) => !r.title).length}`);
  console.log(`Tanpa meta    : ${results.filter((r) => !r.desc).length}`);
  console.log(`Tanpa h1      : ${results.filter((r) => !r.h1).length}`);
  console.log(`Tanpa canonical: ${results.filter((r) => !r.canon).length}`);
  if (dups.length) {
    console.log(`Duplikat title: ${dups.length}`);
    dups.forEach(([t, n]) => console.log(`   x${n}: ${t.slice(0, 60)}`));
  } else {
    console.log("Duplikat title: tidak ada");
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
