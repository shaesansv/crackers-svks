export interface Product {
  id: string;
  _id?: string;
  name: string;
  unit: string;
  stock?: number;
  price: number;          // Original retail price (MRP)
  actualPrice: number;
  discountPrice: number;  // Effective price shown in cart/checkout
  netRate?: number;       // Discounted price when hasDiscount is true
  hasDiscount?: boolean;  // Mode 1: product-level discount using netRate
  displayNetRate?: boolean; // Mode 2: display only netRate, no badge/strikethrough
  appliedGlobalDiscount?: boolean; // Mode 3: global discount% from content page was applied
  globalDiscountPct?: number;      // The global discount % that was applied (Mode 3)
  imageType: 'sparkler' | 'pot' | 'chakkar' | 'bomb' | 'kids' | 'garland' | 'rocket' | string;
  imageUrl?: string;
  category?: any;
  brand?: string;
  description?: string;
}


export interface Category {
  uid?: string;
  id: string;
  code: string;
  name: string;
  discountText: string;
  imageType: string;
  products: Product[];
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  packingCharge: number;
  overallTotal: number;
  approved: 'Pending' | 'Approved' | 'Packed' | 'On Hold';
  holdStatus: string;
  date: string;
}

export interface Customer {
  name: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}
