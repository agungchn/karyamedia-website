import { companyInfo } from "@/data/company"
import { categories } from "@/data/categories"
import { testimonials } from "@/data/testimonials"

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyInfo.name,
    url: "https://karyamediasouvenir.com",
    logo: "https://karyamediasouvenir.com/images/logo-karyamedia.png",
    foundingDate: "2001",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Menteri Supeno No. 90",
      addressLocality: "Yogyakarta",
      addressCountry: "ID",
      postalCode: "55161",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-822-4358-0777",
      contactType: "customer service",
      availableLanguage: "Indonesian",
    },
    description: companyInfo.positioning,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: companyInfo.name,
    url: "https://karyamediasouvenir.com",
    image: "https://karyamediasouvenir.com/images/logo-karyamedia.png",
    telephone: "+62-822-4358-0777",
    email: companyInfo.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Menteri Supeno No. 90, Pandeyan, Umbulharjo",
      addressLocality: "Yogyakarta",
      addressRegion: "DI Yogyakarta",
      postalCode: "55161",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -7.8262,
      longitude: 110.3917,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    sameAs: [
      "https://www.facebook.com/Karyamedia-Souvenir-208234135969794/",
      "https://www.tokopedia.com/karyamediasouvenir",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessReviewsSchema() {
  const total = testimonials.length
  const avg = Number((testimonials.reduce((s, t) => s + t.rating, 0) / total).toFixed(1))
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: companyInfo.name,
    url: "https://karyamediasouvenir.com",
    image: "https://karyamediasouvenir.com/images/logo-karyamedia.png",
    telephone: "+62-822-4358-0777",
    email: companyInfo.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Menteri Supeno No. 90, Pandeyan, Umbulharjo",
      addressLocality: "Yogyakarta",
      addressRegion: "DI Yogyakarta",
      postalCode: "55161",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -7.8262,
      longitude: 110.3917,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    sameAs: [
      "https://www.facebook.com/Karyamedia-Souvenir-208234135969794/",
      "https://www.tokopedia.com/karyamediasouvenir",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg,
      reviewCount: total,
      bestRating: 5,
      worstRating: 4,
    },
    review: testimonials.slice(0, 10).map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
      reviewBody: t.content,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: companyInfo.name,
    url: "https://karyamediasouvenir.com",
    description: companyInfo.positioning,
    inLanguage: "id",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://karyamediasouvenir.com/katalog-produk?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://karyamediasouvenir.com${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProductSchema({
  name,
  description,
  sku,
  image,
  category,
  price,
}: {
  name: string
  description: string
  sku: string
  image: string
  category: string
  price?: string
}) {
  const numericPrice = price ? parseFloat(price.match(/(\d+)/)?.[0] || "0") : undefined
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku,
    image: `https://karyamediasouvenir.com${image}`,
    category,
    brand: {
      "@type": "Brand",
      name: companyInfo.name,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      ...(numericPrice ? { price: numericPrice, priceCurrency: "IDR" } : { price: "0", priceCurrency: "IDR" }),
      url: `https://karyamediasouvenir.com${sku}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ArticleSchema({
  title,
  description,
  image,
  date,
  slug,
  category,
  tags,
  wordCount,
  readTime,
}: {
  title: string
  description: string
  image: string
  date: string
  slug: string
  category?: string
  tags?: string[]
  wordCount?: number
  readTime?: number
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: `https://karyamediasouvenir.com${image}`,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Organization",
      name: companyInfo.name,
    },
    publisher: {
      "@type": "Organization",
      name: companyInfo.name,
      logo: {
        "@type": "ImageObject",
        url: "https://karyamediasouvenir.com/images/logo-karyamedia.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://karyamediasouvenir.com/blog/${slug}`,
    },
    inLanguage: "id",
  }

  if (category) schema.articleSection = category
  if (tags && tags.length > 0) schema.keywords = tags.join(", ")
  if (wordCount) schema.wordCount = wordCount
  if (readTime) schema.timeRequired = `PT${readTime}M`

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQPageSchema({ items }: { items: { q: string; a: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function CategorySchema({ name, description }: { name: string; description: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `https://karyamediasouvenir.com/katalog-produk`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((cat, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: cat.name,
        url: `https://karyamediasouvenir.com/katalog-produk/${cat.slug}`,
      })),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
