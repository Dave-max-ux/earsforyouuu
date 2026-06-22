/** Chat-specific design tokens — light mode uses the premium green palette */
export const chatTheme = {
  colors: {
    primary: '#2E7D32',
    primaryHover: '#1B5E20',
    accentSoft: '#A5D6A7',
    bgTint: '#F0FDF4',
    success: '#22C55E',
    textOnGreen: '#FFFFFF',
    textPrimary: '#0F2E23',
    textSecondary: '#356A53',
    textMuted: '#6F9984',
    surface: '#FFFFFF',
    border: '#D4EAE0',
    shadow: 'rgba(46, 125, 50, 0.08)',
    error: '#EF4444',
    errorBg: '#FEF2F2',
  },
  radii: {
    card: '1.5rem',
    bubble: '1rem',
    input: '0.875rem',
    button: '0.875rem',
  },
  spacing: {
    header: '1rem',
    messageGap: '0.75rem',
    inputPadding: '0.875rem',
  },
  animation: {
    bubbleDuration: '0.35s',
    fadeDuration: '0.25s',
  },
  input: {
    maxLength: 2000,
  },
} as const;

export type ChatTheme = typeof chatTheme;
