import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-[4px] font-sans text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B28A45] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer';

    const variants = {
      default:
        'bg-[#164A3A] text-white hover:bg-[#2A6B55] active:bg-[#0d2e24] shadow-none border border-[#164A3A]',
      secondary:
        'bg-[#EFECE6] text-[#171918] border border-[#D9D7D0] hover:bg-[#E6E3DC] active:bg-[#dedad2]',
      outline:
        'border border-[#164A3A] bg-transparent text-[#164A3A] hover:bg-[#164A3A] hover:text-white',
      gold:
        'bg-[#B28A45] text-white hover:bg-[#9c7739] active:bg-[#7e5f2a] border border-[#B28A45]',
      ghost:
        'hover:bg-[#EFECE6] text-[#171918] hover:text-[#164A3A]',
      link:
        'text-[#164A3A] underline-offset-4 hover:underline p-0 h-auto font-medium',
    };

    const sizes = {
      default: 'h-9 px-4 py-2 text-sm',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-11 px-6 text-base',
      icon: 'h-9 w-9',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
