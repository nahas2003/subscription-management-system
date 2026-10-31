import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error = false, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-[#50463c]">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            'h-10 w-full rounded-[3.75px] border bg-white px-3 py-2 text-sm text-[#211b15] placeholder:text-[#96897b] font-sans transition-all',
            'focus:outline-none focus:ring-2 focus:ring-[#e8b672]/20 focus:border-[#e8b672] disabled:cursor-not-allowed disabled:bg-[#efe9e0] disabled:text-[#96897b]',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error
              ? 'border-[#b83a2b] focus:border-[#b83a2b] focus:ring-[#b83a2b]/20'
              : 'border-[#c7bcaf]',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-[#50463c]">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
