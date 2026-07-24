const fs = require('fs');

const filePath = 'src/data/articles.ts';
let content = fs.readFileSync(filePath, 'utf8');

// List of (title substring, correct image path) from user
const fixes = [
  ['Piala Resin untuk Pemerintahan Kalimantan Utara', '/images/produk-unggulan/piala-golf/piala-golf-4.png'],
  ['biaya-pembuatan-plakat-custom', '/images/plakat-akrilik/plakat-akrilik-23.png'],
  ['Media Karya dalam Dunia Plakat dan Souvenir Custom', '/images/plakat-akrilik/plakat-akrilik-51.png'],
  ['Piala Resin untuk Kampus Gorontalo: Tren Terkini', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-10.png'],
  ['Plakat Kayu untuk Komunitas Kepulauan Bangka Belitung', '/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-58.png'],
  ['Samir Wisuda untuk Pemerintahan Lengkap', '/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png'],
  ['Plakat Akrilik untuk Komunitas Papua Pegunungan Lengkap', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-14.png'],
  ['Menghitung Value Nama Dada Custom untuk Pengadaan', '/images/produk-unggulan/name-tag/name-tag-18.png'],
  ['Papan Nama Dada Custom', '/images/produk-unggulan/name-tag/name-tag-15.png'],
  ['Kalung Wisuda Custom Berkualitas Tinggi dari Yogyakarta', '/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-3.png'],
  ['Produsen Mendali Wisuda Custom Berkualitas - Karyamedia', '/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png'],
  ['Gordon Wisuda Custom Terbaik untuk Kampus & Instansi', '/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-28.png'],
  ['Medali Kelulusan Custom: Mitos vs Fakta & Panduan Lengkap', '/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-5.png'],
  ['Souvenir untuk Acara Reuni: Pilihan Hemat & Berkelas', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-88.png'],
  ['Tongkat Rektor Kayu Jati Custom untuk Pelantikan Rektor', '/images/produk-unggulan/tongkat-rektor/tongkat-rektor-2.png'],
  ['Prasasti Batas Wilayah Kabupaten: Solusi Resmi untuk -', '/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (10).png'],
  ['Toko Souvenir Terdekat untuk Instansi & Event di Yogyakarta', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-75.png'],
  ['Panduan Lengkap Souvenir Pernikahan Custom', '/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-3.png'],
  ['Kenapa Souvenir Custom Tidak Bisa Langsung Ada Pricelist?', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-9.png'],
  ['Plakat Akrilik untuk Pemerintahan Kepulauan Bangka Belitung', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-40.png'],
  ['Plakat Penghargaan untuk Pemerintahan Jawa Timur', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-65.png'],
  ['Plakat Akrilik untuk Kampus Jawa Barat - Karyamedia', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-83.png'],
  ['Ide Souvenir Pernikahan yang Unik dan Berkesan untuk Tamu…', '/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-4.png'],
  ['Ide Souvenir Wisuda Tahfidz dan Santri Pondok Pesantren', '/images/produk-unggulan/plakat-marmer/plakat-marmer-42.png'],
];

let updated = 0;
const lines = content.split('\n');

for (const [titleSubstr, newImage] of fixes) {
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Look for a line that contains 'title: "' and then the titleSubstr
    if (line.includes('title: "') && line.includes(titleSubstr)) {
      // Found the title line of the article we want to update.
      // Now, find the start and end of the object.
      let braceCount = 0;
      let start = i;
      // Go backwards to find the opening brace of this object.
      while (start >= 0) {
        const l = lines[start];
        const trimmed = l.trim();
        if (trimmed === '{') {
          braceCount--;
          if (braceCount === 0) break;
        } else if (trimmed === '}') {
          braceCount++;
        }
        start--;
      }
      // Now, start is at the line with the matching '{' (where braceCount became 0 after decrementing).
      // Actually, we broke when we found the '{' and made braceCount 0, so start is the index of that '{'.
      // Now, go forward to find the closing brace.
      let end = i;
      braceCount = 0;
      while (end < lines.length) {
        const l = lines[end];
        const trimmed = l.trim();
        if (trimmed === '{') braceCount++;
        if (trimmed === '}') {
          braceCount--;
          if (braceCount === 0) break;
        }
        end++;
      }
      // Now, the object is from start to end (inclusive).
      // Look for the line that contains 'image: "' within [start, end].
      for (let j = start; j <= end; j++) {
        if (lines[j].trim().startsWith('image:')) {
          lines[j] = `    image: "${newImage}",`;
          updated++;
          found = true;
          break;
        }
      }
      if (found) break; // break out of the outer loop for this titleSubstr
    }
  }
  if (!found) {
    console.log(`❌ Could not find article with title containing: "${titleSubstr}"`);
  }
}

const newContent = lines.join('\n');
fs.writeFileSync(filePath, newContent);
console.log(`\nUpdated ${updated} article image(s).`);