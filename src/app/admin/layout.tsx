// ============================================
// LUXUDIES - Admin Layout
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Image as ImageIcon,
  Percent, Settings, Menu, X, ChevronRight, LogOut, Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/combos', label: 'Combos', icon: Percent },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-pearl-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-espresso text-pearl flex items-center justify-between px-4 h-14">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-playfair font-bold text-lg">LUXUDIES Admin</span>
        <Link href="/" className="p-2 -mr-2">
          <Home className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-espresso text-pearl min-h-screen fixed left-0 top-0 z-30">
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/brand/logo.jpg" alt="LUXUDIES" width={36} height={36} className="rounded-full" />
              <div>
                <span className="font-playfair font-bold text-lg">LUXUDIES</span>
                <p className="text-[10px] text-pearl/60 tracking-wider">ADMIN PANEL</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-inter transition-all',
                    isActive
                      ? 'bg-gold-400 text-espresso font-semibold'
                      : 'text-pearl/70 hover:bg-white/5 hover:text-pearl'
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-inter text-pearl/50 hover:text-pearl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Back to Store
            </Link>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-espresso text-pearl z-50 lg:hidden"
              >
                <div className="p-5 flex items-center justify-between border-b border-white/10">
                  <span className="font-playfair font-bold">LUXUDIES Admin</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-pearl/60">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="py-4 px-3 space-y-1">
                  {adminLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-inter transition-all',
                          isActive
                            ? 'bg-gold-400 text-espresso font-semibold'
                            : 'text-pearl/70 hover:bg-white/5'
                        )}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                        <ChevronRight className="w-3 h-3 ml-auto" />
                      </Link>
                    );
                  })}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
