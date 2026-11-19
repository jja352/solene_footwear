export type Department = 'men' | 'women';

export type MenCategory =
  | 'Running Shoes'
  | 'Casual Sneakers'
  | 'Lifestyle Sneakers'
  | 'Sports Shoes'
  | 'Basketball Shoes'
  | 'Football Shoes'
  | 'Gym & Training Shoes'
  | 'Walking Shoes'
  | 'Formal Shoes'
  | 'Loafers'
  | 'Oxford Shoes'
  | 'Derby Shoes'
  | 'Boots'
  | 'Chelsea Boots'
  | 'Sandals'
  | 'Slides'
  | 'Slip-on Shoes'
  | 'Everyday Comfort Shoes';

export type WomenCategory =
  | 'Casual Sneakers'
  | 'Lifestyle Sneakers'
  | 'Running Shoes'
  | 'Sports Shoes'
  | 'Gym & Training Shoes'
  | 'Walking Shoes'
  | 'Platform Sneakers'
  | 'Chunky Sneakers'
  | 'Fashion Sneakers'
  | 'Ballet Flats'
  | 'Loafers'
  | 'High Heels'
  | 'Block Heels'
  | 'Stilettos'
  | 'Wedges'
  | 'Sandals'
  | 'Slides'
  | 'Ankle Boots'
  | 'Knee-High Boots'
  | 'Slip-on Shoes'
  | 'Everyday Comfort Shoes';

export type Category = MenCategory | WomenCategory;

export type ShoppingSectionKey =
  | 'newArrival'
  | 'bestSeller'
  | 'trending'
  | 'featured'
  | 'exclusive'
  | 'discounted'
  | 'mensBestPick'
  | 'womensBestPick';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  department: Department;
  category: Category;
  price: number;
  discountPrice?: number;
  description: string;
  craftsmanshipNotes: string;
  upperMaterial: string;
  liningMaterial: string;
  soleHeight: string;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  image: string;
  gallery: string[];
  sections: ShoppingSectionKey[];
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  productId: string;
  size: string;
  colorName: string;
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'whatsapp' | 'cod' | 'card_on_delivery';
  notes: string;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  items: Array<{
    name: string;
    sku: string;
    size: string;
    colorName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    image: string;
  }>;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  customer: CheckoutFormData;
  whatsappUrl: string;
}
