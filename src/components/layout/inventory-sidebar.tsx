import { Link, useLocation } from 'react-router-dom';

import { ChevronRight, PackageSearch, PanelsTopLeft, X } from 'lucide-react';

import { INVENTORY_NAVIGATION } from '@/config/app-config';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { useUiStore } from '@/store/ui-store';

export function InventorySidebar() {
  const location = useLocation();
  const mobileSidebarOpen = useUiStore((state) => state.mobileSidebarOpen);
  const closeMobileSidebar = useUiStore((state) => state.closeMobileSidebar);
  const isInventoryRoute = location.pathname.startsWith('/inventory');

  return (
    <>
      {mobileSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[#2A1911]/30 backdrop-blur-sm lg:hidden"
          aria-label="Fechar menu lateral"
          onClick={closeMobileSidebar}
        />
      ) : null}

      <aside
        className={cn(
          'surface-shell fixed inset-y-[5.35rem] left-2 z-40 flex w-[300px] max-w-[calc(100vw-1rem)] shrink-0 flex-col px-4 py-4 transition duration-300 lg:sticky lg:top-[6rem] lg:left-0 lg:z-10 lg:h-[calc(100vh-7.1rem)] lg:translate-x-0',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0',
        )}
      >
        <div className="flex items-start justify-between gap-3 px-3 py-2">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Navegacao do modulo
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#3A2416]">Estoque</h2>
            <p className="mt-2 text-sm leading-6 text-[#7C6555]">
              Controle de farinha, fermento, recheios, fornadas e produtos prontos.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl lg:hidden"
            onClick={closeMobileSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {isInventoryRoute ? (
          <nav className="mt-6 grid gap-3">
            {INVENTORY_NAVIGATION.map((entry) => {
              const isActive = location.pathname === entry.path;

              return (
                <Link
                  key={entry.path}
                  to={entry.path}
                  className={cn(
                    'rounded-[24px] border px-4 py-4 transition',
                    isActive
                      ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-[#4B2E1F] shadow-[0_18px_36px_-30px_rgba(180,83,9,0.45)]'
                      : 'border-orange-100 bg-white text-[#5E4330] hover:border-amber-300 hover:bg-amber-50/55',
                  )}
                  onClick={closeMobileSidebar}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{entry.label}</p>
                      <p className="mt-2 text-sm leading-6 text-[#7C6555]">{entry.description}</p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0" />
                  </div>
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="mt-6 rounded-[24px] border border-dashed border-orange-100 bg-orange-50/70 px-4 py-5 text-sm text-[#7C6555]">
            <div className="flex items-center gap-3 text-[#5E4330]">
              <PanelsTopLeft className="h-5 w-5 text-amber-700" />
              <span className="font-semibold">Modulo em preparacao</span>
            </div>
            <p className="mt-3 leading-6">
              O shell lateral ja fica pronto para voce encaixar os outros modulos sem
              mexer na base visual.
            </p>
            <Link
              to="/inventory/items"
              className="mt-4 inline-flex items-center gap-2 font-semibold text-amber-700"
            >
              <PackageSearch className="h-4 w-4" />
              Voltar para Estoque
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
