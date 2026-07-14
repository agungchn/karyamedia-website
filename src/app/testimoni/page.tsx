import type { Metadata } from "next"
import Image from "next/image"
import { Star, MessageCircle } from "lucide-react"
import { testimonials } from "@/data/testimonials"
import { companyInfo } from "@/data/company"
import { getWhatsAppLink } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Testimoni Klien - Karyamedia Souvenir",
  description:
    "Kumpulan testimoni & ulasan klien Karyamedia Souvenir: instansi pemerintah, kampus, perusahaan, dan event yang mempercayakan souvenir custom sejak 2001.",
  alternates: {
    canonical: "/testimoni",
  },
  openGraph: {
    title: "Testimoni Klien Karyamedia Souvenir",
    description:
      "Apa kata klien kami? Instansi, kampus, dan perusahaan berbagi pengalaman pesan souvenir custom di Karyamedia.",
    url: "/testimoni",
  },
}

const totalRatings = testimonials.reduce((sum, t) => sum + t.rating, 0)
const averageRating = (totalRatings / testimonials.length).toFixed(1)

const reviewsSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: companyInfo.name,
  url: "https://karyamediasouvenir.com",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: averageRating,
    reviewCount: testimonials.length,
    bestRating: 5,
    worstRating: 1,
  },
  review: testimonials.map((t) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: t.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: t.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: t.content,
  })),
}

export default function TestimoniPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />

      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/15 text-accent-accessible px-4 py-1.5 rounded-full text-sm mb-6 border border-accent/20">
            <MessageCircle className="w-4 h-4" />
            Testimoni Klien
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-white mb-4">
            Apa Kata Klien Kami
          </h1>
          <p className="text-blue-200/80 max-w-2xl mx-auto">
            Kepercayaan instansi, kampus, perusahaan, dan penyelenggara event yang telah
            memesan souvenir custom di Karyamedia Souvenir.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white font-semibold">{averageRating}</span>
            <span className="text-blue-200/70 text-sm">dari {testimonials.length} ulasan</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="flex flex-col bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                  {t.photo ? (
                    <Image src={t.photo} alt={t.name} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-primary font-semibold text-sm">
                      {t.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                  <div className="flex items-center gap-1 my-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {t.position}{t.organization ? ` — ${t.organization}` : ""}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed flex-1">
                &ldquo;{t.content}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
          <h2 className="font-semibold text-gray-900 mb-2">Pesan souvenir Anda berikutnya di Karyamedia?</h2>
          <p className="text-sm text-gray-500 mb-5">
            Konsultasi gratis untuk kebutuhan plakat, medali, piala, wisuda, dan souvenir custom.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#075E54] hover:bg-[#054E43] text-white px-6 py-3 rounded-full font-medium transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Chat WhatsApp
            </a>
            <a
              href={companyInfo.gbpReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              Beri Ulasan di Google
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
