"use client"

import dynamic from "next/dynamic"
import type { Testimonial } from "@/data/testimonials"

const TestimonialCarousel = dynamic(
  () => import("@/components/ui/testimonial-carousel").then((m) => m.TestimonialCarousel),
  {
    ssr: false,
    loading: () => <div className="bg-white py-10 h-[260px] animate-pulse" />,
  }
)

export function LazyTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return <TestimonialCarousel testimonials={testimonials} />
}
