import { useState } from 'react';
import AdminModal from './admin-modal';
import Button from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Package, User, MapPin, CreditCard, Clock } from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onStatusChange: () => void;
}

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

export default function OrderDetailModal({ isOpen, onClose, order, onStatusChange }: OrderDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(order?.status || 'pending');
  const supabase = createClient();

  if (!order) return null;

  const handleUpdateStatus = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', order.id);
        
      if (error) throw error;
      
      // Add history record
      await supabase.from('order_status_history').insert([{
        order_id: order.id,
        status: status,
        note: 'Updated by admin via dashboard'
      }]);

      toast.success('Order status updated');
      onStatusChange();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={`Order #${order.order_number}`} className="md:w-[800px]">
      <div className="space-y-6">
        
        {/* Quick Status Update */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/60 border border-gold-400/20 rounded-xl gap-4">
          <div>
            <h3 className="text-sm font-semibold text-espresso">Update Order Status</h3>
            <p className="text-xs text-espresso-200">Current status: <span className="font-semibold uppercase">{order.status}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 px-3 bg-white border border-gold-400/20 rounded-lg text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/50 capitalize"
            >
              {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            <Button size="sm" onClick={handleUpdateStatus} isLoading={isLoading} disabled={status === order.status}>
              Update
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Details */}
          <div className="p-4 bg-white/40 border border-gold-400/10 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-espresso mb-2">
              <User className="w-4 h-4 text-gold-500" />
              <h3 className="font-semibold text-sm">Customer Details</h3>
            </div>
            <div className="text-sm text-espresso-300 space-y-1">
              <p><span className="font-medium text-espresso">Name:</span> {order.customer_name}</p>
              <p><span className="font-medium text-espresso">Email:</span> {order.customer_email}</p>
              <p><span className="font-medium text-espresso">Phone:</span> {order.customer_phone}</p>
              {order.customer_alternate_phone && (
                <p><span className="font-medium text-espresso">Alt Phone:</span> {order.customer_alternate_phone}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-4 bg-white/40 border border-gold-400/10 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-espresso mb-2">
              <MapPin className="w-4 h-4 text-gold-500" />
              <h3 className="font-semibold text-sm">Shipping Address</h3>
            </div>
            <div className="text-sm text-espresso-300 space-y-1">
              <p>{order.shipping_line1}</p>
              {order.shipping_line2 && <p>{order.shipping_line2}</p>}
              <p>{order.shipping_city}, {order.shipping_state}</p>
              <p className="font-medium text-espresso">PIN: {order.shipping_pincode}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-4 bg-white/40 border border-gold-400/10 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-espresso mb-2">
              <CreditCard className="w-4 h-4 text-gold-500" />
              <h3 className="font-semibold text-sm">Payment Info</h3>
            </div>
            <div className="text-sm text-espresso-300 space-y-1">
              <p><span className="font-medium text-espresso">Method:</span> <span className="capitalize">{order.payment_method}</span></p>
              <p><span className="font-medium text-espresso">Status:</span> <span className={`capitalize font-semibold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.payment_status}</span></p>
              {order.razorpay_order_id && (
                <p className="text-xs font-mono break-all mt-2 pt-2 border-t border-gold-400/10">RPay Order: {order.razorpay_order_id}</p>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="p-4 bg-white/40 border border-gold-400/10 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-espresso mb-2">
              <Clock className="w-4 h-4 text-gold-500" />
              <h3 className="font-semibold text-sm">Order Summary</h3>
            </div>
            <div className="text-sm text-espresso-300 space-y-1">
              <p className="flex justify-between"><span>Subtotal:</span> <span>{formatPrice(order.subtotal)}</span></p>
              <p className="flex justify-between"><span>Shipping:</span> <span>{formatPrice(order.shipping_cost)}</span></p>
              <p className="flex justify-between"><span>Discount:</span> <span>-{formatPrice(order.discount)}</span></p>
              <p className="flex justify-between font-bold text-espresso pt-2 border-t border-gold-400/10 mt-2">
                <span>Total:</span> <span>{formatPrice(order.total)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <div className="flex items-center gap-2 text-espresso mb-3">
            <Package className="w-4 h-4 text-gold-500" />
            <h3 className="font-semibold text-sm">Order Items</h3>
          </div>
          <div className="border border-gold-400/20 rounded-xl overflow-hidden bg-white/60">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-400/10 bg-pearl-50/50">
                  <th className="text-left text-xs font-semibold text-espresso-200 p-3">Item</th>
                  <th className="text-right text-xs font-semibold text-espresso-200 p-3">Price</th>
                  <th className="text-center text-xs font-semibold text-espresso-200 p-3">Qty</th>
                  <th className="text-right text-xs font-semibold text-espresso-200 p-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-400/10">
                {order.order_items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="p-3 text-sm font-medium text-espresso">{item.product_name}</td>
                    <td className="p-3 text-sm text-espresso-300 text-right">{formatPrice(item.price)}</td>
                    <td className="p-3 text-sm text-espresso-300 text-center">{item.quantity}</td>
                    <td className="p-3 text-sm font-medium text-espresso text-right">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminModal>
  );
}
