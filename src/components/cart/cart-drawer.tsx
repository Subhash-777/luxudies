// ============================================
// LUXUDIES - Cart Drawer (Redesigned)
// ============================================

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatPrice, SHIPPING_CONFIG } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const {
    isOpen,
    items,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Prevent background scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const amountToFreeShipping = Math.max(0, SHIPPING_CONFIG.freeThreshold - subtotal);
  const progressPercentage = SHIPPING_CONFIG.freeThreshold > 0 
    ? Math.min(100, (subtotal / SHIPPING_CONFIG.freeThreshold) * 100)
    : 100;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    closeCart();
    window.location.href = '/checkout';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-espresso/30 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-[60px] lg:bottom-0 w-[90vw] max-w-[420px] bg-pearl/95 backdrop-blur-2xl z-50 flex flex-col overflow-hidden shadow-[-20px_0_40px_rgba(58,42,30,0.1)] border-l border-gold-400/20"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gold-400/10">
              <h2 className="font-playfair text-2xl font-bold text-espresso flex items-center gap-2">
                Your Bag
                <span className="font-inter text-sm font-medium text-espresso-200 bg-gold-50 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </h2>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full border border-gold-400/20 flex items-center justify-center text-espresso-300 hover:text-espresso hover:bg-gold-50 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="flex-shrink-0 p-6 bg-ivory-50/50 border-b border-gold-400/10">
              <p className="font-inter text-sm text-espresso-300 mb-3 text-center">
                {amountToFreeShipping > 0 ? (
                  <>Add <span className="font-bold text-gold-600">{formatPrice(amountToFreeShipping)}</span> more to unlock Free Shipping</>
                ) : (
                  <span className="font-bold text-gold-600">Congratulations! You've unlocked Free Shipping.</span>
                )}
              </p>
              <div className="h-1.5 w-full bg-gold-400/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gold-500 rounded-full"
                />
              </div>
            </div>

            {/* Cart Items — scrollable area */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 lg:p-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center mb-6 border border-gold-400/20">
                    <ShoppingBag className="w-8 h-8 text-gold-300" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-espresso mb-2">
                    Your bag is empty
                  </h3>
                  <p className="font-inter text-sm text-espresso-300 mb-8">
                    Discover our beautiful collections.
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn-ghost-gold px-8 py-3"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.product.id}-${item.variant_id || 'default'}`}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0 }}
                        className="flex gap-3 sm:gap-4 p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-gold-400/10 shadow-sm"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-pearl-100 flex-shrink-0">
                          <Image
                            src={item.product.images[0]?.url || ''}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-col flex-1 min-w-0 py-0.5">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h4 className="font-playfair text-sm sm:text-base font-semibold text-espresso line-clamp-2">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.product.id, item.variant_id)}
                              className="text-espresso-200 hover:text-red-400 transition-colors shrink-0 p-1 -mt-1 -mr-1"
                              aria-label="Remove item"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="font-inter text-sm font-bold text-espresso mb-auto">
                            {formatPrice(item.product.price)}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center mt-3">
                            <div className="flex items-center bg-ivory rounded-lg border border-gold-400/20 h-8">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.variant_id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-full flex items-center justify-center text-espresso-300 hover:text-espresso"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-inter text-xs font-semibold text-espresso">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.variant_id, item.quantity + 1)}
                                className="w-8 h-full flex items-center justify-center text-espresso-300 hover:text-espresso"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="flex-shrink-0 mt-auto p-6 bg-white/80 backdrop-blur-xl border-t border-gold-400/20 shadow-[0_-10px_40px_rgba(58,42,30,0.05)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-inter font-medium text-espresso-300">Subtotal</span>
                  <span className="font-inter font-bold text-xl text-espresso">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="font-inter text-[11px] text-espresso-200 mb-6 text-center">
                  Taxes and shipping calculated at checkout.
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full btn-gold h-14 flex items-center justify-center gap-2 shadow-gold"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
