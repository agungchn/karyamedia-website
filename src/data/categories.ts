export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  aliases?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: "plakat",
    name: "Plakat",
    slug: "plakat",
    icon: "Award",
    description: "Plakat custom untuk penghargaan, cinderamata, dan acara-acara spesial",
    subcategories: [
      { id: "pa", name: "Plakat Akrilik", slug: "plakat-akrilik", aliases: ["plakat bening", "plakat transparan", "plakat acrylic", "plakat stand fiber", "plakat custom akrilik"] },
      { id: "pkp", name: "Plakat Kayu Premium", slug: "plakat-kayu-premium", aliases: ["plakat kayu mewah", "plakat kayu jati", "plakat ukir kayu", "plakat premium kayu", "plakat kayu eksklusif"] },
      { id: "pm", name: "Plakat Marmer", slug: "plakat-marmer", aliases: ["plakat batu marmer", "plakat marmer putih", "plakat marmer hitam", "plakat batu alam", "plakat marmer ukir"] },
      { id: "pk", name: "Plakat Kayu", slug: "plakat-kayu", aliases: ["plakat kayu murah", "plakat kayu mdf", "plakat kayu mahoni", "plakat kayu polos", "plakat cinderamata kayu"] },
      { id: "pf", name: "Plakat Fiberglass", slug: "plakat-fiberglass", aliases: ["plakat fiber", "plakat resin", "plakat cor", "plakat fiber murah", "plakat resin custom"] },
      { id: "pw", name: "Plakat Wayang", slug: "plakat-wayang", aliases: ["plakat wayang kulit", "souvenir wayang", "plakat wayang kuningan", "plakat khas jogja", "souvenir khas indonesia"] },
      { id: "sp", name: "Souvenir Pernikahan", slug: "souvenir-pernikahan", aliases: ["souvenir nikah", "souvenir kado pernikahan", "souvenir resepsi", "souvenir wedding", "souvenir pengantin"] },
    ],
  },
  {
    id: "medali",
    name: "Medali",
    slug: "medali",
    icon: "Medal",
    description: "Medali custom untuk kompetisi, penghargaan, dan event",
    subcategories: [
      { id: "md", name: "Medali Custom", slug: "medali-custom", aliases: ["medali penghargaan", "medali lomba", "medali kompetisi", "medali event", "medali kelulusan"] },
      { id: "md3d", name: "Medali 3D Zink Alloy", slug: "medali-3d-zink-alloy", aliases: ["medali 3d", "medali logam", "medali alloy"] },
    ],
  },
  {
    id: "piala",
    name: "Piala & Trophy",
    slug: "piala-trophy",
    icon: "Trophy",
    description: "Piala dan trophy untuk berbagai acara dan kompetisi",
    subcategories: [
      { id: "pt", name: "Piala Trophy", slug: "piala-trophy", aliases: ["piala olahraga", "piala kejuaraan", "trophy penghargaan", "piala kompetisi", "piala lomba", "piala murah"] },
      { id: "pg", name: "Piala Golf", slug: "piala-golf", aliases: ["piala turnamen golf", "trophy golf", "piala olahraga golf", "souvenir golf", "hadiah golf"] },
    ],
  },
  {
    id: "wisuda",
    name: "Souvenir Wisuda",
    slug: "souvenir-wisuda",
    icon: "GraduationCap",
    description: "Perlengkapan wisuda dan souvenir akademik",
    subcategories: [
      { id: "gw", name: "Samir/Gordon Wisuda", slug: "samir-gordon-wisuda", aliases: ["kalung wisuda", "medali wisuda", "mendali wisuda", "gordon"] },
      { id: "ptw", name: "Patung Wisuda", slug: "patung-wisuda", aliases: ["patung lulusan", "patung sarjana", "patung wisuda fiber", "souvenir wisuda patung", "patung penghargaan wisuda"] },
      { id: "pwa", name: "Plakat Wisuda Akrilik", slug: "plakat-wisuda-akrilik", aliases: ["plakat wisuda bening", "plakat wisuda transparan", "plakat kelulusan akrilik", "plakat wisuda acrylic", "plakat akrilik wisuda"] },
      { id: "kr", name: "Kalung Rektor", slug: "kalung-rektor", aliases: ["kalung jabatan rektor", "kalung emas rektor", "kalung wisuda rektor", "kalung kehormatan rektor", "aksesoris rektor"] },
      { id: "tr", name: "Pedel Tongkat Rektor", slug: "pedel-tongkat-rektor", aliases: ["tongkat wisuda rektor", "tongkat jabatan rektor", "tongkat pedel", "tongkat rektor custom", "tongkat akademik"] },
      { id: "bt", name: "Baju Toga", slug: "baju-toga", aliases: ["toga wisuda", "jubah wisuda", "toga sarjana", "toga mahasiswa", "toga kelulusan"] },
      { id: "mi", name: "Map Ijazah", slug: "map-ijazah", aliases: ["map wisuda", "map ijazah wisuda", "map kelulusan", "folder ijazah", "map ijazah kulit"] },
      { id: "tw", name: "Tabung Wisuda", slug: "tabung-wisuda", aliases: ["tabung ijazah", "tabung piagam", "tabung wisuda bludru", "wadah ijazah", "kotak ijazah"] },
    ],
  },
  {
    id: "giftbox",
    name: "Gift Box",
    slug: "gift-box",
    icon: "Package",
    description: "Box premium untuk souvenir, hadiah, kemasan plakat, kemasan medali, box tempat plakat, dan kemasan pin/bross custom",
    subcategories: [
      { id: "bb", name: "Box Bludru", slug: "box-bludru", aliases: ["kotak bludru", "box beludru", "kotak perhiasan", "box souvenir bludru", "kemasan bludru"] },
      { id: "bk", name: "Box Kertas Import", slug: "box-kertas-import", aliases: ["box kertas premium", "kotak kertas tebal", "kemasan kertas import", "box hadiah import", "kotak souvenir import"] },
      { id: "bl", name: "Box Batik", slug: "box-batik", aliases: ["box kain batik", "kotak batik", "kemasan batik", "box souvenir batik", "kado batik"] },
      { id: "by", name: "Box Kertas Marga", slug: "box-kertas-marga", aliases: ["box marga", "kotak kertas marga", "kemasan marga", "box souvenir marga"] },
      { id: "bc", name: "Box Custom", slug: "box-custom", aliases: ["box souvenir custom", "kotak custom", "kemasan custom", "box hadiah custom"] },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    icon: "Gem",
    description: "Aksesoris dan merchandise custom",
    subcategories: [
      { id: "nt", name: "Nama Dada", slug: "name-tag", aliases: ["nama dada", "papan nama dada", "nama dada akrilik", "nama dada PNS", "nama dada guru", "nama dada PGRI", "nama dada pegawai", "name tag"] },
      { id: "pb", name: "Pin/Bross", slug: "pin-bross", aliases: ["pin enamel", "bross logam", "pin badge", "lencana custom", "pin instansi", "bross instansi", "emblem"] },
      { id: "gk", name: "Gantungan Kunci", slug: "gantungan-kunci", aliases: ["gantungan kunci akrilik", "gantungan kunci logam", "keychain custom", "gantungan kunci murah", "souvenir gantungan kunci"] },
      { id: "tm", name: "Tumbler", slug: "tumbler", aliases: ["botol minum custom", "tumbler souvenir", "botol promosi", "cup custom", "gelas souvenir"] },
      { id: "pn", name: "Papan Nama", slug: "papan-nama", aliases: ["papan nama kantor", "papan nama instansi", "plang nama", "papan akrilik", "nameplate"] },
    ],
  },
  {
    id: "prasasti",
    name: "Prasasti",
    slug: "prasasti",
    icon: "Scroll",
    description: "Prasasti peresmian dan penanda bangunan",
    subcategories: [
      { id: "pr", name: "Prasasti Marmer", slug: "prasasti-marmer", aliases: ["prasasti batu marmer", "prasasti peresmian", "prasasti granit", "prasasti gedung", "prasasti ukir marmer"] },
      { id: "prk", name: "Prasasti Kuningan", slug: "prasasti-kuningan", aliases: ["prasasti logam kuningan", "prasasti peresmian kuningan", "plakat peresmian", "papan peresmian", "prasasti ukir kuningan"] },
      { id: "pss", name: "Prasasti Stainless Steel", slug: "prasasti-stainless-steel", aliases: ["prasasti logam stainless", "prasasti peresmian stainless", "papan nama stainless", "nameplate stainless", "prasasti modern"] },
    ],
  },
  {
    id: "bataswilayah",
    name: "Batas Wilayah",
    slug: "batas-wilayah",
    icon: "MapPin",
    description: "Tugu batas wilayah dan center point",
    subcategories: [
      { id: "brt", name: "Brass Table", slug: "brass-table", aliases: ["brass table custom", "brass table jogja", "plakat brass table", "nama gedung kuningan", "papan nama brass"] },
      { id: "cp", name: "Center Point (CP)", slug: "center-point", aliases: ["center point custom", "plakat center point", "titik nol", "patok batas", "titik koordinat"] },
    ],
  },
];
