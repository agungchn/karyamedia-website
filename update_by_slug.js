const fs = require('fs');

const filePath = 'src/data/articles.ts';
let content = fs.readFileSync(filePath, 'utf8');

// List of (title, correct image path) from user
const items = [
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

// Helper to slugify a title (lowercase, replace non-alphanumeric with hyphen, trim)
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

let updated = 0;
for (const [title, newImage] of items) {
  const slug = slugify(title);
  // Find the article with this slug
  const slugPattern = `slug: "${slug}"`;
  const pos = content.indexOf(slugPattern);
  if (pos === -1) {
    console.log(`❌ Slug not found: ${slug} (from "${title}")`);
    continue;
  }
  // Find the opening brace before this slug
  let braceCount = 0;
  let i = pos;
  while (i >= 0) {
    const ch = content[i];
    if (ch === '}') braceCount++;
    if (ch === '{') {
      if (braceCount === 0) break;
      braceCount--;
    }
    i--;
  }
  const openBraceIdx = i;
  // Find the matching closing brace
  braceCount = 0;
  let j = openBraceIdx;
  while (j < content.length) {
    const ch = content[j];
    if (ch === '{') braceCount++;
    if (ch === '}') {
      braceCount--;
      if (braceCount === 0) break;
    }
    j++;
  }
  const closeBraceIdx = j;
  // Extract the article
  const article = content.slice(openBraceIdx, closeBraceIdx + 1);
  // Replace image line
  const newArticle = article.replace(/image: "[^"]+"/, `image: "${newImage}"`);
  // Replace in content
  content = content.slice(0, openBraceIdx) + newArticle + content.slice(closeBraceIdx + 1);
  updated++;
  console.log(`✅ Updated ${slug}`);
}

fs.writeFileSync(filePath, content);
console.log(`\nUpdated ${updated} article(s).`);