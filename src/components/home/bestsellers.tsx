// ============================================
// LUXUDIES - Bestsellers Section (Redesigned)
// ============================================

'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/product-card';
import { SAMPLE_PRODUCTS } from '@/lib/sample-data';
import { motion } from 'framer-motion';

export default function BestsellersSection() {
  // Use dummy data for prototype
  const bestsellers = SAMPLE_PRODUCTS.filter(p => p.is_bestseller).slice(0, 4);

  return (
    <section className="py-20 lg:py-32 bg-pearl-50 relative overflow-hidden">
      <div className="container-luxury">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 lg:mb-16 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-playfair text-3xl lg:text-4xl xl:text-5xl font-bold text-espresso mb-3">
              Most Loved
            </h2>
            <p className="font-inter text-espresso-200">
              Our signature pieces that everyone is talking about
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden sm:block"
          >
            <Link 
              href="/shop/bestsellers"
              className="group flex items-center gap-2 text-sm font-inter font-medium tracking-wider text-espresso hover:text-gold-500 transition-colors uppercase"
            >
              View All Bestsellers
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {bestsellers.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link 
            href="/shop/bestsellers"
            className="inline-flex items-center gap-2 text-sm font-inter font-medium tracking-wider text-espresso hover:text-gold-500 transition-colors uppercase"
          >
            View All Bestsellers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
