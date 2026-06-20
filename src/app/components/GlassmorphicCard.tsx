/**
 * GlassmorphicCard - Premium glassmorphism card component
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
  gradient = false 
}: GlassmorphicCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-3xl p-6 transition-all duration-300',
        'backdrop-blur-xl',
        'border border-white/10',
        gradient 
          ? 'bg-gradient-to-br from-primary/10 via-accent/5 to-transparent'
          : 'bg-card/60',
        glow && 'shadow-lg shadow-primary/20',
        onClick && 'cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
