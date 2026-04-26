import type { ItemType, MovementOperation } from '@/contract/inventory';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatDateTime(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatInteger(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatItemType(value: ItemType) {
  return value === 'product' ? 'Produto pronto' : 'Insumo';
}

export function formatOperation(value: MovementOperation) {
  return value === 'inbound' ? 'Entrada' : 'Saida';
}

export function stockHealth(quantity: number) {
  if (quantity <= 0) {
    return {
      label: 'Sem estoque',
      tone: 'danger' as const,
    };
  }

  if (quantity <= 5) {
    return {
      label: 'Reposicao urgente',
      tone: 'warning' as const,
    };
  }

  return {
    label: 'Saudavel',
    tone: 'success' as const,
  };
}
