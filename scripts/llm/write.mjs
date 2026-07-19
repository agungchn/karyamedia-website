// LLM prose writer for Karyamedia articles (Google Gemini REST, no SDK).
// Reads the API key from scripts/llm/apikey.txt (gitignored) or env GEMINI_API_KEY.
// Returns { title, description, tags, content } where content is HTML prose
// that (should) already meet the article standard.
//
// Set LLM_MOCK=1 to skip the network call (returns a canned draft) for testing.

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..", "..")

function getGeminiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY
  try {
    return readFileSync(join(here, "apikey.txt"), "utf8").trim()
  } catch {
    return ""
  }
}

function getZenKey() {
  if (process.env.ZEN_API_KEY) return process.env.ZEN_API_KEY
  try {
    return readFileSync(join(here, "zen-key.txt"), "utf8").trim()
  } catch {
    return ""
  }
}

function getAlibabaKey() {
  if (process.env.ALIBABA_API_KEY) return process.env.ALIBABA_API_KEY
  try {
    const txt = readFileSync(join(here, "alibaba cloude.txt"), "utf8")
    const m = txt.match(/api key\s+(\S+)/i)
    return m ? m[1] : ""
  } catch {
    return ""
  }
}
function getAlibabaUrl() {
  if (process.env.ALIBABA_URL) return process.env.ALIBABA_URL
  try {
    const txt = readFileSync(join(here, "alibaba cloude.txt"), "utf8")
    const m = txt.match(/OpenAI Compatible Endpoint\s+(\S+)/)
    return m ? m[1] : "https://ws-tcg785c7rcx4lc75.eu-central-1.maas.aliyuncs.com/compatible-mode/v1"
  } catch {
    return ""
  }
}
function getAlibabaModel() {
  return process.env.ALIBABA_MODEL || "qwen-plus"
}

const GEMINI_MODEL = process.env.GEMINI_MODELS || process.env.GEMINI_MODEL || "gemini-3.5-flash,gemini-flash-latest"
const ZEN_MODEL = process.env.ZEN_MODEL || "mimo-v2.5-free,deepseek-v4-flash-free"
const ZEN_URL = process.env.ZEN_URL || "https://opencode.ai/zen/v1/chat/completions"

const SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    description: { type: "STRING" },
    tags: { type: "ARRAY", items: { type: "STRING" } },
    content: { type: "STRING" },
  },
  required: ["title", "description", "tags", "content"],
}

const MOCK = {
  title: "Draft Mock Plakat Akrilik Custom",
  description:
    "Plakat akrilik custom transparan dan elegan untuk penghargaan kantor, sekolah, dan wisuda. Pesan custom di Karyamedia Jogja.",
  tags: ["plakat", "akrilik", "custom", "jogja", "penghargaan", "wisuda"],
  content:
    '<h2>Pengantar</h2>' +
    '<p>Mock content untuk pengujian pipeline generator artikel otomatis. Plakat akrilik custom menjadi pilihan banyak instansi di Jogja karena tampilannya yang transparan, elegan, dan ringan sehingga mudah dibawa serta dipajang di ruang kerja maupun ruang serbaguna sekolah dan kampus.</p>' +
    '<p>Banyak kantor, sekolah, dan universitas menggunakan plakat ini untuk memberikan apresiasi kepada karyawan berprestasi, siswa berprestasi, maupun wisudawan terbaik. Karyamedia melayani pembuatan plakat akrilik dengan desain sepenuhnya custom sesuai kebutuhan acara Anda agar setiap penghargaan terasa istimewa dan personal.</p>' +
    '<p>Setiap plakat diukir dengan presisi tinggi sehingga nama, jabatan, dan pesan singkat terbaca jelas dari jarak jauh. Hasil akhirnya mengkilap, rapi, dan tahan lama sebagai kenang-kenangan yang membanggakan bagi penerimanya di berbagai momen penting.</p>' +
    '<h2>Keunggulan Material</h2>' +
    '<p>Plakat akrilik transparan dan elegan sangat cocok untuk berbagai kebutuhan penghargaan kantor maupun sekolah karena memberikan kesan modern dan profesional. Material akrilik tidak mudah retak, tahan benturan ringan, dan awet digunakan bertahun-tahun sebagai simbol pencapaian.</p>' +
    '<p>Berbeda dengan plakat berbahan kertas atau kayu murah, plakat akrilik terasa lebih premium di tangan penerima. Pilihan warna backing seperti hitam, biru, atau emas membuatnya cocok untuk beragam tema acara resmi maupun informal tanpa mengurangi keanggunannya.</p>' +
    '<p>Selain estetika, akrilik juga ringan sehingga menghemat biaya kirim ketika pesanan dikirim ke luar kota. Ini menjadikannya solusi ideal untuk instansi dengan cabang di berbagai daerah yang ingin hadiah yang seragam dan berkualitas tinggi.</p>' +
    '<h2>Cara Memilih Ukuran</h2>' +
    '<p>Pertimbangkan ketebalan dan desain ukiran yang paling sesuai dengan acara Anda bersama Karyamedia. Ketebalan 5 mm memberikan kesan solid dan mewah, sedangkan 3 mm sudah cukup untuk plakat massal dengan budget yang lebih tipis namun tetap terlihat rapi.</p>' +
    '<p>Konsultasikan warna logo, ukuran teks, dan orientasi desain sebelum produksi agar hasil maksimal. Tim Karyamedia membantu merancang layout yang seimbang, profesional, dan mudah dibaca sehingga plakat tampil menonjol di atas podium maupun di dinding kantor.</p>' +
    '<p>Untuk acara berskala besar, sebaiknya pesan jauh hari agar proses revisi desain dan produksi massal bisa berjalan lancar tanpa terburu-buru. Perencanaan awal juga membantu menjaga konsistensi warna antar ratusan plakat yang dipesan secara bersamaan.</p>' +
    '<h2>Proses Produksi</h2>' +
    '<p>Setelah desain disetujui, Karyamedia mencetak dan mengukir plakat menggunakan mesin presisi agar hasil konsisten untuk setiap unit. Tahap quality control dilakukan secara teliti agar tidak ada cacat goresan maupun ketidaksejajaran teks pada permukaan akrilik.</p>' +
    '<p>Plakat kemudian dikemas dengan aman menggunakan busa dan kardus khusus agar tetap utuh selama pengiriman. Untuk pesanan mendesak, tim Karyamedia dapat mengatur jadwal produksi prioritas tanpa mengorbankan kualitas akhir yang dijanjikan kepada pelanggan.</p>' +
    '<h2>Perawatan dan Penyimpanan</h2>' +
    '<p>Bersihkan plakat akrilik dengan kain mikrofiber dan cairan lembut agar permukaannya tetap jernih dan tidak buram. Hindari alkohol berbasis kuat yang bisa merusak kilap akrilik dalam jangka panjang serta mengubah warna backing secara perlahan.</p>' +
    '<p>Simpan plakat di tempat yang tidak lembap supaya bahan tetap bening dan tidak berjamur pada sisi belakangnya. Dengan perawatan yang sangat mudah, plakat akrilik menjadi kenang-kenangan yang selalu siap dipamerkan di ruang kerja maupun lemari prestasi sekolah.</p>' +
    '<h2>Rekomendasi Acara dan Event</h2>' +
    '<p>Plakat akrilik custom sangat fleksibel untuk berbagai jenis acara, mulai dari perayaan hari jadi perusahaan, pelepasan karyawan pensiun, apresiasi guru berprestasi, hingga kompetisi olahraga antar instansi. Fleksibilitas desain membuatnya mudah disesuaikan dengan tema dan warna identitas masing-masing organisasi secara konsisten.</p>' +
    '<p>Untuk event tahunan yang rutin digelar, menyimpan template desain di Karyamedia akan mempercepat pemesanan di tahun berikutnya. Hal ini menjaga keseragaman visual antar angkatan atau periode sehingga penghargaan terlihat sebagai satu kesatuan yang profesional dan berkelanjutan dari waktu ke waktu.</p>' +
    '<h2>FAQ</h2>' +
    '<p><strong>Apakah bisa custom?</strong> Ya, sepenuhnya custom sesuai permintaan Anda, termasuk bentuk, warna backing, dan teks yang diinginkan.</p>' +
    '<p><strong>Berapa minimal order?</strong> Tergantung jenis plakat, namun Karyamedia melayani mulai dari jumlah kecil hingga ratusan unit untuk acara besar.</p>' +
    '<p><strong>Apakah ada garansi?</strong> Setiap hasil produksi dicek kualitasnya sebelum pengiriman agar bebas cacat dan sesuai dengan desain yang disetujui.</p>' +
    '<p><strong>Berapa lama pengerjaan?</strong> Waktu pengerjaan bervariasi tergantung jumlah dan kerumitan desain, namun tim selalu menginformasikan estimasi sejak awal pemesanan.</p>',
}

// ---- Template variant (anti-duplikat struktural antar-artikel) ----
function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const TEMPLATE_VARIANTS = [
  {
    name: "checklist",
    angle: "Buka dengan angle praktis: berikan checklist agar pembaca tak salah pesan.",
    headings: [
      "Mengapa {kw} Jadi Pilihan Utama",
      "Checklist Sebelum Memesan",
      "Tips Memilih Desain & Bahan",
      "Estimasi Waktu, Biaya, & Kuantitas",
      "Praktik Terbaik di {loc}",
      "Cara Merawat & Menyimpan",
      "FAQ",
    ],
    emphasis:
      "Sertakan <ul><li> checklist poin-poin praktis. Sebutkan 2-3 produk terkait: piala, medali, prasasti.",
  },
  {
    name: "compare",
    angle: "Buka dengan angle perbandingan material/bahan secara objektif.",
    headings: [
      "Bedah Material {kw}",
      "Akrilik vs Resin vs Kayu: Mana yang Tepat",
      "Kapan Memilih Satu atau Lainnya",
      "Standar Kualitas & Finishing Karyamedia",
      "Contoh Pemakaian di {loc}",
      "Tips Membandingkan Penawaran Vendor",
      "FAQ",
    ],
    emphasis:
      "Sertakan <table> perbandingan (kolom: aspek, opsi A, opsi B) bila relevan. Sebutkan 2-3 produk: prasasti, gift box, souvenir wisuda.",
  },
  {
    name: "casestudy",
    angle: "Buka dengan narasi studi kasus / kebutuhan instansi nyata di {loc}.",
    headings: [
      "Cerita Kebutuhan di {loc}",
      "Tantangan Segmen Ini",
      "Solusi Custom dari Karyamedia",
      "Detail Produksi & Finishing",
      "Nilai bagi Penerima Penghargaan",
      "Pelajaran untuk Event Berikutnya",
      "FAQ",
    ],
    emphasis:
      "Gunakan narasi contoh kasus spesifik & konkret. Sebutkan 2-3 produk: nama dada, plakat, medali.",
  },
  {
    name: "mythbuster",
    angle: "Buka dengan membongkar mitos umum seputar {kw} lalu beri faktanya.",
    headings: [
      "Mitos & Fakta Seputar {kw}",
      "Fakta di Balik Harga & Kualitas",
      "Cara Kerja Produsen Langsung",
      "Tips agar Hasil Maksimal",
      "Praktik Umum di {loc}",
      "Kesalahan yang Sering Terjadi",
      "FAQ",
    ],
    emphasis:
      "Sertakan <ul><li> mitos vs fakta. Sebutkan 2-3 produk: piala, prasasti, gift box.",
  },
  {
    name: "timeline",
    angle: "Buka dengan alur/timeline produksi dari order hingga kirim.",
    headings: [
      "Alur Pembuatan {kw}",
      "Tahap Desain & Persetujuan",
      "Tahap Produksi & Quality Control",
      "Pengemasan & Pengiriman ke {loc}",
      "Tips Menjaga Konsistensi Massal",
      "Evaluasi Setelah Acara",
      "FAQ",
    ],
    emphasis:
      "Sertakan urutan tahapan (bisa <ol><li>). Sebutkan 2-3 produk: medali, nama dada, souvenir wisuda.",
  },
  {
    name: "budget",
    angle: "Buka dengan angle pertimbangan anggaran & value bagi pengadaan.",
    headings: [
      "Menghitung Value {kw}",
      "Faktor yang Mempengaruhi Harga",
      "Hemat dengan Produsen Langsung",
      "Opsi untuk Event Skala Besar",
      "Pengalaman Pengadaan di {loc}",
      "Strategi Anggaran & Timeline",
      "FAQ",
    ],
    emphasis:
      "Sertakan angka 'mulai dari' & range harga bila relevan. Sebutkan 2-3 produk: piala, medali, prasasti.",
    },
  {
    name: "trends",
    angle: "Buka dengan tren & inovasi terkini di industri {kw}.",
    headings: [
      "Tren Terkini {kw} di Indonesia",
      "Inovasi Bahan & Finishing",
      "Yang Diincar Pasar Sekarang",
      "Prediksi Ke Depan",
      "Adopsi di {loc}",
      "Cara Ikut Tren Tanpa Berlebihan",
      "FAQ",
    ],
    emphasis:
      "Sertakan poin tren konkret & data bila ada. Sebutkan 2-3 produk: gift box, nama dada, souvenir wisuda.",
  },
  {
    name: "decision",
    angle: "Buka dengan panduan keputusan: kapan {kw} tepat untuk Anda.",
    headings: [
      "Apakah {kw} Tepat untuk Anda?",
      "Pilih Berdasarkan Tujuan",
      "Skala & Anggaran yang Cocok",
      "Red Flags Saat Memesan",
      "Konteks di {loc}",
      "Langkah Selanjutnya",
      "FAQ",
    ],
    emphasis:
      "Gunakan nada panduan keputusan praktis. Sebutkan 2-3 produk: piala, plakat, medali.",
  },
  {
    name: "local",
    angle: "Buka dengan spotlight kebutuhan komunitas/lokal spesifik di {loc}.",
    headings: [
      "Potret Kebutuhan di {loc}",
      "Komunitas & Event Lokal",
      "Solusi yang Paling Diminati",
      "Cerita Pengadaan Kecil",
      "Tips Khusus Wilayah Ini",
      "Merawat Hasil Jangka Panjang",
      "FAQ",
    ],
    emphasis:
      "Fokus narasi lokal & komunitas spesifik. Sebutkan 2-3 produk: prasasti, gift box, souvenir wisuda.",
  },
]

export const ARTICLE_TEMPLATE_VARIANT_COUNT = TEMPLATE_VARIANTS.length

function resolveVariant(variant, keyword) {
  const n = TEMPLATE_VARIANTS.length
  if (typeof variant === "number" && Number.isFinite(variant)) {
    return TEMPLATE_VARIANTS[((variant % n) + n) % n]
  }
  if (variant && Array.isArray(variant.headings)) return variant
  return TEMPLATE_VARIANTS[hashStr(keyword || "") % n]
}

function variantBlock(variant, keyword, loc) {
  const place = (s) => String(s).replace(/\{kw\}/g, keyword || "").replace(/\{loc\}/g, loc || "seluruh Indonesia")
  const headings = variant.headings.map(place)
  return (
    `\n\nSTRUKTUR & SUDUT PANDANG ARTIKEL (wajib diikuti, dari atas ke bawah):\n` +
    headings.map((h, i) => `${i + 1}. <h2>${h}</h2>`).join("\n") +
    `\nSudut pandang pembuka: ${place(variant.angle)}` +
    `\nPenekanan isi: ${place(variant.emphasis)}` +
    `\nKEKHUSUSAN (wajib agar tidak mirip artikel umum): sebutkan MINIMAL 3 konteks spesifik untuk ${place("{loc}")} ` +
    `(mis. kategori instansi, kampus, komunitas, atau event lokal di wilayah tersebut) dan MINIMAL 2 spesifikasi teknis produk ` +
    `(ukuran dalam mm, jenis bahan, atau jenis finishing). Gunakan istilah & contoh yang se-spesifik mungkin pada topik ini.`
  )
}

const VARIATION_INSTR = `
VARIASI GAYA PENULISAN (WAJIB agar tidak terasa template/assembly-line):
- Pembuka BERVARIASI antar-artikel: jangan selalu buka dengan pola "Banyak [segmen] di [loc] yang masih ragu...". Gilir gaya pembuka, mis. pertanyaan retoris, fakta/angka mengejutkan, adegan/lokasi lokal spesifik, pain-point konkret, atau anekdot singkat.
- Keyword utama TETAP harus muncul utuh di 240 karakter PERTAMA (syarat SEO), tapi cara menyisipkannya boleh bervariasi (tidak harus persis di kalimat pertama).
- Bukti perusahaan (Karyamedia sejak 2001, Yogyakarta, produsen langsung) dirajut SECARA ALAMI & dengan DIKSI BERBEDA tiap artikel — jangan salin kalimat persis yang dipakai di artikel lain.
- Rotasi contoh & produk terkait: jangan selalu sebut urutan produk yang sama; variasikan contoh kasus & nama produk yang memimpin tiap section.
- Variasikan ritme kalimat (pendek–panjang) dan hindari frasa klise berulang ("tentu saja", "dapat diandalkan", "terpercaya") dalam artikel yang sama.
- Tujuannya: tiap artikel terasa ditulis oleh penulis manusia dengan sudut pandang unik, bukan konten seragam.`

function buildPrompt({ keyword, category, location = null, segment = null, segmentCtx = null, variant = null, extra = "" }) {
  const loc = location || "seluruh Indonesia"
  const seg = segment || "instansi, kampus, dan event"
  const segCtxTxt = segmentCtx ? ` (mis. ${segmentCtx})` : ""
  const vBlock = variantBlock(resolveVariant(variant, keyword), keyword, loc)
  return `Tulis artikel SEO berbahasa Indonesia, 100% orisinal (jangan kutip/meniru teks pihak ketiga mana pun), untuk bisnis "Karyamedia" (produsen souvenir & custom manufacturing berbasis Yogyakarta sejak 2001 yang melayani seluruh Indonesia, termasuk ${loc}).

Keyword utama: "${keyword}"
Kategori: ${category}
Segmen target: ${seg}${segCtxTxt}; gunakan contoh kasus, narasi, kebutuhan, dan kata kunci long-tail yang relevan dengan ${loc} serta segmen tersebut secara natural; jangan ubah fakta bahwa Karyamedia berbasis Yogyakarta.

Buat objek JSON dengan field berikut:
- "title": judul artikel, MAKSIMAL 60 karakter, HARUS mengandung keyword utama secara utuh (contoh: jika keyword "plakat akrilik custom" maka title mengandung frasa tersebut). GUNAKAN HURUF KAPITAL AWAL (Title Case), contoh: "Plakat Akrilik Custom untuk Kantor Desa: Solusi Presisi" — jangan seluruhnya huruf kecil.
- "description": meta description, 120-160 karakter, mengandung keyword utama.
- "tags": array 4-6 kata kunci Indonesia relevan (semua lowercase); tags[0] HARUS sama dengan keyword utama.
- "content": artikel lengkap dalam bentuk HTML (string tunggal). Syarat content:
  * minimal 800 kata (wajib >=800 agar lolos standar)
  * minimal 4 heading <h2> (pakai tag <h2>...</h2>)
  * 240 karakter PERTAMA konten (paragraf pembuka) HARUS mengandung keyword utama secara utuh
   * sebutkan nama produk/kategori terkait (plakat, piala, medali, prasasti, gift box, souvenir wisuda, nama dada, dll) SECARA NATURAL di paragraf pembuka/awal artikel, agar tautan ke katalog produk otomatis bisa disematkan di bagian atas
  * JANGAN menyebut/mempromosikan produk yang TIDAK KAMI jual: banner, spanduk, stiker, undangan, kartu nama, seragam, kaos, topi, mug, gelas, tas, goodie bag, standing banner, backdrop, poster, flyer, kalender, mpls, ospek, boneka, blind box, pokemon, kartu ucapan souvenir pernikahan, souvenir pernikahan bermanfaat, gambar gantungan kunci, kerajaan majapahit, ucapan souvenir pernikahan, bahan gantungan kunci, souvenir pernikahan murah, membuat gantungan kunci, kartu souvenir pernikahan, tas souvenir pernikahan, buat gantungan kunci, souvenir pernikahan yang bermanfaat
  * JANGAN menulis topik sejarah/arkeologi: prasasti kerajaan, prasasti peninggalan, prasasti mulawarman, prasasti mataram kuno, prasasti tarumanegara, prasasti kutai, prasasti sriwijaya, prasasti kebon kopi, prasasti kedukan bukit, prasasti talang tuo, prasasti kota kapur, prasasti pasir awi, prasasti tts, apa itu prasasti, tulisan kuno — fokus pada prasasti sebagai PRODUK PLAQUE/PIALA, bukan artefak sejarah
  * gunakan nada ahli produsen yang rendah hati & berbukti: sertakan bukti konkret (Karyamedia berdiri sejak 2001, berbasis Yogyakarta, melayani ratusan instansi & event nasional, standar ukiran/produksi presisi) bila relevan; tekankan kualitas, presisi, dan bahwa Karyamedia adalah produsen langsung (pabrik) sehingga harga lebih sehat & transparan; hindari bahasa promosi murahan dan JANGAN menyebut pihak lain (calo/agen) secara negatif
  * WAJIB ada bagian <h2>FAQ</h2> di akhir dengan 3-5 pasang pertanyaan & jawaban, tiap pasang PASTI format <h3>Pertanyaan?</h3><p>Jawaban.</p> (pakai <h3> untuk pertanyaan dan <p> untuk jawaban)
  * bahasa Indonesia natural & mudah dipahami, SEO-friendly, sebutkan "Karyamedia" secara wajar 1-2 kali
   * JANGAN gunakan markdown; hanya HTML inline (<p>, <h2>, <h3>, <strong>, <ul><li> bila perlu)
   * JIKA menyisipkan gambar, SETIAP tag <img> WAJIB punya atribut alt yang deskriptif berbahasa Indonesia (contoh: alt="Plakat akrilik custom untuk penghargaan"); JANGAN pernah membuat <img> tanpa alt
   * JANGAN sertakan satupun link/hyperlink (akan ditambahkan otomatis nanti)
   * HTML WAJIB valid: semua tag <h2>, <h3>, <p>, <ul>, <li> harus ditutup dengan benar, tidak boleh ada tag tutup tanpa buka atau sebaliknya (contoh SALAH: ...teks.</h2><h2>FAQ...) — tag harus rapi dan properti nested.
   Return HANYA objek JSON, tanpa teks lain.${VARIATION_INSTR}${vBlock}${extra}`
}

export function buildBeatPrompt({ keyword, category, competitor = null, location = null, segment = null, segmentCtx = null, variant = null, extra = "" }) {
  const c = competitor && competitor.outline && competitor.outline.length ? competitor : null
  const compBlock = c
    ? `
KONTEKS ARTIKEL PESAING (yang akan dikalahkan — URL: ${c.url || ""}):
Judul pesaing: ${c.title || ""}
Kerangka pesaing (heading):
${c.outline.map((h) => "- " + h).join("\n")}
Poin bullet pesaing:
${(c.bullets || []).map((b) => "* " + b).join("\n")}
Panjang artikel pesaing: ~${c.words || "?"} kata.
`
    : ""
  const loc = location || "seluruh Indonesia"
  const seg = segment || "instansi, kampus, dan event"
  const segCtxTxt = segmentCtx ? ` (mis. ${segmentCtx})` : ""
  const vBlock = variantBlock(resolveVariant(variant, keyword), keyword, loc)
  return `Tulis artikel SEO berbahasa Indonesia, 100% ORISINAL (JANGAN meniru/mengutip teks pesaing; pakai sudut pandang & contoh sendiri), untuk bisnis "Karyamedia" (produsen souvenir & custom manufacturing berbasis Yogyakarta sejak 2001 yang melayani seluruh Indonesia, termasuk ${loc}: plakat, medali, piala, prasasti, gift box, souvenir wisuda, nama dada, dll).

Keyword utama: "${keyword}"
Kategori: ${category}
Segmen target: ${seg}${segCtxTxt}; gunakan contoh kasus, narasi, kebutuhan, dan kata kunci long-tail yang relevan dengan ${loc} serta segmen tersebut secara natural; jangan ubah fakta bahwa Karyamedia berbasis Yogyakarta.
${compBlock}
Buat objek JSON dengan field berikut:
- "title": MAKSIMAL 60 karakter, HARUS mengandung keyword utama secara utuh. GUNAKAN HURUF KAPITAL AWAL (Title Case), contoh: "Plakat Akrilik Custom untuk Kantor Desa: Solusi Presisi" — jangan seluruhnya huruf kecil.
- "description": 120-160 karakter, mengandung keyword utama.
- "tags": array 4-6 kata kunci Indonesia lowercase; tags[0] SAMA dengan keyword utama.
- "content": artikel HTML (string tunggal) dengan syarat:
  * PANJANG 1500-2200 kata (wajib >=1500).
  * MINIMAL 6 heading <h2> (lebih dalam & komprehensif dari pesaing).
  * 240 karakter PERTAMA (paragraf pembuka) HARUS mengandung keyword utama secara utuh.
  * sebutkan nama produk/kategori terkait (plakat, piala, medali, prasasti, gift box, souvenir wisuda, nama dada, dll) SECARA NATURAL di awal artikel, agar tautan ke katalog produk otomatis bisa disematkan di bagian atas.
  * JANGAN menyebut/mempromosikan produk yang TIDAK KAMI jual: banner, spanduk, stiker, undangan, kartu nama, seragam, kaos, topi, mug, gelas, tas, goodie bag, standing banner, backdrop, poster, flyer, kalender, mpls, ospek, boneka, blind box, pokemon, kartu ucapan souvenir pernikahan, souvenir pernikahan bermanfaat, gambar gantungan kunci, kerajaan majapahit, ucapan souvenir pernikahan, bahan gantungan kunci, souvenir pernikahan murah, membuat gantungan kunci, kartu souvenir pernikahan, tas souvenir pernikahan, buat gantungan kunci, souvenir pernikahan yang bermanfaat
  * JANGAN menulis topik sejarah/arkeologi: prasasti kerajaan, prasasti peninggalan, prasasti mulawarman, prasasti mataram kuno, prasasti tarumanegara, prasasti kutai, prasasti sriwijaya, prasasti kebon kopi, prasasti kedukan bukit, prasasti talang tuo, prasasti kota kapur, prasasti pasir awi, prasasti tts, apa itu prasasti, tulisan kuno — fokus pada prasasti sebagai PRODUK PLAQUE/PIALA, bukan artefak sejarah
  * JIKA topik membandingkan (vs / atau / mending / perbandingan), sertakan <table> perbandingan jelas (kolom: aspek, opsi A, opsi B) dengan narasi Karyamedia.
  * Gunakan nada ahli produsen & sertakan BUKTI KONKRET: Karyamedia berdiri SEJAK 2001, berbasis YOGYAKARTA, melayani RATUSAN instansi & event nasional, sebutkan angka/spesifikasi riil (ukuran mm, lead time, range harga "mulai dari", standar quality control). Tekankan bahwa Karyamedia adalah PRODUSEN LANGSUNG (pabrik) sehingga harga lebih sehat & transparan; hindari bahasa promosi murahan dan JANGAN menyebut pihak lain (calo/agen) secara negatif.
  * ${c ? "Tutupi SEMUA poin pesaing DI ATAS, lalu TAMBAHKAN minimal 3 sudut pandang/section BARU yang TIDAK dibahas pesaing (lebih mendalam, contoh kasus, tips praktis, mitos, checklist, atau data Karyamedia)." : "Buat artikel paling komprehensif & otoritatif di topik ini."}
  * WAJIB <h2>FAQ</h2> di akhir dengan 5-7 pasang <h3>Pertanyaan?</h3><p>Jawaban.</p>
  * Bahasa natural, SEO-friendly, sebut "Karyamedia" wajar 1-2x.
   * JANGAN markdown; hanya HTML inline (<p>, <h2>, <h3>, <table>, <ul><li>, <strong>).
   * JIKA menyisipkan gambar, SETIAP tag <img> WAJIB punya atribut alt yang deskriptif berbahasa Indonesia (contoh: alt="Medali custom untuk lomba dan turnamen"); JANGAN pernah membuat <img> tanpa alt.
   * JANGAN satupun hyperlink (link disuntik otomatis nanti).
   * HTML WAJIB valid: semua tag <h2>, <h3>, <p>, <ul>, <li> harus ditutup dengan benar, tidak boleh ada tag tutup tanpa buka atau sebaliknya (contoh SALAH: ...teks.</h2><h2>FAQ...) — tag harus rapi dan properti nested.
   Return HANYA objek JSON, tanpa teks lain.${VARIATION_INSTR}${vBlock}${extra}`
}

export async function generateArticle(input) {
  if (process.env.LLM_MOCK && process.env.LLM_MOCK !== "0" && process.env.LLM_MOCK !== "false") return MOCK

  const prompt = input.prompt || buildPrompt(input)
  const zenKey = getZenKey()
  const geminiKey = getGeminiKey()
  const alibabaKey = getAlibabaKey()
  const alibabaUrl = getAlibabaUrl()
  const alibabaModel = getAlibabaModel()

  if (alibabaKey && alibabaUrl) {
    try {
      console.error(`Menggunakan Alibaba Qwen (${alibabaModel})...`)
      return await callAlibaba(prompt, alibabaKey, alibabaUrl, alibabaModel)
    } catch (e) {
      console.error(`Alibaba Qwen gagal: ${e.message}. Fallback ke Zen...`)
    }
  } else {
    console.error("API key/URL Alibaba belum diisi, fallback ke Zen.")
  }

  if (zenKey && zenKey !== "PASTE_ZEN_API_KEY_HERE") {
    try {
      console.error(`Menggunakan OpenCode Zen (${ZEN_MODEL})...`)
      return await callZen(prompt, zenKey)
    } catch (e) {
      console.error(`Zen gagal: ${e.message}. Fallback ke Gemini...`)
    }
  } else {
    console.error("API key Zen belum diisi, fallback ke Gemini.")
  }

  if (geminiKey && geminiKey !== "PASTE_GEMINI_API_KEY_HERE") {
    const models = (process.env.GEMINI_MODELS || process.env.GEMINI_MODEL ||
      "gemini-2.0-flash,gemini-flash-latest")
      .split(",").map((m) => m.trim()).filter(Boolean)
    return await callGemini(prompt, geminiKey, models)
  }

  throw new Error("Tidak ada API key LLM valid. Taruh di scripts/llm/alibaba cloude.txt atau scripts/llm/zen-key.txt atau scripts/llm/apikey.txt.")
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function callZen(prompt, key) {
  const models = ZEN_MODEL.split(",").map((m) => m.trim()).filter(Boolean)
  for (const model of models) {
    console.error(`Menggunakan OpenCode Zen (${model})...`)
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 60000)
    try {
      let exhausted = true
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const res = await fetch(ZEN_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${key}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content:
                    "Anda adalah penulis konten SEO ahli yang SELALU mengembalikan HANYA objek JSON valid, tanpa teks atau markdown lain di luar JSON.",
                },
                { role: "user", content: prompt },
              ],
              temperature: 0.7,
              response_format: { type: "json_object" },
            }),
            signal: ctrl.signal,
          })
          const j = await res.json()
          if (j.error) {
            if (res.status === 429 || res.status >= 500) {
              const wait = 1500 * (attempt + 1)
              console.error(`Zen ${model} ${res.status} (${j.error.message || "server error"}), retry ${attempt + 1}/2 dalam ${wait}ms...`)
              await sleep(wait)
              continue
            }
            throw new Error(`Zen ${model} error ${res.status}: ${j.error.message || JSON.stringify(j.error)}`)
          }
          const text = j.choices?.[0]?.message?.content
          if (!text) {
            console.error(`Zen ${model} mengembalikan teks kosong, retry ${attempt + 1}/2...`)
            await sleep(1500 * (attempt + 1))
            continue
          }
          let parsed
          try {
            parsed = JSON.parse(text)
          } catch {
            throw new Error("Zen tidak mengembalikan JSON valid")
          }
          if (!parsed.title || !parsed.description || !parsed.content || !Array.isArray(parsed.tags)) {
            throw new Error("Zen JSON tidak lengkap (field wajib title/description/content/tags hilang)")
          }
          return parsed
        } catch (e) {
          if (/aborted|abort|timeout/i.test(e.message)) {
            console.error(`Zen ${model} timeout, lanjut model berikutnya...`)
            exhausted = false
            break
          }
          if (attempt < 1 && /fetch|network|5\d\d|429|failed/i.test(e.message)) {
            const wait = 1500 * (attempt + 1)
            console.error(`Zen ${model} error (${e.message}), retry ${attempt + 1}/2 dalam ${wait}ms...`)
            await sleep(wait)
            continue
          }
          console.error(`Zen ${model} error keras (${e.message}), lanjut model berikutnya...`)
          exhausted = false
          break
        }
      }
      if (exhausted) console.error(`Zen ${model} gagal setelah 2 percobaan, lanjut ke model berikutnya...`)
    } finally {
      clearTimeout(timer)
    }
  }
  throw new Error("Semua model Zen gagal.")
}

// ---- Alibaba Cloud (OpenAI-compatible) ----
async function callAlibaba(prompt, key, url, model) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 90000)
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(url + "/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "Anda adalah penulis konten SEO ahli yang SELALU mengembalikan HANYA objek JSON valid, tanpa teks atau markdown lain di luar JSON.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
          }),
          signal: ctrl.signal,
        })
        if (!res.ok) {
          const text = await res.text()
          if (res.status === 429 || res.status >= 500) {
            const wait = 2000 * (attempt + 1)
            console.error(`Alibaba ${model} ${res.status}, retry ${attempt + 1}/3 dalam ${wait}ms...`)
            await sleep(wait)
            continue
          }
          throw new Error(`Alibaba ${model} error ${res.status}: ${text}`)
        }
        const j = await res.json()
        const text = j.choices?.[0]?.message?.content
        if (!text) {
          console.error(`Alibaba ${model} teks kosong, retry ${attempt + 1}/3...`)
          await sleep(2000 * (attempt + 1))
          continue
        }
        try {
          const parsed = JSON.parse(text)
          if (!parsed.title || !parsed.description || !parsed.content || !Array.isArray(parsed.tags))
            throw new Error("JSON tidak lengkap")
          return parsed
        } catch {
          throw new Error("Alibaba tidak mengembalikan JSON valid")
        }
      } catch (e) {
        if (/aborted|abort|timeout/i.test(e.message)) throw new Error("Alibaba timeout")
        if (attempt < 2) {
          const wait = 2000 * (attempt + 1)
          console.error(`Alibaba ${model} error (${e.message}), retry ${attempt + 1}/3 dalam ${wait}ms...`)
          await sleep(wait)
        } else throw e
      }
    }
  } finally {
    clearTimeout(timer)
  }
  throw new Error("Alibaba gagal setelah 3 percobaan")
}

async function callGemini(prompt, key, models = [GEMINI_MODEL]) {
  let lastErr = ""
  let lastFinish = ""
  for (const model of models) {
    console.error(`Mencoba Gemini model: ${model}...`)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
    let ok = false
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: SCHEMA,
              temperature: 0.7,
            },
          }),
        })
        const j = await res.json()
        if (j.error && (j.error.code === 503 || j.error.code === 429)) {
          const wait = 2000 * (attempt + 1)
          console.error(`Gemini ${model} ${j.error.code} (high demand/quota), retry ${attempt + 1}/4 dalam ${wait}ms...`)
          await sleep(wait)
          continue
        }
        if (j.error) {
          // error keras (400/403/404) -> coba model berikutnya, jangan retry model ini
          lastErr = `Gemini ${model} error ${j.error.code}: ${j.error.message || JSON.stringify(j.error)}`
          console.error(lastErr)
          break
        }
        const cand = j.candidates?.[0]
        const text = cand?.content?.parts?.[0]?.text
        if (cand && cand.finishReason && cand.finishReason !== "STOP") {
          lastFinish = cand.finishReason
          console.error(`Gemini ${model} finishReason=${cand.finishReason}, retry ${attempt + 1}/4 (rephrase orisinal)...`)
          prompt += `\n\nPENTING: hasil sebelumnya difilter (${cand.finishReason}). Tulis ULANG sepenuhnya dengan bahasa Anda sendiri, 100% orisinal, tanpa meniru/mengutip teks pihak ketiga mana pun.`
          await sleep(1500 * (attempt + 1))
          continue
        }
        if (!text) {
          console.error(`Gemini ${model} mengembalikan teks kosong, retry ${attempt + 1}/4...`)
          await sleep(1500 * (attempt + 1))
          continue
        }
        const parsed = JSON.parse(text)
        ok = true
        return parsed
      } catch (e) {
        if (attempt < 3) {
          const wait = 2000 * (attempt + 1)
          console.error(`Gemini ${model} network error, retry ${attempt + 1}/4 dalam ${wait}ms...`)
          await sleep(wait)
          continue
        }
        lastErr = `Gemini ${model} gagal: ${e.message}`
        break
      }
    }
    if (ok) return
    console.error(`Model ${model} gagal, lanjut ke model berikutnya (jika ada).`)
  }
  throw new Error(`Semua model Gemini gagal (finishReason=${lastFinish}). ${lastErr}`)
}
