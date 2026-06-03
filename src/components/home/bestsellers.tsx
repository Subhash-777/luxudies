// ============================================
// LUXUDIES - Bestsellers Section
// ============================================

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp } from 'lucide-react';
import ProductCard from '@/components/product/product-card';
import { SAMPLE_PRODUCTS } from '@/lib/sample-data';

export default function BestsellersSection() {
  const bestsellers = SAMPLE_PRODUCTS.filter((p) => p.is_bestseller);

  return (
    <section className="py-16 lg:py-24 bg-luxury-section">
      <div className="container-luxury">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 lg:mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-gold-400" />
              <span className="text-xs font-inter font-semibold tracking-[0.15em] text-gold-500 uppercase">
                Most Loved
              </span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso">
              Bestsellers
            </h2>
            <p className="font-inter text-sm text-espresso-200 mt-2">
              Our customers&apos; favourites. Yours to love.
            </p>
          </div>
          <Link
            href="/shop/bestsellers"
            className="flex items-center gap-1 text-xs font-inter font-semibold tracking-wider text-espresso-300 hover:text-gold-500 transition-colors"
          >
            VIEW ALL
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {bestsellers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
