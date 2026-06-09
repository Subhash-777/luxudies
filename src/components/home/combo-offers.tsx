// ============================================
// LUXUDIES - Combo Offers Section (Redesigned)
// ============================================

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import toast from 'react-hot-toast';

export default function ComboOffersSection() {
  const addItem = useCartStore((s) => s.addItem);

  // Mock combo data
  const combos = [
    {
      id: 'c1',
      name: 'The Signature Set',
      description: 'Signature Bow Pendant + Classic Studs',
      originalPrice: 4498,
      comboPrice: 3999,
      saveAmount: 499,
      products: [
        { id: '1', image: '/images/products/bow-necklace.jpg', name: 'Signature Bow Pendant' },
        { id: '2', image: '/images/products/earrings.jpg', name: 'Classic Studs' }
      ]
    },
    {
      id: 'c2',
      name: 'Everyday Essentials',
      description: 'Minimalist Ring + Chain Bracelet',
      originalPrice: 3498,
      comboPrice: 2999,
      saveAmount: 499,
      products: [
        { id: '3', image: '/images/products/ring.jpg', name: 'Minimalist Ring' },
        { id: '4', image: '/images/products/bracelet.jpg', name: 'Chain Bracelet' }
      ]
    }
  ];

  const handleAddCombo = (combo: any) => {
    // In a real app, you'd add the combo product or multiple products
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

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {combos.map((combo, index) => (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <div className="glass-card p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-medium hover:border-gold-400/30">
                {/* Save Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-gold-500 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-gold">
                    Save {formatPrice(combo.saveAmount)}
                  </span>
                </div>

                {/* Thumbnail Pair */}
                <div className="relative flex items-center justify-center gap-2 sm:gap-4 mb-6 pt-4">
                  <div className="relative w-32 h-40 sm:w-40 sm:h-48 rounded-xl overflow-hidden bg-pearl-100 flex-shrink-0 shadow-sm">
                    <Image
                      src={combo.products[0].image}
                      alt={combo.products[0].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-pearl-200 border border-gold-400/20 flex items-center justify-center flex-shrink-0 z-10 -mx-6 sm:-mx-8">
                    <Plus className="w-4 h-4 text-gold-500" />
                  </div>

                  <div className="relative w-32 h-40 sm:w-40 sm:h-48 rounded-xl overflow-hidden bg-pearl-100 flex-shrink-0 shadow-sm">
                    <Image
                      src={combo.products[1].image}
                      alt={combo.products[1].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="text-center">
                  <h3 className="font-playfair text-xl font-bold text-espresso mb-1">
                    {combo.name}
                  </h3>
                  <p className="text-sm font-inter text-espresso-200 mb-4">
                    {combo.description}
                  </p>

                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="font-inter font-bold text-lg text-espresso">
                      {formatPrice(combo.comboPrice)}
                    </span>
                    <span className="font-inter text-sm text-espresso-200 line-through">
                      {formatPrice(combo.originalPrice)}
                    </span>
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
