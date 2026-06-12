// ============================================
// LUXUDIES - Header Component (Mobile-First)
// ============================================

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  TrendingUp,
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
];

const trendingSearches = ['Necklace', 'Gold Hoops', 'Bracelet', 'Pearl Earrings', 'Gift Set'];

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    document.body.style.overflow = isMobileMenuOpen || isSearchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen, isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    if (isSearchOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSearchOpen]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

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
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[72px]">
            
            {/* Left: Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 -ml-1.5 text-espresso hover:text-gold-500 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center lg:justify-start lg:flex-none">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/brand/logo.jpg"
                  alt="LUXUDIES"
                  width={36}
                  height={36}
                  className="rounded-full border border-gold-400/20 hidden sm:block"
                  priority
                />
                <span className="font-playfair text-lg sm:text-xl lg:text-2xl font-bold tracking-wide text-espresso">
                  LUXUDIES
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-2 lg:gap-4 px-4">
              {navLinks.map((link) => (
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

            {/* Right: Actions — only Wishlist + Cart on mobile */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              
              {/* Search — desktop only (mobile has bottom nav search) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex p-2 text-espresso hover:text-gold-500 transition-colors relative group"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="p-1.5 sm:p-2 text-espresso hover:text-gold-500 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gold-400 text-white text-[8px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account — desktop only */}
              <Link
                href="/account"
                className="hidden sm:flex p-2 text-espresso hover:text-gold-500 transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="p-1.5 sm:p-2 text-espresso hover:text-gold-500 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                {mounted && cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gold-400 text-white text-[8px] sm:text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================= */}
      {/* Full-Screen Search Overlay */}
      {/* ========================================= */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col"
          >
            <div
              className="absolute inset-0 bg-espresso/60 backdrop-blur-xl"
              style={{ WebkitBackdropFilter: 'blur(20px)' }}
              onClick={() => setIsSearchOpen(false)}
            />

            <div className="relative z-10 flex flex-col items-center justify-start pt-[15vh] sm:pt-[20vh] px-4 w-full">
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-6 right-6 p-3 text-pearl/70 hover:text-pearl transition-colors rounded-full hover:bg-white/10"
                aria-label="Close search"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-inter text-xs font-semibold text-gold-400 uppercase tracking-[0.2em] mb-6"
              >
                Search LUXUDIES
              </motion.p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                onSubmit={handleSearchSubmit}
                className="w-full max-w-xl"
              >
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-pearl/40 group-focus-within:text-gold-400 transition-colors" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="w-full h-14 sm:h-16 pl-14 pr-14 bg-white/10 border border-white/20 rounded-2xl text-base sm:text-lg font-inter text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-gold-400/60 focus:bg-white/15 focus:ring-1 focus:ring-gold-400/30 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gold-400 hover:bg-gold-500 text-white rounded-xl transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-gold-400/60" />
                  <span className="text-[10px] font-inter font-semibold text-pearl/40 uppercase tracking-[0.15em]">
                    Trending
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="px-4 py-2 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-gold-400/30 text-sm font-inter text-pearl/60 hover:text-pearl rounded-full transition-all duration-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-pearl z-50 lg:hidden shadow-elevated overflow-y-auto"
            >
              <div className="p-5">
                {/* Close + Logo */}
                <div className="flex items-center justify-between mb-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Image
                      src="/images/brand/logo.jpg"
                      alt="LUXUDIES"
                      width={32}
                      height={32}
                      className="rounded-full border border-gold-400/20"
                    />
                    <span className="font-playfair text-base font-bold text-espresso">
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

                {/* Mobile Search Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      setIsMobileMenuOpen(false);
                      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery('');
                    }
                  }}
                  className="mb-5"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search jewelry..."
                      className="w-full h-10 pl-10 pr-4 bg-pearl-200 border border-gold-400/10 rounded-xl text-sm font-inter text-espresso placeholder:text-espresso-100 focus:outline-none focus:border-gold-400/30 transition-colors"
                    />
                  </div>
                </form>

                {/* Nav Links */}
                <nav className="space-y-0.5">
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

                <div className="my-5 border-t border-gold-400/10" />

                <div className="space-y-0.5">
                  {[
                    { href: '/about', label: 'About Us' },
                    { href: '/reviews', label: 'Reviews' },
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
