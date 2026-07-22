"use client"

import lazyHydrate from "next-lazy-hydrate"

// Lazy hydrate chatbot on idle (when browser is free) — saves ~380ms JS execution
export const LazyChatbot = lazyHydrate(
  () => import("./chatbot-widget").then((m) => ({ default: m.ChatbotWidget })),
  { on: ["idle"], compatibleMode: true }
)
