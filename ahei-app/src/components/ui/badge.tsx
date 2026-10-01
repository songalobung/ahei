import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'outline' | 'subtle' | 'success' | 'destructive';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseStyles =
    'inline-flex items-center rounded-[2px] px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors';

  const variants = {
    default: 'bg-[#164A3A] text-white',
    gold: 'bg-[#faedd9] text-[#78591e] border border-[#e5cb9b]',
    outline: 'border border-[#D9D7D0] text-[#171918] bg-white',
    subtle: 'bg-[#EFECE6] text-[#676963] border border-[#D9D7D0]',
    success: 'bg-[#d2e4dc] text-[#0d2e24] border border-[#b8d4c7]',
    destructive: 'bg-[#fae8e6] text-[#9e3223] border border-[#f0bdb7]',
  };

  return <div className={cn(baseStyles, variants[variant], className)} {...props} />;
}
