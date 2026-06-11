// ============================================
// LUXUDIES - Bestsellers Page
// ============================================

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import ProductCard from '@/components/product/product-card';
import { SAMPLE_PRODUCTS } from '@/lib/sample-data';

export default function BestsellersPage() {
  const bestsellers = useMemo(
    () => SAMPLE_PRODUCTS.filter((p) => p.is_bestseller),
    []
  );

  const products = bestsellers.length > 0 ? bestsellers : SAMPLE_PRODUCTS.slice(0, 8);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container-luxury py-6 lg:py-10">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 bg-gold-50 border border-gold-400/20 px-4 py-1.5 rounded-full mb-4"
            >
              <Award className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-xs font-inter font-semibold text-gold-600 uppercase tracking-widest">Most Loved</span>
            </motion.div>
            <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-espresso mb-3">
              Bestsellers
            </h1>
            <p className="font-inter text-sm text-espresso-200 max-w-md mx-auto">
              Our customers&apos; favorites. The pieces everyone keeps coming back for.
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
