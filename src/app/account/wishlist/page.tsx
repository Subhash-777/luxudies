// ============================================
// LUXUDIES - Wishlist Page (Redesigned)
// ============================================

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import ProductCard from '@/components/product/product-card';
import { useWishlistStore } from '@/store/wishlist-store';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl"
    >
      <div className="flex items-center justify-between mb-8 border-b border-gold-400/20 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-espresso">
          My Wishlist
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-12 text-center py-20 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-pearl-100 flex items-center justify-center mb-6 shadow-inner border border-gold-400/10">
            <Heart className="w-8 h-8 text-gold-300" />
          </div>
          <h3 className="font-playfair text-2xl font-bold text-espresso mb-3">
            Your wishlist is empty
          </h3>
          <p className="font-inter text-sm text-espresso-300 mb-8 max-w-sm">
            Save your favorite pieces here by tapping the heart icon while exploring our collections.
          </p>
          <Link href="/shop">
            <button className="btn-gold px-8 py-3 text-xs tracking-widest shadow-gold">
              EXPLORE COLLECTION
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
