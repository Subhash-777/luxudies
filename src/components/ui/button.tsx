// ============================================
// LUXUDIES - Button Component
// ============================================

'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-inter font-medium transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-pearl';

    const variants = {
      primary:
        'bg-gradient-to-r from-gold-400 to-gold-500 text-white shadow-gold hover:shadow-gold-lg hover:from-gold-500 hover:to-gold-600 active:scale-[0.98]',
      secondary:
        'bg-espresso text-pearl hover:bg-espresso-400 active:scale-[0.98] shadow-soft',
      ghost:
        'bg-transparent text-espresso hover:bg-pearl-300/50 active:bg-pearl-400/50',
      outline:
        'bg-transparent border border-gold-400 text-gold-500 hover:bg-gold-50 hover:border-gold-500 active:scale-[0.98]',
      link: 'bg-transparent text-gold-500 hover:text-gold-600 underline-offset-4 hover:underline p-0 h-auto',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-[10px] gap-1.5',
      md: 'h-11 px-6 text-sm rounded-[12px] gap-2',
      lg: 'h-12 px-8 text-base rounded-[14px] gap-2.5',
      xl: 'h-14 px-10 text-base rounded-[16px] gap-3',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: variant === 'link' ? 1 : 0.97 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {/* Shimmer overlay for primary */}
        {variant === 'primary' && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
        )}

        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {!isLoading && icon && iconPosition === 'left' && (
          <span className="shrink-0">{icon}</span>
        )}

        <span className="relative z-10">{children}</span>

        {!isLoading && icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
