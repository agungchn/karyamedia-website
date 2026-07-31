import { NextRequest, NextResponse } from "next/server"
import { buildSystemPrompt } from "@/lib/chat-context"
import articles from "@/data/articles-index.json"

export const runtime = "edge"

const LLM_TIMEOUT_MS = 30000

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout?.(LLM_TIMEOUT_MS) ?? init.signal,
  })
}

type ChatMessage = { role: "user" | "assistant"; content: string }

function sanitize(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return []
  return messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        ((m as { role?: string }).role === "user" || (m as { role?: string }).role === "assistant"),
    )
    .filter((m) => typeof m.content === "string" && m.content.trim().length > 0)
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 2000) }))
}

// Pre-build inverted index: map word -> Set<article indices>
// Built once at module load, O(1) lookups afterward.
const STOP_WORDS = new Set("dan,untuk,dengan,yang,di,dari,ke,pada,atau,the,a,an,of,to,in,ini,itu,ada,bisa,juga,akan,sebagai".split(","))

const wordToArticles = new Map<string, Set<number>>()

for (let i = 0; i < articles.length; i++) {
  const a = articles[i]
  const text = `${a.title} ${a.tags.join(" ")} ${a.description} ${a.category}`.toLowerCase()
  const words = text.match(/[a-z0-9]+/g) || []
  for (const w of words) {
    if (w.length < 2 || STOP_WORDS.has(w)) continue
    if (!wordToArticles.has(w)) wordToArticles.set(w, new Set())
    wordToArticles.get(w)!.add(i)
  }
}

function searchArticles(query: string): string {
  const q = query.toLowerCase()
  const queryWords = q.match(/[a-z0-9]+/g) || []
  if (queryWords.length === 0) return ""

  // Score each article by matching query words
  const scores = new Map<number, number>()
  for (const w of queryWords) {
    const matching = wordToArticles.get(w)
    if (!matching) continue
    for (const idx of matching) {
      scores.set(idx, (scores.get(idx) || 0) + 1)
    }
  }

  // Also check for exact phrase match in title (higher weight)
  for (let i = 0; i < articles.length; i++) {
    if (articles[i].title.toLowerCase().includes(q)) {
      scores.set(i, (scores.get(i) || 0) + 10)
    }
  }

  // Sort by score, take top 5
  const sorted = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([idx]) => idx)

  if (sorted.length === 0) return ""
  return sorted
    .map(
      (i, rank) =>
        `${rank + 1}. "${articles[i].title}" — ${articles[i].description.slice(0, 100)}...\n   https://karyamediasouvenir.com/blog/${articles[i].slug}`
    )
    .join("\n\n")
}

async function callOpenAICompatible(system: string, messages: ChatMessage[], userQuery: string) {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("OPENAI_API_KEY belum diatur di environment")
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "")
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"

  const searchResult = searchArticles(userQuery)
  const context = searchResult
    ? `\n\nARTIKEL TERKAIT DARI WEBSITE:\n${searchResult}\n\nGunakan artikel di atas jika relevan untuk merekomendasikan konten website kepada pengguna. Cantumkan link artikel jika kamu merekomendasikannya.`
    : ""

  const res = await fetchWithTimeout(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      max_tokens: 800,
      messages: [{ role: "system", content: system + context }, ...messages],
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`LLM ${res.status}: ${t.slice(0, 300)}`)
  }
  const j = await res.json()
  const msg = j.choices?.[0]?.message
  return msg?.content?.trim() || msg?.reasoning_content?.trim() || ""
}

async function callGemini(system: string, messages: ChatMessage[], userQuery: string) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("GEMINI_API_KEY belum diatur di environment")
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash"

  const searchResult = searchArticles(userQuery)
  const context = searchResult
    ? `\n\nARTIKEL TERKAIT DARI WEBSITE:\n${searchResult}\n\nGunakan artikel di atas jika relevan untuk merekomendasikan konten website kepada pengguna. Cantumkan link artikel jika kamu merekomendasikannya.`
    : ""

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))
  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system + context }] },
      contents,
      generationConfig: { temperature: 0.5, maxOutputTokens: 800 },
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Gemini ${res.status}: ${t.slice(0, 300)}`)
  }
  const j = await res.json()
  return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid" }, { status: 400 })
  }

  const messages = sanitize((body as { messages?: unknown })?.messages)
  if (!messages.length) {
    return NextResponse.json({ error: "Pesan kosong" }, { status: 400 })
  }

  const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase()
  const system = buildSystemPrompt()
  const userQuery = messages[messages.length - 1]?.content || ""

  try {
    let reply: string
    if (provider === "gemini") reply = await callGemini(system, messages, userQuery)
    else reply = await callOpenAICompatible(system, messages, userQuery)
    return NextResponse.json({ reply })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal memproses pesan"
    console.error("chat route error:", e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
