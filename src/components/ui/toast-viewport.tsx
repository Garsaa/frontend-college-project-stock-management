import { useEffect } from 'react';

import { CheckCircle2, CircleAlert, Info } from 'lucide-react';

import { useToastStore, type ToastItem, type ToastTone } from '@/store/toast-store';
import { cn } from '@/utils/cn';

const toneClasses: Record<ToastTone, string> = {
  success: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
  error: 'border-rose-200 bg-rose-50/95 text-rose-900',
  info: 'border-amber-200 bg-amber-50/95 text-amber-900',
};

const toneIcons = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
} satisfies Record<ToastTone, typeof CheckCircle2>;

function ToastCard({ toast }: { toast: ToastItem }) {
  const removeToast = useToastStore((state) => state.removeToast);
  const Icon = toneIcons[toast.tone];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      removeToast(toast.id);
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [removeToast, toast.id]);

  return (
    <div
      className={cn(
        'w-full rounded-2xl border px-4 py-3 shadow-[0_18px_40px_-28px_rgba(41,24,17,0.55)] backdrop-blur',
        toneClasses[toast.tone],
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description ? <p className="mt-1 text-sm opacity-85">{toast.description}</p> : null}
        </div>
      </div>
    </div>
  );
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastCard toast={toast} />
        </div>
      ))}
    </div>
  );
}
