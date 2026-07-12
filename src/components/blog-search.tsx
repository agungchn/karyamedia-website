"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ChevronRight, Search, X } from "lucide-react"

interface ArticleSummary {
  slug: string
  title: string
  description: string
  category: string
  date: string
  image: string
}

export function BlogSearch({ articles }: { articles: ArticleSummary[] }) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")

  const categories = useMemo(() => {
    const cats = [...new Set(articles.map((a) => a.category))]
    return ["Semua", ...cats.sort()]
  }, [articles])

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = activeCategory === "Semua" || a.category === activeCategory
      if (!query.trim()) return matchCat
      const q = query.toLowerCase()
      return (
        matchCat &&
        (a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q))
      )
    })
  }, [articles, query, activeCategory])

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? "bg-accent text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-accent/10 hover:text-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Tidak ada artikel ditemukan</p>
          <p className="text-sm mt-1">Coba kata kunci atau kategori lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
                    Karyamedia Souvenir
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white font-bold text-sm line-clamp-2">{article.title}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-accent font-medium">{article.category}</span>
                </div>
                <h2 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-accent font-medium mt-4 group-hover:gap-2 transition-all">
                  Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
