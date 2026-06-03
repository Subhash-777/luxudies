// ============================================
// LUXUDIES - Admin Combos Page
// ============================================

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Percent } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import { SAMPLE_COMBOS } from '@/lib/sample-data';
import { formatPrice } from '@/lib/utils';

export default function AdminCombosPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-espresso">Combo Offers</h1>
          <p className="font-inter text-sm text-espresso-200">{SAMPLE_COMBOS.length} active combos</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Create Combo</Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_COMBOS.map((combo, i) => (
          <motion.div
            key={combo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard variant="strong" padding="none">
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-[16px]">
                <Image src={combo.image_url} alt={combo.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-inter font-bold px-2.5 py-1 rounded-full">
                  SAVE {formatPrice(combo.savings)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-inter font-semibold text-sm text-espresso mb-1">{combo.name}</h3>
                <p className="font-inter text-xs text-espresso-200 line-clamp-2 mb-3">{combo.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-inter font-bold text-espresso">{formatPrice(combo.combo_price)}</span>
                    <span className="font-inter text-xs text-espresso-200 line-through">{formatPrice(combo.original_price)}</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg text-espresso-200 hover:bg-pearl-200 hover:text-espresso transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg text-espresso-200 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
