"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FaqItem {
  q: string
  a: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white overflow-hidden">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.a }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
