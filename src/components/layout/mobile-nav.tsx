// ============================================
// LUXUDIES - Mobile Navigation (Redesigned)
// ============================================

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/shop', icon: Grid, label: 'Shop' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '#cart', icon: ShoppingBag, label: 'Cart', action: openCart },
    { href: '/account', icon: User, label: 'Account' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Mobile Nav Background - Pearl White with Blur */}
      <div 
        className="absolute inset-0 bg-pearl-50/80 backdrop-blur-[16px] border-t border-gold-400/20"
        style={{ WebkitBackdropFilter: 'blur(16px)' }}
      />
      
      <nav className="relative flex items-center justify-around h-16 px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith('/shop') && item.href === '/shop');
          const Icon = item.icon;

          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="relative flex flex-col items-center justify-center w-full h-full text-espresso-200 hover:text-gold-500 transition-colors group"
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-gold-500 fill-gold-500/20' : ''}`} />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-antique text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute bottom-1.5 w-1 h-1 rounded-full bg-gold-500"
                  />
                )}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full text-espresso-200 hover:text-gold-500 transition-colors"
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-gold-500 fill-gold-500/20' : ''}`} />
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute bottom-1.5 w-1 h-1 rounded-full bg-gold-500"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
