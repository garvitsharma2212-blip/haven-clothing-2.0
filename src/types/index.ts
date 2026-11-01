export type ProductCategory = 'oversized-t-shirts' | 'waffle-t-shirts' | 'sweatshirts' | 'essentials';

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ColorVariant {
  name: string;
  hex: string;
  imageIndex?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryName?: string;
  description: string;
  fabricDetails?: string;
  fitDetails?: string;
  careInstructions?: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  sizes: ProductSize[];
  colors: ColorVariant[];
  stock: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique composite: productId-size-color
  productId: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  discountedPrice?: number;
  image: string;
  size: ProductSize;
  color: string;
  quantity: number;
  stock: number;
}

export type OrderStatus = 'NEW' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED';
export type PaymentMethod = 'COD';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: ProductSize;
  color: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  trackingCarrier?: string;
  trackingUrl?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'founder' | 'admin';
  createdAt?: string;
}

export interface HeroSettings {
  imageUrl: string;
  badgeText: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  phone: string;
  freeShippingThreshold: number;
  shippingFee: number;
  announcement: string;
  hero: HeroSettings;
}

