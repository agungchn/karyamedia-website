#!/usr/bin/env node

/**
 * Generate articles-index.json dari file .mdx
 * Output: src/data/articles-index.json (metadata saja, tanpa content HTML)
 * 
 * Cara pakai: node scripts/generate-articles-index.js
 */

const fs = require('fs')
const path = require('path')

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'blog')
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'articles-index.json')

// Simple frontmatter parser
function parseFrontmatter(content) {
  const lines = content.split('\n')
  const data = {}

  if (lines[0]?.trim() !== '---') return data

  let endIndex = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === '---') {
      endIndex = i
      break
    }
  }

  if (endIndex === -1) return data

  let currentKey = ''
  let inArray = false

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

      if (value) {
        data[key] = value.replace(/^["']|["']$/g, '')
      }
    }
  }

  return data
}

console.log('📖 Reading .mdx files from', CONTENT_DIR)

if (!fs.existsSync(CONTENT_DIR)) {
  console.error('❌ Content directory not found:', CONTENT_DIR)
  process.exit(1)
}

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'))
console.log(`📝 Found ${files.length} .mdx files`)

const articles = []

for (const file of files) {
  const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8')
  const data = parseFrontmatter(content)

  if (data.slug && data.title) {
    articles.push({
      slug: data.slug,
      title: data.title,
      description: data.description || '',
      category: data.category || '',
      date: data.date || '',
      image: data.image || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      canonical: data.canonical || undefined
    })
  }
}

// Sort by date descending
articles.sort((a, b) => b.date.localeCompare(a.date))

// Write output
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2), 'utf-8')

console.log(`✅ Generated ${OUTPUT_FILE}`)
console.log(`📊 ${articles.length} articles indexed`)

// Show file size
const stats = fs.statSync(OUTPUT_FILE)
const sizeKB = (stats.size / 1024).toFixed(1)
console.log(`📦 Size: ${sizeKB} KB`)