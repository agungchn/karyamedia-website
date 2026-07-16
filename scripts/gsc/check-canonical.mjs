// Cek www -> non-www redirect + canonical tag.
const urls = [
  "https://www.karyamediasouvenir.com/",
  "https://karyamediasouvenir.com/",
];

async function check(u) {
  try {
    const r = await fetch(u, { redirect: "manual" });
    const body = r.status >= 200 && r.status < 300 ? await r.text() : "";
    let canon = "(n/a)";
    const c = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(body)
           || /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i.exec(body);
    if (c) canon = c[1];
    console.log(`\n${u}`);
    console.log(`  status : ${r.status}`);
    console.log(`  loc    : ${r.headers.get("location") || "(none)"}`);
    console.log(`  canon  : ${canon}`);
  } catch (e) {
    console.log(`\n${u}\n  ERROR: ${e.message}`);
  }
}

for (const u of urls) await check(u);
