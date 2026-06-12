// ============================================
// LUXUDIES - Account Layout
// ============================================

'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, LogOut, Settings } from 'lucide-react';
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
        <div className="container-luxury py-6 lg:py-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-3xl lg:text-4xl font-bold text-espresso mb-8"
          >
            My Account
          </motion.h1>

          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Horizontal scroll on mobile, vertical on desktop */}
              <nav className="flex lg:flex-col overflow-x-auto scrollbar-hide gap-3 lg:gap-1 pb-4 lg:pb-0">
                {accountLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-2.5 px-5 lg:px-4 py-3 lg:py-2.5 rounded-full lg:rounded-xl text-sm font-inter whitespace-nowrap transition-all shrink-0',
                        isActive
                          ? 'bg-espresso text-pearl font-medium shadow-md'
                          : 'bg-pearl-200 lg:bg-transparent text-espresso-300 hover:bg-pearl-300'
                      )}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 px-5 lg:px-4 py-3 lg:py-2.5 rounded-full lg:rounded-xl text-sm font-inter text-red-500 hover:bg-red-50 transition-all whitespace-nowrap shrink-0 lg:mt-4 bg-red-50/50 lg:bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {children}
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
