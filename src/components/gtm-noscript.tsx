"use client"

import { useEffect } from "react"

/**
 * GTM noscript fallback — di-render hanya di client setelah hydrasi
 * untuk menghindari React error #418 (cannot render <noscript> outside document).
 */
export function GtmNoscript() {
  useEffect(() => {
    const iframe = document.createElement("iframe")
    iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-T43BWBSQ"
    iframe.height = "0"
    iframe.width = "0"
    iframe.style.display = "none"
    iframe.style.visibility = "hidden"
    document.body.appendChild(iframe)
  }, [])

  return null
}
