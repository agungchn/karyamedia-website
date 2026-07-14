import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sajikan gambar dalam format modern (AVIF/WebP) lewat next/image
    // untuk memperkecil bytes & memperbaiki Core Web Vitals (LCP).
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.karyamediasouvenir.com" }],
        destination: "https://karyamediasouvenir.com/:path*",
        permanent: true,
      },
      // Consolidation: near-duplicate articles (>=80% Jaccard) 301'd to their
      // canonical hub so ranking signals merge. See scripts/seo/consolidate.mjs.
      { source: "/blog/tumbler-souvenir-perusahaan-untuk-branding-bisnis", destination: "/blog/tumbler-promosi-untuk-branding-dan-merchandise-event", permanent: true },
      { source: "/blog/tumbler-stainless-steel-custom-untuk-merchandise-premium", destination: "/blog/tumbler-promosi-untuk-branding-dan-merchandise-event", permanent: true },
      { source: "/blog/tumbler-custom-murah-berkualitas-untuk-semua-kebutuhan", destination: "/blog/tumbler-souvenir-untuk-event-dan-merchandise-custom", permanent: true },
      { source: "/blog/medali-custom-untuk-kompetisi-dan-event", destination: "/blog/medali-custom-panduan-memilih-dan-memesan", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
