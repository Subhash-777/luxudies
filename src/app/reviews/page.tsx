// ============================================
// LUXUDIES - Reviews Page
// ============================================

import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import ReviewsSection from '@/components/home/reviews-section';

export const metadata = {
  title: 'Customer Reviews',
  description: 'See what our customers are saying about LUXUDIES jewelry.',
};

export default function ReviewsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        <ReviewsSection />
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
