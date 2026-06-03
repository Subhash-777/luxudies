// ============================================
// LUXUDIES - Collections Section
// ============================================

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SAMPLE_COLLECTIONS } from '@/lib/sample-data';

export default function CollectionsSection() {
  return (
    <section className="py-16 lg:py-24 bg-luxury-section">
      <div className="container-luxury">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 lg:mb-12"
        >
          <div>
            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso">
              Shop Our Collections
            </h2>
            <p className="font-inter text-sm text-espresso-200 mt-2">
              Handpicked styles for every you.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 text-xs font-inter font-semibold tracking-wider text-espresso-300 hover:text-gold-500 transition-colors border border-espresso-100 rounded-full px-4 py-2 hover:border-gold-400"
          >
            VIEW ALL COLLECTIONS
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {SAMPLE_COLLECTIONS.map((collection, i) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link
                href={`/shop/${collection.slug}`}
                className="group block relative overflow-hidden rounded-[20px] aspect-[3/4] lg:aspect-[4/5]"
              >
                <Image
                  src={collection.image_url}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                  <h3 className="font-playfair text-base lg:text-lg font-bold text-white mb-0.5">
                    {collection.name}
                  </h3>
                  <p className="text-[11px] font-inter text-white/70 line-clamp-1">
                    {collection.description}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gold-400/0 group-hover:bg-gold-400/10 transition-colors duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile view all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="sm:hidden mt-6 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-xs font-inter font-semibold tracking-wider text-espresso-300 border border-espresso-100 rounded-full px-5 py-2.5 hover:border-gold-400 hover:text-gold-500 transition-all"
          >
            VIEW ALL
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
