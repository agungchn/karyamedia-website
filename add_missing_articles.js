const fs = require('fs');
const path = require('path');

const currentFile = 'src/data/articles.ts';
const targetCommit = '0b8bdb0';

// Mapping from slug to correct image path (from user's list)
const imageMap = new Map([
  ['piala-resin-untuk-pemerintahan-kalimantan-utara', '/images/produk-unggulan/piala-golf/piala-golf-4.png'],
  ['biaya-pembuatan-plakat-custom', '/images/plakat-akrilik/plakat-akrilik-23.png'],
  ['media-karya-dalam-dunia-plakat-dan-souvenir-custom', '/images/plakat-akrilik/plakat-akrilik-51.png'],
  ['piala-resin-untuk-kampus-gorontalo-tren-terkini', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-10.png'],
  ['plakat-kayu-untuk-komunitas-kepulauan-bangka-belitung', '/images/produk-unggulan/plakat-kayu-eksklusif/plakat-kayu-eksklusif-58.png'],
  ['samir-wisuda-untuk-pemerintahan-lengkap', '/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png'],
  ['plakat-akrilik-untuk-komunitas-papua-pegunungan-lengkap', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-14.png'],
  ['menghitung-value-nama-dada-custom-untuk-pengadaan', '/images/produk-unggulan/name-tag/name-tag-18.png'],
  ['papan-nama-dada-custom', '/images/produk-unggulan/name-tag/name-tag-15.png'],
  ['kalung-wisuda-custom-berkualitas-tinggi-dari-yogyakarta', '/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-3.png'],
  ['produsen-mendali-wisuda-custom-berkualitas-karyamedia', '/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-21.png'],
  ['gordon-wisuda-custom-terbaik-untuk-kampus-instansi', '/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-28.png'],
  ['medali-kelulusan-custom-mitos-vs-fakta-panduan-lengkap', '/images/produk-unggulan/samir-wisuda/samir-wisuda-logam-5.png'],
  ['souvenir-untuk-acara-reuni-pilihan-hemat-berkelas', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-88.png'],
  ['tongkat-rektor-kayu-jati-custom-untuk-pelantikan-rektor', '/images/produk-unggulan/tongkat-rektor/tongkat-rektor-2.png'],
  ['prasasti-batas-wilayah-kabupaten-solusi-resmi-untuk', '/images/produk-unggulan/plakat-batas-wilayah/plakat-brastable/plakat-brastable (10).png'],
  ['toko-souvenir-terdekat-untuk-instansi-event-di-yogyakarta', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-75.png'],
  ['panduan-lengkap-souvenir-pernikahan-custom', '/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-3.png'],
  ['kenapa-souvenir-custom-tidak-bisa-langsung-ada-pricelist', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-9.png'],
  ['plakat-akrilik-untuk-pemerintahan-kepulauan-bangka-belitung', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-40.png'],
  ['plakat-penghargaan-untuk-pemerintahan-jawa-timur', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-65.png'],
  ['plakat-akrilik-untuk-kampus-jawa-barat-karyamedia', '/images/produk-unggulan/plakat-fiberglass/plakat-fiberglass-83.png'],
  ['ide-souvenir-pernikahan-yang-unik-dan-berkesan-untuk-tamu', '/images/produk-unggulan/souvenir-pernikahan/souvenir-pernikahan-4.png'],
  ['ide-souvenir-wisuda-tahfidz-dan-santri-pondok-pesantren', '/images/produk-unggulan/plakat-marmer/plakat-marmer-42.png'],
));

// Function to get file content from a git commit
function getFileFromCommit(commit, filePath) {
  const { execSync } = require('child_process');
  try {
    const output = execSync(`git show ${commit}:${filePath}`, { encoding: 'utf8' });
    return output;
  } catch (e) {
    console.error(`Failed to get ${filePath} from commit ${commit}:`, e.message);
    return null;
  }
}

// Extract article objects from a source text (assuming they are in the array export)
function extractArticles(source) {
  // Find the array: export const articles: Article[] = [
  const arrayStart = source.indexOf('export const articles: Article[] = [');
  if (arrayStart === -1) return [];
  // Find the matching closing bracket for the array (simplified: find the last ']' that matches the opening '[')
  // We'll instead extract by looking for each object that starts with '{' and has a slug
  const articles = [];
  let pos = arrayStart;
  while (pos < source.length) {
    // Look for the next '{' that starts an object (after whitespace/newline)
    const braceOpen = source.indexOf('{', pos);
    if (braceOpen === -1) break;
    // Check if this '{' is likely the start of an article object: look backwards for 'slug:' within a reasonable distance
    const before = source.substring(Math.max(0, braceOpen - 200), braceOpen);
    if (!before.includes('slug:')) {
      pos = braceOpen + 1;
      continue;
    }
    // Now find the matching closing brace
    let braceCount = 0;
    let i = braceOpen;
    while (i < source.length) {
      const ch = source[i];
      if (ch === '{') braceCount++;
      if (ch === '}') {
        braceCount--;
        if (braceCount === 0) {
          // Found the end of the object
          const obj = source.substring(braceOpen, i + 1);
          articles.push(obj);
          pos = i + 1;
          break;
        }
      }
      i++;
    }
    if (i >= source.length) break;
  }
  return articles;
}

// Get the current content
let currentContent = fs.readFileSync(currentFile, 'utf8');
// Get the target commit content
const targetContent = getFileFromCommit(targetCommit, currentFile);
if (!targetContent) process.exit(1);

// Extract articles from target
const targetArticles = extractArticles(targetContent);
console.log(`Found ${targetArticles.length} articles in commit ${targetCommit}`);

// Build a map from slug to article object (from target)
const targetMap = new Map();
for (const article of targetArticles) {
  const slugMatch = article.match(/slug: "([^"]+)"/);
  if (slugMatch) {
    const slug = slugMatch[1];
    targetMap.set(slug, article);
  }
}

// For each slug in our imageMap, if it exists in targetMap, we will ensure it's in currentContent
let added = 0;
let updated = 0;
for (const [slug, correctImage] of imageMap.entries()) {
  // Check if this slug already exists in current content
  if (currentContent.includes(`slug: "${slug}"`)) {
    // It exists, we just need to update the image if it's wrong
    // We'll do a simple replace: find the article and replace its image line
    // We'll use a regex that matches from the slug to the closing brace of that object
    // But to avoid complexity, we'll just replace the image line globally? Not safe.
    // Instead, we'll do a more targeted replacement: find the article block and replace image.
    // Since we already have the article from target (if exists), we can use that as template but with updated image.
    // However, the current article might have been modified (e.g., content changes). We only want to update the image.
    // Let's find the article in current content by slug and replace its image line.
    const articleStart = currentContent.indexOf(`slug: "${slug}"`);
    if (articleStart === -1) {
      // Should not happen because we checked includes, but just in case
      continue;
    }
    // Find the opening brace before this slug
    let braceCount = 0;
    let i = articleStart;
    while (i >= 0) {
      const ch = currentContent[i];
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
    while (j < currentContent.length) {
      const ch = currentContent[j];
      if (ch === '{') braceCount++;
      if (ch === '}') {
        braceCount--;
        if (braceCount === 0) break;
      }
      j++;
    }
    const closeBraceIdx = j;
    // Extract the current article
    const currentArticle = currentContent.slice(openBraceIdx, closeBraceIdx + 1);
    // Replace the image line in this article
    const newArticle = currentArticle.replace(/image: "[^"]+"/, `image: "${correctImage}"`);
    // If changed, replace in current content
    if (newArticle !== currentArticle) {
      currentContent = currentContent.slice(0, openBraceIdx) + newArticle + currentContent.slice(closeBraceIdx + 1);
      updated++;
      console.log(`🔄 Updated image for existing slug: ${slug}`);
    }
  } else {
    // The article is missing; we need to add it from target
    const targetArticle = targetMap.get(slug);
    if (!targetArticle) {
      console.log(`⚠️  Slug ${slug} not found in target commit ${targetCommit}`);
      continue;
    }
    // Replace the image in the target article with the correct one
    let articleToAdd = targetArticle.replace(/image: "[^"]+"/, `image: "${correctImage}"`);
    // Insert into current content: we'll insert before the closing ']' of the exports array
    const insertPos = currentContent.lastIndexOf('];');
    if (insertPos === -1) {
      console.log(`❌ Could not find insertion point in ${currentFile}`);
      continue;
    }
    // Insert a newline and the article, properly indented (assuming 2 spaces for array items)
    currentContent = currentContent.slice(0, insertPos) + '\n  ' + articleToAdd.trim() + ',\n' + currentContent.slice(insertPos);
    added++;
    console.log(`➕ Added missing article: ${slug}`);
  }
}

// Write back the updated content
fs.writeFileSync(currentFile, currentContent);
console.log(`\nDone. Added: ${added}, Updated: ${updated}`);