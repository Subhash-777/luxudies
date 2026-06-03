// ============================================
// LUXUDIES - Wishlist Page
// ============================================

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import ProductCard from '@/components/product/product-card';
import { useWishlistStore } from '@/store/wishlist-store';
import Button from '@/components/ui/button';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-playfair text-xl font-semibold text-espresso mb-6">
        My Wishlist
      </h2>

      {items.length === 0 ? (
        <GlassCard variant="strong" padding="lg" className="text-center py-16">
          <Heart className="w-16 h-16 text-pearl-400 mx-auto mb-4" />
          <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
            Your wishlist is empty
          </h3>
          <p className="font-inter text-sm text-espresso-200 mb-6">
            Save your favourite pieces here by tapping the heart icon.
          </p>
          <Link href="/shop">
            <Button>EXPLORE COLLECTION</Button>
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
