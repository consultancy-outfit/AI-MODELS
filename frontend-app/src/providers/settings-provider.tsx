'use client';

import { useMemo, useState } from 'react';
import { SettingsContext } from '@/context/settings-context';
import { PALETTE_MODE, type PaletteMode } from '@/constants/strings';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [paletteMode, setPaletteMode] = useState<PaletteMode>(PALETTE_MODE.LIGHT);

  const value = useMemo(
    () => ({
      paletteMode,
      onChangePaletteMode: (mode: PaletteMode) => setPaletteMode(mode),
    }),
    [paletteMode]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}
