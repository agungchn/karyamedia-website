"use client"

import { useState, type ReactNode } from "react"

interface Props {
  slug: string
  title: string
}

const ICONS: Record<string, ReactNode> = {
  whatsapp: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.388 11.82 11.82 0 013.64 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.437-9.907-9.885-9.907-5.58 0-10.016 4.44-10.018 9.982-.001 2.053.612 3.984 1.679 5.608l-1.14 4.155 4.183-1.095zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.149.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 10-11.563 9.876v-6.988H7.977V12h2.46V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.888h-2.33v6.988A10 10 0 0022 12z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.08 2.46 7.58 5.98 9.1-.08-.78-.16-1.98.03-2.83.18-.78 1.16-4.97 1.16-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.26.64 1.26 1.4 0 .86-.54 2.14-.83 3.33-.24 1 .5 1.82 1.49 1.82 1.79 0 3.16-1.89 3.16-4.61 0-2.41-1.73-4.1-4.21-4.1-2.87 0-4.56 2.15-4.56 4.38 0 .87.33 1.8.75 2.3.08.1.09.19.07.29l-.28 1.14c-.04.17-.14.21-.32.13-1.18-.55-1.92-2.27-1.92-3.66 0-2.98 2.16-5.71 6.23-5.71 3.27 0 5.81 2.33 5.81 5.45 0 3.25-2.05 5.87-4.89 5.87-.96 0-1.86-.5-2.17-1.09l-.59 2.25c-.21.84-.79 1.89-1.18 2.53.89.27 1.83.42 2.81.42 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
}

const COLORS: Record<string, string> = {
  whatsapp: "#25D366",
  facebook: "#1877F2",
  x: "#000000",
  pinterest: "#E60023",
  link: "#6B7280",
}

export function ShareButtons({ slug, title }: Props) {
  const [copied, setCopied] = useState(false)

  const shareUrl = () =>
    (typeof window !== "undefined" ? window.location.origin : "https://karyamediasouvenir.com") +
    "/blog/" +
    slug

  const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer")

  const share = (platform: keyof typeof ICONS) => {
    const url = shareUrl()
    const text = encodeURIComponent(title)
    const u = encodeURIComponent(url)
    switch (platform) {
      case "whatsapp":
        return open(`https://wa.me/?text=${text}%20${u}`)
      case "facebook":
        return open(`https://www.facebook.com/sharer/sharer.php?u=${u}`)
      case "x":
        return open(`https://twitter.com/intent/tweet?url=${u}&text=${text}`)
      case "pinterest":
        return open(`https://pinterest.com/pin/create/button/?url=${u}&description=${text}`)
      default:
        return copy(url)
    }
  }

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  const buttons: Array<keyof typeof ICONS> = [
    "whatsapp",
    "facebook",
    "x",
    "pinterest",
    "link",
  ]

  const labels: Record<string, string> = {
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    x: "X",
    pinterest: "Pinterest",
    link: copied ? "Tersalin!" : "Salin tautan",
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-500 mr-1">Bagikan:</span>
      {buttons.map((b) => (
        <button
          key={b}
          type="button"
          onClick={() => share(b)}
          aria-label={`Bagikan ke ${labels[b]}`}
          title={`Bagikan ke ${labels[b]}`}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-white text-sm font-medium transition-transform hover:-translate-y-0.5 hover:shadow-md"
          style={{ backgroundColor: COLORS[b] }}
        >
          {ICONS[b]}
          <span className="hidden sm:inline">{labels[b]}</span>
        </button>
      ))}
    </div>
  )
}
