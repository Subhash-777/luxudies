// ============================================
// LUXUDIES - Header Component
// ============================================

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { cn } from '@/lib/utils';
import AnnouncementBar from './announcement-bar';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/shop', label: 'SHOP ALL' },
  { href: '/shop/new-arrivals', label: 'NEW ARRIVALS' },
  { href: '/shop/bestsellers', label: 'BESTSELLERS' },
  { href: '/shop/combo-offers', label: 'COMBO OFFERS' },
  { href: '/shop/gift-sets', label: 'GIFT SETS' },
  { href: '/about', label: 'ABOUT US' },
  { href: '/reviews', label: 'REVIEWS' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-500',
          isScrolled
            ? 'shadow-soft border-b border-gold-400/20'
            : 'border-b border-transparent'
        )}
        style={{
          background: isScrolled ? 'rgba(247, 243, 238, 0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none'
        }}
      >
        <div className="container-luxury relative">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            
            {/* Left: Mobile Menu Trigger (Desktop hidden) */}
            <div className="flex items-center w-1/3 lg:w-auto lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-espresso hover:text-gold-500 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Center (Mobile) / Left (Desktop): Logo */}
            <div className="flex justify-center w-1/3 lg:w-auto lg:justify-start">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/brand/logo.jpg"
                  alt="LUXUDIES"
                  width={40}
                  height={40}
                  className="rounded-full border border-gold-400/20 hidden sm:block"
                  priority
                />
                <span className="font-playfair text-xl sm:text-2xl font-bold tracking-wide text-espresso">
                  LUXUDIES
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-2 lg:gap-4 px-4">
              {navLinks.slice(0, 6).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2 py-2 text-[11px] font-inter font-medium tracking-[0.08em] text-espresso-300 hover:text-gold-500 transition-colors relative group whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gold-400 transition-all duration-300 group-hover:w-3/4 rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center justify-end w-1/3 lg:w-auto gap-1 sm:gap-2">
              
              {/* Expanding Search Bar */}
              <div className="relative flex items-center justify-end">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="overflow-hidden absolute right-8 top-1/2 -translate-y-1/2"
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-pearl-100 border border-gold-400/20 rounded-full py-1.5 px-4 text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/50"
                        onBlur={() => setIsSearchOpen(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-espresso hover:text-gold-500 transition-colors hidden sm:flex z-10 relative"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              <Link
                href="/account/wishlist"
                className="p-2 text-espresso hover:text-gold-500 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gold-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="p-2 text-espresso hover:text-gold-500 transition-colors hidden sm:flex"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={openCart}
                className="p-2 text-espresso hover:text-gold-500 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 w-4 h-4 bg-gold-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-pearl z-50 lg:hidden shadow-elevated overflow-y-auto"
            >
              <div className="p-5">
                {/* Close + Logo */}
                <div className="flex items-center justify-between mb-8">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Image
                      src="/images/brand/logo.jpg"
                      alt="LUXUDIES"
                      width={36}
                      height={36}
                      className="rounded-full border border-gold-400/20"
                    />
                    <span className="font-playfair text-lg font-bold text-espresso">
                      LUXUDIES
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-espresso-300 hover:text-espresso"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-3 px-3 text-sm font-inter font-medium text-espresso-400 hover:text-gold-500 hover:bg-ivory-50 rounded-xl transition-all"
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4 text-espresso-100" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Divider */}
                <div className="my-6 border-t border-gold-400/10" />

                {/* Quick Links */}
                <div className="space-y-1">
                  {[
                    { href: '/track-order', label: 'Track Order' },
                    { href: '/faq', label: 'FAQ' },
                    { href: '/contact', label: 'Contact Us' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center py-2.5 px-3 text-sm font-inter text-espresso-200 hover:text-gold-500 rounded-xl transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
