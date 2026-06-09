// ============================================
// LUXUDIES - Product Card Component
// ============================================

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { cn, formatPrice, getDiscountPercent } from '@/lib/utils';
import Badge from '@/components/ui/badge';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function ProductCard({
  product,
  index = 0,
  variant = 'default',
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(product.id));
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  const discount = product.compare_at_price
    ? getDiscountPercent(product.price, product.compare_at_price)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/product/${product.slug}`} className="group block h-full">
        <div className="glass-card flex flex-col h-full overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-medium group-hover:border-gold-400/30">
          
          {/* Image Container - Top 60% approx */}
          <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-pearl-100 flex-shrink-0">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt_text || product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.is_new && <Badge variant="new">NEW</Badge>}
              {product.is_bestseller && <Badge variant="bestseller">BESTSELLER</Badge>}
              {discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
            </div>

            {/* Wishlist Heart */}
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                isWishlisted
                  ? 'bg-gold-400 text-white shadow-gold'
                  : 'bg-white/60 backdrop-blur-md text-espresso-300 hover:bg-gold-400 hover:text-white shadow-sm'
              )}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn('w-4 h-4', isWishlisted && 'fill-current')}
              />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex flex-col flex-1 p-4 sm:p-5">
            <h3 className="font-playfair text-base sm:text-lg font-semibold text-espresso line-clamp-2 group-hover:text-gold-500 transition-colors mb-1">
              {product.name}
            </h3>
            <p className="text-xs text-espresso-200 line-clamp-1 font-inter mb-3 flex-1">
              {product.short_description}
            </p>

            {/* Price & Action Row */}
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-inter font-medium text-espresso">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-xs text-espresso-200 line-through font-inter">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <div className="lg:overflow-hidden">
                <button
                  onClick={handleAddToCart}
                  className="w-full btn-ghost-gold h-10 text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 lg:translate-y-[120%] lg:group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </Link>
    </motion.div>
  );
}
