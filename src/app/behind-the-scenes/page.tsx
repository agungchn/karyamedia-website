import { Metadata } from "next"
import { BatikBackground } from "@/components/ui/batik-bg"

export const metadata: Metadata = {
  title: "Behind the Scenes",
  description: "Lihat proses produksi souvenir custom Karyamedia Souvenir — dari bahan baku hingga produk jadi, langsung dari workshop di Yogyakarta.",
  alternates: {
    canonical: "/behind-the-scenes",
  },
  openGraph: {
    title: "Behind the Scenes Karyamedia Souvenir",
    description: "Proses pembuatan plakat, medali, piala, dan souvenir custom di workshop Yogyakarta.",
    url: "/behind-the-scenes",
  },
}

const featured = [
  { id: "ni3z-FiFpJ4", title: "Proses Produksi Souvenir Custom" },
  { id: "lnHrLJuXXp4", title: "Tour Workshop Karyamedia Souvenir" },
]

const shorts = [
  { id: "PCF22jvmKLM", title: "Behind the Scenes 1" },
  { id: "RqJHhJUTq-c", title: "Behind the Scenes 2" },
  { id: "1DHXRn_Cjs0", title: "Behind the Scenes 3" },
  { id: "MSJ8-mGuvFE", title: "Behind the Scenes 4" },
  { id: "9xH0gHVQzYo", title: "Behind the Scenes 5" },
]

export default function BehindTheScenesPage() {
  return (
    <>
      <section className="relative overflow-hidden py-16 md:py-24">
        <BatikBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-accent-accessible font-medium mb-3">Behind the Scenes</p>
            <h1 className="heading-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-accessible mb-4">Behind the Scenes</h1>
            <p className="text-gray-600 text-lg">
              Lihat langsung proses produksi souvenir custom di workshop Karyamedia Souvenir, Yogyakarta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
            {featured.map((v) => (
              <div key={v.id} className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={v.title}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {shorts.map((v) => (
              <div key={v.id} className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                <div className="aspect-[9/16]">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={v.title}
                    className="w-full h-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://www.youtube.com/@agungchn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z" />
                </svg>
              Kunjungi YouTube Channel
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
