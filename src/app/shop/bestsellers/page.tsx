// ============================================
// LUXUDIES - Bestsellers Page
// ============================================

'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Loader2 } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import ProductCard from '@/components/product/product-card';
import { createClient } from '@/lib/supabase/client';

export default function BestsellersPage() {
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
        .eq('is_active', true)
        .eq('is_bestseller', true);

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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-pearl pb-24 lg:pb-0">
        <div className="container-luxury py-8 lg:py-12">
          
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory border border-gold-400/20 mb-6"
            >
              <Award className="w-4 h-4 text-gold-500" />
              <span className="font-inter text-xs font-bold text-gold-600 tracking-widest uppercase">
                Most Loved
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso mb-4"
            >
              Bestsellers
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-inter text-sm sm:text-base text-espresso-200 max-w-2xl mx-auto"
            >
              Our customers&apos; favorites. The pieces everyone keeps coming back for.
            </motion.p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
              <p className="font-inter text-sm text-espresso-200">Loading bestsellers...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-playfair text-xl text-espresso mb-2">
                No bestsellers yet
              </p>
              <p className="font-inter text-sm text-espresso-200">
                Check back soon to see what everyone is loving.
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
