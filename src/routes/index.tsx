import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppShell } from '@/components/layout/app-shell';
import { INVENTORY_ROUTES } from '@/config/app-config';
import { ItemsPage } from '@/pages/inventory/items-page';
import { MovementsPage } from '@/pages/inventory/movements-page';
import { ModulePlaceholderPage } from '@/pages/modules/module-placeholder-page';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to={INVENTORY_ROUTES.items} replace />,
      },
      {
        path: INVENTORY_ROUTES.items,
        element: <ItemsPage />,
      },
      {
        path: INVENTORY_ROUTES.movements,
        element: <MovementsPage />,
      },
      {
        path: '/human-resources',
        element: <ModulePlaceholderPage moduleName="Recursos Humanos" />,
      },
      {
        path: '/purchasing',
        element: <ModulePlaceholderPage moduleName="Compras" />,
      },
      {
        path: '/production',
        element: <ModulePlaceholderPage moduleName="Producao" />,
      },
      {
        path: '/sales',
        element: <ModulePlaceholderPage moduleName="Vendas" />,
      },
      {
        path: '/finance',
        element: <ModulePlaceholderPage moduleName="Financeiro" />,
      },
      {
        path: '/reports-and-analytics',
        element: <ModulePlaceholderPage moduleName="Relatorios e analises" />,
      },
    ],
  },
]);
