// ============================================
// LUXUDIES - Cart Page
// ============================================

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Truck, Shield } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import Button from '@/components/ui/button';
import GlassCard from '@/components/ui/glass-card';
import { useCartStore } from '@/store/cart-store';
import { formatPrice, SHIPPING_CONFIG } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4"
          >
            <div className="w-24 h-24 rounded-full bg-pearl-200 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-pearl-400" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-espresso mb-3">
              Your Cart is Empty
            </h1>
            <p className="font-inter text-sm text-espresso-200 max-w-sm mx-auto mb-8">
              Looks like you haven&apos;t added anything yet. Explore our collection and find something you love.
            </p>
            <Link href="/shop">
              <Button size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                EXPLORE COLLECTION
              </Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
        <MobileNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container-luxury py-6 lg:py-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-3xl lg:text-4xl font-bold text-espresso mb-8"
          >
            Your Cart
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, i) => {
                  const primaryImage = item.product.images.find((img) => img.is_primary) || item.product.images[0];
                  const itemPrice = item.product.price + (item.variant?.price_adjustment || 0);

                  return (
                    <motion.div
                      key={`${item.product_id}-${item.variant_id}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlassCard padding="md" className="flex gap-4 sm:gap-6">
                        {/* Image */}
                        <Link href={`/product/${item.product.slug}`} className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-pearl-100 shrink-0">
                          {primaryImage && (
                            <Image
                              src={primaryImage.url}
                              alt={item.product.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform"
                              sizes="128px"
                            />
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link href={`/product/${item.product.slug}`}>
                                <h3 className="font-inter font-semibold text-sm sm:text-base text-espresso hover:text-gold-500 transition-colors line-clamp-1">
                                  {item.product.name}
                                </h3>
                              </Link>
                              {item.variant && (
                                <p className="text-xs text-espresso-200 font-inter mt-0.5">
                                  {item.variant.name}: {item.variant.value}
                                </p>
                              )}
                              <p className="font-inter font-bold text-espresso mt-1">
                                {formatPrice(itemPrice)}
                              </p>
                              {item.product.compare_at_price && item.product.compare_at_price > item.product.price && (
                                <p className="text-xs text-espresso-200 line-through font-inter">
                                  {formatPrice(item.product.compare_at_price)}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => removeItem(item.product_id, item.variant_id)}
                              className="p-2 text-espresso-100 hover:text-red-500 transition-colors shrink-0"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center border border-gold-400/20 rounded-xl">
                              <button
                                onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                                className="w-9 h-9 flex items-center justify-center text-espresso-300 hover:text-espresso transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 text-center text-sm font-inter font-semibold text-espresso">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center text-espresso-300 hover:text-espresso transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-inter font-semibold text-espresso">
                              {formatPrice(itemPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Continue Shopping */}
              <div className="flex items-center justify-between pt-4">
                <Link href="/shop" className="flex items-center gap-2 text-sm font-inter text-espresso-200 hover:text-gold-500 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-sm font-inter text-espresso-100 hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <GlassCard variant="strong" padding="lg" className="sticky top-24">
                <h2 className="font-playfair text-lg font-semibold text-espresso mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-espresso-200">Subtotal ({items.reduce((t, i) => t + i.quantity, 0)} items)</span>
                    <span className="font-medium text-espresso">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-espresso-200">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-gold-400/10 pt-3">
                    <div className="flex justify-between">
                      <span className="font-inter font-semibold text-espresso">Total</span>
                      <span className="font-inter font-bold text-xl text-espresso">{formatPrice(getTotal())}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Note */}
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl mb-6">
                  <Truck className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-xs font-inter text-green-700">
                    {SHIPPING_CONFIG.message}
                  </p>
                </div>

                <Link href="/checkout">
                  <Button fullWidth size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                    PROCEED TO CHECKOUT
                  </Button>
                </Link>

                {/* Trust */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Shield className="w-3.5 h-3.5 text-gold-400" />
                  <span className="text-[10px] font-inter text-espresso-200">
                    Secure checkout powered by Razorpay
                  </span>
                </div>
              </GlassCard>
            </div>
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
