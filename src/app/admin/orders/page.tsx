// ============================================
// LUXUDIES - Admin Orders Page
// ============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Truck, Download, ChevronDown } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import { formatPrice, cn } from '@/lib/utils';

const SAMPLE_ADMIN_ORDERS = [
  { id: 'LXD-A1B2C3', customer: 'Priya Menon', email: 'priya@email.com', phone: '+91 98765 43210', amount: 348, status: 'delivered', date: '2026-05-28', items: 2, city: 'Chennai' },
  { id: 'LXD-D4E5F6', customer: 'Sneha Ravi', email: 'sneha@email.com', phone: '+91 87654 32109', amount: 179, status: 'shipped', date: '2026-06-01', items: 1, city: 'Coimbatore' },
  { id: 'LXD-G7H8I9', customer: 'Arjun Sundaram', email: 'arjun@email.com', phone: '+91 76543 21098', amount: 249, status: 'confirmed', date: '2026-06-02', items: 1, city: 'Madurai' },
  { id: 'LXD-J0K1L2', customer: 'Deepa Kumar', email: 'deepa@email.com', phone: '+91 65432 10987', amount: 129, status: 'pending', date: '2026-06-02', items: 1, city: 'Salem' },
  { id: 'LXD-M3N4O5', customer: 'Kavitha Lakshmi', email: 'kavitha@email.com', phone: '+91 54321 09876', amount: 199, status: 'shipped', date: '2026-06-03', items: 2, city: 'Tiruchirappalli' },
  { id: 'LXD-P6Q7R8', customer: 'Anitha S.', email: 'anitha@email.com', phone: '+91 43210 98765', amount: 398, status: 'pending', date: '2026-06-03', items: 3, city: 'Tirunelveli' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

const statusOptions = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = SAMPLE_ADMIN_ORDERS.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
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
          <p className="font-inter text-sm text-espresso-200">{SAMPLE_ADMIN_ORDERS.length} total orders</p>
        </div>
        <Button variant="outline" icon={<Download className="w-4 h-4" />}>Export</Button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
          <input
            type="text"
            placeholder="Search orders..."
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
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <GlassCard variant="strong" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-400/10">
                {['Order', 'Customer', 'City', 'Items', 'Amount', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gold-400/5 last:border-b-0 hover:bg-pearl-100/50 transition-colors">
                  <td className="p-4 font-inter text-sm font-semibold text-espresso">{order.id}</td>
                  <td className="p-4">
                    <p className="font-inter text-sm text-espresso">{order.customer}</p>
                    <p className="font-inter text-[10px] text-espresso-200">{order.phone}</p>
                  </td>
                  <td className="p-4 font-inter text-sm text-espresso-300">{order.city}</td>
                  <td className="p-4 font-inter text-sm text-espresso-300">{order.items}</td>
                  <td className="p-4 font-inter text-sm font-medium text-espresso">{formatPrice(order.amount)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 font-inter text-xs text-espresso-200">
                    {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-espresso-200 hover:bg-pearl-200 hover:text-espresso transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-espresso-200 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                        <Truck className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
