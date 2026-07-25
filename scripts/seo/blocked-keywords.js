// Blocked keywords per hari untuk menghindari duplikasi
// Task 10:00 WIB = priority keywords (manual schedule)
// Task 20:00 WIB = general keywords (GSC + Suggest) - EXCLUDE yang ada di 10:00

export const BLOCKED_PER_HARI = {
  Senin: [
    "plakat batas wilayah",
    "plakat BM",
    "plakat CP",
    "plakat bench mark",
    "plakat center point",
    "plakat bancmark",
    "plakat batas desa",
    "plakat batas kecamatan",
    "plakat batas kabupaten",
    "plakat batas provinsi",
  ],
  Selasa: [
    "nama dada",
    "papan nama dada",
    "name tag",
    "name tag custom",
    "papan nama",
    "name tag kayu",
    "name tag logam",
    "name tag akrilik",
    "name tag magnet",
    "name tag pin",
  ],
  Rabu: [
    "pin",
    "bross",
    "pin custom",
    "bross custom",
    "pin logam",
    "bross logam",
    "pin enamel",
    "bross enamel",
    "pin badge",
    "bross badge",
  ],
  Kamis: [
    "plakat batas wilayah",
    "plakat BM",
    "plakat CP",
    "plakat bench mark",
    "plakat center point",
    "plakat bancmark",
  ],
  Jumat: [
    "gantungan kunci",
    "gantungan kunci custom",
    "gantungan kunci logam",
    "gantungan kunci kayu",
    "gantungan kunci akrilik",
    "gantungan kunci plastik",
    "gantungan kunci kulit",
    "gantungan kunci resin",
  ],
  Sabtu: [
    "medali",
    "medali custom",
    "medali logam",
    "medali emas",
    "medali perak",
    "medali perunggu",
    "medali olahraga",
    "medali lomba",
  ],
  Minggu: [], // Tidak ada manual schedule
}

// Helper function untuk cek apakah keyword blocked
export function isBlocked(keyword, hari) {
  const blocked = BLOCKED_PER_HARI[hari] || []
  const kw = keyword.toLowerCase()
  
  // Cek exact match atau partial match
  return blocked.some(b => kw.includes(b.toLowerCase()))
}
