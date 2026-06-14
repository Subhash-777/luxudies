// ============================================
// LUXUDIES - Mobile Navigation (Mobile-First)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Close the cart drawer when navigating to any non-cart tab on mobile
  const handleNavClick = () => {
    closeCart();
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/shop', icon: Grid, label: 'Shop' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '#cart', icon: ShoppingBag, label: 'Bag', action: openCart },
    { href: '/account', icon: User, label: 'You' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-pearl/90 backdrop-blur-[20px] border-t border-gold-400/15"
        style={{ WebkitBackdropFilter: 'blur(20px)' }}
      />
      
      <nav className="relative flex items-center justify-around h-[60px] px-1">
        {navItems.map((item) => {
          const isActive = item.href === '#cart'
            ? false
            : pathname === item.href || (pathname.startsWith('/shop') && item.href === '/shop') || (pathname.startsWith('/search') && item.href === '/search');
          const Icon = item.icon;

          const content = (
            <div className="flex flex-col items-center gap-0.5">
              <div className="relative">
                <Icon className={`w-[20px] h-[20px] transition-colors ${isActive ? 'text-gold-500' : 'text-espresso-200'}`} />
                {item.action && mounted && cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-gold-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </div>
              <span className={`text-[10px] font-inter font-medium transition-colors ${isActive ? 'text-gold-500' : 'text-espresso-200'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-dot"
                  className="w-1 h-1 rounded-full bg-gold-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          );

          // Cart tab: just open cart (no close-on-click needed)
          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="relative flex items-center justify-center w-full h-full"
              >
                {content}
              </button>
            );
          }

          // All other tabs: close the cart drawer first, then navigate
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleNavClick}
              className="relative flex items-center justify-center w-full h-full"
            >
              {content}
            </Link>
          );
        })}
      </nav>
      {/* Safe area for iPhones with home bar */}
      <div className="bg-pearl/90" style={{ height: 'env(safe-area-inset-bottom)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} />
    </div>
  );
}
