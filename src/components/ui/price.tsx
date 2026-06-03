// ============================================
// LUXUDIES - Price Display Component
// ============================================

import { cn, formatPrice, getDiscountPercent } from '@/lib/utils';

interface PriceProps {
  price: number;
  compareAtPrice?: number | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSavings?: boolean;
  className?: string;
}

export default function Price({
  price,
  compareAtPrice,
  size = 'md',
  showSavings = false,
  className,
}: PriceProps) {
  const discount = compareAtPrice ? getDiscountPercent(price, compareAtPrice) : 0;

  const sizes = {
    sm: { price: 'text-sm', compare: 'text-xs', badge: 'text-[10px] px-1.5 py-0.5' },
    md: { price: 'text-lg', compare: 'text-sm', badge: 'text-xs px-2 py-0.5' },
    lg: { price: 'text-2xl', compare: 'text-base', badge: 'text-sm px-2.5 py-1' },
    xl: { price: 'text-3xl', compare: 'text-lg', badge: 'text-sm px-3 py-1' },
  };

  return (
    <div className={cn('flex items-center flex-wrap gap-2', className)}>
      <span className={cn('font-inter font-bold text-espresso', sizes[size].price)}>
        {formatPrice(price)}
      </span>

      {compareAtPrice && compareAtPrice > price && (
        <>
          <span
            className={cn(
              'font-inter text-espresso-200 line-through',
              sizes[size].compare
            )}
          >
            {formatPrice(compareAtPrice)}
          </span>

          <span
            className={cn(
              'font-inter font-semibold text-green-700 bg-green-50 rounded-full',
              sizes[size].badge
            )}
          >
            {discount}% OFF
          </span>
        </>
      )}

      {showSavings && compareAtPrice && compareAtPrice > price && (
        <span className="text-xs text-green-600 font-medium w-full">
          You save {formatPrice(compareAtPrice - price)}
        </span>
      )}
    </div>
  );
}
