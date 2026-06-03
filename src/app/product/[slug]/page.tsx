// ============================================
// LUXUDIES - Product Detail Page
// ============================================

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Zap,
  ChevronLeft,
  Shield,
  Feather,
  Droplets,
  Gift,
  Sparkles,
  Truck,
  RotateCcw,
  Share2,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import ProductCard from '@/components/product/product-card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import GlassCard from '@/components/ui/glass-card';
import Price from '@/components/ui/price';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { SAMPLE_PRODUCTS, SAMPLE_REVIEWS } from '@/lib/sample-data';
import { PRODUCT_BENEFITS, SHIPPING_CONFIG, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const benefitIcons: Record<string, React.ElementType> = {
  'anti-tarnish': Shield,
  lightweight: Feather,
  'water-resistant': Droplets,
  'gift-ready': Gift,
  hypoallergenic: Heart,
  '18k-gold': Sparkles,
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) =>
    product ? s.isInWishlist(product.id) : false
  );

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-playfair text-2xl font-bold text-espresso mb-3">
              Product not found
            </h1>
            <Link href="/shop">
              <Button variant="outline">Back to Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const relatedProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  const productReviews = SAMPLE_REVIEWS.filter(
    (r) => r.product_id === product.id
  );

  const handleAddToCart = () => {
    addItem(product, null, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addItem(product, null, quantity);
    window.location.href = '/checkout';
  };

  const productBenefits = PRODUCT_BENEFITS.filter((b) =>
    product.benefits.includes(b.key)
  );

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container-luxury py-4 lg:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-inter text-espresso-200 mb-6">
            <Link href="/" className="hover:text-gold-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gold-500 transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-espresso-400 truncate">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-pearl-100 mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.is_new && <Badge variant="new">NEW</Badge>}
                  {product.is_bestseller && (
                    <Badge variant="bestseller">BESTSELLER</Badge>
                  )}
                </div>

                {/* Share & Wishlist */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center shadow-soft transition-all',
                      isWishlisted
                        ? 'bg-gold-400 text-white'
                        : 'bg-white/80 backdrop-blur-sm text-espresso-300 hover:bg-gold-400 hover:text-white'
                    )}
                  >
                    <Heart
                      className={cn('w-5 h-5', isWishlisted && 'fill-current')}
                    />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-espresso-300 flex items-center justify-center shadow-soft hover:bg-pearl-200 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(i)}
                      className={cn(
                        'relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                        selectedImageIndex === i
                          ? 'border-gold-400'
                          : 'border-transparent hover:border-gold-200'
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt_text}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Title & Price */}
              <div>
                <h1 className="font-playfair text-2xl lg:text-3xl font-bold text-espresso mb-2">
                  {product.name}
                </h1>
                <p className="font-inter text-sm text-espresso-200 mb-4">
                  {product.short_description}
                </p>
                <Price
                  price={product.price}
                  compareAtPrice={product.compare_at_price}
                  size="xl"
                  showSavings
                />
              </div>

              {/* Product Benefits */}
              <div className="flex flex-wrap gap-2">
                {productBenefits.map((benefit) => {
                  const Icon = benefitIcons[benefit.key] || Shield;
                  return (
                    <div
                      key={benefit.key}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-pearl-200/60 rounded-full"
                    >
                      <Icon className="w-3.5 h-3.5 text-gold-500" />
                      <span className="text-[11px] font-inter font-medium text-espresso-300">
                        {benefit.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-2 block">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-gold-400/20 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-espresso-300 hover:text-espresso transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-inter font-semibold text-espresso">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-espresso-300 hover:text-espresso transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  icon={<ShoppingBag className="w-4 h-4" />}
                >
                  ADD TO CART
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  fullWidth
                  onClick={handleBuyNow}
                  icon={<Zap className="w-4 h-4" />}
                >
                  BUY NOW
                </Button>
              </div>

              {/* Shipping & Returns */}
              <GlassCard padding="md" variant="subtle">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-inter font-semibold text-espresso">
                        {SHIPPING_CONFIG.message}
                      </p>
                      <p className="text-[10px] font-inter text-espresso-200">
                        Estimated delivery: {SHIPPING_CONFIG.estimatedDays.min}-
                        {SHIPPING_CONFIG.estimatedDays.max} business days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center">
                      <RotateCcw className="w-4 h-4 text-gold-500" />
                    </div>
                    <div>
                      <p className="text-xs font-inter font-semibold text-espresso">
                        7-Day Easy Returns
                      </p>
                      <p className="text-[10px] font-inter text-espresso-200">
                        Hassle-free returns and exchanges
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Description */}
              <div>
                <h3 className="font-playfair text-lg font-semibold text-espresso mb-3">
                  About This Piece
                </h3>
                <p className="font-inter text-sm text-espresso-200 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Styling Tips */}
              {product.styling_tips && (
                <div>
                  <h3 className="font-playfair text-lg font-semibold text-espresso mb-3">
                    Styling Tips
                  </h3>
                  <p className="font-inter text-sm text-espresso-200 leading-relaxed">
                    {product.styling_tips}
                  </p>
                </div>
              )}

              {/* Care Instructions */}
              {product.care_instructions && (
                <div>
                  <h3 className="font-playfair text-lg font-semibold text-espresso mb-3">
                    Care Instructions
                  </h3>
                  <p className="font-inter text-sm text-espresso-200 leading-relaxed">
                    {product.care_instructions}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 lg:mt-24">
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-espresso mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Mobile Sticky Add to Cart Bar */}
        <div className="fixed bottom-16 left-0 right-0 lg:hidden z-30 bg-pearl/90 backdrop-blur-xl border-t border-gold-400/10 p-3 safe-area-bottom">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Price price={product.price} compareAtPrice={product.compare_at_price} size="md" />
            </div>
            <Button size="md" onClick={handleAddToCart} icon={<ShoppingBag className="w-4 h-4" />}>
              ADD TO CART
            </Button>
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
