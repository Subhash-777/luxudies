// ============================================
// LUXUDIES - Hero Section (Redesigned)
// ============================================

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Lock } from 'lucide-react';
import GoldParticles from './gold-particles';

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax values
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Headline stagger setup
  const headlineText = "Luxury jewellery that speaks before you do.";
  const words = headlineText.split(" ");
  
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const wordVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[calc(100vh-80px)] lg:min-h-screen flex items-center overflow-hidden bg-pearl"
    >
      {/* Parallax Background Layer */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-100/30 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-200/20 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
        <GoldParticles />
      </motion.div>

      <div className="container-luxury relative z-10 py-12 lg:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Mobile Image First, Desktop Right */}
          <motion.div
            style={{ y: yImage, opacity }}
            className="order-1 lg:order-2 relative mx-auto w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[500px]"
          >
            {/* Elegant Glass Arch Background */}
            <div className="absolute inset-0 top-4 bottom-4 rounded-t-full rounded-b-3xl bg-gradient-to-b from-white/60 to-white/10 backdrop-blur-2xl border border-white/50 shadow-[0_30px_60px_rgba(58,42,30,0.08)] scale-105" />
            
            {/* Radial gold glow behind floating product */}
            <div className="absolute inset-0 bg-gold-300/10 rounded-t-full rounded-b-3xl blur-2xl scale-95" />

            <div className="relative animate-[float_6s_ease-in-out_infinite] z-10 px-6 py-12">
              <Image
                src="/images/products/bow-necklace.jpg"
                alt="LUXUDIES Signature Bow Pendant Necklace"
                width={600}
                height={600}
                className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(58,42,30,0.15)] rounded-3xl"
                priority
              />
            </div>

            {/* Floating Luxury Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-4 -left-4 sm:-left-10 bg-white/90 backdrop-blur-md border border-gold-400/20 px-6 py-4 rounded-2xl shadow-xl z-20"
            >
              <p className="font-playfair font-bold text-espresso text-lg mb-0.5">18K Gold Plated</p>
              <p className="font-inter text-xs text-espresso-300 tracking-wide uppercase">Handcrafted Elegance</p>
            </motion.div>
          </motion.div>

          {/* Text Content (Left on Desktop, Bottom on Mobile) */}
          <motion.div 
            style={{ y: yText, opacity }} 
            className="order-2 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <motion.h1 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-espresso leading-[1.15] mb-6 tracking-tight max-w-[15ch] lg:max-w-[12ch]"
            >
              {words.map((word, i) => (
                <motion.span 
                  key={i} 
                  variants={wordVariants} 
                  className={`inline-block mr-[0.25em] ${i >= 3 ? 'italic font-medium text-gold-600 drop-shadow-sm' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Gold Shimmer Line */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="w-24 h-[2px] bg-gold-400 origin-left mb-6 lg:mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="font-inter text-base lg:text-lg text-espresso-300 max-w-md leading-relaxed mb-8 lg:mb-10"
            >
              Pearl-white elegance, gold-finished details, and timeless everyday shine.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8"
            >
              <Link href="/shop" className="w-full sm:w-auto">
                <button className="btn-gold w-full sm:w-auto px-8 py-4 text-[13px] uppercase tracking-widest flex items-center justify-center gap-2">
                  Shop Collection
                </button>
              </Link>
              <Link href="/shop" className="w-full sm:w-auto">
                <button className="btn-ghost-gold w-full sm:w-auto px-8 py-4 text-[13px] uppercase tracking-widest bg-transparent transition-colors hover:bg-gold-50">
                  View Lookbook
                </button>
              </Link>
            </motion.div>

            {/* Trust Microcopy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center gap-3 lg:justify-start text-xs text-espresso-200 font-inter"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3 h-3 text-gold-400" />
                Secure Checkout
              </span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gold-200" />
              <span>Free shipping above ₹999</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gold-200" />
              <span>Easy returns</span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
