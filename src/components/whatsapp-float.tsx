"use client"

import { useRef } from "react"
import { MessageCircle } from "lucide-react"
import { getWhatsAppLink } from "@/lib/utils"

function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = "sine"
    osc.frequency.setValueAtTime(880, now)
    gain.gain.setValueAtTime(0.8, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
    osc.start(now)
    osc.stop(now + 0.4)

    setTimeout(() => {
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.type = "sine"
      osc2.frequency.setValueAtTime(1108.73, ctx.currentTime)
      gain2.gain.setValueAtTime(0.8, ctx.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      osc2.start(ctx.currentTime)
      osc2.stop(ctx.currentTime + 0.5)
    }, 200)
  } catch { /* silent */ }
}

export function WhatsAppFloat() {
  const linkRef = useRef<HTMLAnchorElement>(null)

  const handleClick = () => {
    playChime()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        ref={linkRef}
        href={getWhatsAppLink("Halo Karyamedia Souvenir, saya ingin konsultasi.")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl shadow-[#25D366]/30 transition-all hover:scale-105 animate-pulse-glow group"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-semibold hidden sm:inline">Chat WhatsApp</span>
      </a>
    </div>
  )
}
