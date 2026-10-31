import React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  helperText,
  errorMessage,
  className,
  children,
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full font-sans', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-xs font-bold uppercase tracking-wider text-[#211b15] flex items-center gap-1"
        >
          {label}
          {required && <span className="text-[#e8b672] font-bold" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {errorMessage ? (
        <p className="text-xs text-[#b83a2b] font-medium">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-[#96897b]">{helperText}</p>
      ) : null}
    </div>
  );
};
