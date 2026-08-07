export interface Product {
  id: string;
  _id?: string;
  name: string;
  unit: string;
  stock?: number;
  actualPrice: number;
  discountPrice: number;
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
