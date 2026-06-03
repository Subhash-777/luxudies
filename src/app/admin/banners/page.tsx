// ============================================
// LUXUDIES - Admin Banners & Combos Pages
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';

export default function AdminBannersPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-espresso">Banners</h1>
          <p className="font-inter text-sm text-espresso-200">Manage hero and promotional banners</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Add Banner</Button>
      </motion.div>

      <GlassCard variant="strong" padding="lg" className="text-center py-16">
        <ImageIcon className="w-16 h-16 text-pearl-400 mx-auto mb-4" />
        <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">No banners yet</h3>
        <p className="font-inter text-sm text-espresso-200 mb-6">
          Upload banners for your homepage hero section and promotional areas.
        </p>
        <Button icon={<Plus className="w-4 h-4" />}>Upload Banner</Button>
      </GlassCard>
    </div>
  );
}
