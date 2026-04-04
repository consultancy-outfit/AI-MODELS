'use client';

import { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { createAppTheme } from '@/theme/theme';
import { useSettings } from '@/consumers/settings-consumer';

function ThemeConsumer({ children }: { children: React.ReactNode }) {
  const { paletteMode } = useSettings();
  const theme = useMemo(() => createAppTheme(paletteMode), [paletteMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeConsumer>{children}</ThemeConsumer>
    </AppRouterCacheProvider>
  );
}
