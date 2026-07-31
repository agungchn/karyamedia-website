import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Mapping for new names based on images analyzed
const nameUpdates = {
  // Gambar 1: Plakat Kuningan Universitas Palangka Raya - Box Bludru Hitam dengan kain satin kuning
  'plakat-pk-479': {
    name: 'Plakat Kuningan Universitas Box Bludru Hitam',
    slug: 'plakat-kuningan-universitas-box-bludru-hitam',
    description: 'Plakat penghargaan kuningan premium untuk universitas dan instansi pendidikan. Bahan kuningan asli dengan finishing emas mengkilap, dilengkapi box bludru hitam eksklusif dengan kain satin kuning. Cocok untuk cinderamata wisuda, penghargaan rektor, dan kenang-kenangan akademik.',
    shortDescription: 'Plakat kuningan universitas dengan box bludru hitam dan kain satin kuning'
  },
  // Gambar 2: Plakat Kapal Layar Universitas - Kayu Jati dengan logo - Box Kuning
  'plakat-pk-480': {
    name: 'Plakat Kayu Jati Logo Universitas Box Kuning',
    slug: 'plakat-kayu-jati-logo-universitas-box-kuning',
    description: 'Plakat kayu jati dengan ukiran logo universitas. Bahan kayu jati pilihan dengan finishing natural mengkilap, dilengkapi box kertas kuning premium. Ideal untuk souvenir kampus, hadiah wisuda, dan kenang-kenangan akademik.',
    shortDescription: 'Plakat kayu jati dengan logo universitas dan box kertas kuning'
  },
  // Gambar 3: Plakat DPRD Kota Bontang - Kuningan emas - Box Bludru Biru
  'plakat-pk-481': {
    name: 'Plakat Kuningan DPRD Box Bludru Biru',
    slug: 'plakat-kuningan-dprd-box-bludru-biru',
    description: 'Plakat kuningan untuk DPRD dan instansi pemerintah daerah. Bahan kuningan dengan plat nama presisi, dilengkapi box bludru biru elegan. Cocok untuk penghargaan pejabat, cinderamata resmi, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan DPRD dengan box bludru biru'
  },
  // Gambar 4: Plakat Dwijendra University Bali - Medali Emas - Box Bludru Biru
  'plakat-pk-482': {
    name: 'Plakat Medali Emas Universitas Box Bludru Biru',
    slug: 'plakat-medali-emas-universitas-box-bludru-biru',
    description: 'Plakat medali emas untuk universitas dan instansi pendidikan. Bahan logam dengan finishing emas, dilengkapi box bludru biru. Cocok untuk penghargaan akademik, cinderamata wisuda, dan kenang-kenangan kampus.',
    shortDescription: 'Plakat medali emas universitas dengan box bludru biru'
  },
  // Gambar 5: Plakat IOF Offroad Federation - Medali Emas - Box Kayu
  'plakat-pk-483': {
    name: 'Plakat Medali Emas Organisasi Box Kayu',
    slug: 'plakat-medali-emas-organisasi-box-kayu',
    description: 'Plakat medali emas untuk organisasi dan komunitas. Bahan logam dengan finishing emas, dilengkapi box kayu natural. Cocok untuk penghargaan organisasi, cinderamata komunitas, dan kenang-kenangan event.',
    shortDescription: 'Plakat medali emas organisasi dengan box kayu'
  },
  // Gambar 6: Plakat BPTD Kalimantan Barat - Shield - Box Hitam
  'plakat-pk-484': {
    name: 'Plakat Shield Perisai Instansi Box Hitam',
    slug: 'plakat-shield-perisai-instansi-box-hitam',
    description: 'Plakat berbentuk perisai/shield untuk instansi pemerintah. Bahan logam dengan finishing premium, dilengkapi box hitam elegan. Cocok untuk penghargaan instansi, cinderamata resmi, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat shield perisai instansi dengan box hitam'
  },
  // Gambar 7: Plakat Pemprov Kepulauan Riau - Kuningan - Box Kayu dengan kain satin merah
  'plakat-pk-485': {
    name: 'Plakat Kuningan Pemprov Box Kayu dengan Aksen Kain Satin Merah',
    slug: 'plakat-kuningan-pemprov-box-kayu-kain-satin-merah',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box kayu dengan aksen kain satin merah. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box kayu dan kain satin merah'
  },
  // Gambar 8: Plakat Kota Bontang - Kuningan dengan ornamen - Box Bludru Biru
  'plakat-pk-486': {
    name: 'Plakat Kuningan Kota Box Bludru Biru',
    slug: 'plakat-kuningan-kota-box-bludru-biru',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan ornamen dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru biru'
  },
  // Gambar 9: Plakat DPR RI - Garuda Emas pada Kayu Hitam - Tanpa box
  'plakat-pk-487': {
    name: 'Plakat Kayu Garuda DPR RI',
    slug: 'plakat-kayu-garuda-dpr-ri',
    description: 'Plakat kayu dengan ukiran Garuda Pancasila untuk DPR RI. Bahan kayu jati dengan finishing hitam mengkilap. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk penghargaan resmi dan cinderamata pemerintahan.',
    shortDescription: 'Plakat kayu Garuda untuk DPR RI, box dijual terpisah'
  },
  // Gambar 10: Plakat Pemprov Kepri - Kuningan - Box Kayu dengan kain satin merah
  'plakat-pk-488': {
    name: 'Plakat Kuningan Pemprov Box Kayu dengan Aksen Kain Satin Merah',
    slug: 'plakat-kuningan-pemprov-box-kayu-kain-satin-merah-2',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box kayu dengan aksen kain satin merah. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box kayu dan kain satin merah'
  },
  // Gambar 11: Plakat Kejaksaan Tinggi Kepri - Kuningan - Box Bludru Merah
  'plakat-pk-489': {
    name: 'Plakat Kuningan Kejaksaan Box Bludru Merah',
    slug: 'plakat-kuningan-kejaksaan-box-bludru-merah',
    description: 'Plakat kuningan untuk Kejaksaan Tinggi. Bahan kuningan dengan plat nama, dilengkapi box bludru merah eksklusif. Cocok untuk penghargaan jaksa, cinderamata resmi, dan kenang-kenangan instansi hukum.',
    shortDescription: 'Plakat kuningan Kejaksaan dengan box bludru merah'
  },
  // Gambar 12: Plakat Pemprov Kepri - Kuningan - Box Kayu dengan kain satin merah
  'plakat-pk-490': {
    name: 'Plakat Kuningan Pemprov Box Kayu dengan Aksen Kain Satin Merah',
    slug: 'plakat-kuningan-pemprov-box-kayu-kain-satin-merah-3',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box kayu dengan aksen kain satin merah. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box kayu dan kain satin merah'
  },
  // Gambar 13: Plakat SMP Negeri 8 Yogyakarta - Kayu Ukir Gunungan - Tanpa box
  'plakat-pk-491': {
    name: 'Plakat Kayu Ukir Sekolah',
    slug: 'plakat-kayu-ukir-sekolah',
    description: 'Plakat kayu dengan ukiran gunungan untuk sekolah. Bahan kayu jati dengan ukiran tangan halus. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk cinderamata sekolah, penghargaan guru, dan kenang-kenangan pendidikan.',
    shortDescription: 'Plakat kayu ukir gunungan untuk sekolah, box dijual terpisah'
  },
  // Gambar 14: Plakat IAIN Sorong - Kuningan dengan motif hijau - Tanpa box
  'plakat-pk-492': {
    name: 'Plakat Kuningan Institusi Pendidikan',
    slug: 'plakat-kuningan-institusi-pendidikan',
    description: 'Plakat kuningan untuk institusi pendidikan. Bahan kuningan dengan motif dan plat nama. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk cinderamata kampus, penghargaan dosen, dan kenang-kenangan akademik.',
    shortDescription: 'Plakat kuningan institusi pendidikan, box dijual terpisah'
  },
  // Gambar 16: Plakat Pemprov Kepri - Kuningan - Box Bludru Merah dengan kain satin kuning
  'plakat-pk-493': {
    name: 'Plakat Kuningan Pemprov Box Bludru Merah dengan Aksen Kain Satin Kuning',
    slug: 'plakat-kuningan-pemprov-box-bludru-merah-kain-satin-kuning',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box bludru merah dengan aksen kain satin kuning. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box bludru merah dan kain satin kuning'
  },
  // Gambar 17: Plakat Biro Pengadaan Kepri - Kuningan - Box Bludru Merah dengan kain satin kuning
  'plakat-pk-494': {
    name: 'Plakat Kuningan Instansi Pemerintah Box Bludru Merah dengan Aksen Kain Satin Kuning',
    slug: 'plakat-kuningan-instansi-pemerintah-box-bludru-merah-kain-satin-kuning',
    description: 'Plakat kuningan untuk instansi pemerintah. Bahan kuningan dengan plat nama, dilengkapi box bludru merah dengan aksen kain satin kuning. Cocok untuk cinderamata instansi, penghargaan pegawai, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan instansi pemerintah dengan box bludru merah dan kain satin kuning'
  },
  // Gambar 18: Plakat UNMISS - Kayu Jati - Box Kuning dengan kain satin kuning
  'plakat-pk-495': {
    name: 'Plakat Kayu Jati Instansi Internasional Box Kuning dengan Aksen Kain Satin Kuning',
    slug: 'plakat-kayu-jati-instansi-internasional-box-kuning-kain-satin-kuning',
    description: 'Plakat kayu jati untuk instansi internasional. Bahan kayu jati dengan ukiran dan plat nama, dilengkapi box kertas kuning dengan aksen kain satin kuning. Cocok untuk cinderamata diplomatik, penghargaan kerja sama, dan kenang-kenangan internasional.',
    shortDescription: 'Plakat kayu jati instansi internasional dengan box kuning dan kain satin kuning'
  },
  // Gambar 19: Plakat PKK Kota Madiun - Kuningan - Box Kayu
  'plakat-pk-496': {
    name: 'Plakat Kuningan Organisasi Box Kayu',
    slug: 'plakat-kuningan-organisasi-box-kayu',
    description: 'Plakat kuningan untuk organisasi kemasyarakatan. Bahan kuningan dengan logo dan plat nama, dilengkapi box kayu natural. Cocok untuk cinderamata organisasi, penghargaan anggota, dan kenang-kenangan kegiatan.',
    shortDescription: 'Plakat kuningan organisasi dengan box kayu'
  },
  // Gambar 20: Plakat SPIM - Kuningan dengan aksen silver - Box Bludru Biru
  'plakat-pk-497': {
    name: 'Plakat Kuningan Serikat Pekerja Box Bludru Biru',
    slug: 'plakat-kuningan-serikat-pekerja-box-bludru-biru',
    description: 'Plakat kuningan untuk serikat pekerja. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata serikat pekerja, penghargaan anggota, dan kenang-kenangan organisasi.',
    shortDescription: 'Plakat kuningan serikat pekerja dengan box bludru biru'
  },
  // Gambar 21: Plakat Forum Kota Sehat Padang - Kuningan - Box Batik
  'plakat-pk-498': {
    name: 'Plakat Kuningan Forum Kesehatan Box Batik',
    slug: 'plakat-kuningan-forum-kesehatan-box-batik',
    description: 'Plakat kuningan untuk forum kesehatan. Bahan kuningan dengan logo dan plat nama, dilengkapi box batik tradisional. Cocok untuk cinderamata kesehatan, penghargaan tenaga medis, dan kenang-kenangan program kesehatan.',
    shortDescription: 'Plakat kuningan forum kesehatan dengan box batik'
  },
  // Gambar 22: Plakat Kemendagri - Kuningan - Box Bludru Biru dengan kain satin kuning
  'plakat-pk-499': {
    name: 'Plakat Kuningan Kemendagri Box Bludru Biru dengan Aksen Kain Satin Kuning',
    slug: 'plakat-kuningan-kemendagri-box-bludru-biru-kain-satin-kuning',
    description: 'Plakat kuningan untuk Kementerian Dalam Negeri. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru dengan aksen kain satin kuning. Cocok untuk cinderamata kementerian, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan Kemendagri dengan box bludru biru dan kain satin kuning'
  },
  // Gambar 23: Plakat DPRD Salatiga - Medali bulat - Box Batik
  'plakat-pk-500': {
    name: 'Plakat Medali DPRD Box Batik',
    slug: 'plakat-medali-dprd-box-batik',
    description: 'Plakat medali untuk DPRD. Bahan logam dengan finishing premium, dilengkapi box batik tradisional. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan kenang-kenangan pemerintahan daerah.',
    shortDescription: 'Plakat medali DPRD dengan box batik'
  },
  // Gambar 24: Plakat ESDM - Kayu Jati dengan Akrilik - Tanpa box
  'plakat-pk-501': {
    name: 'Plakat Kayu Jati Akrilik Instansi',
    slug: 'plakat-kayu-jati-akrilik-instansi',
    description: 'Plakat kayu jati dengan aksen akrilik untuk instansi pemerintah. Bahan kayu jati dengan aksen akrilik biru. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk cinderamata instansi, penghargaan pegawai, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kayu jati dengan akrilik untuk instansi, box dijual terpisah'
  },
  // Gambar 25: Plakat Gadjah Mada - Kayu Jati dengan logo - Box Bludru Hitam
  'plakat-pk-502': {
    name: 'Plakat Kayu Jati Universitas Box Bludru Hitam',
    slug: 'plakat-kayu-jati-universitas-box-bludru-hitam',
    description: 'Plakat kayu jati dengan logo universitas. Bahan kayu jati dengan plat nama emas, dilengkapi box bludru hitam. Cocok untuk cinderamata kampus, penghargaan dosen, dan kenang-kenangan akademik.',
    shortDescription: 'Plakat kayu jati universitas dengan box bludru hitam'
  },
  // Gambar 26: Plakat Logo Perusahaan - Kayu Jati dengan ornamen emas - Tanpa box
  'plakat-pk-503': {
    name: 'Plakat Kayu Jati Logo Perusahaan',
    slug: 'plakat-kayu-jati-logo-perusahaan',
    description: 'Plakat kayu jati dengan logo perusahaan. Bahan kayu jati dengan ornamen emas. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk cinderamata perusahaan, penghargaan mitra bisnis, dan kenang-kenangan kerja sama.',
    shortDescription: 'Plakat kayu jati dengan logo perusahaan, box dijual terpisah'
  },
  // Gambar 27: Plakat TNI - Kayu dengan Garuda emas - Box Bludru Hitam
  'plakat-pk-504': {
    name: 'Plakat Kayu Garuda Militer Box Bludru Hitam',
    slug: 'plakat-kayu-garuda-militer-box-bludru-hitam',
    description: 'Plakat kayu dengan ukiran Garuda untuk instansi militer. Bahan kayu dengan finishing premium, dilengkapi box bludru hitam. Cocok untuk cinderamata TNI, penghargaan prajurit, dan kenang-kenangan kemiliteran.',
    shortDescription: 'Plakat kayu Garuda militer dengan box bludru hitam'
  },
  // Gambar 28: Plakat DPRD Madiun - Kuningan emas - Box Bludru Biru
  'plakat-pk-505': {
    name: 'Plakat Kuningan DPRD Box Bludru Biru',
    slug: 'plakat-kuningan-dprd-box-bludru-biru-2',
    description: 'Plakat kuningan untuk DPRD. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan kenang-kenangan pemerintahan daerah.',
    shortDescription: 'Plakat kuningan DPRD dengan box bludru biru'
  },
  // Gambar 29: Plakat Danrem - Shield emas - Box Bludru Biru
  'plakat-pk-506': {
    name: 'Plakat Shield Militer Box Bludru Biru',
    slug: 'plakat-shield-militer-box-bludru-biru',
    description: 'Plakat shield/perisai untuk instansi militer. Bahan logam dengan finishing emas, dilengkapi box bludru biru. Cocok untuk cinderamata TNI, penghargaan prajurit, dan kenang-kenangan kemiliteran.',
    shortDescription: 'Plakat shield militer dengan box bludru biru'
  },
  // Gambar 30: Plakat Defense University - Kayu Jati dengan logo - Box Merah
  'plakat-pk-507': {
    name: 'Plakat Kayu Jati Universitas Pertahanan Box Merah',
    slug: 'plakat-kayu-jati-universitas-pertahanan-box-merah',
    description: 'Plakat kayu jati untuk Universitas Pertahanan. Bahan kayu jati dengan logo dan plat nama, dilengkapi box merah. Cocok untuk cinderamata kampus pertahanan, penghargaan mahasiswa, dan kenang-kenangan akademik.',
    shortDescription: 'Plakat kayu jati Universitas Pertahanan dengan box merah'
  },
  // Gambar 31: Plakat KDK Indonesia - Frame Kayu dengan aksen emas
  'plakat-pk-508': {
    name: 'Plakat Frame Kayu Logo Perusahaan',
    slug: 'plakat-frame-kayu-logo-perusahaan',
    description: 'Plakat dengan frame kayu untuk logo perusahaan. Bahan kayu dengan finishing premium dan aksen emas. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk cinderamata perusahaan, penghargaan mitra bisnis, dan kenang-kenangan kerja sama.',
    shortDescription: 'Plakat frame kayu dengan logo perusahaan, box dijual terpisah'
  },
  // Gambar 32: Plakat Pertamina - Kuningan emas - Box Bludru Merah
  'plakat-pk-509': {
    name: 'Plakat Kuningan Pertamina Box Bludru Merah',
    slug: 'plakat-kuningan-pertamina-box-bludru-merah',
    description: 'Plakat kuningan untuk PT Pertamina. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata BUMN, penghargaan mitra strategis, dan kenang-kenangan kerja sama.',
    shortDescription: 'Plakat kuningan Pertamina dengan box bludru merah'
  },
  // Gambar 33: Plakat Pemkot Padang - Kuningan - Box Bludru Merah
  'plakat-pk-510': {
    name: 'Plakat Kuningan Pemkot Box Bludru Merah',
    slug: 'plakat-kuningan-pemkot-box-bludru-merah',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru merah'
  },
  // Gambar 34: Plakat Pemkot Cirebon - Kuningan - Box Bludru Merah
  'plakat-pk-511': {
    name: 'Plakat Kuningan Pemkot Box Bludru Merah',
    slug: 'plakat-kuningan-pemkot-box-bludru-merah-2',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru merah'
  },
  // Gambar 35: Plakat Harley Davidson - Kayu dengan Jam - Tanpa box
  'plakat-pk-512': {
    name: 'Plakat Kayu Jam Meja Perusahaan',
    slug: 'plakat-kayu-jam-meja-perusahaan',
    description: 'Plakat kayu dengan jam meja untuk perusahaan. Bahan kayu dengan finishing premium dan jam analog. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk cinderamata perusahaan, penghargaan karyawan teladan, dan hadiah spesial.',
    shortDescription: 'Plakat kayu dengan jam meja untuk perusahaan, box dijual terpisah'
  },
  // Gambar 36: Plakat Pemprov Riau - Kuningan - Box Kayu dengan kain satin merah
  'plakat-pk-513': {
    name: 'Plakat Kuningan Pemprov Box Kayu dengan Aksen Kain Satin Merah',
    slug: 'plakat-kuningan-pemprov-box-kayu-kain-satin-merah-4',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box kayu dengan aksen kain satin merah. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box kayu dan kain satin merah'
  },
  // Gambar 37: Plakat Pemkot Bontang - Kuningan - Box Bludru Biru
  'plakat-pk-514': {
    name: 'Plakat Kuningan Pemkot Box Bludru Biru',
    slug: 'plakat-kuningan-pemkot-box-bludru-biru',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru biru'
  },
  // Gambar 38: Plakat Bappeda - Kuningan - Box Bludru Biru
  'plakat-pk-515': {
    name: 'Plakat Kuningan Bappeda Box Bludru Biru',
    slug: 'plakat-kuningan-bappeda-box-bludru-biru',
    description: 'Plakat kuningan untuk Bappeda. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata instansi perencanaan, penghargaan pegawai, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan Bappeda dengan box bludru biru'
  },
  // Gambar 39: Plakat Pemkot Surabaya - Kuningan - Box Bludru Merah
  'plakat-pk-516': {
    name: 'Plakat Kuningan Pemkot Box Bludru Merah',
    slug: 'plakat-kuningan-pemkot-box-bludru-merah-3',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru merah'
  },
  // Gambar 40: Plakat Alexander Wijaya Karyawan Teladan - Akrilik berdiri - Tanpa box
  'plakat-pk-517': {
    name: 'Plakat Akrilik Karyawan Teladan',
    slug: 'plakat-akrilik-karyawan-teladan',
    description: 'Plakat akrilik untuk penghargaan karyawan teladan. Bahan akrilik bening dengan cetak UV. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk penghargaan karyawan, apresiasi kerja, dan kenang-kenangan perusahaan.',
    shortDescription: 'Plakat akrilik karyawan teladan, box dijual terpisah'
  },
  // Gambar 41: Plakat Pemprov Kepri - Kuningan - Box Bludru Merah
  'plakat-pk-518': {
    name: 'Plakat Kuningan Pemprov Box Bludru Merah',
    slug: 'plakat-kuningan-pemprov-box-bludru-merah',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box bludru merah'
  },
  // Gambar 42: Plakat Pemkot Denpasar - Kuningan - Box Bludru Merah
  'plakat-pk-519': {
    name: 'Plakat Kuningan Pemkot Box Bludru Merah',
    slug: 'plakat-kuningan-pemkot-box-bludru-merah-4',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru merah'
  },
  // Gambar 43: Plakat Pemkot Bogor - Kuningan - Box Bludru Merah
  'plakat-pk-520': {
    name: 'Plakat Kuningan Pemkot Box Bludru Merah',
    slug: 'plakat-kuningan-pemkot-box-bludru-merah-5',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru merah'
  },
  // Gambar 44: Plakat Pemprov Jateng - Kuningan - Box Bludru Merah
  'plakat-pk-521': {
    name: 'Plakat Kuningan Pemprov Box Bludru Merah',
    slug: 'plakat-kuningan-pemprov-box-bludru-merah-2',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box bludru merah'
  },
  // Gambar 45: Plakat Pemkot Madiun - Kuningan - Box Bludru Biru
  'plakat-pk-522': {
    name: 'Plakat Kuningan DPRD Box Bludru Biru',
    slug: 'plakat-kuningan-dprd-box-bludru-biru-3',
    description: 'Plakat kuningan untuk DPRD. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan kenang-kenangan pemerintahan daerah.',
    shortDescription: 'Plakat kuningan DPRD dengan box bludru biru'
  },
  // Gambar 46: Plakat Pemkot Solo - Kuningan - Box Bludru Merah
  'plakat-pk-523': {
    name: 'Plakat Kuningan Pemkot Box Bludru Merah',
    slug: 'plakat-kuningan-pemkot-box-bludru-merah-6',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru merah'
  },
  // Gambar 47: Plakat Pemkot Semarang - Kuningan - Box Bludru Merah
  'plakat-pk-524': {
    name: 'Plakat Kuningan Pemkot Box Bludru Merah',
    slug: 'plakat-kuningan-pemkot-box-bludru-merah-7',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru merah'
  },
  // Gambar 48: Plakat Pemkot Yogyakarta - Kuningan - Box Bludru Merah
  'plakat-pk-525': {
    name: 'Plakat Kuningan Pemkot Box Bludru Merah',
    slug: 'plakat-kuningan-pemkot-box-bludru-merah-8',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru merah'
  },
  // Gambar 49: Plakat Pemkot Bandung - Kuningan - Box Bludru Merah
  'plakat-pk-526': {
    name: 'Plakat Kuningan Pemkot Box Bludru Merah',
    slug: 'plakat-kuningan-pemkot-box-bludru-merah-9',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru merah'
  },
  // Gambar 50: Plakat Kovalchuk Oksana - Kayu dengan Akrilik - Tanpa box
  'plakat-pk-527': {
    name: 'Plakat Kayu Akrilik Kerja Sama',
    slug: 'plakat-kayu-akrilik-kerja-sama',
    description: 'Plakat kayu dengan aksen akrilik untuk kerja sama. Bahan kayu dengan aksen akrilik bening. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk cinderamata kerja sama, penghargaan mitra, dan kenang-kenangan bisnis.',
    shortDescription: 'Plakat kayu akrilik untuk kerja sama, box dijual terpisah'
  },
  // Gambar 51: Plakat Pemprov Kepri - Kuningan - Box Bludru Merah
  'plakat-pk-528': {
    name: 'Plakat Kuningan Pemprov Box Bludru Merah',
    slug: 'plakat-kuningan-pemprov-box-bludru-merah-3',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box bludru merah'
  },
  // Gambar 52: Plakat Pemkot - Kuningan - Box Bludru Merah
  'plakat-pk-529': {
    name: 'Plakat Kuningan Pemkot Box Bludru Merah',
    slug: 'plakat-kuningan-pemkot-box-bludru-merah-10',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box bludru merah'
  },
  // Gambar 53: Plakat Instansi - Kuningan - Box Bludru Merah
  'plakat-pk-530': {
    name: 'Plakat Kuningan Instansi Box Bludru Merah',
    slug: 'plakat-kuningan-instansi-box-bludru-merah',
    description: 'Plakat kuningan untuk instansi pemerintah. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata instansi, penghargaan pegawai, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan instansi dengan box bludru merah'
  },
  // Gambar 54: Plakat Instansi - Kuningan - Box Bludru Merah
  'plakat-pk-531': {
    name: 'Plakat Kuningan Instansi Box Bludru Merah',
    slug: 'plakat-kuningan-instansi-box-bludru-merah-2',
    description: 'Plakat kuningan untuk instansi pemerintah. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah. Cocok untuk cinderamata instansi, penghargaan pegawai, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan instansi dengan box bludru merah'
  },
  // Gambar 55: Plakat Kavaleri - Kuningan dengan kuda - Box Bludru Merah dengan kain satin kuning
  'plakat-pk-532': {
    name: 'Plakat Kuningan Militer Box Bludru Merah dengan Aksen Kain Satin Kuning',
    slug: 'plakat-kuningan-militer-box-bludru-merah-kain-satin-kuning',
    description: 'Plakat kuningan untuk instansi militer. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru merah dengan aksen kain satin kuning. Cocok untuk cinderamata TNI, penghargaan prajurit, dan kenang-kenangan kemiliteran.',
    shortDescription: 'Plakat kuningan militer dengan box bludru merah dan kain satin kuning'
  },
  // Gambar 56: Plakat Pemprov - Kuningan - Box Bludru Merah dengan kain satin kuning
  'plakat-pk-533': {
    name: 'Plakat Kuningan Pemprov Box Bludru Merah dengan Aksen Kain Satin Kuning',
    slug: 'plakat-kuningan-pemprov-box-bludru-merah-kain-satin-kuning-2',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box bludru merah dengan aksen kain satin kuning. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box bludru merah dan kain satin kuning'
  },
  // Gambar 58: Plakat Pemprov - Kuningan - Box Bludru Merah dengan kain satin kuning
  'plakat-pk-534': {
    name: 'Plakat Kuningan Pemprov Box Bludru Merah dengan Aksen Kain Satin Kuning',
    slug: 'plakat-kuningan-pemprov-box-bludru-merah-kain-satin-kuning-3',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box bludru merah dengan aksen kain satin kuning. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box bludru merah dan kain satin kuning'
  },
  // Gambar 59: Plakat Pemprov - Kuningan - Box Bludru Merah dengan kain satin kuning
  'plakat-pk-535': {
    name: 'Plakat Kuningan Pemprov Box Bludru Merah dengan Aksen Kain Satin Kuning',
    slug: 'plakat-kuningan-pemprov-box-bludru-merah-kain-satin-kuning-4',
    description: 'Plakat kuningan untuk pemerintah provinsi. Bahan kuningan dengan plat nama, dilengkapi box bludru merah dengan aksen kain satin kuning. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan pemerintah provinsi dengan box bludru merah dan kain satin kuning'
  },
  // Gambar 60: Plakat Shield Bali - Kuningan - Box Bludru Merah
  'plakat-pk-536': {
    name: 'Plakat Shield Provinsi Box Bludru Merah',
    slug: 'plakat-shield-provinsi-box-bludru-merah',
    description: 'Plakat shield/perisai untuk provinsi. Bahan logam dengan finishing emas, dilengkapi box bludru merah. Cocok untuk cinderamata provinsi, penghargaan pejabat, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat shield provinsi dengan box bludru merah'
  },
  // Gambar 61: Plakat Angkatan Laut - Kayu Jati dengan ukiran - Tanpa box
  'plakat-pk-537': {
    name: 'Plakat Kayu Jati Angkatan Laut',
    slug: 'plakat-kayu-jati-angkatan-laut',
    description: 'Plakat kayu jati untuk Angkatan Laut. Bahan kayu jati dengan ukiran logo. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk cinderamata AL, penghargaan prajurit, dan kenang-kenangan kemiliteran.',
    shortDescription: 'Plakat kayu jati Angkatan Laut, box dijual terpisah'
  },
  // Gambar 62: Plakat DPRD Madiun - Medali bulat dengan pen holder - Box Bludru Biru
  'plakat-pk-538': {
    name: 'Plakat Medali DPRD dengan Pen Holder Box Bludru Biru',
    slug: 'plakat-medali-dprd-pen-holder-box-bludru-biru',
    description: 'Plakat medali untuk DPRD dengan pen holder. Bahan logam dengan finishing premium, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan hadiah resmi.',
    shortDescription: 'Plakat medali DPRD dengan pen holder dan box bludru biru'
  },
  // Gambar 63: Plakat DPRD - Kuningan - Box Bludru Biru
  'plakat-pk-539': {
    name: 'Plakat Kuningan DPRD Box Bludru Biru',
    slug: 'plakat-kuningan-dprd-box-bludru-biru-4',
    description: 'Plakat kuningan untuk DPRD. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan kenang-kenangan pemerintahan daerah.',
    shortDescription: 'Plakat kuningan DPRD dengan box bludru biru'
  },
  // Gambar 64: Plakat DPRD - Kuningan - Box Bludru Biru
  'plakat-pk-540': {
    name: 'Plakat Kuningan DPRD Box Bludru Biru',
    slug: 'plakat-kuningan-dprd-box-bludru-biru-5',
    description: 'Plakat kuningan untuk DPRD. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan kenang-kenangan pemerintahan daerah.',
    shortDescription: 'Plakat kuningan DPRD dengan box bludru biru'
  },
  // Gambar 65: Plakat Angkatan Laut - Kayu Jati dengan ukiran - Tanpa box
  'plakat-pk-541': {
    name: 'Plakat Kayu Jati TNI AL',
    slug: 'plakat-kayu-jati-tni-al',
    description: 'Plakat kayu jati untuk TNI Angkatan Laut. Bahan kayu jati dengan ukiran logo. Box dijual terpisah, bisa custom sesuai kebutuhan. Cocok untuk cinderamata AL, penghargaan prajurit, dan kenang-kenangan kemiliteran.',
    shortDescription: 'Plakat kayu jati TNI AL, box dijual terpisah'
  },
  // Gambar 66: Plakat Instansi - Kuningan - Box Bludru Biru
  'plakat-pk-542': {
    name: 'Plakat Kuningan Instansi Box Bludru Biru',
    slug: 'plakat-kuningan-instansi-box-bludru-biru',
    description: 'Plakat kuningan untuk instansi pemerintah. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata instansi, penghargaan pegawai, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan instansi dengan box bludru biru'
  },
  // Gambar 67: Plakat Instansi - Kuningan - Box Bludru Biru
  'plakat-pk-543': {
    name: 'Plakat Kuningan Instansi Box Bludru Biru',
    slug: 'plakat-kuningan-instansi-box-bludru-biru-2',
    description: 'Plakat kuningan untuk instansi pemerintah. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata instansi, penghargaan pegawai, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan instansi dengan box bludru biru'
  },
  // Gambar 68: Plakat Instansi - Kuningan - Box Bludru Biru
  'plakat-pk-544': {
    name: 'Plakat Kuningan Instansi Box Bludru Biru',
    slug: 'plakat-kuningan-instansi-box-bludru-biru-3',
    description: 'Plakat kuningan untuk instansi pemerintah. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata instansi, penghargaan pegawai, dan kenang-kenangan resmi.',
    shortDescription: 'Plakat kuningan instansi dengan box bludru biru'
  },
  // Gambar 69: Plakat DPRD Madiun - Medali bulat dengan pen holder - Box Bludru Biru
  'plakat-pk-545': {
    name: 'Plakat Medali DPRD dengan Pen Holder Box Bludru Biru',
    slug: 'plakat-medali-dprd-pen-holder-box-bludru-biru-2',
    description: 'Plakat medali untuk DPRD dengan pen holder. Bahan logam dengan finishing premium, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan hadiah resmi.',
    shortDescription: 'Plakat medali DPRD dengan pen holder dan box bludru biru'
  },
  // Gambar 70: Plakat DPRD Madiun - Medali bulat dengan pen holder - Box Bludru Biru
  'plakat-pk-546': {
    name: 'Plakat Medali DPRD dengan Pen Holder Box Bludru Biru',
    slug: 'plakat-medali-dprd-pen-holder-box-bludru-biru-3',
    description: 'Plakat medali untuk DPRD dengan pen holder. Bahan logam dengan finishing premium, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan hadiah resmi.',
    shortDescription: 'Plakat medali DPRD dengan pen holder dan box bludru biru'
  },
  // Gambar 71: Plakat DPRD - Kuningan - Box Bludru Biru
  'plakat-pk-547': {
    name: 'Plakat Kuningan DPRD Box Bludru Biru',
    slug: 'plakat-kuningan-dprd-box-bludru-biru-6',
    description: 'Plakat kuningan untuk DPRD. Bahan kuningan dengan logo dan plat nama, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan kenang-kenangan pemerintahan daerah.',
    shortDescription: 'Plakat kuningan DPRD dengan box bludru biru'
  }
};

// Update products
let updatedCount = 0;
let skippedCount = 0;

products.forEach(product => {
  if (nameUpdates[product.id]) {
    const update = nameUpdates[product.id];
    product.name = update.name;
    product.slug = update.slug;
    product.description = update.description;
    product.shortDescription = update.shortDescription;
    updatedCount++;
    console.log(`UPDATE: ${product.id} -> ${update.name}`);
  } else if (product.subcategoryId === 'pkp' && product.name.match(/^Plakat Kayu Premium \d+$/)) {
    skippedCount++;
    console.log(`SKIP (no mapping): ${product.id} | ${product.name}`);
  }
});

// Write updated products
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

console.log(`\nRingkasan:`);
console.log(`- Produk diupdate: ${updatedCount}`);
console.log(`- Produk di-skip (tidak ada mapping): ${skippedCount}`);
console.log(`- Total produk: ${products.length}`);
