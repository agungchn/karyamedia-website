import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import {
  ChevronRight,
  Award,
  Medal,
  Trophy,
  GraduationCap,
  Package,
  Gem,
  Scroll,
  MapPin,
  Calendar,
  Shield,
  Users,
  Palette,
  DollarSign,
  CheckCircle,
  MessageCircle,
  Send,
  PenTool,
  Settings,
  Truck,
  ArrowRight,
} from "lucide-react"
import { productIconMap, advantageIconMap } from "@/components/icons/product-icons"
import dynamic from "next/dynamic"
import { HeroSection } from "@/components/ui/hero-section"
import GeometricBackgroundLazy from "@/components/ui/geometric-bg-lazy"
import { HolographicCard } from "@/components/ui/holographic-card"

const LatestArticlesSlider = dynamic(
  () => import("@/components/ui/latest-articles-slider").then((m) => m.LatestArticlesSlider),
  { ssr: true }
)


const TestimonialCarousel = dynamic(() =>
  import("@/components/ui/testimonial-carousel").then((m) => m.TestimonialCarousel)
)

import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { testimonials } from "@/data/testimonials"
import { articles } from "@/data/articles"
import { LocalBusinessReviewsSchema } from "@/components/json-ld"
import { companyInfo } from "@/data/company"
import { getWhatsAppLink, generateWhatsAppMessage } from "@/lib/utils"

const latestArticles = [...articles]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 12)
  .map((a) => ({ slug: a.slug, title: a.title, description: a.description, image: a.image, category: a.category }))

export const metadata: Metadata = {
  description:
    "Produsen souvenir custom sejak 2001. Plakat akrilik, medali, piala, prasasti, souvenir wisuda & merchandise custom. Berbasis Yogyakarta, siap kirim seluruh Indonesia.",
  alternates: {
    canonical: "https://karyamediasouvenir.com",
  },
}

const iconMap: Record<string, React.ElementType> = {
  Award,
  Medal,
  Trophy,
  GraduationCap,
  Package,
  Gem,
  Scroll,
  MapPin,
  Calendar,
  Shield,
  Users,
  Palette,
  DollarSign,
  CheckCircle,
  MessageCircle,
  Send,
  PenTool,
  Settings,
  Truck,
}

const featuredProducts = products.filter((p) => p.featured)

const featuredByCategory = categories
  .map((cat) => {
    let prods = featuredProducts.filter((p) => p.categoryId === cat.id)
    if (cat.id === "piala") {
      const pt = prods.filter((p) => p.subcategoryId === "pt").sort(() => Math.random() - 0.5).slice(0, 2)
      const pg = prods.filter((p) => p.subcategoryId === "pg").sort(() => Math.random() - 0.5).slice(0, 2)
      prods = [...pt, ...pg]
    } else if (cat.id === "wisuda") {
      const ptw = prods.filter((p) => p.subcategoryId === "ptw").sort(() => Math.random() - 0.5).slice(0, 1)
      const gw = prods.filter((p) => p.subcategoryId === "gw").sort(() => Math.random() - 0.5).slice(0, 1)
      const kr = prods.filter((p) => p.subcategoryId === "kr").sort(() => Math.random() - 0.5).slice(0, 1)
      const tr = prods.filter((p) => p.subcategoryId === "tr").sort(() => Math.random() - 0.5).slice(0, 1)
      prods = [...ptw, ...gw, ...kr, ...tr]
    } else if (cat.id === "plakat") {
      const pa = prods.filter((p) => p.subcategoryId === "pa").sort(() => Math.random() - 0.5).slice(0, 1)
      const pkp = prods.filter((p) => p.subcategoryId === "pkp").sort(() => Math.random() - 0.5).slice(0, 1)
      const pm = prods.filter((p) => p.subcategoryId === "pm").sort(() => Math.random() - 0.5).slice(0, 1)
      const pw = prods.filter((p) => p.subcategoryId === "pw").sort(() => Math.random() - 0.5).slice(0, 1)
      prods = [...pa, ...pkp, ...pm, ...pw]
    } else {
      prods = prods.sort(() => Math.random() - 0.5).slice(0, 4)
    }
    return { category: cat, products: prods }
  })
  .filter((g) => g.products.length > 0)

const featuredImageMap: Record<string, string> = {
"name-tag-1": "/images/produk-unggulan/name-tag/name-tag-1.png",
  "name-tag-2": "/images/produk-unggulan/name-tag/name-tag-2.png",
  "name-tag-3": "/images/produk-unggulan/name-tag/name-tag-3.png",
  "name-tag-4": "/images/produk-unggulan/name-tag/name-tag-4.png",
  "name-tag-5": "/images/produk-unggulan/name-tag/name-tag-5.png",
  "name-tag-6": "/images/produk-unggulan/name-tag/name-tag-6.png",
  "name-tag-7": "/images/produk-unggulan/name-tag/name-tag-7.png",
  "name-tag-8": "/images/produk-unggulan/name-tag/name-tag-8.png",
  "name-tag-9": "/images/produk-unggulan/name-tag/name-tag-9.png",
  "name-tag-10": "/images/produk-unggulan/name-tag/name-tag-10.png",
  "name-tag-11": "/images/produk-unggulan/name-tag/name-tag-11.png",
  "name-tag-12": "/images/produk-unggulan/name-tag/name-tag-12.png",
  "name-tag-13": "/images/produk-unggulan/name-tag/name-tag-13.png",
  "name-tag-14": "/images/produk-unggulan/name-tag/name-tag-14.png",
  "name-tag-15": "/images/produk-unggulan/name-tag/name-tag-15.png",
  "name-tag-16": "/images/produk-unggulan/name-tag/name-tag-16.png",
  "name-tag-17": "/images/produk-unggulan/name-tag/name-tag-17.png",
  "name-tag-18": "/images/produk-unggulan/name-tag/name-tag-18.png",
  "name-tag-19": "/images/produk-unggulan/name-tag/name-tag-19.png",
  "name-tag-20": "/images/produk-unggulan/name-tag/name-tag-20.png",
  "name-tag-21": "/images/produk-unggulan/name-tag/name-tag-21.png",
  "name-tag-22": "/images/produk-unggulan/name-tag/name-tag-22.png",
  "name-tag-23": "/images/produk-unggulan/name-tag/name-tag-23.png",
  "name-tag-24": "/images/produk-unggulan/name-tag/name-tag-24.png",
  "name-tag-25": "/images/produk-unggulan/name-tag/name-tag-25.png",
  "name-tag-26": "/images/produk-unggulan/name-tag/name-tag-26.png",
  "name-tag-27": "/images/produk-unggulan/name-tag/name-tag-27.png",
  "name-tag-28": "/images/produk-unggulan/name-tag/name-tag-28.png",
  "name-tag-29": "/images/produk-unggulan/name-tag/name-tag-29.png",
  "name-tag-30": "/images/produk-unggulan/name-tag/name-tag-30.png",
  "papan-nama-meja-kantor-1": "/images/produk-unggulan/papan-nama/papan-nama-meja-kantor-1.png",
  "papan-nama-gantung-1": "/images/produk-unggulan/papan-nama/papan-nama-gantung-1.png",
  "papan-nama-akrilik-1": "/images/produk-unggulan/papan-nama/papan-nama-akrilik-1.png",
  "papan-nama-meja-kantor-2": "/images/produk-unggulan/papan-nama/papan-nama-meja-kantor-2.png",
  "papan-nama-gantung-2": "/images/produk-unggulan/papan-nama/papan-nama-gantung-2.png",
  "papan-nama-akrilik-2": "/images/produk-unggulan/papan-nama/papan-nama-akrilik-2.png",
  "papan-nama-meja-kantor-3": "/images/produk-unggulan/papan-nama/papan-nama-meja-kantor-3.png",
  "papan-nama-akrilik-3": "/images/produk-unggulan/papan-nama/papan-nama-akrilik-3.png",
  "papan-nama-gantung-3": "/images/produk-unggulan/papan-nama/papan-nama-gantung-3.png",
  "papan-nama-gantung-4": "/images/produk-unggulan/papan-nama/papan-nama-gantung-4.png",
  "papan-nama-akrilik-4": "/images/produk-unggulan/papan-nama/papan-nama-akrilik-4.png",
  "papan-nama-meja-kantor-5": "/images/produk-unggulan/papan-nama/papan-nama-meja-kantor-5.png",
  "papan-nama-gantung-5": "/images/produk-unggulan/papan-nama/papan-nama-gantung-5.png",
  "papan-nama-meja-kantor-6": "/images/produk-unggulan/papan-nama/papan-nama-meja-kantor-6.png",
  "papan-nama-meja-kantor-8": "/images/produk-unggulan/papan-nama/papan-nama-meja-kantor-8.png",
  "papan-nama-meja-kantor-9": "/images/produk-unggulan/papan-nama/papan-nama-meja-kantor-9.png",
  "papan-nama-meja-kantor-10": "/images/produk-unggulan/papan-nama/papan-nama-meja-kantor-10.png",
  "papan-nama-meja-ukiran": "/images/produk-unggulan/papan-nama/papan-nama-meja-ukiran.png",
  "papan-nama-meja-ukir": "/images/produk-unggulan/papan-nama/papan-nama-meja-ukir.png",
  "papan-nama-meja-akrilik": "/images/produk-unggulan/papan-nama/papan-nama-meja-akrilik.png",
  "tumbler-1": "/images/produk-unggulan/tumbler/tumbler-1.png",
  "tumbler-2": "/images/produk-unggulan/tumbler/tumbler-2.png",
  "tumbler-3": "/images/produk-unggulan/tumbler/tumbler-3.png",
  "tumbler-4": "/images/produk-unggulan/tumbler/tumbler-4.png",
  "tumbler-5": "/images/produk-unggulan/tumbler/tumbler-5.png",
  "tumbler-6": "/images/produk-unggulan/tumbler/tumbler-6.png",
  "tumbler-7": "/images/produk-unggulan/tumbler/tumbler-7.png",
  "tumbler-8": "/images/produk-unggulan/tumbler/tumbler-8.png",
  "tumbler-9": "/images/produk-unggulan/tumbler/tumbler-9.png",
  "tumbler-10": "/images/produk-unggulan/tumbler/tumbler-10.png",
  "tumbler-11": "/images/produk-unggulan/tumbler/tumbler-11.png",
  "tumbler-12": "/images/produk-unggulan/tumbler/tumbler-12.png",
  "tumbler-13": "/images/produk-unggulan/tumbler/tumbler-13.png",
  "tumbler-14": "/images/produk-unggulan/tumbler/tumbler-14.png",
  "tumbler-15": "/images/produk-unggulan/tumbler/tumbler-15.png",
  "tumbler-16": "/images/produk-unggulan/tumbler/tumbler-16.png",
  "tumbler-17": "/images/produk-unggulan/tumbler/tumbler-17.png",
  "tumbler-18": "/images/produk-unggulan/tumbler/tumbler-18.png",
  "tumbler-19": "/images/produk-unggulan/tumbler/tumbler-19.png",
  "tumbler-20": "/images/produk-unggulan/tumbler/tumbler-20.png",
  "tumbler-21": "/images/produk-unggulan/tumbler/tumbler-21.png",
  "tumbler-22": "/images/produk-unggulan/tumbler/tumbler-22.png",
  "tumbler-23": "/images/produk-unggulan/tumbler/tumbler-23.png",
  "tumbler-24": "/images/produk-unggulan/tumbler/tumbler-24.png",
  "pin-bross-1": "/images/produk-unggulan/pin-bross/pin-bross-1.png",
  "pin-bross-2": "/images/produk-unggulan/pin-bross/pin-bross-2.png",
  "pin-bross-3": "/images/produk-unggulan/pin-bross/pin-bross-3.png",
  "pin-bross-4": "/images/produk-unggulan/pin-bross/pin-bross-4.png",
  "pin-bross-5": "/images/produk-unggulan/pin-bross/pin-bross-5.png",
  "pin-bross-6": "/images/produk-unggulan/pin-bross/pin-bross-6.png",
  "pin-bross-7": "/images/produk-unggulan/pin-bross/pin-bross-7.png",
  "pin-bross-8": "/images/produk-unggulan/pin-bross/pin-bross-8.png",
  "pin-bross-9": "/images/produk-unggulan/pin-bross/pin-bross-9.png",
  "pin-bross-10": "/images/produk-unggulan/pin-bross/pin-bross-10.png",
  "pin-bross-11": "/images/produk-unggulan/pin-bross/pin-bross-11.png",
  "pin-bross-12": "/images/produk-unggulan/pin-bross/pin-bross-12.png",
  "pin-bross-13": "/images/produk-unggulan/pin-bross/pin-bross-13.png",
  "pin-bross-14": "/images/produk-unggulan/pin-bross/pin-bross-14.png",
  "pin-bross-15": "/images/produk-unggulan/pin-bross/pin-bross-15.png",
  "pin-bross-16": "/images/produk-unggulan/pin-bross/pin-bross-16.png",
  "pin-bross-17": "/images/produk-unggulan/pin-bross/pin-bross-17.png",
  "pin-bross-18": "/images/produk-unggulan/pin-bross/pin-bross-18.png",
  "pin-bross-19": "/images/produk-unggulan/pin-bross/pin-bross-19.png",
  "pin-bross-20": "/images/produk-unggulan/pin-bross/pin-bross-20.png",
  "pin-bross-21": "/images/produk-unggulan/pin-bross/pin-bross-21.png",
  "pin-bross-22": "/images/produk-unggulan/pin-bross/pin-bross-22.png",
  "pin-bross-23": "/images/produk-unggulan/pin-bross/pin-bross-23.png",
  "pin-bross-24": "/images/produk-unggulan/pin-bross/pin-bross-24.png",
  "pin-bross-25": "/images/produk-unggulan/pin-bross/pin-bross-25.png",
  "pin-bross-26": "/images/produk-unggulan/pin-bross/pin-bross-26.png",
  "pin-bross-27": "/images/produk-unggulan/pin-bross/pin-bross-27.png",
  "pin-bross-28": "/images/produk-unggulan/pin-bross/pin-bross-28.png",
  "pin-bross-29": "/images/produk-unggulan/pin-bross/pin-bross-29.png",
  "pin-bross-30": "/images/produk-unggulan/pin-bross/pin-bross-30.png",
  "gantungan-kunci-1": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-1.png",
  "gantungan-kunci-15": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-15.png",
  "gantungan-kunci-16": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-16.png",
  "gantungan-kunci-17": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-17.png",
  "gantungan-kunci-18": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-18.png",
  "gantungan-kunci-19": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-19.png",
  "gantungan-kunci-20": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-20.png",
  "gantungan-kunci-21": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-21.png",
  "gantungan-kunci-22": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-22.png",
  "gantungan-kunci-23": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-23.png",
  "gantungan-kunci-24": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-24.png",
  "gantungan-kunci-25": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-25.png",
  "gantungan-kunci-26": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-26.png",
  "gantungan-kunci-27": "/images/produk-unggulan/gantungan-kunci/gantungan-kunci-27.png",
  "kalung-rektor-1": "/images/produk-unggulan/kalung-rektor/kalung-rektor-1.png",
  "kalung-rektor-2": "/images/produk-unggulan/kalung-rektor/kalung-rektor-2.png",
  "kalung-rektor-3": "/images/produk-unggulan/kalung-rektor/kalung-rektor-3.png",
  "kalung-rektor-4": "/images/produk-unggulan/kalung-rektor/kalung-rektor-4.png",
  "kalung-rektor-5": "/images/produk-unggulan/kalung-rektor/kalung-rektor-5.png",
  "kalung-rektor-6": "/images/produk-unggulan/kalung-rektor/kalung-rektor-6.png",
  "kalung-rektor-7": "/images/produk-unggulan/kalung-rektor/kalung-rektor-7.png",
  "kalung-rektor-8": "/images/produk-unggulan/kalung-rektor/kalung-rektor-8.png",
  "kalung-rektor-9": "/images/produk-unggulan/kalung-rektor/kalung-rektor-9.png",
  "kalung-rektor-10": "/images/produk-unggulan/kalung-rektor/kalung-rektor-10.png",
  "kalung-rektor-11": "/images/produk-unggulan/kalung-rektor/kalung-rektor-11.png",
  "kalung-rektor-12": "/images/produk-unggulan/kalung-rektor/kalung-rektor-12.png",
  "kalung-rektor-13": "/images/produk-unggulan/kalung-rektor/kalung-rektor-13.png",
  "kalung-rektor-14": "/images/produk-unggulan/kalung-rektor/kalung-rektor-14.png",
  "kalung-rektor-15": "/images/produk-unggulan/kalung-rektor/kalung-rektor-15.png",
  "kalung-rektor-16": "/images/produk-unggulan/kalung-rektor/kalung-rektor-16.png",
  "kalung-rektor-17": "/images/produk-unggulan/kalung-rektor/kalung-rektor-17.png",
  "kalung-rektor-18": "/images/produk-unggulan/kalung-rektor/kalung-rektor-18.png",
  "kalung-rektor-19": "/images/produk-unggulan/kalung-rektor/kalung-rektor-19.png",
  "kalung-rektor-20": "/images/produk-unggulan/kalung-rektor/kalung-rektor-20.png",
  "kalung-rektor-21": "/images/produk-unggulan/kalung-rektor/kalung-rektor-21.png",
  "kalung-rektor-22": "/images/produk-unggulan/kalung-rektor/kalung-rektor-22.png",
  "kalung-rektor-23": "/images/produk-unggulan/kalung-rektor/kalung-rektor-23.png",
  "kalung-rektor-24": "/images/produk-unggulan/kalung-rektor/kalung-rektor-24.png",

  "samir-wisuda-akrilik-1": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-1.png",
  "samir-wisuda-akrilik-2": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-2.png",
  "samir-wisuda-logam-2": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-2.png",
  "samir-wisuda-akrilik-3": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-3.png",
  "samir-wisuda-logam-3": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-3.png",
  "samir-wisuda-akrilik-4": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-4.png",
  "samir-wisuda-logam-4": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-4.png",
  "samir-wisuda-logam-5": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-5.png",
  "samir-wisuda-akrilik-5": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-5.png",
  "samir-wisuda-akrilik-6": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-6.png",
  "samir-wisuda-logam-6": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-6.png",
  "samir-wisuda-logam-7": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-7.png",
  "samir-wisuda-akrilik-7": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-7.png",
  "samir-wisuda-logam-8": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-8.png",
  "samir-wisuda-akrilik-8": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-8.png",
  "samir-wisuda-logam-9": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-9.png",
  "samir-wisuda-akrilik-9": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-9.png",
  "samir-wisuda-akrilik-10": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-10.png",
  "samir-wisuda-logam-10": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-10.png",
  "samir-wisuda-akrilik-11": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-11.png",
  "samir-wisuda-logam-11": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-11.png",
  "samir-wisuda-logam-12": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-12.png",
  "samir-wisuda-akrilik-12": "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-12.png",
  "samir-wisuda-logam-13": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-13.png",
  "samir-wisuda-logam-14": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-14.png",
  "samir-wisuda-logam-15": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-15.png",
  "samir-wisuda-logam-16": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-16.png",
  "samir-wisuda-logam-17": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-17.png",
  "samir-wisuda-logam-18": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-18.png",
  "samir-wisuda-logam-19": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-19.png",
  "samir-wisuda-logam-20": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-20.png",
  "samir-wisuda-logam-21": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png",
  "samir-wisuda-logam-22": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-22.png",
  "samir-wisuda-logam-23": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-23.png",
  "samir-wisuda-logam-24": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-24.png",
  "samir-wisuda-logam-25": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-25.png",
  "samir-wisuda-logam-26": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-26.png",
  "samir-wisuda-logam-27": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-27.png",
  "samir-wisuda-logam-28": "/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-28.png",
  "patung-wisuda-11": "/images/produk-unggulan/patung-wisuda/patung-wisuda-11.png",
  "patung-wisuda-12": "/images/produk-unggulan/patung-wisuda/patung-wisuda-12.png",
  "patung-wisuda-13": "/images/produk-unggulan/patung-wisuda/patung-wisuda-13.png",
  "patung-wisuda-14": "/images/produk-unggulan/patung-wisuda/patung-wisuda-14.png",
  "patung-wisuda-15": "/images/produk-unggulan/patung-wisuda/patung-wisuda-15.png",
  "patung-wisuda-16": "/images/produk-unggulan/patung-wisuda/patung-wisuda-16.png",
  "patung-wisuda-17": "/images/produk-unggulan/patung-wisuda/patung-wisuda-17.png",
  "patung-wisuda-18": "/images/produk-unggulan/patung-wisuda/patung-wisuda-18.png",
  "patung-wisuda-19": "/images/produk-unggulan/patung-wisuda/patung-wisuda-19.png",
  "patung-wisuda-20": "/images/produk-unggulan/patung-wisuda/patung-wisuda-20.png",
  "patung-wisuda-21": "/images/produk-unggulan/patung-wisuda/patung-wisuda-21.png",
  "patung-wisuda-22": "/images/produk-unggulan/patung-wisuda/patung-wisuda-22.png",
  "patung-wisuda-23": "/images/produk-unggulan/patung-wisuda/patung-wisuda-23.png",
  "patung-wisuda-24": "/images/produk-unggulan/patung-wisuda/patung-wisuda-24.png",
  "patung-wisuda-25": "/images/produk-unggulan/patung-wisuda/patung-wisuda-25.png",
  "patung-wisuda-26": "/images/produk-unggulan/patung-wisuda/patung-wisuda-26.png",
  "patung-wisuda-kuningan": "/images/produk-unggulan/patung-wisuda/patung-wisuda-kuningan.png",
  "tongkat-rektor-1": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-1.png",
  "tongkat-rektor-2": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-2.png",
  "tongkat-rektor-4": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-4.png",
  "tongkat-rektor-5": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-5.png",
  "tongkat-rektor-6": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-6.png",
  "tongkat-rektor-7": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-7.png",
  "tongkat-rektor-8": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-8.png",
  "tongkat-rektor-9": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-9.png",
  "tongkat-rektor-10": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-10.png",
  "tongkat-rektor-11": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-11.png",
  "tongkat-rektor-12": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-12.png",
  "tongkat-rektor-13": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-13.png",
  "tongkat-rektor-14": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-14.png",
  "tongkat-rektor-15": "/images/produk-unggulan/tongkat-rektor/tongkat-rektor-15.png",
  "souvenir-pernikahan-1": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-1.png",
  "souvenir-pernikahan-2": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-2.png",
  "souvenir-pernikahan-3": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-3.png",
  "souvenir-pernikahan-4": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-4.png",
  "souvenir-pernikahan-5": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-5.png",
  "souvenir-pernikahan-6": "/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-6.png",
  "tabung-wisuda-1": "/images/produk-unggulan/map-ijazah/tabung-wisuda-1.png",
  "map-wisuda-1": "/images/produk-unggulan/map-ijazah/map-wisuda-1.png",
  "tabung-wisuda-2": "/images/produk-unggulan/map-ijazah/tabung-wisuda-2.png",
  "map-wisuda-2": "/images/produk-unggulan/map-ijazah/map-wisuda-2.png",
  "map-wisuda-3": "/images/produk-unggulan/map-ijazah/map-wisuda-3.png",
  "map-wisuda-4": "/images/produk-unggulan/map-ijazah/map-wisuda-4.png",
  "map-wisuda-5": "/images/produk-unggulan/map-ijazah/map-wisuda-5.png",
  "map-wisuda-6": "/images/produk-unggulan/map-ijazah/map-wisuda-6.png",
  "map-wisuda-7": "/images/produk-unggulan/map-ijazah/map-wisuda-7.png",
  "map-wisuda-8": "/images/produk-unggulan/map-ijazah/map-wisuda-8.png",
  "map-wisuda-9": "/images/produk-unggulan/map-ijazah/map-wisuda-9.png",
  "map-wisuda-10": "/images/produk-unggulan/map-ijazah/map-wisuda-10.png",
  "map-wisuda-11": "/images/produk-unggulan/map-ijazah/map-wisuda-11.png",
  "prasasti-stainless-steel-1": "/images/produk-unggulan/prasasti-stainless-steel/prasasti-stainless-steel-1.png",
  "prasasti-stainless-steel-2": "/images/produk-unggulan/prasasti-stainless-steel/prasasti-stainless-steel-2.png",
  "prasasti-stainless-steel-3": "/images/produk-unggulan/prasasti-stainless-steel/prasasti-stainless-steel-3.png",
  "prasasti-stainless-steel-4": "/images/produk-unggulan/prasasti-stainless-steel/prasasti-stainless-steel-4.png",
  "prasasti-stainless-steel-5": "/images/produk-unggulan/prasasti-stainless-steel/prasasti-stainless-steel-5.png",
  "prasasti-stainless-steel-6": "/images/produk-unggulan/prasasti-stainless-steel/prasasti-stainless-steel-6.png",
  "prasasti-kuningan-1": "/images/produk-unggulan/prasasti-kuningan/prasasti-kuningan-1.png",
  "prasasti-kuningan-8": "/images/produk-unggulan/prasasti-kuningan/prasasti-kuningan-8.png",
  "prasasti-kuningan-9": "/images/produk-unggulan/prasasti-kuningan/prasasti-kuningan-9.png",
  "prasasti-kuningan-10": "/images/produk-unggulan/prasasti-kuningan/prasasti-kuningan-10.png",
  "prasasti-kuningan-11": "/images/produk-unggulan/prasasti-kuningan/prasasti-kuningan-11.png",
  "prasasti-kuningan-12": "/images/produk-unggulan/prasasti-kuningan/prasasti-kuningan-12.png",
  "prasasti-kuningan-13": "/images/produk-unggulan/prasasti-kuningan/prasasti-kuningan-13.png",
  "prasasti-marmer-granite-1": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-granite-1.png",
  "prasasti-marmer-1": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-1.png",
  "prasasti-marmer-granite-2": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-granite-2.png",
  "prasasti-marmer-2": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-2.png",
  "prasasti-marmer-granite-3": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-granite-3.png",
  "prasasti-marmer-granite-4": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-granite-4.png",
  "prasasti-marmer-granite-5": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-granite-5.png",
  "prasasti-marmer-6": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-6.png",
  "prasasti-marmer-granite-6": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-granite-6.png",
  "prasasti-marmer-granite-7": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-granite-7.png",
  "prasasti-marmer-7": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-7.png",
  "prasasti-marmer-8": "/images/produk-unggulan/prasasti-marmer/prasasti-marmer-8.png",
  "trophy-kaki-dua-1": "/images/produk-unggulan/piala-trophy/trophy-kaki-dua-1.png",
  "trophy-kaki-empat-1": "/images/produk-unggulan/piala-trophy/trophy-kaki-empat-1.png",
  "trophy-kaki-satu-1": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-1.png",
  "trophy-figur-1": "/images/produk-unggulan/piala-trophy/trophy-figur-1.png",
  "trophy-kaki-empat-2": "/images/produk-unggulan/piala-trophy/trophy-kaki-empat-2.png",
  "trophy-kaki-dua-2": "/images/produk-unggulan/piala-trophy/trophy-kaki-dua-2.png",
  "trophy-figur-2": "/images/produk-unggulan/piala-trophy/trophy-figur-2.png",
  "trophy-kaki-satu-2": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-2.png",
  "trophy-kaki-empat-3": "/images/produk-unggulan/piala-trophy/trophy-kaki-empat-3.png",
  "trophy-kaki-satu-3": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-3.png",
  "trophy-kaki-dua-3": "/images/produk-unggulan/piala-trophy/trophy-kaki-dua-3.png",
  "trophy-figur-3": "/images/produk-unggulan/piala-trophy/trophy-figur-3.png",
  "trophy-kaki-dua-4": "/images/produk-unggulan/piala-trophy/trophy-kaki-dua-4.png",
  "trophy-kaki-empat-4": "/images/produk-unggulan/piala-trophy/trophy-kaki-empat-4.png",
  "trophy-kaki-satu-4": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-4.png",
  "trophy-k4-bertingkat": "/images/produk-unggulan/piala-trophy/trophy-k4-bertingkat.png",
  "trophy-figur-5": "/images/produk-unggulan/piala-trophy/trophy-figur-5.png",
  "trophy-kaki-satu-5": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-5.png",
  "trophy-kaki-empat-5": "/images/produk-unggulan/piala-trophy/trophy-kaki-empat-5.png",
  "trophy-kaki-dua-5": "/images/produk-unggulan/piala-trophy/trophy-kaki-dua-5.png",
  "trophy-kaki-dua-6": "/images/produk-unggulan/piala-trophy/trophy-kaki-dua-6.png",
  "trophy-kaki-satu-6": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-6.png",
  "trophy-figur-6": "/images/produk-unggulan/piala-trophy/trophy-figur-6.png",
  "trophy-kaki-empat-6": "/images/produk-unggulan/piala-trophy/trophy-kaki-empat-6.png",
  "trophy-kaki-satu-7": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-7.png",
  "trophy-kaki-empat-7": "/images/produk-unggulan/piala-trophy/trophy-kaki-empat-7.png",
  "trophy-kaki-dua-7": "/images/produk-unggulan/piala-trophy/trophy-kaki-dua-7.png",
  "trophy-kaki-dua-8": "/images/produk-unggulan/piala-trophy/trophy-kaki-dua-8.png",
  "trophy-kaki-satu-8": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-8.png",
  "trophy-kaki-empat-8": "/images/produk-unggulan/piala-trophy/trophy-kaki-empat-8.png",
  "trophy-kaki-satu-9": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-9.png",
  "trophy-kaki-satu-10": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-10.png",
  "trophy-kaki-satu-11": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-11.png",
  "trophy-kaki-satu-12": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-12.png",
  "trophy-kaki-satu-13": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-13.png",
  "trophy-kaki-satu-14": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-14.png",
  "trophy-kaki-satu-15": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-15.png",
  "trophy-kaki-satu-16": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-16.png",
  "trophy-kaki-satu-17": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-17.png",
  "trophy-kaki-satu-18": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-18.png",
  "trophy-kaki-satu-19": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-19.png",
  "trophy-kaki-satu-20": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-20.png",
  "trophy-kaki-satu-21": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-21.png",
  "trophy-kaki-satu-22": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-22.png",
  "trophy-kaki-satu-23": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-23.png",
  "trophy-kaki-satu-24": "/images/produk-unggulan/piala-trophy/trophy-kaki-satu-24.png",
  "piala-golf-2": "/images/produk-unggulan/piala-golf/piala-golf-2.png",
  "piala-golf-3": "/images/produk-unggulan/piala-golf/piala-golf-3.png",
  "piala-golf-4": "/images/produk-unggulan/piala-golf/piala-golf-4.png",
  "piala-golf-5": "/images/produk-unggulan/piala-golf/piala-golf-5.png",
  "piala-golf-6": "/images/produk-unggulan/piala-golf/piala-golf-6.png",
  "piala-golf-7": "/images/produk-unggulan/piala-golf/piala-golf-7.png",
  "piala-golf-8": "/images/produk-unggulan/piala-golf/piala-golf-8.png",
  "piala-golf-9": "/images/produk-unggulan/piala-golf/piala-golf-9.png",
  "piala-golf-10": "/images/produk-unggulan/piala-golf/piala-golf-10.png",
  "piala-golf-11": "/images/produk-unggulan/piala-golf/piala-golf-11.png",
  "medali-3d-8": "/images/produk-unggulan/medali-3d/medali-3d-8.png",
  "medali-3d-7": "/images/produk-unggulan/medali-3d/medali-3d-7.png",
  "medali-3d-6": "/images/produk-unggulan/medali-3d/medali-3d-6.png",
  "medali-3d-9": "/images/produk-unggulan/medali-3d/medali-3d-9.png",
  "medali-custom-57": "/images/produk-unggulan/medali-custom/medali-custom-57.png",
  "medali-custom-58": "/images/produk-unggulan/medali-custom/medali-custom-58.png",
  "medali-custom-59": "/images/produk-unggulan/medali-custom/medali-custom-59.png",
  "medali-3d-11": "/images/produk-unggulan/medali-3d/medali-3d-11.png",
  "medali-3d-10": "/images/produk-unggulan/medali-3d/medali-3d-10.png",
  "medali-3d-1": "/images/produk-unggulan/medali-3d/medali-3d-1.png",
  "medali-3d-2": "/images/produk-unggulan/medali-3d/medali-3d-2.png",
  "medali-3d-5": "/images/produk-unggulan/medali-3d/medali-3d-5.png",
  "medali-3d-4": "/images/produk-unggulan/medali-3d/medali-3d-4.png",
  "medali-3d-3": "/images/produk-unggulan/medali-3d/medali-3d-3.png",
  "medali-etching-1": "/images/produk-unggulan/medali-custom/medali-etching-1.png",
  "medali-emas-perak-perunggu-1": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-1.png",
  "medali-etching-2": "/images/produk-unggulan/medali-custom/medali-etching-2.png",
  "medali-emas-perak-perunggu-2": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-2.png",
  "medali-emas-perak-perunggu-3": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-3.png",
  "medali-etching-3": "/images/produk-unggulan/medali-custom/medali-etching-3.png",
  "medali-custom-4": "/images/produk-unggulan/medali-custom/medali-custom-4.png",
  "medali-etching-4": "/images/produk-unggulan/medali-custom/medali-etching-4.png",
  "medali-emas-perak-perunggu-4": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-4.png",
  "medali-emas-perak-perunggu-5": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-5.png",
  "medali-custom-5": "/images/produk-unggulan/medali-custom/medali-custom-5.png",
  "medali-etching-5": "/images/produk-unggulan/medali-custom/medali-etching-5.png",
  "medali-etching-6": "/images/produk-unggulan/medali-custom/medali-etching-6.png",
  "medali-custom-6": "/images/produk-unggulan/medali-custom/medali-custom-6.png",
  "medali-emas-perak-perunggu-6": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-6.png",
  "medali-custom-7": "/images/produk-unggulan/medali-custom/medali-custom-7.png",
  "medali-etching-7": "/images/produk-unggulan/medali-custom/medali-etching-7.png",
  "medali-emas-perak-perunggu-7": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-7.png",
  "medali-etching-8": "/images/produk-unggulan/medali-custom/medali-etching-8.png",
  "medali-custom-8": "/images/produk-unggulan/medali-custom/medali-custom-8.png",
  "medali-emas-perak-perunggu-8": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-8.png",
  "medali-custom-9": "/images/produk-unggulan/medali-custom/medali-custom-9.png",
  "medali-emas-perak-perunggu-9": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-9.png",
  "medali-etching-9": "/images/produk-unggulan/medali-custom/medali-etching-9.png",
  "medali-etching-10": "/images/produk-unggulan/medali-custom/medali-etching-10.png",
  "medali-custom-10": "/images/produk-unggulan/medali-custom/medali-custom-10.png",
  "medali-emas-perak-perunggu-10": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-10.png",
  "medali-custom-11": "/images/produk-unggulan/medali-custom/medali-custom-11.png",
  "medali-etching-11": "/images/produk-unggulan/medali-custom/medali-etching-11.png",
  "medali-emas-perak-perunggu-11": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-11.png",
  "medali-etching-12": "/images/produk-unggulan/medali-custom/medali-etching-12.png",
  "medali-custom-12": "/images/produk-unggulan/medali-custom/medali-custom-12.png",
  "medali-emas-perak-perunggu-12": "/images/produk-unggulan/medali-custom/medali-emas-perak-perunggu-12.png",
  "medali-custom-13": "/images/produk-unggulan/medali-custom/medali-custom-13.png",
  "medali-etching-13": "/images/produk-unggulan/medali-custom/medali-etching-13.png",
  "medali-custom-14": "/images/produk-unggulan/medali-custom/medali-custom-14.png",
  "medali-etching-14": "/images/produk-unggulan/medali-custom/medali-etching-14.png",
  "medali-custom-15": "/images/produk-unggulan/medali-custom/medali-custom-15.png",
  "medali-etching-15": "/images/produk-unggulan/medali-custom/medali-etching-15.png",
  "medali-custom-16": "/images/produk-unggulan/medali-custom/medali-custom-16.png",
  "medali-etching-16": "/images/produk-unggulan/medali-custom/medali-etching-16.png",
  "medali-custom-17": "/images/produk-unggulan/medali-custom/medali-custom-17.png",
  "medali-etching-17": "/images/produk-unggulan/medali-custom/medali-etching-17.png",
  "medali-etching-18": "/images/produk-unggulan/medali-custom/medali-etching-18.png",
  "medali-custom-18": "/images/produk-unggulan/medali-custom/medali-custom-18.png",
  "medali-etching-19": "/images/produk-unggulan/medali-custom/medali-etching-19.png",
  "medali-custom-19": "/images/produk-unggulan/medali-custom/medali-custom-19.png",
  "medali-custom-20": "/images/produk-unggulan/medali-custom/medali-custom-20.png",
  "medali-custom-21": "/images/produk-unggulan/medali-custom/medali-custom-21.png",
  "medali-custom-22": "/images/produk-unggulan/medali-custom/medali-custom-22.png",
  "medali-custom-23": "/images/produk-unggulan/medali-custom/medali-custom-23.png",
  "medali-custom-24": "/images/produk-unggulan/medali-custom/medali-custom-24.png",
  "medali-custom-25": "/images/produk-unggulan/medali-custom/medali-custom-25.png",
  "medali-custom-26": "/images/produk-unggulan/medali-custom/medali-custom-26.png",
  "medali-custom-27": "/images/produk-unggulan/medali-custom/medali-custom-27.png",
  "medali-custom-28": "/images/produk-unggulan/medali-custom/medali-custom-28.png",
  "box-kertas-batik": "/images/produk-unggulan/box-kertas-marga/box-kertas-batik.png",
  "box-bludru-1": "/images/produk-unggulan/box-bludru/box-bludru-1.png",
  "box-bludru-2": "/images/produk-unggulan/box-bludru/box-bludru-2.png",
  "box-bludru-3": "/images/produk-unggulan/box-bludru/box-bludru-3.png",
  "box-bludru-4": "/images/produk-unggulan/box-bludru/box-bludru-4.png",
  "box-bludru-5": "/images/produk-unggulan/box-bludru/box-bludru-5.png",
  "box-bludru-6": "/images/produk-unggulan/box-bludru/box-bludru-6.png",
  "box-bludru-7": "/images/produk-unggulan/box-bludru/box-bludru-7.png",
  "box-bludru-8": "/images/produk-unggulan/box-bludru/box-bludru-8.png",
  "box-batik-1": "/images/produk-unggulan/box-batik/box-batik-1.png",
  "box-batik-2": "/images/produk-unggulan/box-batik/box-batik-2.png",
  "box-batik-3": "/images/produk-unggulan/box-batik/box-batik-3.png",
  "box-batik-4": "/images/produk-unggulan/box-batik/box-batik-4.png",
  "box-kertas-import-1": "/images/produk-unggulan/box-kertas-import/box-kertas-import-1.png",
  "box-kertas-import-2": "/images/produk-unggulan/box-kertas-import/box-kertas-import-2.png",
  "box-kertas-import-3": "/images/produk-unggulan/box-kertas-import/box-kertas-import-3.png",
  "box-kertas-import-4": "/images/produk-unggulan/box-kertas-import/box-kertas-import-4.png",
  "box-kertas-import-5": "/images/produk-unggulan/box-kertas-import/box-kertas-import-5.png",
  "plakat-akrilik-1": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-1.png",
  "plakat-akrilik-2": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-2.png",
  "plakat-akrilik-3": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-3.png",
  "plakat-akrilik-4": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-4.png",
  "plakat-akrilik-5": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-5.png",
  "plakat-akrilik-6": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-6.png",
  "plakat-akrilik-7": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-7.png",
  "plakat-akrilik-8": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-8.png",
  "plakat-akrilik-9": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-9.png",
  "plakat-akrilik-10": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-10.png",
  "plakat-akrilik-11": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-11.png",
  "plakat-akrilik-12": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-12.png",
  "plakat-akrilik-13": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-13.png",
  "plakat-akrilik-14": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-14.png",
  "plakat-akrilik-15": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-15.png",
  "plakat-akrilik-16": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-16.png",
  "plakat-akrilik-18": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-18.png",
  "plakat-akrilik-19": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-19.png",
  "plakat-akrilik-20": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-20.png",
  "plakat-akrilik-21": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-21.png",
  "plakat-akrilik-22": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-22.png",
  "plakat-akrilik-23": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-23.png",
  "plakat-akrilik-25": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-25.png",
  "plakat-akrilik-26": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-26.png",
  "plakat-akrilik-27": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-27.png",
  "plakat-akrilik-28": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-28.png",
  "plakat-akrilik-29": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-29.png",
  "plakat-akrilik-30": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-30.png",
  "plakat-akrilik-31": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-31.png",
  "plakat-akrilik-32": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-32.png",
  "plakat-akrilik-33": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-33.png",
  "plakat-akrilik-35": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-35.png",
  "plakat-akrilik-36": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-36.png",
  "plakat-akrilik-37": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-37.png",
  "plakat-akrilik-39": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-39.png",
  "plakat-akrilik-40": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-40.png",
  "plakat-akrilik-41": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-41.png",
  "plakat-akrilik-42": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-42.png",
  "plakat-akrilik-43": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-43.png",
  "plakat-akrilik-44": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-44.png",
  "plakat-akrilik-45": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-45.png",
  "plakat-akrilik-46": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-46.png",
  "plakat-akrilik-47": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-47.png",
  "plakat-akrilik-48": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-48.png",
  "plakat-akrilik-49": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-49.png",
  "plakat-akrilik-50": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-50.png",
  "plakat-akrilik-51": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-51.png",
  "plakat-akrilik-52": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-52.png",
  "plakat-akrilik-53": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-53.png",
  "plakat-akrilik-54": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-54.png",
  "plakat-akrilik-55": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-55.png",
  "plakat-akrilik-56": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-56.png",
  "plakat-akrilik-57": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-57.png",
  "plakat-akrilik-58": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-58.png",
  "plakat-akrilik-59": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-59.png",
  "plakat-akrilik-60": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-60.png",
  "plakat-akrilik-61": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-61.png",
  "plakat-akrilik-62": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-62.png",
  "plakat-akrilik-63": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-63.png",
  "plakat-akrilik-64": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-64.png",
  "plakat-akrilik-65": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-65.png",
  "plakat-akrilik-66": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-66.png",
  "plakat-akrilik-67": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-67.png",
  "plakat-akrilik-68": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-68.png",
  "plakat-akrilik-69": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-69.png",
  "plakat-akrilik-70": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-70.png",
  "plakat-akrilik-71": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-71.png",
  "plakat-akrilik-72": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-72.png",
  "plakat-akrilik-73": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-73.png",
  "plakat-akrilik-74": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-74.png",
  "plakat-akrilik-75": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-75.png",
  "plakat-akrilik-76": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-76.png",
  "plakat-akrilik-77": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-77.png",
  "plakat-akrilik-78": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-78.png",
  "plakat-akrilik-79": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-79.png",
  "plakat-akrilik-80": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-80.png",
  "plakat-akrilik-81": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-81.png",
  "plakat-akrilik-82": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-82.png",
  "plakat-akrilik-83": "/images/produk-unggulan/plakat-akrilik/plakat-akrilik-83.png",
  "plakat-kayu-eksklusif-1": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-1.png",
  "plakat-kayu-eksklusif-2": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-2.png",
  "plakat-kayu-eksklusif-3": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-3.png",
  "plakat-kayu-eksklusif-4": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-4.png",
  "plakat-kayu-eksklusif-5": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-5.png",
  "plakat-kayu-eksklusif-6": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-6.png",
  "plakat-kayu-eksklusif-7": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-7.png",
  "plakat-kayu-eksklusif-8": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-8.png",
  "plakat-kayu-eksklusif-9": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-9.png",
  "plakat-kayu-eksklusif-10": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-10.png",
  "plakat-kayu-eksklusif-11": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-11.png",
  "plakat-kayu-eksklusif-12": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-12.png",
  "plakat-kayu-eksklusif-13": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-13.png",
  "plakat-kayu-eksklusif-14": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-14.png",
  "plakat-kayu-eksklusif-16": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-16.png",
  "plakat-kayu-eksklusif-17": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-17.png",
  "plakat-kayu-eksklusif-18": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-18.png",
  "plakat-kayu-eksklusif-19": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-19.png",
  "plakat-kayu-eksklusif-20": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-20.png",
  "plakat-kayu-eksklusif-21": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-21.png",
  "plakat-kayu-eksklusif-22": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-22.png",
  "plakat-kayu-eksklusif-23": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-23.png",
  "plakat-kayu-eksklusif-24": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-24.png",
  "plakat-kayu-eksklusif-25": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-25.png",
  "plakat-kayu-eksklusif-26": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-26.png",
  "plakat-kayu-eksklusif-27": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-27.png",
  "plakat-kayu-eksklusif-28": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-28.png",
  "plakat-kayu-eksklusif-29": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-29.png",
  "plakat-kayu-eksklusif-30": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-30.png",
  "plakat-kayu-eksklusif-31": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-31.png",
  "plakat-kayu-eksklusif-32": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-32.png",
  "plakat-kayu-eksklusif-33": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-33.png",
  "plakat-kayu-eksklusif-34": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-34.png",
  "plakat-kayu-eksklusif-35": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-35.png",
  "plakat-kayu-eksklusif-36": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-36.png",
  "plakat-kayu-eksklusif-37": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-37.png",
  "plakat-kayu-eksklusif-38": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-38.png",
  "plakat-kayu-eksklusif-39": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-39.png",
  "plakat-kayu-eksklusif-40": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-40.png",
  "plakat-kayu-eksklusif-41": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-41.png",
  "plakat-kayu-eksklusif-42": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-42.png",
  "plakat-kayu-eksklusif-43": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-43.png",
  "plakat-kayu-eksklusif-44": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-44.png",
  "plakat-kayu-eksklusif-45": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-45.png",
  "plakat-kayu-eksklusif-46": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-46.png",
  "plakat-kayu-eksklusif-47": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-47.png",
  "plakat-kayu-eksklusif-48": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-48.png",
  "plakat-kayu-eksklusif-49": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-49.png",
  "plakat-kayu-eksklusif-50": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-50.png",
  "plakat-kayu-eksklusif-51": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-51.png",
  "plakat-kayu-eksklusif-52": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-52.png",
  "plakat-kayu-eksklusif-53": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-53.png",
  "plakat-kayu-eksklusif-54": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-54.png",
  "plakat-kayu-eksklusif-55": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-55.png",
  "plakat-kayu-eksklusif-56": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-56.png",
  "plakat-kayu-eksklusif-58": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-58.png",
  "plakat-kayu-eksklusif-59": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-59.png",
  "plakat-kayu-eksklusif-60": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-60.png",
  "plakat-kayu-eksklusif-61": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-61.png",
  "plakat-kayu-eksklusif-62": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-62.png",
  "plakat-kayu-eksklusif-63": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-63.png",
  "plakat-kayu-eksklusif-64": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-64.png",
  "plakat-kayu-eksklusif-65": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-65.png",
  "plakat-kayu-eksklusif-66": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-66.png",
  "plakat-kayu-eksklusif-67": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-67.png",
  "plakat-kayu-eksklusif-68": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-68.png",
  "plakat-kayu-eksklusif-69": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-69.png",
  "plakat-kayu-eksklusif-70": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-70.png",
  "plakat-kayu-eksklusif-71": "/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-71.png",
  "plakat-marmer-2": "/images/produk-unggulan/plakat-marmer/plakat-marmer-2.png",
  "plakat-marmer-3": "/images/produk-unggulan/plakat-marmer/plakat-marmer-3.png",
  "plakat-marmer-4": "/images/produk-unggulan/plakat-marmer/plakat-marmer-4.png",
  "plakat-marmer-5": "/images/produk-unggulan/plakat-marmer/plakat-marmer-5.png",
  "plakat-marmer-6": "/images/produk-unggulan/plakat-marmer/plakat-marmer-6.png",
  "plakat-marmer-7": "/images/produk-unggulan/plakat-marmer/plakat-marmer-7.png",
  "plakat-marmer-9": "/images/produk-unggulan/plakat-marmer/plakat-marmer-9.png",
  "plakat-marmer-10": "/images/produk-unggulan/plakat-marmer/plakat-marmer-10.png",
  "plakat-marmer-11": "/images/produk-unggulan/plakat-marmer/plakat-marmer-11.png",
  "plakat-marmer-12": "/images/produk-unggulan/plakat-marmer/plakat-marmer-12.png",
  "plakat-marmer-13": "/images/produk-unggulan/plakat-marmer/plakat-marmer-13.png",
  "plakat-marmer-14": "/images/produk-unggulan/plakat-marmer/plakat-marmer-14.png",
  "plakat-marmer-15": "/images/produk-unggulan/plakat-marmer/plakat-marmer-15.png",
  "plakat-marmer-16": "/images/produk-unggulan/plakat-marmer/plakat-marmer-16.png",
  "plakat-marmer-17": "/images/produk-unggulan/plakat-marmer/plakat-marmer-17.png",
  "plakat-marmer-18": "/images/produk-unggulan/plakat-marmer/plakat-marmer-18.png",
  "plakat-marmer-19": "/images/produk-unggulan/plakat-marmer/plakat-marmer-19.png",
  "plakat-marmer-20": "/images/produk-unggulan/plakat-marmer/plakat-marmer-20.png",
  "plakat-marmer-21": "/images/produk-unggulan/plakat-marmer/plakat-marmer-21.png",
  "plakat-marmer-22": "/images/produk-unggulan/plakat-marmer/plakat-marmer-22.png",
  "plakat-marmer-23": "/images/produk-unggulan/plakat-marmer/plakat-marmer-23.png",
  "plakat-marmer-24": "/images/produk-unggulan/plakat-marmer/plakat-marmer-24.png",
  "plakat-marmer-25": "/images/produk-unggulan/plakat-marmer/plakat-marmer-25.png",
  "plakat-marmer-26": "/images/produk-unggulan/plakat-marmer/plakat-marmer-26.png",
  "plakat-marmer-27": "/images/produk-unggulan/plakat-marmer/plakat-marmer-27.png",
  "plakat-marmer-28": "/images/produk-unggulan/plakat-marmer/plakat-marmer-28.png",
  "plakat-marmer-29": "/images/produk-unggulan/plakat-marmer/plakat-marmer-29.png",
  "plakat-marmer-30": "/images/produk-unggulan/plakat-marmer/plakat-marmer-30.png",
  "plakat-marmer-31": "/images/produk-unggulan/plakat-marmer/plakat-marmer-31.png",
  "plakat-marmer-32": "/images/produk-unggulan/plakat-marmer/plakat-marmer-32.png",
  "plakat-marmer-33": "/images/produk-unggulan/plakat-marmer/plakat-marmer-33.png",
  "plakat-marmer-34": "/images/produk-unggulan/plakat-marmer/plakat-marmer-34.png",
  "plakat-marmer-35": "/images/produk-unggulan/plakat-marmer/plakat-marmer-35.png",
  "plakat-marmer-36": "/images/produk-unggulan/plakat-marmer/plakat-marmer-36.png",
  "plakat-marmer-37": "/images/produk-unggulan/plakat-marmer/plakat-marmer-37.png",
  "plakat-marmer-38": "/images/produk-unggulan/plakat-marmer/plakat-marmer-38.png",
  "plakat-marmer-39": "/images/produk-unggulan/plakat-marmer/plakat-marmer-39.png",
  "plakat-marmer-40": "/images/produk-unggulan/plakat-marmer/plakat-marmer-40.png",
  "plakat-marmer-41": "/images/produk-unggulan/plakat-marmer/plakat-marmer-41.png",
  "plakat-marmer-42": "/images/produk-unggulan/plakat-marmer/plakat-marmer-42.png",
  "plakat-marmer-43": "/images/produk-unggulan/plakat-marmer/plakat-marmer-43.png",
  "plakat-marmer-44": "/images/produk-unggulan/plakat-marmer/plakat-marmer-44.png",
  "plakat-marmer-45": "/images/produk-unggulan/plakat-marmer/plakat-marmer-45.png",
  "plakat-marmer-46": "/images/produk-unggulan/plakat-marmer/plakat-marmer-46.png",
  "plakat-marmer-47": "/images/produk-unggulan/plakat-marmer/plakat-marmer-47.png",
  "plakat-marmer-48": "/images/produk-unggulan/plakat-marmer/plakat-marmer-48.png",
  "plakat-marmer-49": "/images/produk-unggulan/plakat-marmer/plakat-marmer-49.png",
  "plakat-wayang-1": "/images/produk-unggulan/plakat-wayang/plakat-wayang-1.png",
  "plakat-wayang-2": "/images/produk-unggulan/plakat-wayang/plakat-wayang-2.png",
  "plakat-wayang-3": "/images/produk-unggulan/plakat-wayang/plakat-wayang-3.png",
  "plakat-wayang-4": "/images/produk-unggulan/plakat-wayang/plakat-wayang-4.png",
  "plakat-wayang-5": "/images/produk-unggulan/plakat-wayang/plakat-wayang-5.png",
  "plakat-wayang-6": "/images/produk-unggulan/plakat-wayang/plakat-wayang-6.png",
  "plakat-wayang-7": "/images/produk-unggulan/plakat-wayang/plakat-wayang-7.png",
  "plakat-wayang-8": "/images/produk-unggulan/plakat-wayang/plakat-wayang-8.png",
  "plakat-wayang-9": "/images/produk-unggulan/plakat-wayang/plakat-wayang-9.png",
  "plakat-wayang-10": "/images/produk-unggulan/plakat-wayang/plakat-wayang-10.png",
  "plakat-wayang-11": "/images/produk-unggulan/plakat-wayang/plakat-wayang-11.png",
  "plakat-wayang-12": "/images/produk-unggulan/plakat-wayang/plakat-wayang-12.png",
  "plakat-wayang-13": "/images/produk-unggulan/plakat-wayang/plakat-wayang-13.png",
  "plakat-wayang-14": "/images/produk-unggulan/plakat-wayang/plakat-wayang-14.png",
  "plakat-wayang-15": "/images/produk-unggulan/plakat-wayang/plakat-wayang-15.png",
  "plakat-wayang-16": "/images/produk-unggulan/plakat-wayang/plakat-wayang-16.png",
  "plakat-wayang-17": "/images/produk-unggulan/plakat-wayang/plakat-wayang-17.png",
  "plakat-wayang-18": "/images/produk-unggulan/plakat-wayang/plakat-wayang-18.png",
  "plakat-wayang-19": "/images/produk-unggulan/plakat-wayang/plakat-wayang-19.png",
  "plakat-wayang-20": "/images/produk-unggulan/plakat-wayang/plakat-wayang-20.png",
  "plakat-wayang-21": "/images/produk-unggulan/plakat-wayang/plakat-wayang-21.png",
  "plakat-wayang-22": "/images/produk-unggulan/plakat-wayang/plakat-wayang-22.png",
  "plakat-wayang-23": "/images/produk-unggulan/plakat-wayang/plakat-wayang-23.png",
  "plakat-wayang-24": "/images/produk-unggulan/plakat-wayang/plakat-wayang-24.png",
  "plakat-wayang-25": "/images/produk-unggulan/plakat-wayang/plakat-wayang-25.png",
  "plakat-wayang-26": "/images/produk-unggulan/plakat-wayang/plakat-wayang-26.png",
  "plakat-wayang-27": "/images/produk-unggulan/plakat-wayang/plakat-wayang-27.png",
  "plakat-wayang-28": "/images/produk-unggulan/plakat-wayang/plakat-wayang-28.png",
  "plakat-wayang-29": "/images/produk-unggulan/plakat-wayang/plakat-wayang-29.png",
  "plakat-wayang-30": "/images/produk-unggulan/plakat-wayang/plakat-wayang-30.png",
  "plakat-wayang-31": "/images/produk-unggulan/plakat-wayang/plakat-wayang-31.png",
  "plakat-wayang-33": "/images/produk-unggulan/plakat-wayang/plakat-wayang-33.png",
  "plakat-wayang-35": "/images/produk-unggulan/plakat-wayang/plakat-wayang-35.png",
  "plakat-wayang-36": "/images/produk-unggulan/plakat-wayang/plakat-wayang-36.png",
  "plakat-wayang-38": "/images/produk-unggulan/plakat-wayang/plakat-wayang-38.png",
  "plakat-wayang-39": "/images/produk-unggulan/plakat-wayang/plakat-wayang-39.png",
  "plakat-wayang-40": "/images/produk-unggulan/plakat-wayang/plakat-wayang-40.png",
  "plakat-wayang-41": "/images/produk-unggulan/plakat-wayang/plakat-wayang-41.png",
  "plakat-wayang-42": "/images/produk-unggulan/plakat-wayang/plakat-wayang-42.png",
  "plakat-wayang-43": "/images/produk-unggulan/plakat-wayang/plakat-wayang-43.png",
  "plakat-wayang-44": "/images/produk-unggulan/plakat-wayang/plakat-wayang-44.png",
  "plakat-wayang-45": "/images/produk-unggulan/plakat-wayang/plakat-wayang-45.png",
  "plakat-wayang-46": "/images/produk-unggulan/plakat-wayang/plakat-wayang-46.png",
  "plakat-wayang-47": "/images/produk-unggulan/plakat-wayang/plakat-wayang-47.png",
  "plakat-wayang-48": "/images/produk-unggulan/plakat-wayang/plakat-wayang-48.png",
  "plakat-fiberglass-1": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-1.png",
  "plakat-fiberglass-2": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-2.png",
  "plakat-fiberglass-4": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-4.png",
  "plakat-fiberglass-5": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-5.png",
  "plakat-fiberglass-6": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-6.png",
  "plakat-fiberglass-7": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-7.png",
  "plakat-fiberglass-8": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-8.png",
  "plakat-fiberglass-9": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-9.png",
  "plakat-fiberglass-10": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-10.png",
  "plakat-fiberglass-11": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-11.png",
  "plakat-fiberglass-12": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-12.png",
  "plakat-fiberglass-13": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-13.png",
  "plakat-fiberglass-14": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-14.png",
  "plakat-fiberglass-15": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-15.png",
  "plakat-fiberglass-16": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-16.png",
  "plakat-fiberglass-17": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-17.png",
  "plakat-fiberglass-18": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-18.png",
  "plakat-fiberglass-19": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-19.png",
  "plakat-fiberglass-20": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-20.png",
  "plakat-fiberglass-21": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-21.png",
  "plakat-fiberglass-22": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-22.png",
  "plakat-fiberglass-23": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-23.png",
  "plakat-fiberglass-24": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-24.png",
  "plakat-fiberglass-25": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-25.png",
  "plakat-fiberglass-26": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-26.png",
  "plakat-fiberglass-27": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-27.png",
  "plakat-fiberglass-28": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-28.png",
  "plakat-fiberglass-29": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-29.png",
  "plakat-fiberglass-30": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-30.png",
  "plakat-fiberglass-31": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-31.png",
  "plakat-fiberglass-32": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-32.png",
  "plakat-fiberglass-33": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-33.png",
  "plakat-fiberglass-34": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-34.png",
  "plakat-fiberglass-35": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-35.png",
  "plakat-fiberglass-36": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-36.png",
  "plakat-fiberglass-37": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-37.png",
  "plakat-fiberglass-38": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-38.png",
  "plakat-fiberglass-39": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-39.png",
  "plakat-fiberglass-40": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-40.png",
  "plakat-fiberglass-41": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-41.png",
  "plakat-fiberglass-42": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-42.png",
  "plakat-fiberglass-43": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-43.png",
  "plakat-fiberglass-44": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-44.png",
  "plakat-fiberglass-45": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-45.png",
  "plakat-fiberglass-46": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-46.png",
  "plakat-fiberglass-47": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-47.png",
  "plakat-fiberglass-48": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-48.png",
  "plakat-fiberglass-49": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-49.png",
  "plakat-fiberglass-50": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-50.png",
  "plakat-fiberglass-51": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-51.png",
  "plakat-fiberglass-52": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-52.png",
  "plakat-fiberglass-53": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-53.png",
  "plakat-fiberglass-54": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-54.png",
  "plakat-fiberglass-55": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-55.png",
  "plakat-fiberglass-56": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-56.png",
  "plakat-fiberglass-57": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-57.png",
  "plakat-fiberglass-58": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-58.png",
  "plakat-fiberglass-59": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-59.png",
  "plakat-fiberglass-60": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-60.png",
  "plakat-fiberglass-61": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-61.png",
  "plakat-fiberglass-62": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-62.png",
  "plakat-fiberglass-63": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-63.png",
  "plakat-fiberglass-64": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-64.png",
  "plakat-fiberglass-65": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-65.png",
  "plakat-fiberglass-66": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-66.png",
  "plakat-fiberglass-67": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-67.png",
  "plakat-fiberglass-68": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-68.png",
  "plakat-fiberglass-69": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-69.png",
  "plakat-fiberglass-70": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-70.png",
  "plakat-fiberglass-71": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-71.png",
  "plakat-fiberglass-72": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-72.png",
  "plakat-fiberglass-73": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-73.png",
  "plakat-fiberglass-74": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-74.png",
  "plakat-fiberglass-75": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-75.png",
  "plakat-fiberglass-76": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-76.png",
  "plakat-fiberglass-77": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-77.png",
  "plakat-fiberglass-78": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-78.png",
  "plakat-fiberglass-79": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-79.png",
  "plakat-fiberglass-80": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-80.png",
  "plakat-fiberglass-81": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-81.png",
  "plakat-fiberglass-82": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-82.png",
  "plakat-fiberglass-83": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-83.png",
  "plakat-fiberglass-84": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-84.png",
  "plakat-fiberglass-85": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-85.png",
  "plakat-fiberglass-86": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-86.png",
  "plakat-fiberglass-87": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-87.png",
  "plakat-fiberglass-88": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-88.png",
  "plakat-fiberglass-89": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-89.png",
  "plakat-fiberglass-90": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-90.png",
  "plakat-fiberglass-91": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-91.png",
  "plakat-fiberglass-92": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-92.png",
  "plakat-fiberglass-93": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-93.png",
  "plakat-fiberglass-94": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-94.png",
  "plakat-fiberglass-95": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-95.png",
  "plakat-fiberglass-96": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-96.png",
  "plakat-fiberglass-97": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-97.png",
  "plakat-fiberglass-98": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-98.png",
  "plakat-fiberglass-99": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-99.png",
  "plakat-fiberglass-100": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-100.png",
  "plakat-fiberglass-101": "/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-101.png",
  "plakat-undip": "/images/produk-unggulan/plakat-fiberglass/plakat-undip.png",
  "plakat-brastable-1": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (1).png",
  "plakat-brastable-2": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (2).png",
  "plakat-brastable-3": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (3).png",
  "plakat-brastable-4": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (4).png",
  "plakat-brastable-5": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (5).png",
  "plakat-brastable-6": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (6).png",
  "plakat-brastable-7": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (7).png",
  "plakat-brastable-8": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (8).png",
  "plakat-brastable-9": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (9).png",
  "plakat-brastable-10": "/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (10).png",
  "center-point-1": "/images/produk-unggulan/plakat-batas-wilayah/center-point/center-point (1).png",
  "center-point-2": "/images/produk-unggulan/plakat-batas-wilayah/center-point/center-point (2).png",
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
{ icon: Calendar, label: "Sejak 2001" },
            { icon: Shield, label: "Berbadan Hukum" },
            { icon: Users, label: "Pengerajin Langsung" },
            { icon: Truck, label: "Pengiriman Indonesia" },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm hover:bg-primary hover:border-primary transition-all duration-300 cursor-default"
            >
              <item.icon className="w-5 h-5 text-primary group-hover:text-accent-accessible" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-white">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="heading-display text-3xl md:text-4xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible">Kategori Produk</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Temukan berbagai kategori souvenir custom yang kami produksi dengan kualitas terbaik
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const gradients = [
              "from-amber-400 to-yellow-500",
              "from-slate-300 to-gray-400",
              "from-red-500 to-amber-500",
              "from-blue-500 to-purple-500",
              "from-pink-500 to-rose-500",
              "from-green-500 to-emerald-500",
              "from-stone-400 to-slate-500",
              "from-cyan-400 to-blue-500",
            ]
            const iconColors = [
              "text-amber-600",
              "text-slate-500",
              "text-red-600",
              "text-purple-600",
              "text-pink-600",
              "text-green-600",
              "text-stone-600",
              "text-cyan-600",
            ]
            const iconBgColors = [
              "bg-amber-50",
              "bg-slate-50",
              "bg-red-50",
              "bg-purple-50",
              "bg-pink-50",
              "bg-green-50",
              "bg-stone-50",
              "bg-cyan-50",
            ]
            const Icon = iconMap[cat.icon] || Award
            return (
              <div key={cat.id} className="relative group hover:animate-wiggle">
                <div className={`absolute -inset-1 bg-gradient-to-r ${gradients[i % gradients.length]} rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-700 group-hover:duration-200`} />
                <Link
                  href={`/katalog-produk/${cat.slug}`}
                  className={`relative block bg-white rounded-2xl border border-gray-100 p-6 text-center transition-all shadow-sm group-hover:shadow-xl animate-fade-in-up opacity-0 stagger-${Math.min(i + 1, 6)}`}
                >
                  <div className={`w-14 h-14 mx-auto rounded-2xl ${iconBgColors[i % iconBgColors.length]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${iconColors[i % iconColors.length]}`} />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{cat.description}</p>
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="heading-display text-3xl md:text-4xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible">Produk Unggulan Karyamedia</h2>
              <p className="text-gray-500">Produk terbaik yang paling banyak dipesan klien kami</p>
            </div>
          </div>
          {featuredByCategory.map((group, gi) => (
            <div key={group.category.id} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-bold text-gray-900">{group.category.name}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
                <Link
                  href={`/katalog-produk/${group.category.slug}`}
                  className="text-xs font-medium text-primary-light hover:underline shrink-0"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.products.map((product, i) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${(gi * 4 + i) * 0.1}s`, animationFillMode: "forwards" }}
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {featuredImageMap[product.slug] && (
                        <Image
                          src={featuredImageMap[product.slug]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {product.bestSeller && (
                        <span className="absolute top-3 left-3 bg-accent-accessible text-white text-xs font-medium px-2.5 py-1 rounded-full z-10">
                          Best Seller
                        </span>
                      )}
                      {product.custom && (
                        <span className="absolute top-3 right-3 bg-primary-light text-white text-xs font-medium px-2.5 py-1 rounded-full z-10">
                          Custom
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
                        <p className="text-white font-bold text-sm line-clamp-2">{product.name}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400 mb-1">{product.code}</p>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.shortDescription}</p>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/katalog-produk/${product.categoryId}/${product.subcategoryId}/${product.slug}`}
                          className="flex-1 text-center py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Detail
                        </Link>
                        <a
                          href={getWhatsAppLink(generateWhatsAppMessage(product.code, product.name))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2 rounded-lg bg-[#25D366] text-white text-xs font-medium hover:bg-[#20bd5a] transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="heading-display text-3xl md:text-4xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible">Mengapa Memilih Karyamedia Souvenir?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
Didukung lebih dari 25 pengrajin profesional yang ahli di bidangnya masing-masing. Berpengalaman sejak 2001.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyInfo.advantages.map((adv, i) => {
            const ColoredIcon = advantageIconMap[adv.icon]
            return (
              <HolographicCard
                key={i}
                variant="gold"
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                  {ColoredIcon ? <ColoredIcon size={24} /> : <CheckCircle className="w-6 h-6 text-primary" />}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{adv.title}</h3>
                <p className="text-sm text-gray-500">{adv.description}</p>
              </HolographicCard>
            )
          })}
        </div>
      </section>

      <section className="relative bg-[#030303] py-20 overflow-hidden">
        <GeometricBackgroundLazy />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-display text-3xl md:text-4xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#ffffff]">Cara Pesan</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Proses pemesanan yang mudah dan transparan
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {companyInfo.orderSteps.map((step, i) => {
              const Icon = iconMap[step.icon] || CheckCircle
              return (
                <div key={i} className="relative text-center group">
                  <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                    <span className="text-accent-accessible font-bold text-lg group-hover:scale-110 transition-transform duration-300">{step.step}</span>
                  </div>
                  <Icon className="w-6 h-6 text-accent-accessible mx-auto mb-3 group-hover:-translate-y-1 group-hover:text-yellow-300 transition-all duration-300" />
                  <h3 className="font-semibold text-white text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-white/60">{step.description}</p>
                  {i < companyInfo.orderSteps.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute top-7 -right-3 w-5 h-5 text-white/30" />
                  )}
                </div>
              )
            })}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/cara-pesan"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-medium hover:bg-accent hover:text-white transition-colors"
            >
              Lihat Detail Cara Pesan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="testimoni" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="heading-display text-3xl md:text-4xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible">Apa Kata Klien Kami</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Testimoni dari instansi dan klien yang telah mempercayakan kebutuhan souvenir mereka kepada kami
          </p>
        </div>
          <div className="max-w-6xl mx-auto">
            <TestimonialCarousel testimonials={testimonials} />
            <LocalBusinessReviewsSchema />
          </div>
      </section>

      <LatestArticlesSlider articles={latestArticles} />


      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-display text-3xl md:text-4xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible">
            Siap Memproduksi Souvenir Custom Anda?
          </h2>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
            Konsultasikan kebutuhan souvenir Anda dengan tim kami. Gratis konsultasi dan penawaran harga.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-[#25D366]/30"
            >
              <MessageCircle className="w-5 h-5" />
              Konsultasi via WhatsApp
            </a>
            <Link
              href="/katalog-produk"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              Lihat Katalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t-2 border-accent/30" />
      <div className="border-t-2 border-white/10" />
    </>
  )
}




