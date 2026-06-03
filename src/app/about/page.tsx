// ============================================
// LUXUDIES - About Page
// ============================================

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Shield, Users, Star } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';

const values = [
  { icon: Heart, title: 'Crafted with Love', desc: 'Every piece is designed with passion and attention to detail.' },
  { icon: Sparkles, title: 'Premium Quality', desc: '18K gold plating with anti-tarnish protection for lasting beauty.' },
  { icon: Shield, title: 'Customer First', desc: 'Your satisfaction is our top priority. Always.' },
  { icon: Users, title: 'Community', desc: 'Building a family of women who celebrate everyday elegance.' },
];

const milestones = [
  { number: '5000+', label: 'Happy Customers' },
  { number: '250+', label: 'Unique Designs' },
  { number: '4.8★', label: 'Average Rating' },
  { number: '100%', label: 'Made in India' },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-b from-ivory-50 to-pearl overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-100/20 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4" />
          <div className="container-luxury relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="text-xs font-inter font-semibold tracking-[0.15em] text-gold-500 uppercase mb-4 block">Our Story</span>
              <h1 className="font-playfair text-4xl lg:text-6xl font-bold text-espresso mb-6 leading-tight">
                Crafted to Be Cherished.
                <br />
                <span className="text-gold-gradient">Designed to Be You.</span>
              </h1>
              <p className="font-inter text-base lg:text-lg text-espresso-200 max-w-2xl mx-auto leading-relaxed">
                LUXUDIES was born from a simple belief — that luxury should be accessible,
                everyday elegance should be effortless, and every woman deserves jewelry
                that makes her feel extraordinary.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 lg:py-24">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-pearl-100">
                  <Image
                    src="/images/products/bow-necklace.jpg"
                    alt="LUXUDIES jewelry craftsmanship"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold-100/30 rounded-full blur-[40px]" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-espresso">
                  Our Journey
                </h2>
                <p className="font-inter text-sm text-espresso-200 leading-relaxed">
                  What started as a passion project in Tamil Nadu has grown into a beloved jewelry brand
                  trusted by thousands of women across the state. We believe that the right piece of jewelry
                  can transform not just your look, but your confidence.
                </p>
                <p className="font-inter text-sm text-espresso-200 leading-relaxed">
                  Each LUXUDIES piece undergoes a meticulous process — from design conceptualization to
                  18K gold plating, anti-tarnish coating, and quality testing. We ensure every piece that
                  reaches you is nothing short of perfect.
                </p>
                <p className="font-inter text-sm text-espresso-200 leading-relaxed">
                  We&apos;re not just selling jewelry. We&apos;re crafting memories, celebrating milestones,
                  and empowering everyday moments with a touch of gold.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 bg-luxury-section">
          <div className="container-luxury">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-espresso mb-3">What We Stand For</h2>
              <p className="font-inter text-sm text-espresso-200">The values that drive everything we do.</p>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {values.map((value, i) => (
                <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <GlassCard hover padding="lg" className="text-center h-full">
                    <div className="w-14 h-14 rounded-2xl bg-gold-50 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-gold-500" />
                    </div>
                    <h3 className="font-playfair text-base font-semibold text-espresso mb-2">{value.title}</h3>
                    <p className="font-inter text-xs text-espresso-200 leading-relaxed">{value.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16 lg:py-20">
          <div className="container-luxury">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <p className="font-playfair text-3xl lg:text-4xl font-bold text-gold-gradient mb-1">{m.number}</p>
                  <p className="font-inter text-sm text-espresso-200">{m.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-20 bg-espresso text-pearl text-center">
          <div className="container-luxury">
            <h2 className="font-playfair text-2xl lg:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Piece?
            </h2>
            <p className="font-inter text-sm text-pearl/70 mb-8 max-w-md mx-auto">
              Explore our collection of premium jewelry designed to make you shine.
            </p>
            <Link href="/shop">
              <Button size="xl">SHOP NOW</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
