// ============================================
// LUXUDIES - Product Detail Page (Redesigned)
// ============================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Share2,
  Minus,
  Plus,
  Star,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import ProductCard from '@/components/product/product-card';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { SAMPLE_REVIEWS } from '@/lib/sample-data';
import { cn, formatPrice, getDiscountPercent } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const mainCtaRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) =>
    product ? s.isInWishlist(product.id) : false
  );

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
        
      if (data && !error) {
        if (data.images) {
          data.images.sort((a: any, b: any) => {
            if (a.is_primary) return -1;
            if (b.is_primary) return 1;
            return a.sort_order - b.sort_order;
          });
        } else {
          data.images = [];
        }
        setProduct(data);
      }
      setLoading(false);
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCart(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    if (mainCtaRef.current) {
      observer.observe(mainCtaRef.current);
    }

    return () => observer.disconnect();
  }, [loading, product]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-pearl">
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 animate-spin text-gold-500 mb-4" />
            <p className="font-playfair text-xl text-espresso">Loading product...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-pearl">
          <div className="text-center">
            <h1 className="font-playfair text-2xl font-bold text-espresso mb-3">
              Product not found
            </h1>
            <Link href="/shop">
              <button className="btn-ghost-gold px-6 py-3">Back to Shop</button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const topReviews = SAMPLE_REVIEWS.filter(
    (r) => r.product_id === product.id
  ).slice(0, 2);

  const handleAddToCart = () => {
    addItem(product, null, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const discount = product.compare_at_price
    ? getDiscountPercent(product.price, product.compare_at_price)
    : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-pearl pb-24 lg:pb-0">
        <div className="container-luxury py-4 lg:py-12">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-inter text-espresso-200 mb-6 sm:mb-8 uppercase tracking-widest">
            <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gold-500 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-espresso-400 truncate">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              {/* Main Image with pinch-to-zoom support */}
              <div 
                className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden bg-pearl-100 mb-4 shadow-soft group"
                style={{ touchAction: 'pan-y pinch-zoom' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                      alt={product.name}
                      fill
                      className="object-contain sm:object-cover scale-100 group-hover:scale-105 transition-transform duration-700 origin-center"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.is_new && <span className="bg-espresso text-pearl text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full">NEW</span>}
                  {product.is_bestseller && <span className="bg-gold-500 text-white text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full">BESTSELLER</span>}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center shadow-soft transition-all',
                      isWishlisted ? 'bg-gold-400 text-white shadow-gold' : 'bg-white/80 backdrop-blur-md text-espresso-300 hover:bg-gold-400 hover:text-white'
                    )}
                  >
                    <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-espresso-300 flex items-center justify-center shadow-soft hover:bg-pearl-200 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x">
                  {product.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(i)}
                      className={cn(
                        'relative w-20 h-24 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 snap-start',
                        selectedImageIndex === i ? 'border-gold-400 shadow-gold' : 'border-transparent hover:border-gold-200 opacity-70 hover:opacity-100'
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt_text}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8 lg:py-6"
            >
              {/* Title & Price */}
              <div className="border-b border-gold-400/20 pb-8">
                <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso mb-4 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-inter font-bold text-2xl text-antique">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="font-inter text-lg text-espresso-200 line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="bg-gold-50 text-gold-600 text-xs font-bold px-2 py-1 rounded-md border border-gold-400/20">
                      Save {discount}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center text-gold-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="font-inter text-espresso-300 underline cursor-pointer hover:text-gold-500 transition-colors">
                    4.9 (124 reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="font-inter text-sm sm:text-base text-espresso-300 leading-relaxed">
                {product.description}
              </p>

              {/* Why you'll love it */}
              <div className="bg-ivory-50 p-6 rounded-2xl border border-gold-400/10">
                <h3 className="font-playfair text-lg font-bold text-espresso mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-gold-500" />
                  Why you'll love it
                </h3>
                <ul className="space-y-3">
                  {[
                    "Handcrafted with 18K Gold Plating",
                    "Anti-tarnish and water-resistant",
                    "Hypoallergenic and gentle on skin",
                    "Arrives in signature luxury packaging"
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <span className="font-inter text-sm text-espresso-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add to Cart Area */}
              <div ref={mainCtaRef} className="space-y-4">
                <div className="flex items-center justify-between p-1 bg-pearl-100 rounded-full border border-gold-400/20 max-w-[160px]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-espresso hover:text-gold-500 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-inter font-semibold text-espresso">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-espresso hover:text-gold-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full btn-gold h-14 text-sm tracking-widest flex items-center justify-center gap-3 shadow-gold"
                >
                  <ShoppingBag className="w-5 h-5" />
                  ADD TO CART — {formatPrice(product.price * quantity)}
                </button>
              </div>

            </motion.div>
          </div>

          {/* Complete The Look (Combo Suggestion) */}
          <div className="mt-24 pt-16 border-t border-gold-400/20">
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-espresso mb-8 text-center">
              Complete The Look
            </h2>
            <div className="max-w-4xl mx-auto glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden relative shadow-soft">
                  <Image src={product.images[0]?.url} alt="" fill className="object-cover" />
                </div>
                <Plus className="w-6 h-6 text-gold-400" />
                <div className="w-24 h-24 rounded-full overflow-hidden relative shadow-soft">
                  <Image src="/images/products/earrings.jpg" alt="Matching Earrings" fill className="object-cover" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-playfair text-xl font-bold text-espresso mb-2">The Golden Duo</h3>
                <p className="font-inter text-sm text-espresso-200 mb-4">Pair with our Classic Studs to complete the perfect evening look.</p>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <span className="font-inter font-bold text-lg text-antique">₹5,499</span>
                  <span className="text-xs text-white bg-gold-500 px-2 py-1 rounded">Save ₹500</span>
                </div>
              </div>
              <button className="btn-ghost-gold px-6 py-3 text-xs w-full sm:w-auto">
                ADD COMBO
              </button>
            </div>
          </div>

          {/* Reviews Snippet */}
          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-playfair text-3xl font-bold text-espresso">
                Customer Reviews
              </h2>
              <Link href="/reviews" className="hidden sm:flex items-center gap-2 font-inter text-sm text-espresso-300 hover:text-gold-500">
                See all reviews <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {topReviews.map(r => (
                <div key={r.id} className="glass-card p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />)}
                  </div>
                  <p className="font-playfair italic text-lg text-espresso-400 mb-4">"{r.body}"</p>
                  <p className="font-inter font-bold text-sm text-espresso">{r.user_name}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Mobile Sticky Add to Cart Bar */}
        <AnimatePresence>
          {showStickyCart && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-16 left-0 right-0 lg:hidden z-30 bg-pearl/90 backdrop-blur-xl border-t border-gold-400/20 p-4 safe-area-bottom shadow-[0_-8px_32px_rgba(58,42,30,0.08)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-inter font-bold text-antique leading-none mb-1">
                    {formatPrice(product.price)}
                  </div>
                  <div className="font-inter text-[10px] text-espresso-300">
                    {product.name}
                  </div>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="btn-gold px-6 py-3 text-xs shadow-gold"
                >
                  ADD TO CART
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
