"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Award } from "lucide-react"
import { getWhatsAppLink, generateWhatsAppMessage } from "@/lib/utils"
import { Pagination } from "@/components/pagination"

interface Product {
  id: string
  code: string
  name: string
  slug: string
  subcategoryId: string
  shortDescription: string
  image: string
  bestSeller?: boolean
}

const ITEMS_PER_PAGE = 20

export function SubcategoryProductGrid({
  products,
  categoryName,
  subName,
  categorySlug,
  subSlug,
}: {
  products: Product[]
  categoryName: string
  subName: string
  categorySlug: string
  subSlug: string
}) {
  const [currentPage, setCurrentPage] = useState(1)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = products.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Produk Segera Hadir</h2>
        <p className="text-gray-500 mb-6">Produk untuk subkategori ini sedang dalam proses penambahan.</p>
        <Link
          href={`/katalog-produk/${categorySlug}`}
          className="inline-flex items-center gap-2 text-accent-accessible font-medium hover:text-accent-accessible"
        >
          Kembali ke {categoryName}
        </Link>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-gray-500 mb-6">
        Menampilkan {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, products.length)} dari {products.length} produk
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((product, idx) => (
          <div
            key={`${product.id}-${idx}`}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={`${product.name} - ${subName || categoryName || "Souvenir"} Karyamedia Souvenir`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-16 h-16 text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {product.bestSeller && (
                <span className="absolute top-3 left-3 bg-accent text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  Best Seller
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full mb-1">
                  {product.subcategoryId}
                </span>
                <p className="text-white font-bold text-sm line-clamp-2">{product.name}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1">{product.code}</p>
              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {product.shortDescription}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href={`/katalog-produk/${categorySlug}/${subSlug}/${product.slug}`}
                  className="flex-1 text-center py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Detail
                </Link>
                <a
                  href={getWhatsAppLink(generateWhatsAppMessage(product.code, product.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 rounded-lg bg-[#075E54] text-white text-xs font-medium hover:bg-[#054E43] transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Paginasi">
          {currentPage > 1 && (
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Sebelumnya
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-[#002878] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Berikutnya
            </button>
          )}
        </nav>
      )}
    </>
  )
}
