"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background">
      <div className="text-center px-4 sm:px-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 mb-8">
          <span className="text-4xl">⚠️</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-3">
          Terjadi Kesalahan
        </h1>
        <div className="w-16 h-0.5 bg-accent mx-auto mb-6" />
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi tim kami jika masalah berlanjut.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-primary hover:bg-[#0A1A30] text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-full font-medium border border-gray-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-gray-400 mt-8">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
