import type { Metadata } from "next"
import localFont from "next/font/local"
import Script from "next/script"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/ui/back-to-top"
import { LazyChatbot } from "@/components/ui/lazy-chatbot"
import { OrganizationSchema, WebSiteSchema, LocalBusinessReviewsSchema } from "@/components/json-ld"
import { FaviconThemeSwitcher } from "@/components/favicon-theme-switcher"

const geistSans = localFont({
  src: [
    { path: "../../fonts/Geist-latin.woff2", weight: "100 900", style: "normal" },
    { path: "../../fonts/Geist-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-geist-sans",
})

const geistMono = localFont({
  src: [
    { path: "../../fonts/GeistMono-latin.woff2", weight: "100 900", style: "normal" },
    { path: "../../fonts/GeistMono-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-geist-mono",
})

const playfairDisplay = localFont({
  src: [
    { path: "../../fonts/PlayfairDisplay-latin.woff2", weight: "400 900", style: "normal" },
    { path: "../../fonts/PlayfairDisplay-latin-ext.woff2", weight: "400 900", style: "normal" },
  ],
  variable: "--font-display",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://karyamediasouvenir.com"),
  title: {
    default: "Karyamedia Souvenir - Produsen Souvenir Custom Sejak 2001",
    template: "%s | Karyamedia Souvenir",
  },
  description:
    "Produsen souvenir custom & plakat Jogja berpengalaman sejak 2001. Plakat akrilik, medali, piala, prasasti, souvenir wisuda, dan merchandise custom. Berbadan hukum, berbasis Yogyakarta, melayani seluruh Indonesia.",
  keywords: [
    "souvenir custom",
    "plakat custom",
    "plakat akrilik",
    "plakat kayu",
    "plakat wayang",
    "plakat premium",
    "medali custom",
    "piala trophy",
    "souvenir wisuda",
    "samir wisuda",
    "map ijazah",
    "patung wisuda",
    "toga wisuda",
    "kalung rektor",
    "prasasti peresmian",
    "gift box souvenir",
    "nama dada custom",
    "gantungan kunci custom",
    "souvenir pernikahan",
    "souvenir murah",
    "souvenir jogja",
    "plakat jogja",
    "plakat akrilik jogja",
    "toko souvenir jogja",
    "yogyakarta",
    "karyamedia",
  ],
  authors: [{ name: "Karyamedia Souvenir" }],
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon/favicon.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/images/logo-karyamedia.png", sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "Karyamedia Souvenir - Produsen Souvenir Custom Sejak 2001",
    description:
      "Produsen souvenir custom berpengalaman sejak 2001. Plakat, medali, piala, souvenir wisuda, prasasti, dan merchandise custom. Berbadan hukum, berbasis Yogyakarta, melayani seluruh Indonesia.",
    siteName: "Karyamedia Souvenir",
    images: [{ url: "/images/logo-karyamedia.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karyamedia Souvenir - Produsen Souvenir Custom Sejak 2001",
    description:
      "Produsen souvenir custom berpengalaman sejak 2001. Plakat, medali, piala, souvenir wisuda, prasasti, dan merchandise custom.",
    images: ["/images/logo-karyamedia.png"],
  },
  other: {
    "p:domain_verify": "b9506a88c2041ed047b0340ab52dd933",
    "msvalidate.01": "5C837844F56D53354CE0CD0CD98B4FE2",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable}`}>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-T43BWBSQ");`}
      </Script>
      <body className="min-h-screen flex flex-col antialiased">
        <noscript dangerouslySetInnerHTML={{ __html: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T43BWBSQ" height="0" width="0" style="display:none;visibility:hidden"></iframe>' }} />
        <FaviconThemeSwitcher />
        <OrganizationSchema />
        <LocalBusinessReviewsSchema />
        <WebSiteSchema />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-primary focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none">
          Lewati ke konten utama
        </a>
        <Header />
        <main id="main-content" className="flex-1 pt-[100px] lg:pt-[112px]">{children}</main>
        <Footer />
        <LazyChatbot />
        <BackToTop />
      </body>
    </html>
  )
}
