// ============================================
// LUXUDIES - Standalone FAQ Page
// ============================================

import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import FAQSection from '@/components/home/faq-section';

export const metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about LUXUDIES jewelry — shipping, returns, care instructions, and more.',
};

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        <FAQSection />
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
