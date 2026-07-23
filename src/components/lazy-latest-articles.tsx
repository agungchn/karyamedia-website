"use client"

import dynamic from "next/dynamic"

interface Item {
  slug: string
  title: string
  description: string
  image: string
  category: string
}

const LatestArticlesSlider = dynamic(
  () => import("@/components/ui/latest-articles-slider").then((m) => m.LatestArticlesSlider),
  {
    ssr: false,
    loading: () => <div className="bg-gray-50 py-10 h-[360px] animate-pulse" />,
  }
)

export function LazyLatestArticles({ articles }: { articles: Item[] }) {
  return <LatestArticlesSlider articles={articles} />
}
