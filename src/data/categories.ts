export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  aliases?: string[];
  description?: string;
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
      { id: "pa", name: "Plakat Akrilik", slug: "plakat-akrilik", aliases: ["plakat bening", "plakat transparan", "plakat acrylic", "plakat stand fiber", "plakat custom akrilik"], description: "Plakat akrilik custom untuk penghargaan, souvenir event, dan kenang-kenangan. Tersedia akrilik premium + stand fiberglass, berbagai ukuran custom." },
      { id: "pkp", name: "Plakat Kayu Premium", slug: "plakat-kayu-premium", aliases: ["plakat kayu mewah", "plakat kayu jati", "plakat ukir kayu", "plakat premium kayu", "plakat kayu eksklusif"], description: "Plakat kayu premium dari kayu jati dan mahoni pilihan. Cocok untuk penghargaan eksklusif, souvenir mewah, dan cinderamata instansi." },
      { id: "pm", name: "Plakat Marmer", slug: "plakat-marmer", aliases: ["plakat batu marmer", "plakat marmer putih", "plakat marmer hitam", "plakat batu alam", "plakat marmer ukir"], description: "Plakat marmer custom untuk penghargaan, KKN, seminar, dan peresmian. Bahan marmer premium dengan ukiran teks presisi tinggi." },
      { id: "pk", name: "Plakat Kayu", slug: "plakat-kayu", aliases: ["plakat kayu murah", "plakat kayu mdf", "plakat kayu mahoni", "plakat kayu polos", "plakat cinderamata kayu"], description: "Plakat kayu custom dari mahoni dan MDF premium. Solusi penghargaan, cinderamata, dan apresiasi dengan harga terjangkau." },
      { id: "pf", name: "Plakat Fiberglass", slug: "plakat-fiberglass", aliases: ["plakat fiber", "plakat resin", "plakat cor", "plakat fiber murah", "plakat resin custom"], description: "Plakat fiberglass custom untuk penghargaan dan kenang-kenangan. Ringan, tahan lama, cocok untuk apresiasi instansi dan event." },
      { id: "pw", name: "Plakat Wayang", slug: "plakat-wayang", aliases: ["plakat wayang kulit", "souvenir wayang", "plakat wayang kuningan", "plakat khas jogja", "souvenir khas indonesia"], description: "Plakat wayang khas Indonesia dari kuningan dan aluminium. Souvenir unik untuk oleh-oleh khas Jogja dan cinderamata budaya." },
      { id: "sp", name: "Souvenir Pernikahan", slug: "souvenir-pernikahan", aliases: ["souvenir nikah", "souvenir kado pernikahan", "souvenir resepsi", "souvenir wedding", "souvenir pengantin"], description: "Souvenir pernikahan custom dari akrilik dan resin. Cocok untuk kado resepsi, souvenir pengantin, dan hadiah acara spesial." },
    ],
  },
  {
    id: "plakat-instansi",
    name: "Plakat Instansi",
    slug: "plakat-instansi",
    icon: "Building2",
    description: "Plakat custom untuk instansi pemerintah, sekolah, dan organisasi — tersedia per wilayah",
    subcategories: [
      { id: "pi-jawa", name: "Jawa", slug: "pi-jawa", aliases: ["plakat instansi jawa", "plakat jawa", "plakat instansi jawa tengah", "plakat instansi jawa timur", "plakat instansi jawa barat"], description: "Plakat instansi custom untuk wilayah Jawa — Jawa Tengah, Jawa Timur, dan Jawa Barat." },
      { id: "pi-sumatera", name: "Sumatera", slug: "pi-sumatera", aliases: ["plakat instansi sumatera", "plakat sumatera", "plakat instansi sumatera utara", "plakat instansi sumatera selatan"], description: "Plakat instansi custom untuk wilayah Sumatera — Sumatera Utara, Sumatera Selatan, dan sekitarnya." },
      { id: "pi-kalimantan", name: "Kalimantan", slug: "pi-kalimantan", aliases: ["plakat instansi kalimantan", "plakat kalimantan"], description: "Plakat instansi custom untuk wilayah Kalimantan — Kaltim, Kalsel, Kalteng, dan sekitarnya." },
      { id: "pi-sulawesi", name: "Sulawesi", slug: "pi-sulawesi", aliases: ["plakat instansi sulawesi", "plakat sulawesi"], description: "Plakat instansi custom untuk wilayah Sulawesi — Sulawesi Utara, Sulawesi Selatan, dan sekitarnya." },
      { id: "pi-bali-ntt", name: "Bali & NTT", slug: "pi-bali-ntt", aliases: ["plakat instansi bali", "plakat instansi ntt", "plakat bali", "plakat ntt", "plakat instansi bali ntt"], description: "Plakat instansi custom untuk wilayah Bali dan Nusa Tenggara." },
      { id: "pi-maluku-papua", name: "Maluku & Papua", slug: "pi-maluku-papua", aliases: ["plakat instansi maluku", "plakat instansi papua", "plakat maluku", "plakat papua"], description: "Plakat instansi custom untuk wilayah Maluku dan Papua." },
    ],
  },
  {
    id: "medali",
    name: "Medali",
    slug: "medali",
    icon: "Medal",
    description: "Medali custom untuk kompetisi, penghargaan, dan event",
    subcategories: [
      { id: "md", name: "Medali Custom", slug: "medali-custom", aliases: ["medali penghargaan", "medali lomba", "medali kompetisi", "medali event", "medali kelulusan"], description: "Medali custom dari kuningan untuk lomba, kompetisi, event olahraga, dan penghargaan. Tersedia finishing emas, perak, dan perunggu." },
      { id: "md3d", name: "Medali 3D Zink Alloy", slug: "medali-3d-zink-alloy", aliases: ["medali 3d", "medali logam", "medali alloy"], description: "Medali 3D zink alloy custom untuk lomba, kompetisi, dan event olahraga. Tersedia desain 3D dengan finishing premium." },
    ],
  },
  {
    id: "piala",
    name: "Piala & Trophy",
    slug: "piala-trophy",
    icon: "Trophy",
    description: "Piala dan trophy untuk berbagai acara dan kompetisi",
    subcategories: [
      { id: "pt", name: "Piala Trophy", slug: "piala-trophy", aliases: ["piala olahraga", "piala kejuaraan", "trophy penghargaan", "piala kompetisi", "piala lomba", "piala murah"], description: "Piala dan trophy custom untuk kompetisi, kejuaraan, dan penghargaan event. Bahan plastik dan atom berkualitas dengan ukiran nama." },
      { id: "pg", name: "Piala Golf", slug: "piala-golf", aliases: ["piala turnamen golf", "trophy golf", "piala olahraga golf", "souvenir golf", "hadiah golf"], description: "Piala golf custom untuk turnamen dan event olahraga. Akrilik premium dengan stand fiberglass, desain elegan dan eksklusif." },
      { id: "po", name: "Piala Olahraga", slug: "piala-olahraga", aliases: ["piala futsal", "piala basket", "piala sepak bola", "piala turnamen", "piala kejuaraan olahraga", "piala akrilik olahraga", "piala sport"], description: "Piala olahraga custom akrilik untuk futsal, basket, sepak bola, bulu tangkis, dan berbagai cabang olahraga. Cocok untuk turnamen, kejuaraan, dan event kompetisi." },
    ],
  },
  {
    id: "wisuda",
    name: "Souvenir Wisuda",
    slug: "souvenir-wisuda",
    icon: "GraduationCap",
    description: "Perlengkapan wisuda dan souvenir akademik",
    subcategories: [
      { id: "gw", name: "Samir/Gordon Wisuda", slug: "samir-gordon-wisuda", aliases: ["kalung wisuda", "medali wisuda", "mendali wisuda", "gordon"], description: "Samir dan gordon wisuda custom dari kain satin dan bludru. Perlengkapan wisuda untuk sarjana, tersedia berbagai warna dan ukuran." },
      { id: "ptw", name: "Patung Wisuda", slug: "patung-wisuda", aliases: ["patung lulusan", "patung sarjana", "patung wisuda fiber", "souvenir wisuda patung", "patung penghargaan wisuda"], description: "Patung wisuda custom dari fiberglass dan resin. Souvenir kelulusan untuk sarjana, hadiah wisuda, dan kenang-kenangan akademik." },
      { id: "pwa", name: "Plakat Wisuda Akrilik", slug: "plakat-wisuda-akrilik", aliases: ["plakat wisuda bening", "plakat wisuda transparan", "plakat kelulusan akrilik", "plakat wisuda acrylic", "plakat akrilik wisuda"], description: "Plakat wisuda akrilik custom untuk hadiah kelulusan. Bening elegan dengan print UV, cocok untuk souvenir wisuda dan penghargaan." },
      { id: "kr", name: "Kalung Rektor", slug: "kalung-rektor", aliases: ["kalung jabatan rektor", "kalung emas rektor", "kalung wisuda rektor", "kalung kehormatan rektor", "aksesoris rektor"], description: "Kalung rektor custom dari kuningan untuk wisuda dan acara akademik. Simbol kehormatan dengan desain eksklusif dan finishing premium." },
      { id: "tr", name: "Pedel Tongkat Rektor", slug: "pedel-tongkat-rektor", aliases: ["tongkat wisuda rektor", "tongkat jabatan rektor", "tongkat pedel", "tongkat rektor custom", "tongkat akademik"], description: "Tongkat rektor custom dari kayu dan kuningan. Pedel tongkat jabatan untuk wisuda, upacara akademik, dan acara resmi kampus." },
      { id: "bt", name: "Baju Toga", slug: "baju-toga", aliases: ["toga wisuda", "jubah wisuda", "toga sarjana", "toga mahasiswa", "toga kelulusan"], description: "Toga wisuda custom untuk kelulusan sarjana dan mahasiswa. Tersedia berbagai ukuran dengan bahan berkualitas dan harga terjangkau." },
      { id: "mi", name: "Map Ijazah", slug: "map-ijazah", aliases: ["map wisuda", "map ijazah wisuda", "map kelulusan", "folder ijazah", "map ijazah kulit"], description: "Map ijazah custom dari kulit TPK dan sintesis. Tempat penyimpanan ijazah, piagam, dan dokumen penting wisuda." },
      { id: "tw", name: "Tabung Wisuda", slug: "tabung-wisuda", aliases: ["tabung ijazah", "tabung piagam", "tabung wisuda bludru", "wadah ijazah", "kotak ijazah"], description: "Tabung wisuda custom untuk wadah ijazah dan piagam. Bahan paralon kain bludru, cocok untuk souvenir kelulusan dan wisuda." },
    ],
  },
  {
    id: "giftbox",
    name: "Gift Box",
    slug: "gift-box",
    icon: "Package",
    description: "Box premium untuk souvenir, hadiah, kemasan plakat, kemasan medali, box tempat plakat, dan kemasan pin/bross custom",
    subcategories: [
      { id: "bb", name: "Box Bludru", slug: "box-bludru", aliases: ["kotak bludru", "box beludru", "kotak perhiasan", "box souvenir bludru", "kemasan bludru"], description: "Box bludru custom untuk kemasan souvenir, hadiah, plakat, dan medali. Kain beludru eksklusif dengan berbagai ukuran dan warna." },
      { id: "bk", name: "Box Kertas Import", slug: "box-kertas-import", aliases: ["box kertas premium", "kotak kertas tebal", "kemasan kertas import", "box hadiah import", "kotak souvenir import"], description: "Box kertas import premium untuk kemasan souvenir dan hadiah. Kertas tebal berkualitas tinggi dengan finishing rapi dan elegan." },
      { id: "bl", name: "Box Batik", slug: "box-batik", aliases: ["box kain batik", "kotak batik", "kemasan batik", "box souvenir batik", "kado batik"], description: "Box batik custom untuk kemasan kado eksklusif dan souvenir. Perpaduan batik tradisional dengan desain modern yang elegan." },
      { id: "by", name: "Box Kertas Marga", slug: "box-kertas-marga", aliases: ["box marga", "kotak kertas marga", "kemasan marga", "box souvenir marga"], description: "Box kertas marga untuk kemasan souvenir dan hadiah. Kertas marga tebal dengan cetak custom sesuai kebutuhan Anda." },
      { id: "bc", name: "Box Custom", slug: "box-custom", aliases: ["box souvenir custom", "kotak custom", "kemasan custom", "box hadiah custom"], description: "Box souvenir custom untuk kemasan plakat, medali, dan hadiah. Desain dan ukuran dapat disesuaikan dengan kebutuhan Anda." },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    icon: "Gem",
    description: "Aksesoris dan merchandise custom",
    subcategories: [
      { id: "nt", name: "Nama Dada", slug: "name-tag", aliases: ["nama dada", "papan nama dada", "nama dada akrilik", "nama dada PNS", "nama dada guru", "nama dada PGRI", "nama dada pegawai", "name tag"], description: "Nama dada dan name tag custom dari akrilik dan logam. Papan nama instansi, PNS, guru, dan pegawai dengan desain profesional." },
      { id: "pb", name: "Pin/Bross", slug: "pin-bross", aliases: ["pin enamel", "bross logam", "pin badge", "lencana custom", "pin instansi", "bross instansi", "emblem"], description: "Pin dan bross custom dari logam enamel premium. Merchandise event, souvenir instansi, dan aksesoris lencana eksklusif." },
      { id: "gk", name: "Gantungan Kunci", slug: "gantungan-kunci", aliases: ["gantungan kunci akrilik", "gantungan kunci logam", "keychain custom", "gantungan kunci murah", "souvenir gantungan kunci"], description: "Gantungan kunci custom dari akrilik, logam, dan karet. Souvenir merchandise untuk instansi, event, dan promosi perusahaan." },
      { id: "tm", name: "Tumbler", slug: "tumbler", aliases: ["botol minum custom", "tumbler souvenir", "botol promosi", "cup custom", "gelas souvenir"], description: "Tumbler custom dari stainless steel premium. Botol minum souvenir untuk promosi perusahaan dan merchandise event." },
      { id: "pn", name: "Papan Nama", slug: "papan-nama", aliases: ["papan nama kantor", "papan nama instansi", "plang nama", "papan akrilik", "nameplate"], description: "Papan nama custom dari akrilik, kayu, dan logam. Plang nama kantor, instansi, dan ruangan dengan desain profesional." },
    ],
  },
  {
    id: "prasasti",
    name: "Prasasti",
    slug: "prasasti",
    icon: "Scroll",
    description: "Prasasti peresmian dan penanda bangunan",
    subcategories: [
      { id: "pr", name: "Prasasti Marmer", slug: "prasasti-marmer", aliases: ["prasasti batu marmer", "prasasti peresmian", "prasasti granit", "prasasti gedung", "prasasti ukir marmer"], description: "Prasasti marmer custom untuk peresmian gedung, penanda bangunan, dan monumen. Bahan marmer granit berkualitas tinggi dengan ukiran presisi." },
      { id: "prk", name: "Prasasti Kuningan", slug: "prasasti-kuningan", aliases: ["prasasti logam kuningan", "prasasti peresmian kuningan", "plakat peresmian", "papan peresmian", "prasasti ukir kuningan"], description: "Prasasti kuningan custom untuk peresmian, banner, dan papan nama instansi. Logam kuningan premium dengan ukiran teks presisi." },
      { id: "pss", name: "Prasasti Stainless Steel", slug: "prasasti-stainless-steel", aliases: ["prasasti logam stainless", "prasasti peresmian stainless", "papan nama stainless", "nameplate stainless", "prasasti modern"], description: "Prasasti stainless steel custom untuk peresmian gedung dan penanda bangunan modern. Tahan karat dengan desain elegan." },
    ],
  },
  {
    id: "bataswilayah",
    name: "Batas Wilayah",
    slug: "batas-wilayah",
    icon: "MapPin",
    description: "Tugu batas wilayah dan center point",
    subcategories: [
      { id: "brt", name: "Brass Table", slug: "brass-table", aliases: ["brass table custom", "brass table jogja", "plakat brass table", "nama gedung kuningan", "papan nama brass"], description: "Brass table custom dari kuningan dan tembaga. Penanda batas desa, nama gedung, dan papan nama untuk kebutuhan BPN dan pemerintah desa." },
      { id: "cp", name: "Center Point (CP)", slug: "center-point", aliases: ["center point custom", "plakat center point", "titik nol", "patok batas", "titik koordinat"], description: "Center point custom dari kuningan untuk penanda batas wilayah dan titik nol. Patok koordinat desa dan kebutuhan BPN." },
    ],
  },
];
