import { Wheat } from 'lucide-react';

import { cn } from '@/utils/cn';

interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <div
      className={cn(
        'relative grid h-12 w-12 place-items-center overflow-hidden rounded-[18px] border border-white/15 bg-[#4B2E1F] shadow-[0_20px_48px_-32px_rgba(41,24,17,0.9)]',
        className,
      )}
    >
      <span className="absolute inset-x-2 top-2 h-3 rounded-full bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-100" />
      <span className="absolute bottom-2 left-2 h-4 w-4 rounded-[10px] bg-orange-100" />
      <span className="absolute bottom-2 right-2 h-4 w-4 rounded-[10px] bg-amber-400" />
      <Wheat className="relative z-10 h-5 w-5 text-amber-100" />
    </div>
  );
}
