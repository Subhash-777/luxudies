// ============================================
// LUXUDIES - Admin Customers Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'customer')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCustomers(data || []);
      } catch (error: any) {
        toast.error('Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery)
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-espresso">Customers</h1>
          <p className="font-inter text-sm text-espresso-200">{customers.length} registered customers</p>
        </div>
      </motion.div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-xl text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/40 transition-all"
        />
      </div>

      <GlassCard variant="strong" padding="none">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-espresso-300">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
            <p className="font-inter text-sm font-medium">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-espresso-300">
            <p className="font-inter font-medium mb-1">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-400/10">
                  {['Customer', 'Contact', 'Joined'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gold-400/5 last:border-b-0 hover:bg-pearl-100/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center text-white font-inter font-bold text-sm shrink-0 uppercase">
                          {customer.full_name ? customer.full_name[0] : (customer.email ? customer.email[0] : '?')}
                        </div>
                        <span className="font-inter text-sm font-medium text-espresso">
                          {customer.full_name || 'Guest User'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-inter text-xs text-espresso-300">{customer.email}</p>
                      <p className="font-inter text-[10px] text-espresso-200">{customer.phone || 'No phone'}</p>
                    </td>
                    <td className="p-4 font-inter text-xs text-espresso-200">
                      {new Date(customer.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
