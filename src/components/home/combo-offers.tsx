// ============================================
// LUXUDIES - Combo Offers Section (Redesigned)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/product-card';
import { createClient } from '@/lib/supabase/client';

export default function ComboOffersSection() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      setLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*)
        `)
        .eq('category', 'combos')
        .eq('is_active', true)
        .limit(4);

      if (data && !error) {
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
        setCombos(formattedData);
      }
      setLoading(false);
    };

    fetchCombos();
  }, []);

  return (
    <section className="py-20 lg:py-32 bg-pearl relative overflow-hidden">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="font-playfair text-3xl lg:text-4xl xl:text-5xl font-bold text-espresso mb-3">
            Buy Together, Save More
          </h2>
          <p className="font-inter text-espresso-200 max-w-lg mx-auto">
            Perfectly paired sets designed to complement each other and elevate your look.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
            <p className="font-inter text-sm text-espresso-200">Loading combos...</p>
          </div>
        ) : combos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {combos.map((combo, index) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <ProductCard product={combo} index={index} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="font-playfair text-xl text-espresso mb-2">No combos available right now</p>
          </div>
        )}

        {combos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <a 
              href="/shop/combo-offers"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 h-auto text-sm font-bold tracking-widest group"
            >
              <ShoppingBag className="w-4 h-4" />
              VIEW ALL COMBOS
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
