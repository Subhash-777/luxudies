// ============================================
// LUXUDIES - Trust / Why LUXUDIES Section
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Shield, Feather, Droplets, Gift, Heart, Sparkles } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';

const features = [
  {
    icon: Sparkles,
    title: '18K Gold Plated',
    description: 'Luxurious gold shine that lasts. Every piece radiates warmth and elegance.',
    color: 'from-gold-100 to-gold-50',
  },
  {
    icon: Shield,
    title: 'Anti-Tarnish Protection',
    description: 'Special coating keeps your jewelry shiny as new, even with daily wear.',
    color: 'from-gold-100 to-pearl-200',
  },
  {
    icon: Feather,
    title: 'Lightweight Comfort',
    description: 'Light as air, comfortable all day. Designed for effortless everyday elegance.',
    color: 'from-pearl-300 to-ivory-100',
  },
  {
    icon: Droplets,
    title: 'Water & Sweat Resistant',
    description: 'Made for your everyday moments — worry-free and carefree.',
    color: 'from-ivory-100 to-pearl-200',
  },
  {
    icon: Heart,
    title: 'Hypoallergenic',
    description: 'Nickel and lead free. Gentle on your skin, safe for all-day wear.',
    color: 'from-gold-50 to-ivory-100',
  },
  {
    icon: Gift,
    title: 'Gift-Ready Packaging',
    description: 'Every piece comes in premium packaging. Ready to gift, ready to impress.',
    color: 'from-ivory-100 to-gold-50',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function TrustSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="text-xs font-inter font-semibold tracking-[0.15em] text-gold-500 uppercase mb-3 block">
            Why Choose Us
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso mb-3">
            Why LUXUDIES?
          </h2>
          <p className="font-inter text-sm text-espresso-200 max-w-md mx-auto">
            Every piece is crafted with precision, quality, and love. Here&apos;s
            what makes us different.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <GlassCard
                hover
                padding="lg"
                className="h-full text-center group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-gold-500" />
                </div>
                <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
                  {feature.title}
                </h3>
                <p className="font-inter text-sm text-espresso-200 leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
