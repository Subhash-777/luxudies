// ============================================
// LUXUDIES - Homepage
// ============================================

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

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* First Fold: Hero */}
        <HeroSection />

        {/* Second Fold: Collections + Products */}
        <CollectionsSection />
        <NewArrivalsSection />
        <BestsellersSection />

        {/* Third Fold: Trust & Benefits */}
        <TrustSection />

        {/* Fourth Fold: Combos & Reviews */}
        <ComboOffersSection />
        <ReviewsSection />

        {/* Fifth Fold: FAQ */}
        <FAQSection />
      </main>

      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
