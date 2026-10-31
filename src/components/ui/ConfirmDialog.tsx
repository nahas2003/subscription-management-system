import React from 'react';
import { Button } from './Button';
import { AlertCircle, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="relative w-full max-w-md rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl animate-in zoom-in-95">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-[#50463c] hover:text-[#211b15] disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[3.75px] ${
              variant === 'danger'
                ? 'bg-[#fcedeb] text-[#b83a2b]'
                : 'bg-[#fdf6ed] text-[#e8b672]'
            }`}
          >
            <AlertCircle className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 id="dialog-title" className="text-base font-bold text-[#211b15]">
              {title}
            </h3>
            <p className="mt-1 text-sm text-[#50463c] leading-relaxed">{description}</p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                size="md"
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
