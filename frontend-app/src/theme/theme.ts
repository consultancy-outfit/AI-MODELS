'use client';
import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@/constants/strings';
import { createBaseOptions } from './base/create-options';
import { createLightOptions } from './light/create-options';
import { createDarkOptions } from './dark/create-options';

export function createAppTheme(mode: PaletteMode = 'light') {
  const baseOptions = createBaseOptions();
  const modeOptions = mode === 'dark' ? createDarkOptions() : createLightOptions();

  return createTheme({
    ...baseOptions,
    ...modeOptions,
    palette: {
      ...modeOptions.palette,
    },
    components: {
      ...baseOptions.components,
    },
  });
}

// Default light theme for backward compatibility
export const theme = createAppTheme('light');
