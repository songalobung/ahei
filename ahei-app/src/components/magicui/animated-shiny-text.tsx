import { cn } from '@/lib/utils';
import { CSSProperties, FC, ReactNode } from 'react';

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <span
      style={
        {
          '--shiny-width': `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        'mx-auto max-w-md text-[#164A3A]',
        // Shimmer effect
        'animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',
        // Shimmer gradient in gold and forest green
        'bg-gradient-to-r from-transparent via-[#B28A45]/30 via-50% to-transparent',
        className
      )}
    >
      {children}
    </span>
  );
};
