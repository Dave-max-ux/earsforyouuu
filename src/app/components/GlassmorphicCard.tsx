/**
 * GlassmorphicCard — refined surface card
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
        'relative rounded-2xl p-6 transition-all duration-200',
        'bg-card border border-border',
        gradient && 'bg-gradient-to-br from-[rgba(61,139,122,0.04)] via-transparent to-transparent',
        glow && 'shadow-md dark:shadow-lg dark:shadow-black/20',
        !glow && 'shadow-sm',
        onClick && 'cursor-pointer hover:shadow-md hover:border-primary/20 active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
