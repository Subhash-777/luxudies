// ============================================
// LUXUDIES - Admin Customers Page
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import { formatPrice } from '@/lib/utils';

const SAMPLE_CUSTOMERS = [
  { name: 'Priya Menon', email: 'priya@email.com', phone: '+91 98765 43210', orders: 5, spent: 1245, joined: '2026-01-15' },
  { name: 'Sneha Ravi', email: 'sneha@email.com', phone: '+91 87654 32109', orders: 3, spent: 697, joined: '2026-02-01' },
  { name: 'Arjun Sundaram', email: 'arjun@email.com', phone: '+91 76543 21098', orders: 2, spent: 428, joined: '2026-02-20' },
  { name: 'Deepa Kumar', email: 'deepa@email.com', phone: '+91 65432 10987', orders: 4, spent: 876, joined: '2026-03-05' },
  { name: 'Kavitha Lakshmi', email: 'kavitha@email.com', phone: '+91 54321 09876', orders: 1, spent: 149, joined: '2026-03-15' },
];

export default function AdminCustomersPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-playfair text-2xl font-bold text-espresso">Customers</h1>
        <p className="font-inter text-sm text-espresso-200">{SAMPLE_CUSTOMERS.length} registered customers</p>
      </motion.div>

      <GlassCard variant="strong" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-400/10">
                {['Customer', 'Contact', 'Orders', 'Total Spent', 'Joined'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_CUSTOMERS.map((customer) => (
                <tr key={customer.email} className="border-b border-gold-400/5 last:border-b-0 hover:bg-pearl-100/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center text-white font-inter font-bold text-sm shrink-0">
                        {customer.name[0]}
                      </div>
                      <span className="font-inter text-sm font-medium text-espresso">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-inter text-xs text-espresso-300">{customer.email}</p>
                    <p className="font-inter text-[10px] text-espresso-200">{customer.phone}</p>
                  </td>
                  <td className="p-4 font-inter text-sm text-espresso-300">{customer.orders}</td>
                  <td className="p-4 font-inter text-sm font-medium text-espresso">{formatPrice(customer.spent)}</td>
                  <td className="p-4 font-inter text-xs text-espresso-200">
                    {new Date(customer.joined).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
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
