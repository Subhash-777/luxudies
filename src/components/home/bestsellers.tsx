'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/product-card';
import { createClient } from '@/lib/supabase/client';

export default function Bestsellers() {
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
        .eq('is_bestseller', true)
        .limit(4);

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
    <section className="py-16 sm:py-20 lg:py-24 bg-pearl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-10 w-40 h-40 bg-espresso/5 rounded-full blur-2xl" />

      <div className="container-luxury relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory border border-gold-400/20 mb-6"
          >
            <Award className="w-4 h-4 text-gold-500" />
            <span className="font-inter text-xs font-bold text-gold-600 tracking-widest uppercase">
              Most Loved
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso mb-4"
          >
            Bestsellers
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-inter text-sm sm:text-base text-espresso-200 max-w-2xl mx-auto"
          >
            Our signature pieces that everyone is talking about. Discover the jewelry our customers love most.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
            <p className="font-inter text-sm text-espresso-200">Loading bestsellers...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-playfair text-xl text-espresso mb-2">No bestsellers found</p>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link href="/shop/bestsellers">
            <button className="btn-ghost-gold px-8 py-3.5 group inline-flex items-center gap-2 text-xs">
              VIEW ALL BESTSELLERS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
