// ============================================
// LUXUDIES - Admin Orders Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Download, ChevronDown, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import { formatPrice, cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import OrderDetailModal from '@/components/admin/order-detail-modal';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-purple-50 text-purple-700',
  out_for_delivery: 'bg-orange-50 text-orange-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  returned: 'bg-gray-50 text-gray-700',
};

const statusOptions = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createClient();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error('Failed to load orders: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchString = `${order.order_number} ${order.customer_name} ${order.customer_email}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="font-playfair text-2xl font-bold text-espresso">Orders</h1>
          <p className="font-inter text-sm text-espresso-200">{orders.length} total orders</p>
        </div>
        <Button variant="outline" icon={<Download className="w-4 h-4" />}>Export</Button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
          <input
            type="text"
            placeholder="Search by ID, name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-xl text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/40 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none h-10 pl-4 pr-10 bg-white/60 border border-gold-400/15 rounded-xl text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/40 cursor-pointer capitalize"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <GlassCard variant="strong" padding="none">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-espresso-300">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
            <p className="font-inter text-sm font-medium">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-espresso-300">
            <p className="font-inter font-medium mb-1">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-400/10">
                  {['Order', 'Customer', 'City', 'Amount', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gold-400/5 last:border-b-0 hover:bg-pearl-100/50 transition-colors">
                    <td className="p-4 font-inter text-sm font-semibold text-espresso">{order.order_number}</td>
                    <td className="p-4">
                      <p className="font-inter text-sm text-espresso">{order.customer_name}</p>
                      <p className="font-inter text-[10px] text-espresso-200">{order.customer_phone}</p>
                    </td>
                    <td className="p-4 font-inter text-sm text-espresso-300">{order.shipping_city}</td>
                    <td className="p-4 font-inter text-sm font-medium text-espresso">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold capitalize ${statusColors[order.status] || 'bg-gray-50 text-gray-700'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-inter text-xs text-espresso-200">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                        className="p-1.5 rounded-lg text-espresso-200 hover:bg-pearl-200 hover:text-espresso transition-colors flex items-center gap-1 text-xs font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Order Detail Modal */}
      <OrderDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
        onStatusChange={fetchOrders}
      />
    </div>
  );
}
