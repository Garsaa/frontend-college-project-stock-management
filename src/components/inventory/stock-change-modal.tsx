import { useEffect, useState } from 'react';

import type { InventoryItemDetails, InventoryItemSummary } from '@/contract/inventory';
import { inventoryService } from '@/services/inventory-service';
import { getApiErrorMessage } from '@/services/http';
import { useToastStore } from '@/store/toast-store';
import { Button } from '@/components/ui/button';
import { ModalShell } from '@/components/ui/modal-shell';

type MovementKind = 'inbound' | 'outbound';

interface StockChangeModalProps {
  open: boolean;
  kind: MovementKind;
  item: InventoryItemSummary | null;
  onClose: () => void;
  onSubmitted: (item: InventoryItemDetails) => void;
}

function inputClassName() {
  return 'mt-2 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-[#3A2416] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100';
}

export function StockChangeModal({
  open,
  kind,
  item,
  onClose,
  onSubmitted,
}: StockChangeModalProps) {
  const pushToast = useToastStore((state) => state.pushToast);
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuantity('1');
    setNote('');
    setError(null);
  }, [kind, open, item?.code]);

  async function handleSubmit() {
    if (!item) {
      return;
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError('Informe uma quantidade valida maior que zero.');
      return;
    }

    if (!note.trim()) {
      setError('Descreva a observacao do movimento.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response =
        kind === 'inbound'
          ? await inventoryService.registerInbound(item.code, {
              quantity: parsedQuantity,
              note: note.trim(),
            })
          : await inventoryService.registerOutbound(item.code, {
              quantity: parsedQuantity,
              note: note.trim(),
            });

      pushToast({
        tone: 'success',
        title: kind === 'inbound' ? 'Entrada registrada' : 'Saida registrada',
        description: response.message,
      });
      onSubmitted(response.item);
      onClose();
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);
      setError(message);
      pushToast({
        tone: 'error',
        title: 'Falha ao registrar movimento',
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      open={open}
      title={kind === 'inbound' ? 'Registrar entrada' : 'Registrar saida'}
      description={
        item
          ? `Atualize o saldo do item ${item.code} - ${item.name} sem perder a rastreabilidade operacional da padaria.`
          : 'Selecione um item para continuar.'
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !item}>
            {submitting ? 'Salvando...' : kind === 'inbound' ? 'Confirmar entrada' : 'Confirmar saida'}
          </Button>
        </>
      }
    >
      {item ? (
        <div className="space-y-5">
          <div className="rounded-[24px] border border-orange-100 bg-orange-50/70 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E34]">
              Contexto do item
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#3A2416]">{item.name}</h3>
            <p className="mt-1 text-sm text-[#7C6555]">
              Codigo {item.code} | Quantidade atual {item.quantity}
            </p>
          </div>

          {error ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <label className="block text-sm font-semibold text-[#5E4330]">
            Quantidade
            <input
              className={inputClassName()}
              inputMode="numeric"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>

          <label className="block text-sm font-semibold text-[#5E4330]">
            Observacao
            <textarea
              className={`${inputClassName()} min-h-32 resize-y`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={
                kind === 'inbound'
                  ? 'Ex.: chegada de farinha, reposicao de recheio, compra de embalagens...'
                  : 'Ex.: consumo na producao, separacao para vendas, perda operacional...'
              }
            />
          </label>
        </div>
      ) : null}
    </ModalShell>
  );
}
