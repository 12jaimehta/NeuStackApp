
export const theme = {
  colors: {
    primary: 'hsl(50 100% 54%)',
    primaryForeground: 'hsl(190 6% 6%)',
    secondary: 'hsl(36 100% 55%)',
    accent: 'hsl(189 100% 26%)',
    destructive: 'hsl(12 95% 35%)',
    warning: 'hsl(38 92% 50%)',

    background: 'hsl(180 16% 93%)',
    card: 'hsl(0 0% 100%)',
    border: 'hsl(210 14% 89%)',
    muted: 'hsl(210 16% 93%)',
    mutedForeground: 'hsl(190 3% 40%)',

    foreground: 'hsl(190 6% 6%)',
    cardForeground: 'hsl(190 6% 6%)',
  },

  typography: {
    fontFamily: "'Inter', 'system-ui', sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.3)',
    md: '0 4px 12px rgba(0,0,0,0.4)',
    lg: '0 8px 24px rgba(0,0,0,0.5)',
    glow: '0 0 20px rgba(139, 92, 246, 0.3)',
    glowBlue: '0 0 20px rgba(59, 130, 246, 0.3)',
  },

  transitions: {
    fast: 'all 0.15s ease',
    base: 'all 0.2s ease',
    slow: 'all 0.3s ease',
  },
} as const;

export type Theme = typeof theme;
