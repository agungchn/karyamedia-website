import fs from "fs";
const p = "src/data/articles.ts";
let t = fs.readFileSync(p, "utf8");
const slug = "piala-fiberglass-custom";

// 1. hapus blok artikel itu sendiri
const re = new RegExp('\\s*\\{\\s*slug:\\s*"' + slug + '"[\\s\\S]*?\\},\\n');
if (re.test(t)) { t = t.replace(re, ""); console.log("deleted article block:", slug); }
else console.log("article block not found:", slug);

// 2. hapus backlink ke slug tersebut di artikel lain
const bl = new RegExp('<p>Artikel terkait: <a href="/blog/' + slug + '">[^<]*</a></p>', "g");
const n = (t.match(bl) || []).length;
t = t.replace(bl, "");
console.log("removed backlinks:", n);

fs.writeFileSync(p, t);
console.log("done");
