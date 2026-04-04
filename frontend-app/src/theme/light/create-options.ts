import type { ThemeOptions } from '@mui/material/styles';
import { colorTokens } from '@/theme/colors';

export function createLightOptions(): ThemeOptions {
  return {
    palette: {
      mode: 'light',
      background: { default: colorTokens.bg, paper: colorTokens.card },
      text: { primary: colorTokens.text, secondary: colorTokens.text2, disabled: colorTokens.text3 },
      primary: { main: colorTokens.accent, dark: colorTokens.accent2, light: '#E07A45', contrastText: '#fff' },
      secondary: { main: colorTokens.blue, dark: '#163A80', light: '#4A72C4', contrastText: '#fff' },
      info: { main: colorTokens.teal },
      warning: { main: colorTokens.amber },
      error: { main: '#B91C1C' },
      success: { main: colorTokens.green },
      divider: colorTokens.border,
    },
  };
}
