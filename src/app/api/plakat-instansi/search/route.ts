import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"

interface Product {
  id: string
  code: string
  name: string
  slug: string
  categoryId: string
  subcategoryId: string
  description: string
  shortDescription: string
  images: string[]
}

let productsCache: Product[] | null = null

function loadProducts(): Product[] {
  if (productsCache) return productsCache
  const filePath = join(process.cwd(), "src/data/products.json")
  productsCache = JSON.parse(readFileSync(filePath, "utf-8"))
  return productsCache!
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.toLowerCase().trim() || ""
  const sub = searchParams.get("sub")?.toLowerCase().trim() || ""

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const products = loadProducts()

  const results = products
    .filter((p) => {
      if (p.categoryId !== "plakat-instansi") return false
      if (sub && p.subcategoryId !== sub) return false
      
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      )
    })
    .slice(0, 20)
    .map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      slug: p.slug,
      subcategoryId: p.subcategoryId,
      image: p.images[0] || "/images/logo-karyamedia.png",
      shortDescription: p.shortDescription,
    }))

  return NextResponse.json(results)
}
