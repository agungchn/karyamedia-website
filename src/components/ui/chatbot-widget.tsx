"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, MessageSquareText } from "lucide-react"
import { getWhatsAppLink } from "@/lib/utils"

const GREETING =
  "Halo! Saya asisten virtual Karyamedia Souvenir 👋\nAda yang bisa saya bantu seputar plakat, medali, piala, souvenir wisuda, & souvenir custom? Untuk pemesanan & penawaran, bisa lanjut ke WhatsApp CS kami ya."

type Msg = { role: "user" | "assistant"; content: string }

const SUGGESTIONS = [
  "Jam buka Karyamedia kapan?",
  "Minimal order berapa?",
  "Gimana cara pesan?",
  "Ada katalog produknya?",
]

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: GREETING }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [msgs, loading, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function send(preset?: string) {
    const text = (preset ?? input).trim()
    if (!text || loading) return
    const history = [...msgs, { role: "user", content: text }] as Msg[]
    setMsgs(history)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal memproses")
      setMsgs([...history, { role: "assistant", content: data.reply || "(tanpa balasan)" }])
    } catch (e: any) {
      setMsgs([
        ...history,
        {
          role: "assistant",
          content:
            "Maaf, saya sedang tidak bisa menjawab 😔 Silakan hubungi CS kami langsung via WhatsApp ya.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const waLink = getWhatsAppLink("Halo, saya ingin konsultasi & memesan souvenir custom.")

  return (
    <>
      {/* Launcher langsung ke chatbot */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup chat" : "Buka chat asisten"}
        className="fixed bottom-6 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-accessible text-primary shadow-xl shadow-accent/30 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-[7.5rem] right-5 z-[60] flex h-[520px] max-h-[calc(100vh-9rem)] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-accent/20 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Asisten Karyamedia</p>
              <p className="text-[11px] text-accent">Online · CS Souvenir Custom</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="rounded-lg p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-accent text-primary"
                      : "rounded-bl-sm bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {msgs.length === 1 && !loading && (
              <div className="flex flex-wrap justify-start gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-accent/40 bg-white px-3 py-1.5 text-xs text-primary shadow-sm transition hover:bg-accent/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-gray-400 shadow-sm">
                  mengetik…
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp handoff */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition hover:brightness-105"
          >
            <MessageSquareText className="h-4 w-4" />
            Lanjut ke WhatsApp CS
          </a>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Tulis pertanyaan…"
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Kirim"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
