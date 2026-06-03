// ============================================
// LUXUDIES - Policy Pages Layout
// ============================================

import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pb-24 lg:pb-0">
        <div className="container-luxury py-8 lg:py-16 max-w-3xl">
          {children}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
    </>
  );
}
