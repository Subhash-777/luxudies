// ============================================
// LUXUDIES - Collections Section (Redesigned)
// ============================================

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const collections = [
  {
    id: '1',
    name: 'Necklaces',
    slug: 'necklaces',
    image: '/images/products/bow-necklace.jpg',
    description: 'Pendants & Chains',
  },
  {
    id: '2',
    name: 'Earrings',
    slug: 'earrings',
    image: '/images/products/earrings.jpg', // Placeholder, gracefully handle if missing
    description: 'Studs & Drops',
  },
  {
    id: '3',
    name: 'Rings',
    slug: 'rings',
    image: '/images/products/ring.jpg',
    description: 'Bands & Statement',
  },
  {
    id: '4',
    name: 'Bracelets',
    slug: 'bracelets',
    image: '/images/products/bracelet.jpg',
    description: 'Cuffs & Links',
  },
];

export default function CollectionsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    setScrollProgress(progress);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll(); // Init
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="py-20 lg:py-32 bg-pearl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-full h-full bg-ivory-50 rounded-full blur-[100px] -translate-y-1/2 opacity-50 pointer-events-none" />

      <div className="container-luxury relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 lg:mb-16 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-playfair text-3xl lg:text-4xl xl:text-5xl font-bold text-espresso mb-3">
              Curated Collections
            </h2>
            <p className="font-inter text-espresso-200">
              Discover our most loved categories
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden sm:block"
          >
            <Link 
              href="/shop"
              className="group flex items-center gap-2 text-sm font-inter font-medium tracking-wider text-espresso hover:text-gold-500 transition-colors uppercase"
            >
              Shop All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Scrollable Container (Mobile) / Grid (Desktop) */}
        <div 
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-4 gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0"
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-start flex-shrink-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            >
              <Link href={`/shop?category=${collection.slug}`} className="group block h-full">
                <div className="glass-card overflow-hidden h-[360px] lg:h-[420px] relative transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-medium group-hover:border-gold-400/30">
                  <div className="absolute inset-0 bg-pearl-100">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* Gradient overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso-500/80 via-espresso-500/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 flex items-end justify-between">
                    <div>
                      <p className="text-pearl-200 text-xs font-inter uppercase tracking-widest mb-1 opacity-80 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {collection.description}
                      </p>
                      <h3 className="font-playfair text-2xl lg:text-3xl text-white font-medium">
                        {collection.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Scroll Indicator Dots */}
        <div className="flex lg:hidden justify-center gap-2 mt-4">
          {collections.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                Math.abs(scrollProgress * (collections.length - 1) - i) < 0.5 
                  ? 'w-6 bg-gold-400' 
                  : 'w-1.5 bg-gold-400/20'
              }`} 
            />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-inter font-medium tracking-wider text-espresso hover:text-gold-500 transition-colors uppercase"
          >
            Shop All Collections
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
