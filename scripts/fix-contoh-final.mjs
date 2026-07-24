import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("src/data/articles.ts", "utf8")
const slug = "contoh-medali-wisuda-sd-custom"

const s = c.indexOf(`slug: "${slug}"`)
const es = c.lastIndexOf("{", s)
let d = 0, i = es
while (i < c.length) { if (c[i] === "{") d++; if (c[i] === "}") d--; if (d === 0) break; i++ }
let entry = c.slice(es, i + 1)

// Update image
entry = entry.replace(/image: "[^"]+"/, `image: "/images/produk-unggulan/samir-wisuda/samir-wisuda-akrilik-3.png"`)

const cm = entry.match(/content: \x60([\s\S]*?)\x60/)
if (!cm) { console.log("FAIL"); process.exit(1) }

const FAQ = `<h2>FAQ</h2>
<h3>Berapa harga medali wisuda SD per pcs?</h3>
<p>Harga medali wisuda SD mulai Rp5.000 hingga Rp10.000 per pcs tergantung bahan, ukuran, finishing, dan jumlah pemesanan.</p>
<h3>Apakah bisa membuat medali dengan nama setiap siswa?</h3>
<p>Ya, bisa dengan biaya tambahan Rp1.000-Rp2.000 per pcs.</p>
<h3>Berapa minimal pemesanan medali wisuda SD?</h3>
<p>Minimal 50 pcs untuk desain yang sama. Untuk jumlah lebih kecil, konsultasikan dengan tim kami.</p>
<h3>Apakah medali wisuda SD aman untuk anak-anak?</h3>
<p>Ya, tepi dihaluskan, bahan aman, pita lembut dan nyaman dipakai.</p>
<h3>Berapa lama proses pembuatan?</h3>
<p>7-14 hari kerja. Disarankan pesan 3-4 minggu sebelum acara.</p>
<p>Artikel terkait: <a href="/blog/panduan-lengkap-medali-custom">Panduan Lengkap Medali Custom</a></p>
<p>Artikel terkait: <a href="/blog/medali-custom-jogja">Medali Custom Jogja untuk Event & Kampus</a></p>
<p>Artikel terkait: <a href="/blog/harga-medali-perunggu-lengkap">Harga Medali Perunggu Lengkap</a></p>
<p>Artikel terkait: <a href="/blog/contoh-medali-wisuda-custom">Contoh Medali Wisuda untuk Berbagai Acara</a></p>`

const H2S = [
  `<h2>Contoh Medali Wisuda SD dengan Logo Sekolah</h2>
<p>Salah satu contoh medali wisuda SD yang paling populer adalah medali dengan logo sekolah di bagian depan. Medali ini biasanya berbentuk bulat dengan diameter 5-6 cm, terbuat dari logam zinc alloy atau kuningan dengan finishing emas, perak, atau perunggu. Logo sekolah dicetak timbul (emboss) atau diukir dengan teknik etching laser presisi tinggi sehingga detail logo terlihat jelas dan rapi. Bagian belakang medali bisa diisi dengan nama siswa, tahun kelulusan, dan motto sekolah. Harga untuk pemesanan 100-500 pcs mulai Rp6.000 per pcs. Model ini sangat cocok untuk SD negeri maupun swasta yang ingin memberikan kenang-kenangan seragam dengan identitas sekolah yang kuat, profesional, dan mudah dikenali sebagai identitas institusi pendidikan.</p>`,

  `<h2>Contoh Medali Wisuda SD Bentuk Bintang</h2>
<p>Medali wisuda SD berbentuk bintang menjadi pilihan favorit karena memberikan kesan ceria dan menyenangkan sesuai dengan usia anak-anak. Medali bintang tersedia dalam bentuk bintang 5 sudut dengan ukuran 5x5 cm hingga 7x7 cm. Finishing glossy warna emas atau perak dengan pita warna-warni membuat medali ini terlihat sangat menarik dan disukai anak-anak. Pita tersedia dalam berbagai pilihan warna yang bisa disesuaikan dengan warna seragam sekolah. Cocok untuk acara kelulusan TK dan SD yang ingin memberikan kesan ceria. Harga mulai Rp7.000 per pcs untuk pemesanan 100 unit. Bentuk bintang yang unik mudah dikenali dan memberikan kesan istimewa bagi setiap siswa lulusan.</p>`,

  `<h2>Contoh Medali Wisuda SD dengan Figur Kartun</h2>
<p>Untuk membuat medali wisuda SD lebih menarik, beberapa sekolah memilih desain medali dengan figur kartun atau maskot sekolah. Medali ini menggunakan teknik cetak UV full color pada bahan akrilik atau logam, sehingga gambar kartun tercetak tajam, warna-warni, dan tahan lama tidak mudah pudar. Desain ini sangat populer untuk kelulusan SD kelas 6 karena anak-anak seusia itu sangat menyukai karakter kartun yang lucu. Harga mulai Rp8.000 per pcs untuk pemesanan minimal 50 unit. Karyamedia bisa membuat desain custom dengan maskot sekolah atau karakter favorit sesuai permintaan. Proses mockup digital gratis sebelum produksi untuk memastikan desain sesuai keinginan.</p>`,

  `<h2>Contoh Medali Wisuda SD Bentuk Hati</h2>
<p>Medali berbentuk hati menjadi pilihan unik dan penuh makna untuk kelulusan SD. Bentuk hati melambangkan cinta, kasih sayang, dan apresiasi yang tulus kepada siswa yang telah menyelesaikan pendidikan dasar. Medali hati tersedia dalam ukuran 4x4 cm hingga 6x6 cm dengan finishing emas atau perak. Bagian tengah medali bisa diisi dengan tulisan atau karakter lucu. Harga mulai Rp7.500 per pcs untuk pemesanan 100 unit. Desain cocok untuk SD Islam, SD Kristen, maupun SD umum yang ingin memberikan kesan berbeda, lebih personal, dan penuh makna bagi setiap siswa.</p>`,

  `<h2>Contoh Medali Wisuda SD untuk Program Tahfidz</h2>
<p>Sekolah SD Islam dan program tahfidz Al-Quran sering memesan medali wisuda khusus untuk siswa yang telah menyelesaikan hafalan juz tertentu. Medali wisuda SD tahfidz didesain dengan nuansa Islami seperti bentuk bulan sabit, kaligrafi Arab, atau gambar masjid. Warna emas dan hijau menjadi pilihan paling populer melambangkan kemuliaan dan kesucian. Harga mulai Rp7.000 per pcs untuk pemesanan 100 unit. Bagian belakang bisa diisi dengan nama siswa dan jumlah juz yang dihafal. Karyamedia telah memproduksi ribuan medali tahfidz untuk SD Islam di berbagai kota dengan desain yang bisa disesuaikan.</p>`,

  `<h2>Tips Memilih Medali Wisuda SD yang Tepat</h2>
<p>Saat memilih medali wisuda SD, ada beberapa hal penting yang perlu diperhatikan. Pilih bahan yang ringan seperti zinc alloy agar nyaman dipakai anak-anak. Pastikan tepi medali sudah dihaluskan dan tidak tajam. Gunakan pita yang lembut dan berkualitas agar tidak membuat iritasi. Pilih desain yang ceria dan sesuai usia anak. Pesan jumlah cadangan 5-10% dari total siswa untuk antisipasi. Lakukan pemesanan minimal 3-4 minggu sebelum hari H. Konsultasikan desain dengan tim Karyamedia untuk hasil terbaik sesuai anggaran.</p>`,

  `<h2>Proses Pemesanan Medali Wisuda SD di Karyamedia</h2>
<p>Proses pemesanan medali wisuda SD di Karyamedia sangat mudah dan bisa dilakukan sepenuhnya online. Hubungi tim kami melalui WhatsApp dengan menyertakan desain logo sekolah, jumlah siswa, dan tanggal acara. Tim desain akan membuatkan mockup digital gratis untuk Anda setujui. Setelah desain final, produksi memakan waktu 7-14 hari kerja. Kami melayani pengiriman ke seluruh Indonesia dengan packing aman dan asuransi. Master desain digital disimpan untuk pemesanan ulang tahun depan sehingga proses lebih cepat. Dengan pengalaman sejak 2001, Karyamedia menjadi mitra tepercaya ribuan SD di Indonesia dalam menyediakan medali wisuda berkualitas dengan harga pabrik yang kompetitif.</p>`
]

const intro = `<p>Momen kelulusan SD adalah pencapaian pertama yang sangat berharga bagi setiap anak. Memberikan <strong>contoh medali wisuda SD</strong> sebagai kenang-kenangan kelulusan akan membuat momen tersebut semakin berkesan dan tak terlupakan. Karyamedia, produsen souvenir dan medali custom berbasis di Yogyakarta sejak 2001, menyediakan berbagai pilihan desain medali wisuda SD yang bisa disesuaikan dengan tema kelulusan sekolah. Dengan pengalaman melayani ribuan sekolah dasar di seluruh Indonesia, Karyamedia memahami kebutuhan spesifik acara kelulusan SD. Artikel ini menyajikan berbagai contoh medali wisuda SD yang bisa menjadi inspirasi untuk acara kelulusan di sekolah Anda.</p>`

const fullContent = intro + "\n\n" + H2S.join("\n\n") + "\n\n" + FAQ
entry = entry.replace(cm[1], fullContent)
c = c.slice(0, es) + entry + c.slice(i + 1)
writeFileSync("src/data/articles.ts", c)

const words = fullContent.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
console.log(`Words: ${words} ${words >= 1500 ? "✅ PASS" : "❌"}`)
