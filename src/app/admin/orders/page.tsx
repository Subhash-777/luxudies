// ============================================
// LUXUDIES - Admin Orders Page (with Delete + Export)
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Eye, Download, ChevronDown, Loader2,
  Trash2, CheckSquare, Square, RefreshCw, X,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import OrderDetailModal from '@/components/admin/order-detail-modal';

const statusColors: Record<string, string> = {
  pending:         'bg-yellow-50 text-yellow-700 border border-yellow-200',
  confirmed:       'bg-blue-50 text-blue-700 border border-blue-200',
  processing:      'bg-indigo-50 text-indigo-700 border border-indigo-200',
  shipped:         'bg-purple-50 text-purple-700 border border-purple-200',
  out_for_delivery:'bg-orange-50 text-orange-700 border border-orange-200',
  delivered:       'bg-green-50 text-green-700 border border-green-200',
  cancelled:       'bg-red-50 text-red-700 border border-red-200',
  returned:        'bg-gray-50 text-gray-600 border border-gray-200',
};

const statusOptions = [
  'all', 'pending', 'confirmed', 'processing',
  'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<'single' | 'bulk' | null>(null);

  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      toast.error('Failed to load orders: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── Filter ──────────────────────────────────────────────────
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const match = `${o.order_number} ${o.customer_name} ${o.customer_email} ${o.customer_phone}`.toLowerCase().includes(q);
    const status = statusFilter === 'all' || o.status === statusFilter;
    return match && status;
  });

  // ── Select ─────────────────────────────────────────────────
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelectedIds(
      selectedIds.size === filteredOrders.length
        ? new Set()
        : new Set(filteredOrders.map((o) => o.id))
    );

  // ── Delete single ───────────────────────────────────────────
  const deleteSingle = async (orderId: string) => {
    setIsDeletingId(orderId);
    try {
      // Delete items first (FK constraint)
      await supabase.from('order_items').delete().eq('order_id', orderId);
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setSelectedIds((prev) => { const s = new Set(prev); s.delete(orderId); return s; });
      toast.success('Order deleted');
    } catch (err: any) {
      toast.error('Delete failed: ' + err.message);
    } finally {
      setIsDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  // ── Bulk delete ─────────────────────────────────────────────
  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);
    const ids = Array.from(selectedIds);
    try {
      await supabase.from('order_items').delete().in('order_id', ids);
      const { error } = await supabase.from('orders').delete().in('id', ids);
      if (error) throw error;
      setOrders((prev) => prev.filter((o) => !selectedIds.has(o.id)));
      setSelectedIds(new Set());
      toast.success(`${ids.length} order(s) deleted`);
    } catch (err: any) {
      toast.error('Bulk delete failed: ' + err.message);
    } finally {
      setIsBulkDeleting(false);
      setShowDeleteConfirm(null);
    }
  };

  // ── CSV Export ──────────────────────────────────────────────
  const exportCSV = () => {
    const rows = filteredOrders.map((o) => [
      o.order_number, o.customer_name, o.customer_email, o.customer_phone,
      o.shipping_city, o.shipping_state, o.total, o.status,
      new Date(o.created_at).toLocaleDateString('en-IN'),
    ]);
    const header = ['Order #', 'Name', 'Email', 'Phone', 'City', 'State', 'Amount', 'Status', 'Date'];
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `luxudies-orders-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-gray-900">Orders</h1>
          <p className="font-inter text-sm text-gray-400">
            {orders.length} total · {' '}
            {pendingCount > 0 && (
              <span className="text-yellow-600 font-semibold">{pendingCount} pending</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchOrders} className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-inter font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          {selectedIds.size > 0 && (
            <button
              onClick={() => setShowDeleteConfirm('bulk')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-inter font-semibold transition-all"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
            </button>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by order, name, phone…" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-inter focus:outline-none focus:border-amber-400 transition-all" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none h-10 pl-4 pr-9 bg-white border border-gray-200 rounded-xl text-sm font-inter text-gray-700 focus:outline-none focus:border-amber-400 cursor-pointer capitalize">
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
            <p className="text-sm font-inter text-gray-400">Loading orders…</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-300">
            <p className="font-inter font-medium text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="p-4 w-10">
                    <button onClick={toggleAll} className="text-gray-400 hover:text-gray-700 transition-colors">
                      {selectedIds.size === filteredOrders.length && filteredOrders.length > 0
                        ? <CheckSquare className="w-4 h-4 text-amber-500" />
                        : <Square className="w-4 h-4" />}
                    </button>
                  </th>
                  {['Order', 'Customer', 'City', 'Amount', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-inter font-semibold text-gray-400 uppercase tracking-wider p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}
                    className={`border-b border-gray-50 last:border-b-0 transition-colors ${selectedIds.has(order.id) ? 'bg-amber-50' : 'hover:bg-gray-50/60'}`}>
                    <td className="p-4">
                      <button onClick={() => toggleSelect(order.id)} className="text-gray-400 hover:text-amber-500 transition-colors">
                        {selectedIds.has(order.id)
                          ? <CheckSquare className="w-4 h-4 text-amber-500" />
                          : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="p-4 font-inter text-sm font-semibold text-gray-800">{order.order_number}</td>
                    <td className="p-4">
                      <p className="font-inter text-sm text-gray-700">{order.customer_name}</p>
                      <p className="font-inter text-[10px] text-gray-400">{order.customer_phone}</p>
                    </td>
                    <td className="p-4 font-inter text-sm text-gray-500">{order.shipping_city}</td>
                    <td className="p-4 font-inter text-sm font-semibold text-gray-800">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-inter font-semibold capitalize ${statusColors[order.status] || 'bg-gray-50 text-gray-600'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-inter text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-inter font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          onClick={() => { setSelectedOrder(order); setShowDeleteConfirm('single'); }}
                          disabled={isDeletingId === order.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-inter font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-40"
                        >
                          {isDeletingId === order.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                {showDeleteConfirm === 'bulk' ? `Delete ${selectedIds.size} Orders?` : 'Delete Order?'}
              </h3>
              <p className="font-inter text-sm text-gray-400 text-center mb-6">
                {showDeleteConfirm === 'bulk'
                  ? 'This will permanently delete the selected orders and their items. This cannot be undone.'
                  : `Order ${selectedOrder?.order_number} will be permanently deleted.`}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-inter font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button
                  onClick={() => showDeleteConfirm === 'bulk' ? bulkDelete() : deleteSingle(selectedOrder?.id)}
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
