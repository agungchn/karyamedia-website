"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const SparklesCoreImpl = dynamic(
  () => import("@/components/ui/sparkles-core").then((m) => m.SparklesCore),
  {
    ssr: false,
    loading: () => null,
  }
)

const RetroGridImpl = dynamic(
  () => import("@/components/ui/retro-grid").then((m) => m.RetroGrid),
  {
    ssr: false,
    loading: () => null,
  }
)

const MOBILE_DENSITY = 28

export function LazySparklesCore(props: {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const density =
    isMobile && props.particleDensity
      ? Math.min(props.particleDensity, MOBILE_DENSITY)
      : props.particleDensity

  return <SparklesCoreImpl {...props} particleDensity={density} />
}

export function LazyRetroGrid(props: {
  angle?: number
  cellSize?: number
  opacity?: number
  lightLineColor?: string
  darkLineColor?: string
  className?: string
}) {
  return <RetroGridImpl {...props} />
}
