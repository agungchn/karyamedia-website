"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, X } from "lucide-react"
import { products } from "@/data/products"
import { categories } from "@/data/categories"

function SearchDropdown({ query, onQueryChange, onClose }: { query: string; onQueryChange: (v: string) => void; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("keydown", handleKey)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const q = query.toLowerCase().trim()
  const results = q
    ? products
        .filter((p) => {
          const cat = categories.find((c) => c.id === p.categoryId)
          const sub = cat?.subcategories.find((s) => s.id === p.subcategoryId)
          const aliases = sub?.aliases ?? []
          return (
            p.name.toLowerCase().includes(q) ||
            p.code.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            cat?.name.toLowerCase().includes(q) ||
            sub?.name.toLowerCase().includes(q) ||
            aliases.some((a) => a.toLowerCase().includes(q))
          )
        })
        .slice(0, 8)
    : []

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || categoryId

  return (
    <div ref={dropdownRef} className="relative">
      <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white text-gray-900 border border-accent/30 shadow-xl">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Temukan Produk Anda Disini..."
          className="flex-1 text-sm placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
        {query && (
          <button onClick={() => { onQueryChange(""); inputRef.current?.focus() }} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {q && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto">
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/katalog-produk/${p.categoryId}/${p.subcategoryId}/${p.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                <Image src={p.images[0] || "/placeholder.png"} alt={`${p.name} - ${categories.find((c) => c.id === p.categoryId)?.subcategories.find((s) => s.id === p.subcategoryId)?.name || categories.find((c) => c.id === p.categoryId)?.name || "Souvenir"} Karyamedia Jogja`} width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm text-gray-900 group-hover:text-accent-accessible transition-colors truncate">{p.name}</div>
                <div className="text-xs text-gray-400">{p.code} &middot; {getCategoryName(p.categoryId)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {q && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 px-4 py-6 text-center text-sm text-gray-400">
          Tidak ditemukan produk untuk &quot;{query}&quot;
        </div>
      )}
    </div>
  )
}

export function HeroSearch({ query, onQueryChange, onClose }: { query: string; onQueryChange: (v: string) => void; onClose: () => void }) {
  return (
    <div className="w-full max-w-md">
      <SearchDropdown query={query} onQueryChange={onQueryChange} onClose={onClose} />
    </div>
  )
}
