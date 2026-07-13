import RuixenCarouselWave, { type RuixenCardProps } from "@/components/ui/ruixen-carousel-wave"

interface Item {
  slug: string
  title: string
  description: string
  image: string
  category: string
}

const variants = ["pink", "indigo", "orange"] as const

export function LatestArticlesSlider({ articles }: { articles: Item[] }) {
  if (!articles.length) return null

  const cards: RuixenCardProps[] = articles.map((a, i) => ({
    id: a.slug,
    title: a.title,
    subtitle: a.description,
    image: a.image,
    href: `/blog/${a.slug}`,
    badge: { text: a.category, variant: variants[i % variants.length] },
  }))

  return (
    <section className="bg-gray-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
        <h2 className="heading-display text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Artikel Terbaru
        </h2>
        <p className="text-gray-500 text-sm mt-1">Tips &amp; panduan souvenir custom dari Karyamedia</p>
      </div>
      <RuixenCarouselWave cards={cards} />
    </section>
  )
}
