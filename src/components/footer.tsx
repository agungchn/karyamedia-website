import Link from "next/link"
import Image from "next/image"
import { MessageCircle, Mail, MapPin, Phone, Clock } from "lucide-react"
import { companyInfo } from "@/data/company"
import { categories } from "@/data/categories"
import { getWhatsAppLink } from "@/lib/utils"

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image src="/images/logo-karyamedia.png" alt="Karyamedia Souvenir" width={40} height={40} className="w-10 h-10 object-contain" />
                <div>
                  <div className="font-bold text-lg leading-tight">Karyamedia</div>
                  <div className="text-[10px] text-accent-accessible font-medium tracking-widest uppercase">Souvenir</div>
                </div>
              </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Spesialis souvenir & plakat Medali custom berkualitas untuk penghargaan, wisuda, event, dan kebutuhan instansi.
            </p>
            <div className="mt-6 space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent-accessible" />
                <span>{companyInfo.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-accent-accessible" />
                <span>{companyInfo.whatsapp}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 text-accent-accessible" />
                <span>{companyInfo.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-accent-accessible" />
                <span>{companyInfo.operationalHours}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[
                { label: "IG", name: "Instagram" },
                { label: "FB", name: "Facebook" },
                { label: "YT", name: "Youtube" },
                { label: "TT", name: "TikTok" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.name}
                  className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary hover:rotate-[360deg] transition-all duration-500 text-xs font-medium"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base text-accent-accessible mb-1">Menu</h3>
            <div className="w-full border-b border-accent/50 mb-4"></div>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {[
                { label: "Profil Perusahaan", href: "/profil" },
                { label: "Galeri Proyek", href: "/gallery" },
                { label: "Testimoni", href: "/#testimoni" },
                { label: "Cara Pesan", href: "/cara-pesan" },
                { label: "Artikel & Tips", href: "/blog" },
                { label: "Kontak", href: "/kontak" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-accent-accessible hover:underline underline-offset-2 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base text-accent-accessible mb-1">Kategori Produk</h3>
            <div className="w-full border-b border-accent/50 mb-4"></div>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/katalog-produk/${cat.slug}`} className="hover:text-accent-accessible hover:underline underline-offset-2 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base text-accent-accessible mb-1">Newsletter</h3>
            <div className="w-full border-b border-accent/50 mb-4"></div>
            <p className="text-sm text-gray-300 mb-4">
              Dapatkan info terbaru, promo, dan inspirasi souvenir via WhatsApp.
            </p>
            <a
              href={getWhatsAppLink("Halo Karyamedia Souvenir, saya ingin berlangganan newsletter untuk info terbaru dan promo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-light hover:bg-accent text-sm font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Berlangganan via WA
            </a>
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-3">Ekspedisi</h3>
              <div className="flex flex-wrap gap-2">
                {companyInfo.shipping.map((s) => (
                  <span key={s.name} className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300 hover:bg-accent hover:text-primary transition-colors cursor-default">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-accent/30 bg-gradient-to-r from-accent via-accent-light to-accent-accessible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary font-medium">
          <p>&copy; 2026 Karyamedia Souvenir. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-primary/80 hover:text-primary transition-colors cursor-default">Kebijakan Privasi</span>
            <span className="text-primary/40">|</span>
            <span className="text-primary/80 hover:text-primary transition-colors cursor-default">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
