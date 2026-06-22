/**
 * EarsForYou brand mark — ear + listening wave motif
 */

import React from 'react';
import { cn } from './ui/utils';

interface EarsForYouLogoProps {
  variant?: 'full' | 'mark' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onDark?: boolean;
}

const sizes = {
  sm: { mark: 28, word: 'text-base', gap: 'gap-2' },
  md: { mark: 36, word: 'text-lg', gap: 'gap-2.5' },
  lg: { mark: 48, word: 'text-xl', gap: 'gap-3' },
  xl: { mark: 64, word: 'text-2xl', gap: 'gap-3.5' },
};

function LogoMark({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="64" height="64" rx="16" fill="url(#efy-mark-bg)" />
      <path
        d="M32 14c-8.5 0-14 6.2-14 14.5 0 4.8 2.1 8.8 5.5 11.2-.3 2.8-.8 5.5-1.8 8 3.8-1.2 7-3.4 9.5-6.2 1.5.4 3 .6 4.8.6 8.5 0 14-6.2 14-14.5S40.5 14 32 14z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M44 28c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <path
        d="M48 24c4 0 7 3.2 7 7s-3 7-7 7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
      <path
        d="M52 20c5.5 0 10 4.5 10 10s-4.5 10-10 10"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.25"
      />
      <defs>
        <linearGradient id="efy-mark-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A4D5C" />
          <stop offset="1" stopColor="#3D8B7A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Wordmark({ size, onDark }: { size: keyof typeof sizes; onDark?: boolean }) {
  const s = sizes[size];
  return (
    <div className={cn('flex flex-col leading-none', s.word)}>
      <span
        className={cn(
          'font-display font-semibold tracking-tight',
          onDark ? 'text-white' : 'text-[var(--color-text-primary)]'
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Ears<span className={onDark ? 'text-[#7EC4B8]' : 'text-[var(--color-brand-teal)]'}>ForYou</span>
      </span>
    </div>
  );
}

export function EarsForYouLogo({
  variant = 'full',
  size = 'md',
  className,
  onDark = false,
}: EarsForYouLogoProps) {
  const s = sizes[size];

  if (variant === 'mark') {
    return <LogoMark size={s.mark} className={className} />;
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center', className)}>
        <Wordmark size={size} onDark={onDark} />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <LogoMark size={s.mark} />
      <Wordmark size={size} onDark={onDark} />
    </div>
  );
}
