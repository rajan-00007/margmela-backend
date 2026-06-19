import { colors } from './colors';
import { typography } from './typography';

export const theme = {
  colors,
  typography,
  gradients: {
    primary: 'linear-gradient(135deg, #0052F7 0%, #6366f1 100%)',
    glow: 'linear-gradient(185deg, rgba(34, 211, 238, 0.15) 0%, rgba(99, 102, 241, 0.02) 100%)',
    neonBorder: 'linear-gradient(to right, #22d3ee, #6366f1)',
    cardGlow: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
  },
  shadows: {
    card: '0 4px 20px 0 rgba(0, 0, 0, 0.5)',
    glow: '0 0 15px rgba(34, 211, 238, 0.25)',
    button: '0 2px 10px rgba(0, 82, 247, 0.3)',
    glowCyan: '0 0 15px rgba(34, 211, 238, 0.3)',
    glowIndigo: '0 0 15px rgba(99, 102, 241, 0.3)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.25s ease',
    slow: '0.35s ease',
  }
} as const;

export type AppTheme = typeof theme;
