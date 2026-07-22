"use client"

import { Suspense, lazy, useState } from "react"
import { ChatbotLauncher } from "./chatbot-launcher"

const LazyPanel = lazy(() => import("./chatbot-panel").then((m) => ({ default: m.ChatbotPanel })))

export function LazyChatbot() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelMounted, setPanelMounted] = useState(false)

  const handleToggle = () => {
    if (!panelMounted) setPanelMounted(true)
    setPanelOpen((v) => !v)
  }

  return (
    <>
      <ChatbotLauncher onClick={handleToggle} open={panelOpen} />
      {panelMounted && (
        <Suspense fallback={null}>
          <LazyPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
        </Suspense>
      )}
    </>
  )
}
