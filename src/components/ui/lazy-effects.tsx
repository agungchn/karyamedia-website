"use client"

import dynamic from "next/dynamic"

export const LazySparklesCore = dynamic(
  () => import("@/components/ui/sparkles-core").then((m) => m.SparklesCore),
  {
    ssr: false,
    loading: () => null,
  }
)

export const LazyRetroGrid = dynamic(
  () => import("@/components/ui/retro-grid").then((m) => m.RetroGrid),
  {
    ssr: false,
    loading: () => null,
  }
)
