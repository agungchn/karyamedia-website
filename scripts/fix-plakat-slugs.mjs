import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const jsonPath = join(import.meta.dirname, "../src/data/products.json")
const data = JSON.parse(readFileSync(jsonPath, "utf-8"))

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-") // Replace multiple - with single -
    .replace(/^-|-$/g, "") // Remove leading/trailing -
}

function generateDescriptiveSlug(name, prefix, existingSlugs) {
  // Remove common prefixes
  let cleanName = name
    .replace(/^Plakat\s*/i, "")
    .trim()

  // Generate base slug
  let baseSlug = prefix + "-" + slugify(cleanName)

  // If empty or too short, use fallback
  if (baseSlug.length < prefix.length + 5) {
    baseSlug = prefix
  }

  // Check for duplicates and add number if needed
  let finalSlug = baseSlug
  let counter = 1
  while (existingSlugs.has(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`
    counter++
  }

  return finalSlug
}

// Categories to process
const categories = [
  { id: "pkp", prefix: "plakat-kayu-premium", name: "Plakat Kayu Premium" },
  { id: "pm", prefix: "plakat-marmer", name: "Plakat Marmer" },
  { id: "pk", prefix: "plakat-kayu", name: "Plakat Kayu" },
  { id: "pf", prefix: "plakat-fiberglass", name: "Plakat Fiberglass" },
  { id: "pw", prefix: "plakat-wayang", name: "Plakat Wayang" },
]

// Collect all existing slugs to avoid duplicates
const allSlugs = new Set(data.map((p) => p.slug))

let totalUpdateCount = 0
const allUpdates = []

for (const cat of categories) {
  let updateCount = 0
  const updates = []

  for (const product of data) {
    if (product.subcategoryId !== cat.id) continue

    const oldSlug = product.slug
    const newSlug = generateDescriptiveSlug(product.name, cat.prefix, allSlugs)

    if (oldSlug !== newSlug) {
      // Remove old slug from set and add new one
      allSlugs.delete(oldSlug)
      allSlugs.add(newSlug)

      updates.push({
        code: product.code,
        name: product.name,
        oldSlug,
        newSlug,
      })

      product.slug = newSlug
      updateCount++
      totalUpdateCount++
    }
  }

  if (updateCount > 0) {
    console.log(`\n=== ${cat.name} (${cat.id}) ===`)
    console.log(`Total produk yang diubah slug-nya: ${updateCount}\n`)
    console.log("Detail perubahan:")
    updates.forEach((u) => {
      console.log(`[${u.code}] ${u.name}`)
      console.log(`  ${u.oldSlug} -> ${u.newSlug}`)
    })
    allUpdates.push(...updates)
  }
}

console.log(`\n========================================`)
console.log(`TOTAL SEMUA KATEGORI: ${totalUpdateCount} produk`)
console.log(`========================================`)

writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf-8")
console.log("\nFile products.json berhasil diupdate!")
