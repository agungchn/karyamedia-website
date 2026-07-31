import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const jsonPath = join(import.meta.dirname, "../src/data/products.json")
const data = JSON.parse(readFileSync(jsonPath, "utf-8"))

// Mapping: image number -> correct name & description
// Based on actual image content verified by visual inspection
const fixMap = {
  43: {
    name: "Plakat Resin Kabupaten Sanggau Kenang-Kenangan",
    shortDescription: "Plakat resin dengan ornamen batik dan logo Kabupaten Sanggau",
    description: "Plakat resin dengan ornamen batik dan logo Kabupaten Sanggau Kalimantan Barat. Teks Kenang-Kenangan dari Pemerintahan Kabupaten Sanggau. Cocok untuk plakat pemerintah daerah.",
  },
  44: {
    name: "Plakat Resin Kabupaten Sanggau Kenang-Kenangan Versi 2",
    shortDescription: "Plakat resin dengan ornamen batik dan logo Kabupaten Sanggau",
    description: "Plakat resin dengan desain batik dan logo Kabupaten Sanggau Kalimantan Barat. Teks Kenang-Kenangan dari Pemerintahan Kabupaten Sanggau. Base oval hitam. Cocok untuk plakat pemerintah daerah.",
  },
  45: {
    name: "Plakat Resin Hitam Menteri Ketenagakerjaan BPN",
    shortDescription: "Plakat resin hitam dengan logo Menteri Ketenagakerjaan Republik Indonesia",
    description: "Plakat resin hitam dengan logo Menteri Ketenagakerjaan Republik Indonesia. Teks Kenang-Kenangan Kepala Kantor Wilayah Badan Pertanahan Nasional Provinsi Jawa Barat. Cocok untuk plakat instansi nasional.",
  },
  46: {
    name: "Plakat Fiberglass Lomba Kelompok Sadar Wisata Kaltim",
    shortDescription: "Plakat fiberglass bundar dengan logo provinsi dan gambar topeng budaya",
    description: "Plakat fiberglass bundar dengan logo provinsi dan gambar topeng budaya. Teks Juara I Lomba Kelompok Sadar Wisata Provinsi Kalimantan Timur. Base kayu merah. Cocok untuk penghargaan pariwisata.",
  },
  47: {
    name: "Plakat Resin Kota Palopo Tangan Badik",
    shortDescription: "Plakat resin dengan gambar tangan memegang badik dan logo Kota Palopo",
    description: "Plakat resin dengan gambar tangan memegang badik dan logo Kota Palopo. Teks Pemerintah Kota Palopo Propinsi Sulawesi Selatan. Base hitam. Cocok untuk plakat pemerintah daerah.",
  },
  48: {
    name: "Plakat Fiberglass Universitas Brawijaya Kompetisi",
    shortDescription: "Plakat fiberglass menara dengan logo universitas",
    description: "Plakat fiberglass menara dengan logo universitas. Teks Kompetisi Rancangan Software Kreatif PIMNAS XXII 2009 Universitas Brawijaya. Cocok untuk penghargaan kompetisi akademik.",
  },
  49: {
    name: "Plakat Resin Perisai Polres Sleman",
    shortDescription: "Plakat resin bentuk perisai dengan logo Polres Sleman D.I. Yogyakarta",
    description: "Plakat resin bentuk perisai dengan logo Polres Sleman D.I. Yogyakarta. Teks Kenang-Kenangan dari Kepolisian Resort Sleman. Base resin bening. Cocok untuk penghargaan instansi kepolisian.",
  },
  50: {
    name: "Plakat Fiberglass SMA Negeri 5 Yogyakarta",
    shortDescription: "Plakat fiberglass bentuk pentagonal dengan logo SMA Negeri 5 Yogyakarta",
    description: "Plakat fiberglass bentuk pentagonal dengan logo SMA Negeri 5 Yogyakarta. Teks Kenang-Kenangan Trus Hakarya Ruming Praja. Cocok untuk plakat sekolah menengah.",
  },
  51: {
    name: "Plakat Resin Patung Ignatius Night",
    shortDescription: "Plakat resin bentuk patung Santo Ignatius",
    description: "Plakat resin bentuk patung Santo Ignatius. Teks Ignatius Night 2012 Ite Inflammate Omnia Serikat Jesus Indonesia. Cocok untuk plakat organisasi keagamaan dan seni.",
  },
  52: {
    name: "Plakat Resin Buku Terbuka Musabaqah Tilawatil Quran",
    shortDescription: "Plakat resin bentuk buku terbuka dengan tulisan Arab",
    description: "Plakat resin bentuk buku terbuka dengan tulisan Arab. Teks Musabaqah Tilawatil Quran Tingkat Nasional Tahun 2014 Batam-Kepri. Base bertingkat. Cocok untuk penghargaan tilawah.",
  },
  53: {
    name: "Plakat Resin Buku Terbuka Merah Cerdaskan Talenta",
    shortDescription: "Plakat resin bentuk buku merah dengan tulisan Arab",
    description: "Plakat resin bentuk buku merah dengan tulisan Arab. Teks Cerdaskan Talenta Unggul Tingkat Nasional Tahun 2014 Batam-Kepri. Base marmer hijau. Cocok untuk penghargaan pendidikan Islam.",
  },
  54: {
    name: "Plakat Resin Perisai Luwu Utara",
    shortDescription: "Plakat resin bentuk perisai dengan logo Kabupaten Luwu Utara",
    description: "Plakat resin bentuk perisai dengan logo Kabupaten Luwu Utara. Teks Kenang-Kenangan Pemerintah Kabupaten Luwu Utara Provinsi Sulawesi Selatan. Bupati Sulkodar Putri Indriani. Cocok untuk plakat pemerintah daerah.",
  },
  55: {
    name: "Plakat Resin Bening Bola Basket Trophy",
    shortDescription: "Plakat resin bening dengan bola basket kristal di atas base",
    description: "Plakat resin bening dengan bola basket kristal di atas base. Teks Best Inventory Management Team Warehouse Logistics Store. Cocok untuk penghargaan tim perusahaan.",
  },
  56: {
    name: "Plakat Resin Piramida Kabupaten Kota Baru",
    shortDescription: "Plakat resin bening bentuk piramida dengan logo Kabupaten Kota Baru",
    description: "Plakat resin bening bentuk piramida dengan logo Kabupaten Kota Baru Provinsi Kalimantan Selatan. Teks Sa-Ijaan. Cocok untuk plakat pemerintah daerah.",
  },
  57: {
    name: "Plakat Fiberglass Gunungan Universitas Gadjah Mada",
    shortDescription: "Plakat fiberglass bentuk gunungan dengan logo UGM dan ornamen wayang",
    description: "Plakat fiberglass bentuk gunungan dengan logo UGM dan ornamen wayang. Teks Kenang-Kenangan dari Universitas Gadjah Mada Yogyakarta Tahun 2026. Cocok untuk plakat universitas bergengsi.",
  },
  58: {
    name: "Plakat Resin Patung Ignatius Night Versi 2",
    shortDescription: "Plakat resin bentuk patung Santo Ignatius versi tinggi",
    description: "Plakat resin bentuk patung Santo Ignatius versi tinggi. Teks Ignatius Night 2012 Ite Inflammate Omnia Serikat Jesus Indonesia. Base hitam. Cocok untuk plakat organisasi keagamaan.",
  },
  59: {
    name: "Plakat Fiberglass BPS Kabupaten Sukabumi",
    shortDescription: "Plakat fiberglass modern dengan logo Badan Pusat Statistik Kabupaten Sukabumi",
    description: "Plakat fiberglass modern dengan logo Badan Pusat Statistik Kabupaten Sukabumi. Teks Terima Kasih Kepada Dinas PUTR sebagai Narasumber. Desain modern biru hijau. Cocok untuk plakat instansi pemerintah.",
  },
  60: {
    name: "Plakat Resin Masjid UGM Kenang-Kenangan",
    shortDescription: "Plakat resin dengan miniatur masjid emas dan logo UGM",
    description: "Plakat resin dengan miniatur masjid emas dan logo UGM. Teks Kenang-Kenangan dari Universitas Gadjah Mada Tahun 2026. Base hitam. Cocok untuk plakat universitas dan souvenir.",
  },
  61: {
    name: "Plakat Resin Masjid Kenang-Kenangan Pernikahan",
    shortDescription: "Plakat resin dengan miniatur masjid emas",
    description: "Plakat resin dengan miniatur masjid emas. Teks Anif & Chasan 8 April 2018. Seni Pergaulan. Cocok untuk souvenir pernikahan dan kenang-kenangan spesial.",
  },
  62: {
    name: "Plakat Fiberglass Trophy Sekolah Tionghoa",
    shortDescription: "Plakat fiberglass tinggi dengan logo sekolah Tionghoa",
    description: "Plakat fiberglass tinggi dengan logo sekolah Tionghoa. Teks alumni sekolah Tionghoa dan nama penerima. Base hitam. Cocok untuk plakat alumni sekolah Tionghoa.",
  },
  63: {
    name: "Plakat Resin Bening Bintang Golf BRI",
    shortDescription: "Plakat resin bening bentuk bintang dengan ukiran pemain golf",
    description: "Plakat resin bening bentuk bintang dengan ukiran pemain golf. Teks BRI Golf Tournament. Base hitam. Cocok untuk penghargaan turnamen golf perusahaan.",
  },
  64: {
    name: "Plakat Resin Universitas Lampung FEB",
    shortDescription: "Plakat resin bening dengan logo Universitas Lampung",
    description: "Plakat resin bening dengan logo Universitas Lampung. Teks Kenang-Kenangan Fakultas Ekonomi dan Bisnis Universitas Lampung. Base emas. Cocok untuk plakat universitas.",
  },
  65: {
    name: "Plakat Resin Bening Thank You Kesatuan Bangsa",
    shortDescription: "Plakat resin bening oktagonal dengan logo Kesatuan Bangsa Bilingual Boarding School",
    description: "Plakat resin bening oktagonal dengan logo Kesatuan Bangsa Bilingual Boarding School Yogyakarta. Teks Thank You Yaris Shidiq Zamroni S.Pd. Cocok untuk penghargaan pendidikan.",
  },
  66: {
    name: "Plakat Fiberglass Pertamina DWTF6 2018",
    shortDescription: "Plakat fiberglass modern dengan logo DWTF6 Drilling Workover Technology Forum 2018",
    description: "Plakat fiberglass modern dengan logo DWTF6 Drilling Workover Technology Forum 2018 Pertamina. Teks Inspiring People for Drilling Operation Excellence. Cocok untuk penghargaan industri migas.",
  },
  67: {
    name: "Plakat Resin Bening Pertamina Best Partner 2024",
    shortDescription: "Plakat resin bening berbentuk berlian dengan logo Pertamina",
    description: "Plakat resin bening berbentuk berlian dengan logo Pertamina. Teks Best Partner Award untuk PT. Energi Maju Bersama. Base hitam. Cocok untuk corporate award.",
  },
  68: {
    name: "Plakat Fiberglass Putra Putri Kebudayaan Balikpapan 2",
    shortDescription: "Plakat fiberglass bundar untuk kontes kebudayaan",
    description: "Plakat fiberglass bundar untuk kontes kebudayaan. Teks Kami Berbudayaan Harapan I Putri Kebudayaan Kota Balikpapan 2022. Base merah. Cocok untuk penghargaan budaya.",
  },
  69: {
    name: "Plakat Resin Universitas Hasanuddin Fakultas",
    shortDescription: "Plakat resin biru bermotif dengan logo Universitas Hasanuddin",
    description: "Plakat resin biru bermotif dengan logo Universitas Hasanuddin. Teks Fakultas Ilmu Kelautan dan Perikanan. Cocok untuk plakat universitas dan fakultas.",
  },
  70: {
    name: "Plakat Resin Bening IAIM Lampung Versi 2",
    shortDescription: "Plakat resin bening dengan logo hijau Institut Agama Islam Ma'arif NU IAIM Lampung Metro",
    description: "Plakat resin bening dengan logo hijau Institut Agama Islam Ma'arif NU IAIM Lampung Metro. Teks Kenang-Kenangan Institut Agama Islam. Base trapesium. Cocok untuk plakat institusi pendidikan Islam.",
  },
  71: {
    name: "Plakat Fiberglass Hexagonal TPO Talent Performance",
    shortDescription: "Plakat fiberglass hexagonal dengan logo TPO",
    description: "Plakat fiberglass hexagonal dengan logo TPO. Teks Thank You for Participating in TPO Talent Performance Semester Meeting 2019 MPS Sidomukti. Cocok untuk corporate appreciation.",
  },
  72: {
    name: "Plakat Resin Emas DPRD Kota Bontang",
    shortDescription: "Plakat resin emas dengan logo Kota Bontang dan gambar gedung DPRD",
    description: "Plakat resin emas dengan logo Kota Bontang dan gambar gedung DPRD. Teks Kenang-Kenangan dari Sekretariat DPRD Kota Bontang. Base hitam. Cocok untuk plakat pemerintah daerah.",
  },
  73: {
    name: "Plakat Fiberglass Bolpoin Guru Favorit Musi Rawas",
    shortDescription: "Plakat fiberglass bentuk bolpoin dengan teks Mari Membalas Jasa Guru",
    description: "Plakat fiberglass bentuk bolpoin dengan teks Mari Membalas Jasa Guru. Teks Juara 1 Guru Favorit Tingkat SD/MI Se-Kabupaten Musi Rawas Tahun 2021. Cocok untuk penghargaan pendidikan.",
  },
  74: {
    name: "Plakat Resin Foto Welcome Game Gubernur Akmil",
    shortDescription: "Plakat resin dengan foto dan bola golf",
    description: "Plakat resin dengan foto dan bola golf. Teks Welcome Game Gubernur Akmil Th. 2018. Base coklat. Cocok untuk kenang-kenangan event olahraga militer.",
  },
  75: {
    name: "Plakat Resin Box Batik Danamon Gubernur",
    shortDescription: "Plakat resin dengan box batik untuk Bank Danamon",
    description: "Plakat resin dengan box batik untuk Bank Danamon. Teks Terima Kasih Gubernur AAU Adisucipto Atas Dukungannya. Cocok untuk corporate appreciation dan kenang-kenangan.",
  },
  76: {
    name: "Plakat Resin SMK Nitro Muhammadiyah Makassar",
    shortDescription: "Plakat resin bening dengan logo SMK Nitro Muhammadiyah Makassar",
    description: "Plakat resin bening dengan logo SMK Nitro Muhammadiyah Makassar. Teks Nitro Pilihan Cerdas Keuangan dan Perbankan. Cocok untuk plakat sekolah.",
  },
  77: {
    name: "Plakat Resin Bening Diamond Global Unichp",
    shortDescription: "Plakat resin bening bentuk berlian dengan logo Global Unichp Corporation",
    description: "Plakat resin bening bentuk berlian dengan logo Global Unichp Corporation. Teks Penghargaan Layanan Terbaik Mark Liu. Cocok untuk corporate award internasional.",
  },
  78: {
    name: "Plakat Resin Reel Film Motion Picture Sound Editors",
    shortDescription: "Plakat resin bentuk reel film dengan logo Motion Picture Sound Editors",
    description: "Plakat resin bentuk reel film dengan logo Motion Picture Sound Editors. Teks Career Achievement Award Walter Murch. Cocok untuk penghargaan perfilman internasional.",
  },
  79: {
    name: "Plakat Resin ZMA Realtor of the Year",
    shortDescription: "Plakat resin modern dengan efek api dan logo ZMA",
    description: "Plakat resin modern dengan efek api dan logo ZMA. Teks Realtor of the Year 2019 Nikolai Manotme. Cocok untuk penghargaan properti dan real estate.",
  },
  80: {
    name: "Plakat Resin Gunungan Pertamina DPPU",
    shortDescription: "Plakat resin bentuk gunungan dengan logo Pertamina Energi Untuk Negeri",
    description: "Plakat resin bentuk gunungan dengan logo Pertamina Energi Untuk Negeri. Teks Penghargaan Kategori DPPU dengan Gain Loss Terendah Corporate OPR Service IV 2019. Cocok untuk penghargaan industri migas.",
  },
  81: {
    name: "Plakat Resin Bening Biru Penghargaan Penerbangan",
    shortDescription: "Plakat resin bening bentuk kristal biru dengan logo Desert Aviation",
    description: "Plakat resin bening bentuk kristal biru dengan logo Desert Aviation. Teks Penghargaan Penerbangan Terbaik John Taylor. Cocok untuk penghargaan industri penerbangan.",
  },
  82: {
    name: "Plakat Resin Biru KTT Air Global R&D Emas",
    shortDescription: "Plakat resin biru dengan medali emas",
    description: "Plakat resin biru dengan medali emas. Teks Desalinasi R&D Emas KTT Air Global. Cocok untuk penghargaan riset dan pengembangan lingkungan hidup.",
  },
  83: {
    name: "Plakat Resin Bening Diamond BPO Summit Bangladesh",
    shortDescription: "Plakat resin bening bentuk berlian dengan logo BPO Summit Bangladesh 2018",
    description: "Plakat resin bening bentuk berlian dengan logo BPO Summit Bangladesh 2018. Teks Penghargaan dan Ucapan Terima Kasih Zunaid Ahmed Palak MP. Cocok untuk penghargaan konferensi internasional.",
  },
  84: {
    name: "Plakat Resin Merah Diamond 5CNew",
    shortDescription: "Plakat resin merah bentuk kristal dengan teks Penghargaan Merek 2019 Pemenang 5CNew Diamond",
    description: "Plakat resin merah bentuk kristal dengan teks Penghargaan Merek 2019 Pemenang 5CNew Diamond. Base hitam. Cocok untuk penghargaan merek dan brand.",
  },
  85: {
    name: "Plakat Resin Perisai Sekolah Tinggi Pertanian Muhammadiyah",
    shortDescription: "Plakat resin bentuk perisai dengan logo Sekolah Tinggi Ilmu Pertanian Muhammadiyah",
    description: "Plakat resin bentuk perisai dengan logo Sekolah Tinggi Ilmu Pertanian Muhammadiyah Tanah Grogot. Teks Kenang-Kenangan Kampus. Base hitam. Cocok untuk plakat institusi pendidikan.",
  },
  86: {
    name: "Plakat Fiberglass Olahraga Prestasi Kaltim",
    shortDescription: "Plakat fiberglass dengan gambar olahragawan dan jam",
    description: "Plakat fiberglass dengan gambar olahragawan dan jam. Teks Olahraga Nomor Satu Akademik Tetap Unggul Pertama Pemerintah Provinsi Kalimantan Timur. Base hitam. Cocok untuk penghargaan olahraga daerah.",
  },
  87: {
    name: "Plakat Resin Serikat Pekerja Nusantara",
    shortDescription: "Plakat resin dengan logo Serikat Pekerja Nusantara SPN",
    description: "Plakat resin dengan logo Serikat Pekerja Nusantara SPN. Teks SPN PT. Solusi Bangun Indonesia Tbk. Base hitam. Cocok untuk plakat serikat pekerja.",
  },
  88: {
    name: "Plakat Resin Shafira Tour Travel 19 Years Anniversary",
    shortDescription: "Plakat resin dengan logo Shafira Tour & Travel",
    description: "Plakat resin dengan logo Shafira Tour & Travel. Teks 19 Years Anniversary Best Supportive Agent. Cocok untuk penghargaan perusahaan travel dan pariwisata.",
  },
  89: {
    name: "Plakat Resin DPRD Kabupaten Luwu Utara",
    shortDescription: "Plakat resin dengan logo DPRD Kabupaten Luwu Utara Provinsi Sulawesi Selatan",
    description: "Plakat resin dengan logo DPRD Kabupaten Luwu Utara Provinsi Sulawesi Selatan. Teks Bersama Membangun Daerah Untuk Kemajuan Bersama. Base hitam. Cocok untuk plakat legislatif daerah.",
  },
  90: {
    name: "Plakat Fiberglass Karyamedia Souvenir Apresiasi",
    shortDescription: "Plakat fiberglass modern bentuk api merah putih dengan logo Karyamedia Souvenir",
    description: "Plakat fiberglass modern bentuk api merah putih dengan logo Karyamedia Souvenir. Teks Penghargaan Prestasi Apresiasi untuk Dedikasi dan Inovasi. Base bening. Contoh plakat buatan Karyamedia.",
  },
  91: {
    name: "Plakat Resin Bening KPU Kabupaten Bontang",
    shortDescription: "Plakat resin bening dengan logo Komisi Pemilihan Umum",
    description: "Plakat resin bening dengan logo Komisi Pemilihan Umum. Teks Komisi Pemilihan Umum Kabupaten Bontang Atas Partisipasi dalam Menyukseskan Pemilihan Umum Tahun 2024. Cocok untuk penghargaan demokrasi.",
  },
  92: {
    name: "Plakat Fiberglass Gunungan Festival Dalang Anak",
    shortDescription: "Plakat fiberglass bentuk gunungan dengan ornamen wayang",
    description: "Plakat fiberglass bentuk gunungan dengan ornamen wayang. Teks Festival Dalang Anak Nasional Tahun 2023 Juara 1 Kelompok Umur 12-15 Tahun PEPADI Pusat. Base hitam. Cocok untuk penghargaan seni budaya.",
  },
  93: {
    name: "Plakat Resin BSI Bank Syariah Indonesia",
    shortDescription: "Plakat resin dengan bentuk gedung dan logo BSI Bank Syariah Indonesia",
    description: "Plakat resin dengan bentuk gedung dan logo BSI Bank Syariah Indonesia. Teks Bertransformasi menjadi Bank Syariah terbesar di Indonesia. Base hitam. Cocok untuk corporate souvenir bank syariah.",
  },
  94: {
    name: "Plakat Resin Gunungan Emas Ukiran Islam",
    shortDescription: "Plakat resin bentuk gunungan dengan ukiran emas ornamen Islam",
    description: "Plakat resin bentuk gunungan dengan ukiran emas ornamen Islam. Base biru. Cocok untuk plakat lembaga Islam dan penghargaan keagamaan.",
  },
  95: {
    name: "Plakat Resin Bening Friendship Golf Tournament",
    shortDescription: "Plakat resin bening dengan ukiran pemain golf",
    description: "Plakat resin bening dengan ukiran pemain golf. Teks Friendship Golf Tournament Pamitran BRI Golf Club Yogyakarta Sponsor by Randi Anto Dirut Jamkrindo. Base biru kristal. Cocok untuk penghargaan golf.",
  },
  96: {
    name: "Plakat Resin Bening Provinsi Kepulauan Riau",
    shortDescription: "Plakat resin bening bentuk daun dengan logo Provinsi Kepulauan Riau",
    description: "Plakat resin bening bentuk daun dengan logo Provinsi Kepulauan Riau. Teks Tingkat Provinsi Kepulauan Riau Tahun 2017 Dinas Perindustrian Perdagangan Kabupaten Lingga. Base hitam. Cocok untuk plakat provinsi.",
  },
  97: {
    name: "Plakat Resin Gapensi Wonosobo Muscab",
    shortDescription: "Plakat resin dengan logo Gapensi dan teks Terima Kasih",
    description: "Plakat resin dengan logo Gapensi dan teks Terima Kasih atas Dukungan Mensukseskan Muscab IX 2017 Gapensi Kabupaten Wonosobo. Base kayu. Cocok untuk plakat organisasi profesi.",
  },
  98: {
    name: "Plakat Resin KMS-PRO Wonosobo",
    shortDescription: "Plakat resin dengan logo KMS-PRO dan teks Berkontribusi untuk Kesejahteraan",
    description: "Plakat resin dengan logo KMS-PRO dan teks Berkontribusi untuk Kesejahteraan Kelurahan Demangan sebagai Wakil Rayon Wonosobo yang Mandiri Berkarya Optimis dan Maju. Base hitam. Cocok untuk plakat kontribusi daerah.",
  },
  99: {
    name: "Plakat Fiberglass Juara II FLS2N Film Pendek DIY",
    shortDescription: "Plakat fiberglass dengan teks Juara II FLS2N Cabang Seni Film Pendek",
    description: "Plakat fiberglass dengan teks Juara II FLS2N Cabang Seni Film Pendek Daerah Istimewa Yogyakarta Tahun 2014. Cocok untuk penghargaan seni dan pendidikan.",
  },
  100: {
    name: "Plakat Resin Borobudur Temple",
    shortDescription: "Plakat resin dengan miniatur Candi Borobudur dalam piramida",
    description: "Plakat resin dengan miniatur Candi Borobudur dalam piramida merah. Base hitam. Cocok untuk souvenir wisata dan kenang-kenangan budaya.",
  },
}

let fixCount = 0

for (const product of data) {
  if (!product.code?.startsWith("KMS-PF-")) continue

  const num = parseInt(product.code.replace("KMS-PF-", ""), 10)
  if (num < 40 || num > 100) continue

  // Extract image number from slug
  const slugMatch = product.slug?.match(/plakat-fiberglass-(\d+)/)
  if (!slugMatch) continue
  const imgNum = parseInt(slugMatch[1], 10)

  const fix = fixMap[imgNum]
  if (!fix) continue

  // Check if current name doesn't match
  if (product.name !== fix.name) {
    console.log(`[${product.code}] slug=${imgNum}`)
    console.log(`  OLD: ${product.name}`)
    console.log(`  NEW: ${fix.name}`)
    product.name = fix.name
    product.shortDescription = fix.shortDescription
    product.description = fix.description
    fixCount++
  }
}

console.log(`\nTotal fixes: ${fixCount}`)

writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf-8")
console.log("File updated successfully!")
