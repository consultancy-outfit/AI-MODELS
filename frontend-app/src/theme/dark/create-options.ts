import type { ThemeOptions } from '@mui/material/styles';
import { colorTokens } from '@/theme/colors';

export function createDarkOptions(): ThemeOptions {
  return {
    palette: {
      mode: 'dark',
      background: { default: '#141210', paper: '#1E1C18' },
      text: { primary: '#F0EDE8', secondary: '#A09D96', disabled: '#6A6760' },
      primary: { main: colorTokens.accent, dark: colorTokens.accent2, light: '#E07A45', contrastText: '#fff' },
      secondary: { main: colorTokens.blue, dark: '#163A80', light: '#4A72C4', contrastText: '#fff' },
      info: { main: colorTokens.teal },
      warning: { main: colorTokens.amber },
      error: { main: '#EF4444' },
      success: { main: colorTokens.green },
      divider: 'rgba(255,255,255,0.1)',
    },
  };
}
