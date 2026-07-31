import fs from "fs";
import { readAllMdxArticles, PATHS } from "../seo/mdx-helpers.mjs";
const slug = "piala-fiberglass-custom";

// 1. delete the .mdx file
const articles = readAllMdxArticles();
const target = articles.find(a => a.slug === slug);
if (target && fs.existsSync(target.filePath)) {
  fs.unlinkSync(target.filePath);
  console.log("deleted article file:", target.filePath);
} else {
  console.log("article file not found:", slug);
}

// 2. remove backlinks in other articles
const bl = new RegExp('<p>Artikel terkait: <a href="/blog/' + slug + '">[^<]*</a></p>', "g");
let removed = 0;
for (const a of articles) {
  if (a.slug === slug || !fs.existsSync(a.filePath)) continue;
  const content = fs.readFileSync(a.filePath, "utf8");
  if (bl.test(content)) {
    fs.writeFileSync(a.filePath, content.replace(bl, ""));
    removed++;
  }
}
console.log("removed backlinks from", removed, "files");
console.log("done");
