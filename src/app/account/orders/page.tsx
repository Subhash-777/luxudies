// ============================================
// LUXUDIES - Order History Page (Redesigned)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, Eye, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

// Removed SAMPLE_ORDERS

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50/50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50/50 text-blue-700 border-blue-200',
  shipped: 'bg-gold-50/50 text-gold-700 border-gold-200',
  delivered: 'bg-green-50/50 text-green-700 border-green-200',
  cancelled: 'bg-red-50/50 text-red-700 border-red-200',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            order_number,
            created_at,
            status,
            total,
            order_items (
              product_name,
              price,
              quantity,
              product_image
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

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

      {orders.length === 0 ? (
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
          {orders.map((order, i) => (
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
                      Order #{order.order_number}
                    </p>
                    <p className="font-inter text-xs text-espresso-200 uppercase tracking-widest">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
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
                  {order.order_items.map((item: any, j: number) => (
                    <div key={j} className="flex items-center gap-4 p-3 hover:bg-white/40 transition-colors rounded-xl">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-pearl-100 shrink-0 border border-gold-400/10 shadow-sm">
                        <Image src={item.product_image || '/images/brand/logo.jpg'} alt={item.product_name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-playfair text-sm font-semibold text-espresso line-clamp-1 mb-1">{item.product_name}</p>
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
                    href={`/track-order?order=${order.order_number}`}
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
