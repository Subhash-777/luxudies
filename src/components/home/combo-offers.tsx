// ============================================
// LUXUDIES - Combo Offers Section (Redesigned)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

export default function ComboOffersSection() {
  const addItem = useCartStore((s) => s.addItem);
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      setLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('combos')
        .select(`
          *,
          combo_items (
            product_id,
            products (
              *,
              images:product_images(*)
            )
          )
        `)
        .eq('is_active', true)
        .limit(2);

      if (data && !error) {
        const formattedCombos = data.map(combo => {
          let originalPrice = 0;
          const products = combo.combo_items.map((item: any) => {
            const p = item.products;
            if (p.images) {
              p.images.sort((a: any, b: any) => {
                if (a.is_primary) return -1;
                if (b.is_primary) return 1;
                return a.sort_order - b.sort_order;
              });
            }
            originalPrice += p.price;
            return {
              id: p.id,
              name: p.name,
              image: p.images?.[0]?.url || '/images/placeholder.jpg',
              price: p.price
            };
          });

          const discount = combo.discount_percentage || 0;
          const comboPrice = originalPrice * (1 - discount / 100);
          const saveAmount = originalPrice - comboPrice;

          return {
            id: combo.id,
            name: combo.name,
            description: combo.description,
            originalPrice,
            comboPrice,
            saveAmount,
            products
          };
        });

        setCombos(formattedCombos);
      }
      setLoading(false);
    };

    fetchCombos();
  }, []);

  const handleAddCombo = (combo: any) => {
    toast.success(`${combo.name} added to cart`);
  };

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
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {combos.map((combo, index) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <div className="glass-card p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-medium hover:border-gold-400/30 h-full flex flex-col">
                  {/* Save Badge */}
                  {combo.saveAmount > 0 && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-gold-500 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-gold">
                        Save {formatPrice(combo.saveAmount)}
                      </span>
                    </div>
                  )}

                  {/* Thumbnail Pair */}
                  <div className="relative flex items-center justify-center gap-2 sm:gap-4 mb-6 pt-4 flex-grow">
                    {combo.products.map((product: any, idx: number) => (
                      <div key={product.id} className="flex items-center gap-2 sm:gap-4">
                        <div className="relative w-28 h-36 sm:w-36 sm:h-44 rounded-xl overflow-hidden bg-pearl-100 flex-shrink-0 shadow-sm">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {idx < combo.products.length - 1 && (
                          <div className="w-8 h-8 rounded-full bg-pearl-200 border border-gold-400/20 flex items-center justify-center flex-shrink-0 z-10 -mx-6 sm:-mx-8">
                            <Plus className="w-4 h-4 text-gold-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="text-center mt-auto">
                    <h3 className="font-playfair text-xl font-bold text-espresso mb-1">
                      {combo.name}
                    </h3>
                    {combo.description && (
                      <p className="text-sm font-inter text-espresso-200 mb-4">
                        {combo.description}
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-3 mb-6">
                      <span className="font-inter font-bold text-lg text-espresso">
                        {formatPrice(combo.comboPrice)}
                      </span>
                      {combo.originalPrice > combo.comboPrice && (
                        <span className="font-inter text-sm text-espresso-200 line-through">
                          {formatPrice(combo.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddCombo(combo)}
                      className="w-full btn-gold h-12 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      ADD COMBO TO CART
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="font-playfair text-xl text-espresso mb-2">No combos available right now</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link href="/shop/combo-offers">
            <button className="btn-ghost-gold px-8 py-4 w-full sm:w-auto text-[13px] uppercase tracking-widest hover:bg-gold-50 transition-colors">
              See All Combo Offers
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
