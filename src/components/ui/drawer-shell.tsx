import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface DrawerShellProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

export function DrawerShell({
  open,
  title,
  description,
  onClose,
  children,
}: DrawerShellProps) {
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
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-[#2A1911]/35 backdrop-blur-sm"
        aria-label="Fechar painel lateral"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-2xl border-l border-white/30 bg-white shadow-[0_24px_90px_-28px_rgba(41,24,17,0.65)]">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-6 py-5">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-orange-700">
                Painel detalhado
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

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
