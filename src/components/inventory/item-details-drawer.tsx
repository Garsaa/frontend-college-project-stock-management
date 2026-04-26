import { ArrowUpRight, Boxes, MapPin, Package, ReceiptText } from 'lucide-react';

import { DrawerShell } from '@/components/ui/drawer-shell';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { useInventoryItemDetails } from '@/hooks/use-inventory-item-details';
import {
  formatCurrency,
  formatDateTime,
  formatItemType,
  formatOperation,
  stockHealth,
} from '@/utils/format';

interface ItemDetailsDrawerProps {
  open: boolean;
  itemCode: string | null;
  refreshToken: number;
  onClose: () => void;
}

export function ItemDetailsDrawer({
  open,
  itemCode,
  refreshToken,
  onClose,
}: ItemDetailsDrawerProps) {
  const { item, loading, error } = useInventoryItemDetails(itemCode, open, refreshToken);

  return (
    <DrawerShell
      open={open}
      title={item ? `${item.code} - ${item.name}` : 'Detalhes do item'}
      description="Visao consolidada do cadastro, saldo atual e historico de movimentacoes do estoque."
      onClose={onClose}
    >
      {loading ? (
        <LoadingState
          title="Abrindo detalhes"
          description="Buscando o item completo diretamente na API online."
        />
      ) : null}

      {!loading && error ? <ErrorState description={error} /> : null}

      {!loading && !error && item ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-orange-100 bg-orange-50/70 px-5 py-4">
              <p className="text-sm font-semibold text-[#7C6555]">Tipo</p>
              <div className="mt-3 flex items-center gap-3">
                <Package className="h-5 w-5 text-orange-700" />
                <span className="text-lg font-semibold text-[#3A2416]">
                  {formatItemType(item.item_type)}
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border border-orange-100 bg-orange-50/70 px-5 py-4">
              <p className="text-sm font-semibold text-[#7C6555]">Saude do estoque</p>
              <div className="mt-3 flex items-center gap-3">
                <Boxes className="h-5 w-5 text-amber-700" />
                <StatusBadge tone={stockHealth(item.quantity).tone}>
                  {stockHealth(item.quantity).label}
                </StatusBadge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-orange-100 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
                Quantidade
              </p>
              <p className="mt-3 text-3xl font-semibold text-[#3A2416]">{item.quantity}</p>
            </div>

            <div className="rounded-[24px] border border-orange-100 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
                Valor total estimado
              </p>
              <p className="mt-3 text-3xl font-semibold text-[#3A2416]">
                {formatCurrency(item.total_value)}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-orange-100 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
              Cadastro
            </p>
            <dl className="mt-4 grid gap-4 text-sm text-[#7C6555] sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-[#3A2416]">Localizacao</dt>
                <dd className="mt-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-700" />
                  {item.location}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#3A2416]">Preco unitario</dt>
                <dd className="mt-2">{formatCurrency(item.unit_price)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#3A2416]">Criado em</dt>
                <dd className="mt-2">{formatDateTime(item.created_at)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#3A2416]">Ultima atualizacao</dt>
                <dd className="mt-2">{formatDateTime(item.updated_at)}</dd>
              </div>
            </dl>

            <div className="mt-5 rounded-[22px] bg-orange-50/60 px-4 py-4">
              <p className="text-sm font-semibold text-[#3A2416]">Descricao</p>
              <p className="mt-2 text-sm leading-6 text-[#7C6555]">{item.description}</p>
            </div>

            <a
              href={item.information_link}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-700"
            >
              <ArrowUpRight className="h-4 w-4" />
              Abrir link de informacao
            </a>
          </div>

          <div className="rounded-[24px] border border-orange-100 px-5 py-5">
            <div className="flex items-center gap-3">
              <ReceiptText className="h-5 w-5 text-orange-700" />
              <div>
                <h3 className="text-lg font-semibold text-[#3A2416]">Historico do item</h3>
                <p className="text-sm text-[#7C6555]">
                  Todas as entradas e saidas registradas para esse cadastro.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {item.movements.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-orange-100 bg-orange-50/70 px-4 py-4 text-sm text-[#7C6555]">
                  Nenhum movimento registrado para este item ate o momento.
                </div>
              ) : (
                item.movements.map((movement) => (
                  <div
                    key={movement.id}
                    className="rounded-[22px] border border-orange-100 bg-orange-50/55 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <StatusBadge tone={movement.operation === 'inbound' ? 'success' : 'warning'}>
                            {formatOperation(movement.operation)}
                          </StatusBadge>
                          <span className="text-sm font-semibold text-[#3A2416]">
                            Quantidade {movement.quantity}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[#7C6555]">{movement.note}</p>
                      </div>
                      <p className="text-sm text-[#7C6555]">{formatDateTime(movement.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </DrawerShell>
  );
}
