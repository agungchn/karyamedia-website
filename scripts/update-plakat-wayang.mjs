import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('H:/karyamedia-web/src/data/products.json', 'utf8'));

const updates = [
  { id: 'plakat-pw-601', name: 'Plakat Wayang Universitas Indonesia', shortDescription: 'Plakat wayang tembaga untuk Fakultas Ekonomi UI', description: 'Plakat wayang tembaga dengan logo Universitas Indonesia Faculty of Economics & Business. Desain ornamen wayang yang sangat detail. Cocok untuk cinderamata universitas, penghargaan fakultas, atau koleksi seni.', usage: 'Cinderamata Universitas / Penghargaan Fakultas / Koleksi Seni' },
  { id: 'plakat-pw-602', name: 'Plakat Wayang DPRD Salatiga', shortDescription: 'Plakat wayang emas untuk pemerintah daerah', description: 'Plakat wayang emas dengan logo DPRD Salatiga. Kenang-kenangan Dewan Perwakilan Rakyat Daerah Kota Salatiga. Cocok untuk cinderamata pemerintah daerah, penghargaan DPRD, atau hadiah formal.', usage: 'Cinderamata Pemerintah Daerah / Penghargaan DPRD / Hadiah Formal' },
  { id: 'plakat-pw-603', name: 'Plakat Wayang Perak Wisnawa', shortDescription: 'Plakat wayang perak tokoh Wisnawa dalam bingkai', description: 'Plakat wayang perak tokoh Wisnawa dalam bingkai hitam. Dilengkapi deskripsi tentang tokoh wayang. Cocok untuk koleksi seni, cinderamata budaya, atau hadiah collector.', usage: 'Koleksi Seni / Cinderamata Budaya / Hadiah Collector' },
  { id: 'plakat-pw-604', name: 'Plakat Wayang Perak Rama dan Sinta', shortDescription: 'Plakat wayang perak dua tokoh dalam bingkai', description: 'Plakat wayang perak tokoh Rama dan Sinta dalam bingkai hitam. Kisah cinta yang menjadi simbol kesetiaan dalam budaya Jawa. Cocok untuk wedding gift, cinderamata pernikahan, atau koleksi seni.', usage: 'Wedding Gift / Cinderamata Pernikahan / Koleksi Seni' },
  { id: 'plakat-pw-605', name: 'Plakat Wayang Perak Semar', shortDescription: 'Plakat wayang perak tokoh Semar dengan deskripsi', description: 'Plakat wayang perak tokoh Semar dengan plat nama dan deskripsi. Semar adalahtokoh punakawan yang bijaksana. Cocok untuk koleksi seni, cinderamata budaya, atau hadiah filosofis.', usage: 'Koleksi Seni / Cinderamata Budaya / Hadiah Filosofis' },
  { id: 'plakat-pw-606', name: 'Plakat Wayang Gunungan Klasik', shortDescription: 'Plakat wayang gunungan klasik emas untuk koleksi', description: 'Plakat wayang gunungan klasik berwarna emas dengan ukiran sangat detail. Motif pohon kehidupan dan hewan. Cocok untuk koleksi seni, cinderamata budaya, atau penghargaan.', usage: 'Koleksi Seni / Cinderamata Budaya / Penghargaan' },
];

updates.forEach(u => {
  const idx = data.findIndex(x => x.id === u.id);
  if (idx !== -1) {
    data[idx].name = u.name;
    data[idx].shortDescription = u.shortDescription;
    data[idx].description = u.description;
    data[idx].usage = u.usage;
    console.log('✅ ' + u.name);
  } else {
    console.log('❌ ' + u.id + ' not found');
  }
});

writeFileSync('H:/karyamedia-web/src/data/products.json', JSON.stringify(data, null, 2));
console.log('\nTotal updated: ' + updates.length);
