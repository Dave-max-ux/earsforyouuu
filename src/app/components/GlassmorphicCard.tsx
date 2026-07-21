/**
 * GlassmorphicCard — refined surface card with hover animations
 */

import React, { ReactNode } from 'react';
import { cn } from './ui/utils';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
  gradient?: boolean;
}

export function GlassmorphicCard({
  children,
  className,
  onClick,
  glow = false,
  gradient = false,
}: GlassmorphicCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 transition-all duration-300 ease-out',
        'bg-card border border-border',
        gradient && 'bg-gradient-to-br from-[rgba(61,139,122,0.06)] via-transparent to-transparent',
        glow && 'shadow-md dark:shadow-lg dark:shadow-black/20',
        !glow && 'shadow-sm',
        'hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/25',
        onClick && 'cursor-pointer active:scale-[0.98] active:translate-y-0',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
