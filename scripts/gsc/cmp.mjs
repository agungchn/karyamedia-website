import fs from "fs";
const t = fs.readFileSync("src/data/articles.ts", "utf8");
function get(slug) {
  const re = new RegExp('slug:\\s*"' + slug + '"[\\s\\S]*?(?=},\\n\\s*{|\\]\\s*$)');
  const m = t.match(re);
  if (!m) return null;
  const b = m[0];
  return {
    title: (b.match(/title:\s*"([^"]+)"/) || [])[1],
    keyword: (b.match(/keyword:\s*"([^"]+)"/) || [])[1],
    desc: (b.match(/description:\s*"([^"]+)"/) || [])[1],
  };
}
for (const s of ["piala-fiberglass-custom", "panduan-lengkap-plakat-akrilik-custom"]) {
  const a = get(s);
  console.log(s);
  console.log("  title  :", a?.title);
  console.log("  keyword:", a?.keyword);
  console.log("  desc   :", (a?.desc || "").slice(0, 90), "...");
  console.log("");
}
