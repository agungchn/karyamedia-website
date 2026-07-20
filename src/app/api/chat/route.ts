import { NextRequest, NextResponse } from "next/server"
import { buildSystemPrompt } from "@/lib/chat-context"
import { articles } from "@/data/articles"

export const runtime = "nodejs"

type ChatMessage = { role: "user" | "assistant"; content: string }

function sanitize(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return []
  return messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m as any).role === "user" || (m as any).role === "assistant",
    )
    .filter((m) => typeof m.content === "string" && m.content.trim().length > 0)
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 2000) }))
}

function searchArticles(query: string): string {
  const q = query.toLowerCase()
  const found = articles
    .filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    )
    .slice(0, 5)
  if (found.length === 0) return ""
  return found
    .map(
      (a, i) =>
        `${i + 1}. "${a.title}" — ${a.description.slice(0, 100)}...\n   https://karyamediasouvenir.com/blog/${a.slug}`
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

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      max_tokens: 4096,
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
  const res = await fetch(url, {
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

async function callAnthropic(system: string, messages: ChatMessage[], userQuery: string) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error("ANTHROPIC_API_KEY belum diatur di environment")
  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5"

  const searchResult = searchArticles(userQuery)
  const context = searchResult
    ? `\n\nARTIKEL TERKAIT DARI WEBSITE:\n${searchResult}\n\nGunakan artikel di atas jika relevan untuk merekomendasikan konten website kepada pengguna. Cantumkan link artikel jika kamu merekomendasikannya.`
    : ""

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: system + context,
      messages,
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Anthropic ${res.status}: ${t.slice(0, 300)}`)
  }
  const j = await res.json()
  return j.content?.[0]?.text?.trim() || ""
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid" }, { status: 400 })
  }

  const messages = sanitize(body?.messages)
  if (!messages.length) {
    return NextResponse.json({ error: "Pesan kosong" }, { status: 400 })
  }

  const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase()
  const system = buildSystemPrompt()
  const userQuery = messages[messages.length - 1]?.content || ""

  try {
    let reply: string
    if (provider === "gemini") reply = await callGemini(system, messages, userQuery)
    else if (provider === "anthropic") reply = await callAnthropic(system, messages, userQuery)
    else reply = await callOpenAICompatible(system, messages, userQuery)
    return NextResponse.json({ reply })
  } catch (e: any) {
    console.error("chat route error:", e)
    return NextResponse.json(
      { error: e?.message || "Gagal memproses pesan" },
      { status: 500 },
    )
  }
}
