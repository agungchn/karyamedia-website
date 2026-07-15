type LoaderProps = {
  src: string
  width: number
  quality?: number
}

// Custom loader: arahkan Next/Image ke file WebP pra-teroptimasi
// (dibuat oleh scripts/optimize-images.mjs) sehingga tak ada lagi
// permintaan ke layanan Image Optimization Vercel (kuota 402).
export default function karyamediaLoader({ src, width }: LoaderProps): string {
  // src contoh: /images/produk-unggulan/x/name.png
  const marker = "/images/"
  const idx = src.indexOf(marker)
  const rel = idx >= 0 ? src.slice(idx + marker.length - 1) : src // /produk-unggulan/x/name.png
  const dot = rel.lastIndexOf(".")
  const base = dot >= 0 ? rel.slice(0, dot) : rel
  return `/images/opt${base}-w${width}.webp`
}
