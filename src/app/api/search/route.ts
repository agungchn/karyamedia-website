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

interface Category {
  id: string
  name: string
  subcategories: {
    id: string
    name: string
    aliases?: string[]
  }[]
}

let productsCache: Product[] | null = null
let categoriesCache: Category[] | null = null

function loadProducts(): Product[] {
  if (productsCache) return productsCache
  const filePath = join(process.cwd(), "src/data/products.json")
  productsCache = JSON.parse(readFileSync(filePath, "utf-8"))
  return productsCache!
}

function loadCategories(): Category[] {
  if (categoriesCache) return categoriesCache
  const filePath = join(process.cwd(), "src/data/categories.ts")
  const content = readFileSync(filePath, "utf-8")
  const match = content.match(/export const categories = (\[[\s\S]*?\])/)
  if (match) {
    categoriesCache = eval(match[1])
  } else {
    categoriesCache = []
  }
  return categoriesCache!
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.toLowerCase().trim() || ""

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const products = loadProducts()
  const categories = loadCategories()

  const results = products
    .filter((p) => {
      const cat = categories.find((c) => c.id === p.categoryId)
      const sub = cat?.subcategories.find((s) => s.id === p.subcategoryId)
      const aliases = sub?.aliases ?? []
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        cat?.name.toLowerCase().includes(q) ||
        sub?.name.toLowerCase().includes(q) ||
        aliases.some((a) => a.toLowerCase().includes(q))
      )
    })
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      slug: p.slug,
      categoryId: p.categoryId,
      subcategoryId: p.subcategoryId,
      image: p.images[0] || "/images/logo-karyamedia.png",
    }))

  return NextResponse.json(results)
}
