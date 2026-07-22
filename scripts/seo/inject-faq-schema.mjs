// Auto-inject FAQ schema (JSON-LD) into articles that have FAQ sections
// Usage: node scripts/seo/inject-faq-schema.mjs              # all articles
//        node scripts/seo/inject-faq-schema.mjs --slug xyz   # one article
// Runs automatically in run-daily.ps1 after article generation
import { readFileSync, writeFileSync } from "fs"
import { join, dirname, resolve } from "path"
import { fileURLToPath } from "url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")
const articlesPath = join(root, "src/data/articles.ts")

const ONLY_SLUG = process.argv.includes("--slug") ? process.argv[process.argv.indexOf("--slug") + 1] : null

const src = readFileSync(articlesPath, "utf8")
const blocks = src.split(/},\s*\n\s*\{/)
let modified = 0
let total = 0

for (let i = 0; i < blocks.length; i++) {
  const b = blocks[i]
  const slug = b.match(/slug:\s*"([^"]+)"/)?.[1]
  if (!slug) continue
  if (ONLY_SLUG && slug !== ONLY_SLUG) continue
  total++

  const contentStart = b.indexOf("content: `")
  if (contentStart < 0) continue
  const contentBody = b.slice(contentStart + 10, b.lastIndexOf("`"))

  // Extract FAQ pairs
  const faqRegex = /<h2[^>]*>.*?(?:FAQ|Tanya Jawab|Pertanyaan).*?<\/h2>([\s\S]*?)(?=<h2|$)/i
  const faqMatch = contentBody.match(faqRegex)
  if (!faqMatch) continue

  const faqSection = faqMatch[1]
  const questions = [...faqSection.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)]
  const answers = [...faqSection.matchAll(/<p>(.*?)<\/p>/g)]

  if (questions.length < 2) continue

  const pairs = questions.map((q, idx) => ({
    "@type": "Question",
    name: q[1].trim(),
    acceptedAnswer: {
      "@type": "Answer",
      text: (answers[idx]?.[1] || "").trim(),
    },
  })).filter(p => p.name && p.acceptedAnswer.text)

  if (pairs.length < 2) continue

  // Check if schema already injected
  if (contentBody.includes('"@type":"FAQPage"')) {
    continue
  }

  // Generate FAQ schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs,
  }

  const schemaScript = `\n<script type="application/ld+json">${JSON.stringify(schema)}</script>\n`

  // Inject before closing of content
  const contentEnd = b.lastIndexOf("`")
  const beforeContent = b.slice(0, contentEnd)
  const afterContent = b.slice(contentEnd)
  blocks[i] = beforeContent + schemaScript + afterContent
  modified++
}

if (modified === 0) {
  console.log(`ℹ️  Tidak ada artikel baru yang perlu FAQ schema. (Total: ${total})`)
} else {
  const newSrc = blocks.join("},\n  {")
  writeFileSync(articlesPath, newSrc)
  console.log(`✅ FAQ schema di-inject ke ${modified} artikel.`)
}

console.log(`📊 ${total} artikel diperiksa.`)
