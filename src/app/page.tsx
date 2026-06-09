// ============================================
// LUXUDIES - Homepage
// ============================================

'use client';

import { motion } from 'framer-motion';
import AnnouncementBar from '@/components/layout/announcement-bar';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import HeroSection from '@/components/home/hero-section';
import CollectionsSection from '@/components/home/collections-section';
import NewArrivalsSection from '@/components/home/new-arrivals';
import BestsellersSection from '@/components/home/bestsellers';
import TrustSection from '@/components/home/trust-section';
import ComboOffersSection from '@/components/home/combo-offers';
import ReviewsSection from '@/components/home/reviews-section';
import FAQSection from '@/components/home/faq-section';
import WhatsAppFAB from '@/components/home/whatsapp-fab';

const FadeInSection = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />

      <main>
        {/* Hero Section handles its own specific entrance animations */}
        <HeroSection />

        <FadeInSection>
          <CollectionsSection />
        </FadeInSection>

        <FadeInSection>
          <BestsellersSection />
        </FadeInSection>

        <FadeInSection>
          <TrustSection />
        </FadeInSection>

        <FadeInSection>
          <NewArrivalsSection />
        </FadeInSection>

        <FadeInSection>
          <ComboOffersSection />
        </FadeInSection>

        <FadeInSection>
          <ReviewsSection />
        </FadeInSection>

        <FadeInSection>
          <FAQSection />
        </FadeInSection>
      </main>

      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
