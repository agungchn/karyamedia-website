import { readFileSync, writeFileSync, existsSync } from "fs"
import sharp from "sharp"

let c = readFileSync("src/data/articles.ts", "utf8")
const slug = "contoh-medali-wisuda-sd-custom"

// 1. Generate WebP for unused image
const imgName = "samir-wisuda-akrilik-3"
const srcPng = `public/images/produk-unggulan/samir-wisuda/${imgName}.png`
if (existsSync(srcPng)) {
  for (const w of [320, 480, 640, 960]) {
    const out = `public/images/opt/produk-unggulan/samir-wisuda/${imgName}-w${w}.webp`
    if (!existsSync(out)) {
      await sharp(srcPng).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(out)
      console.log(`  Created ${out}`)
    }
  }
}

// 2. Find article and update
const s = c.indexOf(`slug: "${slug}"`)
const es = c.lastIndexOf("{", s); let d = 0, i = es
while (i < c.length) { if (c[i] === "{") d++; if (c[i] === "}") d--; if (d === 0) break; i++ }
let entry = c.slice(es, i + 1)

// Update image
entry = entry.replace(/image: "[^"]+"/, `image: "/images/produk-unggulan/samir-wisuda/${imgName}.png"`)

// Replace content with expanded version (1500+ words)
const cm = entry.match(/content: \`([\s\S]*?)\`/)
if (!cm) { console.log("FAIL: no content"); process.exit(1) }
let co = cm[1]

const faqPos = co.lastIndexOf("<h2>FAQ</h2>")
const beforeFAQ = co.slice(0, faqPos)
const afterFAQ = co.slice(faqPos)

const expandedContent = `<p>Momen kelulusan SD adalah pencapaian pertama yang berharga bagi setiap anak. Memberikan <strong>contoh medali wisuda SD</strong> sebagai kenang-kenangan kelulusan akan membuat momen tersebut semakin berkesan. Karyamedia, produsen souvenir dan medali custom berbasis di Yogyakarta sejak 2001, menyediakan berbagai pilihan desain medali wisuda SD yang bisa disesuaikan dengan tema kelulusan sekolah. Dengan pengalaman melayani ribuan sekolah dasar di seluruh Indonesia, Karyamedia memahami kebutuhan spesifik acara kelulusan SD — dari pemilihan bahan yang ramah anak hingga desain yang ceria dan penuh warna. Artikel ini menyajikan berbagai contoh medali wisuda SD yang bisa menjadi inspirasi untuk acara kelulusan di sekolah Anda.</p>

<h2>Contoh Medali Wisuda SD dengan Logo Sekolah</h2>
<p>Salah satu contoh medali wisuda SD yang paling populer adalah medali dengan logo sekolah di bagian depan. Medali ini biasanya berbentuk bulat dengan diameter 5-6 cm, terbuat dari logam zinc alloy atau kuningan dengan finishing warna emas, perak, atau perunggu. Logo sekolah dicetak timbul (emboss) atau diukir dengan teknik etching laser presisi tinggi. Bagian belakang medali bisa diisi dengan nama siswa, tahun kelulusan, dan motto sekolah. Harga untuk pemesanan 100-500 pcs mulai Rp6.000 per pcs. Model ini cocok untuk SD negeri maupun swasta yang ingin memberikan kenang-kenangan seragam kepada seluruh siswa kelulusan. Banyak sekolah memilih opsi ini karena tampilannya profesional dan mudah dikenali sebagai identitas sekolah.</p>

<h2>Contoh Medali Wisuda SD Bentuk Bintang</h2>
<p>Medali wisuda SD berbentuk bintang menjadi pilihan favorit karena memberikan kesan ceria dan menyenangkan sesuai dengan usia anak-anak. Medali bintang tersedia dalam bentuk bintang 5 sudut dengan ukuran 5x5 cm hingga 7x7 cm. Finishing glossy warna emas atau perak dengan pita warna-warni membuat medali ini terlihat menarik. Tersedia berbagai pilihan warna pita yang bisa disesuaikan dengan warna seragam sekolah atau tema acara. Cocok untuk acara kelulusan TK dan SD yang ingin memberikan kesan ceria dan penghargaan kepada setiap siswa. Harga mulai Rp7.000 per pcs untuk pemesanan 100 unit. Bentuk bintang juga mudah dikenali anak-anak dan memberikan kesan istimewa bagi mereka.</p>

<h2>Contoh Medali Wisuda SD dengan Figur Kartun</h2>
<p>Untuk membuat medali wisuda SD lebih menarik bagi anak-anak, beberapa sekolah memilih desain medali dengan figur kartun atau maskot sekolah. Medali ini menggunakan teknik cetak UV full color pada bahan akrilik atau logam, sehingga gambar kartun tercetak tajam dan warna-warni. Desain ini sangat populer untuk kelulusan SD kelas 6 karena anak-anak menyukai karakter kartun yang lucu dan ceria. Harga mulai Rp8.000 per pcs untuk pemesanan minimal 50 unit. Karyamedia bisa membuat desain custom dengan maskot sekolah atau karakter favorit anak sesuai permintaan. Proses pembuatan mockup digital gratis untuk memastikan desain sesuai sebelum produksi massal.</p>

<h2>Contoh Medali Wisuda SD Bentuk Hati</h2>
<p>Medali berbentuk hati menjadi pilihan unik untuk kelulusan SD, terutama untuk acara yang bernuansa kasih sayang dan penghargaan. Bentuk hati melambangkan cinta dan apresiasi kepada siswa yang telah menyelesaikan pendidikan dasar. Medali hati tersedia dalam ukuran 4x4 cm hingga 6x6 cm dengan finishing emas atau perak. Bagian tengah bisa diisi dengan tulisan atau karakter lucu. Harga mulai Rp7.500 per pcs untuk pemesanan 100 unit. Desain ini cocok untuk kelulusan SD Islam, SD Kristen, atau SD umum yang ingin memberikan kesan berbeda dan lebih personal.</p>

<h2>Contoh Medali Wisuda SD untuk Program Tahfidz</h2>
<p>Sekolah SD Islam dan program tahfidz Al-Quran sering memesan medali wisuda khusus untuk siswa yang telah menyelesaikan hafalan tertentu. Medali wisuda SD tahfidz biasanya didesain dengan nuansa Islami, seperti bentuk bulan sabit, kaligrafi Arab, atau gambar masjid. Warna emas dan hijau menjadi pilihan populer. Harga mulai Rp7.000 per pcs untuk pemesanan 100 unit. Bagian belakang bisa diisi dengan nama siswa dan jumlah juz yang dihafal. Karyamedia telah memproduksi ribuan medali tahfidz untuk SD Islam di berbagai kota dengan desain yang bisa disesuaikan.</p>

<h2>Tips Memilih Medali Wisuda SD yang Tepat</h2>
<p>Saat memilih medali wisuda SD, perhatikan beberapa hal penting. Pilih bahan yang ringan seperti zinc alloy atau akrilik agar nyaman dipakai anak-anak. Pastikan tepi medali sudah dihaluskan dan tidak tajam. Gunakan pita yang lembut agar tidak membuat leher gatal. Pilih desain yang ceria sesuai usia anak. Pesan jumlah cadangan 5-10% dari total siswa. Lakukan pemesanan minimal 3-4 minggu sebelum hari H. Konsultasikan desain dengan tim Karyamedia untuk hasil terbaik sesuai anggaran.</p>

<h2>Proses Pemesanan Medali Wisuda SD di Karyamedia</h2>
<p>Proses pemesanan medali wisuda SD di Karyamedia sangat mudah dan bisa dilakukan sepenuhnya secara online. Pertama, hubungi tim kami melalui WhatsApp dengan menyertakan desain logo sekolah, jumlah siswa, dan tanggal acara. Tim desain akan membuatkan mockup digital gratis untuk Anda setujui sebelum produksi. Setelah desain final, produksi memakan waktu 7-14 hari kerja tergantung jumlah. Kami melayani pengiriman ke seluruh Indonesia dengan packing aman dan asuransi bawaan. Untuk pemesanan ulang tahun depan, master desain digital disimpan sehingga proses lebih cepat tanpa perlu mengirim ulang file desain. Dengan pengalaman sejak 2001, Karyamedia menjadi mitra tepercaya ribuan SD di Indonesia dalam menyediakan medali wisuda berkualitas tinggi dengan harga pabrik yang kompetitif.</p>

`

co = expandedContent + "\n\n" + afterFAQ
entry = entry.replace(cm[1], co)
c = c.slice(0, es) + entry + c.slice(i + 1)
writeFileSync("src/data/articles.ts", c)

const words = co.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
console.log(`Words: ${words} ${words >= 1500 ? "✅ PASS" : "❌ " + (1500 - words) + " short"}`)
