// ============================================
// LUXUDIES - Payment Failure Page
// ============================================

'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ShoppingBag, HeadphonesIcon } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';

const REASONS: Record<string, string> = {
  checksum_failed: 'Payment verification failed. Please try again.',
  order_not_found: 'Order not found. Please contact support.',
  payment_failed: 'Payment was declined. Please try a different payment method.',
  server_error: 'A server error occurred. Please try again in a moment.',
};

function FailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'payment_failed';
  const message = REASONS[reason] || REASONS.payment_failed;

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl border border-red-100 shadow-xl p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-12 h-12 text-red-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-playfair text-3xl font-bold text-espresso mb-2">
            Payment Failed
          </h1>
          <p className="font-inter text-sm text-gray-500 mb-8 leading-relaxed">
            {message}
          </p>

          <div className="space-y-3">
            <Link href="/checkout" className="block">
              <button className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-inter font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </Link>
            <Link href="/shop" className="block">
              <button className="w-full h-12 rounded-2xl border-2 border-amber-200 text-amber-700 font-inter font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:border-amber-400 transition-all">
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-400 font-inter">
            Need help?{' '}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')}?text=Hi, my payment failed. Can you help?`}
              target="_blank" rel="noopener noreferrer"
              className="text-amber-600 hover:underline"
            >
              Chat with us on WhatsApp
            </a>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default function FailurePage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <FailureContent />
      </Suspense>
      <MobileNav />
    </>
  );
}
