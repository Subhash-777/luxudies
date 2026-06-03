// ============================================
// LUXUDIES - Order History Page
// ============================================

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Eye } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Badge from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

// Sample orders for display
const SAMPLE_ORDERS = [
  {
    id: 'LXD-A1B2C3',
    date: '2026-05-28',
    status: 'delivered',
    total: 348,
    items: [
      { name: 'Enchanted Bow Pendant Necklace', price: 149, quantity: 1, image: '/images/products/bow-necklace.jpg' },
      { name: 'Golden Radiance Hoop Earrings', price: 99, quantity: 2, image: '/images/products/product-4.jpg' },
    ],
  },
  {
    id: 'LXD-D4E5F6',
    date: '2026-06-01',
    status: 'shipped',
    total: 179,
    items: [
      { name: 'Infinity Love Pendant Chain', price: 179, quantity: 1, image: '/images/products/product-5.jpg' },
    ],
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default function OrdersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-playfair text-xl font-semibold text-espresso mb-6">
        My Orders
      </h2>

      {SAMPLE_ORDERS.length === 0 ? (
        <GlassCard variant="strong" padding="lg" className="text-center py-16">
          <Package className="w-16 h-16 text-pearl-400 mx-auto mb-4" />
          <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
            No orders yet
          </h3>
          <p className="font-inter text-sm text-espresso-200 mb-6">
            When you place an order, it will appear here.
          </p>
          <Link href="/shop">
            <span className="font-inter text-sm font-semibold text-gold-500 hover:text-gold-600">
              Start Shopping →
            </span>
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {SAMPLE_ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard variant="strong" padding="md">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-inter font-semibold text-sm text-espresso">
                      Order #{order.id}
                    </p>
                    <p className="font-inter text-xs text-espresso-200">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-inter font-semibold capitalize ${statusColors[order.status] || 'bg-pearl-200 text-espresso-300'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-pearl-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-sm text-espresso line-clamp-1">{item.name}</p>
                        <p className="font-inter text-xs text-espresso-200">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-inter text-sm font-medium text-espresso shrink-0">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gold-400/10">
                  <p className="font-inter text-sm">
                    <span className="text-espresso-200">Total: </span>
                    <span className="font-bold text-espresso">{formatPrice(order.total)}</span>
                  </p>
                  <Link
                    href={`/track-order?order=${order.id}`}
                    className="flex items-center gap-1 text-xs font-inter font-semibold text-gold-500 hover:text-gold-600 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Track Order
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
