// ============================================
// LUXUDIES - Admin Dashboard
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Users, IndianRupee,
  ArrowUpRight, ArrowDownRight, Clock, Loader2
} from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

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

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Orders for stats and recent list
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // 2. Fetch Customers count
        const { count: customersCount, error: customersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer');

        if (customersError) throw customersError;

        // 3. Fetch recent order items for Top Products approximation
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('product_name, price, quantity')
          .order('created_at', { ascending: false })
          .limit(100);

        // Process Stats
        let revenue = 0;
        let pendingCount = 0;

        orders?.forEach(order => {
          if (order.status !== 'cancelled' && order.status !== 'returned') {
            revenue += Number(order.total);
          }
          if (order.status === 'pending') {
            pendingCount++;
          }
        });

        setStats({
          totalRevenue: revenue,
          totalOrders: orders?.length || 0,
          totalCustomers: customersCount || 0,
          pendingOrders: pendingCount,
        });

        setRecentOrders(orders?.slice(0, 5) || []);

        // Process Top Products (simple aggregation from recent items)
        const productStats: Record<string, { name: string, sold: number, revenue: number }> = {};
        orderItems?.forEach(item => {
          if (!productStats[item.product_name]) {
            productStats[item.product_name] = { name: item.product_name, sold: 0, revenue: 0 };
          }
          productStats[item.product_name].sold += item.quantity;
          productStats[item.product_name].revenue += (item.price * item.quantity);
        });

        const sortedProducts = Object.values(productStats)
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 4); // Top 4

        setTopProducts(sortedProducts);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      change: '+12.5%', // Mock change for now
      isUp: true,
      icon: IndianRupee,
      color: 'from-gold-100 to-gold-50',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: '+8.3%',
      isUp: true,
      icon: ShoppingBag,
      color: 'from-green-100 to-green-50',
    },
    {
      label: 'Total Customers',
      value: stats.totalCustomers.toString(),
      change: '+15.2%',
      isUp: true,
      icon: Users,
      color: 'from-blue-100 to-blue-50',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      change: stats.pendingOrders > 0 ? 'Needs action' : 'All clear',
      isUp: stats.pendingOrders === 0,
      icon: Clock,
      color: 'from-orange-100 to-orange-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-gold-500 mb-4" />
        <p className="font-inter text-espresso-300">Loading dashboard data...</p>
      </div>
    );
  }

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
        {statCards.map((stat, i) => (
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
                  {stat.change.includes('%') && (stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />)}
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
          <GlassCard variant="strong" padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-lg font-semibold text-espresso">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs font-inter text-gold-500 hover:text-gold-600 cursor-pointer">
                View All
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-10 text-espresso-200 text-sm">No orders yet.</div>
            ) : (
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
                        <td className="py-3 font-inter text-sm font-medium text-espresso">{order.order_number}</td>
                        <td className="py-3 font-inter text-sm text-espresso-300">{order.customer_name}</td>
                        <td className="py-3 font-inter text-sm font-medium text-espresso">{formatPrice(order.total)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold capitalize ${statusColors[order.status] || 'bg-gray-50 text-gray-700'}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 font-inter text-xs text-espresso-200">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <GlassCard variant="strong" padding="lg" className="h-full">
            <h2 className="font-playfair text-lg font-semibold text-espresso mb-5">Top Products (Recent)</h2>
            {topProducts.length === 0 ? (
              <div className="text-center py-10 text-espresso-200 text-sm">No sales data yet.</div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, i) => (
                  <div key={product.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-pearl-200 flex items-center justify-center text-xs font-inter font-bold text-espresso-300 shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-sm font-medium text-espresso line-clamp-1" title={product.name}>{product.name}</p>
                      <p className="font-inter text-xs text-espresso-200">{product.sold} sold</p>
                    </div>
                    <span className="font-inter text-sm font-semibold text-espresso shrink-0">
                      {formatPrice(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
