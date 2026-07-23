"use client"

// Komponen ini sekarang pakai OpenStreetMap embed agar lebih ringan
// dan tidak perlu API key Google Maps.
export function GoogleMapEmbed({
  title = "Lokasi Karyamedia Souvenir",
  height = 300,
}: {
  title?: string
  height?: number
}) {
  // Koordinat Karyamedia Souvenir
  const lat = -7.8169864
  const lng = 110.3838586

  // BBox kecil di sekitar lokasi (~500 m) untuk OpenStreetMap embed
  const delta = 0.004
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`

  // OpenStreetMap embed — tanpa API key, lebih ringan, dan stabil
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${lat},${lng}`

  return (
    <iframe
      src={src}
      width="100%"
      height={height}
      style={{ border: 0, display: "block" }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={title}
    />
  )
}
