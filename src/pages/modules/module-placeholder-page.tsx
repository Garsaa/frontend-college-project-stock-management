import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';

interface ModulePlaceholderPageProps {
  moduleName: string;
}

export function ModulePlaceholderPage({ moduleName }: ModulePlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Modulo habilitado"
        title={moduleName}
        description="A navegacao ja esta pronta. Esta tela fica preparada para voce plugar o conteudo real do modulo quando quiser expandir o sistema."
      />

      <Card className="overflow-hidden">
        <div className="grid gap-8 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              <Sparkles className="h-4 w-4" />
              Placeholder pronto para evoluir
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#3A2416]">
              Estrutura consistente com o restante
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7C6555] sm:text-base">
              Mantive o mesmo shell visual, a troca de modulos e a navegacao lateral prontos para
              que os outros dominios crescam sem retrabalho.
            </p>
            <div className="mt-6">
              <Link to="/inventory/items">
                <Button trailingIcon={<ArrowUpRight className="h-4 w-4" />}>
                  Voltar para Estoque
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-orange-100 bg-orange-50/70 p-6">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              Proximo passo
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-[#7C6555]">
              <li>Definir os links reais do modulo no seletor superior.</li>
              <li>Manter o padrao de `pages`, `routes`, `services` e `components`.</li>
              <li>Conectar o backend correspondente quando ele existir.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
