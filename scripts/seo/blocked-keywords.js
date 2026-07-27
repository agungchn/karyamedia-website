// Blocked keywords per hari untuk menghindari duplikasi
// Task 10:00 WIB = priority keywords (plakat batas wilayah) — Senin, Rabu, Jumat
// Task 20:00 WIB = general keywords (GSC + Suggest) — EXCLUDE yang ada di 10:00

export const BLOCKED_PER_HARI = {
  Senin: [
    "plakat batas",
    "plakat BM",
    "plakat CP",
    "plakat bench mark",
    "plakat center point",
    "plakat bancmark",
    "plakat peresmian gedung",
    "plakat patok",
    "plakat batas wilayah custom",
    "plakat batas wilayah logam",
    "plakat batas wilayah premium",
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
    "plakat batas",
    "plakat BM",
    "plakat CP",
    "plakat bench mark",
    "plakat center point",
    "plakat bancmark",
    "plakat peresmian gedung",
    "plakat patok",
    "plakat batas wilayah custom",
    "plakat batas wilayah logam",
    "plakat batas wilayah premium",
  ],
  Kamis: [], // Tidak ada manual schedule 10:00 — kosongkan
  Jumat: [
    "plakat batas",
    "plakat BM",
    "plakat CP",
    "plakat bench mark",
    "plakat center point",
    "plakat bancmark",
    "plakat peresmian gedung",
    "plakat patok",
    "plakat batas wilayah custom",
    "plakat batas wilayah logam",
    "plakat batas wilayah premium",
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
