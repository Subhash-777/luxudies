// ============================================
// LUXUDIES - Trust Section (Redesigned)
// ============================================

'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Feather, Droplets, Gift } from 'lucide-react';

export default function TrustSection() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Anti-Tarnish",
      description: "Coated with anti-tarnish protection for lasting shine."
    },
    {
      icon: Feather,
      title: "Lightweight",
      description: "Designed for all-day effortless comfort."
    },
    {
      icon: Droplets,
      title: "Water Resistant",
      description: "Sweat and splash proof for daily use."
    },
    {
      icon: Gift,
      title: "Gift Ready",
      description: "Arrives in premium signature packaging."
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-ivory relative overflow-hidden">
      {/* Soft noise/texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      <div className="container-luxury relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gold-50 border border-gold-400/20 flex items-center justify-center mb-4 lg:mb-6 shadow-soft">
                  <Icon className="w-5 h-5 lg:w-7 lg:h-7 text-gold-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-playfair text-lg lg:text-xl font-bold text-espresso mb-2">
                  {pillar.title}
                </h3>
                <p className="font-inter text-xs lg:text-sm text-espresso-300 max-w-[200px]">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
