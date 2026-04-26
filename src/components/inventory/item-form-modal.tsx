import { useEffect, useState } from 'react';

import type {
  CreateItemPayload,
  InventoryItemDetails,
  ItemType,
  UpdateItemPayload,
} from '@/contract/inventory';
import { useInventoryItemDetails } from '@/hooks/use-inventory-item-details';
import { inventoryService } from '@/services/inventory-service';
import { getApiErrorMessage } from '@/services/http';
import { useToastStore } from '@/store/toast-store';
import { Button } from '@/components/ui/button';
import { ModalShell } from '@/components/ui/modal-shell';

type ItemFormMode = 'create' | 'edit';

interface ItemFormModalProps {
  open: boolean;
  mode: ItemFormMode;
  itemCode?: string | null;
  onClose: () => void;
  onSubmitted: (item: InventoryItemDetails) => void;
}

interface FormState {
  code: string;
  itemType: ItemType;
  name: string;
  description: string;
  informationLink: string;
  quantity: string;
  unitPrice: string;
  location: string;
}

const emptyFormState: FormState = {
  code: '',
  itemType: 'product',
  name: '',
  description: '',
  informationLink: '',
  quantity: '0',
  unitPrice: '',
  location: '',
};

function inputClassName() {
  return 'mt-2 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-[#3A2416] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100';
}

function labelClassName() {
  return 'text-sm font-semibold text-[#5E4330]';
}

function mapItemToState(item: InventoryItemDetails): FormState {
  return {
    code: item.code,
    itemType: item.item_type,
    name: item.name,
    description: item.description,
    informationLink: item.information_link,
    quantity: String(item.quantity),
    unitPrice: String(item.unit_price),
    location: item.location,
  };
}

export function ItemFormModal({
  open,
  mode,
  itemCode,
  onClose,
  onSubmitted,
}: ItemFormModalProps) {
  const pushToast = useToastStore((state) => state.pushToast);
  const [formState, setFormState] = useState<FormState>(emptyFormState);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const detailsState = useInventoryItemDetails(itemCode ?? null, open && mode === 'edit');

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === 'create') {
      setFormState(emptyFormState);
      setFormError(null);
    }
  }, [mode, open]);

  useEffect(() => {
    if (!open || mode !== 'edit' || !detailsState.item) {
      return;
    }

    setFormState(mapItemToState(detailsState.item));
    setFormError(null);
  }, [detailsState.item, mode, open]);

  function updateField<Key extends keyof FormState>(field: Key, value: FormState[Key]) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (
      !formState.code.trim() ||
      !formState.name.trim() ||
      !formState.description.trim() ||
      !formState.informationLink.trim() ||
      !formState.location.trim() ||
      !formState.unitPrice.trim()
    ) {
      setFormError('Preencha todos os campos obrigatorios antes de continuar.');
      return;
    }

    const quantity = Number(formState.quantity);
    const unitPrice = Number(formState.unitPrice);

    if (!Number.isFinite(quantity) || quantity < 0) {
      setFormError('A quantidade precisa ser um numero valido maior ou igual a zero.');
      return;
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      setFormError('O preco unitario precisa ser um numero valido maior ou igual a zero.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      if (mode === 'create') {
        const payload: CreateItemPayload = {
          code: formState.code.trim(),
          item_type: formState.itemType,
          name: formState.name.trim(),
          description: formState.description.trim(),
          information_link: formState.informationLink.trim(),
          quantity,
          unit_price: unitPrice,
          location: formState.location.trim(),
        };

        const response = await inventoryService.createItem(payload);
        pushToast({
          tone: 'success',
          title: 'Item criado com sucesso',
          description: response.message,
        });
        onSubmitted(response.item);
        onClose();
      } else if (itemCode) {
        const payload: UpdateItemPayload = {
          item_type: formState.itemType,
          name: formState.name.trim(),
          description: formState.description.trim(),
          information_link: formState.informationLink.trim(),
          unit_price: unitPrice,
          location: formState.location.trim(),
        };

        const response = await inventoryService.updateItem(itemCode, payload);
        pushToast({
          tone: 'success',
          title: 'Item atualizado',
          description: response.message,
        });
        onSubmitted(response.item);
        onClose();
      }
    } catch (error) {
      const message = getApiErrorMessage(error);
      setFormError(message);
      pushToast({
        tone: 'error',
        title: 'Nao foi possivel salvar o item',
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      open={open}
      title={mode === 'create' ? 'Novo item' : 'Editar item'}
      description={
        mode === 'create'
          ? 'Cadastre um novo produto pronto ou insumo da padaria com dados suficientes para consulta e movimentacao.'
          : 'Atualize os dados descritivos do item. A quantidade continua sendo ajustada apenas por entrada e saida.'
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || (mode === 'edit' && detailsState.loading)}>
            {submitting ? 'Salvando...' : mode === 'create' ? 'Criar item' : 'Salvar ajustes'}
          </Button>
        </>
      }
    >
      {mode === 'edit' && detailsState.loading ? (
        <div className="rounded-[24px] border border-dashed border-orange-100 bg-orange-50/70 px-4 py-12 text-center text-sm text-[#7C6555]">
          Carregando os detalhes do item para edicao...
        </div>
      ) : null}

      {mode === 'edit' && detailsState.error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
          {detailsState.error}
        </div>
      ) : null}

      {formError ? (
        <div className="mb-5 rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {formError}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <label className={labelClassName()}>
          Codigo
          <input
            className={inputClassName()}
            value={formState.code}
            disabled={mode === 'edit'}
            onChange={(event) => updateField('code', event.target.value)}
          />
        </label>

        <label className={labelClassName()}>
          Tipo
          <select
            className={inputClassName()}
            value={formState.itemType}
            onChange={(event) => updateField('itemType', event.target.value as ItemType)}
          >
            <option value="product">Produto pronto</option>
            <option value="material">Insumo</option>
          </select>
        </label>

        <label className={labelClassName()}>
          Nome
          <input
            className={inputClassName()}
            value={formState.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
        </label>

        <label className={labelClassName()}>
          Localizacao
          <input
            className={inputClassName()}
            value={formState.location}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="Ex.: Camara fria, deposito seco, vitrine..."
          />
        </label>

        <label className={labelClassName()}>
          Preco unitario
          <input
            className={inputClassName()}
            inputMode="decimal"
            value={formState.unitPrice}
            onChange={(event) => updateField('unitPrice', event.target.value)}
          />
        </label>

        <label className={labelClassName()}>
          Quantidade inicial
          <input
            className={inputClassName()}
            inputMode="numeric"
            value={formState.quantity}
            disabled={mode === 'edit'}
            onChange={(event) => updateField('quantity', event.target.value)}
          />
        </label>

        <label className="lg:col-span-2">
          <span className={labelClassName()}>Descricao</span>
          <textarea
            className={`${inputClassName()} min-h-32 resize-y`}
            value={formState.description}
            onChange={(event) => updateField('description', event.target.value)}
          />
        </label>

        <label className="lg:col-span-2">
          <span className={labelClassName()}>Link de informacao</span>
          <input
            className={inputClassName()}
            value={formState.informationLink}
            onChange={(event) => updateField('informationLink', event.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>
    </ModalShell>
  );
}
