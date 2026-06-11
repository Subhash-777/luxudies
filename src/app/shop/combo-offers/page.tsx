// ============================================
// LUXUDIES - Combo Offers Page
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Gift, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import { SAMPLE_COMBOS } from '@/lib/sample-data';

export default function ComboOffersPage() {
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
              <Gift className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-xs font-inter font-semibold text-gold-600 uppercase tracking-widest">Save More</span>
            </motion.div>
            <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-espresso mb-3">
              Combo Offers
            </h1>
            <p className="font-inter text-sm text-espresso-200 max-w-md mx-auto">
              Curated sets at special prices. Perfect for gifting or treating yourself.
            </p>
          </motion.div>

          {/* Combo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {SAMPLE_COMBOS.map((combo, i) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="glass-card overflow-hidden group hover:border-gold-400/40 transition-all duration-300"
              >
                {/* Combo Image */}
                <div className="relative h-48 sm:h-56 bg-pearl-200 overflow-hidden">
                  <Image
                    src={combo.image_url}
                    alt={combo.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Savings Badge */}
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-inter font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Save ₹{combo.savings}
                  </div>
                </div>

                {/* Combo Info */}
                <div className="p-5">
                  <h3 className="font-playfair text-lg font-bold text-espresso mb-1">{combo.name}</h3>
                  <p className="font-inter text-xs text-espresso-200 mb-4 line-clamp-2">{combo.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-playfair text-xl font-bold text-espresso">₹{combo.combo_price}</span>
                      <span className="font-inter text-sm text-espresso-100 line-through">₹{combo.original_price}</span>
                    </div>
                    <Link href="/shop" className="flex items-center gap-1 text-xs font-inter font-semibold text-gold-600 hover:text-gold-700 transition-colors">
                      Shop <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
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
