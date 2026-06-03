// ============================================
// LUXUDIES - Mobile Bottom Navigation
// ============================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ShoppingCart, User, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/cart', label: 'Cart', icon: ShoppingCart, showBadge: true },
  { href: '/account', label: 'Account', icon: User },
  { href: '/account/orders', label: 'Orders', icon: Package },
];

export default function MobileNav() {
  const pathname = usePathname();
  const cartItemCount = useCartStore((s) => s.getItemCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Gradient fade above nav */}
      <div className="h-6 bg-gradient-to-t from-pearl to-transparent pointer-events-none" />

      <div className="bg-pearl/90 backdrop-blur-xl border-t border-gold-400/10 shadow-[0_-4px_20px_rgba(180,156,110,0.08)] safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors relative min-w-[56px]',
                  isActive
                    ? 'text-gold-500'
                    : 'text-espresso-200 active:text-gold-400'
                )}
              >
                <div className="relative">
                  <item.icon
                    className={cn(
                      'w-5 h-5 transition-all',
                      isActive && 'stroke-[2.5]'
                    )}
                  />

                  {/* Cart badge */}
                  {item.showBadge && cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2 w-4 h-4 bg-gold-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </motion.span>
                  )}
                </div>

                <span className="text-[10px] font-inter font-medium tracking-wide">
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gold-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
