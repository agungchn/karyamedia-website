import { Star } from "lucide-react"
import { companyInfo } from "@/data/company"

export function GbpReviewCta({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <a
        href={companyInfo.gbpReviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-accent/40 hover:bg-accent/5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 transition-colors"
      >
        <span className="flex items-center text-amber-400">
          <Star className="w-4 h-4 fill-amber-400" />
        </span>
        Beri Ulasan di Google
      </a>
    )
  }

  return (
    <section className="bg-[#000030] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <h2 className="heading-display text-3xl md:text-4xl text-white mb-4">
          Puas dengan Layanan Kami?
        </h2>
        <p className="text-blue-100/80 mb-8 max-w-2xl mx-auto">
          Pengalaman Anda sangat berarti. Beri ulasan singkat di Google Business Profile
          untuk membantu klien lain menemukan produsen souvenir custom terpercaya di Yogyakarta.
        </p>
        <a
          href={companyInfo.gbpReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white hover:bg-accent hover:text-white text-primary px-8 py-3 rounded-full font-medium transition-all hover:shadow-lg"
        >
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          Beri Ulasan di Google
        </a>
      </div>
    </section>
  )
}
