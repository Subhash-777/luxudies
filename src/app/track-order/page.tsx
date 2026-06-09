// ============================================
// LUXUDIES - Track Order Page (Redesigned)
// ============================================

'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, MapPin, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
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
    <main className="min-h-screen pb-24 lg:pb-12 bg-pearl">
      <div className="container-luxury py-12 lg:py-20 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-espresso mb-4">
            Track Your Journey
          </h1>
          <p className="font-inter text-sm text-espresso-200">
            Enter your order number to see the latest status of your beautiful pieces.
          </p>
        </motion.div>

        {/* Search Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso-200" />
              <input
                type="text"
                placeholder="Enter order number (e.g. LXD-A1B2C3)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="w-full h-14 pl-10 pr-4 bg-transparent border-b border-gold-400/30 text-sm font-inter text-espresso placeholder:text-espresso-200 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
            <button 
              onClick={handleTrack} 
              disabled={isLoading}
              className="btn-gold h-14 px-8 text-xs tracking-widest shadow-gold w-full sm:w-auto flex-shrink-0"
            >
              {isLoading ? 'TRACKING...' : 'TRACK'}
            </button>
          </div>
        </motion.div>

        {/* Timeline Component */}
        {isTracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gold-400/20 pb-6">
                <div className="mb-4 sm:mb-0">
                  <p className="font-playfair font-bold text-xl text-espresso mb-1">
                    Order #{orderNumber || 'LXD-A1B2C3'}
                  </p>
                  <p className="font-inter text-xs text-espresso-200">
                    Estimated delivery: Jun 05 - Jun 07, 2026
                  </p>
                </div>
                <span className="self-start sm:self-auto px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-inter font-bold bg-gold-50 text-gold-600 border border-gold-400/20">
                  Shipped
                </span>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-8 space-y-0 pb-6">
                {TIMELINE_STEPS.map((step, i) => {
                  const isPast = i <= currentStep;
                  const isCurrent = i === currentStep;
                  const isLast = i === TIMELINE_STEPS.length - 1;

                  return (
                    <div key={step.status} className="relative pb-8 last:pb-0 group">
                      {/* Vertical Line */}
                      {!isLast && (
                        <div
                          className={cn(
                            'absolute left-[-16px] top-8 bottom-[-8px] w-0.5',
                            isPast ? 'bg-gold-400' : 'bg-pearl-300'
                          )}
                        />
                      )}

                      {/* Timeline Dot */}
                      <div
                        className={cn(
                          'absolute left-[-21px] top-1.5 w-3 h-3 rounded-full border-2',
                          isPast
                            ? 'bg-gold-500 border-gold-500 shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                            : 'bg-pearl border-pearl-300'
                        )}
                      >
                        {isCurrent && (
                          <span className="absolute inset-0 rounded-full bg-gold-400 animate-ping opacity-30" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors',
                          isPast ? 'bg-gold-50 border-gold-400/30' : 'bg-pearl border-pearl-200'
                        )}>
                          <step.icon className={cn(
                            'w-4 h-4',
                            isPast ? 'text-gold-600' : 'text-espresso-200'
                          )} />
                        </div>
                        <div className="pt-1">
                          <p className={cn(
                            'font-inter text-sm font-semibold mb-1 tracking-wide',
                            isPast ? 'text-espresso' : 'text-espresso-200'
                          )}>
                            {step.label}
                          </p>
                          <p className="font-inter text-xs text-espresso-200">
                            {step.date || 'Pending update'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Help Section */}
              <div className="mt-8 pt-8 border-t border-gold-400/20 text-center">
                <p className="font-playfair text-lg text-espresso mb-3">
                  Need help with your order?
                </p>
                <a
                  href={getWhatsAppUrl(`Hi LUXUDIES! I need help with order ${orderNumber || 'LXD-A1B2C3'}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-inter font-semibold text-[#25D366] hover:text-[#1da851] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
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
      <Suspense fallback={<div className="min-h-screen bg-pearl" />}>
        <TrackOrderContent />
      </Suspense>
      <Footer />
      <CartDrawer />
      <MobileNav />
    </>
  );
}
