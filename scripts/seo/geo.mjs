// Province × segment × product matrix for geographically-distributed content.
//
// Karyamedia berbasis Yogyakarta (produsen langsung / pabrik sejak 2001) namun
// melayani SELURUH Indonesia. Generator menargetkan semua provinsi & segmen
// secara setara agar tidak lagi Jogja-centric. Ketika GSC/Bing belum punya data
// (kasus sekarang), pool ini menjadi sumber topik utama.
//
// Setiap kombinasi provinsi × segmen × produk menghasilkan 1 topik unik;
// rotasi berbasis tanggal memastikan tiap hari menyebar ke provinsi/segmen
// berbeda (bukan numpuk di satu provinsi), dan topik yang sudah jadi artikel
// otomatis gugur via nearDup di ideas.mjs.

export const PROVINCES = [
  "Aceh", "Sumatra Utara", "Sumatra Barat", "Riau", "Kepulauan Riau", "Jambi",
  "Sumatra Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung", "Banten",
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Bali",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
  "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara",
  "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo",
  "Sulawesi Barat", "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Tengah",
  "Papua Pegunungan", "Papua Selatan", "Papua Barat Daya",
].map((name) => {
  const slug = name
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return { name, slug }
})

export const SEGMENTS = [
  { key: "pemerintahan", label: "pemerintahan", ctx: "pemerintah daerah, OPD, dinas, dan lembaga pemerintahan" },
  { key: "kampus", label: "kampus", ctx: "universitas, perguruan tinggi, rektorat, dan organisasi kemahasiswaan" },
  { key: "eo", label: "event organizer", ctx: "event organizer, panitia acara, dan komite kompetisi" },
  { key: "komunitas", label: "komunitas", ctx: "komunitas, karang taruna, almamater, dan klub" },
]

// Produk dipilih agar cocok dengan inferCategory() di article-generate.mjs
// (plakat -> Plakat, medali -> Medali, piala -> Piala & Trophy, dst).
export const PRODUCTS = [
  { phrase: "plakat penghargaan", category: "Plakat" },
  { phrase: "plakat akrilik", category: "Plakat" },
  { phrase: "plakat resin", category: "Plakat" },
  { phrase: "medali custom", category: "Medali" },
  { phrase: "medali emas", category: "Medali" },
  { phrase: "piala trophy", category: "Piala & Trophy" },
  { phrase: "piala resin", category: "Piala & Trophy" },
  { phrase: "prasasti marmer", category: "Prasasti" },
  { phrase: "prasasti kuningan", category: "Prasasti" },
  { phrase: "gift box souvenir", category: "Gift Box" },
  { phrase: "name tag akrilik", category: "Accessories" },
  { phrase: "souvenir wisuda", category: "Souvenir Wisuda" },
]

function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function capitalize(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

// Hasilkan topik provinsi × segmen × produk dengan rotasi deterministik
// berbasis tanggal: topik dengan hash(hari + query) tertinggi berada di atas,
// sehingga tiap hari subset berbeda yang mendominasi (terdistribusi merata).
// Setelah sebuah topik dibuat jadi artikel, nearDup di ideas.mjs akan
// menggugurkannya dan provinsi/segmen berikutnya naik.
export function buildTopics(date = new Date()) {
  const dayKey = date.toISOString().slice(0, 10)
  const all = []
  for (const p of PROVINCES) {
    for (const s of SEGMENTS) {
      for (const pr of PRODUCTS) {
        all.push({
          query: `${pr.phrase} untuk ${s.label} ${p.name}`,
          title: `${capitalize(pr.phrase)} ${capitalize(s.label)} ${p.name}`,
          category: pr.category,
          province: p.name,
          segment: s.key,
          location: p.name,
        })
      }
    }
  }
  const seeded = all.map((t) => ({ ...t, _score: hashStr(dayKey + "::" + t.query) }))
  seeded.sort((a, b) => b._score - a._score)
  return seeded
}
