// ============================================
// LUXUDIES - Hero Section
// ============================================

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Feather, Droplets, Gift, ChevronRight, Lock } from 'lucide-react';
import Button from '@/components/ui/button';
import GoldParticles from './gold-particles';

const benefits = [
  { icon: Shield, label: 'Anti-Tarnish', sub: 'Long Lasting Shine' },
  { icon: Feather, label: 'Lightweight', sub: 'All Day Comfort' },
  { icon: Droplets, label: 'Water & Sweat', sub: 'Resistant' },
  { icon: Gift, label: 'Gift-Ready', sub: 'Premium Packaging' },
];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative min-h-[calc(100vh-100px)] lg:min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pearl-50 via-ivory-50 to-pearl-200" />

      {/* Ambient light effect */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-100/30 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-200/20 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />

      {/* Gold Particles */}
      <GoldParticles />

      <motion.div
        style={{ opacity, scale }}
        className="container-luxury relative z-10 py-8 lg:py-0"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-espresso leading-[1.1] mb-5">
                Luxury jewellery
                <br />
                that speaks
                <br />
                <span className="text-gold-gradient">before you do.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="font-inter text-base sm:text-lg text-espresso-300 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Pearl-white elegance, gold-finished details, and timeless everyday
              shine.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start mb-8"
            >
              <Link href="/shop">
                <Button size="xl" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
                  SHOP NOW
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="xl">
                  VIEW COLLECTION
                </Button>
              </Link>
            </motion.div>

            {/* Trust note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-4 justify-center lg:justify-start text-xs text-espresso-200 font-inter"
            >
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gold-400" />
                Secure checkout powered by Razorpay
              </span>
              <span className="w-1 h-1 rounded-full bg-gold-300" />
              <span>100% Secure Payments</span>
            </motion.div>
          </div>

          {/* Hero Product Image */}
          <motion.div
            style={{ y }}
            className="order-1 lg:order-2 relative"
          >
            <motion.div
              animate={{
                y: [0, -12, -5, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative max-w-[400px] lg:max-w-[500px] mx-auto"
            >
              {/* Glow behind product */}
              <div className="absolute inset-0 bg-gold-200/20 rounded-full blur-[60px] scale-75" />

              <Image
                src="/images/products/bow-necklace.jpg"
                alt="LUXUDIES Signature Bow Pendant Necklace"
                width={500}
                height={500}
                className="relative z-10 rounded-3xl drop-shadow-2xl"
                priority
              />

              {/* 3D badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="absolute bottom-6 right-2 lg:right-0 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-medium border border-gold-400/20 z-20"
              >
                <span className="text-[10px] font-inter font-bold text-gold-500 tracking-wider">
                  3D
                </span>
              </motion.div>
            </motion.div>

            {/* Floating benefit cards (desktop) */}
            <div className="hidden lg:block">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.label}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
                  className="absolute glass-card-strong px-4 py-3 flex items-center gap-3 min-w-[200px]"
                  style={{
                    top: `${15 + i * 22}%`,
                    right: i % 2 === 0 ? '-10%' : '-15%',
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-xs font-inter font-bold text-espresso">
                      {benefit.label}
                    </p>
                    <p className="text-[10px] font-inter text-espresso-200">
                      {benefit.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile benefits strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:hidden flex overflow-x-auto scrollbar-hide gap-3 mt-8 -mx-4 px-4"
        >
          {benefits.map((benefit) => (
            <div
              key={benefit.label}
              className="glass-card flex items-center gap-2.5 px-4 py-3 min-w-[160px] shrink-0"
            >
              <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center shrink-0">
                <benefit.icon className="w-4 h-4 text-gold-500" />
              </div>
              <div>
                <p className="text-[11px] font-inter font-bold text-espresso whitespace-nowrap">
                  {benefit.label}
                </p>
                <p className="text-[9px] font-inter text-espresso-200 whitespace-nowrap">
                  {benefit.sub}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
