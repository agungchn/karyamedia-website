import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set("page", String(page))
    } else {
      params.delete("page")
    }
    const qs = params.toString()
    return `${baseUrl}${qs ? `?${qs}` : ""}`
  }

  const pages: (number | "...")[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push("...")
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push("...")
    pages.push(totalPages)
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Paginasi">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 py-2 text-sm text-gray-400">...</span>
        ) : (
          <Link
            key={p}
            href={buildUrl(p)}
            className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-[#002878] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Halaman berikutnya"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  )
}
