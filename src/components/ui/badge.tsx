// ============================================
// LUXUDIES - Badge Component
// ============================================

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'new' | 'bestseller' | 'combo' | 'sale' | 'limited' | 'default';
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}

export default function Badge({
  variant = 'default',
  size = 'sm',
  className,
  children,
}: BadgeProps) {
  const variants = {
    new: 'bg-gradient-to-r from-gold-400 to-gold-500 text-white',
    bestseller: 'bg-espresso text-pearl',
    combo: 'bg-gradient-to-r from-gold-500 to-antique text-white',
    sale: 'bg-red-500 text-white',
    limited: 'bg-gradient-to-r from-espresso-400 to-espresso text-pearl',
    default: 'bg-pearl-300 text-espresso-400',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-inter font-semibold uppercase tracking-wider rounded-full whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
