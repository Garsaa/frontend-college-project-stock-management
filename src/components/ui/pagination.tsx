import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-orange-100 px-5 py-4">
      <p className="text-sm text-[#7C6555]">
        Pagina <strong className="font-semibold text-[#3A2416]">{page}</strong> de{' '}
        <strong className="font-semibold text-[#3A2416]">{totalPages}</strong>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl"
          leadingIcon={<ChevronLeft className="h-4 w-4" />}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          {pages.map((currentPage) => (
            <button
              key={currentPage}
              type="button"
              className={cn(
                'grid h-10 w-10 place-items-center rounded-xl text-sm font-semibold transition',
                currentPage === page
                  ? 'bg-[#4B2E1F] text-white'
                  : 'bg-orange-100 text-[#5E4330] hover:bg-orange-200',
              )}
              onClick={() => onPageChange(currentPage)}
            >
              {currentPage}
            </button>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl"
          trailingIcon={<ChevronRight className="h-4 w-4" />}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Proxima
        </Button>
      </div>
    </div>
  );
}
