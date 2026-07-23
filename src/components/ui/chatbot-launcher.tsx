"use client"

import { useState, useEffect } from "react"
import { MessageCircleIcon, XIcon } from "./chatbot-icons"

export function ChatbotLauncher({ onClick, open }: { onClick: () => void; open: boolean }) {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours()
      setOffline(h >= 21)
    }
    check()
    const t = setInterval(check, 60 * 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-5 z-[60] flex items-center gap-2 rounded-full bg-[#075E54] hover:bg-[#054E43] px-5 py-3.5 text-white shadow-xl shadow-[#25D366]/30 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#075E54] focus:ring-offset-2"
    >
      {open ? <XIcon className="h-5 w-5" /> : <MessageCircleIcon className="h-5 w-5" />}
      <span className="text-sm font-semibold">{open ? "Tutup" : offline ? "CS Offline" : "CS Online"}</span>
    </button>
  )
}
