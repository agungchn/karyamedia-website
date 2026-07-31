import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const jsonPath = join(import.meta.dirname, "../src/data/products.json")
const data = JSON.parse(readFileSync(jsonPath, "utf-8"))

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// Mapping: image number -> correct name (from visual inspection)
const imageMap = {
  1: "Souvenir Pernikahan Pasangan Adat Jawa Keluarga Cemara",
  2: "Piala Pernikahan Keluarga Besar Eyang Hartosuseno",
  3: "Souvenir Pernikahan Foto Pasangan Fika & Afrizal",
  4: "Souvenir Pernikahan Bentuk Hati Reza & Fitria Geodesi UGM",
  5: "Trophy Pernikahan Emas 10th Wedding Roosvenda & Amaru",
  6: "Trophy Pernikahan Emas Pasangan Pengantin Sakinah Mawaddah",
}

// Collect all existing slugs to avoid duplicates
const allSlugs = new Set(data.map((p) => p.slug))

let updateCount = 0
const updates = []

for (const product of data) {
  if (product.subcategoryId !== "sp") continue

  // Extract image number from images array
  const imgMatch = product.images?.[0]?.match(/souvenir-pernikahan-(\d+)\.png/)
  if (!imgMatch) continue

  const imgNum = parseInt(imgMatch[1], 10)
  const newName = imageMap[imgNum]
  if (!newName) continue

  const oldName = product.name
  if (oldName === newName) continue

  // Generate new slug
  let newSlug = "souvenir-pernikahan-" + slugify(newName.replace(/^Souvenir Pernikahan\s*/i, "").replace(/^Piala Pernikahan\s*/i, "").replace(/^Trophy Pernikahan\s*/i, ""))
  if (newSlug.length < 25) newSlug = "souvenir-pernikahan-" + imgNum

  // Check for duplicates
  let finalSlug = newSlug
  let counter = 1
  while (allSlugs.has(finalSlug)) {
    finalSlug = `${newSlug}-${counter}`
    counter++
  }

  // Remove old slug from set and add new one
  allSlugs.delete(product.slug)
  allSlugs.add(finalSlug)

  // Generate description
  const shortDesc = newName.substring(0, 60)
  const description = `Souvenir pernikahan custom: ${newName}. Desain eksklusif dan personal, cocok untuk kenang-kenangan hari spesial pernikahan Anda.`

  updates.push({
    code: product.code,
    oldName,
    newName,
    oldSlug: product.slug,
    newSlug: finalSlug,
  })

  product.name = newName
  product.shortDescription = shortDesc + "..."
  product.description = description
  product.slug = finalSlug
  updateCount++
}

console.log(`\nTotal produk Souvenir Pernikahan yang diubah: ${updateCount}\n`)
console.log("Detail perubahan:")
updates.forEach((u) => {
  console.log(`[${u.code}]`)
  console.log(`  Nama: ${u.oldName} -> ${u.newName}`)
  console.log(`  Slug: ${u.oldSlug} -> ${u.newSlug}`)
})

writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf-8")
console.log("\nFile products.json berhasil diupdate!")
