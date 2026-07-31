import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const fixes = [
  {
    id: 'plakat-pk-503',
    name: 'Plakat Universitas Gadjah Mada Box Bludru Hitam',
    slug: 'plakat-universitas-gadjah-mada-box-bludru-hitam',
    description: 'Plakat universitas dengan logo Universitas Gadjah Mada. Bahan logam dengan finishing premium, dilengkapi box bludru hitam. Cocok untuk cinderamata kampus, penghargaan dosen, dan kenang-kenangan akademik.',
    shortDescription: 'Plakat universitas dengan box bludru hitam'
  },
  {
    id: 'plakat-pk-510',
    name: 'Plakat Kesehatan Box Bludru Biru',
    slug: 'plakat-kesehatan-box-bludru-biru',
    description: 'Plakat untuk instansi kesehatan dengan logo Kementerian Kesehatan. Bahan kuningan dengan finishing mengkilap, dilengkapi box bludru biru. Cocok untuk penghargaan rumah sakit, apresiasi tenaga medis, dan cinderamata kesehatan.',
    shortDescription: 'Plakat kesehatan dengan box bludru biru'
  },
  {
    id: 'plakat-pk-511',
    name: 'Plakat Akrilik Kesehatan',
    slug: 'plakat-akrilik-kesehatan',
    description: 'Plakat akrilik untuk instansi kesehatan. Bahan akrilik dengan cetak UV, dilengkapi penyangga kayu. Cocok untuk penghargaan kesehatan, apresiasi kerja sama, dan cinderamata event kesehatan.',
    shortDescription: 'Plakat akrilik untuk instansi kesehatan'
  },
  {
    id: 'plakat-pk-513',
    name: 'Plakat Penghargaan Anak Frame Kayu',
    slug: 'plakat-penghargaan-anak-frame-kayu',
    description: 'Plakat penghargaan untuk program anak. Bahan kuningan dengan finishing emas, dilengkapi frame kayu. Cocok untuk penghargaan organisasi anak, apresiasi komunitas, dan cinderamata sosial.',
    shortDescription: 'Plakat penghargaan anak dengan frame kayu'
  },
  {
    id: 'plakat-pk-514',
    name: 'Plakat Penghargaan Kayu Modern',
    slug: 'plakat-penghargaan-kayu-modern',
    description: 'Plakat penghargaan berdesain modern dari kayu. Bahan kayu dengan finishing hitam dan aksen natural, berbentuk unik dan artistik. Cocok untuk penghargaan organisasi, apresiasi kontribusi, dan cinderamata eksklusif.',
    shortDescription: 'Plakat penghargaan kayu desain modern'
  },
  {
    id: 'plakat-pk-515',
    name: 'Plakat Organisasi Box Bludru Merah',
    slug: 'plakat-organisasi-box-bludru-merah',
    description: 'Plakat untuk organisasi dengan logo Kalkandere Vakfi. Bahan kuningan dengan finishing mengkilap, dilengkapi box bludru merah. Cocok untuk cinderamata organisasi, penghargaan mitra, dan kenang-kenangan kerja sama.',
    shortDescription: 'Plakat organisasi dengan box bludru merah'
  }
];

let fixedCount = 0;

fixes.forEach(fix => {
  const product = products.find(p => p.id === fix.id);
  if (product) {
    const oldName = product.name;
    product.name = fix.name;
    product.slug = fix.slug;
    product.description = fix.description;
    product.shortDescription = fix.shortDescription;
    fixedCount++;
    console.log(`FIX: ${oldName} -> ${fix.name}`);
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log(`\nSelesai! ${fixedCount} produk dikoreksi.`);
