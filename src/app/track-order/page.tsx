// ============================================
// LUXUDIES - Track Order Page
// ============================================

'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import Button from '@/components/ui/button';
import GlassCard from '@/components/ui/glass-card';
import { getWhatsAppUrl, cn } from '@/lib/utils';

const TIMELINE_STEPS = [
  { status: 'placed', label: 'Order Placed', icon: Package, date: 'Jun 01, 2026 · 2:30 PM' },
  { status: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2, date: 'Jun 01, 2026 · 3:00 PM' },
  { status: 'shipped', label: 'Shipped', icon: Truck, date: 'Jun 02, 2026 · 10:00 AM' },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin, date: null },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2, date: null },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [isTracking, setIsTracking] = useState(!!initialOrder);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated current step index
  const currentStep = 2;

  const handleTrack = () => {
    if (!orderNumber.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsTracking(true);
      setIsLoading(false);
    }, 800);
  };

  return (
    <main className="min-h-screen pb-24 lg:pb-0">
      <div className="container-luxury py-6 lg:py-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-espresso mb-3">
            Track Your Order
          </h1>
          <p className="font-inter text-sm text-espresso-200">
            Enter your order number to see the latest status.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
              <input
                type="text"
                placeholder="Enter order number (e.g. LXD-A1B2C3)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="w-full h-12 pl-11 pr-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-[12px] text-sm font-inter text-espresso placeholder:text-espresso-100 focus:outline-none focus:border-gold-400/40 focus:ring-2 focus:ring-gold-400/10 transition-all"
              />
            </div>
            <Button size="lg" onClick={handleTrack} isLoading={isLoading}>
              TRACK
            </Button>
          </div>
        </motion.div>

        {/* Timeline */}
        {isTracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="strong" padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-inter font-semibold text-sm text-espresso">
                    Order #{orderNumber || 'LXD-A1B2C3'}
                  </p>
                  <p className="font-inter text-xs text-espresso-200">
                    Estimated delivery: Jun 05 - Jun 07, 2026
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-inter font-semibold bg-purple-50 text-purple-700">
                  Shipped
                </span>
              </div>

              {/* Timeline */}
              <div className="relative pl-8 space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const isPast = i <= currentStep;
                  const isCurrent = i === currentStep;
                  const isLast = i === TIMELINE_STEPS.length - 1;

                  return (
                    <div key={step.status} className="relative pb-8 last:pb-0">
                      {/* Line */}
                      {!isLast && (
                        <div
                          className={cn(
                            'absolute left-[-16px] top-7 bottom-0 w-0.5',
                            isPast ? 'bg-gold-400' : 'bg-pearl-400'
                          )}
                        />
                      )}

                      {/* Dot */}
                      <div
                        className={cn(
                          'absolute left-[-22px] top-1 w-3 h-3 rounded-full border-2',
                          isPast
                            ? 'bg-gold-400 border-gold-400'
                            : 'bg-white border-pearl-400'
                        )}
                      >
                        {isCurrent && (
                          <span className="absolute inset-0 rounded-full bg-gold-400 animate-ping opacity-30" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          isPast ? 'bg-gold-50' : 'bg-pearl-200'
                        )}>
                          <step.icon className={cn(
                            'w-4 h-4',
                            isPast ? 'text-gold-500' : 'text-espresso-100'
                          )} />
                        </div>
                        <div>
                          <p className={cn(
                            'font-inter text-sm font-medium',
                            isPast ? 'text-espresso' : 'text-espresso-100'
                          )}>
                            {step.label}
                          </p>
                          <p className="font-inter text-xs text-espresso-200">
                            {step.date || 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Help */}
              <div className="mt-6 pt-6 border-t border-gold-400/10 text-center">
                <p className="font-inter text-xs text-espresso-200 mb-3">
                  Need help with your order?
                </p>
                <a
                  href={getWhatsAppUrl(`Hi LUXUDIES! I need help with order ${orderNumber || 'LXD-A1B2C3'}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-inter font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen" />}>
        <TrackOrderContent />
      </Suspense>
      <Footer />
      <CartDrawer />
      <MobileNav />
    </>
  );
}
