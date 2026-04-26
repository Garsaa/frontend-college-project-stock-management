import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import type { InventoryItemSummary } from '@/contract/inventory';
import { DeleteItemDialog } from '@/components/inventory/delete-item-dialog';
import { ItemDetailsDrawer } from '@/components/inventory/item-details-drawer';
import { ItemFormModal } from '@/components/inventory/item-form-modal';
import { StockChangeModal } from '@/components/inventory/stock-change-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { StatusBadge } from '@/components/ui/status-badge';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useInventoryItems } from '@/hooks/use-inventory-items';
import {
  formatCurrency,
  formatDateTime,
  formatInteger,
  formatItemType,
} from '@/utils/format';

type MovementContext = {
  kind: 'inbound' | 'outbound';
  item: InventoryItemSummary;
};

const PAGE_SIZE = 8;

export function ItemsPage() {
  const [searchInput, setSearchInput] = useState('');
  const deferredSearch = useDeferredValue(searchInput);
  const searchTerm = useDebouncedValue(deferredSearch.trim(), 280);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [detailsCode, setDetailsCode] = useState<string | null>(null);
  const [detailsRefreshToken, setDetailsRefreshToken] = useState(0);
  const [movementContext, setMovementContext] = useState<MovementContext | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItemSummary | null>(null);

  const { items, loading, error, reload } = useInventoryItems(searchTerm);

  useEffect(() => {
    startTransition(() => {
      setPage(1);
    });
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pagedItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.total_value, 0);
  const lowStockCount = items.filter((item) => item.quantity <= 5).length;

  function handleMutationSuccess(itemCode?: string) {
    reload();

    if (itemCode) {
      setDetailsCode(itemCode);
      if (detailsCode === itemCode) {
        setDetailsRefreshToken((current) => current + 1);
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Estoque da padaria"
        title="Produtos e insumos"
        description="Acompanhe farinha, fermento, recheios, embalagens, pães, bolos e demais itens operacionais em um painel unico de estoque."
        actions={
          <>
            <label className="relative min-w-[280px] flex-1 lg:flex-none">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B28A72]" />
              <input
                className="h-11 w-full rounded-2xl border border-orange-100 bg-white pl-11 pr-4 text-sm text-[#3A2416] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                placeholder="Buscar farinha, pao frances, recheio..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </label>
            <Button leadingIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
              Novo item
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
            Catalogo ativo
          </p>
          <p className="mt-4 text-3xl font-semibold text-[#3A2416]">{formatInteger(items.length)}</p>
        </Card>
        <Card className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
            Unidades no estoque
          </p>
          <p className="mt-4 text-3xl font-semibold text-[#3A2416]">{formatInteger(totalUnits)}</p>
        </Card>
        <Card className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
            Valor estimado
          </p>
          <p className="mt-4 text-3xl font-semibold text-[#3A2416]">{formatCurrency(totalValue)}</p>
        </Card>
        <Card className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
            Reposicao urgente
          </p>
          <p className="mt-4 text-3xl font-semibold text-[#3A2416]">{formatInteger(lowStockCount)}</p>
        </Card>
      </div>

      {loading ? <LoadingState /> : null}
      {!loading && error ? <ErrorState description={error} onRetry={reload} /> : null}

      {!loading && !error && items.length === 0 ? (
        <EmptyState
          title="Nenhum item encontrado"
          description="Cadastre insumos e produtos da padaria para começar a operar com o estoque centralizado."
          action={<Button onClick={() => setCreateOpen(true)}>Cadastrar primeiro item</Button>}
        />
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-[#3A2416]">Painel operacional</h2>
              <p className="text-sm text-[#7C6555]">
                Busca no backend e paginacao local para manter a navegacao leve no front.
              </p>
            </div>
            <Button variant="secondary" onClick={reload}>
              Atualizar lista
            </Button>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-orange-100 bg-orange-50/70 text-left text-xs uppercase tracking-[0.18em] text-[#8B5E34]">
                  <th className="px-5 py-4">Item</th>
                  <th className="px-5 py-4">Tipo</th>
                  <th className="px-5 py-4">Saldo</th>
                  <th className="px-5 py-4">Preco</th>
                  <th className="px-5 py-4">Valor total</th>
                  <th className="px-5 py-4">Local</th>
                  <th className="px-5 py-4">Atualizado</th>
                  <th className="px-5 py-4 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {pagedItems.map((item) => {
                  return (
                    <tr key={item.id} className="border-b border-orange-50 last:border-b-0">
                      <td className="px-5 py-4 align-top">
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => setDetailsCode(item.code)}
                        >
                          <p className="font-semibold text-[#3A2416]">{item.name}</p>
                          <p className="mt-1 text-sm text-[#7C6555]">{item.code}</p>
                        </button>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <StatusBadge tone="info">{formatItemType(item.item_type)}</StatusBadge>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <p className="font-semibold text-[#3A2416]">{formatInteger(item.quantity)}</p>
                      </td>
                      <td className="px-5 py-4 align-top text-sm text-[#7C6555]">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="px-5 py-4 align-top text-sm font-semibold text-[#3A2416]">
                        {formatCurrency(item.total_value)}
                      </td>
                      <td className="px-5 py-4 align-top text-sm text-[#7C6555]">{item.location}</td>
                      <td className="px-5 py-4 align-top text-sm text-[#7C6555]">
                        {formatDateTime(item.updated_at)}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl"
                            onClick={() => setDetailsCode(item.code)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl"
                            onClick={() => setEditingCode(item.code)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl text-emerald-700 hover:bg-emerald-50"
                            onClick={() => setMovementContext({ kind: 'inbound', item })}
                          >
                            <ArrowDownCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl text-amber-700 hover:bg-amber-50"
                            onClick={() => setMovementContext({ kind: 'outbound', item })}
                          >
                            <ArrowUpCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl text-rose-700 hover:bg-rose-50"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 px-4 py-4 lg:hidden">
            {pagedItems.map((item) => {
              return (
                <div key={item.id} className="rounded-[24px] border border-orange-100 bg-white px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <button type="button" className="text-left" onClick={() => setDetailsCode(item.code)}>
                        <p className="font-semibold text-[#3A2416]">{item.name}</p>
                        <p className="mt-1 text-sm text-[#7C6555]">{item.code}</p>
                      </button>
                    </div>
                    <StatusBadge tone="info">{formatItemType(item.item_type)}</StatusBadge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#7C6555]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#B28A72]">Saldo</p>
                      <p className="mt-2 font-semibold text-[#3A2416]">{formatInteger(item.quantity)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#B28A72]">Valor total</p>
                      <p className="mt-2 font-semibold text-[#3A2416]">{formatCurrency(item.total_value)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setDetailsCode(item.code)}>
                      Detalhes
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditingCode(item.code)}>
                      Editar
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setMovementContext({ kind: 'inbound', item })}
                    >
                      Entrada
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setMovementContext({ kind: 'outbound', item })}
                    >
                      Saida
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteTarget(item)}>
                      Excluir
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </Card>
      ) : null}

      <ItemFormModal
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmitted={(item) => handleMutationSuccess(item.code)}
      />

      <ItemFormModal
        open={Boolean(editingCode)}
        mode="edit"
        itemCode={editingCode}
        onClose={() => setEditingCode(null)}
        onSubmitted={(item) => handleMutationSuccess(item.code)}
      />

      <StockChangeModal
        open={Boolean(movementContext)}
        kind={movementContext?.kind ?? 'inbound'}
        item={movementContext?.item ?? null}
        onClose={() => setMovementContext(null)}
        onSubmitted={(item) => handleMutationSuccess(item.code)}
      />

      <DeleteItemDialog
        open={Boolean(deleteTarget)}
        item={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={(itemCode) => {
          if (detailsCode === itemCode) {
            setDetailsCode(null);
          }
          reload();
        }}
      />

      <ItemDetailsDrawer
        open={Boolean(detailsCode)}
        itemCode={detailsCode}
        refreshToken={detailsRefreshToken}
        onClose={() => setDetailsCode(null)}
      />
    </div>
  );
}
