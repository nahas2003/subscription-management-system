import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium font-sans rounded-[3.75px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#e8b672] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      // Primary CTA: Honey Amber fill, Ink dark text with warm press
      primary:
        'bg-[#e8b672] text-[#211b15] font-semibold hover:bg-[#dba35c] shadow-sm hover:shadow-ambrook-btn active:bg-[#c9944d] border border-[#d6a562]',
      // Secondary: Bone soft surface with Loam border
      secondary:
        'bg-[#efe9e0] border border-[#c7bcaf] text-[#211b15] hover:bg-[#e4dcce] hover:border-[#b4a696]',
      // Outline: Pure white with Loam border
      outline:
        'border border-[#c7bcaf] bg-white text-[#211b15] hover:bg-[#efe9e0] hover:border-[#211b15]',
      // Ghost: Saddle text with Bone hover
      ghost:
        'text-[#50463c] hover:text-[#211b15] hover:bg-[#efe9e0]',
      // Danger: Deep terracotta
      danger:
        'bg-[#b83a2b] text-white hover:bg-[#9e2e21] active:bg-[#85251a]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
