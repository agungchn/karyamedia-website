import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("src/data/articles.ts", "utf8")

// Find and remove the broken article entry
const slug = "contoh-medali-wisuda-sd-custom"
const s = c.indexOf(`slug: "${slug}"`)
const entryStart = c.lastIndexOf("{", s)
let depth = 0, i = entryStart
while (i < c.length) { if (c[i] === "{") depth++; if (c[i] === "}") depth--; if (depth === 0) break; i++ }
const entryEnd = i + 1

// Remove it
c = c.slice(0, entryStart) + c.slice(entryEnd)

const FULL = `<p>Momen kelulusan SD adalah pencapaian pertama yang sangat berharga bagi setiap anak. Memberikan <strong>contoh medali wisuda SD</strong> sebagai kenang-kenangan akan membuat momen tersebut semakin berkesan dan tak terlupakan. Karyamedia, produsen souvenir dan medali custom berbasis di Yogyakarta sejak 2001, menyediakan berbagai pilihan desain medali wisuda SD yang bisa disesuaikan dengan tema kelulusan sekolah. Dengan pengalaman melayani ribuan sekolah dasar di seluruh Indonesia, Karyamedia memahami kebutuhan spesifik acara kelulusan SD — dari pemilihan bahan yang ramah anak, ukuran yang proporsional, hingga desain yang ceria dan penuh warna. Setiap medali diproduksi dengan standar kualitas tinggi menggunakan mesin CNC presisi dan finishing electroplating yang tahan lama. Artikel ini menyajikan berbagai contoh medali wisuda SD yang bisa menjadi inspirasi untuk acara kelulusan di sekolah Anda.</p>

<h2>Contoh Medali Wisuda SD dengan Logo Sekolah</h2>
<p>Salah satu contoh medali wisuda SD yang paling populer adalah medali dengan logo sekolah di bagian depan. Medali ini biasanya berbentuk bulat dengan diameter 5-6 cm, terbuat dari logam zinc alloy atau kuningan dengan finishing emas, perak, atau perunggu. Logo sekolah dicetak timbul (emboss) atau diukir dengan etching laser presisi tinggi. Bagian belakang medali bisa diisi dengan nama siswa, tahun kelulusan, dan motto sekolah. Harga untuk pemesanan 100-500 pcs mulai Rp6.000 per pcs. Model ini cocok untuk SD negeri maupun swasta yang ingin memberikan kenang-kenangan seragam dengan identitas sekolah yang kuat dan profesional.</p>

<h2>Contoh Medali Wisuda SD Bentuk Bintang</h2>
<p>Medali wisuda SD berbentuk bintang menjadi pilihan favorit karena memberikan kesan ceria sesuai usia anak-anak. Medali bintang tersedia dalam ukuran 5x5 cm hingga 7x7 cm. Finishing glossy warna emas atau perak dengan pita warna-warni yang bisa disesuaikan dengan warna seragam sekolah. Cocok untuk kelulusan TK dan SD yang ingin memberikan kesan ceria dan penghargaan. Harga mulai Rp7.000 per pcs untuk pemesanan 100 unit. Bentuk bintang yang unik mudah dikenali dan memberikan kesan istimewa bagi setiap siswa lulusan.</p>

<h2>Contoh Medali Wisuda SD dengan Figur Kartun</h2>
<p>Untuk membuat medali wisuda SD lebih menarik, beberapa sekolah memilih desain dengan figur kartun atau maskot sekolah. Menggunakan cetak UV full color pada akrilik atau logam, gambar kartun tercetak tajam, warna-warni, dan tahan lama. Sangat populer untuk kelulusan SD kelas 6 karena anak-anak menyukai karakter lucu. Harga mulai Rp8.000 per pcs minimal 50 unit. Karyamedia bisa membuat desain custom dengan maskot sekolah atau karakter favorit sesuai permintaan.</p>

<h2>Contoh Medali Wisuda SD Bentuk Hati</h2>
<p>Medali berbentuk hati menjadi pilihan unik penuh makna untuk kelulusan SD. Bentuk hati melambangkan cinta dan apresiasi kepada siswa yang menyelesaikan pendidikan dasar. Tersedia ukuran 4x4 cm hingga 6x6 cm finishing emas atau perak. Harga mulai Rp7.500 per pcs untuk 100 unit. Cocok untuk SD Islam, SD Kristen, maupun SD umum yang ingin memberikan kesan berbeda, personal, dan penuh makna bagi setiap siswa.</p>

<h2>Contoh Medali Wisuda SD untuk Program Tahfidz</h2>
<p>Sekolah SD Islam dan program tahfidz Al-Quran sering memesan medali wisuda khusus untuk siswa yang telah menyelesaikan hafalan. Medali tahfidz didesain dengan nuansa Islami seperti bulan sabit, kaligrafi Arab, atau gambar masjid. Warna emas dan hijau populer melambangkan kemuliaan. Harga mulai Rp7.000 per pcs untuk 100 unit. Bagian belakang diisi nama siswa dan jumlah juz. Karyamedia telah memproduksi ribuan medali tahfidz untuk SD Islam di berbagai kota dengan desain yang bisa disesuaikan.</p>

<h2>Tips Memilih Medali Wisuda SD yang Tepat</h2>
<p>Saat memilih medali wisuda SD, perhatikan beberapa hal. Pilih bahan ringan seperti zinc alloy agar nyaman dipakai anak. Pastikan tepi medali dihaluskan dan tidak tajam. Gunakan pita lembut dan berkualitas. Pilih desain ceria sesuai usia anak. Pesan cadangan 5-10% dari total siswa. Lakukan pemesanan 3-4 minggu sebelum hari H. Konsultasikan dengan tim Karyamedia untuk hasil terbaik. Dengan tips ini, medali wisuda SD akan menjadi kenang-kenangan yang disukai anak-anak dan orang tua selama bertahun-tahun.</p>

<h2>Proses Pemesanan Medali Wisuda SD di Karyamedia</h2>
<p>Proses pemesanan medali wisuda SD di Karyamedia sangat mudah dan bisa dilakukan sepenuhnya secara online. Hubungi tim kami melalui WhatsApp dengan menyertakan desain logo sekolah, jumlah siswa, dan tanggal acara. Tim desain akan membuatkan mockup digital gratis untuk Anda setujui. Setelah desain final, produksi memakan waktu 7-14 hari kerja tergantung jumlah pesanan. Kami melayani pengiriman ke seluruh Indonesia dengan packing aman dan asuransi bawaan. Master desain digital disimpan untuk pemesanan ulang tahun depan. Dengan pengalaman sejak 2001, Karyamedia menjadi mitra tepercaya ribuan SD di Indonesia dalam menyediakan medali wisuda berkualitas dengan harga pabrik yang kompetitif.</p>

<h2>FAQ</h2>
<h3>Berapa harga medali wisuda SD per pcs?</h3>
<p>Mulai Rp5.000 hingga Rp10.000 per pcs tergantung bahan, ukuran, finishing, dan jumlah pesanan.</p>
<h3>Apakah bisa membuat medali dengan nama setiap siswa?</h3>
<p>Ya, bisa dengan biaya tambahan Rp1.000-Rp2.000 per pcs.</p>
<h3>Berapa minimal pemesanan medali wisuda SD?</h3>
<p>Minimal 50 pcs untuk desain yang sama. Untuk jumlah lebih kecil, konsultasikan dengan tim kami.</p>
<h3>Apakah medali wisuda SD aman untuk anak-anak?</h3>
<p>Ya, tepi dihaluskan, bahan aman, dan pita lembut.</p>
<h3>Berapa lama proses pembuatan?</h3>
<p>7-14 hari kerja. Disarankan pesan 3-4 minggu sebelum acara.</p>
<p>Artikel terkait: <a href="/blog/panduan-lengkap-medali-custom">Panduan Lengkap Medali Custom</a></p>
<p>Artikel terkait: <a href="/blog/medali-custom-jogja">Medali Custom Jogja untuk Event & Kampus</a></p>
<p>Artikel terkait: <a href="/blog/harga-medali-perunggu-lengkap">Harga Medali Perunggu Lengkap</a></p>
<p>Artikel terkait: <a href="/blog/contoh-medali-wisuda-custom">Contoh Medali Wisuda untuk Berbagai Acara</a></p>`

const newEntry = `  {
    slug: "contoh-medali-wisuda-sd-custom",
    title: "Contoh Medali Wisuda SD untuk Kelulusan Berkesan",
    description: "Cari contoh medali wisuda SD? Lihat inspirasi desain medali kelulusan SD untuk putra-putri Anda. Karyamedia produsen medali custom jogja harga bersahabat.",
    category: "Medali",
    date: "2026-07-24",
    image: "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-3.png",
    tags: ["contoh medali wisuda sd", "medali wisuda sd", "contoh medali kelulusan sd", "medali kelulusan sd", "souvenir wisuda sd"],
    content: \`${FULL}\`
  },`

// Insert before the closing ]
const insertPos = c.lastIndexOf("]")
c = c.slice(0, insertPos) + "\n" + newEntry + "\n" + c.slice(insertPos)
writeFileSync("src/data/articles.ts", c)

const words = FULL.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
console.log(`Words: ${words} ${words >= 800 ? "✅" : "❌"}`)
