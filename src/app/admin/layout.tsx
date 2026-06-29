// ============================================
// LUXUDIES - Admin Layout (Mobile-Optimized)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Image as ImageIcon,
  Percent, Settings, Menu, X, LogOut, Home, Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const adminLinks = [
  { href: '/admin',           label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products',  label: 'Products',  icon: Package },
  { href: '/admin/orders',    label: 'Orders',    icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/banners',   label: 'Banners',   icon: ImageIcon },
  { href: '/admin/combos',    label: 'Combos',    icon: Percent },
  { href: '/admin/settings',  label: 'Settings',  icon: Settings },
];

// Bottom nav shows only the 4 most important links on mobile
const mobileBottomLinks = [
  { href: '/admin',           label: 'Home',     icon: LayoutDashboard },
  { href: '/admin/orders',    label: 'Orders',   icon: ShoppingBag },
  { href: '/admin/products',  label: 'Products', icon: Package },
  { href: '/admin/settings',  label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const supabase = createClient();

  // Fetch pending order count for badge
  useEffect(() => {
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count }) => setPendingCount(count || 0));
  }, []);

  const SidebarLink = ({
    href, label, icon: Icon, onClick,
  }: { href: string; label: string; icon: any; onClick?: () => void }) => {
    const isActive = pathname === href;
    const showBadge = href === '/admin/orders' && pendingCount > 0;
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-inter transition-all relative',
          isActive
            ? 'bg-amber-400 text-gray-900 font-semibold'
            : 'text-white/60 hover:bg-white/8 hover:text-white'
        )}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1">{label}</span>
        {showBadge && (
          <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold font-inter flex items-center justify-center flex-shrink-0">
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Mobile Header ──────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-40 bg-gray-900 text-white flex items-center justify-between px-4 h-14 shadow-md">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-playfair font-bold text-base tracking-wide">LUXUDIES Admin</span>
        <div className="flex items-center gap-1">
          {pendingCount > 0 && (
            <Link href="/admin/orders" className="relative p-2">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            </Link>
          )}
          <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* ── Desktop Sidebar ────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 z-30">
          {/* Brand */}
          <div className="px-6 py-5 border-b border-white/8">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/brand/logo.jpg"
                alt="LUXUDIES"
                width={36} height={36}
                className="rounded-xl ring-2 ring-amber-400/30"
              />
              <div>
                <span className="font-playfair font-bold text-lg tracking-wide">LUXUDIES</span>
                <p className="text-[10px] text-white/40 tracking-widest uppercase">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 py-4 px-3 space-y-0.5">
            {adminLinks.map((link) => (
              <SidebarLink key={link.href} {...link} />
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/8 space-y-1">
            <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-inter text-white/40 hover:bg-white/8 hover:text-white transition-all">
              <LogOut className="w-4 h-4" /> Back to Store
            </Link>
          </div>
        </aside>

        {/* ── Mobile Sidebar Drawer ──────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-gray-900 text-white z-50 lg:hidden flex flex-col shadow-2xl"
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                  <div className="flex items-center gap-3">
                    <Image src="/images/brand/logo.jpg" alt="LUXUDIES" width={32} height={32} className="rounded-xl" />
                    <span className="font-playfair font-bold">LUXUDIES</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Nav */}
                <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                  {adminLinks.map((link) => (
                    <SidebarLink key={link.href} {...link} onClick={() => setSidebarOpen(false)} />
                  ))}
                </nav>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-white/8">
                  <Link href="/"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-inter text-white/40 hover:bg-white/8 hover:text-white transition-all">
                    <LogOut className="w-4 h-4" /> Back to Store
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main Content ──────────────────────────────────── */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            {children}
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ───────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom">
        <div className="grid grid-cols-4 h-16">
          {mobileBottomLinks.map((link) => {
            const isActive = pathname === link.href;
            const showBadge = link.href === '/admin/orders' && pendingCount > 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 transition-colors relative',
                  isActive ? 'text-amber-600' : 'text-gray-400 hover:text-gray-700'
                )}
              >
                <div className="relative">
                  <link.icon className="w-5 h-5" />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-inter font-medium">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavActive"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
