// ============================================
// LUXUDIES - Announcement Bar
// ============================================

'use client';

import { Truck, Shield, Banknote } from 'lucide-react';

const announcements = [
  { icon: Truck, text: 'FREE SHIPPING ACROSS TAMIL NADU' },
  { icon: Shield, text: 'ANTI-TARNISH  |  WATER & SWEAT RESISTANT' },
  { icon: Banknote, text: 'COD AVAILABLE  |  EASY RETURNS' },
];

export default function AnnouncementBar() {
  return (
    <div className="bg-espresso text-pearl overflow-hidden h-9 flex items-center relative z-50">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...announcements, ...announcements, ...announcements].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 mx-8 text-[11px] sm:text-xs font-inter tracking-wider"
          >
            <item.icon className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
