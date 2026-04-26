export type ErpModuleKey =
  | 'human-resources'
  | 'inventory'
  | 'purchasing'
  | 'production'
  | 'sales'
  | 'finance'
  | 'reports-and-analytics';

export interface ErpModule {
  key: ErpModuleKey;
  label: string;
  path: string;
}

export interface SidebarEntry {
  label: string;
  description: string;
  path: string;
}

export const API_FALLBACK_BASE_URL =
  'https://backend-college-project-stock-management.onrender.com';

export const APP_NAME = 'Aurora Padaria';
export const APP_SUBTITLE =
  'Controle de insumos, fornadas, produtos prontos e movimentacoes do estoque da padaria.';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || API_FALLBACK_BASE_URL;

export const INVENTORY_ROUTES = {
  items: '/inventory/items',
  movements: '/inventory/movements',
} as const;

export const ERP_MODULES: ErpModule[] = [
  { key: 'human-resources', label: 'Recursos Humanos', path: '/human-resources' },
  { key: 'inventory', label: 'Estoque', path: INVENTORY_ROUTES.items },
  { key: 'purchasing', label: 'Compras', path: '/purchasing' },
  { key: 'production', label: 'Producao', path: '/production' },
  { key: 'sales', label: 'Vendas', path: '/sales' },
  { key: 'finance', label: 'Financeiro', path: '/finance' },
  {
    key: 'reports-and-analytics',
    label: 'Relatorios e analises',
    path: '/reports-and-analytics',
  },
];

export const INVENTORY_NAVIGATION: SidebarEntry[] = [
  {
    label: 'Itens',
    description: 'Produtos assados, insumos e demais cadastros operacionais da padaria.',
    path: INVENTORY_ROUTES.items,
  },
  {
    label: 'Historico de movimentos',
    description: 'Entradas e saidas para reposicao, consumo de producao e conferencias.',
    path: INVENTORY_ROUTES.movements,
  },
];
