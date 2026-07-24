const fs = require('fs');
const path = require('path');

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
for (const [titleSubstr, newImage] of fixes) {
  // Find the article that contains this title substring in its title line
  const lines = content.split('\n');
  let inArticle = false;
  let braceCount = 0;
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('title:')) {
      // Check if this title line contains our substring
      if (line.includes(titleSubstr)) {
        // We found the article, now we need to find the whole object
        // Retrace to find the opening brace of this object
        let j = i;
        while (j >= 0 && !(lines[j].trim() === '{' && braceCount === 0)) {
          if (lines[j].trim() === '}') braceCount++;
          if (lines[j].trim() === '{') braceCount--;
          j--;
        }
        startIdx = j + 1;
        braceCount = 0;
        // Now scan forward to find the closing brace
        let k = startIdx;
        while (k < lines.length) {
          const l = lines[k];
          if (l.trim() === '{') braceCount++;
          if (l.trim() === '}') braceCount--;
          if (braceCount === 0 && l.trim() === '}') {
            // We have the article from startIdx to k inclusive
            // Replace the image line within this range
            for (let li = startIdx; li <= k; li++) {
              if (lines[li].trim().startsWith('image:')) {
                lines[li] = `    image: "${newImage}",`;
                updated++;
                break;
              }
            }
            break;
          }
          k++;
        }
        // Rebuild content
        content = lines.join('\n');
        break; // exit outer loop after first match (assuming unique)
      }
    }
    // Track braces for future (though we break after first match)
    if (line.trim() === '{') braceCount++;
    if (line.trim() === '}') braceCount--;
  }
}

fs.writeFileSync(filePath, content);
console.log(`Updated ${updated} article image(s).`);

// Optional: show a diff of what changed
const { execSync } = require('child_process');
try {
  const diff = execSync('git diff --no-index /dev/null ' + filePath, { encoding: 'utf8' });
  console.log('Diff (first 20 lines):');
  console.log(diff.split('\n').slice(0, 20).join('\n'));
} catch (e) {
  // ignore
}