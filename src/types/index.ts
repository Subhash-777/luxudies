// ============================================
// LUXUDIES - TypeScript Type Definitions
// ============================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  sku: string;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  benefits: string[];
  care_instructions: string;
  styling_tips: string;
  images: ProductImage[];
  variants: ProductVariant[];
  collections: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  position: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  value: string;
  price_adjustment: number;
  stock: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  position: number;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  product: Product;
  variant: ProductVariant | null;
}

export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  alternate_phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shipping_address: Address;
  billing_address: Address;
  notes: string;
  tracking_number: string | null;
  tracking_url: string | null;
  estimated_delivery: string | null;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  items: OrderItem[];
  status_history: OrderStatusEntry[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface OrderStatusEntry {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string;
  created_at: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  is_verified: boolean;
  is_approved: boolean;
  user_name: string;
  user_avatar: string | null;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  max_discount: number | null;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  expires_at: string;
}

export interface ComboOffer {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  product_ids: string[];
  products: Product[];
  combo_price: number;
  original_price: number;
  savings: number;
  is_active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  mobile_image_url: string;
  link: string;
  position: number;
  is_active: boolean;
}

export interface SupportRequest {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  role: 'customer' | 'admin';
  created_at: string;
}

// Razorpay types
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
