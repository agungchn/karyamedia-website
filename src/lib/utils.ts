import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { companyInfo } from "@/data/company"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

export function generateWhatsAppMessage(productCode?: string, productName?: string): string {
  if (productCode && productName) {
    return `Halo Karyamedia Souvenir, saya tertarik dengan produk ${productCode} (${productName}). Mohon informasi harga, spesifikasi, dan estimasi pengerjaannya.`
  }
  return "Halo Karyamedia Souvenir, saya ingin konsultasi mengenai produk souvenir custom."
}

export function getWhatsAppLink(message?: string): string {
  const encoded = encodeURIComponent(message || "Halo Karyamedia Souvenir")
  return `https://wa.me/${companyInfo.whatsappNumber}?text=${encoded}`
}
