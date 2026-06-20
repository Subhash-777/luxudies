// ============================================
// LUXUDIES - Shop Page
// ============================================

'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, X, Search, Loader2 } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import ProductCard from '@/components/product/product-card';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'rings', label: 'Rings' },
  { value: 'combos', label: 'Combos' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'bestselling', label: 'Bestselling' },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*)
        `)
        .eq('is_active', true);
        
      if (data && !error) {
        // Sort images so primary comes first
        const formattedData = data.map(p => {
          if (p.images) {
            p.images.sort((a: any, b: any) => {
              if (a.is_primary) return -1;
              if (b.is_primary) return 1;
              return a.sort_order - b.sort_order;
            });
          }
          return p;
        });
        setProducts(formattedData);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.short_description && p.short_description.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'bestselling':
        result.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, sortBy, searchQuery]);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container-luxury py-6 lg:py-10">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-espresso mb-3">
              Shop All
            </h1>
            <p className="font-inter text-sm text-espresso-200 max-w-md mx-auto">
              Discover our complete collection of premium jewelry. Every piece crafted with love.
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-full text-sm font-inter text-espresso placeholder:text-espresso-100 focus:outline-none focus:border-gold-400/40 focus:ring-2 focus:ring-gold-400/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-espresso-200 hover:text-espresso"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Category Pills (scrollable on mobile) */}
            <div className="flex overflow-x-auto scrollbar-hide gap-2 w-full sm:w-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={cn(
                    'px-4 py-2 text-xs font-inter font-medium rounded-full whitespace-nowrap transition-all shrink-0',
                    selectedCategory === cat.value
                      ? 'bg-espresso text-pearl'
                      : 'bg-pearl-200 text-espresso-300 hover:bg-pearl-300'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto appearance-none h-10 sm:h-9 pl-4 pr-10 bg-pearl-200 text-sm sm:text-xs font-inter font-medium text-espresso-300 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-gold-400/20 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 sm:right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-3.5 sm:h-3.5 text-espresso-200 pointer-events-none" />
            </div>
          </div>

          {/* Results Count */}
          <p className="text-xs font-inter text-espresso-200 mb-4">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>

          {/* Products Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
              <p className="font-inter text-sm text-espresso-200">Loading collection...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-playfair text-xl text-espresso mb-2">
                No products found
              </p>
              <p className="font-inter text-sm text-espresso-200">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
