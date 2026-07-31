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
  1: "Plakat Akrilik Bradley Edwards - Penghargaan Verzanti Property",
  2: "Plakat Akrilik Dharma Wanita Persatuan Provinsi Kepulauan Riau",
  3: "Plakat Akrilik Putu Nadira Prashanti - Pelepasan Siswa SMP CHIS Denpasar",
  4: "Plakat Akrilik Galatua Kaltim - Turnamen Bola Voli Open A-40 2020",
  5: "Plakat Akrilik MA Aliyah Nuurul Waahid Purworejo",
  6: "Plakat Akrilik Pesona Cipta - 20th Anniversary Golf Tournament",
  7: "Plakat Akrilik Chick-fil-A Employee of the Month",
  8: "Plakat Akrilik 10th AJIVE - Universitas Pendidikan Mandalika",
  9: "Plakat Akrilik Restu Anggun - Prestasi Dancesport SMA Stella Duce 1 Yogyakarta",
  10: "Plakat Akrilik Fakultas Psikologi Universitas Ahmad Dahlan",
  11: "Plakat Akrilik Dawet Kemayu - 2nd Anniversary 2022",
  12: "Plakat Akrilik Duta Wisata Kalimantan Timur 2021",
  13: "Plakat Akrilik IPC - The Last Ship Call 2019",
  14: "Plakat Akrilik Sera Food - Terima Kasih Kunjungan",
  15: "Plakat Akrilik Jateng - Jumbara Palang Merah Indonesia 2017",
  16: "Plakat Akrilik Pertamina - Forum CIP Marketing 2017",
  18: "Plakat Akrilik Miss Raminten - Lifetime Achievement 2017",
  19: "Plakat Akrilik Stikom Surabaya",
  20: "Plakat Akrilik Wonderful Indonesia Natuna - Juara III Lomba Kue Semprong",
  21: "Plakat Akrilik HITA - Hotel IT Conference 2019",
  22: "Plakat Akrilik Fishing Trophy",
  23: "Plakat Akrilik Study Banding - LKD SAE Mandiri Bantul",
  25: "Plakat Akrilik Kanwil Kementerian Agama Provinsi Kepulauan Riau",
  26: "Plakat Akrilik UGM Teknik Nuklir - Riset Merah Putih",
  27: "Plakat Akrilik Produk Terbaik - Pameran PDIN Yogyakarta 2022",
  28: "Plakat Akrilik Terima Kasih - Peserta Pameran PDIN Yogyakarta 2022",
  29: "Plakat Akrilik EF Spelling Bee - 2nd Winner Yogyakarta 2023",
  30: "Plakat Akrilik MA Al-Ma'ruf - UIN Sunan Kalijaga 2023",
  31: "Plakat Akrilik ICESCO Arabic Video Competition 2020",
  32: "Plakat Akrilik Best Employee 2016",
  33: "Plakat Akrilik Karangasem Spectacular Performance 2017",
  35: "Plakat Akrilik Terima Kasih - Prakerin SMKN 1 Kuala Tungkal 2018",
  36: "Plakat Akrilik Golf Club UPN Veteran Yogyakarta 2017",
  37: "Plakat Akrilik Modern Dance Olimpiade BOSA 2018",
  39: "Plakat Akrilik Netitas 94 Homecoming Angkatan 94",
  40: "Plakat Akrilik KMS - Best Partner Award 2026",
  41: "Plakat Akrilik Kwangdong - Plakat Penghargaan Korea 2017",
  42: "Plakat Akrilik Galaxywing IT Solutions 2024",
  43: "Plakat Akrilik Halt Grafica - Penghargaan Rusia 2012",
  44: "Plakat Akrilik Salam GenRe - Duta GenRe Sumatera Selatan 2022",
  45: "Plakat Akrilik Terima Kasih - Prakerin SMKN 1 Buntok 2022",
  46: "Plakat Akrilik Felka - Juara II MTQ Putra Al Azhar 2022",
  47: "Plakat Akrilik Jelajah Budaya - Selendang Sutera Dinas Kebudayaan DIY 2022",
  48: "Plakat Akrilik Geopark Natuna",
  49: "Plakat Akrilik Lomba Video Pendek - Juara 1 Kategori Umum",
  50: "Plakat Akrilik Tokoh Penggerak Reuni 35th SD Kanisius Alumni 1986",
  51: "Plakat Akrilik MONC Juara I Short Movie 2020",
  52: "Plakat Akrilik Appreciation - Pdt. Liliyus Binluk 2020",
  53: "Plakat Akrilik 1st Lomba Inovasi TTG Kota Tebing Tinggi 2020",
  54: "Plakat Akrilik Pertamina Turnamen Golf Toba Ganesha 2018",
  55: "Plakat Akrilik Solusi Kantor Profesional - Timothy Arnold",
  56: "Plakat Akrilik KMS-PRO Golf Trophy",
  57: "Plakat Akrilik Indian Association - Bal Devils 2013",
  58: "Plakat Akrilik Grameenphone - Tanzila Rumman SSMT",
  59: "Plakat Akrilik Kompetisi DJ Dunia - Pemenang Image-Sound",
  60: "Plakat Akrilik Terima Kasih Ketua KPK - Seminar Melawan Korupsi 2014",
  61: "Plakat Akrilik Republic Group - Robert H. Foley 15 Tahun Pengabdian",
  62: "Plakat Akrilik Zimmerman - Enzoer Sina E-commerce 2020",
  63: "Plakat Akrilik Karyamedia Souvenir - Excellence Award",
  64: "Plakat Akrilik Tuppuan Girsang - Panitia Wisata Bona Taon 2020",
  65: "Plakat Akrilik MTQ VI Kabupaten Waropen - Juara I Khat Al-Quran",
  66: "Plakat Akrilik Pemprov Kaltim - Olahraga Nomor Satu",
  67: "Plakat Akrilik Kenang-Kenangan Pemerintah Kota Bontang",
  68: "Plakat Akrilik TikTok Challenge BKSN PIR 2020",
  69: "Plakat Akrilik Keluarga Si Tatang - Juara II Putra Dispora",
  70: "Plakat Akrilik Guru Berprestasi Kabupaten Kotabaru 2004",
  71: "Plakat Akrilik Kompetisi Pencak Silat Kalimantan Utara 2017",
  72: "Plakat Akrilik Putra Putri Kebudayaan 2022 Kota Balikpapan",
  73: "Plakat Akrilik Agoda.com - 2015 Gold Circle Award",
  74: "Plakat Akrilik Pemprov Kepulauan Riau Dinas Pendidikan",
  75: "Plakat Akrilik Seminar Young Entrepreneur 2012",
  76: "Plakat Akrilik Pegadaian - Juara II Lomba Mewarnai 2018",
  77: "Plakat Akrilik Santa Maria Assumpta Gamping - Ingat Pesan Ibu 2025",
  78: "Plakat Akrilik Abankirenk Highschool Contest 2015",
  79: "Plakat Akrilik Kenang-Kenangan Pondok Pesantren Yayasan Darussalam",
  80: "Plakat Akrilik Copa Catalana Rally Slot 1/24 2010",
  81: "Plakat Akrilik SMA BOPKRI 1 Yogyakarta - Juara 3 Basket 2014",
  82: "Plakat Akrilik Juara 1 Gelar Potensi Desa Budaya 2021",
  83: "Plakat Akrilik AKSIOMA - Juara I Tenis Meja MTs DIY 2017",
  84: "Plakat Akrilik AKSIOMA - Juara I Tenis Meja MTs DIY 2017",
}

// Collect all existing slugs to avoid duplicates
const allSlugs = new Set(data.map((p) => p.slug))

let updateCount = 0
const updates = []

for (const product of data) {
  if (product.subcategoryId !== "pa") continue

  // Extract image number from images array
  const imgMatch = product.images?.[0]?.match(/plakat-akrilik-(\d+)\.png/)
  if (!imgMatch) continue

  const imgNum = parseInt(imgMatch[1], 10)
  const newName = imageMap[imgNum]
  if (!newName) continue

  const oldName = product.name
  if (oldName === newName) continue

  // Generate new slug
  let newSlug = "plakat-akrilik-" + slugify(newName.replace(/^Plakat Akrilik\s*/i, ""))
  if (newSlug.length < 20) newSlug = "plakat-akrilik-" + imgNum

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
  const shortDesc = newName.replace(/^Plakat Akrilik\s*/i, "").substring(0, 60)
  const description = `Plakat akrilik custom untuk ${newName.replace(/^Plakat Akrilik\s*/i, "").toLowerCase()}. Desain eksklusif dengan bahan akrilik premium, cocok untuk penghargaan dan kenang-kenangan.`

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

console.log(`\nTotal produk Plakat Akrilik yang diubah: ${updateCount}\n`)
console.log("Detail perubahan:")
updates.forEach((u) => {
  console.log(`[${u.code}]`)
  console.log(`  Nama: ${u.oldName} -> ${u.newName}`)
  console.log(`  Slug: ${u.oldSlug} -> ${u.newSlug}`)
})

writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf-8")
console.log("\nFile products.json berhasil diupdate!")
