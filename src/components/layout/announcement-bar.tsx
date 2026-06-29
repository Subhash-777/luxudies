// ============================================
// LUXUDIES - Announcement Bar
// ============================================

'use client';

import { useStoreSettings } from '@/hooks/useStoreSettings';

export default function AnnouncementBar() {
  const { settings } = useStoreSettings();
  const announcements = settings.announcement_quotes.filter(q => q.trim());

  if (announcements.length === 0) return null;

  return (
    <div className="bg-pearl-100 border-b border-gold-400/20 text-espresso text-[11px] font-inter font-medium tracking-widest uppercase overflow-hidden whitespace-nowrap h-8 flex items-center">
      <div className="animate-[marquee_20s_linear_infinite] flex items-center min-w-full">
        {/* Repeat array twice for seamless marquee loop */}
        {[...announcements, ...announcements].map((text, i) => (
          <div key={i} className="flex items-center">
            <span className="px-6">{text}</span>
            <span className="w-1 h-1 rounded-full bg-gold-400 mx-2 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
