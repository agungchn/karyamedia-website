import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    loader: "custom",
    loaderFile: "./src/image-loader.ts",
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
      { source: "/blog/tumbler-souvenir-perusahaan-untuk-branding-bisnis", destination: "/blog/tumbler-promosi-untuk-branding-dan-merchandise-event", permanent: true },
      { source: "/blog/tumbler-stainless-steel-custom-untuk-merchandise-premium", destination: "/blog/tumbler-promosi-untuk-branding-dan-merchandise-event", permanent: true },
      { source: "/blog/tumbler-custom-murah-berkualitas-untuk-semua-kebutuhan", destination: "/blog/tumbler-souvenir-untuk-event-dan-merchandise-custom", permanent: true },
      { source: "/blog/medali-custom-untuk-kompetisi-dan-event", destination: "/blog/medali-custom-panduan-memilih-dan-memesan", permanent: true },
      { source: "/katalog-produk/accessories/nama-dada", destination: "/katalog-produk/accessories/name-tag", permanent: true },
      { source: "/katalog-produk/accessories/papan-nama-dada", destination: "/katalog-produk/accessories/name-tag", permanent: true },
      { source: "/katalog-produk/souvenir-wisuda/kalung-wisuda", destination: "/katalog-produk/souvenir-wisuda/samir-gordon-wisuda", permanent: true },
      { source: "/katalog-produk/souvenir-wisuda/medali-wisuda", destination: "/katalog-produk/souvenir-wisuda/samir-gordon-wisuda", permanent: true },
      { source: "/katalog-produk/souvenir-wisuda/mendali-wisuda", destination: "/katalog-produk/souvenir-wisuda/samir-gordon-wisuda", permanent: true },
      { source: "/katalog-produk/medali/medali-penghargaan", destination: "/katalog-produk/medali/medali-custom", permanent: true },
      { source: "/katalog-produk/medali/medali-lomba", destination: "/katalog-produk/medali/medali-custom", permanent: true },
      { source: "/katalog-produk/medali/medali-kompetisi", destination: "/katalog-produk/medali/medali-custom", permanent: true },
      { source: "/katalog-produk/medali/medali-event", destination: "/katalog-produk/medali/medali-custom", permanent: true },
      { source: "/katalog-produk/medali/medali-kelulusan", destination: "/katalog-produk/medali/medali-custom", permanent: true },
      { source: "/katalog-produk/medali/medali-3d", destination: "/katalog-produk/medali/medali-3d-zink-alloy", permanent: true },
      { source: "/katalog-produk/medali/medali-logam", destination: "/katalog-produk/medali/medali-3d-zink-alloy", permanent: true },
      { source: "/katalog-produk/medali/medali-alloy", destination: "/katalog-produk/medali/medali-3d-zink-alloy", permanent: true },
    ];
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production"
    const securityHeaders: { key: string; value: string }[] = [
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
    ]
    if (isProd) {
      securityHeaders.push({
        key: "Content-Security-Policy",
        value:
          "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://googleads.g.doubleclick.net https://www.clarity.ms https://scripts.clarity.ms https://s.pinimg.com https://ct.pinterest.com; script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://googleads.g.doubleclick.net https://www.clarity.ms https://scripts.clarity.ms https://s.pinimg.com https://ct.pinterest.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.openstreetmap.org https://ct.pinterest.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
      })
    }
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
