// ============================================
// LUXUDIES - Search Page
// ============================================

'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import ProductCard from '@/components/product/product-card';
import { SAMPLE_PRODUCTS } from '@/lib/sample-data';

const trendingSearches = ['Necklace', 'Gold Hoops', 'Bracelet', 'Pearl Earrings', 'Gift Set'];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  // Sync query state when URL changes (e.g. from header search)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q) setQuery(q);
  }, [searchParams]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SAMPLE_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="container-luxury py-6 lg:py-10">
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-10"
      >
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso-200" />
          <input
            type="text"
            placeholder="Search for necklaces, earrings, bracelets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full h-14 pl-14 pr-12 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-2xl text-base font-inter text-espresso placeholder:text-espresso-100 focus:outline-none focus:border-gold-400/40 focus:ring-2 focus:ring-gold-400/10 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-espresso-200 hover:text-espresso"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Trending Searches (when no query) */}
      <AnimatePresence>
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-gold-500" />
              <span className="text-xs font-inter font-semibold text-espresso-200 uppercase tracking-widest">Trending Searches</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-pearl-200 hover:bg-pearl-300 text-sm font-inter text-espresso-300 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {query && (
        <div>
          <p className="text-xs font-inter text-espresso-200 mb-4">
            {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {results.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-playfair text-xl text-espresso mb-2">No results found</p>
              <p className="font-inter text-sm text-espresso-200">
                Try a different search term or browse our collections.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Suspense fallback={
          <div className="container-luxury py-6 lg:py-10 text-center">
            <p className="font-inter text-sm text-espresso-200">Loading search...</p>
          </div>
        }>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
