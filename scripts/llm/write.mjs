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

function getKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY
  try {
    return readFileSync(join(here, "apikey.txt"), "utf8").trim()
  } catch {
    return ""
  }
}

const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash"

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
  description: "Mock description untuk pengujian generator artikel otomatis Karyamedia souvenir custom Jogja.",
  tags: ["plakat", "akrilik", "custom", "jogja"],
  content:
    '<h2>Pengantar</h2>' +
    '<p>Mock content untuk pengujian pipeline generator. Plakat akrilik custom menjadi pilihan banyak instansi di Jogja karena tampilannya transparan, elegan, dan ringan dibawa. Banyak kantor, sekolah, dan universitas menggunakan plakat ini untuk apresiasi karyawan maupun wisudawan.</p>' +
    '<p>Karyamedia melayani pembuatan plakat akrilik dengan desain sepenuhnya custom sesuai kebutuhan acara Anda. Setiap plakat diukir presisi sehingga nama dan pesan terbaca jelas dari jarak jauh.</p>' +
    '<h2>Keunggulan</h2>' +
    '<p>Plakat akrilik transparan dan elegan untuk berbagai kebutuhan penghargaan kantor maupun sekolah. Materialnya tidak mudah retak dan awet digunakan bertahun-tahun sebagai kenang-kenangan.</p>' +
    '<p>Berbeda dengan plakat kertas, plakat akrilik terasa lebih premium di tangan penerima. Pilihan warna backing membuatnya cocok untuk berbagai tema acara resmi maupun informal.</p>' +
    '<h2>Cara Memilih</h2>' +
    '<p>Pertimbangkan ketebalan dan desain ukiran yang sesuai dengan acara Anda bersama Karyamedia. Ketebalan 5 mm memberikan kesan solid, sedangkan 3 mm cukup untuk plakat massal berbudget tipis.</p>' +
    '<p>Konsultasikan warna logo dan ukuran teks sebelum produksi agar hasil maksimal. Tim Karyamedia membantu merancang layout yang rapi dan profesional untuk setiap pesanan.</p>' +
    '<h2>Perawatan</h2>' +
    '<p>Bersihkan plakat akrilik dengan kain mikrofiber dan cairan lembut agar permukaan tidak buram. Hindari alkohol yang bisa merusak kilap akrilik dalam jangka panjang.</p>' +
    '<p>Simpan di tempat tidak lembap supaya plakat tetap jernih. Dengan perawatan mudah, plakat akrilik menjadi kenang-kenangan yang selalu siap dipamerkan di ruang kerja.</p>' +
    '<h2>FAQ</h2>' +
    '<p><strong>Apakah bisa custom?</strong> Ya, sepenuhnya custom sesuai permintaan Anda, termasuk bentuk dan warna.</p>' +
    '<p><strong>Berapa minimal order?</strong> Tergantung jenis plakat, namun Karyamedia melayani mulai dari jumlah kecil hingga ratusan unit.</p>' +
    '<p><strong>Apakah ada garansi?</strong> Setiap hasil produksi dicek kualitasnya sebelum pengiriman agar bebas cacat.</p>',
}

export async function generateArticle({ keyword, category }) {
  if (process.env.LLM_MOCK) return MOCK
  const key = getKey()
  if (!key || key === "PASTE_GEMINI_API_KEY_HERE") {
    throw new Error("API key Gemini belum diisi. Taruh di scripts/llm/apikey.txt atau set env GEMINI_API_KEY.")
  }

  const prompt = `Tulis artikel SEO berbahasa Indonesia untuk bisnis "Karyamedia" (produsen souvenir & custom manufacturing di Jogja: plakat, medali, piala, prasasti, gift box, souvenir wisuda, name tag, dll).

Keyword utama: "${keyword}"
Kategori: ${category}

Buat objek JSON dengan field berikut:
- "title": judul artikel, MAKSIMAL 60 karakter, mengandung keyword utama.
- "description": meta description, 120-160 karakter, mengandung keyword utama.
- "tags": array 4-6 kata kunci Indonesia relevan (semua lowercase).
- "content": artikel lengkap dalam bentuk HTML (string tunggal). Syarat content:
  * minimal 600 kata
  * minimal 4 heading <h2> (pakai tag <h2>...</h2>)
  * WAJIB ada bagian <h2>FAQ</h2> di akhir dengan 3-5 pasang pertanyaan & jawaban, format <p><strong>Pertanyaan?</strong> Jawaban.</p>
  * bahasa Indonesia natural & mudah dipahami, SEO-friendly, sebutkan "Karyamedia" secara wajar 1-2 kali
  * JANGAN gunakan markdown; hanya HTML inline (<p>, <h2>, <strong>, <ul><li> bila perlu)
  * JANGAN sertakan satupun link/hyperlink (akan ditambahkan otomatis nanti)
Return HANYA objek JSON, tanpa teks lain.`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`
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
  if (j.error) throw new Error("Gemini API: " + JSON.stringify(j.error))
  const text = j.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Gemini tidak mengembalikan teks. " + JSON.stringify(j).slice(0, 300))
  const data = JSON.parse(text)
  return data
}
