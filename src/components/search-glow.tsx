"use client"

import { useEffect, useRef } from "react"

const glowColorMap = {
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
}

export function SearchGlow({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLStyleElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const { base, spread } = glowColorMap.orange
    let rafId: number

    const syncPointer = (e: PointerEvent) => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const { clientX: x, clientY: y } = e
        const xp = x / window.innerWidth
        const hue = base + xp * spread
        const bs = 3
        const sl = 200
        el.style.setProperty("--x", `${x}px`)
        el.style.setProperty("--y", `${y}px`)
        el.style.setProperty("--hue", `${hue}`)
        el.style.setProperty("--sl", `${sl}px`)
        el.style.setProperty("--bs", `${bs}px`)
        if (styleRef.current) {
          styleRef.current.textContent = `
            [data-glow]::before, [data-glow]::after {
              pointer-events: none; content: ""; position: absolute;
              inset: calc(var(--bs) * -1);
              border: var(--bs) solid transparent;
              border-radius: 16px;
              background-attachment: fixed;
              background-size: calc(100% + ${2 * bs}px) calc(100% + ${2 * bs}px);
              background-repeat: no-repeat; background-position: 50% 50%;
              mask: linear-gradient(transparent,transparent), linear-gradient(white,white);
              mask-clip: padding-box, border-box; mask-composite: intersect;
            }
            [data-glow]::before {
              background-image: radial-gradient(calc(var(--sl)*0.75) calc(var(--sl)*0.75) at var(--x) var(--y), hsla(var(--hue),100%,50%,1), transparent 100%);
              filter: brightness(2);
            }
            [data-glow]::after {
              background-image: radial-gradient(calc(var(--sl)*0.5) calc(var(--sl)*0.5) at var(--x) var(--y), hsl(0,100%,100%), transparent 100%);
            }
          `
        }
      })
    }

    document.addEventListener("pointermove", syncPointer)
    return () => {
      document.removeEventListener("pointermove", syncPointer)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      data-glow
      className="relative rounded-2xl"
      style={{ position: "relative", touchAction: "none" }}
    >
      <style ref={styleRef} />
      <div data-glow className="pointer-events-none absolute inset-0 rounded-2xl" />
      {children}
    </div>
  )
}
