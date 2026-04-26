import { LoaderCircle } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({
  title = 'Carregando dados',
  description = 'Aguarde enquanto a tela prepara as informacoes do estoque da padaria.',
}: LoadingStateProps) {
  return (
    <div className="surface-card flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-700">
        <LoaderCircle className="h-7 w-7 animate-spin" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[#3A2416]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#7C6555]">{description}</p>
    </div>
  );
}
