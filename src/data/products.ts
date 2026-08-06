export interface Product {
  _id?: string;
  id?: string;
  code?: string;
  name: string;
  price: number;
  wholesalePrice?: number;
  netRate?: number;
  stock: number;
  brand: string;
  category: string | any;
  description: string;
  quantity?: string;
  hasDiscount?: boolean;
  displayNetRate?: boolean;
  storeStockPieces?: number;
  godownStockCases?: number;
  piecesPerCase?: number;
  minimumStock?: number;
  sku?: string;
  image?: string;
  imageType?: string;
}

export interface Category {
  id: string;
  name: string;
  productCount?: number;
  image?: string;
  categoryCode?: string;
}
