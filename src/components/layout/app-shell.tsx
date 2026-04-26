import { Outlet } from 'react-router-dom';

import { ErpHeader } from '@/components/layout/erp-header';
import { InventorySidebar } from '@/components/layout/inventory-sidebar';

export function AppShell() {
  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-80 bakery-grid opacity-55" />
      <ErpHeader />
      <div className="mx-auto flex max-w-[1920px] items-start gap-4 px-2 py-4 sm:px-3 lg:px-4">
        <InventorySidebar />
        <main className="min-w-0 flex-1">
          <div className="surface-shell min-h-[calc(100vh-8.5rem)] px-4 py-4 sm:px-6 sm:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
