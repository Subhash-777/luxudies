// ============================================
// LUXUDIES - Product Card Component
// ============================================

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="glass-card overflow-hidden transition-all duration-300 group-hover:shadow-medium group-hover:-translate-y-1 group-hover:border-gold-400/30">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-pearl-100">
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
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.is_new && <Badge variant="new">NEW</Badge>}
              {product.is_bestseller && <Badge variant="bestseller">BESTSELLER</Badge>}
              {discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleToggleWishlist}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-soft',
                  isWishlisted
                    ? 'bg-gold-400 text-white'
                    : 'bg-white/80 backdrop-blur-sm text-espresso-300 hover:bg-gold-400 hover:text-white'
                )}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={cn('w-4 h-4', isWishlisted && 'fill-current')}
                />
              </button>
            </div>

            {/* Add to Cart Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full h-10 bg-espresso/90 backdrop-blur-sm text-pearl text-xs font-inter font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-espresso transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                ADD TO CART
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-4">
            <h3 className="font-inter text-sm font-medium text-espresso line-clamp-1 group-hover:text-gold-500 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-espresso-200 mt-0.5 line-clamp-1 font-inter">
              {product.short_description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <span className="font-inter font-bold text-espresso">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xs text-espresso-200 line-through font-inter">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
