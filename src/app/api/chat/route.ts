import { NextRequest, NextResponse } from "next/server"
import { buildSystemPrompt } from "@/lib/chat-context"

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

async function callOpenAICompatible(system: string, messages: ChatMessage[]) {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("OPENAI_API_KEY belum diatur di environment")
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "")
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      max_tokens: 600,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`LLM ${res.status}: ${t.slice(0, 300)}`)
  }
  const j = await res.json()
  return j.choices?.[0]?.message?.content?.trim() || ""
}

async function callGemini(system: string, messages: ChatMessage[]) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("GEMINI_API_KEY belum diatur di environment")
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash"
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature: 0.5, maxOutputTokens: 600 },
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Gemini ${res.status}: ${t.slice(0, 300)}`)
  }
  const j = await res.json()
  return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""
}

async function callAnthropic(system: string, messages: ChatMessage[]) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error("ANTHROPIC_API_KEY belum diatur di environment")
  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5"
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 600,
      system,
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

  try {
    let reply: string
    if (provider === "gemini") reply = await callGemini(system, messages)
    else if (provider === "anthropic") reply = await callAnthropic(system, messages)
    else reply = await callOpenAICompatible(system, messages)
    return NextResponse.json({ reply })
  } catch (e: any) {
    console.error("chat route error:", e)
    return NextResponse.json(
      { error: e?.message || "Gagal memproses pesan" },
      { status: 500 },
    )
  }
}
