import { useState } from 'react';

import type { InventoryItemSummary } from '@/contract/inventory';
import { inventoryService } from '@/services/inventory-service';
import { getApiErrorMessage } from '@/services/http';
import { useToastStore } from '@/store/toast-store';
import { Button } from '@/components/ui/button';
import { ModalShell } from '@/components/ui/modal-shell';

interface DeleteItemDialogProps {
  open: boolean;
  item: InventoryItemSummary | null;
  onClose: () => void;
  onDeleted: (itemCode: string) => void;
}

export function DeleteItemDialog({
  open,
  item,
  onClose,
  onDeleted,
}: DeleteItemDialogProps) {
  const pushToast = useToastStore((state) => state.pushToast);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!item) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await inventoryService.deleteItem(item.code);
      pushToast({
        tone: 'success',
        title: 'Item removido',
        description: response.message,
      });
      onDeleted(item.code);
      onClose();
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);
      setError(message);
      pushToast({
        tone: 'error',
        title: 'Nao foi possivel excluir o item',
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      open={open}
      title="Excluir item"
      description="Essa remocao tambem apaga o historico relacionado ao item. Use apenas quando realmente quiser remover o cadastro."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={submitting || !item}>
            {submitting ? 'Excluindo...' : 'Excluir item'}
          </Button>
        </>
      }
    >
      {item ? (
        <div className="space-y-4">
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-4">
            <p className="text-sm font-semibold text-rose-800">Voce esta removendo:</p>
            <p className="mt-2 text-lg font-semibold text-[#3A2416]">
              {item.code} - {item.name}
            </p>
            <p className="mt-2 text-sm text-[#7C6555]">
              Quantidade atual: {item.quantity} | Localizacao: {item.location}
            </p>
          </div>
          {error ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>
      ) : null}
    </ModalShell>
  );
}
