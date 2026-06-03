// ============================================
// LUXUDIES - Utility Functions
// ============================================

import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names with clsx (Tailwind-friendly)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format price in INR
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercent(price: number, compareAt: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/**
 * Generate a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const prefix = 'LXD';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Format a date relative to now
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a date for display
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Get WhatsApp chat URL
 */
export function getWhatsAppUrl(message?: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${phone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if we should reduce motion (SSR-safe)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Order status labels and colors
 */
export const ORDER_STATUS_CONFIG = {
  placed: { label: 'Order Placed', color: '#D4AF37', icon: 'ShoppingBag' },
  confirmed: { label: 'Confirmed', color: '#B8902D', icon: 'CheckCircle' },
  packed: { label: 'Packed', color: '#D4AF37', icon: 'Package' },
  shipped: { label: 'Shipped', color: '#D4AF37', icon: 'Truck' },
  out_for_delivery: { label: 'Out for Delivery', color: '#B8902D', icon: 'MapPin' },
  delivered: { label: 'Delivered', color: '#22c55e', icon: 'CheckCircle2' },
  cancelled: { label: 'Cancelled', color: '#ef4444', icon: 'XCircle' },
  returned: { label: 'Returned', color: '#f97316', icon: 'RotateCcw' },
} as const;

/**
 * Shipping info — free across Tamil Nadu
 */
export const SHIPPING_CONFIG = {
  isFree: true,
  region: 'Tamil Nadu',
  estimatedDays: { min: 3, max: 7 },
  message: 'Free Shipping Across Tamil Nadu',
};

/**
 * Product benefit icons & labels
 */
export const PRODUCT_BENEFITS = [
  { key: 'anti-tarnish', label: 'Anti-Tarnish', description: 'Long-lasting shine', icon: 'Shield' },
  { key: 'lightweight', label: 'Lightweight', description: 'All-day comfort', icon: 'Feather' },
  { key: 'water-resistant', label: 'Water & Sweat Resistant', description: 'Worry-free wear', icon: 'Droplets' },
  { key: 'gift-ready', label: 'Gift-Ready', description: 'Premium packaging', icon: 'Gift' },
  { key: 'hypoallergenic', label: 'Hypoallergenic', description: 'Nickel & lead free', icon: 'Heart' },
  { key: '18k-gold', label: '18K Gold Plated', description: 'Luxurious gold shine', icon: 'Sparkles' },
] as const;
