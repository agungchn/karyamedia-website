export interface Product {
  id: string;
  code: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategoryId: string;
  description: string;
  shortDescription: string;
  material: string;
  size: string;
  color: string;
  usage: string;
  minOrder: string;
  productionTime: string;
  price: string;
  logoType?: string;
  standMaterial?: string;
  thickness?: string;
  moldingFee?: string;
  images: string[];
  featured?: boolean;
  bestSeller?: boolean;
  custom?: boolean;
}

import productsData from "./products.json"
export const products: Product[] = productsData
