"use client"

import { useEffect, useRef, ReactNode } from "react"

interface HolographicCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: "default" | "gold"
}

export function HolographicCard({ children, className = "", style, variant = "default" }: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const w = rect.width
      const h = rect.height
      const pctX = (x / w) * 100
      const pctY = (y / h) * 100
      const rx = ((y - h / 2) / h) * -20
      const ry = ((x - w / 2) / w) * 20

      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`
      el.style.boxShadow = `${(pctX - 50) * 0.15}px ${(pctY - 50) * 0.15}px 25px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)`
      el.style.setProperty("--hx", `${pctX}%`)
      el.style.setProperty("--hy", `${pctY}%`)
    }

    const onLeave = () => {
      el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)"
      el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)"
      el.style.setProperty("--hx", "50%")
      el.style.setProperty("--hy", "50%")
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  const isGold = variant === "gold"

  return (
    <>
      <style>{`
        .hologrid {
          position: relative;
          overflow: hidden;
          transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
          will-change: transform;
        }
        .hologrid::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          opacity: ${isGold ? "0" : "1"};
          transition: opacity 0.3s ease;
          background: ${isGold
            ? "radial-gradient(circle at var(--hx, 50%) var(--hy, 50%), hsl(45 80% 60% / 0.25), hsl(40 70% 40% / 0.15), transparent 60%)"
            : "radial-gradient(circle at var(--hx, 50%) var(--hy, 50%), hsl(220 80% 70% / 0.18), hsl(280 70% 50% / 0.1), transparent 60%)"};
          z-index: 1;
        }
        .hologrid:hover::after {
          opacity: 1;
        }
        .hologrid::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          opacity: ${isGold ? "0" : "1"};
          transition: opacity 0.3s ease;
          background: ${isGold
            ? "radial-gradient(circle at var(--hx, 50%) var(--hy, 50%), rgba(255,215,0,0.15), transparent 60%)"
            : "radial-gradient(circle at var(--hx, 50%) var(--hy, 50%), rgba(255,255,255,0.15), transparent 60%)"};
          z-index: 2;
        }
        .hologrid:hover::before {
          opacity: 1;
        }
        .hologrid > .holo-inner {
          position: relative;
          z-index: 3;
          transition: transform 0.15s ease-out;
        }
        .hologrid:hover > .holo-inner {
          transform: translate(
            calc((var(--hx, 50) - 50) * 0.3px),
            calc((var(--hy, 50) - 50) * 0.3px)
          );
        }
        .gold-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          z-index: 4;
          border-radius: 16px 16px 0 0;
          background: linear-gradient(90deg, #D4AF37, #F0D78C, #D4AF37);
        }
      `}</style>
      <div
        ref={ref}
        className={`hologrid ${className}`}
        style={style}
      >
        {isGold && <div className="gold-line" />}
        <div className="holo-inner">
          {children}
        </div>
      </div>
    </>
  )
}
