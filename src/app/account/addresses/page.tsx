// ============================================
// LUXUDIES - Address Management Page
// ============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import toast from 'react-hot-toast';

interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const SAMPLE_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr_1',
    label: 'Home',
    fullName: 'Priya Menon',
    phone: '+91 98765 43210',
    line1: '42, Lotus Gardens, Anna Nagar',
    line2: 'Near Koyambedu Metro',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    isDefault: true,
  },
];

export default function AddressesPage() {
  const [addresses] = useState<SavedAddress[]>(SAMPLE_ADDRESSES);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-playfair text-xl font-semibold text-espresso">
          Saved Addresses
        </h2>
        <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />}>
          Add New
        </Button>
      </div>

      {addresses.length === 0 ? (
        <GlassCard variant="strong" padding="lg" className="text-center py-16">
          <MapPin className="w-16 h-16 text-pearl-400 mx-auto mb-4" />
          <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
            No saved addresses
          </h3>
          <p className="font-inter text-sm text-espresso-200 mb-6">
            Add an address for faster checkout.
          </p>
          <Button icon={<Plus className="w-4 h-4" />}>ADD ADDRESS</Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <GlassCard key={addr.id} variant="strong" padding="md" className="relative">
              {addr.isDefault && (
                <span className="absolute top-3 right-3 text-[10px] font-inter font-semibold text-gold-500 bg-gold-50 px-2 py-0.5 rounded-full">
                  DEFAULT
                </span>
              )}
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span className="font-inter font-semibold text-sm text-espresso">{addr.label}</span>
              </div>
              <p className="font-inter text-sm text-espresso mb-0.5">{addr.fullName}</p>
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
                <button className="flex items-center gap-1 text-xs font-inter text-espresso-200 hover:text-red-500 transition-colors">
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
