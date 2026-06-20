'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import ProductCard from '@/components/product/product-card';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import { createClient } from '@/lib/supabase/client';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*)
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);

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
      } else {
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [query]);

  return (
    <>
      <div className="text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory border border-gold-400/20 mb-6"
        >
          <Search className="w-4 h-4 text-gold-500" />
          <span className="font-inter text-xs font-bold text-gold-600 tracking-widest uppercase">
            Search Results
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso mb-4"
        >
          {query ? `Results for "${query}"` : 'Search Our Store'}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-inter text-sm sm:text-base text-espresso-200 max-w-2xl mx-auto"
        >
          {loading 
            ? 'Searching our collection...'
            : products.length > 0 
              ? `Found ${products.length} product${products.length === 1 ? '' : 's'} matching your search.` 
              : 'No products matched your search criteria.'}
        </motion.p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
          <p className="font-inter text-sm text-espresso-200">Searching...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-20">
          <p className="font-playfair text-xl text-espresso mb-2">
            No products found
          </p>
          <p className="font-inter text-sm text-espresso-200">
            Try checking your spelling or using different keywords.
          </p>
        </div>
      ) : null}
    </>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-pearl pb-24 lg:pb-0">
        <div className="container-luxury py-8 lg:py-12">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
            </div>
          }>
            <SearchResults />
          </Suspense>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
