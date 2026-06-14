// ============================================
// LUXUDIES - Account Layout (Mobile-First Redesign)
// ============================================

'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, LogOut, Settings, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const accountLinks = [
  { href: '/account', label: 'Profile', icon: User },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/settings', label: 'Settings', icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pb-24 lg:pb-0">

        {/* ─── MOBILE LAYOUT ────────────────────────── */}
        <div className="lg:hidden">
          {/* Page header */}
          <div className="bg-pearl border-b border-gold-400/10 px-4 pt-5 pb-0">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-playfair text-2xl font-bold text-espresso mb-4"
            >
              My Account
            </motion.h1>

            {/* Tab bar — full-width scrollable, flush with screen edges */}
            <nav className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 gap-1">
              {accountLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2.5 text-xs font-inter font-medium whitespace-nowrap shrink-0 border-b-2 transition-all',
                      isActive
                        ? 'border-gold-500 text-gold-600 font-semibold'
                        : 'border-transparent text-espresso-200 hover:text-espresso-400'
                    )}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Page content */}
          <div className="px-4 py-5">
            {children}
          </div>
        </div>

        {/* ─── DESKTOP LAYOUT ───────────────────────── */}
        <div className="hidden lg:block">
          <div className="container-luxury py-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-playfair text-4xl font-bold text-espresso mb-8"
            >
              My Account
            </motion.h1>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Desktop sidebar */}
              <div className="lg:col-span-1">
                <nav className="flex flex-col gap-1">
                  {accountLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-inter transition-all',
                          isActive
                            ? 'bg-espresso text-pearl font-medium shadow-sm'
                            : 'text-espresso-300 hover:bg-pearl-200 hover:text-espresso'
                        )}
                      >
                        <link.icon className="w-4 h-4 shrink-0" />
                        {link.label}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
                      </Link>
                    );
                  })}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-inter text-red-500 hover:bg-red-50 transition-all mt-4"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign Out
                  </button>
                </nav>
              </div>

              {/* Desktop content */}
              <div className="lg:col-span-3 min-w-0">
                {children}
              </div>
            </div>
          </div>
        </div>

      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
