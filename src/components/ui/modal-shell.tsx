import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ModalShellProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function ModalShell({
  open,
  title,
  description,
  onClose,
  children,
  footer,
}: ModalShellProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#2A1911]/40 backdrop-blur-sm"
        aria-label="Fechar modal"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/30 bg-white shadow-[0_30px_90px_-38px_rgba(41,24,17,0.7)]">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-6 py-5">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
              Fluxo operacional
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#3A2416]">{title}</h2>
            {description ? <p className="mt-2 text-sm text-[#7C6555]">{description}</p> : null}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-2xl"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-orange-100 bg-orange-50/60 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
