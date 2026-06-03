// ============================================
// LUXUDIES - Combo Offers Section
// ============================================

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import { SAMPLE_COMBOS } from '@/lib/sample-data';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export default function ComboOffersSection() {
  return (
    <section className="py-16 lg:py-24 bg-luxury-section">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-gold-400 fill-gold-400" />
            <span className="text-xs font-inter font-semibold tracking-[0.15em] text-gold-500 uppercase">
              Save More
            </span>
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso mb-3">
            Combo Offers
          </h2>
          <p className="font-inter text-sm text-espresso-200 max-w-md mx-auto">
            Curated sets at special prices. More beauty, more savings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {SAMPLE_COMBOS.map((combo, i) => (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <Link
                href={`/shop/combo-offers`}
                className="group block glass-card-strong overflow-hidden hover:shadow-gold hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={combo.image_url}
                    alt={combo.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="combo">COMBO</Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white text-[10px] font-inter font-bold px-2.5 py-1 rounded-full">
                      SAVE {formatPrice(combo.savings)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-playfair text-lg font-semibold text-espresso mb-1 group-hover:text-gold-500 transition-colors">
                    {combo.name}
                  </h3>
                  <p className="font-inter text-xs text-espresso-200 mb-4 line-clamp-2">
                    {combo.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-inter font-bold text-xl text-espresso">
                        {formatPrice(combo.combo_price)}
                      </span>
                      <span className="font-inter text-sm text-espresso-200 line-through">
                        {formatPrice(combo.original_price)}
                      </span>
                    </div>
                    <span className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center group-hover:bg-gold-400 group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5 text-gold-500 group-hover:text-white" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
