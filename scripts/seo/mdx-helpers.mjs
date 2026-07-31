// Shared MDX article operations for the SEO pipeline.
// All scripts that read/write articles should use these helpers.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs"
import { join, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "../..")
const CONTENT_DIR = join(ROOT, "content", "blog")
const ARTICLES_INDEX = join(ROOT, "src", "data", "articles-index.json")

// Simple frontmatter parser
export function parseMdxFrontmatter(content) {
  const lines = content.split('\n')
  const data = {}
  if (lines[0]?.trim() !== '---') return { data, body: content }

  let endIndex = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === '---') { endIndex = i; break }
  }
  if (endIndex === -1) return { data, body: content }

  let currentKey = '', inArray = false
  for (let i = 1; i < endIndex; i++) {
    const trimmed = lines[i].trim()
    if (!trimmed) continue
    if (trimmed.startsWith('- ') && currentKey && inArray) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = []
      data[currentKey].push(trimmed.substring(2).trim())
      continue
    }
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex !== -1) {
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()
      currentKey = key
      inArray = !value
      if (value) data[key] = value.replace(/^["']|["']$/g, '')
    }
  }
  return { data, body: lines.slice(endIndex + 1).join('\n').trim() }
}

// Read all .mdx files and return array of article objects
export function readAllMdxArticles() {
  if (!existsSync(CONTENT_DIR)) return []
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'))
  return files.map(file => {
    const filePath = join(CONTENT_DIR, file)
    const raw = readFileSync(filePath, 'utf-8')
    const { data, body } = parseMdxFrontmatter(raw)
    return {
      slug: data.slug || file.replace('.mdx', ''),
      title: data.title || '',
      description: data.description || '',
      category: data.category || '',
      date: data.date || '',
      image: data.image || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      canonical: data.canonical || undefined,
      content: body,
      filePath
    }
  })
}

// Generate .mdx file content from article data
export function generateMdxContent(article) {
  const escStr = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")
  let frontmatter = `---\n`
  frontmatter += `slug: ${article.slug}\n`
  frontmatter += `title: "${escStr(article.title)}"\n`
  frontmatter += `description: "${escStr(article.description)}"\n`
  frontmatter += `category: ${article.category}\n`
  frontmatter += `date: ${article.date}\n`
  frontmatter += `image: ${article.image}\n`
  frontmatter += `tags:\n`
  for (const tag of article.tags) frontmatter += `  - ${tag}\n`
  if (article.canonical) frontmatter += `canonical: ${article.canonical}\n`
  frontmatter += `---\n\n`
  frontmatter += article.content + '\n'
  return frontmatter
}

// Write a new article as .mdx file
export function writeMdxArticle(slug, articleData) {
  const filePath = join(CONTENT_DIR, `${slug}.mdx`)
  const content = generateMdxContent(articleData)
  writeFileSync(filePath, content, 'utf-8')
  return filePath
}

// Update an existing .mdx file content (keeping frontmatter)
export function updateMdxContent(filePath, newContent) {
  const raw = readFileSync(filePath, 'utf-8')
  const { data } = parseMdxFrontmatter(raw)
  const updated = generateMdxContent({ ...data, content: newContent })
  writeFileSync(filePath, updated, 'utf-8')
}

// Get all slugs from .mdx files
export function getAllMdxSlugs() {
  return readAllMdxArticles().map(a => a.slug)
}

// Get used images from all .mdx files
export function getUsedImagesFromMdx() {
  const set = new Set()
  if (!existsSync(CONTENT_DIR)) return set
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'))
  const re = /\/images\/produk-unggulan\/[^\s"')>]+/g
  for (const file of files) {
    const content = readFileSync(join(CONTENT_DIR, file), 'utf-8')
    let m
    while ((m = re.exec(content))) set.add(m[0])
  }
  return set
}

// Extract article from block text (for backward compatibility with old scripts)
export function extractArticleFromBlock(block) {
  const slug = /slug:\s*"([^"]+)"/.exec(block)?.[1] || ''
  const title = /title:\s*"([^"]+)"/.exec(block)?.[1] || ''
  const description = /description:\s*"([^"]+)"/.exec(block)?.[1] || ''
  const category = /category:\s*"([^"]+)"/.exec(block)?.[1] || ''
  const date = /date:\s*"([^"]+)"/.exec(block)?.[1] || ''
  const image = /image:\s*"([^"]+)"/.exec(block)?.[1] || ''
  const tagsM = block.match(/tags:\s*\[([\s\S]*?)\]/)
  const tags = tagsM ? [...tagsM[1].matchAll(/"([^"]+)"/g)].map(x => x[1]) : []
  const canonicalM = block.match(/canonical:\s*"([^"]+)"/)
  const canonical = canonicalM ? canonicalM[1] : undefined
  const contentM = block.match(/content:\s*`([\s\S]*?)`/)
  const content = contentM ? contentM[1] : ''
  return { slug, title, description, category, date, image, tags, canonical, content }
}

// Read articles from old articles.ts (for backward compatibility during transition)
export function readOldArticlesTs() {
  const articlesPath = join(ROOT, "src", "data", "articles.ts")
  if (!existsSync(articlesPath)) return []
  const text = readFileSync(articlesPath, 'utf-8')
  const slugRe = /slug:\s*"([^"]+)"/g
  const positions = []
  let m
  while ((m = slugRe.exec(text))) positions.push({ slug: m[1], idx: m.index })
  const arts = []
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].idx
    const end = positions[i + 1] ? positions[i + 1].idx : text.length
    arts.push({ slug: positions[i].slug, block: text.slice(start, end) })
  }
  return arts
}

// Paths
export const PATHS = {
  ROOT,
  CONTENT_DIR,
  ARTICLES_INDEX,
  CATEGORIES: join(ROOT, "src", "data", "categories.ts"),
  PAGE_TSX: join(ROOT, "src", "app", "blog", "[slug]", "page.tsx"),
  PUBLIC: join(ROOT, "public"),
}