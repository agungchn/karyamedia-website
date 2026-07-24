const fs = require('fs');
const path = require('path');

const filePath = 'src/data/articles.ts';
let content = fs.readFileSync(filePath, 'utf8');

// List of (identifier, correct image path) from user
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
for (const [identifier, newImage] of fixes) {
  // Determine if identifier looks like a slug (no spaces, contains hyphens)
  const isLikelySlug = !identifier.includes(' ') && identifier.includes('-');
  let found = false;
  const lines = content.split('\n');
  let inArticle = false;
  let braceCount = 0;
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('slug:')) {
      // Extract slug value
      const slugMatch = line.match(/slug: "([^"]+)"/);
      if (slugMatch) {
        const slug = slugMatch[1];
        if (isLikelySlug && slug === identifier) {
          // Match by slug
          found = true;
          // Now we need to find the article boundaries
          // We'll backtrack to find the opening brace
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
        } else if (!isLikelySlug && line.includes(identifier)) {
          // Match by title substring in the title line
          // We need to find the title line for this article
          // Actually we are already in a loop over lines, and we just found a slug line.
          // We need to check if the title line of this article contains the identifier.
          // Let's look backwards and forwards for the title line within the same article.
          // For simplicity, we'll assume the title line is within a few lines of the slug line.
          // We'll search from startIdx (which we haven't set yet) but we can do a separate search.
          // Instead, let's do a two-pass approach: first find article by slug, then check title.
          // But we already have the slug line index i. Let's find the article boundaries first.
          // We'll backtrack to find the opening brace.
          let j = i;
          while (j >= 0 && !(lines[j].trim() === '{' && braceCount === 0)) {
            if (lines[j].trim() === '}') braceCount++;
            if (lines[j].trim() === '{') braceCount--;
            j--;
          }
          startIdx = j + 1;
          braceCount = 0;
          // Now scan forward to find the closing brace and also check for title line
          let k = startIdx;
          let titleFound = false;
          while (k < lines.length) {
            const l = lines[k];
            if (l.trim().startsWith('title:') && l.includes(identifier)) {
              titleFound = true;
            }
            if (l.trim() === '{') braceCount++;
            if (l.trim() === '}') braceCount--;
            if (braceCount === 0 && l.trim() === '}') {
              // We have the article from startIdx to k inclusive
              if (titleFound) {
                // Replace the image line within this range
                for (let li = startIdx; li <= k; li++) {
                  if (lines[li].trim().startsWith('image:')) {
                    lines[li] = `    image: "${newImage}",`;
                    updated++;
                    break;
                  }
                }
                found = true;
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
    }
    // Track braces for future (though we break after first match)
    if (line.trim() === '{') braceCount++;
    if (line.trim() === '}') braceCount--;
  }
  if (!found) {
    console.log(`❌ Not found: "${identifier}"`);
  }
}

fs.writeFileSync(filePath, content);
console.log(`Updated ${updated} article image(s).`);