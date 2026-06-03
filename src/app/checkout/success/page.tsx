// ============================================
// LUXUDIES - Checkout Success Page
// ============================================

'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Truck, ArrowRight, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import Button from '@/components/ui/button';
import GlassCard from '@/components/ui/glass-card';
import { getWhatsAppUrl, SHIPPING_CONFIG } from '@/lib/utils';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'LXD-XXXX';

  return (
    <main className="min-h-screen flex items-center justify-center py-12">
      <div className="container-luxury max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <GlassCard variant="strong" padding="lg" className="text-center">
            {/* Success animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="font-playfair text-2xl lg:text-3xl font-bold text-espresso mb-2">
                Order Confirmed!
              </h1>
              <p className="font-inter text-sm text-espresso-200 mb-6">
                Thank you for choosing LUXUDIES. Your order has been placed successfully.
              </p>
            </motion.div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-pearl-100/60 rounded-2xl p-5 mb-6 space-y-3"
            >
              <div className="flex justify-between text-sm font-inter">
                <span className="text-espresso-200">Order Number</span>
                <span className="font-bold text-espresso">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm font-inter">
                <span className="text-espresso-200">Status</span>
                <span className="font-semibold text-green-600 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  Order Placed
                </span>
              </div>
              <div className="flex justify-between text-sm font-inter">
                <span className="text-espresso-200">Estimated Delivery</span>
                <span className="font-medium text-espresso flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-gold-400" />
                  {SHIPPING_CONFIG.estimatedDays.min}-{SHIPPING_CONFIG.estimatedDays.max} business days
                </span>
              </div>
            </motion.div>

            {/* Info text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-espresso-200 font-inter mb-6"
            >
              We&apos;ll send you order updates via email and SMS. You can also track your order anytime.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Link href="/track-order">
                <Button fullWidth size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  TRACK YOUR ORDER
                </Button>
              </Link>

              <Link href="/shop">
                <Button fullWidth variant="outline" size="md">
                  CONTINUE SHOPPING
                </Button>
              </Link>

              <a
                href={getWhatsAppUrl(`Hi LUXUDIES! I just placed order ${orderNumber}. Can you confirm?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm font-inter text-green-600 hover:text-green-700 transition-colors py-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp for queries
              </a>
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
      <MobileNav />
    </>
  );
}
