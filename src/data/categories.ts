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
      { id: "pa", name: "Plakat Akrilik", slug: "plakat-akrilik" },
      { id: "pkp", name: "Plakat Kayu Premium", slug: "plakat-kayu-premium" },
      { id: "pm", name: "Plakat Marmer", slug: "plakat-marmer" },
      { id: "pk", name: "Plakat Kayu", slug: "plakat-kayu" },
      { id: "pf", name: "Plakat Fiberglass", slug: "plakat-fiberglass" },
      { id: "pw", name: "Plakat Wayang", slug: "plakat-wayang" },
      { id: "sp", name: "Souvenir Pernikahan", slug: "souvenir-pernikahan" },
    ],
  },
  {
    id: "medali",
    name: "Medali",
    slug: "medali",
    icon: "Medal",
    description: "Medali custom untuk kompetisi, penghargaan, dan event",
    subcategories: [
      { id: "md", name: "Medali Custom", slug: "medali-custom" },
      { id: "md3d", name: "Medali 3D Zink Alloy", slug: "medali-3d-zink-alloy" },
    ],
  },
  {
    id: "piala",
    name: "Piala & Trophy",
    slug: "piala-trophy",
    icon: "Trophy",
    description: "Piala dan trophy untuk berbagai acara dan kompetisi",
    subcategories: [
      { id: "pt", name: "Piala Trophy", slug: "piala-trophy" },
      { id: "pg", name: "Piala Golf", slug: "piala-golf" },
    ],
  },
  {
    id: "wisuda",
    name: "Souvenir Wisuda",
    slug: "souvenir-wisuda",
    icon: "GraduationCap",
    description: "Perlengkapan wisuda dan souvenir akademik",
    subcategories: [
      { id: "gw", name: "Samir/Gordon Wisuda", slug: "samir-gordon-wisuda" },
      { id: "ptw", name: "Patung Wisuda", slug: "patung-wisuda" },
      { id: "pwa", name: "Plakat Wisuda Akrilik", slug: "plakat-wisuda-akrilik" },
      { id: "kr", name: "Kalung Rektor", slug: "kalung-rektor" },
      { id: "tr", name: "Pedel Tongkat Rektor", slug: "pedel-tongkat-rektor" },
      { id: "bt", name: "Baju Toga", slug: "baju-toga" },
      { id: "mi", name: "Map Ijazah", slug: "map-ijazah" },
      { id: "tw", name: "Tabung Wisuda", slug: "tabung-wisuda" },
    ],
  },
  {
    id: "giftbox",
    name: "Gift Box",
    slug: "gift-box",
    icon: "Package",
    description: "Box premium untuk souvenir dan hadiah",
    subcategories: [
      { id: "bb", name: "Box Bludru", slug: "box-bludru" },
      { id: "bk", name: "Box Kertas Import", slug: "box-kertas-import" },
      { id: "bl", name: "Box Batik", slug: "box-batik" },
      { id: "by", name: "Box Kertas Marga", slug: "box-kertas-marga" },
      { id: "bc", name: "Box Custom", slug: "box-custom" },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    icon: "Gem",
    description: "Aksesoris dan merchandise custom",
    subcategories: [
      { id: "nt", name: "Name Tag", slug: "name-tag", aliases: ["nama dada", "papan nama dada"] },
      { id: "pb", name: "Pin/Bross", slug: "pin-bross" },
      { id: "gk", name: "Gantungan Kunci", slug: "gantungan-kunci" },
      { id: "tm", name: "Tumbler", slug: "tumbler" },
      { id: "pn", name: "Papan Nama", slug: "papan-nama" },
    ],
  },
  {
    id: "prasasti",
    name: "Prasasti",
    slug: "prasasti",
    icon: "Scroll",
    description: "Prasasti peresmian dan penanda bangunan",
    subcategories: [
      { id: "pr", name: "Prasasti Marmer", slug: "prasasti-marmer" },
      { id: "prk", name: "Prasasti Kuningan", slug: "prasasti-kuningan" },
      { id: "pss", name: "Prasasti Stainless Steel", slug: "prasasti-stainless-steel" },
    ],
  },
  {
    id: "bataswilayah",
    name: "Batas Wilayah",
    slug: "batas-wilayah",
    icon: "MapPin",
    description: "Tugu batas wilayah dan center point",
    subcategories: [
      { id: "brt", name: "Brass Table", slug: "brass-table" },
      { id: "cp", name: "Center Point (CP)", slug: "center-point" },
    ],
  },
];
