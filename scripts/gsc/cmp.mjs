import { readAllMdxArticles } from "../seo/mdx-helpers.mjs";
const articles = readAllMdxArticles();
function get(slug) {
  const a = articles.find(x => x.slug === slug);
  if (!a) return null;
  return { title: a.title, keyword: a.keyword || "", desc: a.description };
}
for (const s of ["piala-fiberglass-custom", "panduan-lengkap-plakat-akrilik-custom"]) {
  const a = get(s);
  console.log(s);
  console.log("  title  :", a?.title);
  console.log("  keyword:", a?.keyword);
  console.log("  desc   :", (a?.desc || "").slice(0, 90), "...");
  console.log("");
}
