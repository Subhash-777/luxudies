// ============================================
// LUXUDIES - Announcement Bar
// ============================================

'use client';

export default function AnnouncementBar() {
  const announcements = [
    "Free shipping on orders above ₹999",
    "Extra 10% off on your first order — Use code LUXE10",
    "18K Gold Plated • Anti-Tarnish • Premium Quality"
  ];

  return (
    <div className="bg-pearl-100 border-b border-gold-400/20 text-espresso text-[11px] font-inter font-medium tracking-widest uppercase overflow-hidden whitespace-nowrap h-8 flex items-center">
      <div className="animate-[marquee_20s_linear_infinite] flex items-center min-w-full">
        {/* Repeat array twice for seamless marquee loop */}
        {[...announcements, ...announcements].map((text, i) => (
          <div key={i} className="flex items-center">
            <span className="px-6">{text}</span>
            <span className="w-1 h-1 rounded-full bg-gold-400 mx-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
