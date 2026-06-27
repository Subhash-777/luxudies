// ============================================
// LUXUDIES - Address Management Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

// Removed SAMPLE_ADDRESSES

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '', phone: '', email: '', line1: '', city: '', state: 'Tamil Nadu', pincode: '', label: 'Home'
  });

  const fetchAddresses = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const isFirst = addresses.length === 0;
      
      const { error } = await supabase.from('addresses').insert({
        ...formData,
        user_id: user.id,
        is_default: isFirst
      });
      
      if (error) throw error;
      toast.success('Address saved successfully');
      setShowForm(false);
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from('addresses').delete().eq('id', id);
      if (error) throw error;
      toast.success('Address deleted');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

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
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-playfair text-xl font-semibold text-espresso">
          Saved Addresses
        </h2>
        {!showForm && (
          <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
            Add New
          </Button>
        )}
      </div>

      {showForm ? (
        <GlassCard variant="strong" padding="lg">
          <h3 className="font-playfair text-lg font-semibold text-espresso mb-4">Add New Address</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-inter font-semibold text-espresso-300 mb-1">Label (e.g. Home, Work)</label>
                <input type="text" required value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full h-10 px-3 text-sm bg-white border border-gold-400/20 rounded-lg focus:outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-xs font-inter font-semibold text-espresso-300 mb-1">Full Name</label>
                <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full h-10 px-3 text-sm bg-white border border-gold-400/20 rounded-lg focus:outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-xs font-inter font-semibold text-espresso-300 mb-1">Phone</label>
                <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-10 px-3 text-sm bg-white border border-gold-400/20 rounded-lg focus:outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-xs font-inter font-semibold text-espresso-300 mb-1">Pincode</label>
                <input type="text" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full h-10 px-3 text-sm bg-white border border-gold-400/20 rounded-lg focus:outline-none focus:border-gold-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-inter font-semibold text-espresso-300 mb-1">Address Line 1</label>
                <input type="text" required value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} className="w-full h-10 px-3 text-sm bg-white border border-gold-400/20 rounded-lg focus:outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-xs font-inter font-semibold text-espresso-300 mb-1">City</label>
                <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full h-10 px-3 text-sm bg-white border border-gold-400/20 rounded-lg focus:outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-xs font-inter font-semibold text-espresso-300 mb-1">State</label>
                <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full h-10 px-3 text-sm bg-white border border-gold-400/20 rounded-lg focus:outline-none focus:border-gold-500" />
              </div>
            </div>
            <div className="flex gap-4 pt-4 mt-4 border-t border-gold-400/20">
              <Button type="submit" disabled={isSaving}>{isSaving ? 'SAVING...' : 'SAVE ADDRESS'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>CANCEL</Button>
            </div>
          </form>
        </GlassCard>
      ) : addresses.length === 0 ? (
        <GlassCard variant="strong" padding="lg" className="text-center py-16">
          <MapPin className="w-16 h-16 text-pearl-400 mx-auto mb-4" />
          <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
            No saved addresses
          </h3>
          <p className="font-inter text-sm text-espresso-200 mb-6">
            Add an address for faster checkout.
          </p>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>ADD ADDRESS</Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <GlassCard key={addr.id} variant="strong" padding="md" className="relative">
              {addr.is_default && (
                <span className="absolute top-3 right-3 text-[10px] font-inter font-semibold text-gold-500 bg-gold-50 px-2 py-0.5 rounded-full">
                  DEFAULT
                </span>
              )}
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span className="font-inter font-semibold text-sm text-espresso">{addr.label}</span>
              </div>
              <p className="font-inter text-sm text-espresso mb-0.5">{addr.full_name}</p>
              <p className="font-inter text-xs text-espresso-200 leading-relaxed">
                {addr.line1}<br />
                {addr.line2 && <>{addr.line2}<br /></>}
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="font-inter text-xs text-espresso-200 mt-1">{addr.phone}</p>

              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-1 text-xs font-inter text-espresso-200 hover:text-gold-500 transition-colors">
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button onClick={() => handleDelete(addr.id)} className="flex items-center gap-1 text-xs font-inter text-espresso-200 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </motion.div>
  );
}
