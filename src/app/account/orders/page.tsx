// ============================================
// LUXUDIES - Order History Page (Redesigned)
// ============================================

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, Eye } from 'lucide-react';
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
      { name: 'Golden Radiance Hoop Earrings', price: 99, quantity: 2, image: '/images/products/bracelet.jpg' },
    ],
  },
  {
    id: 'LXD-D4E5F6',
    date: '2026-06-01',
    status: 'shipped',
    total: 179,
    items: [
      { name: 'Infinity Love Pendant Chain', price: 179, quantity: 1, image: '/images/products/ring.jpg' },
    ],
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50/50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50/50 text-blue-700 border-blue-200',
  shipped: 'bg-gold-50/50 text-gold-700 border-gold-200',
  delivered: 'bg-green-50/50 text-green-700 border-green-200',
  cancelled: 'bg-red-50/50 text-red-700 border-red-200',
};

export default function OrdersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-6 border-b border-gold-400/20 pb-4">
        <h2 className="font-playfair text-xl sm:text-2xl font-bold text-espresso">
          My Orders
        </h2>
      </div>

      {SAMPLE_ORDERS.length === 0 ? (
        <div className="glass-card p-12 text-center py-20 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-pearl-100 flex items-center justify-center mb-6 shadow-inner border border-gold-400/10">
            <Package className="w-8 h-8 text-gold-300" />
          </div>
          <h3 className="font-playfair text-2xl font-bold text-espresso mb-3">
            No orders yet
          </h3>
          <p className="font-inter text-sm text-espresso-300 mb-8 max-w-sm">
            When you place an order, it will appear here. Start your journey of elegance today.
          </p>
          <Link href="/shop">
            <button className="btn-gold px-8 py-3 text-xs tracking-widest shadow-gold">
              START SHOPPING
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {SAMPLE_ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="glass-card p-4 sm:p-6 lg:p-8">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-gold-400/10">
                  <div>
                    <p className="font-playfair font-bold text-lg text-espresso mb-1">
                      Order #{order.id}
                    </p>
                    <p className="font-inter text-xs text-espresso-200 uppercase tracking-widest">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-inter font-bold uppercase tracking-widest border self-start sm:self-auto ${statusColors[order.status] || 'bg-pearl-200 text-espresso-300 border-pearl-300'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-4 p-3 hover:bg-white/40 transition-colors rounded-xl">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-pearl-100 shrink-0 border border-gold-400/10 shadow-sm">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-playfair text-sm font-semibold text-espresso line-clamp-1 mb-1">{item.name}</p>
                        <p className="font-inter text-[11px] text-espresso-200 uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-inter text-sm font-bold text-antique shrink-0">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gold-400/20 mt-6">
                  <p className="font-inter text-sm flex items-center gap-2">
                    <span className="text-espresso-300 uppercase tracking-widest text-[11px]">Total</span>
                    <span className="font-bold text-lg text-espresso">{formatPrice(order.total)}</span>
                  </p>
                  <Link
                    href={`/track-order?order=${order.id}`}
                  >
                    <button className="btn-ghost-gold px-6 py-2 text-[10px] sm:text-xs flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5" />
                      TRACK ORDER
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
