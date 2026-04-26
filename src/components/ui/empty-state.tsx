import type { ReactNode } from 'react';

import { Store } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="surface-card flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-100 text-[#8B5E34]">
        <Store className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[#3A2416]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#7C6555]">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
