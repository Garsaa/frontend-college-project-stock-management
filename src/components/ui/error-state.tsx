import { TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Nao foi possivel carregar os dados',
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="surface-card flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 text-rose-700">
        <TriangleAlert className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[#3A2416]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#7C6555]">{description}</p>
      {onRetry ? (
        <Button variant="secondary" className="mt-6" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
