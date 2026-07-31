// Detects articles that are NEW or MODIFIED between HEAD and the staged
// (index) tree. Used by the git pre-commit hook to decide which slugs to
// lint. Prints the changed slugs (space-separated) to stdout.
//
// Note: this compares the INDEX (what will be committed) against HEAD, which
// is exactly what the pre-commit hook needs. Stage your changes (git add)
// before running it manually.

import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { readAllMdxArticles } from "./mdx-helpers.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const mdxGlob = "src/content/articles/**/*.mdx"

function gitLs(refPrefix) {
  try {
    return execSync(`git ls-tree -r --name-only ${refPrefix} -- ${mdxGlob}`, { cwd: root, encoding: "utf8" })
      .trim().split("\n").filter(Boolean)
  } catch {
    return []
  }
}

function gitShowFile(refPrefix, filePath) {
  try {
    return execSync(`git show ${refPrefix}${filePath}`, { cwd: root, encoding: "utf8" })
  } catch {
    return null
  }
}

function readMdxFromGit(refPrefix) {
  const files = gitLs(refPrefix)
  const articles = []
  for (const file of files) {
    const content = gitShowFile(refPrefix, file)
    if (content === null) continue
    const match = file.match(/articles\/(.+)\.mdx$/)
    if (!match) continue
    const slug = match[1]
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!frontmatterMatch) continue
    const fm = frontmatterMatch[1]
    const title = (fm.match(/^title:\s*(.+)$/m) || [])[1] || ""
    const description = (fm.match(/^description:\s*(.+)$/m) || [])[1] || ""
    const category = (fm.match(/^category:\s*(.+)$/m) || [])[1] || ""
    const tagsRaw = (fm.match(/^tags:\s*\[([^\]]*)\]$/m) || [])[1] || ""
    const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim().replace(/^"|"$/g, "")) : []
    const body = content.replace(/^---\n[\s\S]*?\n---\n?/, "")
    articles.push({ slug, title, description, category, tags, content: body })
  }
  return articles
}

function toBlock(articles) {
  return articles.map(a =>
    `  {\n    slug: "${a.slug}",\n    title: "${a.title}",\n    description: "${a.description}",\n    category: "${a.category}",\n    tags: [${a.tags.map(t => `"${t}"`).join(", ")}],\n    content: \`${a.content.replace(/`/g, "\\`")}\`\n  }`
  ).join(",\n")
}

const headArticles = readMdxFromGit("HEAD:")
const stagedArticles = readMdxFromGit(":")

const changed = new Set()
if (stagedArticles.length > 0) {
  const headMap = new Map(headArticles.map(a => [a.slug, toBlock([a])]))
  for (const a of stagedArticles) {
    const block = toBlock([a])
    const h = headMap.get(a.slug)
    if (h === undefined || h !== block) changed.add(a.slug)
  }
}

console.log([...changed].join(","))
