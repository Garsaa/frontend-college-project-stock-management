import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { LogoMark } from '@/components/brand/logo-mark';
import { ModuleSwitcher } from '@/components/layout/module-switcher';
import { Button } from '@/components/ui/button';
import { APP_NAME, APP_SUBTITLE } from '@/config/app-config';
import { APP_THEME } from '@/theme/app-theme';
import { useUiStore } from '@/store/ui-store';

export function ErpHeader() {
  const location = useLocation();
  const toggleMobileSidebar = useUiStore((state) => state.toggleMobileSidebar);

  const currentSection = location.pathname.startsWith('/inventory/movements')
    ? 'Historico de movimentos'
    : location.pathname.startsWith('/inventory')
      ? 'Itens'
      : 'Modulo';

  return (
    <header
      className={`sticky top-0 z-20 border-b border-white/10 bg-gradient-to-r ${APP_THEME.warmHeader} text-white shadow-[0_18px_44px_-24px_rgba(41,24,17,0.95)] backdrop-blur-xl`}
    >
      <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-2 py-4 sm:px-3 lg:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl text-white hover:bg-white/10 lg:hidden"
            onClick={toggleMobileSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <LogoMark />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-lg font-semibold tracking-[0.04em]">{APP_NAME}</p>
              <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-100">
                {currentSection}
              </span>
            </div>
            <p className="hidden truncate text-sm text-orange-100/85 sm:block">{APP_SUBTITLE}</p>
          </div>
        </div>

        <ModuleSwitcher />
      </div>
    </header>
  );
}
