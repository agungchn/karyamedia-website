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

function generateDescriptiveSlug(name, existingSlugs) {
  // Remove common prefixes
  let cleanName = name
    .replace(/^Medali 3D\s*/i, "")
    .replace(/^Medali\s*/i, "")
    .trim()

  // Generate base slug
  let baseSlug = "medali-3d-" + slugify(cleanName)

  // If empty or too short, use fallback
  if (baseSlug.length < 12) {
    baseSlug = "medali-3d"
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

// Collect all existing slugs to avoid duplicates
const allSlugs = new Set(data.map((p) => p.slug))

let updateCount = 0
const updates = []

for (const product of data) {
  if (product.subcategoryId !== "md3d") continue

  const oldSlug = product.slug
  const newSlug = generateDescriptiveSlug(product.name, allSlugs)

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
  }
}

console.log(`\nTotal produk Medali 3D Zink Alloy yang diubah slug-nya: ${updateCount}\n`)
console.log("Detail perubahan:")
updates.forEach((u) => {
  console.log(`[${u.code}] ${u.name}`)
  console.log(`  ${u.oldSlug} -> ${u.newSlug}`)
})

writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf-8")
console.log("\nFile products.json berhasil diupdate!")
