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

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash"
const ZEN_MODEL = process.env.ZEN_MODEL || "deepseek-v4-flash-free"
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

function buildPrompt({ keyword, category, location = null, segment = null, extra = "" }) {
  const loc = location || "seluruh Indonesia"
  const seg = segment || "instansi, kampus, dan event"
  return `Tulis artikel SEO berbahasa Indonesia, 100% orisinal (jangan kutip/meniru teks pihak ketiga mana pun), untuk bisnis "Karyamedia" (produsen souvenir & custom manufacturing berbasis Yogyakarta sejak 2001 yang melayani seluruh Indonesia, termasuk ${loc}).

Keyword utama: "${keyword}"
Kategori: ${category}
Segmen target: ${seg} (gunakan contoh kasus, narasi, dan kebutuhan yang relevan dengan ${loc} dan segmen tersebut secara natural; jangan ubah fakta bahwa Karyamedia berbasis Yogyakarta).

Buat objek JSON dengan field berikut:
- "title": judul artikel, MAKSIMAL 60 karakter, HARUS mengandung keyword utama secara utuh (contoh: jika keyword "plakat akrilik custom" maka title mengandung frasa tersebut).
- "description": meta description, 120-160 karakter, mengandung keyword utama.
- "tags": array 4-6 kata kunci Indonesia relevan (semua lowercase); tags[0] HARUS sama dengan keyword utama.
- "content": artikel lengkap dalam bentuk HTML (string tunggal). Syarat content:
  * minimal 800 kata (wajib >=800 agar lolos standar)
  * minimal 4 heading <h2> (pakai tag <h2>...</h2>)
  * 240 karakter PERTAMA konten (paragraf pembuka) HARUS mengandung keyword utama secara utuh
  * sebutkan nama produk/kategori terkait (plakat, piala, medali, prasasti, gift box, souvenir wisuda, name tag, dll) SECARA NATURAL di paragraf pembuka/awal artikel, agar tautan ke katalog produk otomatis bisa disematkan di bagian atas
  * gunakan nada ahli produsen yang rendah hati & berbukti: sertakan bukti konkret (Karyamedia berdiri sejak 2001, berbasis Yogyakarta, melayani ratusan instansi & event nasional, standar ukiran/produksi presisi) bila relevan; tekankan kualitas, presisi, dan bahwa Karyamedia adalah produsen langsung (pabrik) sehingga harga lebih sehat & transparan; hindari bahasa promosi murahan dan JANGAN menyebut pihak lain (calo/agen) secara negatif
  * WAJIB ada bagian <h2>FAQ</h2> di akhir dengan 3-5 pasang pertanyaan & jawaban, tiap pasang PASTI format <h3>Pertanyaan?</h3><p>Jawaban.</p> (pakai <h3> untuk pertanyaan dan <p> untuk jawaban)
  * bahasa Indonesia natural & mudah dipahami, SEO-friendly, sebutkan "Karyamedia" secara wajar 1-2 kali
  * JANGAN gunakan markdown; hanya HTML inline (<p>, <h2>, <h3>, <strong>, <ul><li> bila perlu)
  * JANGAN sertakan satupun link/hyperlink (akan ditambahkan otomatis nanti)
  Return HANYA objek JSON, tanpa teks lain.${extra}`
}

export function buildBeatPrompt({ keyword, category, competitor = null, location = null, segment = null, extra = "" }) {
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
  return `Tulis artikel SEO berbahasa Indonesia, 100% ORISINAL (JANGAN meniru/mengutip teks pesaing; pakai sudut pandang & contoh sendiri), untuk bisnis "Karyamedia" (produsen souvenir & custom manufacturing berbasis Yogyakarta sejak 2001 yang melayani seluruh Indonesia, termasuk ${loc}: plakat, medali, piala, prasasti, gift box, souvenir wisuda, name tag, dll).

Keyword utama: "${keyword}"
Kategori: ${category}
Segmen target: ${seg} (gunakan contoh kasus, narasi, dan kebutuhan yang relevan dengan ${loc} dan segmen tersebut secara natural; jangan ubah fakta bahwa Karyamedia berbasis Yogyakarta).
${compBlock}
Buat objek JSON dengan field berikut:
- "title": MAKSIMAL 60 karakter, HARUS mengandung keyword utama secara utuh.
- "description": 120-160 karakter, mengandung keyword utama.
- "tags": array 4-6 kata kunci Indonesia lowercase; tags[0] SAMA dengan keyword utama.
- "content": artikel HTML (string tunggal) dengan syarat:
  * PANJANG 1500-2200 kata (wajib >=1500).
  * MINIMAL 6 heading <h2> (lebih dalam & komprehensif dari pesaing).
  * 240 karakter PERTAMA (paragraf pembuka) HARUS mengandung keyword utama secara utuh.
  * sebutkan nama produk/kategori terkait (plakat, piala, medali, prasasti, gift box, souvenir wisuda, name tag, dll) SECARA NATURAL di awal artikel, agar tautan ke katalog produk otomatis bisa disematkan di bagian atas.
  * JIKA topik membandingkan (vs / atau / mending / perbandingan), sertakan <table> perbandingan jelas (kolom: aspek, opsi A, opsi B) dengan narasi Karyamedia.
  * Gunakan nada ahli produsen & sertakan BUKTI KONKRET: Karyamedia berdiri SEJAK 2001, berbasis YOGYAKARTA, melayani RATUSAN instansi & event nasional, sebutkan angka/spesifikasi riil (ukuran mm, lead time, range harga "mulai dari", standar quality control). Tekankan bahwa Karyamedia adalah PRODUSEN LANGSUNG (pabrik) sehingga harga lebih sehat & transparan; hindari bahasa promosi murahan dan JANGAN menyebut pihak lain (calo/agen) secara negatif.
  * ${c ? "Tutupi SEMUA poin pesaing DI ATAS, lalu TAMBAHKAN minimal 3 sudut pandang/section BARU yang TIDAK dibahas pesaing (lebih mendalam, contoh kasus, tips praktis, mitos, checklist, atau data Karyamedia)." : "Buat artikel paling komprehensif & otoritatif di topik ini."}
  * WAJIB <h2>FAQ</h2> di akhir dengan 5-7 pasang <h3>Pertanyaan?</h3><p>Jawaban.</p>
  * Bahasa natural, SEO-friendly, sebut "Karyamedia" wajar 1-2x.
  * JANGAN markdown; hanya HTML inline (<p>, <h2>, <h3>, <table>, <ul><li>, <strong>).
  * JANGAN satupun hyperlink (link disuntik otomatis nanti).
Return HANYA objek JSON, tanpa teks lain.${extra}`
}

export async function generateArticle(input) {
  if (process.env.LLM_MOCK) return MOCK

  const prompt = input.prompt || buildPrompt(input)
  const zenKey = getZenKey()
  const geminiKey = getGeminiKey()

  if (zenKey && zenKey !== "PASTE_ZEN_API_KEY_HERE") {
    try {
      console.error("Menggunakan OpenCode Zen (deepseek-v4-flash-free)...")
      return await callZen(prompt, zenKey)
    } catch (e) {
      console.error(`Zen gagal: ${e.message}. Fallback ke Gemini...`)
    }
  } else {
    console.error("API key Zen belum diisi, fallback ke Gemini.")
  }

  if (geminiKey && geminiKey !== "PASTE_GEMINI_API_KEY_HERE") {
    return await callGemini(prompt, geminiKey)
  }

  throw new Error("Tidak ada API key LLM valid. Taruh di scripts/llm/zen-key.txt atau scripts/llm/apikey.txt.")
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function callZen(prompt, key) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(ZEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: ZEN_MODEL,
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
      })
      const j = await res.json()
      if (j.error) {
        if (res.status === 429 || res.status >= 500) {
          const wait = 2000 * (attempt + 1)
          console.error(`Zen ${res.status} (${j.error.message || "server error"}), retry ${attempt + 1}/4 dalam ${wait}ms...`)
          await sleep(wait)
          continue
        }
        throw new Error(`Zen error ${res.status}: ${j.error.message || JSON.stringify(j.error)}`)
      }
      const text = j.choices?.[0]?.message?.content
      if (!text) {
        console.error(`Zen mengembalikan teks kosong, retry ${attempt + 1}/4...`)
        await sleep(1500 * (attempt + 1))
        continue
      }
      const parsed = JSON.parse(text)
      if (!parsed.title || !parsed.description || !parsed.content || !Array.isArray(parsed.tags)) {
        throw new Error("Zen JSON tidak lengkap (field wajib title/description/content/tags hilang)")
      }
      return parsed
    } catch (e) {
      if (attempt < 3 && /fetch|network|timeout|5\d\d|429|failed|JSON/i.test(e.message)) {
        const wait = 2000 * (attempt + 1)
        console.error(`Zen error (${e.message}), retry ${attempt + 1}/4 dalam ${wait}ms...`)
        await sleep(wait)
        continue
      }
      throw e
    }
  }
  throw new Error("Zen gagal menghasilkan konten setelah 4 percobaan.")
}

async function callGemini(prompt, key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`
  let lastFinish = ""
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
        console.error(`Gemini ${j.error.code} (high demand/quota), retry ${attempt + 1}/4 dalam ${wait}ms...`)
        await sleep(wait)
        continue
      }
      const cand = j.candidates?.[0]
      const text = cand?.content?.parts?.[0]?.text
      if (cand && cand.finishReason && cand.finishReason !== "STOP") {
        lastFinish = cand.finishReason
        console.error(`Gemini finishReason=${cand.finishReason}, retry ${attempt + 1}/4 (rephrase orisinal)...`)
        prompt += `\n\nPENTING: hasil sebelumnya difilter (${cand.finishReason}). Tulis ULANG sepenuhnya dengan bahasa Anda sendiri, 100% orisinal, tanpa meniru/mengutip teks pihak ketiga mana pun.`
        await sleep(1500 * (attempt + 1))
        continue
      }
      if (!text) {
        console.error(`Gemini mengembalikan teks kosong, retry ${attempt + 1}/4...`)
        await sleep(1500 * (attempt + 1))
        continue
      }
      return JSON.parse(text)
    } catch (e) {
      if (attempt < 3) {
        const wait = 2000 * (attempt + 1)
        console.error(`Gemini network error, retry ${attempt + 1}/4 dalam ${wait}ms...`)
        await sleep(wait)
        continue
      }
      throw e
    }
  }
  throw new Error(`Gemini gagal menghasilkan konten setelah 4 percobaan (finishReason=${lastFinish}).`)
}
