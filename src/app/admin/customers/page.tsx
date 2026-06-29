// ============================================
// LUXUDIES - Admin Customers Page (with Delete + Stats)
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Loader2, Trash2, Users, ShoppingBag,
  IndianRupee, ChevronDown, ChevronUp, Mail, Phone,
  RefreshCw, Square, CheckSquare, Calendar,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CustomerRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  order_count: number;
  total_spend: number;
  orders: any[];
  expanded: boolean;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'single' | 'bulk'; id?: string } | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const supabase = createClient();

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get all users with role=customer
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get orders for each user (group by email for guests too)
      const { data: orders } = await supabase
        .from('orders')
        .select('user_id, customer_email, total, status, order_number, created_at, shipping_city')
        .order('created_at', { ascending: false });

      const customerRows: CustomerRow[] = (users || []).map((user) => {
        const userOrders = (orders || []).filter(
          (o) => o.user_id === user.id || o.customer_email === user.email
        );
        const totalSpend = userOrders
          .filter((o) => o.status !== 'cancelled' && o.status !== 'returned')
          .reduce((sum, o) => sum + Number(o.total), 0);

        return {
          id: user.id,
          full_name: user.full_name || 'Guest User',
          email: user.email || '—',
          phone: user.phone || '—',
          created_at: user.created_at,
          order_count: userOrders.length,
          total_spend: totalSpend,
          orders: userOrders.slice(0, 5),
          expanded: false,
        };
      });

      setCustomers(customerRows);
    } catch (err: any) {
      toast.error('Failed to load customers: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const toggleExpand = (id: string) =>
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, expanded: !c.expanded } : c)));

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelectedIds(
      selectedIds.size === filtered.length && filtered.length > 0
        ? new Set()
        : new Set(filtered.map((c) => c.id))
    );

  const deleteCustomer = async (id: string) => {
    setIsDeletingId(id);
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
      toast.success('Customer deleted');
    } catch (err: any) {
      toast.error('Delete failed: ' + err.message);
    } finally {
      setIsDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const bulkDelete = async () => {
    setIsBulkDeleting(true);
    const ids = Array.from(selectedIds);
    try {
      const { error } = await supabase.from('users').delete().in('id', ids);
      if (error) throw error;
      setCustomers((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
      toast.success(`${ids.length} customer(s) deleted`);
    } catch (err: any) {
      toast.error('Bulk delete failed: ' + err.message);
    } finally {
      setIsBulkDeleting(false);
      setShowDeleteConfirm(null);
    }
  };

  // Summary stats
  const totalSpend = customers.reduce((s, c) => s + c.total_spend, 0);
  const totalOrders = customers.reduce((s, c) => s + c.order_count, 0);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="font-playfair text-2xl font-bold text-gray-900">Customers</h1>
            <p className="font-inter text-sm text-gray-400">{customers.length} registered customers</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchCustomers} className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
            {selectedIds.size > 0 && (
              <button
                onClick={() => setShowDeleteConfirm({ type: 'bulk' })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-inter font-semibold transition-all"
              >
                <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total Customers', value: customers.length.toString(), icon: Users, color: 'bg-blue-50 text-blue-600' },
            { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, color: 'bg-amber-50 text-amber-600' },
            { label: 'Total Revenue', value: formatPrice(totalSpend), icon: IndianRupee, color: 'bg-green-50 text-green-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${s.color} bg-opacity-50 flex items-center justify-center flex-shrink-0`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-inter text-sm font-bold text-gray-900 truncate">{s.value}</p>
                <p className="font-inter text-[10px] text-gray-400 truncate">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name, email, or phone…"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-inter focus:outline-none focus:border-amber-400 transition-all" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
            <p className="text-sm font-inter text-gray-400">Loading customers…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16">
            <p className="font-inter text-gray-400">No customers found</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-[40px_1fr_1fr_auto_auto_auto] gap-4 px-4 py-3 border-b border-gray-100 bg-gray-50/60">
              <button onClick={toggleAll} className="flex items-center justify-center text-gray-400 hover:text-amber-500 transition-colors">
                {selectedIds.size === filtered.length && filtered.length > 0
                  ? <CheckSquare className="w-4 h-4 text-amber-500" />
                  : <Square className="w-4 h-4" />}
              </button>
              {['Customer', 'Contact', 'Orders', 'Spend', 'Actions'].map((h) => (
                <span key={h} className="text-[10px] font-inter font-semibold text-gray-400 uppercase tracking-wider">{h}</span>
              ))}
            </div>

            {/* Rows */}
            <div>
              {filtered.map((customer) => (
                <div key={customer.id} className={`border-b border-gray-50 last:border-0 transition-colors ${selectedIds.has(customer.id) ? 'bg-amber-50/60' : ''}`}>
                  {/* Main Row */}
                  <div className="grid grid-cols-[40px_1fr_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 hover:bg-gray-50/60 transition-colors">
                    {/* Checkbox */}
                    <button onClick={() => toggleSelect(customer.id)} className="flex items-center justify-center text-gray-400 hover:text-amber-500 transition-colors">
                      {selectedIds.has(customer.id)
                        ? <CheckSquare className="w-4 h-4 text-amber-500" />
                        : <Square className="w-4 h-4" />}
                    </button>

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-white font-inter font-bold text-sm shrink-0 uppercase">
                        {customer.full_name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-inter text-sm font-semibold text-gray-800 truncate">{customer.full_name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-inter">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(customer.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs text-gray-600 font-inter truncate">
                        <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        {customer.email}
                      </div>
                      {customer.phone !== '—' && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-inter mt-0.5">
                          <Phone className="w-2.5 h-2.5" />
                          {customer.phone}
                        </div>
                      )}
                    </div>

                    {/* Orders count */}
                    <div className="text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-700 font-inter font-bold text-xs">
                        {customer.order_count}
                      </span>
                    </div>

                    {/* Total spend */}
                    <div className="font-inter text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {formatPrice(customer.total_spend)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {customer.orders.length > 0 && (
                        <button
                          onClick={() => toggleExpand(customer.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                          title="View orders"
                        >
                          {customer.expanded
                            ? <ChevronUp className="w-3.5 h-3.5" />
                            : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <button
                        onClick={() => setShowDeleteConfirm({ type: 'single', id: customer.id })}
                        disabled={isDeletingId === customer.id}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-40"
                        title="Delete customer"
                      >
                        {isDeletingId === customer.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Orders */}
                  <AnimatePresence>
                    {customer.expanded && customer.orders.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-14 pb-3 pt-1 bg-gray-50/60 border-t border-gray-100">
                          <p className="text-[10px] font-inter font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent Orders</p>
                          <div className="space-y-1.5">
                            {customer.orders.map((order) => (
                              <div key={order.order_number} className="flex items-center justify-between text-xs font-inter">
                                <span className="text-gray-600 font-semibold">{order.order_number}</span>
                                <span className="text-gray-400">{order.shipping_city}</span>
                                <span className="font-semibold text-gray-700">{formatPrice(order.total)}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>
                                  {order.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-gray-900 text-center mb-2">
                {showDeleteConfirm.type === 'bulk' ? `Delete ${selectedIds.size} Customers?` : 'Delete Customer?'}
              </h3>
              <p className="font-inter text-sm text-gray-400 text-center mb-6">
                This will permanently remove the customer from the database. Their order history will remain.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-inter font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button
                  onClick={() => showDeleteConfirm.type === 'bulk' ? bulkDelete() : deleteCustomer(showDeleteConfirm.id!)}
                  disabled={isBulkDeleting || !!isDeletingId}
                  className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-inter font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {(isBulkDeleting || !!isDeletingId) && <Loader2 className="w-4 h-4 animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
