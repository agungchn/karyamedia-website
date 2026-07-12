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

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash"

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

export async function generateArticle({ keyword, category, extra = "" }) {
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
  * minimal 700 kata (wajib di atas 600 agar lolos standar)
  * minimal 4 heading <h2> (pakai tag <h2>...</h2>)
  * WAJIB ada bagian <h2>FAQ</h2> di akhir dengan 3-5 pasang pertanyaan & jawaban, format <p><strong>Pertanyaan?</strong> Jawaban.</p>
  * bahasa Indonesia natural & mudah dipahami, SEO-friendly, sebutkan "Karyamedia" secara wajar 1-2 kali
  * JANGAN gunakan markdown; hanya HTML inline (<p>, <h2>, <strong>, <ul><li> bila perlu)
  * JANGAN sertakan satupun link/hyperlink (akan ditambahkan otomatis nanti)
 Return HANYA objek JSON, tanpa teks lain.${extra}`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: SCHEMA,
      temperature: 0.7,
    },
  }
  let j = null
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      j = await res.json()
      if (j.error && (j.error.code === 503 || j.error.code === 429)) {
        const wait = 2000 * (attempt + 1)
        console.error(`Gemini ${j.error.code} (high demand/quota), retry ${attempt + 1}/3 dalam ${wait}ms...`)
        await new Promise((r) => setTimeout(r, wait))
        continue
      }
      break
    } catch (e) {
      if (attempt < 2) {
        const wait = 2000 * (attempt + 1)
        console.error(`Gemini network error, retry ${attempt + 1}/3 dalam ${wait}ms...`)
        await new Promise((r) => setTimeout(r, wait))
        continue
      }
      throw e
    }
  }
  if (j.error) throw new Error("Gemini API: " + JSON.stringify(j.error))
  const text = j.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Gemini tidak mengembalikan teks. " + JSON.stringify(j).slice(0, 300))
  const data = JSON.parse(text)
  return data
}
