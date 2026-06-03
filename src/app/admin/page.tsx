// ============================================
// LUXUDIES - Admin Dashboard
// ============================================

'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, ShoppingBag, Users, Package, IndianRupee,
  ArrowUpRight, ArrowDownRight, Eye, Clock,
} from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import { formatPrice } from '@/lib/utils';

const stats = [
  {
    label: 'Total Revenue',
    value: formatPrice(45678),
    change: '+12.5%',
    isUp: true,
    icon: IndianRupee,
    color: 'from-gold-100 to-gold-50',
  },
  {
    label: 'Total Orders',
    value: '156',
    change: '+8.3%',
    isUp: true,
    icon: ShoppingBag,
    color: 'from-green-100 to-green-50',
  },
  {
    label: 'Total Customers',
    value: '89',
    change: '+15.2%',
    isUp: true,
    icon: Users,
    color: 'from-blue-100 to-blue-50',
  },
  {
    label: 'Pending Orders',
    value: '7',
    change: '-3',
    isUp: false,
    icon: Clock,
    color: 'from-orange-100 to-orange-50',
  },
];

const recentOrders = [
  { id: 'LXD-A1B2C3', customer: 'Priya M.', amount: 348, status: 'delivered', date: 'Jun 01' },
  { id: 'LXD-D4E5F6', customer: 'Sneha R.', amount: 179, status: 'shipped', date: 'Jun 01' },
  { id: 'LXD-G7H8I9', customer: 'Arjun S.', amount: 249, status: 'confirmed', date: 'Jun 02' },
  { id: 'LXD-J0K1L2', customer: 'Deepa K.', amount: 129, status: 'pending', date: 'Jun 02' },
  { id: 'LXD-M3N4O5', customer: 'Kavitha L.', amount: 199, status: 'shipped', date: 'Jun 03' },
];

const topProducts = [
  { name: '3 Iconic Earrings Set', sold: 42, revenue: 10458 },
  { name: 'Enchanted Bow Pendant', sold: 38, revenue: 5662 },
  { name: 'Infinity Love Pendant', sold: 29, revenue: 5191 },
  { name: 'Golden Radiance Hoops', sold: 25, revenue: 2475 },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
};

export default function AdminDashboard() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-playfair text-2xl lg:text-3xl font-bold text-espresso">Dashboard</h1>
        <p className="font-inter text-sm text-espresso-200 mt-1">Welcome back to LUXUDIES Admin</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard variant="strong" padding="md">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-espresso-400" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-inter font-semibold ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="font-inter text-xl lg:text-2xl font-bold text-espresso">{stat.value}</p>
              <p className="font-inter text-xs text-espresso-200 mt-0.5">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <GlassCard variant="strong" padding="lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-lg font-semibold text-espresso">Recent Orders</h2>
              <span className="text-xs font-inter text-gold-500 hover:text-gold-600 cursor-pointer">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-400/10">
                    <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider pb-3">Order</th>
                    <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider pb-3">Customer</th>
                    <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider pb-3">Amount</th>
                    <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider pb-3">Status</th>
                    <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gold-400/5 last:border-b-0">
                      <td className="py-3 font-inter text-sm font-medium text-espresso">{order.id}</td>
                      <td className="py-3 font-inter text-sm text-espresso-300">{order.customer}</td>
                      <td className="py-3 font-inter text-sm font-medium text-espresso">{formatPrice(order.amount)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold capitalize ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 font-inter text-xs text-espresso-200">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <GlassCard variant="strong" padding="lg">
            <h2 className="font-playfair text-lg font-semibold text-espresso mb-5">Top Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={product.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-pearl-200 flex items-center justify-center text-xs font-inter font-bold text-espresso-300">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-sm font-medium text-espresso line-clamp-1">{product.name}</p>
                    <p className="font-inter text-xs text-espresso-200">{product.sold} sold</p>
                  </div>
                  <span className="font-inter text-sm font-semibold text-espresso shrink-0">
                    {formatPrice(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
