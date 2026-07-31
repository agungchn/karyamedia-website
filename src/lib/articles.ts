import fs from 'fs'
import path from 'path'

export interface Article {
  slug: string
  title: string
  description: string
  category: string
  date: string
  image: string
  content: string
  tags: string[]
  canonical?: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

// Simple frontmatter parser
function parseFrontmatter(content: string): { data: Record<string, string | string[]>; content: string } {
  const lines = content.split('\n')
  const data: Record<string, string | string[]> = {}
  let contentStart = 0

  // Find frontmatter boundaries
  if (lines[0]?.trim() !== '---') {
    return { data, content }
  }

  let endIndex = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === '---') {
      endIndex = i
      break
    }
  }

  if (endIndex === -1) {
    return { data, content }
  }

  // Parse frontmatter
  let currentKey = ''
  let inArray = false

  for (let i = 1; i < endIndex; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) continue

    // Check if it's an array item
    if (trimmed.startsWith('- ') && currentKey && inArray) {
      const value = trimmed.substring(2).trim()
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = []
      }
      ;(data[currentKey] as string[]).push(value)
      continue
    }

    // Key-value pair
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex !== -1) {
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()

      currentKey = key
      inArray = false

      if (!value) {
        // Could be an array on next lines
        inArray = true
        continue
      }

      // Remove quotes
      data[key] = value.replace(/^["']|["']$/g, '')
    }
  }

  contentStart = endIndex + 1
  const remainingContent = lines.slice(contentStart).join('\n').trim()

  return { data, content: remainingContent }
}

// Cache for articles
let articlesCache: Article[] | null = null

function getAllArticlesFromFiles(): Article[] {
  if (articlesCache) {
    return articlesCache
  }

  const articles: Article[] = []

  if (!fs.existsSync(CONTENT_DIR)) {
    return articles
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'))

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = parseFrontmatter(fileContent)

    if (data.slug && data.title) {
      articles.push({
        slug: data.slug as string,
        title: data.title as string,
        description: (data.description as string) || '',
        category: (data.category as string) || '',
        date: (data.date as string) || '',
        image: (data.image as string) || '',
        content: content,
        tags: Array.isArray(data.tags) ? data.tags : [],
        canonical: (data.canonical as string) || undefined
      })
    }
  }

  articlesCache = articles
  return articles
}

// Export articles for compatibility with existing code
export const articles: Article[] = getAllArticlesFromFiles()

// Helper functions
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter(a => a.category === category)
}

export function getLatestArticles(count: number): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count)
}

export function getAllSlugs(): string[] {
  return articles.map(a => a.slug)
}

export function searchArticles(query: string): Article[] {
  const lowerQuery = query.toLowerCase()
  return articles.filter(article => {
    const searchText = `${article.title} ${article.description} ${article.tags.join(' ')}`.toLowerCase()
    return searchText.includes(lowerQuery)
  })
}