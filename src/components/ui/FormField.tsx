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
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-slate-800 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500 text-xs font-bold" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {errorMessage ? (
        <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
