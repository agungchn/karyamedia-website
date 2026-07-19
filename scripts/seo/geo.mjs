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
  {
    key: "pemerintahan",
    label: "pemerintahan",
    ctx:
      "pemerintah daerah, OPD, dinas, lembaga negara (legislatif DPR/DPRD, yudikatif/pengadilan/MA/MK, kejaksaan), TNI, POLRI, PNS (pegawai negeri sipil), guru, hakim, serta pejabat negara: presiden, gubernur, walikota, bupati, camat, lurah, dan Trias Politika",
  },
  {
    key: "kampus",
    label: "kampus",
    ctx:
      "universitas, perguruan tinggi, rektorat, fakultas, ormawa, serta sekolah negeri & swasta (SD/SMP/SMA) dan pondok pesantren",
  },
  {
    key: "eo",
    label: "event organizer",
    ctx: "event organizer, panitia acara, komite kompetisi, dan wedding organizer",
  },
  {
    key: "komunitas",
    label: "komunitas",
    ctx:
      "komunitas, karang taruna, almamater, klub, serta individu (KKN, PPL, seminar, dies natalis, wedding award)",
  },
]

// Produk dipilih agar cocok dengan inferCategory() di article-generate.mjs
// (plakat -> Plakat, medali -> Medali, piala -> Piala & Trophy, dst).
export const PRODUCTS = [
  { phrase: "plakat penghargaan", category: "Plakat" },
  { phrase: "plakat akrilik", category: "Plakat" },
  { phrase: "plakat resin", category: "Plakat" },
  { phrase: "plakat kayu", category: "Plakat" },
  { phrase: "plakat marmer", category: "Plakat" },
  { phrase: "plakat fiberglass", category: "Plakat" },
  { phrase: "plakat wayang", category: "Plakat" },
  { phrase: "medali custom", category: "Medali" },
  { phrase: "medali emas", category: "Medali" },
  { phrase: "piala trophy", category: "Piala & Trophy" },
  { phrase: "piala resin", category: "Piala & Trophy" },
  { phrase: "prasasti marmer", category: "Prasasti" },
  { phrase: "prasasti kuningan", category: "Prasasti" },
  { phrase: "gift box souvenir", category: "Gift Box" },
  { phrase: "nama dada akrilik", category: "Accessories" },
  { phrase: "nama dada PNS", category: "Accessories" },
  { phrase: "nama dada guru", category: "Accessories" },
  { phrase: "nama dada TNI", category: "Accessories" },
  { phrase: "nama dada POLRI", category: "Accessories" },
  { phrase: "nama dada DPRD", category: "Accessories" },
  { phrase: "nama dada kejaksaan", category: "Accessories" },
  { phrase: "nama dada hakim", category: "Accessories" },
  { phrase: "papan nama dada pejabat", category: "Accessories" },
  { phrase: "pin bross PNS", category: "Accessories" },
  { phrase: "pin bross guru", category: "Accessories" },
  { phrase: "pin bross TNI", category: "Accessories" },
  { phrase: "pin bross POLRI", category: "Accessories" },
  { phrase: "pin bross DPRD", category: "Accessories" },
  { phrase: "pin bross kejaksaan", category: "Accessories" },
  { phrase: "pin bross hakim", category: "Accessories" },
  { phrase: "pin bross ASN", category: "Accessories" },
  { phrase: "souvenir wisuda", category: "Souvenir Wisuda" },
  { phrase: "samir wisuda", category: "Souvenir Wisuda" },
  { phrase: "map ijazah", category: "Souvenir Wisuda" },
  { phrase: "patung wisuda", category: "Souvenir Wisuda" },
  { phrase: "kalung rektor", category: "Souvenir Wisuda" },
  { phrase: "tongkat rektor", category: "Souvenir Wisuda" },
  { phrase: "tabung wisuda", category: "Souvenir Wisuda" },
  { phrase: "toga wisuda", category: "Souvenir Wisuda" },
  { phrase: "gordon wisuda", category: "Souvenir Wisuda" },
]

// Medali dengan angle buyer-intent spesifik & konteks acara/lembaga NYATA di
// Indonesia. Ini SEARCH INTENT berbeda dari "medali custom" sehingga artikelnya
// distinct (lolos gate duplikat 90% karena token beda) DAN jauh lebih berbobot:
// tiap frasa memberi LLM konteks konkret (event sekolah, keagamaan, kemerdekaan,
// pramuka, wisuda) sehingga isi artikel kaya, bukan sekadar ganti nama provinsi.
// Dipasangkan langsung dengan provinsi (tanpa segmen) agar frasa natural:
// "medali O2SN Aceh", "medali HUT RI Yogyakarta", "medali pramuka Bali".
export const MEDALI_INTENTS = [
  { phrase: "medali kejuaraan", category: "Medali" },
  { phrase: "medali penghargaan", category: "Medali" },
  { phrase: "medali lomba", category: "Medali" },
  { phrase: "medali kelulusan", category: "Medali" },
  { phrase: "medali olahraga", category: "Medali" },
  { phrase: "medali turnamen", category: "Medali" },
  { phrase: "medali juara", category: "Medali" },
  { phrase: "medali wisuda", category: "Medali" },
  { phrase: "medali O2SN", category: "Medali" },
  { phrase: "medali OSN", category: "Medali" },
  { phrase: "medali PORSENI", category: "Medali" },
  { phrase: "medali pramuka", category: "Medali" },
  { phrase: "medali MTQ", category: "Medali" },
  { phrase: "medali HUT RI", category: "Medali" },
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
  // medali intent × provinsi (tanpa segmen, agar frasa natural & beda intent)
  for (const p of PROVINCES) {
    for (const mi of MEDALI_INTENTS) {
      all.push({
        query: `${mi.phrase} ${p.name}`,
        title: `${capitalize(mi.phrase)} ${p.name}`,
        category: mi.category,
        province: p.name,
        segment: "medali-intent",
        location: p.name,
      })
    }
  }
  const seeded = all.map((t) => ({ ...t, _score: hashStr(dayKey + "::" + t.query) }))
  seeded.sort((a, b) => b._score - a._score)
  return seeded
}
