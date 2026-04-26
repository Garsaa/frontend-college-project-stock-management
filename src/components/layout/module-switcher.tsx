import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ChevronDown, Grid2x2 } from 'lucide-react';

import { ERP_MODULES } from '@/config/app-config';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export function ModuleSwitcher() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, []);

  const activeModule =
    ERP_MODULES.find((module) =>
      module.key === 'inventory'
        ? location.pathname.startsWith('/inventory')
        : location.pathname.startsWith(module.path),
    ) ?? ERP_MODULES[1];

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="secondary"
        className="rounded-2xl border-white/25 bg-white/95"
        leadingIcon={<Grid2x2 className="h-4 w-4" />}
        trailingIcon={<ChevronDown className="h-4 w-4" />}
        onClick={() => setOpen((current) => !current)}
      >
        {activeModule.label}
      </Button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-80 rounded-[28px] border border-orange-100 bg-white p-3 shadow-[0_28px_60px_-36px_rgba(41,24,17,0.45)]">
          <div className="px-3 pb-3">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Modulos
            </p>
            <p className="mt-2 text-sm text-[#7C6555]">
              Estoque da padaria esta ativo. Os demais caminhos ficam prontos para voce conectar
              depois.
            </p>
          </div>

          <div className="grid gap-2">
            {ERP_MODULES.map((module) => {
              const isActive =
                module.key === 'inventory'
                  ? location.pathname.startsWith('/inventory')
                  : location.pathname.startsWith(module.path);

              return (
                <Link
                  key={module.key}
                  to={module.path}
                  className={cn(
                    'rounded-2xl border px-4 py-3 transition',
                    isActive
                      ? 'border-amber-200 bg-amber-50 text-[#5E4330]'
                      : 'border-orange-100 bg-orange-50/60 text-[#5E4330] hover:border-amber-300 hover:bg-amber-50',
                  )}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{module.label}</span>
                    <span className="text-xs uppercase tracking-[0.18em] opacity-70">
                      {isActive ? 'Ativo' : 'Abrir'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
