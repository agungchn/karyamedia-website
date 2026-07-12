"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background">
      <div className="text-center px-4 sm:px-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/5 mb-8">
          <span className="text-5xl font-bold text-accent">?</span>
        </div>
        <h1 className="text-7xl sm:text-9xl font-bold text-primary mb-2">404</h1>
        <div className="w-16 h-0.5 bg-accent mx-auto mb-6" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-[#0A1A30] text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-full font-medium border border-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Halaman Sebelumnya
          </button>
        </div>
      </div>
    </div>
  )
}
