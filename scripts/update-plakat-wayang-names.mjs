import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Mapping for new names based on images
const nameUpdates = {
  // ID: { name, slug, description, shortDescription }
  'plakat-pw-607': {
    name: 'Plakat Wajah Batara Kresna',
    slug: 'plakat-wajah-batara-kresna',
    description: 'Plakat wajah wayang Batara Kresna dari perak/aluminium dengan stand kayu. Detail ukiran wajah wayang yang elegan, cocok untuk cinderamata dan penghargaan.',
    shortDescription: 'Plakat wajah wayang Batara Kresna dari perak dengan stand kayu'
  },
  'plakat-pw-608': {
    name: 'Plakat Wayang Gunungan dengan Pen Holder',
    slug: 'plakat-wayang-gunungan-pen-holder',
    description: 'Plakat wayang gunungan dari perak dengan pen holder. Motif gunungan wayang lengkap dengan dua tokoh, dilengkapi tempat pena eksklusif.',
    shortDescription: 'Plakat gunungan wayang perak dengan pen holder'
  },
  'plakat-pw-609': {
    name: 'Plakat Wayang Gunungan Bingkai Hitam',
    slug: 'plakat-wayang-gunungan-bingkai-hitam',
    description: 'Plakat wayang gunungan dari perak dalam bingkai hitam premium. Motif gunungan detail dengan ukiran tradisional, cocok untuk display dan cinderamata.',
    shortDescription: 'Plakat gunungan wayang perak dalam bingkai hitam'
  },
  'plakat-pw-610': {
    name: 'Plakat Wayang Arjuna Bingkai Hitam',
    slug: 'plakat-wayang-arjuna-bingkai-hitam',
    description: 'Plakat wayang Arjuna dari perak dalam bingkai hitam. Tokoh Arjuna dengan detail ukiran halus, simbol ksatria tampan dan bijaksana.',
    shortDescription: 'Plakat wayang Arjuna perak dalam bingkai hitam'
  },
  'plakat-pw-611': {
    name: 'Plakat Wayang Gunungan Klasik Bingkai Hitam',
    slug: 'plakat-wayang-gunungan-klasik-bingkai-hitam',
    description: 'Plakat wayang gunungan klasik dari perak dalam bingkai hitam. Motif gunungan tradisional dengan detail ukiran tangan.',
    shortDescription: 'Plakat gunungan wayang klasik perak dalam bingkai hitam'
  },
  'plakat-pw-612': {
    name: 'Plakat Wayang Bima Bingkai Hitam',
    slug: 'plakat-wayang-bima-bingkai-hitam',
    description: 'Plakat wayang Bima dari perak dalam bingkai hitam. Tokoh Bima (Werkudara) dengan postur gagah dan detail ornamen khas.',
    shortDescription: 'Plakat wayang Bima perak dalam bingkai hitam'
  },
  'plakat-pw-613': {
    name: 'Plakat Wayang Rama dan Shinta Bingkai Hitam',
    slug: 'plakat-wayang-rama-shinta-bingkai-hitam',
    description: 'Plakat wayang Rama dan Shinta dari perak dalam bingkai hitam. Pasangan legendaris dalam epik Ramayana, simbol cinta sejati.',
    shortDescription: 'Plakat wayang Rama dan Shinta perak dalam bingkai hitam'
  },
  'plakat-pw-614': {
    name: 'Plakat Wayang Yudhistira Bingkai Hitam',
    slug: 'plakat-wayang-yudhistira-bingkai-hitam',
    description: 'Plakat wayang Yudhistira dari perak dalam bingkai hitam. Tokoh tertua Pandawa, simbol kebijaksanaan dan keadilan.',
    shortDescription: 'Plakat wayang Yudhistira perak dalam bingkai hitam'
  },
  'plakat-pw-615': {
    name: 'Plakat Wayang Gunungan Kuningan DIY',
    slug: 'plakat-wayang-gunungan-kuningan-diy',
    description: 'Plakat wayang gunungan dari kuningan dengan stand kayu bulat. Motif gunungan detail, cocok untuk cinderamata resmi.',
    shortDescription: 'Plakat gunungan wayang kuningan dengan stand kayu'
  },
  'plakat-pw-616': {
    name: 'Plakat Wayang Gatotkaca',
    slug: 'plakat-wayang-gatotkaca',
    description: 'Plakat wayang Gatotkaca dari perak dengan stand bertingkat. Tokoh ksatria perkasa dengan sayap terbuka, simbol keberanian.',
    shortDescription: 'Plakat wayang Gatotkaca perak dengan stand bertingkat'
  },
  'plakat-pw-617': {
    name: 'Plakat Wayang Pandawa Bulat',
    slug: 'plakat-wayang-pandawa-bulat',
    description: 'Plakat kelima Pandawa dalam bingkai bulat dari perak dan kuningan. Komposisi lima tokoh dengan gunungan di tengah.',
    shortDescription: 'Plakat kelima Pandawa dalam bingkai bulat'
  },
  'plakat-pw-618': {
    name: 'Plakat Wayang Pandawa Perak',
    slug: 'plakat-wayang-pandawa-perak',
    description: 'Plakat kelima Pandawa dari perak dengan stand kayu. Komposisi lengkap lima bersaudara dengan gunungan.',
    shortDescription: 'Plakat kelima Pandawa perak dengan stand kayu'
  },
  'plakat-pw-619': {
    name: 'Plakat Wayang Werkudara Kuningan',
    slug: 'plakat-wayang-werkudara-kuningan',
    description: 'Plakat wayang Werkudara (Bima) dari kuningan dengan stand kayu. Postur gagah dengan detail otot dan ornamen.',
    shortDescription: 'Plakat wayang Werkudara kuningan dengan stand kayu'
  },
  'plakat-pw-620': {
    name: 'Plakat Wayang Arjuna Kuningan',
    slug: 'plakat-wayang-arjuna-kuningan',
    description: 'Plakat wayang Arjuna dari kuningan dengan stand kayu. Tokoh ksatria tampan dengan busur dan anak panah.',
    shortDescription: 'Plakat wayang Arjuna kuningan dengan stand kayu'
  },
  'plakat-pw-621': {
    name: 'Plakat Wayang Werkudara Kuningan Pose Kanan',
    slug: 'plakat-wayang-werkudara-kuningan-pose-kanan',
    description: 'Plakat wayang Werkudara dari kuningan dengan pose menghadap kanan. Detail ukiran halus pada busana dan aksesoris.',
    shortDescription: 'Plakat wayang Werkudara kuningan pose kanan'
  },
  'plakat-pw-622': {
    name: 'Plakat Wayang Arjuna Kuningan Pose Kanan',
    slug: 'plakat-wayang-arjuna-kuningan-pose-kanan',
    description: 'Plakat wayang Arjuna dari kuningan dengan pose menghadap kanan. Simbol ksatria yang santun dan penuh wibawa.',
    shortDescription: 'Plakat wayang Arjuna kuningan pose kanan'
  },
  'plakat-pw-623': {
    name: 'Plakat Wayang Werkudara dengan Pen Holder',
    slug: 'plakat-wayang-werkudara-pen-holder',
    description: 'Plakat wayang Werkudara dari kuningan dengan pen holder. Dilengkapi tempat pena eksklusif, cocok untuk hadiah.',
    shortDescription: 'Plakat wayang Werkudara kuningan dengan pen holder'
  },
  'plakat-pw-624': {
    name: 'Plakat Wayang Werkudara dengan Pen Holder Premium',
    slug: 'plakat-wayang-werkudara-pen-holder-premium',
    description: 'Plakat wayang Werkudara dari kuningan dengan pen holder premium. Stand kayu mahoni dengan plat nama.',
    shortDescription: 'Plakat wayang Werkudara kuningan dengan pen holder premium'
  },
  'plakat-pw-625': {
    name: 'Plakat Wayang Gunungan Bulat Kuningan',
    slug: 'plakat-wayang-gunungan-bulat-kuningan',
    description: 'Plakat wayang gunungan dari kuningan dalam bingkai bulat kayu mahoni. Motif gunungan detail dengan finishing mengkilap.',
    shortDescription: 'Plakat gunungan wayang kuningan dalam bingkai bulat'
  },
  'plakat-pw-626': {
    name: 'Plakat Wayang Gunungan Segi Enam DPRD Salatiga',
    slug: 'plakat-wayang-gunungan-segi-enam-dprd-salatiga',
    description: 'Plakat wayang gunungan dari kuningan dalam bingkai segi enam kayu mahoni. Desain unik untuk kenang-kenangan.',
    shortDescription: 'Plakat gunungan wayang kuningan bingkai segi enam'
  },
  'plakat-pw-627': {
    name: 'Plakat Wayang Gunungan Segi Enam Pertamina',
    slug: 'plakat-wayang-gunungan-segi-enam-pertamina',
    description: 'Plakat wayang gunungan dari kuningan dalam bingkai segi enam. Desain elegan untuk penghargaan instansi.',
    shortDescription: 'Plakat gunungan wayang kuningan bingkai segi enam'
  },
  'plakat-pw-628': {
    name: 'Plakat Wayang Gunungan Kayu Pertamina',
    slug: 'plakat-wayang-gunungan-kayu-pertamina',
    description: 'Plakat wayang gunungan dari kuningan dengan panel kayu. Desain premium untuk cinderamata perusahaan.',
    shortDescription: 'Plakat gunungan wayang kuningan dengan panel kayu'
  },
  'plakat-pw-629': {
    name: 'Plakat Wayang Gunungan dengan Jam dan Pen Holder',
    slug: 'plakat-wayang-gunungan-jam-pen-holder',
    description: 'Plakat wayang gunungan dengan jam meja dan pen holder. Paket lengkap untuk hadiah premium.',
    shortDescription: 'Plakat gunungan wayang dengan jam dan pen holder'
  },
  'plakat-pw-630': {
    name: 'Plakat Wayang Semar Kuningan',
    slug: 'plakat-wayang-semar-kuningan',
    description: 'Plakat wayang Semar dari kuningan dengan stand hitam. Tokoh punakawan dengan tubuh tambak dan wajah bijaksana.',
    shortDescription: 'Plakat wayang Semar kuningan dengan stand hitam'
  },
  'plakat-pw-631': {
    name: 'Plakat Wayang Gunungan Modern DHL',
    slug: 'plakat-wayang-gunungan-modern-dhl',
    description: 'Plakat wayang gunungan modern dari kuningan dan akrilik hitam. Desain kontemporer dengan motif tradisional.',
    shortDescription: 'Plakat gunungan wayang modern kuningan dan akrilik'
  },
  'plakat-pw-632': {
    name: 'Plakat Wajah Wayang Perak',
    slug: 'plakat-wajah-wayang-perak',
    description: 'Plakat wajah wayang dari perak dengan stand kayu. Detail ukiran wajah wayang yang sangat halus dan artistik.',
    shortDescription: 'Plakat wajah wayang perak dengan stand kayu'
  },
  'plakat-pw-633': {
    name: 'Plakat Wayang Gunungan Universitas Indonesia',
    slug: 'plakat-wayang-gunungan-universitas-indonesia',
    description: 'Plakat wayang gunungan dari perak dengan logo universitas. Bingkai hitam dengan latar beludru kuning.',
    shortDescription: 'Plakat gunungan wayang perak dengan logo UI'
  },
  'plakat-pw-634': {
    name: 'Plakat Wayang Gunungan Kotak IHI',
    slug: 'plakat-wayang-gunungan-kotak-ihi',
    description: 'Plakat wayang gunungan dari perak dalam kotak kayu premium. Kemasan mewah dengan batik motif.',
    shortDescription: 'Plakat gunungan wayang perak dalam kotak kayu'
  },
  'plakat-pw-635': {
    name: 'Plakat Wayang Rama Shinta Kuningan',
    slug: 'plakat-wayang-rama-shinta-kuningan',
    description: 'Plakat wayang Rama dan Shinta dari kuningan dengan panel kayu merah. Pasangan suami istri simbol kesetiaan.',
    shortDescription: 'Plakat wayang Rama Shinta kuningan dengan panel kayu'
  },
  'plakat-pw-636': {
    name: 'Plakat Wayang Pandawa Kemenpar',
    slug: 'plakat-wayang-pandawa-kemenpar',
    description: 'Plakat kelima Pandawa dari perak dengan bingkai kayu dan latar beludru oranye. Komposisi lima tokoh lengkap.',
    shortDescription: 'Plakat kelima Pandawa perak dengan bingkai kayu'
  },
  'plakat-pw-637': {
    name: 'Plakat Wayang Pandawa Dinas Kebudayaan DIY',
    slug: 'plakat-wayang-pandawa-dinas-kebudayaan-diy',
    description: 'Plakat kelima Pandawa dari perak dengan bingkai hitam. Komposisi lima tokoh dengan gunungan di tengah.',
    shortDescription: 'Plakat kelima Pandawa perak dengan bingkai hitam'
  },
  // plakat-pw-638 (TNI AU) akan dihapus
  'plakat-pw-639': {
    name: 'Plakat Wayang Dalang Juara I',
    slug: 'plakat-wayang-dalang-juara-1',
    description: 'Plakat wayang dalang juara dari perak dengan background kayu ukir. Komposisi wayang lengkap dengan gunungan, cocok untuk penghargaan dalang.',
    shortDescription: 'Plakat wayang dalang juara dengan background kayu ukir'
  }
};

// Update products
let updatedCount = 0;
let deletedCount = 0;

const updatedProducts = products.filter(product => {
  // Delete TNI AU product
  if (product.id === 'plakat-pw-638') {
    deletedCount++;
    console.log(`MENGHAPUS: ${product.name} (${product.id})`);
    return false;
  }
  
  // Update generic named products
  if (nameUpdates[product.id]) {
    const update = nameUpdates[product.id];
    product.name = update.name;
    product.slug = update.slug;
    product.description = update.description;
    product.shortDescription = update.shortDescription;
    updatedCount++;
    console.log(`UPDATE: ${product.name} -> ${update.name}`);
  }
  
  return true;
});

// Write updated products
fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

console.log(`\nRingkasan:`);
console.log(`- Produk diupdate: ${updatedCount}`);
console.log(`- Produk dihapus: ${deletedCount}`);
console.log(`- Total produk tersisa: ${updatedProducts.length}`);
