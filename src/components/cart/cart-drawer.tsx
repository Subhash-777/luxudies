// ============================================
// LUXUDIES - Cart Drawer Component
// ============================================

'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/button';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotal } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-espresso/30 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-pearl z-50 shadow-elevated flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gold-400/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
                <h2 className="font-playfair text-lg font-semibold text-espresso">
                  Your Cart
                </h2>
                <span className="text-xs font-inter text-espresso-200 bg-pearl-200 px-2 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-espresso-300 hover:text-espresso transition-colors rounded-full hover:bg-pearl-200"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-pearl-400 mx-auto mb-4" />
                  <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
                    Your cart is empty
                  </h3>
                  <p className="font-inter text-sm text-espresso-200 mb-6">
                    Discover our beautiful collection and add something special.
                  </p>
                  <Link href="/shop" onClick={closeCart}>
                    <Button variant="primary" size="md">
                      EXPLORE COLLECTION
                    </Button>
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const primaryImage =
                    item.product.images.find((img) => img.is_primary) ||
                    item.product.images[0];
                  const itemPrice =
                    item.product.price + (item.variant?.price_adjustment || 0);

                  return (
                    <motion.div
                      key={`${item.product_id}-${item.variant_id}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 glass-card p-3"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-pearl-100 shrink-0">
                        {primaryImage && (
                          <Image
                            src={primaryImage.url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-inter font-medium text-sm text-espresso line-clamp-1">
                          {item.product.name}
                        </h4>
                        {item.variant && (
                          <p className="text-[11px] text-espresso-200 font-inter">
                            {item.variant.name}: {item.variant.value}
                          </p>
                        )}
                        <p className="font-inter font-bold text-sm text-espresso mt-1">
                          {formatPrice(itemPrice)}
                        </p>

                        {/* Quantity & Remove */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 border border-gold-400/15 rounded-full">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.variant_id,
                                  item.quantity - 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center text-espresso-300 hover:text-espresso transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-inter font-semibold text-espresso">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.variant_id,
                                  item.quantity + 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center text-espresso-300 hover:text-espresso transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeItem(item.product_id, item.variant_id)
                            }
                            className="p-1.5 text-espresso-100 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="border-t border-gold-400/10 p-5 space-y-4 bg-pearl-50">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-inter">
                    <span className="text-espresso-200">Subtotal</span>
                    <span className="font-medium text-espresso">
                      {formatPrice(getSubtotal())}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-inter">
                    <span className="text-espresso-200">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-inter pt-2 border-t border-gold-400/10">
                    <span className="font-semibold text-espresso">Total</span>
                    <span className="font-bold text-lg text-espresso">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                </div>

                <Link href="/checkout" onClick={closeCart}>
                  <Button
                    fullWidth
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    PROCEED TO CHECKOUT
                  </Button>
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs font-inter text-espresso-200 hover:text-gold-500 transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
