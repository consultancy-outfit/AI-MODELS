import { alpha } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { colorTokens, glassTokens, shadowTokens } from '@/theme/colors';

export function createBaseOptions(): ThemeOptions {
  return {
    typography: {
      fontFamily: 'var(--font-instrument), sans-serif',
      h1: { fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, fontSize: '3rem', lineHeight: 1.15, letterSpacing: '-0.04em' },
      h2: { fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, fontSize: '2.25rem', lineHeight: 1.2, letterSpacing: '-0.03em' },
      h3: { fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.25, letterSpacing: '-0.025em' },
      h4: { fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, fontSize: '1.375rem', lineHeight: 1.3, letterSpacing: '-0.02em' },
      h5: { fontFamily: 'var(--font-syne), sans-serif', fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4, letterSpacing: '-0.015em' },
      h6: { fontFamily: 'var(--font-syne), sans-serif', fontWeight: 600, fontSize: '1rem', lineHeight: 1.4, letterSpacing: '-0.01em' },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.6 },
      button: { fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'none' },
      caption: { fontSize: '0.75rem', lineHeight: 1.5 },
      overline: { fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' },
    },
    shape: { borderRadius: 12 },
    shadows: [
      'none',
      shadowTokens.card, shadowTokens.card, shadowTokens.card, shadowTokens.card,
      shadowTokens.md, shadowTokens.md, shadowTokens.md, shadowTokens.md,
      shadowTokens.lg, shadowTokens.lg, shadowTokens.lg, shadowTokens.lg,
      shadowTokens.elevated, shadowTokens.elevated, shadowTokens.elevated,
      shadowTokens.elevated, shadowTokens.elevated, shadowTokens.elevated,
      shadowTokens.elevated, shadowTokens.elevated, shadowTokens.elevated,
      shadowTokens.elevated, shadowTokens.elevated, shadowTokens.elevated,
    ],
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 24, fontFamily: 'var(--font-instrument), sans-serif', fontWeight: 500, textTransform: 'none' },
          containedPrimary: {
            background: `linear-gradient(135deg, ${colorTokens.accent}, ${colorTokens.accent2})`,
            boxShadow: `0 6px 18px ${alpha(colorTokens.accent, 0.28)}`,
            '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 10px 26px ${alpha(colorTokens.accent, 0.36)}` },
            transition: 'all 0.2s ease',
          },
          outlinedPrimary: {
            borderColor: colorTokens.border2,
            '&:hover': { borderColor: colorTokens.accent, backgroundColor: colorTokens.accentLt },
          },
          sizeSmall: { padding: '0.35rem 1rem', fontSize: '0.8125rem' },
          sizeMedium: { padding: '0.55rem 1.25rem' },
          sizeLarge: { padding: '0.75rem 1.75rem', fontSize: '1rem' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${colorTokens.border}`,
            boxShadow: shadowTokens.card,
            transition: 'transform 0.22s ease, box-shadow 0.22s ease',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: shadowTokens.md },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 20, fontFamily: 'var(--font-instrument), sans-serif', fontWeight: 500 },
          sizeSmall: { fontSize: '0.7rem', height: 22 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            ...glassTokens,
            boxShadow: `0 1px 0 ${colorTokens.border}`,
            color: colorTokens.text,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: 'rgba(244,242,238,0.92)',
            backdropFilter: 'blur(14px)',
            borderRight: `1px solid ${colorTokens.border}`,
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colorTokens.accent, borderWidth: 1.5 },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            ...glassTokens,
            border: `1px solid ${colorTokens.border}`,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: 'rgba(28,26,22,0.9)',
            borderRadius: 7,
            fontSize: '0.72rem',
            padding: '0.3rem 0.75rem',
          },
        },
      },
      MuiSkeleton: {
        defaultProps: { animation: 'wave' },
        styleOverrides: { root: { backgroundColor: alpha(colorTokens.text, 0.06), borderRadius: 8 } },
      },
    },
  };
}
