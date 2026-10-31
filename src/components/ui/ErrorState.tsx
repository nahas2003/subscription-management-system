import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-[7.5px] border border-[#e8b0a9] bg-[#fcedeb] p-6 text-center sm:p-8 font-sans',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-[3.75px] bg-white text-[#b83a2b] border border-[#e8b0a9] mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h3 className="text-base font-bold text-[#211b15]">{title}</h3>
      <p className="mt-1 text-sm text-[#8f2115] max-w-md">{message}</p>

      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Retry Action
          </Button>
        </div>
      )}
    </div>
  );
};
