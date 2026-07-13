"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

const GeometricBackground = dynamic(
  () => import("@/components/ui/geometric-bg").then((m) => m.GeometricBackground),
  { ssr: false }
)

export default function GeometricBackgroundLazy() {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          obs.disconnect()
        }
      },
      { rootMargin: "300px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return <div ref={ref} className="absolute inset-0">{show && <GeometricBackground />}</div>
}
