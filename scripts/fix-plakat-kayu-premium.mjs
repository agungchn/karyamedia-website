import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Fix 1: Replace all "Medali" with "Plakat" in Plakat Kayu Premium products
// Fix 2: Change specific box types based on user feedback

const fixes = {
  // Fix Medali -> Plakat
  'plakat-pk-482': {
    name: 'Plakat Emas Universitas Box Kayu',
    slug: 'plakat-emas-universitas-box-kayu',
    description: 'Plakat emas untuk universitas dan instansi pendidikan. Bahan logam dengan finishing emas, dilengkapi box kayu. Cocok untuk penghargaan akademik, cinderamata wisuda, dan kenang-kenangan kampus.',
    shortDescription: 'Plakat emas universitas dengan box kayu'
  },
  'plakat-pk-483': {
    name: 'Plakat Emas Organisasi Box Kayu',
    slug: 'plakat-emas-organisasi-box-kayu',
    description: 'Plakat emas untuk organisasi dan komunitas. Bahan logam dengan finishing emas, dilengkapi box kayu natural. Cocok untuk penghargaan organisasi, cinderamata komunitas, dan kenang-kenangan event.',
    shortDescription: 'Plakat emas organisasi dengan box kayu'
  },
  'plakat-pk-500': {
    name: 'Plakat DPRD Box Batik',
    slug: 'plakat-dprd-box-batik',
    description: 'Plakat untuk DPRD. Bahan logam dengan finishing premium, dilengkapi box batik tradisional. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan kenang-kenangan pemerintahan daerah.',
    shortDescription: 'Plakat DPRD dengan box batik'
  },
  'plakat-pk-538': {
    name: 'Plakat DPRD dengan Pen Holder Box Bludru Biru',
    slug: 'plakat-dprd-pen-holder-box-bludru-biru',
    description: 'Plakat untuk DPRD dengan pen holder. Bahan logam dengan finishing premium, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan hadiah resmi.',
    shortDescription: 'Plakat DPRD dengan pen holder dan box bludru biru'
  },
  'plakat-pk-545': {
    name: 'Plakat DPRD dengan Pen Holder Box Bludru Biru',
    slug: 'plakat-dprd-pen-holder-box-bludru-biru-2',
    description: 'Plakat untuk DPRD dengan pen holder. Bahan logam dengan finishing premium, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan hadiah resmi.',
    shortDescription: 'Plakat DPRD dengan pen holder dan box bludru biru'
  },
  'plakat-pk-546': {
    name: 'Plakat DPRD dengan Pen Holder Box Bludru Biru',
    slug: 'plakat-dprd-pen-holder-box-bludru-biru-3',
    description: 'Plakat untuk DPRD dengan pen holder. Bahan logam dengan finishing premium, dilengkapi box bludru biru. Cocok untuk cinderamata DPRD, penghargaan anggota dewan, dan hadiah resmi.',
    shortDescription: 'Plakat DPRD dengan pen holder dan box bludru biru'
  },
  
  // Fix Box Bludru -> Box Kayu (based on user feedback)
  'plakat-pk-479': {
    name: 'Plakat Kuningan Universitas Box Kayu',
    slug: 'plakat-kuningan-universitas-box-kayu',
    description: 'Plakat penghargaan kuningan premium untuk universitas dan instansi pendidikan. Bahan kuningan asli dengan finishing emas mengkilap, dilengkapi box kayu dengan aksen kain satin kuning. Cocok untuk cinderamata wisuda, penghargaan rektor, dan kenang-kenangan akademik.',
    shortDescription: 'Plakat kuningan universitas dengan box kayu'
  },
  'plakat-pk-481': {
    name: 'Plakat Kuningan DPRD Box Kayu',
    slug: 'plakat-kuningan-dprd-box-kayu',
    description: 'Plakat kuningan untuk DPRD dan instansi pemerintah daerah. Bahan kuningan dengan plat nama presisi, dilengkapi box kayu elegan. Cocok untuk penghargaan pejabat, cinderamata resmi, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan DPRD dengan box kayu'
  },
  'plakat-pk-486': {
    name: 'Plakat Kuningan Kota Box Kayu',
    slug: 'plakat-kuningan-kota-box-kayu',
    description: 'Plakat kuningan untuk pemerintah kota. Bahan kuningan dengan ornamen dan plat nama, dilengkapi box kayu. Cocok untuk cinderamata kota, penghargaan pejabat daerah, dan kenang-kenangan pemerintahan.',
    shortDescription: 'Plakat kuningan pemerintah kota dengan box kayu'
  }
};

// Apply fixes
let fixedCount = 0;

products.forEach(product => {
  if (fixes[product.id]) {
    const fix = fixes[product.id];
    const oldName = product.name;
    product.name = fix.name;
    product.slug = fix.slug;
    product.description = fix.description;
    product.shortDescription = fix.shortDescription;
    fixedCount++;
    console.log(`FIX: ${oldName} -> ${fix.name}`);
  }
});

// Also fix any remaining "Medali" in Plakat Kayu Premium products
products.forEach(product => {
  if (product.subcategoryId === 'pkp' && product.name.includes('Medali')) {
    const oldName = product.name;
    product.name = product.name.replace(/Medali/g, 'Plakat');
    product.slug = product.slug.replace(/medali/g, 'plakat');
    fixedCount++;
    console.log(`FIX MEDALI->PLAKAT: ${oldName} -> ${product.name}`);
  }
});

// Write updated products
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

console.log(`\nRingkasan:`);
console.log(`- Produk difix: ${fixedCount}`);
console.log(`- Total produk: ${products.length}`);
