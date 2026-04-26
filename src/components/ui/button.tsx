import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'muted';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#4B2E1F] text-white hover:bg-[#603826] shadow-[0_18px_34px_-24px_rgba(41,24,17,0.9)]',
  secondary:
    'border border-orange-200 bg-white text-[#4B2E1F] hover:border-amber-300 hover:bg-amber-50/70',
  ghost: 'bg-transparent text-[#5E4330] hover:bg-orange-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
  muted: 'bg-orange-100 text-[#5E4330] hover:bg-orange-200',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-4.5 text-sm',
  lg: 'h-12 px-5 text-sm',
  icon: 'h-11 w-11',
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
