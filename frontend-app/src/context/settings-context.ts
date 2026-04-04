import { createContext } from 'react';
import type { PaletteMode } from '@/constants/strings';

export type SettingsContextValue = {
  paletteMode: PaletteMode;
  onChangePaletteMode: (mode: PaletteMode) => void;
};

export const SettingsContext = createContext<SettingsContextValue>({
  paletteMode: 'light',
  onChangePaletteMode: () => undefined,
});
