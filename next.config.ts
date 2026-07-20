import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generate source maps agar Lighthouse bisa memberi detail & memudahkan
  // debug produksi (tidak menambah ukuran JS yang di-download user).
  productionBrowserSourceMaps: true,
  images: {
    // Pakai custom loader -> file WebP pra-teroptimasi (scripts/optimize-images.mjs)
    // di folder public/images/opt. Ini menghindari layanan Image Optimization
    // Vercel (kuota habis -> 402 Payment Required yang memblokir semua gambar).
    // WebP dihasilkan saat build (prebuild) & tiap gambar baru (add.js).
    loader: "custom",
    loaderFile: "./src/image-loader.ts",
    // 2 lebar: 480 (grid 4 kolom ~315px + retina mobile), 960 (desktop retina).
    deviceSizes: [480, 960],
    imageSizes: [],
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
      // Alias: nama dada / papan nama dada → Name Tag
      { source: "/katalog-produk/accessories/nama-dada", destination: "/katalog-produk/accessories/name-tag", permanent: true },
      { source: "/katalog-produk/accessories/papan-nama-dada", destination: "/katalog-produk/accessories/name-tag", permanent: true },
      // Alias: kalung/medali wisuda → Samir/Gordon Wisuda
      { source: "/katalog-produk/souvenir-wisuda/kalung-wisuda", destination: "/katalog-produk/souvenir-wisuda/samir-gordon-wisuda", permanent: true },
      { source: "/katalog-produk/souvenir-wisuda/medali-wisuda", destination: "/katalog-produk/souvenir-wisuda/samir-gordon-wisuda", permanent: true },
      { source: "/katalog-produk/souvenir-wisuda/mendali-wisuda", destination: "/katalog-produk/souvenir-wisuda/samir-gordon-wisuda", permanent: true },
      // Alias: medali penghargaan/lomba/dll → Medali Custom
      { source: "/katalog-produk/medali/medali-penghargaan", destination: "/katalog-produk/medali/medali-custom", permanent: true },
      { source: "/katalog-produk/medali/medali-lomba", destination: "/katalog-produk/medali/medali-custom", permanent: true },
      { source: "/katalog-produk/medali/medali-kompetisi", destination: "/katalog-produk/medali/medali-custom", permanent: true },
      { source: "/katalog-produk/medali/medali-event", destination: "/katalog-produk/medali/medali-custom", permanent: true },
      { source: "/katalog-produk/medali/medali-kelulusan", destination: "/katalog-produk/medali/medali-custom", permanent: true },
      // Alias: medali 3d/logam/alloy → Medali 3D Zink Alloy
      { source: "/katalog-produk/medali/medali-3d", destination: "/katalog-produk/medali/medali-3d-zink-alloy", permanent: true },
      { source: "/katalog-produk/medali/medali-logam", destination: "/katalog-produk/medali/medali-3d-zink-alloy", permanent: true },
      { source: "/katalog-produk/medali/medali-alloy", destination: "/katalog-produk/medali/medali-3d-zink-alloy", permanent: true },
    ];
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production"
    const securityHeaders: { key: string; value: string }[] = [
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
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
    ]
    // CSP hanya di production. Di dev React butuh eval() untuk fitur debug;
    // tanpa unsafe-eval akan muncul console error (tidak memengaruhi production).
    if (isProd) {
      securityHeaders.push({
        key: "Content-Security-Policy",
        value:
          "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://googleads.g.doubleclick.net; script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://googleads.g.doubleclick.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://maps.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
      })
    }
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
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
