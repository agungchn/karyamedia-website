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
import { extractArticles } from "./article-lint.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const rel = "src/data/articles.ts"

function gitShow(refPrefix) {
  try {
    return execSync(`git show ${refPrefix}${rel}`, { cwd: root, encoding: "utf8" })
  } catch {
    return null
  }
}

const head = gitShow("HEAD:")
let staged = gitShow(":")

const changed = new Set()
if (staged !== null) {
  const stagedArts = extractArticles(staged)
  const headMap = head ? new Map(extractArticles(head).map((a) => [a.slug, a.block])) : new Map()
  for (const a of stagedArts) {
    const h = headMap.get(a.slug)
    if (h === undefined || h !== a.block) changed.add(a.slug)
  }
}

console.log([...changed].join(" "))
