"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ThumbsUp } from "lucide-react"
import type { Testimonial } from "@/data/testimonials"
import { TiltLogo } from "@/components/tilt-logo"

interface Props {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: Props) {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [isPaused, setIsPaused] = useState(false)

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const share = (t: Testimonial) => {
    if (navigator.share) {
      navigator.share({
        title: `Testimonial ${t.name}`,
        text: `"${t.content}" — ${t.name}`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`"${t.content}" — ${t.name}`)
    }
  }

  const duplicated = [...testimonials, ...testimonials]

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
      {/* Google-style header — left side */}
      <div className="lg:min-w-[250px] shrink-0 w-full lg:w-auto">
        <div className="flex gap-4 items-center">
          <TiltLogo size="sm" />
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Karyamedia</h3>
            <div className="flex items-center gap-0.5 mb-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-gray-500 mb-1.5">377 ulasan</p>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-primary-light to-[#2563EB] rounded-full shadow-md hover:shadow-lg hover:scale-105 hover:from-[#1E40AF] hover:to-primary-light transition-all duration-200"
            >
              Tulis ulasan
            </a>
          </div>
        </div>
      </div>

      {/* Marquee — right side */}
      <div
        className="relative flex-1 min-w-0 w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div
          className="flex gap-6"
          style={{
            animation: `marquee ${testimonials.length * 4}s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {duplicated.map((t, i) => (
            <div key={`${t.id}-${i}`} className="w-[320px] p-5 md:p-6 flex flex-col border border-gray-200 rounded-2xl shrink-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                  {t.photo ? (
                    <Image src={t.photo} alt={t.name} width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-primary font-semibold text-xs">{t.name.split(" ").map(s => s[0]).join("").slice(0, 2)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-900 leading-tight">{t.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                      ))}
                    </div>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
                      <circle cx="12" cy="12" r="12" fill="#1D4ED8"/>
                      <path d="M7 12.5l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {t.position}{t.organization ? ` — ${t.organization}` : ""}
                  </p>
                </div>
                <svg viewBox="0 0 48 48" className="w-4 h-4 shrink-0 mt-0.5 ml-auto">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                  <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A22.98 22.98 0 0 0 1 24c0 3.68.87 7.16 2.34 10.18l7.35-5.7z"/>
                  <path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.69 29.93 1.5 24 1.5 15.4 1.5 7.96 6.43 4.34 13.82l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
                </svg>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed flex-1">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3 mt-auto pt-3">
                <button
                  onClick={() => toggleLike(t.id)}
                  className={`flex items-center gap-1 text-[11px] transition-colors ${
                    liked.has(t.id) ? "text-primary-light" : "text-gray-500 hover:text-primary-light"
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${liked.has(t.id) ? "fill-primary-light" : ""}`} />
                  Berguna
                </button>
                <span className="text-[11px] text-gray-300">|</span>
                <button
                  onClick={() => share(t)}
                  className="text-[11px] text-gray-500 hover:text-primary-light transition-colors"
                >
                  Bagikan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
