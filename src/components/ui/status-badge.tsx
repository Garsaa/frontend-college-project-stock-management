import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

type StatusTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface StatusBadgeProps {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
}

const toneClasses: Record<StatusTone, string> = {
  default: 'bg-orange-100 text-[#5E4330]',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-rose-100 text-rose-800',
  info: 'bg-cyan-100 text-cyan-800',
};

export function StatusBadge({
  children,
  tone = 'default',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-[0.02em]',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
