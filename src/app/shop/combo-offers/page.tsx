'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Loader2 } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

export default function ComboOffersPage() {
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
        .eq('is_active', true);

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
              <ShoppingBag className="w-4 h-4 text-gold-500" />
              <span className="font-inter text-xs font-bold text-gold-600 tracking-widest uppercase">
                Save More
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso mb-4"
            >
              Combo Offers
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-inter text-sm sm:text-base text-espresso-200 max-w-2xl mx-auto"
            >
              Curated sets at special prices. Perfect for gifting or treating yourself.
            </motion.p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
              <p className="font-inter text-sm text-espresso-200">Loading combos...</p>
            </div>
          ) : combos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {combos.map((combo, index) => (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gold-400/10 flex flex-col group h-full"
                >
                  <div className="relative aspect-[4/3] bg-pearl-100 p-6 flex items-center justify-center gap-4 overflow-hidden group-hover:bg-pearl-200 transition-colors duration-500">
                    {combo.saveAmount > 0 && (
                      <div className="absolute top-4 right-4 z-10 bg-success text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Save {formatPrice(combo.saveAmount)}
                      </div>
                    )}
                    
                    {combo.products.map((product: any, idx: number) => (
                      <div 
                        key={idx}
                        className="relative w-1/2 h-full rounded-lg overflow-hidden shadow-sm transform transition-transform duration-500 group-hover:scale-105"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-playfair text-xl font-bold text-espresso mb-2">
                      {combo.name}
                    </h3>
                    {combo.description && (
                      <p className="font-inter text-sm text-espresso-200 mb-6 flex-grow">
                        {combo.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
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
                        className="text-xs font-inter font-semibold text-gold-600 hover:text-gold-700 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        Shop <span className="text-lg leading-none">&rarr;</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-playfair text-xl text-espresso mb-2">
                No combo offers right now
              </p>
              <p className="font-inter text-sm text-espresso-200">
                Check back later for exclusive deals and paired sets.
              </p>
            </div>
          )}

        </div>
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
    </>
  );
}
