// Combined SEO monitor — runs GSC + Bing + PageSpeed in one command.
// Each sub-script is self-contained (reads its own gitignored key).
//   npm run seo
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const jobs = [
  { name: "GOOGLE SEARCH CONSOLE", args: ["gsc/analyze.mjs"] },
  { name: "BING WEBMASTER TOOLS", args: ["bing/check.mjs"] },
  { name: "PAGESPEED INSIGHTS", args: ["ps/check.mjs"] },
];

const line = "=".repeat(64);
for (const j of jobs) {
  console.log(`\n${line}\n  ${j.name}\n${line}`);
  const r = spawnSync(process.execPath, j.args, { cwd: root, stdio: "inherit" });
  if (r.error) console.error(`Gagal menjalankan ${j.name}: ${r.error.message}`);
}