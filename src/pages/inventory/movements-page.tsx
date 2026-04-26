import { useDeferredValue, useEffect, useState } from 'react';
import { Funnel, RefreshCcw, Search } from 'lucide-react';

import type { MovementOperation } from '@/contract/inventory';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { StatusBadge } from '@/components/ui/status-badge';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useInventoryMovements } from '@/hooks/use-inventory-movements';
import {
  formatDateTime,
  formatInteger,
  formatItemType,
  formatOperation,
} from '@/utils/format';

const PAGE_SIZE = 12;

export function MovementsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [operationFilter, setOperationFilter] = useState<'all' | MovementOperation>('all');
  const deferredSearch = useDeferredValue(searchInput);
  const searchTerm = useDebouncedValue(deferredSearch.trim().toLowerCase(), 180);
  const [page, setPage] = useState(1);

  const { movements, loading, error, reload } = useInventoryMovements();

  useEffect(() => {
    setPage(1);
  }, [operationFilter, searchTerm]);

  const filteredMovements = movements.filter((movement) => {
    const matchesOperation =
      operationFilter === 'all' ? true : movement.operation === operationFilter;
    const haystack =
      `${movement.item_code} ${movement.item_name} ${movement.item_type} ${movement.note}`.toLowerCase();
    const matchesSearch = searchTerm ? haystack.includes(searchTerm) : true;

    return matchesOperation && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredMovements.length / PAGE_SIZE));
  const pagedMovements = filteredMovements.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const inboundCount = filteredMovements.filter((movement) => movement.operation === 'inbound').length;
  const outboundCount = filteredMovements.filter((movement) => movement.operation === 'outbound').length;
  const totalVolume = filteredMovements.reduce((sum, movement) => sum + movement.quantity, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Rastreabilidade"
        title="Historico de movimentos"
        description="Consolide entradas de mercadoria, reposicoes de insumos e saidas para producao ou venda em uma unica linha do tempo do estoque."
        actions={
          <>
            <label className="relative min-w-[280px] flex-1 lg:flex-none">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B28A72]" />
              <input
                className="h-11 w-full rounded-2xl border border-orange-100 bg-white pl-11 pr-4 text-sm text-[#3A2416] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                placeholder="Buscar por item, tipo ou observacao..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </label>

            <label className="relative min-w-[220px]">
              <Funnel className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B28A72]" />
              <select
                className="h-11 w-full rounded-2xl border border-orange-100 bg-white pl-11 pr-10 text-sm text-[#3A2416] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                value={operationFilter}
                onChange={(event) =>
                  setOperationFilter(event.target.value as 'all' | MovementOperation)
                }
              >
                <option value="all">Todas as operacoes</option>
                <option value="inbound">Somente entradas</option>
                <option value="outbound">Somente saidas</option>
              </select>
            </label>

            <Button variant="secondary" leadingIcon={<RefreshCcw className="h-4 w-4" />} onClick={reload}>
              Atualizar
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
            Movimentos filtrados
          </p>
          <p className="mt-4 text-3xl font-semibold text-[#3A2416]">{formatInteger(filteredMovements.length)}</p>
        </Card>
        <Card className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
            Entradas
          </p>
          <p className="mt-4 text-3xl font-semibold text-[#3A2416]">{formatInteger(inboundCount)}</p>
        </Card>
        <Card className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
            Saidas
          </p>
          <p className="mt-4 text-3xl font-semibold text-[#3A2416]">{formatInteger(outboundCount)}</p>
        </Card>
        <Card className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
            Volume movimentado
          </p>
          <p className="mt-4 text-3xl font-semibold text-[#3A2416]">{formatInteger(totalVolume)}</p>
        </Card>
      </div>

      {loading ? (
        <LoadingState
          title="Lendo historico"
          description="Buscando todos os movimentos registrados na API online."
        />
      ) : null}

      {!loading && error ? <ErrorState description={error} onRetry={reload} /> : null}

      {!loading && !error && filteredMovements.length === 0 ? (
        <EmptyState
          title="Nenhum movimento para exibir"
          description="Ajuste os filtros locais ou registre entradas e saidas na tela de itens para popular este historico."
        />
      ) : null}

      {!loading && !error && filteredMovements.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-[#3A2416]">Linha do tempo operacional</h2>
              <p className="text-sm text-[#7C6555]">
                Ordenacao mais recente primeiro, com filtros e paginação locais no frontend.
              </p>
            </div>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-orange-100 bg-orange-50/70 text-left text-xs uppercase tracking-[0.18em] text-[#8B5E34]">
                  <th className="px-5 py-4">Data</th>
                  <th className="px-5 py-4">Operacao</th>
                  <th className="px-5 py-4">Codigo</th>
                  <th className="px-5 py-4">Item</th>
                  <th className="px-5 py-4">Tipo</th>
                  <th className="px-5 py-4">Quantidade</th>
                  <th className="px-5 py-4">Observacao</th>
                </tr>
              </thead>
              <tbody>
                {pagedMovements.map((movement) => (
                  <tr key={movement.id} className="border-b border-orange-50 last:border-b-0">
                    <td className="px-5 py-4 text-sm text-[#7C6555]">{formatDateTime(movement.created_at)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={movement.operation === 'inbound' ? 'success' : 'warning'}>
                        {formatOperation(movement.operation)}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#3A2416]">{movement.item_code}</td>
                    <td className="px-5 py-4 text-sm text-[#7C6555]">{movement.item_name}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone="info">{formatItemType(movement.item_type)}</StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#3A2416]">{formatInteger(movement.quantity)}</td>
                    <td className="px-5 py-4 text-sm text-[#7C6555]">{movement.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 px-4 py-4 lg:hidden">
            {pagedMovements.map((movement) => (
              <div key={movement.id} className="rounded-[24px] border border-orange-100 bg-white px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#3A2416]">{movement.item_name}</p>
                    <p className="mt-1 text-sm text-[#7C6555]">
                      {movement.item_code} | {formatDateTime(movement.created_at)}
                    </p>
                  </div>
                  <StatusBadge tone={movement.operation === 'inbound' ? 'success' : 'warning'}>
                    {formatOperation(movement.operation)}
                  </StatusBadge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#7C6555]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#B28A72]">Tipo</p>
                    <p className="mt-2 font-semibold text-[#3A2416]">
                      {formatItemType(movement.item_type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#B28A72]">Quantidade</p>
                    <p className="mt-2 font-semibold text-[#3A2416]">{formatInteger(movement.quantity)}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-[#7C6555]">{movement.note}</p>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </Card>
      ) : null}
    </div>
  );
}
