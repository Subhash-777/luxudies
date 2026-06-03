// ============================================
// LUXUDIES - Admin Products Page
// ============================================

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Search, MoreVertical, Eye, Pencil, Trash2, Package } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { SAMPLE_PRODUCTS } from '@/lib/sample-data';
import { formatPrice, cn } from '@/lib/utils';

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = SAMPLE_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="font-playfair text-2xl font-bold text-espresso">Products</h1>
          <p className="font-inter text-sm text-espresso-200">{SAMPLE_PRODUCTS.length} products</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Add Product</Button>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-xl text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/40 transition-all"
        />
      </div>

      {/* Products Table */}
      <GlassCard variant="strong" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-400/10">
                <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">Product</th>
                <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">SKU</th>
                <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">Price</th>
                <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">Stock</th>
                <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">Status</th>
                <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const img = product.images.find((i) => i.is_primary) || product.images[0];
                return (
                  <tr key={product.id} className="border-b border-gold-400/5 last:border-b-0 hover:bg-pearl-100/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-pearl-100 shrink-0">
                          {img && <Image src={img.url} alt={product.name} fill className="object-cover" sizes="40px" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-inter text-sm font-medium text-espresso line-clamp-1">{product.name}</p>
                          <p className="font-inter text-[10px] text-espresso-200 capitalize">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-inter text-xs text-espresso-300 font-mono">{product.sku}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-inter text-sm font-medium text-espresso">{formatPrice(product.price)}</p>
                        {product.compare_at_price && (
                          <p className="font-inter text-[10px] text-espresso-200 line-through">{formatPrice(product.compare_at_price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'font-inter text-xs font-medium',
                        product.stock > 20 ? 'text-green-600' : product.stock > 5 ? 'text-yellow-600' : 'text-red-500'
                      )}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold',
                        product.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                      )}>
                        {product.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-espresso-200 hover:bg-pearl-200 hover:text-espresso transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg text-espresso-200 hover:bg-pearl-200 hover:text-espresso transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg text-espresso-200 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
